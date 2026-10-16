/* ============================================================
   Relais « Mes Maillots » · worker.js v4 · sans IA
   Secrets à créer dans Settings → Variables and Secrets :
     CODE_SECRET   (obligatoire) : même mot de passe que dans l'appli
     SERPAPI_KEY   (obligatoire) : clé serpapi.com
     EBAY_CLIENT_ID / EBAY_CLIENT_SECRET (facultatifs)
   Liaison à créer dans Settings → Bindings :
     KV namespace, nom de variable PHOTOS → maillots-photos
   ============================================================ */

const VERSION = 4;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, CORS)
  });
}
function erreur(msg, status) { return json({ erreur: msg }, status || 400); }

async function sha256(texte) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function appeler(url, options) {
  const o = Object.assign({}, options || {});
  o.signal = AbortSignal.timeout(20000);
  return fetch(url, o);
}
async function lireJson(rep) { try { return await rep.json(); } catch (e) { return null; } }
function attendre(ms) { return new Promise(r => setTimeout(r, ms)); }

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const url = new URL(request.url);

    if (request.method === 'GET') {
      const m = url.pathname.match(/^\/photo\/([a-z0-9-]+)$/i);
      if (m) return servirPhoto(m[1], env);
      return json({ ok: true, message: 'Relais Mes Maillots v' + VERSION + ' en service. Utilise l’appli pour t’en servir.' });
    }
    if (request.method !== 'POST') return erreur('Méthode non autorisée.', 405);

    let corps;
    try { corps = await request.json(); } catch (e) { return erreur('Requête illisible (JSON attendu).'); }
    const action = String(corps.action || '');

    if (!env.CODE_SECRET) return erreur('Secret CODE_SECRET manquant sur le Worker (Settings → Variables and Secrets).', 500);
    if (String(corps.code || '') !== env.CODE_SECRET) return erreur('Code secret incorrect.', 401);

    try {
      switch (action) {
        case 'test': return json(await tester(env));
        case 'lens': return json(await lens(corps, env, url.origin));
        case 'annonces': return json(await annonces(corps, env));
        case 'ebay': return json(await ebay(corps, env));
        default: return erreur('Action inconnue : ' + action);
      }
    } catch (e) {
      const msg = (e && e.name === 'TimeoutError') ? 'Le service distant ne répond pas (délai dépassé).' : ((e && e.message) || 'Erreur inconnue.');
      return erreur(msg, 500);
    }
  }
};

/* ---------- Photo temporaire (lue par Google Lens) ---------- */
async function servirPhoto(id, env) {
  if (!env.PHOTOS) return new Response('Liaison KV PHOTOS manquante.', { status: 500 });
  let data = null;
  for (let i = 0; i < 6 && !data; i++) {
    data = await env.PHOTOS.get('p:' + id);
    if (!data) await attendre(1500);
  }
  if (!data) return new Response('Photo introuvable ou expirée.', { status: 404 });
  const m = data.match(/^data:(image\/[a-z0-9+.-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return new Response('Photo invalide.', { status: 400 });
  const bin = atob(m[2]);
  const octets = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) octets[i] = bin.charCodeAt(i);
  return new Response(octets, { headers: { 'Content-Type': m[1], 'Cache-Control': 'public, max-age=600' } });
}

/* ---------- Test ---------- */
async function tester(env) {
  const res = { ok: true, version: VERSION, serpapi: false, lens: false, ebay: false, details: [] };
  if (!env.SERPAPI_KEY) res.details.push('Clé SerpApi manquante (secret SERPAPI_KEY).');
  else {
    try {
      const rep = await appeler('https://serpapi.com/account.json?api_key=' + encodeURIComponent(env.SERPAPI_KEY));
      const j = await lireJson(rep);
      if (rep.ok && j && !j.error) {
        res.serpapi = true;
        res.details.push('SerpApi : ' + (j.plan_searches_left != null ? j.plan_searches_left + ' recherches restantes ce mois.' : 'clé valide.'));
      } else res.details.push('SerpApi : clé refusée (' + ((j && j.error) || rep.status) + ').');
    } catch (e) { res.details.push('SerpApi : injoignable.'); }
  }
  if (!env.PHOTOS) res.details.push('Liaison KV « PHOTOS » manquante : Lens impossible.');
  res.lens = res.serpapi && !!env.PHOTOS;
  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) res.details.push('eBay non configuré (facultatif).');
  else {
    try { await jetonEbay(env, true); res.ebay = true; }
    catch (e) { res.details.push('eBay : ' + e.message); }
  }
  return res;
}

/* ---------- Google Lens (SerpApi) ---------- */
async function lens(corps, env, origine) {
  if (!env.SERPAPI_KEY) throw new Error('Clé SerpApi manquante (secret SERPAPI_KEY).');
  if (!env.PHOTOS) throw new Error('Liaison KV « PHOTOS » manquante (Settings → Bindings).');
  const image = String(corps.image || '');
  if (!image.startsWith('data:image/')) throw new Error('Image manquante ou invalide.');
  if (image.length > 3000000) throw new Error('Image trop lourde.');

  const empreinte = await sha256(image);
  const enCache = await env.PHOTOS.get('lens:' + empreinte, 'json');
  if (enCache) return { resultats: enCache, cache: true, serpapi_utilise: false };

  const id = crypto.randomUUID();
  await env.PHOTOS.put('p:' + id, image, { expirationTtl: 600 });
  await attendre(1000);
  const urlPhoto = origine + '/photo/' + id;

  // Si SerpApi se plaint du paramètre « country », supprime la ligne country: 'fr',
  const p = new URLSearchParams({
    engine: 'google_lens',
    url: urlPhoto,
    type: 'visual_matches',
    hl: 'fr',
    country: 'fr',
    api_key: env.SERPAPI_KEY
  });
  const rep = await appeler('https://serpapi.com/search.json?' + p.toString());
  const j = await lireJson(rep);
  if (!j) throw new Error('Réponse SerpApi illisible (HTTP ' + rep.status + ').');
  if (j.error) {
    if (/hasn't returned any results|no results/i.test(j.error)) return { resultats: [], cache: false, serpapi_utilise: true };
    throw new Error('SerpApi : ' + j.error);
  }

  const vus = new Set();
  const resultats = [];
  (j.visual_matches || []).forEach(v => {
    const titre = String(v.title || '').trim();
    if (!titre) return;
    const cle = titre.toLowerCase();
    if (vus.has(cle)) return;
    vus.add(cle);
    let prix = '';
    if (v.price) prix = (typeof v.price === 'object') ? String(v.price.value || '') : String(v.price);
    resultats.push({ titre: titre, lien: v.link || '', source: v.source || '', prix: prix });
  });
  const final = resultats.slice(0, 60);
  await env.PHOTOS.put('lens:' + empreinte, JSON.stringify(final), { expirationTtl: 604800 });
  return { resultats: final, cache: false, serpapi_utilise: true };
}

/* ---------- Annonces Vinted / Leboncoin (SerpApi Google) ---------- */
async function annonces(corps, env) {
  if (!env.SERPAPI_KEY) throw new Error('Clé SerpApi manquante (secret SERPAPI_KEY).');
  const q = String(corps.q || '').trim();
  if (!q) throw new Error('Recherche vide.');
  const requete = q + ' (site:vinted.fr OR site:leboncoin.fr)';
  const cle = 'ann:' + await sha256(requete.toLowerCase());
  if (env.PHOTOS) {
    const c = await env.PHOTOS.get(cle, 'json');
    if (c) return { annonces: c, cache: true, serpapi_utilise: false };
  }
  const p = new URLSearchParams({
    engine: 'google', q: requete, hl: 'fr', gl: 'fr', google_domain: 'google.fr', num: '20', api_key: env.SERPAPI_KEY
  });
  const rep = await appeler('https://serpapi.com/search.json?' + p.toString());
  const j = await lireJson(rep);
  if (!j) throw new Error('Réponse SerpApi illisible (HTTP ' + rep.status + ').');
  if (j.error) {
    if (/hasn't returned any results|no results/i.test(j.error)) return { annonces: [], cache: false, serpapi_utilise: true };
    throw new Error('SerpApi : ' + j.error);
  }
  const liste = (j.organic_results || []).map(r => {
    let domaine = '';
    try { domaine = new URL(r.link).hostname.replace(/^www\./, ''); } catch (e) { /* ignore */ }
    const rs = r.rich_snippet || {};
    const ext = (rs.top && rs.top.detected_extensions) || (rs.bottom && rs.bottom.detected_extensions) || {};
    return { titre: r.title || '', lien: r.link || '', extrait: r.snippet || '', prix: (ext.price != null ? ext.price : ''), source: domaine };
  });
  if (env.PHOTOS) await env.PHOTOS.put(cle, JSON.stringify(liste), { expirationTtl: 86400 });
  return { annonces: liste, cache: false, serpapi_utilise: true };
}

/* ---------- eBay Browse API (facultatif, gratuit) ---------- */
let jetonMemoire = null;

async function jetonEbay(env, forcer) {
  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) throw new Error('eBay non configuré (EBAY_CLIENT_ID / EBAY_CLIENT_SECRET manquants, facultatif).');
  if (!forcer) {
    if (jetonMemoire && jetonMemoire.expire > Date.now()) return jetonMemoire.valeur;
    if (env.PHOTOS) { const t = await env.PHOTOS.get('ebay:token'); if (t) return t; }
  }
  const rep = await appeler('https://api.ebay.com/identity/v1/oauth2/v2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(env.EBAY_CLIENT_ID + ':' + env.EBAY_CLIENT_SECRET)
    },
    body: 'grant_type=client_credentials&scope=' + encodeURIComponent('https://api.ebay.com/oauth/api_scope')
  });
  const j = await lireJson(rep);
  if (!rep.ok || !j || !j.access_token) throw new Error('Connexion eBay refusée (vérifie EBAY_CLIENT_ID / EBAY_CLIENT_SECRET, clés Production).');
  const duree = Math.max(60, (j.expires_in || 7200) - 120);
  jetonMemoire = { valeur: j.access_token, expire: Date.now() + duree * 1000 };
  if (env.PHOTOS) await env.PHOTOS.put('ebay:token', j.access_token, { expirationTtl: duree });
  return j.access_token;
}

async function ebay(corps, env) {
  const q = String(corps.q || '').trim();
  if (!q) throw new Error('Recherche vide.');
  let jeton = await jetonEbay(env, false);
  const chercher = (t) => appeler('https://api.ebay.com/buy/browse/v1/item_summary/search?' + new URLSearchParams({ q: q, limit: '40' }).toString(), {
    headers: { 'Authorization': 'Bearer ' + t, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR', 'Accept-Language': 'fr-FR' }
  });
  let rep = await chercher(jeton);
  if (rep.status === 401) { jeton = await jetonEbay(env, true); rep = await chercher(jeton); }
  const j = await lireJson(rep);
  if (!rep.ok || !j) {
    const detail = j && j.errors && j.errors[0] && j.errors[0].message;
    throw new Error('eBay : ' + (detail || ('erreur HTTP ' + rep.status)));
  }
  const liste = (j.itemSummaries || []).map(i => {
    const prix = (i.price && i.price.currency === 'EUR') ? Number(i.price.value) : null;
    return { titre: i.title || '', lien: i.itemWebUrl || '', prix: (prix != null && isFinite(prix)) ? prix : '', extrait: i.condition || '', source: 'eBay' };
  }).filter(a => a.prix !== '');
  return { annonces: liste, serpapi_utilise: false };
}
