'use strict';
(function(){
const VERSION='3.4';
const QUOTA_MAX=250;

/* ===================== UTILITAIRES ===================== */
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const euros=n=>(n==null||n===''||isNaN(n))?'—':Math.round(+n).toLocaleString('fr-FR')+' €';
const lire=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const ecrire=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const hash=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};
const dateFr=ts=>ts?new Date(ts).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
const saisonCourte=s=>{const m=String(s||'').match(/(\d{2})(\d{2})/);return m?m[2]:''};
const K={col:'mm_collection',wish:'mm_wishlist',params:'mm_params',quota:'mm_quota',notifs:'mm_notifs_lus',veille:'mm_veille',wiki:'mm_wiki',img:'mm_img'};

/* ===================== LISTES ===================== */
const VERSIONS=['Replica','Authentic','Porté en match','Autre'];
const CATEGORIES=['Domicile','Extérieur','Third','Gardien','Spécial','Autre'];
const TAILLES=['XS','S','M','L','XL','XXL','Enfant','Autre'];
const ETATS=['Neuf avec étiquette','Excellent','Bon','Correct','Usé'];
const COULEURS=[['Blanc','#ffffff'],['Noir','#111111'],['Rouge','#c8102e'],['Bleu','#1b3a8a'],['Bleu marine','#0f1f4b'],['Bleu ciel','#6cabdd'],['Vert','#1b8a3c'],['Jaune','#f9d548'],['Orange','#f26a1b'],['Violet','#5a2d91'],['Rose','#f4a7c4'],['Gris','#8a8a8a'],['Bordeaux','#7a1f1f'],['Or','#c9a227'],['Multicolore','#1d3b2f']];
const couleurHex=n=>(COULEURS.find(c=>c[0]===n)||[])[1];
const MARQUES=['Nike','Adidas','Puma','Umbro','Kappa','Macron','Hummel','Joma','New Balance','Le Coq Sportif','Lotto','Diadora','Reebok','Castore','Erreà','Uhlsport','Mizuno','Warrior','Asics','Fila','Score Draw','Admiral','Patrick','Duarig','Kelme','Meyba','Pony','Under Armour','Legea','Zeus','Givova','Craft','Jako','Burrda','Airness','ABA Sport','Athleta'];

/* Sélections : Nom|iso flagcdn (ou #c1/#c2 si pas de drapeau)|alias (noms étrangers compris) */
const SELECTIONS_BRUT=`
France|fr|Les Bleus,FFF,Equipe de France,Frankreich,Francia
Allemagne|de|Germany,DFB,Deutschland,Alemania,Germania
Angleterre|gb-eng|England,Three Lions,Inglaterra,Inghilterra
Écosse|gb-sct|Scotland,Schottland,Escocia
Pays de Galles|gb-wls|Wales,Cymru
Irlande du Nord|gb-nir|Northern Ireland
Irlande|ie|Ireland,Republic of Ireland,Eire,Irland,Irlanda
Espagne|es|Spain,España,La Roja,Spanien,Spagna
Italie|it|Italy,Italia,Azzurri,Squadra Azzurra,Italien
Portugal|pt|Seleção das Quinas,Portogallo
Pays-Bas|nl|Netherlands,Holland,Hollande,KNVB,Oranje,Niederlande,Holanda,Olanda
Belgique|be|Belgium,België,Diables Rouges,Belgien,Belgica,Belgio
Suisse|ch|Switzerland,Schweiz,Nati,Suiza,Svizzera
Autriche|at|Austria,Österreich,Osterreich
Danemark|dk|Denmark,Danmark,Dänemark,Dinamarca,Danimarca
Suède|se|Sweden,Sverige,Schweden,Suecia,Svezia
Norvège|no|Norway,Norge,NFF,Norwegen,Noruega,Norvegia,Noreg
Finlande|fi|Finland,Suomi,Finnland,Finlandia
Islande|is|Iceland,Islandia
Pologne|pl|Poland,Polska,Polen,Polonia
République tchèque|cz|Czech Republic,Czechia,Tchéquie,Tschechien
Slovaquie|sk|Slovakia
Hongrie|hu|Hungary,Magyar,Ungarn,Hungria,Ungheria
Roumanie|ro|Romania
Bulgarie|bg|Bulgaria
Grèce|gr|Greece,Hellas,Griechenland,Grecia
Turquie|tr|Turkey,Türkiye,Turkei,Turquia,Turchia
Croatie|hr|Croatia,Hrvatska,Vatreni,Kroatien,Croacia,Croazia
Serbie|rs|Serbia,Srbija
Slovénie|si|Slovenia
Bosnie-Herzégovine|ba|Bosnia,Bosnie
Monténégro|me|Montenegro
Macédoine du Nord|mk|North Macedonia,Macédoine
Albanie|al|Albania
Kosovo|xk
Ukraine|ua|Ukraina
Russie|ru|Russia,Russland,Rusia
Biélorussie|by|Belarus
Moldavie|md|Moldova
Géorgie|ge|Georgia
Arménie|am|Armenia
Azerbaïdjan|az|Azerbaijan
Kazakhstan|kz
Estonie|ee|Estonia
Lettonie|lv|Latvia
Lituanie|lt|Lithuania
Luxembourg|lu
Malte|mt|Malta
Chypre|cy|Cyprus
Israël|il|Israel
Îles Féroé|fo|Faroe Islands,Féroé
Gibraltar|gi
Andorre|ad|Andorra
Saint-Marin|sm|San Marino
Liechtenstein|li
Monaco|mc
Brésil|br|Brazil,Brasil,Seleção,CBF,Brasilien,Brasile
Argentine|ar|Argentina,AFA,Albiceleste,Argentinien
Uruguay|uy|Celeste
Chili|cl|Chile
Colombie|co|Colombia,Kolumbien
Pérou|pe|Peru
Équateur|ec|Ecuador
Paraguay|py
Bolivie|bo|Bolivia
Venezuela|ve|Vinotinto
États-Unis|us|USA,United States,USMNT,Estados Unidos
Mexique|mx|Mexico,El Tri,Mexiko,México
Canada|ca
Costa Rica|cr
Honduras|hn
Panama|pa
Jamaïque|jm|Jamaica,Reggae Boyz
Salvador|sv|El Salvador
Guatemala|gt
Haïti|ht|Haiti
Trinité-et-Tobago|tt|Trinidad
Cuba|cu
Curaçao|cw|Curacao
Nicaragua|ni
Surinam|sr|Suriname
République dominicaine|do|Dominican Republic
Bermudes|bm|Bermuda
Guyana|gy
Belize|bz
Porto Rico|pr|Puerto Rico
Martinique|mq
Guadeloupe|gp
Guyane|gf|Guyane française
Maroc|ma|Morocco,Lions de l'Atlas,Marokko,Marruecos,Marocco
Algérie|dz|Algeria,Fennecs,Algerien,Argelia
Tunisie|tn|Tunisia,Aigles de Carthage,Tunesien
Égypte|eg|Egypt,Pharaons,Egipto,Egitto
Libye|ly|Libya
Sénégal|sn|Senegal,Lions de la Teranga
Cameroun|cm|Cameroon,Lions Indomptables,Kamerun,Camerun
Côte d'Ivoire|ci|Ivory Coast,Éléphants
Nigeria|ng|Super Eagles
Ghana|gh|Black Stars
Mali|ml|Aigles du Mali
Guinée|gn|Guinea,Syli
Burkina Faso|bf|Étalons
Afrique du Sud|za|South Africa,Bafana Bafana
RD Congo|cd|Congo Kinshasa,Léopards,DR Congo
Congo|cg|Congo Brazzaville
Gabon|ga|Panthères
Togo|tg|Éperviers
Bénin|bj|Benin
Niger|ne
Tchad|td|Chad
Centrafrique|cf|République centrafricaine
Guinée équatoriale|gq|Equatorial Guinea
Guinée-Bissau|gw|Guinea-Bissau
Cap-Vert|cv|Cape Verde,Cabo Verde
Gambie|gm|Gambia
Sierra Leone|sl
Liberia|lr
Mauritanie|mr|Mauritania
Soudan|sd|Sudan
Soudan du Sud|ss|South Sudan
Éthiopie|et|Ethiopia
Érythrée|er|Eritrea
Djibouti|dj
Somalie|so|Somalia
Kenya|ke|Harambee Stars
Ouganda|ug|Uganda
Tanzanie|tz|Tanzania
Rwanda|rw
Burundi|bi
Angola|ao
Zambie|zm|Zambia,Chipolopolo
Zimbabwe|zw
Mozambique|mz
Malawi|mw
Namibie|na|Namibia
Botswana|bw
Eswatini|sz|Swaziland
Lesotho|ls
Madagascar|mg|Barea
Maurice|mu|Mauritius
Seychelles|sc
Comores|km|Comoros
São Tomé-et-Príncipe|st|Sao Tome
Japon|jp|Japan,Nippon,Samurai Blue,Giappone
Corée du Sud|kr|South Korea,Korea Republic,Corée,Südkorea
Corée du Nord|kp|North Korea
Chine|cn|China,Cina
Australie|au|Australia,Socceroos
Iran|ir|Team Melli
Irak|iq|Iraq
Arabie saoudite|sa|Saudi Arabia
Qatar|qa
Émirats arabes unis|ae|UAE,United Arab Emirates
Ouzbékistan|uz|Uzbekistan
Jordanie|jo|Jordan
Syrie|sy|Syria
Liban|lb|Lebanon
Palestine|ps
Oman|om
Koweït|kw|Kuwait
Bahreïn|bh|Bahrain
Yémen|ye|Yemen
Inde|in|India
Thaïlande|th|Thailand
Vietnam|vn|Viêt Nam
Indonésie|id|Indonesia
Malaisie|my|Malaysia
Singapour|sg|Singapore
Philippines|ph
Hong Kong|hk
Taïwan|tw|Taiwan,Chinese Taipei
Kirghizistan|kg|Kyrgyzstan
Tadjikistan|tj|Tajikistan
Turkménistan|tm|Turkmenistan
Afghanistan|af
Pakistan|pk
Bangladesh|bd
Sri Lanka|lk
Népal|np|Nepal
Myanmar|mm|Birmanie
Cambodge|kh|Cambodia
Laos|la
Mongolie|mn|Mongolia
Maldives|mv
Bhoutan|bt|Bhutan
Brunei|bn
Timor oriental|tl|Timor-Leste
Macao|mo|Macau
Guam|gu
Nouvelle-Zélande|nz|New Zealand,All Whites
Fidji|fj|Fiji
Tahiti|pf|Polynésie française
Nouvelle-Calédonie|nc|New Caledonia
Papouasie-Nouvelle-Guinée|pg|Papua New Guinea
Îles Salomon|sb|Solomon Islands
Vanuatu|vu
Samoa|ws
Tonga|to
Îles Cook|ck|Cook Islands
Réunion|re|La Réunion
Groenland|gl|Greenland
URSS|#c8102e/#f5d000|CCCP,Union soviétique,Soviet Union
Yougoslavie|#1b3a8a/#c8102e|Yugoslavia,Jugoslavija
Tchécoslovaquie|#c8102e/#ffffff|Czechoslovakia
RDA|#1b3a8a/#ffffff|Allemagne de l'Est,DDR,East Germany
RFA|#ffffff/#1a1a1a|Allemagne de l'Ouest,West Germany
Zaïre|#1b8a3c/#f9d548|Zaire
Catalogne|es-ct|Catalunya,Catalonia
Pays basque|es-pv|Euskadi,Euskal Herria
Galice|es-ga|Galicia
Bretagne|#000000/#ffffff|Breizh,Brittany
Corse|#ffffff/#000000|Corsica,Squadra Corsa
Québec|#1b3a8a/#ffffff|Quebec
Occitanie|#c8102e/#f9d548|Occitania
Kurdistan|#c8102e/#f9d548
Tibet|#c8102e/#f9d548
`;

/* Clubs : Nom|Pays|c1|c2|motif|alias  (motifs : uni, rayures, cerceaux, moitie, diag, manches, bande, bandev, damier) */
const CLUBS_BRUT=`
Paris Saint-Germain|France|#1b3a8a|#c8102e|bandev|PSG,Paris SG,Paris
Olympique de Marseille|France|#ffffff|#1fa0d6|uni|OM,Marseille
Olympique Lyonnais|France|#ffffff|#1b3a8a|diag|OL,Lyon
AS Monaco|France|#c8102e|#ffffff|diag|Monaco,ASM
LOSC Lille|France|#c8102e|#1b3a8a|uni|Lille,LOSC
OGC Nice|France|#c8102e|#000000|rayures|Nice,OGCN
RC Lens|France|#f9d548|#c8102e|moitie|Lens,RCL
Stade Rennais|France|#c8102e|#000000|rayures|Rennes,SRFC
FC Nantes|France|#f9d548|#1b8a3c|uni|Nantes,FCN,Canaris
Girondins de Bordeaux|France|#1b3a8a|#ffffff|bandev|Bordeaux,FCGB
AS Saint-Étienne|France|#1b8a3c|#ffffff|uni|ASSE,Saint-Etienne,Sainté,Les Verts
RC Strasbourg|France|#1b3a8a|#ffffff|uni|Strasbourg,RCSA
Montpellier HSC|France|#1b3a8a|#f26a1b|uni|Montpellier,MHSC
Toulouse FC|France|#5a2d91|#ffffff|uni|Toulouse,TFC,Téfécé
Stade de Reims|France|#c8102e|#ffffff|uni|Reims
Stade Brestois|France|#c8102e|#ffffff|rayures|Brest,SB29
FC Lorient|France|#f26a1b|#000000|uni|Lorient,Merlus
AJ Auxerre|France|#ffffff|#1b3a8a|uni|Auxerre,AJA
FC Metz|France|#7a1f1f|#ffffff|uni|Metz,Grenats
Le Havre AC|France|#1fa0d6|#1b3a8a|cerceaux|Le Havre,HAC
Angers SCO|France|#000000|#ffffff|rayures|Angers,SCO
SM Caen|France|#1b3a8a|#c8102e|uni|Caen,Stade Malherbe
EA Guingamp|France|#c8102e|#000000|uni|Guingamp,EAG
AS Nancy-Lorraine|France|#c8102e|#ffffff|uni|Nancy,ASNL
FC Sochaux|France|#f9d548|#1b3a8a|uni|Sochaux,FCSM
SC Bastia|France|#1fa0d6|#ffffff|uni|Bastia,SCB
Paris FC|France|#1b3a8a|#ffffff|uni|PFC
Red Star|France|#1b8a3c|#ffffff|uni|Red Star FC,Saint-Ouen
Amiens SC|France|#ffffff|#1a1a1a|uni|Amiens,ASC
Clermont Foot|France|#c8102e|#1b3a8a|uni|Clermont,CF63
ESTAC Troyes|France|#1b3a8a|#ffffff|uni|Troyes,ESTAC
Valenciennes FC|France|#c8102e|#ffffff|uni|Valenciennes,VAFC
Dijon FCO|France|#c8102e|#ffffff|uni|Dijon,DFCO
Grenoble Foot|France|#1b3a8a|#ffffff|uni|Grenoble,GF38
Nîmes Olympique|France|#c8102e|#ffffff|uni|Nîmes,Nimes,Crocos
Le Mans FC|France|#c8102e|#f9d548|uni|Le Mans,MUC 72
AC Ajaccio|France|#c8102e|#ffffff|uni|Ajaccio,ACA
CS Sedan|France|#1b8a3c|#c8102e|uni|Sedan,Sangliers
Stade Lavallois|France|#f26a1b|#000000|uni|Laval
LB Châteauroux|France|#c8102e|#1b3a8a|uni|Châteauroux,Chateauroux
Chamois Niortais|France|#1b3a8a|#ffffff|uni|Niort
Pau FC|France|#f9d548|#1b8a3c|uni|Pau
Rodez AF|France|#c8102e|#f9d548|uni|Rodez,RAF
USL Dunkerque|France|#1fa0d6|#ffffff|uni|Dunkerque
FC Annecy|France|#c8102e|#ffffff|uni|Annecy
FC Martigues|France|#f9d548|#1b3a8a|uni|Martigues
US Concarneau|France|#1fa0d6|#ffffff|uni|Concarneau
Manchester United|Angleterre|#c8102e|#000000|uni|Man Utd,Man United,MUFC,Red Devils
Manchester City|Angleterre|#6cabdd|#ffffff|uni|Man City,MCFC,City
Liverpool FC|Angleterre|#c8102e|#ffffff|uni|Liverpool,LFC,Reds
Arsenal|Angleterre|#c8102e|#ffffff|manches|Gunners,AFC Arsenal
Chelsea|Angleterre|#1b3a8a|#ffffff|uni|CFC,Chelsea FC,Blues
Tottenham Hotspur|Angleterre|#ffffff|#1b3a8a|uni|Tottenham,Spurs,THFC
Newcastle United|Angleterre|#000000|#ffffff|rayures|Newcastle,NUFC,Magpies
Aston Villa|Angleterre|#7a1f1f|#6cabdd|manches|Villa,AVFC
Everton|Angleterre|#1b3a8a|#ffffff|uni|Toffees,EFC
West Ham United|Angleterre|#7a1f1f|#6cabdd|manches|West Ham,Hammers
Leeds United|Angleterre|#ffffff|#f9d548|uni|Leeds,LUFC
Leicester City|Angleterre|#1b3a8a|#ffffff|uni|Leicester,Foxes,LCFC
Nottingham Forest|Angleterre|#c8102e|#ffffff|uni|Forest,NFFC
Brighton & Hove Albion|Angleterre|#1b3a8a|#ffffff|rayures|Brighton,Seagulls
Wolverhampton Wanderers|Angleterre|#f9a01b|#000000|uni|Wolves,Wolverhampton
Crystal Palace|Angleterre|#c8102e|#1b3a8a|rayures|Palace,Eagles
Fulham|Angleterre|#ffffff|#000000|uni|Fulham FC,Cottagers
Brentford|Angleterre|#c8102e|#ffffff|rayures|Bees
AFC Bournemouth|Angleterre|#c8102e|#000000|rayures|Bournemouth,Cherries
Southampton|Angleterre|#c8102e|#ffffff|rayures|Saints
Sunderland|Angleterre|#c8102e|#ffffff|rayures|Black Cats,SAFC
Sheffield United|Angleterre|#c8102e|#ffffff|rayures|Sheff Utd,Blades
Sheffield Wednesday|Angleterre|#1b3a8a|#ffffff|rayures|Owls,Sheff Wed
Burnley|Angleterre|#7a1f1f|#6cabdd|manches|Clarets
Ipswich Town|Angleterre|#1b3a8a|#ffffff|uni|Ipswich,Tractor Boys
Norwich City|Angleterre|#f9d548|#1b8a3c|uni|Norwich,Canaries
Middlesbrough|Angleterre|#c8102e|#ffffff|bande|Boro
Derby County|Angleterre|#ffffff|#000000|uni|Derby,Rams
Blackburn Rovers|Angleterre|#1b3a8a|#ffffff|moitie|Blackburn
Queens Park Rangers|Angleterre|#1b3a8a|#ffffff|cerceaux|QPR
West Bromwich Albion|Angleterre|#1b3a8a|#ffffff|rayures|West Brom,WBA,Baggies
Stoke City|Angleterre|#c8102e|#ffffff|rayures|Stoke,Potters
Watford|Angleterre|#f9d548|#000000|uni|Hornets
Coventry City|Angleterre|#6cabdd|#ffffff|uni|Coventry,Sky Blues
Portsmouth|Angleterre|#1b3a8a|#ffffff|uni|Pompey
Hull City|Angleterre|#f9a01b|#000000|rayures|Hull,Tigers
Luton Town|Angleterre|#f26a1b|#ffffff|uni|Luton,Hatters
Birmingham City|Angleterre|#1b3a8a|#ffffff|uni|Birmingham
Charlton Athletic|Angleterre|#c8102e|#ffffff|uni|Charlton,Addicks
AFC Wimbledon|Angleterre|#1b3a8a|#f9d548|uni|Wimbledon,Dons
Millwall|Angleterre|#1b3a8a|#ffffff|uni|Lions Millwall
Preston North End|Angleterre|#ffffff|#1b3a8a|uni|Preston,PNE
Bolton Wanderers|Angleterre|#ffffff|#1b3a8a|uni|Bolton,Trotters
Plymouth Argyle|Angleterre|#1b8a3c|#ffffff|uni|Plymouth,Pilgrims
Bristol City|Angleterre|#c8102e|#ffffff|uni|Robins Bristol
Reading FC|Angleterre|#1b3a8a|#ffffff|cerceaux|Reading,Royals
Swansea City|Pays de Galles|#ffffff|#000000|uni|Swansea,Swans
Cardiff City|Pays de Galles|#1b3a8a|#ffffff|uni|Cardiff,Bluebirds
Wrexham AFC|Pays de Galles|#c8102e|#ffffff|uni|Wrexham
Celtic|Écosse|#1b8a3c|#ffffff|cerceaux|Celtic FC,Celtic Glasgow,Bhoys
Rangers|Écosse|#1b3a8a|#ffffff|uni|Glasgow Rangers,Rangers FC,Gers
Aberdeen|Écosse|#c8102e|#ffffff|uni|Aberdeen FC
Hearts|Écosse|#7a1f1f|#ffffff|uni|Heart of Midlothian,Jambos
Hibernian|Écosse|#1b8a3c|#ffffff|manches|Hibs
Dundee United|Écosse|#f26a1b|#000000|uni|Dundee Utd
Real Madrid|Espagne|#ffffff|#1b3a8a|uni|Real,RMCF,Merengues,Madrid
FC Barcelone|Espagne|#1b3a8a|#a50044|rayures|Barcelone,Barça,Barcelona,FCB,Blaugrana
Atlético de Madrid|Espagne|#c8102e|#ffffff|rayures|Atletico Madrid,Atlético,Atleti,Colchoneros
Séville FC|Espagne|#ffffff|#c8102e|uni|Sevilla,Séville,Sevilla FC
Real Betis|Espagne|#1b8a3c|#ffffff|rayures|Betis,Betis Séville
Valence CF|Espagne|#ffffff|#000000|uni|Valencia,Valence,Valencia CF
Villarreal|Espagne|#f9d548|#1b3a8a|uni|Villarreal CF,Submarino Amarillo
Athletic Bilbao|Espagne|#c8102e|#ffffff|rayures|Athletic Club,Bilbao,Athletic
Real Sociedad|Espagne|#1b3a8a|#ffffff|rayures|Txuri-urdin
Celta Vigo|Espagne|#6cabdd|#ffffff|uni|Celta,Celta de Vigo
Espanyol|Espagne|#1b3a8a|#ffffff|rayures|RCD Espanyol,Espanyol Barcelone
Getafe|Espagne|#1b3a8a|#ffffff|uni|Getafe CF
Osasuna|Espagne|#c8102e|#1b3a8a|uni|CA Osasuna,Pampelune
Deportivo La Corogne|Espagne|#1b3a8a|#ffffff|rayures|Deportivo,Depor,La Coruna,La Coruña
Real Valladolid|Espagne|#5a2d91|#ffffff|rayures|Valladolid
Real Saragosse|Espagne|#ffffff|#1b3a8a|uni|Zaragoza,Saragosse,Real Zaragoza
Málaga CF|Espagne|#6cabdd|#ffffff|rayures|Malaga,Málaga
Rayo Vallecano|Espagne|#ffffff|#c8102e|diag|Rayo
Deportivo Alavés|Espagne|#1b3a8a|#ffffff|rayures|Alaves,Alavés
RCD Majorque|Espagne|#c8102e|#000000|uni|Mallorca,RCD Mallorca,Majorque
UD Las Palmas|Espagne|#f9d548|#1b3a8a|uni|Las Palmas
Girona FC|Espagne|#c8102e|#ffffff|rayures|Girona,Gérone
Levante UD|Espagne|#1b3a8a|#7a1f1f|rayures|Levante
Sporting Gijón|Espagne|#c8102e|#ffffff|rayures|Sporting Gijon,Gijón
Real Oviedo|Espagne|#1b3a8a|#ffffff|uni|Oviedo
Cádiz CF|Espagne|#f9d548|#1b3a8a|uni|Cadiz,Cadix
Elche CF|Espagne|#ffffff|#1b8a3c|uni|Elche
Granada CF|Espagne|#c8102e|#ffffff|cerceaux|Granada,Grenade
CD Leganés|Espagne|#1b3a8a|#ffffff|rayures|Leganes,Leganés
SD Eibar|Espagne|#1b3a8a|#7a1f1f|rayures|Eibar
CD Tenerife|Espagne|#ffffff|#1b3a8a|uni|Tenerife
UD Almería|Espagne|#c8102e|#ffffff|rayures|Almeria,Almería
Racing Santander|Espagne|#1b8a3c|#ffffff|uni|Racing de Santander
Juventus|Italie|#000000|#ffffff|rayures|Juve,Juventus Turin,Bianconeri
AC Milan|Italie|#c8102e|#000000|rayures|Milan,Milan AC,Rossoneri
Inter Milan|Italie|#1b3a8a|#000000|rayures|Inter,Internazionale,Nerazzurri
AS Roma|Italie|#7a1f1f|#f9a01b|uni|Roma,Rome,Giallorossi
SSC Napoli|Italie|#6cabdd|#ffffff|uni|Napoli,Naples,Partenopei
Lazio|Italie|#6cabdd|#ffffff|uni|SS Lazio,Lazio Rome,Biancocelesti
Atalanta|Italie|#000000|#1b3a8a|rayures|Atalanta Bergame,Atalanta BC
Fiorentina|Italie|#5a2d91|#ffffff|uni|ACF Fiorentina,Viola,Florence
Torino|Italie|#7a1f1f|#ffffff|uni|Torino FC,Toro,Granata
Bologne|Italie|#c8102e|#1b3a8a|rayures|Bologna,Bologna FC
Sampdoria|Italie|#1b3a8a|#ffffff|bande|Samp,UC Sampdoria
Genoa|Italie|#c8102e|#1b3a8a|moitie|Genoa CFC,Gênes
Parme|Italie|#f9d548|#1b3a8a|rayures|Parma,Parma Calcio
Udinese|Italie|#000000|#ffffff|rayures|Udinese Calcio,Udine
Hellas Vérone|Italie|#f9d548|#1b3a8a|uni|Verona,Hellas Verona,Vérone
Cagliari|Italie|#c8102e|#1b3a8a|moitie|Cagliari Calcio
Sassuolo|Italie|#1b8a3c|#000000|rayures|US Sassuolo
Lecce|Italie|#f9d548|#c8102e|rayures|US Lecce
Palerme|Italie|#f4a7c4|#000000|uni|Palermo,Palermo FC
Venise|Italie|#000000|#f26a1b|uni|Venezia,Venezia FC
Empoli|Italie|#1b3a8a|#ffffff|uni|Empoli FC
Monza|Italie|#c8102e|#ffffff|uni|AC Monza
Brescia|Italie|#1b3a8a|#ffffff|bandev|Brescia Calcio
Bari|Italie|#ffffff|#c8102e|uni|SSC Bari
Pise|Italie|#000000|#1b3a8a|uni|Pisa
Côme|Italie|#1b3a8a|#ffffff|uni|Como,Como 1907
Salernitana|Italie|#7a1f1f|#ffffff|uni|US Salernitana
Spezia|Italie|#ffffff|#000000|uni|Spezia Calcio
Cremonese|Italie|#c8102e|#808080|rayures|US Cremonese
Frosinone|Italie|#f9d548|#1b3a8a|uni|Frosinone Calcio
Chievo Vérone|Italie|#f9d548|#1b3a8a|uni|Chievo,Chievo Verona
Pérouse|Italie|#c8102e|#ffffff|uni|Perugia
Vicence|Italie|#c8102e|#ffffff|rayures|Vicenza
Reggina|Italie|#7a1f1f|#ffffff|uni|Reggina 1914
Catane|Italie|#c8102e|#6cabdd|rayures|Catania
Livourne|Italie|#7a1f1f|#ffffff|uni|Livorno
Ternana|Italie|#c8102e|#1b8a3c|moitie|Ternana Calcio
Avellino|Italie|#1b8a3c|#ffffff|uni|US Avellino
Padoue|Italie|#ffffff|#c8102e|uni|Padova
Bayern Munich|Allemagne|#c8102e|#ffffff|uni|Bayern,FC Bayern,Bayern München,FCB Munich
Borussia Dortmund|Allemagne|#f9d548|#000000|uni|BVB,Dortmund
Bayer Leverkusen|Allemagne|#c8102e|#000000|uni|Leverkusen,Bayer 04
RB Leipzig|Allemagne|#ffffff|#c8102e|uni|Leipzig
Schalke 04|Allemagne|#1b3a8a|#ffffff|uni|Schalke,S04,Gelsenkirchen
Borussia Mönchengladbach|Allemagne|#ffffff|#1b8a3c|uni|Gladbach,Mönchengladbach,Monchengladbach,Borussia MG
Eintracht Francfort|Allemagne|#c8102e|#000000|uni|Eintracht Frankfurt,Francfort,SGE
VfB Stuttgart|Allemagne|#ffffff|#c8102e|bande|Stuttgart
Werder Brême|Allemagne|#1b8a3c|#ffffff|uni|Werder Bremen,Werder,Brême
Hambourg SV|Allemagne|#ffffff|#1b3a8a|uni|HSV,Hamburger SV,Hambourg,Hamburg
VfL Wolfsburg|Allemagne|#1b8a3c|#ffffff|uni|Wolfsburg,Wolfsbourg
TSG Hoffenheim|Allemagne|#1b3a8a|#ffffff|uni|Hoffenheim
SC Fribourg|Allemagne|#c8102e|#ffffff|uni|Freiburg,Fribourg,SC Freiburg
FC Cologne|Allemagne|#ffffff|#c8102e|uni|1. FC Köln,Koln,Köln,Cologne
Mayence 05|Allemagne|#c8102e|#ffffff|uni|Mainz,Mainz 05,Mayence
Union Berlin|Allemagne|#c8102e|#ffffff|uni|1. FC Union Berlin
Hertha Berlin|Allemagne|#1b3a8a|#ffffff|rayures|Hertha BSC,Hertha
FC Augsbourg|Allemagne|#ffffff|#c8102e|uni|Augsburg,Augsbourg
Fortuna Düsseldorf|Allemagne|#c8102e|#ffffff|uni|Dusseldorf,Düsseldorf
FC Nuremberg|Allemagne|#7a1f1f|#000000|uni|Nürnberg,Nurnberg,Nuremberg
Hanovre 96|Allemagne|#c8102e|#000000|uni|Hannover,Hannover 96,Hanovre
FC Kaiserslautern|Allemagne|#c8102e|#ffffff|uni|Kaiserslautern,FCK
FC St. Pauli|Allemagne|#7a4a2a|#ffffff|uni|St Pauli,Sankt Pauli,St. Pauli
FC Heidenheim|Allemagne|#c8102e|#1b3a8a|uni|Heidenheim
VfL Bochum|Allemagne|#1b3a8a|#ffffff|uni|Bochum
Arminia Bielefeld|Allemagne|#000000|#ffffff|uni|Bielefeld,Arminia
Dynamo Dresde|Allemagne|#f9d548|#000000|uni|Dynamo Dresden,Dresde
Hansa Rostock|Allemagne|#1b3a8a|#ffffff|uni|Rostock
Karlsruher SC|Allemagne|#1b3a8a|#ffffff|uni|Karlsruhe,KSC
1860 Munich|Allemagne|#6cabdd|#ffffff|uni|TSV 1860 München,1860 München
Eintracht Brunswick|Allemagne|#f9d548|#1b3a8a|uni|Braunschweig,Eintracht Braunschweig
Darmstadt 98|Allemagne|#1b3a8a|#ffffff|uni|Darmstadt,Lilien
Greuther Fürth|Allemagne|#1b8a3c|#ffffff|uni|Fürth,Furth
Ajax Amsterdam|Pays-Bas|#ffffff|#c8102e|bandev|Ajax,AFC Ajax,Amsterdam
PSV Eindhoven|Pays-Bas|#c8102e|#ffffff|rayures|PSV,Eindhoven
Feyenoord|Pays-Bas|#c8102e|#ffffff|moitie|Feyenoord Rotterdam,Rotterdam
AZ Alkmaar|Pays-Bas|#c8102e|#ffffff|uni|AZ,Alkmaar
FC Twente|Pays-Bas|#c8102e|#ffffff|uni|Twente,Enschede
FC Utrecht|Pays-Bas|#c8102e|#ffffff|uni|Utrecht
Vitesse Arnhem|Pays-Bas|#f9d548|#000000|uni|Vitesse,Arnhem
FC Groningue|Pays-Bas|#1b8a3c|#ffffff|rayures|Groningen,Groningue
SC Heerenveen|Pays-Bas|#1b3a8a|#ffffff|rayures|Heerenveen
Sparta Rotterdam|Pays-Bas|#c8102e|#ffffff|rayures|Sparta
NEC Nimègue|Pays-Bas|#c8102e|#1b8a3c|rayures|NEC,Nijmegen,NEC Nijmegen
Willem II|Pays-Bas|#c8102e|#ffffff|rayures|Tilburg
Roda JC|Pays-Bas|#f9d548|#000000|uni|Roda,Kerkrade
Go Ahead Eagles|Pays-Bas|#c8102e|#f9d548|uni|Deventer
Benfica|Portugal|#c8102e|#ffffff|uni|SL Benfica,Benfica Lisbonne,SLB,Aguias
FC Porto|Portugal|#1b3a8a|#ffffff|rayures|Porto,FCP,Dragões
Sporting CP|Portugal|#1b8a3c|#ffffff|cerceaux|Sporting,Sporting Lisbonne,Sporting Portugal,SCP
SC Braga|Portugal|#c8102e|#ffffff|uni|Braga,Sporting Braga
Vitória Guimarães|Portugal|#ffffff|#000000|uni|Guimaraes,Vitoria Guimaraes,Vitória SC
Boavista|Portugal|#000000|#ffffff|damier|Boavista FC
Marítimo|Portugal|#1b8a3c|#c8102e|rayures|Maritimo,Funchal
Belenenses|Portugal|#1b3a8a|#ffffff|uni|CF Belenenses
Anderlecht|Belgique|#5a2d91|#ffffff|uni|RSC Anderlecht,RSCA,Mauves
Club Bruges|Belgique|#1b3a8a|#000000|rayures|Club Brugge,Bruges,Brugge
Standard de Liège|Belgique|#c8102e|#ffffff|uni|Standard,Standard Liege,Standard Liège,Rouches
KRC Genk|Belgique|#1b3a8a|#ffffff|uni|Genk,Racing Genk
La Gantoise|Belgique|#1b3a8a|#ffffff|uni|KAA Gent,Gand,Gent,Buffalos
Royal Antwerp|Belgique|#c8102e|#ffffff|uni|Antwerp,Anvers,Antwerp FC
Union Saint-Gilloise|Belgique|#f9d548|#1b3a8a|uni|Union SG,USG,Royale Union
Cercle Bruges|Belgique|#1b8a3c|#000000|rayures|Cercle Brugge,Cercle
Sporting Charleroi|Belgique|#000000|#ffffff|rayures|Charleroi,Zèbres
KV Malines|Belgique|#f9d548|#c8102e|rayures|Mechelen,KV Mechelen,Malines
FC Bâle|Suisse|#c8102e|#1b3a8a|moitie|Basel,Bâle,FC Basel
Young Boys|Suisse|#f9d548|#000000|uni|BSC Young Boys,YB,Berne
FC Zurich|Suisse|#ffffff|#1b3a8a|uni|FCZ,Zürich,FC Zürich
Grasshopper|Suisse|#1b3a8a|#ffffff|moitie|GC Zurich,Grasshoppers,GCZ
Servette|Suisse|#7a1f1f|#ffffff|uni|Servette Genève,Servette FC,Genève
FC Sion|Suisse|#ffffff|#c8102e|uni|Sion
FC Lugano|Suisse|#000000|#ffffff|uni|Lugano
Red Bull Salzbourg|Autriche|#ffffff|#c8102e|uni|RB Salzburg,Salzbourg,Salzburg
Rapid Vienne|Autriche|#1b8a3c|#ffffff|uni|Rapid Wien,Rapid,SK Rapid
Austria Vienne|Autriche|#5a2d91|#ffffff|uni|Austria Wien,FK Austria
Sturm Graz|Autriche|#000000|#ffffff|uni|Sturm,Graz
LASK|Autriche|#000000|#ffffff|uni|LASK Linz,Linz
Galatasaray|Turquie|#c8102e|#f9a01b|moitie|Gala,Galatasaray SK,Cimbom
Fenerbahçe|Turquie|#1b3a8a|#f9d548|rayures|Fenerbahce,Fener,Fenerbahçe SK
Beşiktaş|Turquie|#000000|#ffffff|rayures|Besiktas,BJK,Kartal
Trabzonspor|Turquie|#7a1f1f|#6cabdd|rayures|Trabzon
Başakşehir|Turquie|#f26a1b|#1b3a8a|uni|Basaksehir,Istanbul Basaksehir
Olympiakos|Grèce|#c8102e|#ffffff|rayures|Olympiacos,Olympiakos Le Pirée,Thrylos
Panathinaïkos|Grèce|#1b8a3c|#ffffff|uni|Panathinaikos,PAO,Trifylli
AEK Athènes|Grèce|#f9d548|#000000|uni|AEK,AEK Athens
PAOK Salonique|Grèce|#000000|#ffffff|rayures|PAOK,Thessalonique
Aris Salonique|Grèce|#f9d548|#000000|uni|Aris,Aris Thessaloniki
Dynamo Kiev|Ukraine|#ffffff|#1b3a8a|uni|Dynamo Kyiv,Dinamo Kiev,Kiev
Shakhtar Donetsk|Ukraine|#f26a1b|#000000|uni|Shakhtar,Chakhtar,Donetsk
Spartak Moscou|Russie|#c8102e|#ffffff|bande|Spartak Moscow,Spartak
CSKA Moscou|Russie|#c8102e|#1b3a8a|moitie|CSKA Moscow,CSKA
Zénith Saint-Pétersbourg|Russie|#6cabdd|#ffffff|uni|Zenit,Zénith,Zenit St Petersburg
Lokomotiv Moscou|Russie|#1b8a3c|#c8102e|uni|Lokomotiv,Lokomotiv Moscow
Dinamo Moscou|Russie|#1b3a8a|#ffffff|uni|Dinamo Moscow,Dynamo Moscou
Étoile rouge de Belgrade|Serbie|#c8102e|#ffffff|rayures|Red Star Belgrade,Crvena Zvezda,Etoile Rouge,Zvezda
Partizan Belgrade|Serbie|#000000|#ffffff|rayures|Partizan,FK Partizan
Dinamo Zagreb|Croatie|#1b3a8a|#ffffff|uni|Dinamo,GNK Dinamo,Zagreb
Hajduk Split|Croatie|#ffffff|#1b3a8a|uni|Hajduk,Split
Sparta Prague|République tchèque|#7a1f1f|#f9d548|uni|Sparta Praha,AC Sparta
Slavia Prague|République tchèque|#c8102e|#ffffff|moitie|Slavia Praha,SK Slavia
Viktoria Plzeň|République tchèque|#1b3a8a|#c8102e|uni|Plzen,Viktoria Plzen
Legia Varsovie|Pologne|#1b8a3c|#ffffff|uni|Legia Warszawa,Legia,Legia Warsaw
Lech Poznań|Pologne|#1b3a8a|#ffffff|uni|Lech Poznan,Poznan
Wisła Cracovie|Pologne|#c8102e|#ffffff|uni|Wisla Krakow,Wisla Cracovie,Cracovie
Ferencváros|Hongrie|#1b8a3c|#ffffff|rayures|Ferencvaros,Fradi,FTC
Steaua Bucarest|Roumanie|#c8102e|#1b3a8a|uni|FCSB,Steaua,Steaua Bucuresti
Dinamo Bucarest|Roumanie|#c8102e|#ffffff|uni|Dinamo Bucuresti
CFR Cluj|Roumanie|#7a1f1f|#ffffff|uni|Cluj
Ludogorets|Bulgarie|#1b8a3c|#ffffff|uni|Ludogorets Razgrad,Razgrad
Levski Sofia|Bulgarie|#1b3a8a|#ffffff|uni|Levski
CSKA Sofia|Bulgarie|#c8102e|#ffffff|uni|CSKA Sofia
Sheriff Tiraspol|Moldavie|#f9d548|#000000|uni|Sheriff,Tiraspol
Slovan Bratislava|Slovaquie|#6cabdd|#ffffff|uni|Slovan,Bratislava
NK Maribor|Slovénie|#5a2d91|#f9d548|uni|Maribor
Qarabağ|Azerbaïdjan|#000000|#ffffff|rayures|Qarabag,Karabakh
BATE Borisov|Biélorussie|#f9d548|#1b3a8a|uni|BATE
FC Astana|Kazakhstan|#6cabdd|#f9d548|uni|Astana
Malmö FF|Suède|#6cabdd|#ffffff|uni|Malmo,Malmö,MFF
AIK|Suède|#000000|#f9d548|uni|AIK Stockholm,AIK Solna
IFK Göteborg|Suède|#1b3a8a|#ffffff|rayures|Goteborg,IFK Goteborg,Göteborg
Djurgården|Suède|#1b3a8a|#6cabdd|rayures|Djurgarden,DIF
Hammarby|Suède|#1b8a3c|#ffffff|rayures|Hammarby IF,Bajen
Rosenborg|Norvège|#ffffff|#000000|uni|Rosenborg BK,RBK,Trondheim
Molde FK|Norvège|#1b3a8a|#ffffff|uni|Molde
Bodø/Glimt|Norvège|#f9d548|#000000|uni|Bodo Glimt,Bodø Glimt,Glimt,Bodo
SK Brann|Norvège|#c8102e|#ffffff|uni|Brann,Bergen
Vålerenga|Norvège|#1b3a8a|#c8102e|uni|Valerenga,VIF
Viking FK|Norvège|#1b3a8a|#ffffff|uni|Viking Stavanger,Viking
Lillestrøm|Norvège|#f9d548|#000000|uni|Lillestrom,LSK
FC Copenhague|Danemark|#ffffff|#1b3a8a|uni|FC København,Copenhague,Copenhagen
Brøndby|Danemark|#f9d548|#1b3a8a|uni|Brondby,Brøndby IF
FC Midtjylland|Danemark|#000000|#c8102e|rayures|Midtjylland,FCM
AGF Aarhus|Danemark|#ffffff|#1b3a8a|uni|AGF,Aarhus
AaB Aalborg|Danemark|#c8102e|#ffffff|uni|AaB,Aalborg
HJK Helsinki|Finlande|#1b3a8a|#ffffff|rayures|HJK,Helsinki
KR Reykjavik|Islande|#000000|#ffffff|rayures|KR
Boca Juniors|Argentine|#1b3a8a|#f9d548|bande|Boca,CABJ,Xeneizes
River Plate|Argentine|#ffffff|#c8102e|diag|River,CARP
Independiente|Argentine|#c8102e|#ffffff|uni|CA Independiente,Rojo
Racing Club|Argentine|#6cabdd|#ffffff|rayures|Racing Avellaneda,La Academia
San Lorenzo|Argentine|#1b3a8a|#c8102e|rayures|San Lorenzo de Almagro,Ciclón
Newell's Old Boys|Argentine|#c8102e|#000000|moitie|Newells,Newell's
Rosario Central|Argentine|#1b3a8a|#f9d548|rayures|Canallas
Vélez Sarsfield|Argentine|#ffffff|#1b3a8a|bandev|Velez,Vélez
Estudiantes|Argentine|#c8102e|#ffffff|rayures|Estudiantes de La Plata,Pincha
Argentinos Juniors|Argentine|#c8102e|#ffffff|uni|Argentinos
Flamengo|Brésil|#c8102e|#000000|cerceaux|CR Flamengo,Mengão,Fla
Palmeiras|Brésil|#1b8a3c|#ffffff|uni|SE Palmeiras,Verdão
Corinthians|Brésil|#ffffff|#000000|uni|SC Corinthians,Timão
São Paulo FC|Brésil|#ffffff|#c8102e|cerceaux|Sao Paulo,São Paulo,SPFC
Santos FC|Brésil|#ffffff|#000000|uni|Santos,Peixe
Fluminense|Brésil|#7a1f1f|#1b8a3c|rayures|Flu,Tricolor Carioca
Vasco da Gama|Brésil|#000000|#ffffff|diag|Vasco,CR Vasco
Botafogo|Brésil|#000000|#ffffff|rayures|Fogão,Glorioso
Grêmio|Brésil|#6cabdd|#000000|rayures|Gremio,Grêmio Porto Alegre
Internacional|Brésil|#c8102e|#ffffff|uni|Inter Porto Alegre,Colorado,SC Internacional
Cruzeiro|Brésil|#1b3a8a|#ffffff|uni|Cruzeiro EC,Raposa
Atlético Mineiro|Brésil|#000000|#ffffff|rayures|Atletico Mineiro,Galo,Atlético-MG
Athletico Paranaense|Brésil|#c8102e|#000000|cerceaux|Atlético Paranaense,Furacão,Athletico-PR
EC Bahia|Brésil|#1b3a8a|#c8102e|uni|Bahia
Fortaleza EC|Brésil|#c8102e|#1b3a8a|cerceaux|Fortaleza
Peñarol|Uruguay|#f9d548|#000000|rayures|Penarol,CA Peñarol,Carboneros
Nacional|Uruguay|#ffffff|#1b3a8a|uni|Club Nacional,Nacional Montevideo,Bolso
Colo-Colo|Chili|#ffffff|#000000|uni|Colo Colo,Cacique
Universidad de Chile|Chili|#1b3a8a|#ffffff|uni|La U,U de Chile
Universidad Católica|Chili|#ffffff|#1b3a8a|diag|Universidad Catolica,Cruzados
Atlético Nacional|Colombie|#1b8a3c|#ffffff|rayures|Atletico Nacional,Nacional Medellin,Verdolaga
Millonarios|Colombie|#1b3a8a|#ffffff|uni|Millonarios FC,Embajadores
América de Cali|Colombie|#c8102e|#ffffff|uni|America de Cali
Independiente Medellín|Colombie|#c8102e|#1b3a8a|uni|DIM,Independiente Medellin
Club Olimpia|Paraguay|#ffffff|#000000|bande|Olimpia,Olimpia Asuncion
Cerro Porteño|Paraguay|#c8102e|#1b3a8a|moitie|Cerro Porteno,Cerro
Alianza Lima|Pérou|#1b3a8a|#ffffff|rayures|Alianza,Blanquiazules
Universitario|Pérou|#f4e3c1|#7a1f1f|diag|Universitario de Deportes,Cremas
LDU Quito|Équateur|#ffffff|#1b3a8a|uni|LDU,Liga de Quito
Barcelona SC|Équateur|#f9d548|#000000|uni|Barcelona Guayaquil,Idolo
Club América|Mexique|#f9d548|#1b3a8a|uni|America,Club America,Aguilas
Chivas Guadalajara|Mexique|#c8102e|#ffffff|rayures|Chivas,Guadalajara,CD Guadalajara
Cruz Azul|Mexique|#1b3a8a|#ffffff|uni|La Maquina,Cementeros
Pumas UNAM|Mexique|#f4e3c1|#1b3a8a|uni|Pumas,UNAM
Tigres UANL|Mexique|#f9d548|#1b3a8a|uni|Tigres,UANL
CF Monterrey|Mexique|#1b3a8a|#ffffff|rayures|Monterrey,Rayados
Santos Laguna|Mexique|#1b8a3c|#ffffff|uni|Santos Torreon,Guerreros
Deportivo Toluca|Mexique|#c8102e|#ffffff|uni|Toluca
Atlas FC|Mexique|#c8102e|#000000|rayures|Atlas,Atlas Guadalajara,Zorros
Club León|Mexique|#1b8a3c|#ffffff|uni|Leon,León,Esmeraldas
LA Galaxy|États-Unis|#ffffff|#1b3a8a|uni|Galaxy,Los Angeles Galaxy
Inter Miami|États-Unis|#f4a7c4|#000000|uni|Inter Miami CF,Miami
LAFC|États-Unis|#000000|#c9a227|uni|Los Angeles FC
Seattle Sounders|États-Unis|#1b8a3c|#1b3a8a|uni|Sounders,Seattle
New York Red Bulls|États-Unis|#ffffff|#c8102e|uni|Red Bulls,NY Red Bulls,RBNY
New York City FC|États-Unis|#6cabdd|#1b3a8a|uni|NYCFC,New York City
Atlanta United|États-Unis|#c8102e|#000000|rayures|Atlanta,ATL UTD
Portland Timbers|États-Unis|#1b8a3c|#f9d548|uni|Timbers,Portland
D.C. United|États-Unis|#000000|#c8102e|uni|DC United,Washington
Chicago Fire|États-Unis|#c8102e|#1b3a8a|uni|Chicago,Fire FC
Columbus Crew|États-Unis|#f9d548|#000000|uni|Columbus,Crew
Toronto FC|Canada|#c8102e|#808080|uni|Toronto
CF Montréal|Canada|#1b3a8a|#000000|uni|Impact Montréal,Montreal,Montréal
Vancouver Whitecaps|Canada|#ffffff|#1b3a8a|uni|Whitecaps,Vancouver
Al-Ahly|Égypte|#c8102e|#ffffff|uni|Al Ahly,Ahly,Al Ahly SC
Zamalek|Égypte|#ffffff|#c8102e|uni|Zamalek SC
Raja Casablanca|Maroc|#1b8a3c|#ffffff|uni|Raja,Raja CA,RCA
Wydad Casablanca|Maroc|#c8102e|#ffffff|uni|Wydad,WAC,Wydad AC
Espérance de Tunis|Tunisie|#c8102e|#f9d548|rayures|Esperance,EST,Taraji
Étoile du Sahel|Tunisie|#c8102e|#ffffff|uni|Etoile du Sahel,ESS,Sousse
Club Africain|Tunisie|#c8102e|#ffffff|moitie|CA Tunis
MC Alger|Algérie|#1b8a3c|#c8102e|uni|Mouloudia,MCA,Mouloudia d'Alger
JS Kabylie|Algérie|#f9d548|#1b8a3c|uni|JSK,Kabylie
USM Alger|Algérie|#c8102e|#000000|uni|USMA
TP Mazembe|RD Congo|#000000|#ffffff|uni|Mazembe,Lubumbashi
Mamelodi Sundowns|Afrique du Sud|#f9d548|#1b3a8a|uni|Sundowns,Masandawana
Kaizer Chiefs|Afrique du Sud|#f9a01b|#000000|uni|Chiefs,Amakhosi
Orlando Pirates|Afrique du Sud|#000000|#ffffff|uni|Pirates,Buccaneers
Asante Kotoko|Ghana|#c8102e|#ffffff|uni|Kotoko,Kumasi
Hearts of Oak|Ghana|#c8102e|#1b3a8a|rayures|Accra Hearts of Oak,Phobia
Enyimba|Nigeria|#1b3a8a|#ffffff|uni|Enyimba FC,Aba
ASEC Mimosas|Côte d'Ivoire|#f9d548|#000000|uni|ASEC,Mimosas,Abidjan
Al-Hilal|Arabie saoudite|#1b3a8a|#ffffff|uni|Al Hilal,Hilal,Riyad
Al-Nassr|Arabie saoudite|#f9d548|#1b3a8a|uni|Al Nassr,Nassr
Al-Ittihad|Arabie saoudite|#f9d548|#000000|rayures|Al Ittihad,Ittihad,Djeddah
Al-Ahli Djeddah|Arabie saoudite|#1b8a3c|#ffffff|uni|Al Ahli Jeddah,Al-Ahli Saudi
Al-Sadd|Qatar|#ffffff|#000000|uni|Al Sadd,Doha
Al-Ain|Émirats arabes unis|#5a2d91|#ffffff|uni|Al Ain,Al Ain FC
Persépolis|Iran|#c8102e|#ffffff|uni|Persepolis,Téhéran
Esteghlal|Iran|#1b3a8a|#ffffff|uni|Esteghlal Tehran
Urawa Red Diamonds|Japon|#c8102e|#000000|uni|Urawa Reds,Urawa
Kashima Antlers|Japon|#7a1f1f|#1b3a8a|uni|Kashima,Antlers
Gamba Osaka|Japon|#1b3a8a|#000000|rayures|Gamba
Yokohama F. Marinos|Japon|#1b3a8a|#c8102e|rayures|Yokohama Marinos,Marinos
Vissel Kobe|Japon|#7a1f1f|#000000|uni|Vissel,Kobe
Kawasaki Frontale|Japon|#6cabdd|#000000|uni|Frontale,Kawasaki
Jeonbuk Hyundai Motors|Corée du Sud|#1b8a3c|#f9d548|uni|Jeonbuk,Jeonbuk Hyundai
FC Séoul|Corée du Sud|#c8102e|#000000|rayures|FC Seoul,Séoul,Seoul
Suwon Bluewings|Corée du Sud|#1b3a8a|#ffffff|uni|Suwon,Suwon Samsung
Guangzhou FC|Chine|#c8102e|#ffffff|uni|Guangzhou Evergrande,Guangzhou
Shanghai Port|Chine|#c8102e|#ffffff|uni|Shanghai SIPG,Shanghai
Beijing Guoan|Chine|#1b8a3c|#ffffff|uni|Guoan,Pékin
Sydney FC|Australie|#6cabdd|#1b3a8a|uni|Sydney
Melbourne Victory|Australie|#1b3a8a|#ffffff|diag|Victory,Melbourne
Western Sydney Wanderers|Australie|#c8102e|#000000|cerceaux|Wanderers,WSW
Auckland City|Nouvelle-Zélande|#1b3a8a|#ffffff|uni|Auckland
Wellington Phoenix|Nouvelle-Zélande|#f9d548|#000000|uni|Phoenix,Wellington
`;

/* Maillots cultes : Equipe|saison|marque|joueur|c1|c2|motif|citation|pages Wikipédia (photo de secours) séparées par ; */
const CLASSIQUES_BRUT=`
France|1998|Adidas||#1b3a8a|#ffffff|bande|La bande rouge et blanche du 12 juillet 1998.|Finale de la Coupe du monde de football 1998;Équipe de France de football en 1998;Zinédine Zidane
France|2018|Nike||#1b3a8a|#ffffff|uni|La deuxième étoile, Moscou, 15 juillet 2018.|Finale de la Coupe du monde de football 2018;Kylian Mbappé
Real Madrid|2016-2017|Adidas|Cristiano Ronaldo|#ffffff|#1b3a8a|uni|Le blanc du doublé Liga – Ligue des champions, 42 buts de CR7.|Cristiano Ronaldo;Finale de la Ligue des champions de l'UEFA 2016-2017
Manchester United|2007-2008|Nike|Cristiano Ronaldo|#c8102e|#000000|uni|Le n° 7 de Moscou : Ballon d'Or et Ligue des champions la même année.|Finale de la Ligue des champions de l'UEFA 2007-2008;Cristiano Ronaldo
Portugal|2016|Nike|Cristiano Ronaldo|#c8102e|#1b8a3c|uni|Le sacre de l'Euro 2016 au Stade de France, Ronaldo en coach de touche.|Finale du Championnat d'Europe de football 2016;Cristiano Ronaldo
Juventus|2018-2019|Adidas|Cristiano Ronaldo|#000000|#ffffff|moitie|La première saison turinoise de CR7, moitié noire, moitié blanche.|Cristiano Ronaldo;Juventus Football Club
Argentine|2022|Adidas|Lionel Messi|#75aadb|#ffffff|rayures|La troisième étoile, la nuit de Lusail et Messi enfin champion du monde.|Finale de la Coupe du monde de football 2022;Lionel Messi
FC Barcelone|2010-2011|Nike|Lionel Messi|#1b3a8a|#a50044|rayures|Le Barça de Guardiola à Wembley, sommet du tiki-taka.|Finale de la Ligue des champions de l'UEFA 2010-2011;Lionel Messi
Paris Saint-Germain|2021-2022|Nike|Lionel Messi|#1b3a8a|#c8102e|bandev|Messi, Neymar et Mbappé réunis sous le même maillot.|Lionel Messi;Paris Saint-Germain Football Club
Brésil|2002|Nike|Ronaldo|#f9d548|#1b8a3c|uni|Le penta, les huit buts de Ronaldo et sa coupe de cheveux.|Finale de la Coupe du monde de football 2002;Ronaldo (football, 1976)
Inter Milan|1997-1998|Umbro|Ronaldo|#1b3a8a|#000000|rayures|Les rayures du Fenomeno et la Coupe UEFA 1998.|Ronaldo (football, 1976);Inter Milan
Real Madrid|2001-2002|Adidas|Zinédine Zidane|#ffffff|#1b3a8a|uni|La volée de Glasgow, la neuvième Coupe d'Europe.|Finale de la Ligue des champions de l'UEFA 2001-2002;Zinédine Zidane
Angleterre|1966|Umbro||#c8102e|#ffffff|uni|Le maillot rouge de Wembley, l'unique étoile anglaise.|Finale de la Coupe du monde de football 1966;Bobby Moore
Nigeria|2018|Nike||#1b8a3c|#ffffff|damier|Épuisé en quelques minutes à sa sortie, le maillot le plus désiré du Mondial 2018.|Nigeria à la Coupe du monde de football 2018;Équipe du Nigeria de football
Pays-Bas|1988|Adidas|Marco van Basten|#f26a1b|#ffffff|cerceaux|Le motif géométrique porté par Van Basten pour le sacre de l'Euro 88.|Championnat d'Europe de football 1988;Marco van Basten
Allemagne|1990|Adidas|Lothar Matthäus|#ffffff|#1a1a1a|bande|Les trois traits noir, rouge et or de la nuit de Rome.|Finale de la Coupe du monde de football 1990;Lothar Matthäus
Brésil|1970|Athleta|Pelé|#f9d548|#1b8a3c|uni|Le jaune de Pelé, Jairzinho et Rivelino : la plus belle équipe de l'histoire.|Finale de la Coupe du monde de football 1970;Pelé
Argentine|1986|Le Coq Sportif|Diego Maradona|#75aadb|#ffffff|rayures|Le maillot de Maradona au Mexique, main de Dieu comprise.|Diego Maradona;Finale de la Coupe du monde de football 1986
Italie|1990|Diadora|Salvatore Schillaci|#1b4fa0|#ffffff|uni|L'azzurro de Schillaci pendant les « notti magiche ».|Salvatore Schillaci;Coupe du monde de football 1990
Danemark|1986|Hummel|Michael Laudrup|#d0021b|#ffffff|rayures|Les fines rayures du Danish Dynamite au Mexique.|Michael Laudrup;Équipe du Danemark de football
Mexique|1998|ABA Sport|Jorge Campos|#1b8a3c|#ffffff|uni|Le calendrier aztèque imprimé sur tout le torse.|Jorge Campos;Équipe du Mexique de football
Croatie|1998|Lotto|Davor Šuker|#e11d2e|#ffffff|damier|Le damier de Šuker, troisième du Mondial pour une première participation.|Davor Šuker;Équipe de Croatie de football
Cameroun|2002|Puma|Samuel Eto'o|#1b8a3c|#f9d548|manches|Le maillot sans manches que la FIFA a fini par interdire.|Samuel Eto'o;Équipe du Cameroun de football
Jamaïque|1998|Kappa||#f9d548|#1b1b1b|manches|Les Reggae Boyz à leur premier Mondial, dans un jaune éclatant.|Équipe de Jamaïque de football
Ajax Amsterdam|1994-1995|Umbro|Patrick Kluivert|#ffffff|#d0021b|bandev|La bande rouge de la génération Kluivert, Seedorf et Davids, vainqueurs de la C1.|Finale de la Ligue des champions de l'UEFA 1994-1995;Patrick Kluivert
Manchester United|1998-1999|Umbro|David Beckham|#d0021b|#ffffff|uni|Le maillot du triplé et des arrêts de jeu du Camp Nou.|Finale de la Ligue des champions de l'UEFA 1998-1999;David Beckham
FC Barcelone|1991-1992|Meyba|Johan Cruyff|#1b3a8a|#a50044|rayures|La Dream Team de Cruyff, première Coupe des clubs champions à Wembley.|Johan Cruyff;FC Barcelone (football)
Juventus|1995-1996|Kappa|Alessandro Del Piero|#000000|#ffffff|rayures|Les rayures Kappa de Del Piero et du sacre européen de Rome.|Alessandro Del Piero;Juventus Football Club
Arsenal|2005-2006|Nike|Thierry Henry|#7a1f1f|#c9a227|uni|Le bordeaux « redcurrant » des adieux à Highbury.|Thierry Henry;Highbury
Olympique de Marseille|1992-1993|Adidas|Basile Boli|#ffffff|#1fa0d6|uni|« À jamais les premiers » : Munich, Boli, 26 mai 1993.|Finale de la Ligue des champions de l'UEFA 1992-1993;Basile Boli;Olympique de Marseille
AC Milan|1989-1990|Adidas|Marco van Basten|#d0021b|#000000|rayures|Le Milan de Sacchi : Gullit, Van Basten et Rijkaard.|Ruud Gullit;AC Milan
Celtic|1987-1988|Umbro||#1b8a3c|#ffffff|cerceaux|Les cerceaux du centenaire du club, saison du doublé.|Celtic Football Club
Boca Juniors|1981|Adidas|Diego Maradona|#1b3a8a|#f9d548|bande|La bande or de la Bombonera, l'année des débuts de Maradona.|Diego Maradona;Boca Juniors
Fiorentina|1998-1999|Fila|Gabriel Batistuta|#5a2d91|#ffffff|uni|Le violet de Batistuta, sponsor Nintendo compris.|Gabriel Batistuta;ACF Fiorentina
Borussia Dortmund|1996-1997|Nike||#f9d548|#000000|uni|Le jaune du sacre en Ligue des champions face à la Juventus.|Finale de la Ligue des champions de l'UEFA 1996-1997;Borussia Dortmund
`;

const lignes=t=>t.split('\n').map(l=>l.trim()).filter(Boolean);
const SELECTIONS=lignes(SELECTIONS_BRUT).map(l=>{const p=l.split('|');const iso=p[1]||'';let c1=null,c2=null;if(iso.startsWith('#')){[c1,c2]=iso.split('/')}return{nom:p[0],type:'selection',iso:iso.startsWith('#')?null:iso,c1,c2,motif:'uni',alias:(p[2]||'').split(',').map(s=>s.trim()).filter(Boolean)}});
const CLUBS=lignes(CLUBS_BRUT).map(l=>{const p=l.split('|');return{nom:p[0],type:'club',pays:p[1],c1:p[2],c2:p[3],motif:p[4]||'uni',alias:(p[5]||'').split(',').map(s=>s.trim()).filter(Boolean)}});
const CLASSIQUES=lignes(CLASSIQUES_BRUT).map(l=>{const p=l.split('|');return{equipe:p[0],saison:p[1],marque:p[2],joueur:p[3]||'',c1:p[4],c2:p[5],motif:p[6],citation:p[7],wiki:(p[8]||'').split(';').map(s=>s.trim()).filter(Boolean),force:true}});
const EQUIPES=[...SELECTIONS,...CLUBS];
const INDEX=new Map();EQUIPES.forEach(e=>{INDEX.set(norm(e.nom),e);e.alias.forEach(a=>{if(!INDEX.has(norm(a)))INDEX.set(norm(a),e)})});
function trouverEquipe(nom){if(!nom)return null;const n=norm(nom);if(INDEX.has(n))return INDEX.get(n);const nn=' '+n+' ';for(const [k,e] of INDEX){if(k.length>=4&&nn.includes(' '+k+' '))return e}if(n.length>=5){for(const [k,e] of INDEX){if(k.includes(n))return e}}return null}

/* ===================== ICÔNES & VISUELS ===================== */
const ICONES={bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',refresh:'<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',bag:'<path d="M6 7h12l1 14H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',home:'<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z"/>',shirt:'<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3a4 4 0 0 1-8 0z"/>',sliders:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/>',lens:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',check:'<path d="m5 12 5 5L20 7"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',gauche:'<path d="m15 6-6 6 6 6"/>',droite:'<path d="m9 6 6 6-6 6"/>',download:'<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>',upload:'<path d="M12 21V9M6 13l6-6 6 6M4 3h16"/>',ext:'<path d="M14 4h6v6M20 4 10 14M19 14v6H4V5h6"/>',camera:'<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>'};
const I=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONES[n]||''}</svg>`;

let svgN=0;
function contraste(hex){const h=String(hex||'').replace('#','');if(h.length<6)return '#fff';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return (r*299+g*587+b*114)/1000>150?'#14201b':'#ffffff'}
function svgMaillot(c1,c2,motif,o={}){const id='m'+(++svgN);c1=c1||'#1d3b2f';c2=c2||'#ffffff';
 const corps='M30 14 L41 9 Q50 17 59 9 L70 14 L90 26 L82 41 L73 35 L73 94 L27 94 L27 35 L18 41 L10 26 Z';let deco='';
 switch(motif){
  case 'rayures':deco=[22,38,54,70].map(x=>`<rect x="${x}" y="0" width="8" height="100" fill="${c2}"/>`).join('');break;
  case 'cerceaux':deco=[20,36,52,68,84].map(y=>`<rect x="0" y="${y}" width="100" height="8" fill="${c2}"/>`).join('');break;
  case 'moitie':deco=`<rect x="50" y="0" width="50" height="100" fill="${c2}"/>`;break;
  case 'diag':deco=`<polygon points="10,0 30,0 100,70 100,90" fill="${c2}"/>`;break;
  case 'manches':deco=`<polygon points="0,0 28,0 28,40 10,45 0,30" fill="${c2}"/><polygon points="72,0 100,0 100,30 90,45 72,40" fill="${c2}"/>`;break;
  case 'bande':deco=`<rect x="0" y="44" width="100" height="14" fill="${c2}"/>`;break;
  case 'bandev':deco=`<rect x="40" y="0" width="20" height="100" fill="${c2}"/>`;break;
  case 'damier':{let s='';for(let y=0;y<100;y+=10)for(let x=0;x<100;x+=10)if(((x+y)/10)%2===0)s+=`<rect x="${x}" y="${y}" width="10" height="10" fill="${c2}"/>`;deco=s;break}
 }
 const texte=o.texte?`<text x="50" y="74" text-anchor="middle" font-family="Georgia,serif" font-size="${o.taille||15}" font-weight="700" fill="${contraste(c1)}" opacity=".85">${esc(o.texte)}</text>`:'';
 return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}"><path d="${corps}"/></clipPath></defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="${c1}"/>${deco}</g><path d="${corps}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/><path d="M41 9 Q50 17 59 9" fill="none" stroke="${c2}" stroke-width="3"/>${texte}</svg>`}
function couleurDepuisNom(n){const pal=['#1d3b2f','#1b3a8a','#c8102e','#7a1f1f','#5a2d91','#f26a1b','#6cabdd','#1b8a3c'];return pal[hash(norm(n))%pal.length]}

/* Photos Wikipédia (secours, sans quota) : cache local, 1 seule requête par titre */
const WIKI=lire(K.wiki,{});const wikiEnCours=new Map();
function imageWiki(titre){if(titre in WIKI)return Promise.resolve(WIKI[titre]);if(wikiEnCours.has(titre))return wikiEnCours.get(titre);
 const p=(async()=>{try{const r=await fetch('https://fr.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(titre.replace(/ /g,'_')));if(r.status===404){WIKI[titre]=null;ecrire(K.wiki,WIKI);return null}if(!r.ok)return null;const j=await r.json();let src=(j.thumbnail||{}).source||null;if(src)src=src.replace(/\/(\d+)px-/,'/640px-');WIKI[titre]=src;ecrire(K.wiki,WIKI);return src}catch(e){return null}finally{wikiEnCours.delete(titre)}})();wikiEnCours.set(titre,p);return p}
async function premiereImage(titres){for(const t of titres){const s=await imageWiki(t);if(s)return s}return null}

/* Photos eBay via le relais (gratuites, sans SerpApi) : mémorisées pour toujours (relais + téléphone) */
const IMG=lire(K.img,{});const imgEnCours=new Map();let imgSlots=2;const imgAttente=[];
const prendreSlot=()=>new Promise(res=>{if(imgSlots>0){imgSlots--;res()}else imgAttente.push(res)});
const rendreSlot=()=>{const n=imgAttente.shift();if(n)n();else imgSlots++};
function urlImages(){const a=(params.relaisImages||'').trim().replace(/\/$/,'');if(a)return a;return (params.relais||'').trim().replace(/\/$/,'')}
const proxyImg=u=>`${urlImages()}/img?u=${encodeURIComponent(u)}&code=${encodeURIComponent(params.code||'')}`;
/* Joueur pris en compte seulement si le flocage est « Oui » (ou non renseigné : suggestions) */
const joueurDe=x=>x&&x.joueur&&(x.flocage||x.flocage==null)?x.joueur:'';
const requeteImage=x=>['maillot',x.equipe,x.saison,x.marque,joueurDe(x)].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
function imagesWeb(q){const k=norm(q);if(IMG[k])return Promise.resolve(IMG[k]);if(imgEnCours.has(k))return imgEnCours.get(k);
 const p=(async()=>{await prendreSlot();try{if(IMG[k])return IMG[k];const base=urlImages();if(!base||!params.code)return null;
  const r=await fetch(base,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:params.code,action:'images',q})});const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false)return null;
  if(j.serpapi_utilise&&!j.cache)compterQuota(1);const images=(j.images||[]).filter(i=>i.original||i.miniature);IMG[k]={q,images,i:0,date:Date.now()};ecrire(K.img,IMG);return IMG[k]}
  catch(e){return null}finally{rendreSlot();imgEnCours.delete(k)}})();imgEnCours.set(k,p);return p}
function afficherImage(el,src,repli,echec,logo){const img=new Image();img.alt='';img.onload=()=>{if(!el.isConnected)return;const r=img.naturalWidth/img.naturalHeight;img.className='visu-img'+(logo&&r>0.75&&r<1.35?' logo':'');el.innerHTML='';el.appendChild(img)};img.onerror=()=>{if(repli)afficherImage(el,repli,null,echec,logo);else if(echec)echec()};img.src=src}
async function chargerWikiEl(el,titresBrut){const titres=String(titresBrut||'').split(';;').filter(Boolean);if(!titres.length)return;const src=await premiereImage(titres);if(src&&el.isConnected)afficherImage(el,src,null,null,true)}
function chargerVisuels(){
 $$('.visu[data-gq]').forEach(async el=>{const q=el.dataset.gq;const wiki=el.dataset.wiki||'';el.removeAttribute('data-gq');el.removeAttribute('data-wiki');const c=await imagesWeb(q);if(!el.isConnected)return;
  const im=c&&c.images.length?c.images[(c.i||0)%c.images.length]:null;if(!im){chargerWikiEl(el,wiki);return}
  if(im.original)afficherImage(el,proxyImg(im.original),im.miniature||null,()=>chargerWikiEl(el,wiki));else afficherImage(el,im.miniature,null,()=>chargerWikiEl(el,wiki))});
 $$('.visu[data-wiki]').forEach(el=>{const w=el.dataset.wiki;el.removeAttribute('data-wiki');chargerWikiEl(el,w)})}
/* Image liée au maillot : lien perso > photo eBay > photo Wikipédia > drapeau > maillot dessiné aux couleurs */
function visuelEquipe(nom,o={}){const e=trouverEquipe(nom);let titres=o.wiki||[];
 if(!titres.length&&e&&e.type==='club'&&o.web!==false)titres=[e.nom,...e.alias.slice(0,2)];
 let fond;if(e&&e.type==='selection'&&e.iso&&!o.force)fond=`<img class="visu-drapeau" src="https://flagcdn.com/w320/${e.iso}.png" alt="${esc(e.nom)}" loading="lazy">`;
 else{const c1=(o.force&&o.c1)||(e&&e.c1)||o.c1||couleurDepuisNom(nom||'x');const c2=(o.force&&o.c2)||(e&&e.c2)||o.c2||(String(c1).toLowerCase()==='#ffffff'?'#1d3b2f':'#ffffff');const motif=(o.force&&o.motif)||(e&&e.motif)||o.motif||'uni';fond=`<div class="visu-maillot">${svgMaillot(c1,c2,motif,{texte:o.texte||''})}</div>`}
 if(o.url)return `<div class="visu"><img class="visu-img" src="${esc(o.url)}" alt="" loading="lazy" onerror="this.remove()">${fond}</div>`;
 const gq=(o.gq&&params.photosWeb!==false&&urlImages())?o.gq:'';
 return `<div class="visu"${gq?` data-gq="${esc(gq)}"`:''}${titres.length?` data-wiki="${esc(titres.join(';;'))}"`:''}>${fond}</div>`}
const btnPhoto=(q,style='')=>q&&params.photosWeb!==false&&urlImages()?`<button type="button" class="btn btn-ic" data-a="img-suivante" data-q="${esc(q)}" title="Changer la photo (sans recherche supplémentaire)"${style?` style="${style}"`:''}>${I('camera')}</button>`:'';

/* ===================== ÉTAT & STOCKAGE ===================== */
let collection=lire(K.col,[]),wishlist=lire(K.wish,[]),params=Object.assign({relais:'',relaisImages:'',code:'',prenom:'',dernierExport:0,ebay:true,vinted:true,veille:true,photosWeb:true},lire(K.params,{}));
const etat={page:'accueil',recherche:'',filtres:{equipe:'',saison:'',couleur:'',categorie:''},statutWish:'suivi',seed:1,modal:null,form:null,panneau:false,carrousel:0,ficheId:null,wishId:null,lens:null,lensHtml:'',suggCache:[],srcOuverte:''};
let root;
function sauver(){ecrire(K.col,collection);ecrire(K.wish,wishlist);ecrire(K.params,params)}

const PHOTOS=(()=>{let dbp=null;const cache=new Map();
 const db=()=>dbp||(dbp=new Promise((res,rej)=>{const r=indexedDB.open('mes-maillots',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('photos'))r.result.createObjectStore('photos')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
 const tx=async(mode,fn)=>{const d=await db();return new Promise((res,rej)=>{const q=fn(d.transaction('photos',mode).objectStore('photos'));q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})};
 return{
  async get(id){if(!id)return null;if(String(id).startsWith('data:'))return id;if(cache.has(id))return cache.get(id);const v=await tx('readonly',s=>s.get(id));if(v)cache.set(id,v);return v||null},
  async put(data){const id='ph_'+uid();await tx('readwrite',s=>s.put(data,id));cache.set(id,data);return id},
  async putId(id,data){await tx('readwrite',s=>s.put(data,id));cache.set(id,data)},
  async del(id){if(!id||String(id).startsWith('data:'))return;cache.delete(id);try{await tx('readwrite',s=>s.delete(id))}catch(e){}},
  async tout(){const d=await db();return new Promise((res,rej)=>{const out={};const c=d.transaction('photos','readonly').objectStore('photos').openCursor();c.onsuccess=()=>{const cur=c.result;if(cur){out[cur.key]=cur.value;cur.continue()}else res(out)};c.onerror=()=>rej(c.error)})}
 }})();

async function migrer(){let ch=false;
 for(const m of collection){if(!Array.isArray(m.photos)){m.photos=[];ch=true}
  if(m.photo){m.photos.unshift(m.photo);delete m.photo;ch=true}
  for(let i=0;i<m.photos.length;i++){if(String(m.photos[i]).startsWith('data:')){m.photos[i]=await PHOTOS.put(m.photos[i]);ch=true}}
  if(!m.version){m.version='Replica';ch=true}if(!m.type){m.type=(trouverEquipe(m.equipe)||{}).type||'club';ch=true}
  if(m.flocage==null){m.flocage=!!(m.joueur||m.numero);ch=true}}
 for(const w of wishlist){if(!w.statut){w.statut='suivi';ch=true}if(w.alerte==null){w.alerte=true;ch=true}if(!w.version){w.version='Replica';ch=true}if(w.imageUrl==null){w.imageUrl='';ch=true}
  if(w.flocage==null){w.flocage=!!(w.joueur||w.numero);w.joueur=w.joueur||'';w.numero=w.numero||'';ch=true}}
 if(!params.v34){params.v34=true;params.ebay=true;if(params.vinted==null)params.vinted=true;ch=true}
 if(ch)sauver()}

/* ===================== RELAIS, QUOTA, PRIX ===================== */
function quota(){const q=lire(K.quota,{});const mois=new Date().toISOString().slice(0,7);return q.mois===mois?q:{mois,utilise:0}}
function compterQuota(n){const q=quota();q.utilise+=n;ecrire(K.quota,q)}
async function relais(action,donnees={}){if(!params.relais)throw new Error('Relais non configuré (Paramètres).');
 const r=await fetch(params.relais.trim().replace(/\/$/,''),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:params.code,action,...donnees})});
 const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false)throw new Error(j.erreur||j.error||j.message||('Erreur relais '+r.status));
 if(j.serpapi_utilise&&!j.cache)compterQuota(Number(j.serpapi_recherches)||(j.serpapi_utilise===true?1:(Number(j.serpapi_utilise)||1)));return j}
function parsePrix(s){const m=String(s||'').replace(/\u00a0/g,' ').match(/(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|eur)/i);return m?parseFloat(m[1].replace(',','.')):null}
const SUSPECTS=/\b(copie|contrefa\w*|fake|replique chinoise|lot de|enfant|kids|junior|bebe|short|chaussette|echarpe|poster|carte|sticker|figurine|ballon|casquette|survetement|veste|pantalon|training|entrainement)\b/;
const sourceDe=(s,lien)=>{const t=norm(String(s||'')+' '+String(lien||''));return /vinted/.test(t)?'Vinted':/leboncoin/.test(t)?'Leboncoin':/ebay/.test(t)?'eBay':'Web'};
function normaliserAnnonces(j,forceSrc){let liste=j.annonces||j.resultats||j.items||j.organic_results||j.shopping_results||[];if(!Array.isArray(liste))liste=[];
 return liste.map(a=>{const titre=a.titre||a.title||'';const texte=titre+' '+(a.snippet||a.description||'');let prix=a.prix??a.price??a.extracted_price;if(typeof prix==='string')prix=parsePrix(prix);if(prix==null||isNaN(prix))prix=parsePrix(texte);
  const lien=a.lien||a.link||a.url||'';
  return{titre:String(titre).slice(0,140),prix:Number(prix),lien,source:forceSrc||sourceDe(a.source,lien),etat:String(a.etat||a.condition||'').slice(0,40),sus:SUSPECTS.test(norm(texte))}}).filter(a=>a.prix>0)}
function analyserPrix(annonces){const ok=(annonces||[]).filter(a=>!(a.sus||SUSPECTS.test(norm(a.texte||a.titre))));const prix=ok.map(a=>a.prix).sort((a,b)=>a-b);if(!prix.length)return null;
 const med=prix[Math.floor(prix.length/2)];const fiables=ok.filter(a=>a.prix>=med*0.4&&a.prix<=med*3).sort((a,b)=>a.prix-b.prix);const pf=fiables.map(a=>a.prix);const mediane=pf.length?pf[Math.floor(pf.length/2)]:med;
 const parSource={};ok.forEach(a=>{parSource[a.source]=(parSource[a.source]||0)+1});
 return{mediane,min:pf.length?pf[0]:med,max:pf.length?pf[pf.length-1]:med,nb:ok.length,ecartes:(annonces||[]).length-ok.length,parSource,fiables}}
/* Requête principale + requêtes de repli (saison courte, sans joueur, traductions) */
function requetesRepli(x){const eq=trouverEquipe(x.equipe);const nomEq=String(x.equipe||'').trim();const j=joueurDe(x);const s=String(x.saison||'').trim();const s1=(s.match(/(?:19|20)\d{2}/)||[''])[0];
 const out=[];const add=a=>{const q=a.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();if(q&&!out.includes(q))out.push(q)};
 add([nomEq,'maillot',s,x.marque,j]);add([nomEq,'maillot',s1,x.marque,j]);add([nomEq,'maillot',s1,x.marque]);add([nomEq,'maillot',s1]);
 if(eq){eq.alias.filter(a=>!/^[A-Z0-9]{2,5}$/.test(a)&&norm(a)!==norm(nomEq)).slice(0,2).forEach(a=>add([a,eq.type==='selection'?'jersey':'shirt',s1,j]))}
 add([nomEq,'maillot']);return out.slice(0,6)}
/* Collecte des annonces : eBay (gratuit) + Vinted/Leboncoin via Google (SerpApi) */
async function collecter(x,o={}){const reqs=requetesRepli(x);const out={date:Date.now(),annonces:[],erreurs:[],serpapi:0,vintedCherche:false,sources:[],requete:reqs[0]};
 if(params.ebay!==false&&!o.sansEbay){out.sources.push('eBay');try{const j=await relais('ebay',{q:reqs[0],repli:reqs.slice(1)});out.annonces=out.annonces.concat(normaliserAnnonces(j,'eBay'))}catch(e){out.erreurs.push('eBay : '+e.message)}}
 if(params.vinted!==false&&!o.sansVinted){if(quota().utilise>=QUOTA_MAX-2)out.erreurs.push('Vinted/Leboncoin non cherchés : quota SerpApi du mois épuisé.');
  else{try{const q=o.large?(reqs[1]||reqs[0]):reqs[0];const j=await relais('annonces',{q,repli:o.large?reqs.slice(2):reqs.slice(1)});out.vintedCherche=true;out.sources.push('Vinted','Leboncoin','Web');out.serpapi=j.cache?0:(Number(j.serpapi_recherches)||(j.serpapi_utilise?1:0));out.annonces=out.annonces.concat(normaliserAnnonces(j))}catch(e){out.erreurs.push('Vinted/Leboncoin : '+e.message)}}}
 const vus=new Set();out.annonces=out.annonces.filter(a=>{const k=a.lien||a.titre;if(vus.has(k))return false;vus.add(k);return true}).slice(0,40);return out}
/* Fusion avec le relevé précédent : on garde les annonces des sources qui n'ont pas été re-cherchées */
function fusion(base,c){const refresh=new Set(c.sources||[]);const anciennes=((base&&base.annonces)||[]).filter(a=>!refresh.has(a.source));const vus=new Set();
 const annonces=[...c.annonces,...anciennes].filter(a=>{const k=a.lien||a.titre;if(vus.has(k))return false;vus.add(k);return true}).slice(0,40);
 return{date:Date.now(),annonces,erreurs:c.erreurs,serpapi:c.serpapi,vintedCherche:!!(c.vintedCherche||(base&&base.vintedCherche)),requete:c.requete}}
function appliquerReleveMaillot(m,r){m.releve=r;const s=analyserPrix(r.annonces);if(s){m.valeur=s.mediane;m.dateEstimation=r.date}return s}
function appliquerReleveWish(w,r){const s=analyserPrix(r.annonces);w.dernierReleve=r.date;w.releve=r;
 if(s){w.dernierPrix=s.mediane;w.meilleurPrix=s.min;if(w.prixRef==null)w.prixRef=s.mediane;w.nbAnnonces=s.nb;w.dernierSource=Object.entries(s.parSource).map(([k,v])=>`${k} (${v} annonce${v>1?'s':''})`).join(' et ');
  w.meilleureAnnonce=s.fiables[0]?{titre:s.fiables[0].titre,prix:s.fiables[0].prix,lien:s.fiables[0].lien,source:s.fiables[0].source}:null;
  (w.historique=w.historique||[]).push({date:r.date,prix:s.mediane,min:s.min});if(w.historique.length>30)w.historique.shift()}
 else{w.nbAnnonces=0;w.dernierSource='aucune annonce exploitable'}return s}
async function estimerMaillot(m){if(!params.relais){toast('Configure le relais dans Paramètres.');return}toast('Recherche des annonces (eBay, Vinted, Leboncoin)…',true);
 const c=await collecter(m);const s=appliquerReleveMaillot(m,fusion(m.releve,c));sauver();rendre();
 toast(s?`Valeur estimée ${euros(s.mediane)} · ${c.annonces.length} annonces, détail dans la fiche.`:'Aucune annonce exploitable : essaie « Compléter avec Vinted/Leboncoin » ou simplifie la saison.')}
async function verifierPrix(ids,auto){if(!params.relais){if(!auto)toast('Configure d\'abord le relais dans Paramètres.');return}
 const cibles=wishlist.filter(w=>w.statut==='suivi'&&(!ids||ids.includes(w.id))).sort((a,b)=>(a.dernierReleve||0)-(b.dernierReleve||0)).slice(0,6);
 if(!cibles.length){toast('Aucun maillot suivi à vérifier.');return}
 let i=0;for(const w of cibles){i++;toast(`Vérification ${i}/${cibles.length} : ${w.equipe}…`,true);const c=await collecter(w,{sansVinted:!!auto});appliquerReleveWish(w,fusion(w.releve,c))}
 sauver();rendre();toast(auto?'Veille eBay du jour terminée.':'Prix mis à jour.')}
async function veilleAuto(){if(params.veille===false||!params.relais)return;if(Date.now()-lire(K.veille,0)<24*3600e3)return;if(!wishlist.some(w=>w.statut==='suivi'))return;ecrire(K.veille,Date.now());await verifierPrix(null,true)}

/* Bloc « estimation détaillée » : par source + annonces cliquables */
const SOURCES=['eBay','Vinted','Leboncoin','Web'];
function actionsVinted(cible,r){return params.vinted!==false&&params.relais?`<button type="button" class="btn" data-a="estim-vinted" data-c="${esc(cible)}">${I('search')} Compléter avec Vinted/Leboncoin${r&&r.vintedCherche?' (requête plus large)':''}</button>`:''}
function blocEstimation(r,pref,o={}){if(!r)return '';const an=r.annonces||[];const g=analyserPrix(an);
 let h=`<div class="estim"><div class="eyebrow">${o.titre||'Estimation'} · ${dateFr(r.date)} · ${an.length} annonce${an.length>1?'s':''}${r.serpapi?` · ${r.serpapi} recherche${r.serpapi>1?'s':''} SerpApi`:(r.vintedCherche?' · Vinted/Leboncoin depuis le cache (0 SerpApi)':'')}</div>`;
 h+=g?`<div class="estim-glob">Estimation globale : <b>${euros(g.mediane)}</b> <span class="aide" style="margin:0">médiane de ${g.fiables.length} annonces fiables${g.ecartes?`, ${g.ecartes} écartée${g.ecartes>1?'s':''}`:''} · fourchette ${euros(g.min)} – ${euros(g.max)}</span></div>`:`<div class="estim-glob">Aucune annonce exploitable pour le moment.</div>`;
 for(const s of SOURCES){const l=an.filter(a=>a.source===s);
  if(!l.length){if(s==='Web')continue;h+=`<div class="src"><b>${s}</b><span class="aide" style="margin:0">${s==='eBay'?(params.ebay===false?'désactivé dans Paramètres':'aucune annonce trouvée'):(r.vintedCherche?'aucune annonce trouvée':'pas encore cherché')}</span></div>`;continue}
  const st=analyserPrix(l);const cle=pref+'|'+s;const ouvert=etat.srcOuverte===cle;
  h+=`<div class="src"><b>${s}</b><span>${l.length} annonce${l.length>1?'s':''}${st?` · médiane ${euros(st.mediane)} · ${euros(st.min)} – ${euros(st.max)}`:' · toutes écartées (suspectes)'}</span><button type="button" class="btn" style="margin-left:auto;padding:6px 12px;font-size:12px" data-a="estim-src" data-s="${esc(cle)}">${ouvert?'Masquer':'Voir les annonces'}</button></div>`;
  if(ouvert)h+=`<div class="annonces">${[...l].sort((a,b)=>a.prix-b.prix).map(a=>`<a class="ann${a.sus?' sus':''}" href="${esc(a.lien||'#')}" target="_blank" rel="noopener" title="${a.sus?'Écartée du calcul (mot suspect dans le titre)':'Ouvrir l\'annonce'}"><span class="t">${esc(a.titre||'Annonce')}</span>${a.etat?`<span class="e">${esc(a.etat)}</span>`:''}<b>${euros(a.prix)}</b>${I('ext')}</a>`).join('')}</div>`}
 if(r.erreurs&&r.erreurs.length)h+=`<div class="aide" style="color:var(--rouge)">${r.erreurs.map(esc).join('<br>')}</div>`;
 if(o.actions)h+=`<div class="wactions" style="margin-top:10px">${o.actions}</div>`;
 return h+'</div>'}

/* ===================== GOOGLE LENS ===================== */
function compresser(src,max,q){return new Promise((res,rej)=>{const img=new Image();let url=null;if(typeof src!=='string'){url=URL.createObjectURL(src);src=url}
 img.onload=()=>{const r=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*r));c.height=Math.max(1,Math.round(img.height*r));c.getContext('2d').drawImage(img,0,0,c.width,c.height);if(url)URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',q))};
 img.onerror=()=>rej(new Error('Image illisible'));img.src=src})}
function analyserLens(matches,indice){const eqI=indice?trouverEquipe(indice):null;const nI=norm(indice||'');
 const mentionne=x=>{if(x.indice_ok)return true;const tt=' '+norm((x.title||'')+' '+(x.source||''))+' ';if(nI&&tt.includes(' '+nI+' '))return true;if(!eqI)return false;return [eqI.nom,...eqI.alias].some(a=>norm(a).length>=3&&tt.includes(' '+norm(a)+' '))};
 const avecIndice=indice?matches.filter(mentionne):[];const base=avecIndice.length>=2?avecIndice:matches;
 const titresTous=matches.map(x=>norm((x.title||'')+' '+(x.source||'')));const titres=base.map(x=>norm((x.title||'')+' '+(x.source||'')));const score=new Map();
 for(const t of titresTous){const tt=' '+t+' ';const vus=new Set();for(const [k,e] of INDEX){if(k.length<3)continue;if(tt.includes(' '+k+' ')&&!vus.has(e.nom)){vus.add(e.nom);score.set(e.nom,(score.get(e.nom)||0)+1+k.length/20)}}}
 if(eqI)score.set(eqI.nom,(score.get(eqI.nom)||0)+1000);
 const equipes=[...score.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([nom])=>({nom,indice:!!(eqI&&eqI.nom===nom)}));
 const tout=' '+titres.join(' ')+' ';const compte=re=>(tout.match(re)||[]).length;
 const saisons=new Map();for(const t of titres){const re=/\b((?:19|20)\d{2})(?:\s*[-\/]\s*((?:19|20)?\d{2}))?\b/g;let m;while((m=re.exec(t))){let s=m[1];if(m[2])s+='-'+(m[2].length===2?m[1].slice(0,2)+m[2]:m[2]);saisons.set(s,(saisons.get(s)||0)+1)}}
 const saison=([...saisons.entries()].sort((a,b)=>b[1]-a[1])[0]||[''])[0];
 const marque=(MARQUES.map(m=>[m,compte(new RegExp(' '+norm(m)+' ','g'))]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])[0]||[''])[0];
 const version=/ (match worn|porte en match|match issue) /.test(tout)?'Porté en match':/ (authentic|authentique|player issue|player version|vapor|adizero|heat rdy|aeroswift) /.test(tout)?'Authentic':'Replica';
 const categorie=/ (away|exterieur) /.test(tout)?'Extérieur':/ (third|3rd|troisieme) /.test(tout)?'Third':/ (goalkeeper|gardien|gk|portero) /.test(tout)?'Gardien':/ (home|domicile) /.test(tout)?'Domicile':'';
 const COUL=[['Blanc',/ (blanc|white|bianco|blanco|weiss) /g],['Noir',/ (noir|black|nero|negro|schwarz) /g],['Rouge',/ (rouge|red|rosso|rojo|rot) /g],['Bleu',/ (bleu|blue|blu|azul|blau) /g],['Vert',/ (vert|green|verde|grun) /g],['Jaune',/ (jaune|yellow|giallo|amarillo|gelb) /g],['Orange',/ (orange|naranja|arancio) /g],['Violet',/ (violet|purple|viola|morado) /g],['Rose',/ (rose|pink|rosa) /g],['Gris',/ (gris|grey|gray|grigio) /g],['Bordeaux',/ (bordeaux|maroon|claret|granate) /g]];
 const couleur=(COUL.map(([n,re])=>[n,compte(re)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])[0]||[''])[0];
 const nums=new Map();for(const t of titres){const re=/\b(?:n|no|numero|number)\s*(\d{1,2})\b/g;let m;while((m=re.exec(t)))nums.set(m[1],(nums.get(m[1])||0)+1)}
 const numero=([...nums.entries()].sort((a,b)=>b[1]-a[1])[0]||[''])[0];
 return{equipes,saison,marque,version,categorie,couleur,numero,nbIndice:avecIndice.length,indiceInconnu:!!(indice&&!eqI),images:matches.filter(x=>x.thumbnail).slice(0,8).map(x=>({src:x.thumbnail,lien:x.link,titre:x.title||'',source:x.source||''}))}}
async function identifierLens(){synchroForm();const p=etat.form.photos[0];if(!p){toast('Ajoute d\'abord une photo.');return}if(!params.relais){toast('Configure le relais dans Paramètres.');return}
 const indice=(etat.form.indice||'').trim();etat.lensHtml='<div class="lens-res">Analyse de la photo avec Google Lens…</div>';rendre();
 try{const src=p.data||await PHOTOS.get(p.id);const img=await compresser(src,800,0.8);const donnees={image:img};if(indice)donnees.indice=indice;const j=await relais('lens',donnees);const matches=j.visual_matches||j.matches||j.resultats||[];
  if(!matches.length){etat.lensHtml='<div class="lens-res">Aucune correspondance trouvée. Essaie une photo plus nette, de face, écusson visible, ou ajoute un indice (pays, club).</div>';rendre();return}
  const a=analyserLens(matches,indice);etat.lens=a;etat.form.similaires=a.images;const details=[a.saison,a.marque,a.version,a.categorie,a.couleur,a.numero?'n° '+a.numero:''].filter(Boolean).map(esc).join(' · ');
  const infoIndice=indice?` · indice « ${esc(indice)} » : ${a.indiceInconnu?'inconnu du dictionnaire':a.nbIndice+' résultat'+(a.nbIndice>1?'s':'')+' le mentionne'+(a.nbIndice>1?'nt':'')}`:'';
  etat.lensHtml=`<div class="lens-res"><div class="eyebrow">Propositions · ${matches.length} correspondances${j.cache?' (cache)':''}${infoIndice}</div><div class="props">${a.equipes.length?a.equipes.map((e,i)=>`<div class="prop"><div class="mini">${visuelEquipe(e.nom)}</div><div style="flex:1"><b>${esc(e.nom)}</b>${e.indice?' <span class="chip">ton indice</span>':''}<div class="aide" style="margin:2px 0 0">${details||'détails non détectés'}</div></div><button type="button" class="btn btn-vert" data-a="appliquer" data-i="${i}">Appliquer</button></div>`).join(''):`<div class="prop"><div style="flex:1">Équipe non reconnue dans le dictionnaire.<div class="aide" style="margin:2px 0 0">Détails détectés : ${details||'aucun'}</div></div><button type="button" class="btn" data-a="appliquer" data-i="-1">Appliquer</button></div>`}</div>
  ${a.images.length?`<div class="eyebrow" style="margin-top:12px">Images similaires trouvées</div><div class="simil">${a.images.map(s=>`<a href="${esc(s.lien||s.src)}" target="_blank" rel="noopener" title="${esc(s.titre)}"><img src="${esc(s.src)}" alt="" loading="lazy"></a>`).join('')}</div>`:''}</div>`}
 catch(e){etat.lensHtml=`<div class="lens-res">Erreur : ${esc(e.message)}</div>`}rendre()}
function appliquerLens(i){const a=etat.lens;if(!a)return;synchroForm();const f=etat.form;
 if(i>=0&&a.equipes[i]){const eq=trouverEquipe(a.equipes[i].nom);f.equipe=a.equipes[i].nom;if(eq)f.type=eq.type}
 if(a.saison)f.saison=a.saison;if(a.marque)f.marque=a.marque;if(a.version)f.version=a.version;if(a.categorie)f.categorie=a.categorie;if(a.couleur)f.couleur=a.couleur;if(a.numero){f.numero=a.numero;f.flocage=true}
 rendre();toast('Champs remplis : vérifie et complète.')}

/* ===================== SUGGESTIONS & NOTIFICATIONS ===================== */
function suggestions(){const possede=new Set(collection.map(m=>norm(m.equipe)+'|'+norm(m.saison)));const equipesPossedees=new Set(collection.map(m=>norm(m.equipe)));const souhaits=new Set(wishlist.map(w=>norm(w.equipe)+'|'+norm(w.saison)));const out=[];
 const push=(s,groupe)=>{const k=norm(s.equipe)+'|'+norm(s.saison||'');if(possede.has(k)||souhaits.has(k))return;if(!s.saison&&equipesPossedees.has(norm(s.equipe)))return;if(out.some(o=>norm(o.equipe)+'|'+norm(o.saison||'')===k))return;out.push({...s,groupe})};
 for(const m of collection){const e=trouverEquipe(m.equipe);
  CLASSIQUES.filter(c=>norm(c.equipe)===norm(m.equipe)).forEach(c=>push({...c,raison:`Parce que tu as déjà ${m.equipe}`},0));
  if(m.joueur&&norm(m.joueur).length>=3){const nomJ=norm(m.joueur).split(' ').pop();CLASSIQUES.filter(c=>c.joueur&&norm(c.joueur).includes(nomJ)).forEach(c=>push({...c,raison:`Parce que tu as un maillot de ${m.joueur}`},0))}
  if(e&&e.type==='club'){const sel=SELECTIONS.find(s=>norm(s.nom)===norm(e.pays));if(sel)push({equipe:sel.nom,saison:'',marque:'',citation:'La sélection, pour accompagner le club.',raison:`Le pays de ${e.nom}`},0);
   CLUBS.filter(c=>c.pays===e.pays&&c.nom!==e.nom&&!equipesPossedees.has(norm(c.nom))).slice(0,3).forEach(c=>push({equipe:c.nom,saison:'',marque:'',citation:'Un rival historique pour compléter la série.',raison:`Même championnat que ${e.nom}`},0))}
  if(e&&e.type==='selection')CLASSIQUES.filter(c=>(trouverEquipe(c.equipe)||{}).type==='selection').slice(0,4).forEach(c=>push({...c,raison:'Tu aimes les sélections'},0));
  if(m.marque)CLASSIQUES.filter(c=>norm(c.marque)===norm(m.marque)).slice(0,3).forEach(c=>push({...c,raison:`Signé ${m.marque}, comme ton ${m.equipe}`},0))}
 CLASSIQUES.forEach(c=>push({...c,raison:'Un classique de la collection'},1));
 return out.map(s=>({s,k:s.groupe*1e10+hash(s.equipe+'|'+s.saison+'|'+etat.seed)})).sort((a,b)=>a.k-b.k).map(x=>x.s)}
function notifications(){const n=[];const now=Date.now();
 if(!params.relais)n.push({id:'relais',titre:'Relais non configuré',texte:'Renseigne l\'adresse du relais Cloudflare et le code dans Paramètres pour activer Google Lens, les photos eBay et le relevé des prix.',page:'parametres'});
 if(!collection.length)n.push({id:'bienvenue',titre:'Bienvenue dans Mes Maillots',texte:'Ajoute ton premier maillot : une photo suffit, Google Lens t\'aide à l\'identifier.',page:'collection'});
 wishlist.filter(w=>w.statut==='suivi'&&w.alerte&&w.budget&&w.meilleurPrix!=null&&w.meilleurPrix<=w.budget).forEach(w=>n.push({id:'budget_'+w.id+'_'+Math.round(w.meilleurPrix),titre:`${w.equipe} dans ton budget`,texte:`Une annonce fiable à ${euros(w.meilleurPrix)} (budget ${euros(w.budget)}).`,page:'wishlist'}));
 const idees=suggestions().length;if(idees&&collection.length)n.push({id:'idees_'+idees,titre:`${idees} idées pour ta collection`,texte:'Découvre les suggestions sur l\'accueil.',page:'accueil'});
 if(collection.length&&(!params.dernierExport||now-params.dernierExport>14*864e5))n.push({id:'export_'+Math.floor(now/(7*864e5)),titre:'Pense à sauvegarder',texte:'Aucun export depuis plus de 14 jours. Paramètres → Exporter.',page:'parametres'});
 const q=quota();if(q.utilise>=QUOTA_MAX*0.8)n.push({id:'quota_'+q.mois,titre:'Quota SerpApi presque atteint',texte:`${q.utilise}/${QUOTA_MAX} recherches utilisées ce mois.`,page:'parametres'});
 return n}

/* ===================== RENDU ===================== */
const PAGES=[{id:'accueil',nom:'Accueil',ic:'home'},{id:'collection',nom:'Collection',ic:'shirt'},{id:'wishlist',nom:'Wishlist',ic:'heart'},{id:'parametres',nom:'Paramètres',ic:'sliders'}];
function entete(){const lus=lire(K.notifs,[]);const nonLues=notifications().filter(n=>!lus.includes(n.id)).length;
 return `<header class="entete"><div class="entete-in"><div class="brand" data-a="page" data-p="accueil"><b>Mes Maillots</b><small>Collection privée</small></div>
 <button class="bell ${etat.panneau?'on':''}" data-a="notifs" title="Notifications">${I('bell')}${nonLues?'<i class="pt"></i>':''}</button>
 <nav class="nav">${PAGES.map(p=>`<button class="${etat.page===p.id?'on':''}" data-a="page" data-p="${p.id}">${p.nom}</button>`).join('')}</nav>
 <button class="btn btn-vert btn-ajouter" data-a="ajouter">${I('plus')} Ajouter</button></div></header>`}
function barre(){const b=p=>`<button class="${etat.page===p.id?'on':''}" data-a="page" data-p="${p.id}">${I(p.ic)}${p.nom}</button>`;return `<nav class="barre">${b(PAGES[0])}${b(PAGES[1])}<button class="plus" data-a="ajouter">${I('plus')}</button>${b(PAGES[2])}${b(PAGES[3])}</nav>`}
function datalists(){return `<datalist id="liste-equipes">${EQUIPES.map(e=>`<option value="${esc(e.nom)}">`).join('')}</datalist><datalist id="liste-marques">${MARQUES.map(m=>`<option value="${m}">`).join('')}</datalist>`}
const badgeFlocage=x=>x.flocage?`<span class="floc">Flocage${x.joueur?' '+esc(x.joueur):''}${x.numero?' · n° '+esc(x.numero):''}</span>`:'';

function carteMaillot(m){const img=m.photos&&m.photos[0]?`<img data-ph="${esc(m.photos[0])}" alt="${esc(m.equipe)}">`:visuelEquipe(m.equipe,{texte:m.numero||saisonCourte(m.saison),c1:couleurHex(m.couleur),gq:requeteImage(m)});
 return `<article class="carte" data-a="fiche" data-id="${m.id}"><div class="img">${img}<span class="badge">${esc(m.version||'Replica')}</span><button class="heart ${m.favori?'on':''}" data-a="favori" data-id="${m.id}" title="Coup de cœur">${I('heart')}</button></div>
 <div class="corps"><h3>${esc(m.equipe||'Maillot')}</h3><div class="meta">${[m.saison,m.marque,m.categorie,m.couleur].filter(Boolean).map(esc).join(' · ')||'—'}</div>${m.flocage?`<div style="margin-top:6px">${badgeFlocage(m)}</div>`:''}
 <div class="bas"><span class="chip">${esc(m.etat||'État non renseigné')}</span><b>${euros(m.valeur!=null&&m.valeur!==''?m.valeur:m.prixAchat)}</b></div></div></article>`}
function filtrer(){const q=norm(etat.recherche);return collection.filter(m=>{for(const k in etat.filtres){if(etat.filtres[k]&&String(m[k]||'').trim()!==etat.filtres[k])return false}if(!q)return true;return norm([m.equipe,m.marque,m.sponsor,m.joueur,m.saison,m.notes,m.couleur,m.version,m.categorie].join(' ')).includes(q)}).sort((a,b)=>(b.favori?1:0)-(a.favori?1:0)||(b.date||0)-(a.date||0))}
function listeCollection(){if(!collection.length)return `<div class="vide">${visuelEquipe('',{c1:'#143d2f',c2:'#c6e36b',motif:'manches',texte:'1',web:false})}<h3>Ta collection est vide</h3><p>Ajoute ton premier maillot : une photo suffit, Google Lens t'aide à l'identifier.</p><button class="btn btn-vert" data-a="ajouter">${I('plus')} Ajouter un maillot</button></div>`;
 const l=filtrer();return `<div class="compte">${l.length} maillot${l.length>1?'s':''}</div>${l.length?`<div class="grille">${l.map(carteMaillot).join('')}</div>`:'<div class="vide">Aucun maillot ne correspond à cette recherche.</div>'}`}
function pageCollection(){const n=collection.length;const investi=collection.reduce((s,m)=>s+(+m.prixAchat||0),0);const valeur=collection.reduce((s,m)=>s+(m.valeur!=null&&m.valeur!==''?+m.valeur:(+m.prixAchat||0)),0);const pv=valeur-investi;
 const distinct=f=>[...new Set(collection.map(m=>String(m[f]||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
 const sel=(nom,cle)=>`<select class="pilule" data-f="${cle}"><option value="">${nom}</option>${distinct(cle).map(o=>`<option ${etat.filtres[cle]===o?'selected':''} value="${esc(o)}">${esc(o)}</option>`).join('')}</select>`;
 return `<div class="titre-page"><div><div class="eyebrow">Collection</div><h1>Ma collection de maillots</h1><p>Toutes vos pièces, leur saison, leur état et leur valeur estimée — mises à jour à la main, à votre rythme.</p></div></div>
 <div class="kpis"><div class="kpi"><div class="lab">Maillots</div><div class="val">${n}</div></div><div class="kpi"><div class="lab">Investi</div><div class="val">${euros(investi)}</div></div><div class="kpi"><div class="lab">Valeur estimée</div><div class="val lime">${euros(valeur)}</div></div><div class="kpi"><div class="lab">Plus-value</div><div class="val ${pv<0?'rouge':''}">${pv>0?'+':''}${euros(pv)}</div><div class="sub">estimée – investie</div></div></div>
 <div class="avert">${I('info')}<div><b>Estimation indicative uniquement :</b> les valeurs s'appuient sur les annonces récentes de revente entre particuliers (eBay, Vinted, Leboncoin), jamais sur les prix des sites officiels. Ce ne sont ni des cotes officielles, ni des prix de marché en direct.</div></div>
 <div class="recherche">${I('search')}<input id="recherche" type="search" placeholder="Rechercher un club, une marque, un sponsor..." value="${esc(etat.recherche)}" autocomplete="off"></div>
 <div class="filtres">${sel('Clubs','equipe')}${sel('Saisons','saison')}${sel('Couleurs','couleur')}${sel('Types','categorie')}${Object.values(etat.filtres).some(Boolean)||etat.recherche?`<button class="btn" data-a="reset-filtres">${I('x')} Effacer</button>`:''}</div>
 <div id="zone-liste">${listeCollection()}</div>`}

function carteWish(w){const meta=[w.version||'Replica',w.marque,w.couleur,w.taille].filter(Boolean).map(esc).join(' · ');let alerte='';
 if(w.statut==='suivi')alerte=!w.alerte?'Alerte désactivée : les prix restent relevés, sans notification.':w.budget?`<b>Alerte active :</b> prévenu dès qu'une annonce passe sous ${euros(w.budget)}.`:'Indique un budget (Modifier) pour activer l\'alerte.';
 let releve=w.prixRef==null?'Prix pas encore relevé : la première vérification fixera le prix de référence.':`Dernier relevé : ${dateFr(w.dernierReleve)}${w.dernierSource?' · '+esc(w.dernierSource):''}.`;
 if(w.prixRef>0&&w.dernierPrix!=null){const d=Math.round((w.dernierPrix-w.prixRef)/w.prixRef*100);if(d<=-5)releve+=` <b>En baisse de ${-d} %</b> depuis le premier relevé.`;else if(d>=5)releve+=` En hausse de ${d} % depuis le premier relevé.`}
 const nbAnn=w.releve&&w.releve.annonces?w.releve.annonces.length:0;
 const liens=nbAnn?`<div style="margin-top:8px"><button class="btn" style="padding:6px 12px;font-size:12px" data-a="wish-annonces" data-id="${w.id}">${I('search')} Voir les annonces (${nbAnn})</button></div>`:(w.dernierReleve?'<div class="aide" style="margin:4px 0 0">Les liens vers les annonces seront disponibles au prochain relevé.</div>':'');
 const meilleure=w.meilleureAnnonce?`<div class="wnote">Meilleure annonce fiable : <a href="${esc(w.meilleureAnnonce.lien)}" target="_blank" rel="noopener">${euros(w.meilleureAnnonce.prix)} sur ${esc(w.meilleureAnnonce.source)} ${I('ext')}</a></div>`:'';
 const actions=w.statut==='suivi'?`<button class="btn" data-a="wish-modifier" data-id="${w.id}">${I('edit')} Modifier</button><button class="btn btn-vert" data-a="wish-trouve" data-id="${w.id}">${I('bag')} Je l'ai trouvé</button><button class="btn btn-ic" data-a="verifier-un" data-id="${w.id}" title="Vérifier ce maillot maintenant">${I('refresh')}</button>`
  :w.statut==='trouve'?`<button class="btn btn-vert" data-a="wish-vers-collection" data-id="${w.id}">${I('plus')} Ajouter à la collection</button><button class="btn" data-a="wish-reprendre" data-id="${w.id}">${I('refresh')} Reprendre le suivi</button>`
  :`<button class="btn" data-a="wish-reprendre" data-id="${w.id}">${I('refresh')} Reprendre le suivi</button><button class="btn" data-a="wish-modifier" data-id="${w.id}">${I('edit')} Modifier</button>`;
 const classique=CLASSIQUES.find(c=>norm(c.equipe)===norm(w.equipe)&&c.saison&&norm(w.saison).includes(norm(c.saison).slice(0,4)));const gq=w.imageUrl?'':requeteImage(w);
 return `<article class="wcarte"><div class="wtete"><div class="wvisu grand">${visuelEquipe(w.equipe,{url:w.imageUrl,wiki:classique?classique.wiki:undefined,texte:saisonCourte(w.saison),c1:couleurHex(w.couleur),gq})}</div><div><h3>${esc(w.equipe)}</h3><div class="meta">${esc(w.saison||'Saison non précisée')}</div><div class="meta">${meta}</div>${w.flocage?`<div style="margin-top:6px">${badgeFlocage(w)}</div>`:''}</div>
 <button class="wbell ${w.alerte?'':'off'}" data-a="wish-alerte" data-id="${w.id}" title="${w.alerte?'Désactiver l\'alerte':'Activer l\'alerte'}">${I('bell')}</button></div>
 ${w.statut!=='suivi'?`<div style="margin-top:10px"><span class="chip">${w.statut==='trouve'?'Trouvé':'Abandonné'}</span></div>`:''}
 <div class="wsep"></div><div class="wprix"><div><div class="lab">Budget</div><div class="val">${euros(w.budget)}</div></div><div><div class="lab">Prix de référence</div><div class="val">${w.prixRef==null?'<span class="arelever">à relever</span>':euros(w.prixRef)}</div></div><div><div class="lab">Dernier prix</div><div class="val">${euros(w.dernierPrix)}</div></div></div>
 ${alerte?`<div class="wnote">${alerte}</div>`:''}<div class="wnote">${releve}${liens}</div>${meilleure}${w.notes?`<div class="wnote"><b>Notes.</b> ${esc(w.notes)}</div>`:''}
 <div class="wactions">${actions}${btnPhoto(gq)}<button class="btn btn-ic btn-rouge" data-a="wish-supprimer" data-id="${w.id}" title="Supprimer" style="margin-left:auto">${I('trash')}</button></div></article>`}
function pageWishlist(){const statuts=[['suivi','Suivis'],['trouve','Trouvés'],['abandonne','Abandonnés'],['tous','Tous']];const l=wishlist.filter(w=>etat.statutWish==='tous'||w.statut===etat.statutWish).sort((a,b)=>(b.date||0)-(a.date||0));
 const mot={suivi:'surveillés',trouve:'trouvés',abandonne:'abandonnés',tous:'au total'}[etat.statutWish];
 return `<div class="titre-page"><div><div class="eyebrow">Veille</div><h1>Ma wishlist</h1><p>Les maillots que vous aimeriez avoir. Leurs prix sont relevés sur les annonces de revente entre particuliers : eBay, Vinted et Leboncoin.</p></div>
 <div class="wactions" style="margin:0"><button class="btn" data-a="verifier">${I('refresh')} Vérifier les prix</button><button class="btn btn-vert" data-a="ajouter-wish">${I('plus')} Ajouter une envie</button></div></div>
 <div class="aide">« Vérifier les prix » interroge eBay + Vinted/Leboncoin (6 maillots par passage, 1 à 2 recherches SerpApi chacun). La veille automatique quotidienne n'interroge qu'eBay, gratuitement. Les prix restent indicatifs.</div>
 <div class="chips">${statuts.map(([id,nom])=>`<button class="${etat.statutWish===id?'on':''}" data-a="wish-statut" data-s="${id}">${nom}</button>`).join('')}</div>
 <div class="compte">${l.length} maillot${l.length>1?'s':''} · ${mot}</div>
 ${l.length?`<div class="wgrille">${l.map(carteWish).join('')}</div>`:`<div class="vide"><h3>Rien ici pour le moment</h3><p>Ajoute une envie : l'appli relèvera ses prix sur les annonces entre particuliers.</p><button class="btn btn-vert" data-a="ajouter-wish">${I('plus')} Ajouter une envie</button></div>`}`}

function carteSugg(s,i){const e=trouverEquipe(s.equipe);const gq=requeteImage(s);return `<article class="carte sugg-carte"><div class="img">${visuelEquipe(s.equipe,{force:s.force,c1:s.c1,c2:s.c2,motif:s.motif,wiki:s.wiki,texte:saisonCourte(s.saison),gq})}${s.saison?`<span class="badge">${esc(s.saison)}</span>`:''}</div>
 <div class="corps"><h3>${esc(s.equipe)}${s.joueur?` <small>· ${esc(s.joueur)}</small>`:''}</h3><div class="meta">${[s.saison,s.marque,e?(e.type==='club'?e.pays:'Sélection nationale'):''].filter(Boolean).map(esc).join(' · ')}</div>${s.citation?`<div class="cit">« ${esc(s.citation)} »</div>`:''}<div class="raison">${esc(s.raison)}</div>
 <div class="wactions"><button class="btn" data-a="sugg-wish" data-i="${i}">${I('heart')} Wishlist</button><button class="btn btn-vert" data-a="sugg-col" data-i="${i}">${I('plus')} Je l'ai</button>${btnPhoto(gq,'margin-left:auto')}</div></div></article>`}
function pageAccueil(){const sugg=suggestions().slice(0,6);etat.suggCache=sugg;const suivis=wishlist.filter(w=>w.statut==='suivi');const derniers=[...collection].sort((a,b)=>(b.date||0)-(a.date||0)).slice(0,4);const salut=new Date().getHours()<18?'Bonjour':'Bonsoir';
 return `<div class="hero"><div class="eyebrow" style="color:var(--lime)">${salut}${params.prenom?' '+esc(params.prenom):''}</div><h1>Des maillots qui pourraient vous plaire</h1><p>Des idées calculées à partir de votre collection : mêmes clubs, mêmes pays, mêmes joueurs, mêmes équipementiers et quelques classiques incontournables. Sans intelligence artificielle, sans publicité.</p>
 <div class="stats"><span>${collection.length} maillot${collection.length>1?'s':''} en collection</span><span>${suivis.length} souhait${suivis.length>1?'s':''} surveillé${suivis.length>1?'s':''}</span><span>${sugg.length} idées du moment</span></div><div class="deco">${svgMaillot('#ffffff','#ffffff','uni')}</div></div>
 <div class="section"><h2>Suggestions pour vous</h2><button class="btn" data-a="idees">${I('refresh')} Nouvelles idées</button></div><div class="sugg">${sugg.map(carteSugg).join('')}</div>
 ${derniers.length?`<div class="section"><h2>Derniers ajouts</h2><button class="btn" data-a="page" data-p="collection">Voir la collection</button></div><div class="grille">${derniers.map(carteMaillot).join('')}</div>`:''}
 ${suivis.length?`<div class="section"><h2>Veille en cours</h2><button class="btn" data-a="page" data-p="wishlist">Voir la wishlist</button></div><div class="wgrille">${suivis.slice(0,2).map(carteWish).join('')}</div>`:''}`}

function pageParametres(){const q=quota();const pct=Math.min(100,Math.round(q.utilise/QUOTA_MAX*100));const nbImg=Object.keys(IMG).length;
 return `<div class="titre-page"><div><div class="eyebrow">Réglages</div><h1>Paramètres</h1><p>Le relais Cloudflare sert uniquement à interroger Google Lens, eBay et les annonces de revente (Vinted, Leboncoin via Google). Aucune intelligence artificielle n'est utilisée.</p></div></div>
 <div class="carte-param"><h2>Profil</h2><div class="form"><label>Prénom<input name="prenom" value="${esc(params.prenom)}" placeholder="Pour le bonjour de l'accueil"></label></div></div>
 <div class="carte-param"><h2>Relais Cloudflare</h2><div class="form"><label class="plein">Adresse du relais<input name="relais" value="${esc(params.relais)}" placeholder="https://maillots-relais.xxxx.workers.dev"></label><label class="plein">Code secret<input name="code" type="password" value="${esc(params.code)}" placeholder="Le CODE_SECRET du Worker"></label>
 <label class="plein">Adresse du relais images (facultatif : laisse vide, le relais principal fournit les photos eBay)<input name="relaisImages" value="${esc(params.relaisImages||'')}" placeholder="Laisser vide"></label>
 <label class="coche plein"><input type="checkbox" name="photosWeb" ${params.photosWeb!==false?'checked':''}> Photos eBay automatiques (gratuites, sans SerpApi, mémorisées définitivement)</label>
 <label class="coche plein"><input type="checkbox" name="ebay" ${params.ebay!==false?'checked':''}> Estimer et relever les prix avec eBay (gratuit, sans SerpApi)</label>
 <label class="coche plein"><input type="checkbox" name="vinted" ${params.vinted!==false?'checked':''}> Chercher aussi Vinted et Leboncoin via Google (1 à 2 recherches SerpApi par estimation ou relevé manuel)</label>
 <label class="coche plein"><input type="checkbox" name="veille" ${params.veille!==false?'checked':''}> Veille automatique : un relevé eBay par jour à l'ouverture (6 maillots maximum, sans SerpApi)</label></div>
 <div class="wactions"><button class="btn btn-vert" data-a="sauver-params">${I('check')} Enregistrer</button><button class="btn" data-a="tester">${I('refresh')} Tester la connexion</button></div><div id="res-test"></div></div>
 <div class="carte-param"><h2>Quota SerpApi</h2><div class="aide" style="margin:0">${q.utilise} / ${QUOTA_MAX} recherches utilisées en ${q.mois} (compteur local, approximatif). Google Lens coûte 1 recherche par identification ; Vinted/Leboncoin 1 à 2 par estimation ou relevé manuel. Les photos eBay (${nbImg} mémorisées), Wikipédia, les prix eBay et la veille automatique ne coûtent rien.</div><div class="quota"><i style="width:${pct}%"></i></div></div>
 <div class="carte-param"><h2>Sauvegarde</h2><div class="aide" style="margin:0 0 12px">L'export contient la collection, la wishlist et les photos (sans le code secret). Dernier export : ${params.dernierExport?dateFr(params.dernierExport):'jamais'}.</div><div class="wactions"><button class="btn btn-vert" data-a="exporter">${I('download')} Exporter</button><label class="btn">${I('upload')} Importer<input type="file" id="fichier-import" accept="application/json,.json" hidden></label></div></div>
 <div class="carte-param"><h2>Application</h2><div class="aide" style="margin:0 0 12px">Mes Maillots v${VERSION} · ${collection.length} maillots · ${wishlist.length} souhaits · ${EQUIPES.length} équipes et ${CLASSIQUES.length} maillots cultes dans le dictionnaire.</div><div class="wactions"><button class="btn" data-a="maj">${I('refresh')} Forcer la mise à jour de l'appli</button><button class="btn" data-a="vider-wiki">${I('trash')} Vider le cache Wikipédia</button><button class="btn" data-a="vider-img">${I('trash')} Vider les photos eBay mémorisées</button></div></div>`}

/* ---- fiche, formulaires ---- */
function ficheMaillot(m){const e=trouverEquipe(m.equipe);const ph=m.photos||[];if(etat.carrousel>=ph.length)etat.carrousel=0;const gq=ph.length?'':requeteImage(m);
 const visu=ph.length?`<img data-ph="${esc(ph[etat.carrousel])}" alt="">${ph.length>1?`<button class="fl g" data-a="carrousel" data-d="-1">${I('gauche')}</button><button class="fl d" data-a="carrousel" data-d="1">${I('droite')}</button><div class="pts">${ph.map((_,i)=>`<i class="${i===etat.carrousel?'on':''}"></i>`).join('')}</div>`:''}`:visuelEquipe(m.equipe,{texte:m.numero||saisonCourte(m.saison),c1:couleurHex(m.couleur),gq});
 const ligne=(lab,val)=>val?`<div><span class="lab">${lab}</span>${esc(val)}</div>`:'';
 const flocage=m.flocage?([m.joueur,m.numero?'n° '+m.numero:''].filter(Boolean).join(' · ')||'Oui'):'Non';
 return `<div class="modal"><button class="btn btn-ic fermer" data-a="fermer">${I('x')}</button>
 <div class="carrousel">${visu}<span class="badge">${esc(m.version||'Replica')}</span><button class="heart ${m.favori?'on':''}" data-a="favori" data-id="${m.id}">${I('heart')}</button></div>
 <div class="ftete"><div class="wvisu">${visuelEquipe(m.equipe)}</div><div><div class="eyebrow">${e?(e.type==='club'?esc(e.pays):'Sélection nationale'):'Maillot'}</div><h2>${esc(m.equipe)}</h2><div class="meta">${[m.saison,m.marque,m.categorie].filter(Boolean).map(esc).join(' · ')}</div></div></div>
 <div class="det">${ligne('Couleur',m.couleur)}${ligne('Sponsor',m.sponsor)}${ligne('Taille',m.taille)}${ligne('État',m.etat)}${ligne('Flocage',flocage)}${ligne('Prix d\'achat',m.prixAchat!=null&&m.prixAchat!==''?euros(m.prixAchat):'')}${ligne('Valeur estimée',m.valeur!=null&&m.valeur!==''?euros(m.valeur)+(m.dateEstimation?' (le '+dateFr(m.dateEstimation).slice(0,10)+')':''):'')}${ligne('Ajouté le',m.date?dateFr(m.date).slice(0,10):'')}</div>
 ${m.notes?`<div class="wnote" style="margin-top:0"><b>Notes.</b> ${esc(m.notes)}</div>`:''}
 ${m.releve?blocEstimation(m.releve,'m'+m.id,{titre:'Estimation détaillée',actions:actionsVinted(m.id,m.releve)}):''}
 ${m.similaires&&m.similaires.length?`<div class="eyebrow" style="margin-top:16px">Vu sur le web (Google Lens)</div><div class="simil">${m.similaires.map(s=>`<a href="${esc(s.lien||s.src)}" target="_blank" rel="noopener"><img src="${esc(s.src)}" alt="" loading="lazy"></a>`).join('')}</div>`:''}
 <div class="wactions" style="margin-top:20px"><button class="btn" data-a="modifier" data-id="${m.id}">${I('edit')} Modifier</button><button class="btn" data-a="estimer-fiche" data-id="${m.id}">${I('refresh')} ${m.releve?'Nouvelle estimation':'Estimer la valeur'}</button>${btnPhoto(gq)}<button class="btn btn-ic btn-rouge" data-a="supprimer" data-id="${m.id}" style="margin-left:auto">${I('trash')}</button></div></div>`}
const opts=(liste,v)=>liste.map(o=>`<option ${o===v?'selected':''}>${esc(o)}</option>`).join('');
const champsFlocage=(f,ex)=>`<label>Flocage (nom ou numéro au dos)<select name="flocage">${opts(['Non','Oui'],f.flocage?'Oui':'Non')}</select></label>${f.flocage?`<label>Nom du joueur<input name="joueur" value="${esc(f.joueur)}" placeholder="${ex||'Zidane'}"></label><label>Numéro<input name="numero" value="${esc(f.numero)}" placeholder="10" inputmode="numeric"></label>`:''}`;
function formMaillot(){const f=etat.form;
 return `<div class="modal"><button class="btn btn-ic fermer" data-a="fermer">${I('x')}</button><div class="eyebrow">${f.id?'Modifier':'Nouveau maillot'}</div><h2>${f.id?esc(f.equipe):'Ajouter un maillot'}</h2>
 <div class="photos-edit">${f.photos.map((p,i)=>`<div class="ph"><img ${p.data?`src="${p.data}"`:`data-ph="${esc(p.id)}"`} alt=""><button type="button" class="x" data-a="photo-suppr" data-i="${i}">${I('x')}</button></div>`).join('')}${f.photos.length<4?`<label class="ph" title="Ajouter une photo">${I('camera')}<span>Photo</span><input type="file" accept="image/*" id="fichier-photo" hidden multiple></label>`:''}</div>
 <div class="wactions" style="align-items:center;margin-top:0"><button type="button" class="btn" data-a="lens" ${f.photos.length?'':'disabled'}>${I('lens')} Identifier avec Google Lens</button><input id="lens-indice" value="${esc(f.indice||'')}" placeholder="Indice (facultatif) : Norvège, PSG…" autocomplete="off" style="flex:1;min-width:170px;border:1px solid var(--ligne);border-radius:12px;padding:9px 12px;font:inherit;font-size:14px;background:#fafaf7"></div>
 <div class="aide" style="margin:4px 0 0">1 recherche SerpApi · résultat gardé 7 jours. L'indice (pays ou club) met en tête les résultats qui le mentionnent, dans toutes les langues (Norway, Norge, Norwegen…), et sert à lire saison, marque et couleur sur les bons résultats.</div>
 <div id="lens-res">${etat.lensHtml||''}</div>
 <form id="f-maillot" class="form" onsubmit="return false">
  <label>Type<select name="type">${opts(['Club','Sélection'],f.type==='selection'?'Sélection':'Club')}</select></label>
  <label>Équipe<input name="equipe" list="liste-equipes" value="${esc(f.equipe)}" placeholder="Olympique de Marseille, France…" autocomplete="off"></label>
  <label>Saison<input name="saison" value="${esc(f.saison)}" placeholder="1998-1999"></label>
  <label>Marque<input name="marque" list="liste-marques" value="${esc(f.marque)}" placeholder="Adidas" autocomplete="off"></label>
  <label>Version<select name="version">${opts(VERSIONS,f.version||'Replica')}</select></label>
  <label>Type de maillot<select name="categorie"><option value="">—</option>${opts(CATEGORIES,f.categorie)}</select></label>
  <label>Couleur dominante<select name="couleur"><option value="">—</option>${opts(COULEURS.map(c=>c[0]),f.couleur)}</select></label>
  <label>Sponsor<input name="sponsor" value="${esc(f.sponsor)}" placeholder="Opel, Fly Emirates…"></label>
  <label>Taille<select name="taille"><option value="">—</option>${opts(TAILLES,f.taille)}</select></label>
  <label>État<select name="etat"><option value="">—</option>${opts(ETATS,f.etat)}</select></label>
  ${champsFlocage(f)}
  <label>Prix d'achat (€)<input name="prixAchat" type="number" min="0" step="1" value="${esc(f.prixAchat)}"></label>
  <label>Valeur estimée (€)<input name="valeur" type="number" min="0" step="1" value="${esc(f.valeur)}"></label>
  <div class="plein"><button type="button" class="btn" data-a="estimer">${I('refresh')} Estimer la valeur via les annonces (eBay, Vinted, Leboncoin)</button>${f.releve?blocEstimation(f.releve,'form',{actions:actionsVinted('form',f.releve)}):''}</div>
  <label class="plein">Notes<textarea name="notes" placeholder="Provenance, anecdote, défauts…">${esc(f.notes)}</textarea></label>
  <label class="coche plein"><input type="checkbox" name="favori" ${f.favori?'checked':''}> Coup de cœur</label>
 </form>
 <div class="wactions" style="justify-content:flex-end"><button class="btn" data-a="fermer">Annuler</button><button class="btn btn-vert" data-a="enregistrer">${I('check')} Enregistrer</button></div>${datalists()}</div>`}
function formWish(){const f=etat.form;
 return `<div class="modal"><button class="btn btn-ic fermer" data-a="fermer">${I('x')}</button><div class="eyebrow">Wishlist</div><h2>${f.id?'Modifier l\'envie':'Ajouter une envie'}</h2>
 <form id="f-wish" class="form" onsubmit="return false">
  <label>Type<select name="type">${opts(['Club','Sélection'],f.type==='selection'?'Sélection':'Club')}</select></label>
  <label>Équipe<input name="equipe" list="liste-equipes" value="${esc(f.equipe)}" placeholder="Real Madrid, France…" autocomplete="off"></label>
  <label>Saison<input name="saison" value="${esc(f.saison)}" placeholder="2012"></label>
  <label>Marque<input name="marque" list="liste-marques" value="${esc(f.marque)}" placeholder="Adidas" autocomplete="off"></label>
  <label>Version<select name="version">${opts(VERSIONS,f.version||'Replica')}</select></label>
  <label>Couleur<select name="couleur"><option value="">—</option>${opts(COULEURS.map(c=>c[0]),f.couleur)}</select></label>
  <label>Taille<select name="taille"><option value="">—</option>${opts(TAILLES,f.taille)}</select></label>
  <label>Budget maximum (€)<input name="budget" type="number" min="0" step="1" value="${esc(f.budget)}" placeholder="130"></label>
  ${champsFlocage(f,'Ronaldo')}
  <label class="plein">Lien d'une image (facultatif, remplace la photo eBay)<input name="imageUrl" type="url" value="${esc(f.imageUrl)}" placeholder="https://… (clic droit sur une photo du web → Copier l'adresse de l'image)"></label>
  ${f.id?`<label>Statut<select name="statut">${[['suivi','Suivi'],['trouve','Trouvé'],['abandonne','Abandonné']].map(([v,n])=>`<option value="${v}" ${f.statut===v?'selected':''}>${n}</option>`).join('')}</select></label>`:''}
  <label class="plein">Notes<textarea name="notes" placeholder="Taille recherchée, détails…">${esc(f.notes)}</textarea></label>
  <label class="coche plein"><input type="checkbox" name="alerte" ${f.alerte!==false?'checked':''}> M'alerter quand une annonce fiable passe sous le budget</label>
 </form>
 <div class="wactions" style="justify-content:flex-end"><button class="btn" data-a="fermer">Annuler</button><button class="btn btn-vert" data-a="wish-enregistrer">${I('check')} Enregistrer</button></div>${datalists()}</div>`}
function modalAnnoncesWish(w){const r=w.releve;
 return `<div class="modal"><button class="btn btn-ic fermer" data-a="fermer">${I('x')}</button><div class="eyebrow">Wishlist · annonces relevées</div><h2>${esc(w.equipe)}</h2><div class="meta">${[w.saison,w.marque,w.version].filter(Boolean).map(esc).join(' · ')}${w.flocage&&w.joueur?' · flocage '+esc(w.joueur):''}</div>
 ${r?blocEstimation(r,'w'+w.id,{titre:'Dernier relevé',actions:`<button type="button" class="btn btn-vert" data-a="verifier-un" data-id="${w.id}">${I('refresh')} Nouveau relevé</button>${actionsVinted('wish:'+w.id,r)}`}):`<div class="aide" style="margin:14px 0">Aucun relevé avec liens pour le moment : lance un nouveau relevé.</div><div class="wactions"><button type="button" class="btn btn-vert" data-a="verifier-un" data-id="${w.id}">${I('refresh')} Nouveau relevé</button></div>`}
 <div class="aide" style="margin-top:12px">Chaque ligne ouvre l'annonce dans un nouvel onglet. Les annonces grisées sont écartées du calcul (mot suspect dans le titre). Les prix sont indicatifs.</div></div>`}
function panneauNotifs(){const n=notifications();const lus=lire(K.notifs,[]);
 return `<div class="panneau"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3 style="font-size:18px">Notifications</h3>${n.length?`<button class="btn" style="padding:6px 12px;font-size:12px" data-a="notif-lu-tout">Tout marquer lu</button>`:''}</div>
 ${n.length?n.map(x=>`<div class="notif ${lus.includes(x.id)?'lu':''}" data-a="notif" data-id="${esc(x.id)}" data-p="${x.page||''}"><b>${esc(x.titre)}</b><span>${esc(x.texte)}</span></div>`).join(''):'<div class="aide">Rien de nouveau.</div>'}</div>`}

function rendre(){const pages={accueil:pageAccueil,collection:pageCollection,wishlist:pageWishlist,parametres:pageParametres};
 root.innerHTML=entete()+`<main>${(pages[etat.page]||pageAccueil)()}</main>`+barre()+(etat.panneau?panneauNotifs():'')+`<div id="modal">${etat.modal?`<div class="voile">${etat.modal()}</div>`:''}</div>`;
 document.body.style.overflow=etat.modal?'hidden':'';chargerPhotos();chargerVisuels()}
function chargerPhotos(){$$('img[data-ph]').forEach(async img=>{const id=img.dataset.ph;img.removeAttribute('data-ph');const d=await PHOTOS.get(id);if(d)img.src=d;else img.style.display='none'})}
let toastT;function toast(msg,fixe){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.style.display='block';clearTimeout(toastT);if(!fixe)toastT=setTimeout(()=>t.style.display='none',3500)}
function fermerModal(){etat.modal=null;etat.form=null;etat.lens=null;etat.lensHtml='';etat.srcOuverte='';rendre()}
function lireForm(sel){const f=$(sel);const o={};if(!f)return o;new FormData(f).forEach((v,k)=>o[k]=typeof v==='string'?v.trim():v);f.querySelectorAll('input[type=checkbox]').forEach(c=>o[c.name]=c.checked);return o}
function synchroForm(){const f=$('#f-maillot')||$('#f-wish');if(!f||!etat.form)return;const v=lireForm('#'+f.id);if(v.type)v.type=v.type==='Sélection'?'selection':'club';if('flocage' in v)v.flocage=v.flocage==='Oui';Object.assign(etat.form,v);const ind=$('#lens-indice');if(ind)etat.form.indice=ind.value.trim()}
function ouvrirFormMaillot(m={}){etat.lensHtml='';etat.lens=null;etat.panneau=false;etat.srcOuverte='';
 etat.form={id:m.id||null,date:m.date||null,wishId:m.wishId||null,type:m.type||'club',equipe:m.equipe||'',saison:m.saison||'',marque:m.marque||'',version:m.version||'Replica',categorie:m.categorie||'',couleur:m.couleur||'',sponsor:m.sponsor||'',taille:m.taille||'',etat:m.etat||'',flocage:m.flocage!=null?!!m.flocage:!!(m.joueur||m.numero),joueur:m.joueur||'',numero:m.numero||'',prixAchat:m.prixAchat??'',valeur:m.valeur??'',notes:m.notes||'',favori:!!m.favori,photos:(m.photos||[]).map(id=>({id})),similaires:m.similaires||[],releve:m.releve||null,indice:'',photosSupprimees:[]};
 etat.modal=()=>formMaillot();rendre()}
function ouvrirFormWish(w={}){etat.panneau=false;etat.form={id:w.id||null,type:w.type||'club',equipe:w.equipe||'',saison:w.saison||'',marque:w.marque||'',version:w.version||'Replica',couleur:w.couleur||'',taille:w.taille||'',budget:w.budget??'',alerte:w.alerte!==false,statut:w.statut||'suivi',notes:w.notes||'',imageUrl:w.imageUrl||'',flocage:w.flocage!=null?!!w.flocage:!!(w.joueur||w.numero),joueur:w.joueur||'',numero:w.numero||''};etat.modal=()=>formWish();rendre()}
const depuisWish=w=>({equipe:w.equipe,type:w.type,saison:w.saison,marque:w.marque,version:w.version,couleur:w.couleur,taille:w.taille,flocage:!!w.flocage,joueur:w.flocage?(w.joueur||''):'',numero:w.flocage?(w.numero||''):'',prixAchat:w.meilleurPrix??w.dernierPrix??'',valeur:w.dernierPrix??'',releve:w.releve||null,wishId:w.id});
async function enregistrerMaillot(){const v=lireForm('#f-maillot');if(!v.equipe){toast('Indique au moins l\'équipe.');return}const f=etat.form;const photos=[];
 for(const p of f.photos){if(p.id)photos.push(p.id);else if(p.data)photos.push(await PHOTOS.put(p.data))}for(const id of f.photosSupprimees||[])await PHOTOS.del(id);
 const floc=v.flocage==='Oui';
 const m={id:f.id||uid(),date:f.date||Date.now(),...v,type:v.type==='Sélection'?'selection':'club',flocage:floc,joueur:floc?(v.joueur||''):'',numero:floc?(v.numero||''):'',photos,similaires:f.similaires||[],releve:f.releve||null,prixAchat:v.prixAchat===''?null:+v.prixAchat,valeur:v.valeur===''?null:+v.valeur,favori:!!v.favori};
 if(f.id){const old=collection.find(x=>x.id===f.id);if(old&&old.dateEstimation)m.dateEstimation=old.dateEstimation}
 const i=collection.findIndex(x=>x.id===m.id);if(i>=0)collection[i]=m;else collection.unshift(m);
 if(f.wishId){const w=wishlist.find(x=>x.id===f.wishId);if(w&&w.statut!=='trouve'){w.statut='trouve';w.dateTrouve=Date.now()}}
 sauver();fermerModal();if(i<0)etat.page='collection';rendre();toast(i>=0?'Maillot modifié.':'Maillot ajouté à la collection.')}
function enregistrerWish(){const v=lireForm('#f-wish');if(!v.equipe){toast('Indique au moins l\'équipe.');return}const f=etat.form;const old=wishlist.find(x=>x.id===f.id)||{};const floc=v.flocage==='Oui';
 const w={...old,id:f.id||uid(),date:old.date||Date.now(),equipe:v.equipe,type:v.type==='Sélection'?'selection':'club',saison:v.saison,marque:v.marque,version:v.version,couleur:v.couleur,taille:v.taille,budget:v.budget===''?null:+v.budget,alerte:!!v.alerte,statut:v.statut||old.statut||'suivi',notes:v.notes,imageUrl:v.imageUrl||'',flocage:floc,joueur:floc?(v.joueur||''):'',numero:floc?(v.numero||''):''};
 const i=wishlist.findIndex(x=>x.id===w.id);if(i>=0)wishlist[i]=w;else wishlist.unshift(w);sauver();fermerModal();etat.page='wishlist';etat.statutWish=w.statut;rendre();toast(i>=0?'Envie modifiée.':'Envie ajoutée : lance « Vérifier les prix » quand tu veux.')}
async function ajouterPhotos(files){synchroForm();for(const file of files){if(etat.form.photos.length>=4)break;try{etat.form.photos.push({data:await compresser(file,1200,0.85)})}catch(e){toast('Photo illisible.')}}rendre()}
function sauverParams(afficher){const g=n=>$(`main [name="${n}"]`);if(!g('relais'))return;params.prenom=g('prenom').value.trim();params.relais=g('relais').value.trim();params.code=g('code').value.trim();params.relaisImages=g('relaisImages')?g('relaisImages').value.trim():'';params.photosWeb=g('photosWeb')?g('photosWeb').checked:true;params.ebay=g('ebay').checked;params.vinted=g('vinted')?g('vinted').checked:true;params.veille=g('veille').checked;sauver();if(afficher){toast('Paramètres enregistrés.');rendre()}}
async function testerImages(){const base=urlImages();if(!base)return 'Photos eBay : indique d\'abord l\'adresse du relais';
 try{const r=await fetch(base,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:params.code,action:'test'})});const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false)return 'Photos eBay : '+(j.erreur||('erreur '+r.status));
  if(!j.ebay)return `Photos eBay indisponibles : eBay non configuré sur le relais (v${j.version})`;return `Photos eBay OK (v${j.version}${j.kv?'':', KV PHOTOS non lié : les photos ne seront pas mémorisées côté relais'})`}catch(e){return 'Photos eBay : relais injoignable'}}
async function exporter(){const photos=await PHOTOS.tout();const data={app:'mes-maillots',version:VERSION,date:new Date().toISOString(),collection,wishlist,params:{...params,code:''},photos};
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));a.download=`mes-maillots-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);params.dernierExport=Date.now();sauver();rendre();toast('Export téléchargé.')}
async function importer(file){const d=JSON.parse(await file.text());if(!Array.isArray(d.collection))throw new Error('fichier non reconnu');
 if(!confirm(`Importer ${d.collection.length} maillots et ${(d.wishlist||[]).length} souhaits ? Cela remplace les données actuelles de l'appli.`))return;
 if(d.photos)for(const [id,data] of Object.entries(d.photos))await PHOTOS.putId(id,data);
 collection=d.collection;wishlist=d.wishlist||[];if(d.params)params={...params,...d.params,code:params.code||d.params.code||''};sauver();await migrer();rendre();toast('Import terminé.')}

/* ===================== ÉVÉNEMENTS ===================== */
let rechT;
function brancher(){
 root.addEventListener('click',async ev=>{if(ev.target.classList.contains('voile')){fermerModal();return}const el=ev.target.closest('[data-a]');if(!el)return;const a=el.dataset.a,id=el.dataset.id;
  switch(a){
   case 'page':etat.page=el.dataset.p;etat.panneau=false;window.scrollTo(0,0);rendre();break;
   case 'ajouter':ouvrirFormMaillot();break;
   case 'ajouter-wish':ouvrirFormWish();break;
   case 'fiche':etat.carrousel=0;etat.ficheId=id;etat.srcOuverte='';etat.modal=()=>{const m=collection.find(x=>x.id===etat.ficheId);return m?ficheMaillot(m):''};rendre();break;
   case 'favori':{const m=collection.find(x=>x.id===id);if(m){m.favori=!m.favori;sauver();rendre()}break}
   case 'modifier':{const m=collection.find(x=>x.id===id);if(m)ouvrirFormMaillot(m);break}
   case 'supprimer':{const m=collection.find(x=>x.id===id);if(m&&confirm(`Supprimer « ${m.equipe} » de la collection ?`)){for(const p of m.photos||[])await PHOTOS.del(p);collection=collection.filter(x=>x.id!==id);sauver();fermerModal();toast('Maillot supprimé.')}break}
   case 'estimer-fiche':{const m=collection.find(x=>x.id===id);if(m)await estimerMaillot(m);break}
   case 'estimer':{synchroForm();if(!etat.form.equipe){toast('Indique l\'équipe d\'abord.');return}if(!params.relais){toast('Configure le relais dans Paramètres.');return}toast('Recherche des annonces (eBay, Vinted, Leboncoin)…',true);
    const c=await collecter(etat.form);if(!etat.form)break;etat.form.releve=fusion(etat.form.releve,c);const s=analyserPrix(etat.form.releve.annonces);if(s)etat.form.valeur=s.mediane;rendre();
    toast(s?`Estimation ${euros(s.mediane)} · ${c.annonces.length} annonces, détail sous le bouton.`:'Aucune annonce exploitable : essaie « Compléter avec Vinted/Leboncoin » ou simplifie la saison.');break}
   case 'estim-src':{if($('#f-maillot')||$('#f-wish'))synchroForm();etat.srcOuverte=etat.srcOuverte===el.dataset.s?'':el.dataset.s;rendre();break}
   case 'estim-vinted':{const cible=el.dataset.c;let x=null,base=null;
    if(cible==='form'){synchroForm();x=etat.form;base=x&&x.releve}else if(cible.startsWith('wish:')){x=wishlist.find(w=>w.id===cible.slice(5));base=x&&x.releve}else{x=collection.find(m=>m.id===cible);base=x&&x.releve}
    if(!x||!x.equipe){toast('Indique l\'équipe d\'abord.');break}if(!params.relais){toast('Configure le relais dans Paramètres.');break}
    toast('Recherche Vinted/Leboncoin…',true);const c=await collecter(x,{sansEbay:true,large:!!(base&&base.vintedCherche)});const r=fusion(base,c);
    if(cible==='form'){if(!etat.form)break;etat.form.releve=r;const s=analyserPrix(r.annonces);if(s)etat.form.valeur=s.mediane}else if(cible.startsWith('wish:')){appliquerReleveWish(x,r);sauver()}else{appliquerReleveMaillot(x,r);sauver()}
    rendre();const nv=c.annonces.length;toast(nv?`${nv} annonce${nv>1?'s':''} Vinted/Leboncoin ajoutée${nv>1?'s':''}.`:(c.erreurs[0]||'Rien trouvé sur Vinted/Leboncoin pour cette recherche.'));break}
   case 'carrousel':{const n=((collection.find(x=>x.id===etat.ficheId)||{}).photos||[]).length;if(n){etat.carrousel=(etat.carrousel+(+el.dataset.d)+n)%n;rendre()}break}
   case 'img-suivante':{ev.stopPropagation();const c=IMG[norm(el.dataset.q)];if(c&&c.images.length>1){c.i=((c.i||0)+1)%c.images.length;ecrire(K.img,IMG);rendre();toast(`Photo ${c.i+1}/${c.images.length}${c.images[c.i].source?' · '+c.images[c.i].source:''}`)}else toast(c?'Une seule photo disponible pour ce maillot.':'Photo pas encore chargée, réessaie dans un instant.');break}
   case 'wish-statut':etat.statutWish=el.dataset.s;rendre();break;
   case 'wish-modifier':{const w=wishlist.find(x=>x.id===id);if(w)ouvrirFormWish(w);break}
   case 'wish-annonces':{etat.wishId=id;etat.srcOuverte='';etat.modal=()=>{const w=wishlist.find(x=>x.id===etat.wishId);return w?modalAnnoncesWish(w):''};rendre();break}
   case 'wish-trouve':{const w=wishlist.find(x=>x.id===id);if(w){w.statut='trouve';w.dateTrouve=Date.now();sauver();etat.statutWish='trouve';rendre();if(confirm('Bravo ! Veux-tu l\'ajouter tout de suite à ta collection ?'))ouvrirFormMaillot(depuisWish(w))}break}
   case 'wish-vers-collection':{const w=wishlist.find(x=>x.id===id);if(w)ouvrirFormMaillot(depuisWish(w));break}
   case 'wish-reprendre':{const w=wishlist.find(x=>x.id===id);if(w){w.statut='suivi';sauver();etat.statutWish='suivi';rendre()}break}
   case 'wish-alerte':{const w=wishlist.find(x=>x.id===id);if(w){w.alerte=!w.alerte;sauver();rendre();toast(w.alerte?'Alerte activée.':'Alerte désactivée.')}break}
   case 'wish-supprimer':{const w=wishlist.find(x=>x.id===id);if(w&&confirm(`Retirer « ${w.equipe} » de la wishlist ?`)){wishlist=wishlist.filter(x=>x.id!==id);sauver();rendre()}break}
   case 'verifier':await verifierPrix();break;
   case 'verifier-un':await verifierPrix([id]);break;
   case 'sugg-wish':{const s=etat.suggCache[+el.dataset.i];if(s){const eq=trouverEquipe(s.equipe);wishlist.unshift({id:uid(),date:Date.now(),equipe:s.equipe,type:eq?eq.type:'club',saison:s.saison||'',marque:s.marque||'',version:'Replica',couleur:'',taille:'',budget:null,alerte:true,statut:'suivi',notes:'',imageUrl:'',flocage:!!s.joueur,joueur:s.joueur||'',numero:''});sauver();rendre();toast(`${s.equipe} ajouté à la wishlist.`)}break}
   case 'sugg-col':{const s=etat.suggCache[+el.dataset.i];if(s){const eq=trouverEquipe(s.equipe);ouvrirFormMaillot({equipe:s.equipe,type:eq?eq.type:'club',saison:s.saison||'',marque:s.marque||'',joueur:s.joueur||'',flocage:!!s.joueur})}break}
   case 'idees':etat.seed++;rendre();break;
   case 'notifs':etat.panneau=!etat.panneau;rendre();break;
   case 'notif':{const lus=lire(K.notifs,[]);if(!lus.includes(id)){lus.push(id);ecrire(K.notifs,lus)}etat.panneau=false;if(el.dataset.p)etat.page=el.dataset.p;rendre();break}
   case 'notif-lu-tout':ecrire(K.notifs,notifications().map(n=>n.id));rendre();break;
   case 'fermer':fermerModal();break;
   case 'lens':await identifierLens();break;
   case 'appliquer':appliquerLens(+el.dataset.i);break;
   case 'photo-suppr':{synchroForm();const p=etat.form.photos.splice(+el.dataset.i,1)[0];if(p&&p.id)etat.form.photosSupprimees.push(p.id);rendre();break}
   case 'enregistrer':await enregistrerMaillot();break;
   case 'wish-enregistrer':enregistrerWish();break;
   case 'sauver-params':sauverParams(true);break;
   case 'tester':{sauverParams(false);const z=$('#res-test');if(z)z.innerHTML='<div class="aide">Test en cours…</div>';let txt='',det='',ok=true;
    try{const j=await relais('test');txt=`Connexion OK · relais v${esc(j.version)} · SerpApi ${j.serpapi?'OK':'absent'} · Lens ${j.lens?'OK':'absent'} · eBay ${j.ebay?'OK':'non configuré'}`;
     if(Array.isArray(j.details)&&j.details.length)det=j.details.map(d=>`<div class="aide" style="margin:2px 0">· ${esc(d)}</div>`).join('');
     if(j.version&&+j.version<6)det+='<div class="aide" style="color:var(--rouge)">Relais ancien : recolle le code v6 du Worker maillots-relais puis « Deploy ».</div>'}
    catch(e){ok=false;txt='Échec : '+esc(e.message)}
    const im=await testerImages();if(z)z.innerHTML=`<div class="aide" style="color:var(--${ok?'vert':'rouge'})">${txt}</div>${det}<div class="aide" style="color:var(--${im.startsWith('Photos eBay OK')?'vert':'rouge'})">${esc(im)}</div>`;break}
   case 'exporter':await exporter();break;
   case 'vider-wiki':for(const k in WIKI)delete WIKI[k];ecrire(K.wiki,WIKI);rendre();toast('Cache Wikipédia vidé.');break;
   case 'vider-img':if(confirm('Oublier les photos eBay mémorisées sur ce téléphone ? Elles seront rechargées depuis le relais (gratuitement).')){for(const k in IMG)delete IMG[k];ecrire(K.img,IMG);rendre();toast('Photos eBay oubliées.')}break;
   case 'maj':{try{if(navigator.serviceWorker){const rs=await navigator.serviceWorker.getRegistrations();for(const r of rs)await r.unregister()}if(window.caches){for(const k of await caches.keys())await caches.delete(k)}}catch(e){}location.reload();break}
   case 'reset-filtres':etat.recherche='';etat.filtres={equipe:'',saison:'',couleur:'',categorie:''};rendre();break;
  }});
 root.addEventListener('input',ev=>{if(ev.target.id==='recherche'){etat.recherche=ev.target.value;clearTimeout(rechT);rechT=setTimeout(()=>{const z=$('#zone-liste');if(z){z.innerHTML=listeCollection();chargerPhotos();chargerVisuels()}},150)}});
 root.addEventListener('change',async ev=>{const t=ev.target;if(t.classList.contains('pilule')){etat.filtres[t.dataset.f]=t.value;rendre()}else if(t.name==='flocage'&&etat.form){synchroForm();rendre()}else if(t.id==='fichier-photo'){await ajouterPhotos([...t.files])}else if(t.id==='fichier-import'&&t.files[0]){try{await importer(t.files[0])}catch(e){toast('Import impossible : '+e.message)}}});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&etat.modal)fermerModal()});
}

/* ===================== STYLES ===================== */
const CSS=`
:root{--vert:#143d2f;--vert2:#1f5a44;--or:#c9a227;--lime:#c6e36b;--fond:#f5f3ee;--beige:#efe9dc;--texte:#14201b;--gris:#6b7570;--ligne:#e6e2d9;--rouge:#e11d48}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--fond);color:var(--texte);font-family:Inter,system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5}
h1,h2,h3{font-family:'Playfair Display',Georgia,serif;font-weight:600;margin:0;letter-spacing:-.01em}
.entete{position:sticky;top:0;z-index:20;background:rgba(245,243,238,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--ligne)}
.entete-in{max-width:1180px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:14px}
.brand{cursor:pointer;display:flex;flex-direction:column;line-height:1.1}.brand b{font-family:'Playfair Display',Georgia,serif;font-size:21px;font-weight:700}.brand small{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gris);margin-top:2px}
.nav{display:flex;gap:4px;margin-left:auto;background:#fff;border:1px solid var(--ligne);border-radius:999px;padding:4px}.nav button{border:0;background:none;padding:8px 16px;border-radius:999px;font:inherit;font-size:14px;cursor:pointer;color:var(--gris)}.nav button.on{background:var(--beige);color:var(--texte);font-weight:600}
.bell{position:relative;width:40px;height:40px;border-radius:50%;border:1px solid var(--ligne);background:#fff;cursor:pointer;color:var(--gris);display:grid;place-items:center;margin-left:auto}.nav+.btn-ajouter{margin-left:0}.bell+.nav{margin-left:0}.bell.on{color:#000;border-color:#000}.bell.on svg{fill:#000}.bell .pt{position:absolute;top:8px;right:9px;width:8px;height:8px;border-radius:50%;background:var(--rouge);border:2px solid #fff}
.ic{width:18px;height:18px;flex:none}
.btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--ligne);background:#fff;color:var(--texte);padding:10px 16px;border-radius:999px;font:inherit;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;white-space:nowrap}.btn:hover{border-color:#b9b4a8}.btn-vert{background:var(--vert);color:#fff;border-color:var(--vert)}.btn-vert:hover{background:var(--vert2)}.btn-ic{padding:10px;width:42px;justify-content:center}.btn-rouge{color:var(--rouge)}.btn[disabled]{opacity:.5;cursor:default}
main{max-width:1180px;margin:0 auto;padding:28px 20px 110px}
.eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--gris);font-weight:600}
.titre-page{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:22px}.titre-page h1{font-size:40px;line-height:1.1;margin:6px 0 10px}.titre-page p{margin:0;color:var(--gris);max-width:720px}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px}.kpi{background:#fff;border:1px solid var(--ligne);border-radius:16px;padding:18px 20px}.kpi .lab,.wprix .lab{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gris);font-weight:600}.kpi .val{font-family:'Playfair Display',Georgia,serif;font-size:30px;margin-top:6px;line-height:1.1}.kpi .val.lime{color:#8db63c}.kpi .val.rouge{color:var(--rouge)}.kpi .sub{font-size:12px;color:var(--gris);margin-top:4px}
.avert{display:flex;gap:12px;align-items:flex-start;background:#e9f1da;border:1px solid #d3e3b5;border-radius:14px;padding:14px 16px;color:#2f4a1e;font-size:14px;margin-bottom:16px}.avert .ic{margin-top:2px}
.recherche{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--ligne);border-radius:999px;padding:12px 18px;margin-bottom:12px;color:var(--gris)}.recherche input{border:0;outline:0;flex:1;font:inherit;font-size:15px;background:none;color:var(--texte);min-width:0}
.filtres{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.pilule{appearance:none;-webkit-appearance:none;border:1px solid var(--ligne);background:#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2314201b' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>") no-repeat right 14px center;padding:9px 38px 9px 16px;border-radius:999px;font:inherit;font-size:14px;cursor:pointer;color:var(--texte);max-width:220px}
.compte{color:var(--gris);font-size:14px;margin-bottom:12px}
.grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px}
.carte{background:#fff;border:1px solid var(--ligne);border-radius:18px;overflow:hidden;cursor:pointer;transition:transform .15s,box-shadow .15s}.carte:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.08)}
.img{position:relative;aspect-ratio:4/3;background:var(--beige);overflow:hidden}.img>img{width:100%;height:100%;object-fit:cover;display:block}
.visu{width:100%;height:100%;display:grid;place-items:center;position:relative;background:#fff}.visu-img{width:100%;height:100%;object-fit:cover;display:block;background:#fff}.visu-img.logo{object-fit:contain;padding:10%}.visu-drapeau{width:100%;height:100%;object-fit:cover;display:block}.visu-maillot{width:60%;max-width:200px}.visu-maillot svg{width:100%;height:auto;display:block}
.visu:has(.visu-maillot):not(:has(.visu-img)){background:var(--beige)}.visu>.visu-img+.visu-maillot,.visu>.visu-img+.visu-drapeau{display:none}
.badge{position:absolute;top:10px;left:10px;background:rgba(245,243,238,.96);border-radius:999px;padding:4px 10px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;z-index:2}
.heart{position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#555;display:grid;place-items:center;cursor:pointer;z-index:2}.heart.on{color:var(--rouge)}.heart.on svg{fill:var(--rouge);animation:pop .3s}@keyframes pop{50%{transform:scale(1.3)}}
.corps{padding:14px 16px 16px}.corps h3{font-size:19px;line-height:1.2}.corps h3 small{font-family:Inter,sans-serif;font-size:13px;color:var(--gris);font-weight:500}.meta{color:var(--gris);font-size:13px;margin-top:3px}.bas{display:flex;justify-content:space-between;align-items:center;margin-top:12px;gap:8px}.bas b{font-family:'Playfair Display',Georgia,serif;font-size:18px}
.chip{background:var(--beige);border-radius:999px;padding:3px 10px;font-size:12px;white-space:nowrap}
.floc{display:inline-flex;align-items:center;gap:6px;background:#e9f1da;color:#2f4a1e;border-radius:999px;padding:3px 10px;font-size:12px;font-weight:500}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.chips button{border:1px solid var(--ligne);background:#fff;padding:8px 16px;border-radius:999px;font:inherit;font-size:14px;cursor:pointer}.chips button.on{background:var(--vert);color:#fff;border-color:var(--vert)}
.aide{color:var(--gris);font-size:13px;margin:6px 0}
.wgrille{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}
.wcarte{background:#fff;border:1px solid var(--ligne);border-radius:18px;padding:20px}.wtete{display:flex;gap:14px;align-items:flex-start}.wtete h3{font-size:22px;line-height:1.15}
.wvisu{width:72px;height:72px;border-radius:14px;overflow:hidden;background:var(--beige);flex:none}.wvisu.grand{width:96px;height:96px}.wvisu .visu-maillot{width:78%}.wvisu .visu-img{object-fit:cover}.wvisu .visu-img.logo{object-fit:contain;padding:8%}
.wbell{margin-left:auto;width:40px;height:40px;border-radius:50%;border:0;background:#e9f1da;color:#2f4a1e;display:grid;place-items:center;cursor:pointer;flex:none}.wbell svg{fill:#2f4a1e}.wbell.off{background:var(--beige);color:#999}.wbell.off svg{fill:none}
.wsep{border-top:1px solid var(--ligne);margin:16px 0}.wprix{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.wprix .val{font-family:'Playfair Display',Georgia,serif;font-size:22px;margin-top:4px}.arelever{font-family:Inter,sans-serif;font-size:14px;color:var(--gris);font-style:italic}
.wnote{font-size:13px;color:#3f4a44;margin-top:12px;line-height:1.5}.wnote a{color:var(--vert);display:inline-flex;align-items:center;gap:4px}.wnote .ic{width:14px;height:14px}
.wactions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
.estim{background:var(--fond);border-radius:14px;padding:14px;margin-top:14px;font-size:14px;text-align:left}.estim-glob{margin:8px 0 10px}.estim-glob b{font-family:'Playfair Display',Georgia,serif;font-size:20px}
.src{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--ligne);flex-wrap:wrap;font-size:13px}.src>b{min-width:84px}
.annonces{display:flex;flex-direction:column;gap:6px;margin:2px 0 10px}.ann{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--ligne);border-radius:10px;padding:8px 10px;color:var(--texte);text-decoration:none;font-size:13px}.ann:hover{border-color:#b9b4a8}.ann .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ann .e{color:var(--gris);font-size:12px;white-space:nowrap}.ann b{white-space:nowrap}.ann .ic{width:14px;height:14px;color:var(--vert)}.ann.sus{opacity:.5}
.hero{background:var(--vert);color:#fff;border-radius:24px;padding:40px;position:relative;overflow:hidden;margin-bottom:28px}.hero h1{font-size:40px;line-height:1.1;margin:8px 0 12px;max-width:620px}.hero p{max-width:620px;opacity:.85;margin:0}.stats{display:flex;gap:22px;flex-wrap:wrap;margin-top:22px;font-size:14px;position:relative;z-index:1}.stats span::before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--or);margin-right:8px}.deco{position:absolute;right:-30px;bottom:-50px;width:280px;opacity:.08}
.section{display:flex;justify-content:space-between;align-items:center;margin:28px 0 14px;gap:10px}.section h2{font-size:26px}
.sugg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}.sugg-carte{cursor:default}.cit{font-style:italic;color:#3f4a44;font-size:13.5px;margin-top:8px;font-family:'Playfair Display',Georgia,serif;line-height:1.45}.raison{font-size:12px;color:var(--gris);margin-top:6px}
.vide{text-align:center;padding:50px 20px;background:#fff;border:1px dashed var(--ligne);border-radius:18px;color:var(--gris)}.vide h3{color:var(--texte);margin:14px 0 6px;font-size:22px}.vide .visu{width:100px;height:100px;margin:0 auto;background:none}.vide .visu-maillot{width:100%}
.carte-param{background:#fff;border:1px solid var(--ligne);border-radius:18px;padding:22px;margin-bottom:16px}.carte-param h2{font-size:22px;margin-bottom:12px}
.form{display:grid;grid-template-columns:1fr 1fr;gap:12px}.form label{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--gris);font-weight:600;letter-spacing:.04em}.form input,.form select,.form textarea{border:1px solid var(--ligne);border-radius:12px;padding:10px 12px;font:inherit;font-size:15px;color:var(--texte);background:#fafaf7;width:100%}.form textarea{min-height:70px;resize:vertical}.form .plein{grid-column:1/-1}.form .coche{flex-direction:row;align-items:center;gap:10px;font-weight:500;color:var(--texte);letter-spacing:0;font-size:14px}.form .coche input{width:18px;height:18px}
.quota{height:8px;background:var(--beige);border-radius:999px;overflow:hidden;margin-top:10px}.quota i{display:block;height:100%;background:var(--vert)}
.voile{position:fixed;inset:0;background:rgba(20,32,27,.55);z-index:50;display:flex;align-items:flex-start;justify-content:center;padding:30px 14px;overflow:auto}
.modal{background:#fff;border-radius:22px;padding:26px;width:100%;max-width:700px;position:relative}.modal h2{font-size:28px;margin:4px 0 14px;padding-right:44px}.fermer{position:absolute;top:14px;right:14px;z-index:3}
.carrousel{position:relative;aspect-ratio:4/3;border-radius:16px;overflow:hidden;background:var(--beige);display:grid;place-items:center;margin-bottom:16px}.carrousel>img{width:100%;height:100%;object-fit:contain;display:block}.carrousel .visu-maillot{width:45%}.carrousel .visu-drapeau{width:60%;height:auto}.carrousel .visu-img{object-fit:contain}
.fl{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.9);cursor:pointer;display:grid;place-items:center;z-index:2}.fl.g{left:10px}.fl.d{right:10px}.pts{position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:6px}.pts i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.6)}.pts i.on{background:#fff}
.ftete{display:flex;gap:14px;align-items:center;margin-bottom:14px}.ftete h2{margin:2px 0 4px;padding-right:0}.det{display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;font-size:14px;margin:14px 0}.det .lab{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gris)}
.photos-edit{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}.ph{width:96px;height:96px;border-radius:14px;overflow:hidden;position:relative;background:var(--beige);border:1px dashed var(--ligne);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:12px;color:var(--gris);cursor:pointer}.ph img{width:100%;height:100%;object-fit:cover}.ph .x{position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;border:0;background:rgba(255,255,255,.9);display:grid;place-items:center;cursor:pointer}.ph .x .ic{width:12px;height:12px}
.lens-res{background:var(--fond);border-radius:14px;padding:14px;margin:12px 0;font-size:14px}.props{display:flex;flex-direction:column;gap:8px;margin-top:8px}.prop{display:flex;align-items:center;gap:12px;background:#fff;border-radius:12px;padding:10px}.mini{width:44px;height:44px;border-radius:10px;overflow:hidden;background:var(--beige);flex:none}.mini .visu-maillot{width:80%}.mini .visu-img.logo{padding:6%}
.simil{display:flex;gap:8px;overflow-x:auto;padding:8px 0}.simil img{width:90px;height:90px;object-fit:cover;border-radius:10px;border:1px solid var(--ligne);flex:none}
.panneau{position:fixed;top:70px;right:20px;width:360px;max-width:calc(100% - 40px);background:#fff;border:1px solid var(--ligne);border-radius:18px;padding:18px;z-index:40;box-shadow:0 20px 50px rgba(0,0,0,.15);max-height:70vh;overflow:auto}.notif{padding:12px 0;border-top:1px solid var(--ligne);cursor:pointer;display:flex;flex-direction:column;gap:3px;font-size:14px}.notif span{color:var(--gris);font-size:13px}.notif.lu{opacity:.5}
.toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--texte);color:#fff;padding:12px 20px;border-radius:999px;font-size:14px;z-index:100;display:none;max-width:90%;text-align:center}
.barre{display:none}
@media(max-width:760px){.nav,.btn-ajouter{display:none}.barre{display:flex;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--ligne);z-index:30;padding:6px 6px calc(6px + env(safe-area-inset-bottom))}.barre button{flex:1;border:0;background:none;font:inherit;font-size:11px;color:var(--gris);display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 0;cursor:pointer}.barre button.on{color:var(--vert);font-weight:600}.barre .plus{flex:none;width:54px;height:54px;border-radius:50%;background:var(--vert);color:#fff;margin-top:-22px;display:grid;place-items:center;box-shadow:0 6px 16px rgba(20,61,47,.35)}.barre .plus .ic{width:24px;height:24px}
.kpis{grid-template-columns:1fr 1fr}.kpi .val{font-size:24px}.titre-page h1,.hero h1{font-size:30px}.hero{padding:26px}.form,.det{grid-template-columns:1fr}.wgrille{grid-template-columns:1fr}.panneau{top:64px;right:10px}.modal{padding:20px}.voile{padding:14px 8px}.toast{bottom:100px}.src>b{min-width:70px}}
`;
function styles(){$$('style[id^="style-v"]').forEach(s=>s.remove());if(!$('#fonts-mm')){const l=document.createElement('link');l.id='fonts-mm';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600;700&display=swap';document.head.appendChild(l)}const s=document.createElement('style');s.id='style-v34';s.textContent=CSS;document.head.appendChild(s)}

/* ===================== DÉMARRAGE ===================== */
async function demarrer(){styles();root=$('#app');if(!root){root=document.createElement('div');root.id='app';document.body.appendChild(root)}
 brancher();await migrer();rendre();
 if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
 setTimeout(()=>veilleAuto(),4000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',demarrer);else demarrer();
})();
