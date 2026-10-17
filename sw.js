/* Mes Maillots — service worker v12 */
const CACHE='mes-maillots-v12';
const FICHIERS=['./','./index.html','./app.js','./manifest.json'];

self.addEventListener('install',e=>{
 self.skipWaiting();
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FICHIERS)).catch(()=>{}));
});

self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{
  const cles=await caches.keys();
  await Promise.all(cles.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});

self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 e.respondWith((async()=>{
  try{
   const rep=await fetch(req);
   if(rep&&rep.ok){const c=await caches.open(CACHE);c.put(req,rep.clone()).catch(()=>{})}
   return rep;
  }catch(err){
   const enCache=await caches.match(req);
   if(enCache)return enCache;
   const accueil=await caches.match('./index.html');
   if(accueil)return accueil;
   return new Response('Hors ligne',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
 })());
});
