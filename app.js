'use strict';
(function(){
const VERSION='3.5';
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
 /* ---------- Analyse des dictionnaires ---------- */
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
let collection=lire(K.col,[]),wishlist=lire(K.wish,[]),params=Object.assign({relais:'',relaisImages:'',code:'',prenom:'',dernierExport:0,ebay:true,vinted:true,google:true,veille:true,photosWeb:true},lire(K.params,{}));
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
  if(m.flocage==null){m.flocage=!!(m.joueur||m.numero);ch=true}
  const pa=m.prixAchat??m.prix??m.achat;if(pa!=null&&m.prixAchat==null){m.prixAchat=Number(pa)||0;ch=true}}
 for(const w of wishlist){if(!w.statut){w.statut='suivi';ch=true}if(w.alerte==null){w.alerte=true;ch=true}if(!w.version){w.version='Replica';ch=true}if(w.imageUrl==null){w.imageUrl='';ch=true}
  if(w.flocage==null){w.flocage=!!(w.joueur||w.numero);w.joueur=w.joueur||'';w.numero=w.numero||'';ch=true}
  const bu=w.budget??w.prixMax;if(bu!=null&&w.budget==null){w.budget=Number(bu)||0;ch=true}}
 if(!params.v34){params.v34=true;params.ebay=true;if(params.vinted==null)params.vinted=true;ch=true}
 if(!params.v35){params.v35=true;if(params.google==null)params.google=true;ch=true}
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
 return liste.map(a=>{const titre=a.titre||a.title||'';const texte=titre+' '+(a.snippet||a.extrait||a.description||'');let prix=a.prix??a.price??a.extracted_price;if(typeof prix==='string')prix=parsePrix(prix);if(prix==null||isNaN(prix))prix=parsePrix(texte);
  const lien=a.lien||a.link||a.url||'';
  return{titre:String(titre).slice(0,140),prix:Number(prix),lien,source:forceSrc||sourceDe(a.source,lien),etat:String(a.etat||a.condition||'').slice(0,40),sus:SUSPECTS.test(norm(texte))}}).filter(a=>a.prix>0)}
function analyserPrix(annonces){const ok=(annonces||[]).filter(a=>!(a.sus||SUSPECTS.test(norm(a.texte||a.titre))));const prix=ok.map(a=>a.prix).sort((a,b)=>a-b);if(!prix.length)return null;
 const med=prix[Math.floor(prix.length/2)];const fiables=ok.filter(a=>a.prix>=med*0.4&&a.prix<=med*3).sort((a,b)=>a.prix-b.prix);const pf=fiables.map(a=>a.prix);const mediane=pf.length?pf[Math.floor(pf.length/2)]:med;
 const parSource={};ok.forEach(a=>{parSource[a.source]=(parSource[a.source]||0)+1});
 return{mediane,min:pf.length?pf[0]:med,max:pf.length?pf[pf.length-1]:med,nb:ok.length,ecartes:(annonces||[]).length-ok.length,parSource,fiables}}
function requetesRepli(x){const eq=trouverEquipe(x.equipe);const nomEq=String(x.equipe||'').trim();const j=joueurDe(x);const s=String(x.saison||'').trim();const s1=(s.match(/(?:19|20)\d{2}/)||[''])[0];
 const out=[];const add=a=>{const q=a.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();if(q&&!out.includes(q))out.push(q)};
 add([nomEq,'maillot',s,x.marque,j]);add([nomEq,'maillot',s1,x.marque,j]);add([nomEq,'maillot',s1,x.marque]);add([nomEq,'maillot',s1]);
 if(eq){eq.alias.filter(a=>!/^[A-Z0-9]{2,5}$/.test(a)&&norm(a)!==norm(nomEq)).slice(0,2).forEach(a=>add([a,eq.type==='selection'?'jersey':'shirt',s1,j]))}
 add([nomEq,'maillot']);return out.slice(0,6)}
/* Boutiques / prix neuf via Google (1 recherche SerpApi, cache 7 jours côté relais) — repère seulement, jamais dans la médiane */
async function collecterBoutiques(x){const out={boutiques:[],liensBoutiques:[],boutiquesCherche:false,dateBoutiques:0,boutiquesCache:false,serpapi:0,erreurs:[]};
 if(params.google===false||!params.relais)return out;
 if(quota().utilise>=QUOTA_MAX-2){out.erreurs.push('Boutiques Google non cherchées : quota SerpApi du mois épuisé.');return out}
 try{const q=requetesRepli(x)[0];const j=await relais('google',{q});out.boutiquesCherche=true;out.dateBoutiques=Date.now();out.boutiquesCache=!!j.cache;out.serpapi=j.cache?0:(j.serpapi_utilise?1:0);
  out.boutiques=(j.boutiques||[]).map(b=>({titre:String(b.titre||'').slice(0,140),lien:String(b.lien||''),prix:Number(b.prix)||0,source:String(b.source||b.domaine||'Boutique').slice(0,40),extrait:String(b.extrait||'').slice(0,160)})).filter(b=>b.lien).sort((a,b)=>(a.prix||1e9)-(b.prix||1e9)).slice(0,20);
  out.liensBoutiques=(j.liens||[]).map(b=>({titre:String(b.titre||'').slice(0,140),lien:String(b.lien||''),source:String(b.source||b.domaine||'Web').slice(0,40)})).filter(b=>b.lien).slice(0,8)}
 catch(e){out.erreurs.push('Boutiques Google : '+e.message)}
 return out}
async function collecter(x,o={}){const reqs=requetesRepli(x);const out={date:Date.now(),annonces:[],erreurs:[],serpapi:0,vintedCherche:false,sources:[],requete:reqs[0]};
 if(params.ebay!==false&&!o.sansEbay){out.sources.push('eBay');try{const j=await relais('ebay',{q:reqs[0],repli:reqs.slice(1)});out.annonces=out.annonces.concat(normaliserAnnonces(j,'eBay'))}catch(e){out.erreurs.push('eBay : '+e.message)}}
 if(params.vinted!==false&&!o.sansVinted){if(quota().utilise>=QUOTA_MAX-2)out.erreurs.push('Vinted/Leboncoin non cherchés : quota SerpApi du mois épuisé.');
  else{try{const q=o.large?(reqs[1]||reqs[0]):reqs[0];const j=await relais('annonces',{q,repli:o.large?reqs.slice(2):reqs.slice(1)});out.vintedCherche=true;out.sources.push('Vinted','Leboncoin','Web');out.serpapi=j.cache?0:(Number(j.serpapi_recherches)||(j.serpapi_utilise?1:0));out.annonces=out.annonces.concat(normaliserAnnonces(j))}catch(e){out.erreurs.push('Vinted/Leboncoin : '+e.message)}}}
 if(o.google&&params.google!==false){const b=await collecterBoutiques(x);Object.assign(out,{boutiques:b.boutiques,liensBoutiques:b.liensBoutiques,boutiquesCherche:b.boutiquesCherche,dateBoutiques:b.dateBoutiques,boutiquesCache:b.boutiquesCache});out.serpapi+=b.serpapi;out.erreurs.push(...b.erreurs)}
 const vus=new Set();out.annonces=out.annonces.filter(a=>{const k=a.lien||a.titre;if(vus.has(k))return false;vus.add(k);return true}).slice(0,40);return out}
function fusion(base,c){const refresh=new Set(c.sources||[]);const anciennes=((base&&base.annonces)||[]).filter(a=>!refresh.has(a.source));const vus=new Set();
 const annonces=[...(c.annonces||[]),...anciennes].filter(a=>{const k=a.lien||a.titre;if(vus.has(k))return false;vus.add(k);return true}).slice(0,40);
 const r={date:Date.now(),annonces,erreurs:c.erreurs||[],serpapi:c.serpapi||0,vintedCherche:!!(c.vintedCherche||(base&&base.vintedCherche)),requete:c.requete||(base&&base.requete)||''};
 const b=c.boutiquesCherche?c:(base||{});r.boutiques=b.boutiques||[];r.liensBoutiques=b.liensBoutiques||[];r.boutiquesCherche=!!b.boutiquesCherche;r.dateBoutiques=b.dateBoutiques||0;r.boutiquesCache=!!b.boutiquesCache;
 return r}
function appliquerReleveMaillot(m,r){m.releve=r;const s=analyserPrix(r.annonces);if(s){m.valeur=s.mediane;m.dateEstimation=r.date}return s}
function appliquerReleveWish(w,r){const s=analyserPrix(r.annonces);w.dernierReleve=r.date;w.releve=r;
 if(s){w.dernierPrix=s.mediane;w.meilleurPrix=s.min;if(w.prixRef==null)w.prixRef=s.mediane;w.nbAnnonces=s.nb;w.dernierSource=Object.entries(s.parSource).map(([k,v])=>`${k} (${v} annonce${v>1?'s':''})`).join(' et ');
  w.meilleureAnnonce=s.fiables[0]?{titre:s.fiables[0].titre,prix:s.fiables[0].prix,lien:s.fiables[0].lien,source:s.fiables[0].source}:null;
  (w.historique=w.historique||[]).push({date:r.date,prix:s.mediane,min:s.min});if(w.historique.length>30)w.historique.shift()}
 else{w.nbAnnonces=0;w.dernierSource='aucune annonce exploitable'}return s}
async function estimerMaillot(m){if(!params.relais){toast('Configure le relais dans Paramètres.');return}toast(`Recherche des annonces (eBay, Vinted, Leboncoin${params.google!==false?' + boutiques Google':''})…`,true);
 const c=await collecter(m,{google:true});const s=appliquerReleveMaillot(m,fusion(m.releve,c));sauver();rendre();
 toast(s?`Valeur estimée ${euros(s.mediane)} (occasion) · ${c.annonces.length} annonces, détail dans la fiche.`:'Aucune annonce d\'occasion exploitable : essaie « Compléter avec Vinted/Leboncoin » ou simplifie la saison.')}
async function verifierPrix(ids,auto){if(!params.relais){if(!auto)toast('Configure d\'abord le relais dans Paramètres.');return}
 const cibles=wishlist.filter(w=>w.statut==='suivi'&&(!ids||ids.includes(w.id))).sort((a,b)=>(a.dernierReleve||0)-(b.dernierReleve||0)).slice(0,6);
 if(!cibles.length){toast('Aucun maillot suivi à vérifier.');return}
 let i=0;for(const w of cibles){i++;toast(`Vérification ${i}/${cibles.length} : ${w.equipe}…`,true);const c=await collecter(w,{sansVinted:!!auto});appliquerReleveWish(w,fusion(w.releve,c))}
 sauver();rendre();toast(auto?'Veille eBay du jour terminée.':'Prix mis à jour.')}
async function veilleAuto(){if(params.veille===false||!params.relais)return;if(Date.now()-lire(K.veille,0)<24*3600e3)return;if(!wishlist.some(w=>w.statut==='suivi'))return;ecrire(K.veille,Date.now());await verifierPrix(null,true)}

const SOURCES=['eBay','Vinted','Leboncoin','Web'];
function actionsVinted(cible,r){return params.vinted!==false&&params.relais?`<button type="button" class="btn" data-a="estim-vinted" data-c="${esc(cible)}">${I('search')} Compléter avec Vinted/Leboncoin${r&&r.vintedCherche?' (requête plus large)':''}</button>`:''}
function actionsGoogle(cible){return params.google!==false&&params.relais?`<button type="button" class="btn" data-a="estim-google" data-c="${esc(cible)}">${I('bag')} Compléter avec Google (boutiques)</button>`:''}
function blocEstimation(r,pref,o={}){if(!r)return '';const an=r.annonces||[];const g=analyserPrix(an);
 let h=`<div class="estim"><div class="eyebrow">${o.titre||'Estimation'} · ${dateFr(r.date)} · ${an.length} annonce${an.length>1?'s':''}${r.serpapi?` · ${r.serpapi} recherche${r.serpapi>1?'s':''} SerpApi`:(r.vintedCherche?' · Vinted/Leboncoin depuis le cache (0 SerpApi)':'')}</div>`;
 h+=g?`<div class="estim-glob">Estimation globale (occasion) : <b>${euros(g.mediane)}</b> <span class="aide" style="margin:0">médiane de ${g.fiables.length} annonces fiables${g.ecartes?`, ${g.ecartes} écartée${g.ecartes>1?'s':''}`:''} · fourchette ${euros(g.min)} – ${euros(g.max)}</span></div>`:`<div class="estim-glob">Aucune annonce d'occasion exploitable pour le moment.</div>`;
 for(const s of SOURCES){const l=an.filter(a=>a.source===s);
  if(!l.length){if(s==='Web')continue;h+=`<div class="src"><b>${s}</b><span class="aide" style="margin:0">${s==='eBay'?(params.ebay===false?'désactivé dans Paramètres':'aucune annonce trouvée'):(r.vintedCherche?'aucune annonce trouvée':'pas encore cherché')}</span></div>`;continue}
  const st=analyserPrix(l);const cle=pref+'|'+s;const ouvert=etat.srcOuverte===cle;
  h+=`<div class="src"><b>${s}</b><span>${l.length} annonce${l.length>1?'s':''}${st?` · médiane ${euros(st.mediane)} · ${euros(st.min)} – ${euros(st.max)}`:' · toutes écartées (suspectes)'}</span><button type="button" class="btn" style="margin-left:auto;padding:6px 12px;font-size:12px" data-a="estim-src" data-s="${esc(cle)}">${ouvert?'Masquer':'Voir les annonces'}</button></div>`;
  if(ouvert)h+=`<div class="annonces">${[...l].sort((a,b)=>a.prix-b.prix).map(a=>`<a class="ann${a.sus?' sus':''}" href="${esc(a.lien||'#')}" target="_blank" rel="noopener" title="${a.sus?'Écartée du calcul (mot suspect dans le titre)':'Ouvrir l\'annonce'}"><span class="t">${esc(a.titre||'Annonce')}</span>${a.etat?`<span class="e">${esc(a.etat)}</span>`:''}<b>${euros(a.prix)}</b>${I('ext')}</a>`).join('')}</div>`}
 /* Boutiques (prix neuf) : repère affiché à part, hors calcul */
 const bq=r.boutiques||[],lb=r.liensBoutiques||[];
 if(params.google!==false||r.boutiquesCherche){const cle=pref+'|Boutiques';const ouvert=etat.srcOuverte===cle;const px=bq.map(b=>b.prix).filter(p=>p>0).sort((a,b)=>a-b);
  if(!r.boutiquesCherche)h+=`<div class="src"><b>Boutiques · prix neuf (Google)</b><span class="aide" style="margin:0">pas encore cherché</span></div>`;
  else{h+=`<div class="src"><b>Boutiques · prix neuf (Google)</b><span>${px.length?`à partir de <b>${euros(px[0])}</b>${px.length>1?` · ${euros(px[0])} – ${euros(px[px.length-1])}`:''} · ${px.length} produit${px.length>1?'s':''}`:(lb.length?`${lb.length} lien${lb.length>1?'s':''} sans prix`:'aucune boutique trouvée')}${r.boutiquesCache?' · cache (0 SerpApi)':''}${r.dateBoutiques?` · ${dateFr(r.dateBoutiques)}`:''}</span>${(bq.length||lb.length)?`<button type="button" class="btn" style="margin-left:auto;padding:6px 12px;font-size:12px" data-a="estim-src" data-s="${esc(cle)}">${ouvert?'Masquer':'Voir les boutiques'}</button>`:''}</div>`;
   if(ouvert)h+=`<div class="annonces">${bq.map(b=>`<a class="ann" href="${esc(b.lien)}" target="_blank" rel="noopener" title="Ouvrir la boutique"><span class="t"><b>${esc(b.source)}</b> · ${esc(b.titre||'Produit')}</span><span class="e">neuf</span>${b.prix>0?`<b>${euros(b.prix)}</b>`:''}${I('ext')}</a>`).join('')}${lb.map(b=>`<a class="ann" href="${esc(b.lien)}" target="_blank" rel="noopener" title="Ouvrir le lien"><span class="t"><b>${esc(b.source)}</b> · ${esc(b.titre||'Lien')}</span><span class="e">sans prix</span>${I('ext')}</a>`).join('')}</div><div class="aide">Prix neufs en boutique : simple repère, ils n'entrent pas dans l'estimation.</div>`}}
 if(r.erreurs&&r.erreurs.length)h+=`<div class="aide" style="color:var(--rouge)">${r.erreurs.map(esc).join('<br>')}</div>`;
 if(o.actions)h+=`<div class="wactions" style="margin-top:10px">${o.actions}</div>`;
 return h+'</div>'}

/* ===================== GOOGLE LENS (identification par photo, 1 recherche SerpApi) ===================== */
function compresser(src,max=800,q=0.8){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{let w=im.naturalWidth,h=im.naturalHeight;const r=Math.min(1,max/Math.max(w,h));w=Math.max(1,Math.round(w*r));h=Math.max(1,Math.round(h*r));const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);res(c.toDataURL('image/jpeg',q))};im.onerror=()=>rej(new Error('Image illisible'));im.src=src})}
const LENS_COULEURS=[['Rouge',/\b(rouge|red|rojo|rosso|rot|vermelho)\b/],['Bleu',/\b(bleu|blue|azul|blu|blau)\b/],['Blanc',/\b(blanc|white|blanco|bianco|weiss|branco)\b/],['Noir',/\b(noir|black|negro|nero|schwarz|preto)\b/],['Vert',/\b(vert|green|verde|grun)\b/],['Jaune',/\b(jaune|yellow|amarillo|giallo|gelb|amarelo)\b/],['Orange',/\b(orange|naranja|arancione|laranja)\b/],['Violet',/\b(violet|purple|morado|viola|lila|roxo)\b/],['Rose',/\b(rose|pink|rosa)\b/],['Gris',/\b(gris|grey|gray|grigio|grau|cinza)\b/],['Bordeaux',/\b(bordeaux|maroon|granate|claret|burgundy)\b/]];
const LENS_CATS=[['Gardien',/\b(gardien|goalkeeper|gk|portero|portiere|torwart)\b/],['Extérieur',/\b(exterieur|away|visitante|trasferta|auswarts)\b/],['Third',/\b(third|troisieme|3rd|tercera|terza)\b/],['Domicile',/\b(domicile|home|local|casa|heim)\b/]];
const MARQUES_SECOURS=['Nike','Adidas','Puma','Umbro','Kappa','Hummel','Le Coq Sportif','Macron','Joma','New Balance','Lotto','Reebok','Diadora','Castore','Errea','Uhlsport','Asics','Mizuno','Admiral','Patrick','Duarig'];
const plusFrequent=o=>{const e=Object.entries(o).sort((a,b)=>b[1]-a[1]);return e.length?e[0][0]:''};
function analyserLens(matches,indice){const eq={},saisons={},marques={},versions={},cats={},couleurs={},nums={};const images=[];
 const ind=indice?trouverEquipe(indice):null;let nbIndice=0;
 const lm=((typeof MARQUES!=='undefined'&&Array.isArray(MARQUES))?MARQUES:MARQUES_SECOURS).map(x=>typeof x==='string'?x:(x.nom||x.name||'')).filter(Boolean);
 (matches||[]).forEach((m,ix)=>{const titre=String(m.title||m.titre||'');const source=String(m.source||'');const lien=m.link||m.lien||'';const texte=norm(titre+' '+source);const nn=' '+texte+' ';const poids=ix<5?3:ix<15?2:1;
  const vus=new Set();for(const [k,e] of INDEX){if(k.length>=4&&!vus.has(e)&&nn.includes(' '+k+' ')){vus.add(e);eq[e.nom]=(eq[e.nom]||0)+poids;if(ind&&e===ind)nbIndice++}}
  const re=/((?:19|20)\d{2})(?:\s*[-\/]\s*((?:19|20)?\d{2}))?/g;let s;while((s=re.exec(titre))!==null){const a=+s[1];if(a<1950||a>2035)continue;const b=s[2]?+(s[2].length===2?String(a).slice(0,2)+s[2]:s[2]):null;const cle=(b&&b===a+1)?`${a}-${b}`:String(a);saisons[cle]=(saisons[cle]||0)+poids}
  lm.forEach(mq=>{const n=norm(mq);if(n&&nn.includes(' '+n+' '))marques[mq]=(marques[mq]||0)+poids});
  if(/\b(match worn|worn|porte en match|match issue|player issue)\b/.test(texte))versions['Porté en match']=(versions['Porté en match']||0)+poids;else if(/\b(authentic|authentique|player version|vapor|adv|heat ?rdy|elite)\b/.test(texte))versions['Authentic']=(versions['Authentic']||0)+poids;else if(/\b(replica|stadium|fan|supporter)\b/.test(texte))versions['Replica']=(versions['Replica']||0)+poids;
  for(const [c,rx] of LENS_CATS){if(rx.test(texte)){cats[c]=(cats[c]||0)+poids;break}}
  for(const [c,rx] of LENS_COULEURS){if(rx.test(texte))couleurs[c]=(couleurs[c]||0)+poids}
  const nm=texte.match(/\b(?:n|no|numero|number)\s*(\d{1,2})\b/);if(nm)nums[nm[1]]=(nums[nm[1]]||0)+poids;
  const src=m.thumbnail||m.image||m.miniature||'';if(src&&images.length<8)images.push({src,lien,titre,source})});
 if(ind)eq[ind.nom]=(eq[ind.nom]||0)+1000;
 const equipes=Object.entries(eq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([nom,score])=>({nom,score:score>=1000?score-1000:score}));
 if(indice&&!ind)equipes.unshift({nom:indice,score:0});
 return{equipes,saison:plusFrequent(saisons),marque:plusFrequent(marques),version:plusFrequent(versions),categorie:plusFrequent(cats),couleur:plusFrequent(couleurs),numero:plusFrequent(nums),nbIndice,indiceInconnu:!!(indice&&!ind),images}}
async function identifierLens(){if(!params.relais){toast('Configure le relais dans Paramètres.');return}synchroForm();const f=etat.form;if(!f)return;
 const src=f.photos&&f.photos[0]?await PHOTOS.get(f.photos[0]):null;if(!src){toast('Ajoute d\'abord une photo du maillot (bouton « Photos »).');return}
 const el=$('#lens-indice');const indice=el?el.value.trim():'';
 if(quota().utilise>=QUOTA_MAX){toast('Quota SerpApi du mois épuisé : identification impossible ce mois-ci.');return}
 toast('Identification Google Lens en cours (1 recherche SerpApi)…',true);
 try{const image=await compresser(src,800,0.8);const j=await relais('lens',Object.assign({image},indice?{indice}:{}));const matches=j.visual_matches||j.matches||j.resultats||[];const a=analyserLens(matches,indice);etat.lens=a;
  const detail=[a.saison,a.marque,a.categorie,a.version,a.couleur,a.numero?'n° '+a.numero:''].filter(Boolean).join(' · ');
  etat.lensHtml=`<div class="lens-res"><div class="eyebrow">Google Lens · ${matches.length} résultat${matches.length>1?'s':''} similaire${matches.length>1?'s':''}${j.cache?' · depuis le cache (0 SerpApi)':''}</div>`
   +(a.indiceInconnu?`<div class="aide">Indice « ${esc(indice)} » inconnu du dictionnaire : il sera utilisé tel quel.</div>`:'')
   +(a.equipes.length?`<div class="props">${a.equipes.slice(0,3).map((e,i)=>`<div class="prop"><div><b>${esc(e.nom)}</b> <span class="mini">${e.score?e.score+' indice'+(e.score>1?'s':''):'ton indice'}</span>${detail?`<br><span class="mini">${esc(detail)}</span>`:''}</div><button type="button" class="btn btn-vert" data-a="appliquer" data-i="${i}">${I('check')} Appliquer</button></div>`).join('')}</div>`:`<div class="aide">Aucune équipe reconnue dans les résultats. Réessaie avec un indice (ex. « Norvège ») ou une photo plus nette de l'écusson.</div>`)
   +(a.images.length?`<div class="simil">${a.images.map(im=>`<a href="${esc(im.lien||'#')}" target="_blank" rel="noopener" title="${esc(im.titre)}"><img src="${esc(im.src)}" alt="" loading="lazy"></a>`).join('')}</div>`:'')
   +`</div>`;
  rendre();toast(a.equipes.length?'Propositions prêtes : clique sur « Appliquer ».':'Lens n\'a rien reconnu de sûr.')}
 catch(e){toast('Lens : '+e.message)}}
function appliquerLens(i){const a=etat.lens;if(!a)return;synchroForm();const f=etat.form;if(!f)return;const e=a.equipes[i];
 if(e){f.equipe=e.nom;const eq=trouverEquipe(e.nom);if(eq)f.type=eq.type}
 if(a.saison)f.saison=a.saison;if(a.marque)f.marque=a.marque;if(a.version)f.version=a.version;if(a.categorie)f.categorie=a.categorie;if(a.couleur)f.couleur=a.couleur;if(a.numero&&!f.numero){f.numero=a.numero;f.flocage=true}
 rendre();toast('Proposition appliquée : vérifie les champs avant d\'enregistrer.')}
/* ===================== SUGGESTIONS & NOTIFICATIONS ===================== */
const K_LUS=(typeof K!=='undefined'&&K&&K.lus)||'mm_notifs_lus';
function suggestions(){const cle=collection.map(m=>m.id).join(',')+'|'+wishlist.map(w=>w.id).join(',')+'|'+etat.seed;if(etat.suggCache&&etat.suggCache.cle===cle)return etat.suggCache.liste;
 const possede=new Set(collection.map(m=>norm(m.equipe+'|'+m.saison)));wishlist.forEach(w=>possede.add(norm(w.equipe+'|'+w.saison)));
 const eqPossedees=new Map();collection.forEach(m=>{const e=trouverEquipe(m.equipe);const n=e?e.nom:m.equipe;if(!eqPossedees.has(norm(n)))eqPossedees.set(norm(n),{e,m})});
 const joueurs=new Map();collection.forEach(m=>{if(m.joueur)joueurs.set(norm(m.joueur),m)});
 const marques=new Map();collection.forEach(m=>{if(m.marque)marques.set(norm(m.marque),m)});
 const pays=new Set();collection.forEach(m=>{const e=trouverEquipe(m.equipe);if(e&&e.type==='club'&&e.pays)pays.add(norm(e.pays));if(e&&e.type==='selection')pays.add(norm(e.nom))});
 const clubs=[...eqPossedees.values()].filter(v=>v.e&&v.e.type==='club'&&v.e.pays);
 const nbSel=collection.filter(m=>(trouverEquipe(m.equipe)||{}).type==='selection').length;
 const out=[];
 for(const c of CLASSIQUES){if(possede.has(norm(c.equipe+'|'+c.saison)))continue;const e=trouverEquipe(c.equipe);const n=norm(e?e.nom:c.equipe);let raison='',groupe=1;
  if(eqPossedees.has(n)){const x=eqPossedees.get(n).m;raison=`Parce que tu as déjà ${x.equipe} ${x.saison||''}`.trim();groupe=0}
  else if(c.joueur&&joueurs.has(norm(c.joueur))){raison=`Parce que tu as un maillot de ${c.joueur}`;groupe=0}
  else if(e&&e.type==='selection'&&pays.has(norm(e.nom))){raison=`Le pays de tes clubs : ${e.nom}`;groupe=0}
  else if(e&&e.type==='club'&&e.pays&&clubs.some(v=>norm(v.e.pays)===norm(e.pays))){const v=clubs.find(v=>norm(v.e.pays)===norm(e.pays));raison=`Même championnat que ${v.e.nom}`}
  else if(e&&e.type==='selection'&&nbSel>=2)raison='Tu aimes les sélections';
  else if(c.marque&&marques.has(norm(c.marque))){const x=marques.get(norm(c.marque));raison=`Signé ${c.marque}, comme ton ${x.equipe}`}
  else raison='Un classique de la collection';
  out.push(Object.assign({},c,{raison,groupe}))}
 const score=a=>a.groupe*1e10+Math.abs(hash(norm(a.equipe+'|'+a.saison+'|'+etat.seed)))%1e9;
 out.sort((a,b)=>score(a)-score(b));etat.suggCache={cle,liste:out};return out}
function notifications(){const lus=new Set(lire(K_LUS,[]));const n=[];
 if(!params.relais)n.push({id:'relais',titre:'Configure le relais',texte:'Renseigne l\'adresse du relais Cloudflare et ton code dans Paramètres pour activer les prix, Google Lens et les photos.',page:'parametres'});
 if(!collection.length)n.push({id:'bienvenue',titre:'Bienvenue !',texte:'Ajoute ton premier maillot avec le bouton « Ajouter ».',page:'collection'});
 wishlist.filter(w=>w.statut==='suivi'&&w.alerte&&w.budget>0).forEach(w=>{const p=w.meilleurPrix||w.dernierPrix;if(p&&p<=w.budget)n.push({id:`budget_${w.id}_${Math.round(p)}`,titre:`${w.equipe} ${w.saison||''} dans ton budget`,texte:`Vu à ${euros(p)} (budget ${euros(w.budget)}).`,page:'wishlist'})});
 const s=suggestions();if(s.length&&collection.length)n.push({id:'idees_'+s.length,titre:'Des idées pour ta collection',texte:`${s.length} maillots cultes suggérés d'après ta collection.`,page:'accueil'});
 if(collection.length&&Date.now()-(params.dernierExport||0)>14*86400e3)n.push({id:'export_'+Math.floor(Date.now()/(7*86400e3)),titre:'Pense à sauvegarder',texte:'Aucune sauvegarde depuis plus de 14 jours : Paramètres → Exporter.',page:'parametres'});
 const q=quota();if(q.utilise>=QUOTA_MAX*0.8)n.push({id:'quota_'+q.mois,titre:'Quota SerpApi presque atteint',texte:`${q.utilise}/${QUOTA_MAX} recherches utilisées ce mois-ci.`,page:'parametres'});
 return n.map(x=>Object.assign(x,{lu:lus.has(x.id)}))}
function marquerLu(ids){const lus=new Set(lire(K_LUS,[]));ids.forEach(i=>lus.add(i));ecrire(K_LUS,[...lus].slice(-200))}

/* ===================== RENDU ===================== */
const PAGES_NAV=[['accueil','Accueil','home'],['collection','Collection','shirt'],['wishlist','Wishlist','heart'],['parametres','Paramètres','sliders']];
const OPT_VERSION=['Replica','Authentic','Porté en match','Préparé pour match','Autre'];
const OPT_CATEGORIE=['Domicile','Extérieur','Third','Gardien','Entraînement','Autre'];
const OPT_COULEUR=['Rouge','Bleu','Blanc','Noir','Vert','Jaune','Orange','Violet','Rose','Gris','Bordeaux','Multicolore'];
const OPT_TAILLE=['XS','S','M','L','XL','XXL','Enfant'];
const STATUTS_WISH=[['suivi','Suivis'],['trouve','Trouvés'],['pause','En pause']];
const opts=(l,v)=>{const liste=v&&!l.includes(v)?[v,...l]:l;return liste.map(x=>`<option value="${esc(x)}"${x===v?' selected':''}>${esc(x)}</option>`).join('')};
const dateCourte=s=>{if(!s)return '';const d=new Date(s);return isNaN(d)?esc(String(s)):d.toLocaleDateString('fr-FR')};
const nomComplet=x=>[x.equipe,x.saison].filter(Boolean).join(' ');
const badgeFlocage=x=>x.flocage&&(x.joueur||x.numero)?`<span class="floc">${esc([x.joueur,x.numero?'n° '+x.numero:''].filter(Boolean).join(' '))}</span>`:'';

function entete(){const nn=notifications().filter(n=>!n.lu).length;
 return `<header class="entete"><div class="marque" data-a="page" data-p="accueil"><span class="logo-mm">${I('shirt')}</span><span><b>Mes Maillots</b><small>${esc(params.prenom?'Collection de '+params.prenom:'Ma collection')}</small></span></div><nav class="nav">${PAGES_NAV.map(([p,l,ic])=>`<button type="button" class="${etat.page===p?'on':''}" data-a="page" data-p="${p}">${I(ic)}<span>${l}</span></button>`).join('')}</nav><button type="button" class="bell" data-a="notifs" title="Notifications">${I('bell')}${nn?`<i>${nn}</i>`:''}</button></header>`}
function barre(){return `<nav class="barre">${PAGES_NAV.map(([p,l,ic])=>`<button type="button" class="${etat.page===p?'on':''}" data-a="page" data-p="${p}">${I(ic)}<span>${l}</span></button>`).join('')}</nav>`}
function datalists(){const eqs=[...new Set([...EQUIPES.map(e=>e.nom),...collection.map(m=>m.equipe),...wishlist.map(w=>w.equipe)].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
 const lm=(typeof MARQUES!=='undefined'&&Array.isArray(MARQUES))?MARQUES.map(x=>typeof x==='string'?x:(x.nom||x.name||'')):MARQUES_SECOURS;const mq=[...new Set([...lm,...collection.map(m=>m.marque)].filter(Boolean))];
 const an=new Date().getFullYear()+1;const sais=[];for(let a=an;a>=1960;a--)sais.push(`${a}-${a+1}`);
 return `<datalist id="dl-equipes">${eqs.map(x=>`<option value="${esc(x)}">`).join('')}</datalist><datalist id="dl-marques">${mq.map(x=>`<option value="${esc(x)}">`).join('')}</datalist><datalist id="dl-saisons">${sais.map(x=>`<option value="${x}">`).join('')}</datalist>`}

function visuelMaillot(m,o={}){if(m.photos&&m.photos.length)return `<div class="visu" data-photo="${m.photos[0]}"></div>`;return visuelEquipe(m.equipe,Object.assign({gq:requeteImage(m)},o))}
function carteMaillot(m){const pv=m.valeur>0&&m.prixAchat>0?m.valeur-m.prixAchat:null;
 return `<article class="carte" data-a="fiche" data-id="${m.id}"><div class="img">${visuelMaillot(m)}<button type="button" class="heart${m.favori?' on':''}" data-a="favori" data-id="${m.id}" title="Favori">${I('heart')}</button>${m.categorie?`<span class="badge">${esc(m.categorie)}</span>`:''}</div>
 <div class="corps"><b>${esc(m.equipe)}</b><div class="meta">${esc([m.saison,m.marque,m.version].filter(Boolean).join(' · '))}</div><div class="chips">${badgeFlocage(m)}${m.taille?`<span class="chip">${esc(m.taille)}</span>`:''}</div>
 <div class="bas"><span>${m.prixAchat>0?'Acheté '+euros(m.prixAchat):'Prix d\'achat non renseigné'}</span><b>${m.valeur>0?'≈ '+euros(m.valeur):''}</b>${pv!=null?`<span class="${pv>=0?'plus':'moins'}">${pv>=0?'+':''}${euros(pv)}</span>`:''}</div></div></article>`}
function filtrer(){const q=norm(etat.recherche||'');const f=etat.filtres;return collection.filter(m=>{if(f.equipe&&m.equipe!==f.equipe)return false;if(f.saison&&m.saison!==f.saison)return false;if(f.couleur&&m.couleur!==f.couleur)return false;if(f.categorie&&m.categorie!==f.categorie)return false;
 if(q){const t=norm([m.equipe,m.saison,m.marque,m.joueur,m.numero,m.notes,m.version,m.categorie].filter(Boolean).join(' '));if(!t.includes(q))return false}return true}).sort((a,b)=>(b.favori?1:0)-(a.favori?1:0)||(b.date||0)-(a.date||0))}
function listeCollection(){const l=filtrer();if(!collection.length)return `<div class="vide">${I('shirt')}<p>Ta collection est vide.</p><button type="button" class="btn btn-vert" data-a="ajouter">${I('plus')} Ajouter un maillot</button></div>`;if(!l.length)return `<div class="vide"><p>Aucun maillot ne correspond.</p><button type="button" class="btn" data-a="reset-filtres">Effacer les filtres</button></div>`;return `<div class="grille">${l.map(carteMaillot).join('')}</div>`}
function pageCollection(){const nb=collection.length;const investi=collection.reduce((s,m)=>s+(Number(m.prixAchat)||0),0);const valeur=collection.reduce((s,m)=>s+(Number(m.valeur)||Number(m.prixAchat)||0),0);const pv=valeur-investi;
 const sel=(f,l,lab)=>`<select class="pilule" data-f="${f}"><option value="">${lab}</option>${[...new Set(l.filter(Boolean))].sort().map(x=>`<option value="${esc(x)}"${etat.filtres[f]===x?' selected':''}>${esc(x)}</option>`).join('')}</select>`;
 return `<div class="titre-page"><div><div class="eyebrow">Collection</div><h1>${nb} maillot${nb>1?'s':''}</h1></div><button type="button" class="btn btn-vert" data-a="ajouter">${I('plus')} Ajouter</button></div>
 <div class="kpis"><div class="kpi"><small>Maillots</small><b>${nb}</b></div><div class="kpi"><small>Investi</small><b>${euros(investi)}</b></div><div class="kpi"><small>Valeur estimée</small><b>${euros(valeur)}</b></div><div class="kpi"><small>Plus-value</small><b class="${pv>=0?'plus':'moins'}">${pv>=0?'+':''}${euros(pv)}</b></div></div>
 <div class="avert">${I('info')}<span><b>Estimation indicative uniquement :</b> la valeur estimée s'appuie uniquement sur les annonces de revente entre particuliers (eBay, Vinted, Leboncoin) ; les prix neufs des boutiques (Google) sont affichés à titre de repère et n'entrent pas dans le calcul. Ce ne sont ni des cotes officielles, ni des prix de marché en direct.</span></div>
 <div class="recherche">${I('search')}<input id="recherche" type="search" placeholder="Rechercher (équipe, joueur, saison, marque…)" value="${esc(etat.recherche||'')}"></div>
 <div class="filtres">${sel('equipe',collection.map(m=>m.equipe),'Toutes les équipes')}${sel('saison',collection.map(m=>m.saison),'Toutes les saisons')}${sel('couleur',collection.map(m=>m.couleur),'Toutes les couleurs')}${sel('categorie',collection.map(m=>m.categorie),'Toutes les catégories')}${Object.values(etat.filtres).some(Boolean)||etat.recherche?`<button type="button" class="btn" data-a="reset-filtres">${I('x')} Effacer</button>`:''}</div>
 <div id="zone-liste">${listeCollection()}</div>`}

function carteWish(w){const tend=w.prixRef&&w.dernierPrix?w.dernierPrix-w.prixRef:null;const bas=w.meilleurPrix||w.dernierPrix;const ok=w.budget>0&&bas&&bas<=w.budget;
 const visu=w.imageUrl?visuelEquipe(w.equipe,{url:w.imageUrl}):visuelEquipe(w.equipe,{gq:requeteImage(w)});
 return `<article class="wcarte${ok?' ok':''}"><div class="wtete"><div class="wvisu">${visu}</div><div><b>${esc(w.equipe)}</b><div class="meta">${esc([w.saison,w.marque,w.categorie,w.version].filter(Boolean).join(' · '))}</div><div class="chips">${badgeFlocage(w)}${w.budget>0?`<span class="chip">Budget ${euros(w.budget)}</span>`:''}${ok?'<span class="chip ok">Dans ton budget</span>':''}</div></div>
 ${w.statut==='suivi'?`<button type="button" class="wbell${w.alerte?' on':''}" data-a="wish-alerte" data-id="${w.id}" title="${w.alerte?'Alerte active':'Alerte coupée'}">${I('bell')}</button>`:''}</div>
 <div class="wsep"></div>
 <div class="wprix">${w.dernierPrix?`<div><small>Médiane occasion</small><b>${euros(w.dernierPrix)}</b>${tend!=null&&Math.abs(tend)>=1?`<span class="${tend<=0?'plus':'moins'}">${tend>0?'+':''}${euros(tend)}</span>`:''}</div><div><small>Moins cher</small><b>${euros(bas)}</b></div><div><small>Annonces</small><b>${w.nbAnnonces||0}</b></div>`:`<div class="aide" style="margin:0">Pas encore de relevé${w.statut==='suivi'&&params.relais?' : clique sur « Vérifier »':''}.</div>`}</div>
 ${w.dernierReleve?`<div class="wnote">Relevé du ${dateFr(w.dernierReleve)} · ${esc(w.dernierSource||'')}</div>`:''}
 ${w.meilleureAnnonce?`<a class="ann" style="margin-top:8px" href="${esc(w.meilleureAnnonce.lien||'#')}" target="_blank" rel="noopener"><span class="t">${esc(w.meilleureAnnonce.source||'')} · ${esc(w.meilleureAnnonce.titre||'')}</span><b>${euros(w.meilleureAnnonce.prix)}</b>${I('ext')}</a>`:''}
 ${w.notes?`<div class="wnote">${esc(w.notes)}</div>`:''}
 <div class="wactions">${w.statut==='suivi'?`<button type="button" class="btn btn-vert" data-a="verifier-un" data-id="${w.id}">${I('refresh')} Vérifier</button>`:''}${w.releve?`<button type="button" class="btn" data-a="wish-annonces" data-id="${w.id}">${I('search')} Annonces</button>`:''}<button type="button" class="btn btn-ic" data-a="wish-modifier" data-id="${w.id}" title="Modifier">${I('edit')}</button>${btnPhoto(w.imageUrl?'':requeteImage(w))}
 ${w.statut==='suivi'?`<button type="button" class="btn" data-a="wish-trouve" data-id="${w.id}">${I('check')} Trouvé</button><button type="button" class="btn" data-a="wish-pause" data-id="${w.id}">Pause</button>`:`<button type="button" class="btn" data-a="wish-reprendre" data-id="${w.id}">${I('refresh')} Reprendre</button>`}
 ${w.statut==='trouve'?`<button type="button" class="btn btn-vert" data-a="wish-vers-collection" data-id="${w.id}">${I('plus')} Dans la collection</button>`:''}<button type="button" class="btn btn-ic btn-rouge" data-a="wish-supprimer" data-id="${w.id}" title="Supprimer">${I('trash')}</button></div></article>`}
function pageWishlist(){const l=wishlist.filter(w=>(w.statut||'suivi')===etat.statutWish);const nbSuivi=wishlist.filter(w=>w.statut==='suivi').length;
 return `<div class="titre-page"><div><div class="eyebrow">Wishlist</div><h1>${nbSuivi} maillot${nbSuivi>1?'s':''} suivi${nbSuivi>1?'s':''}</h1></div><div class="actions">${nbSuivi&&params.relais?`<button type="button" class="btn" data-a="verifier">${I('refresh')} Vérifier les prix</button>`:''}<button type="button" class="btn btn-vert" data-a="ajouter-wish">${I('plus')} Ajouter</button></div></div>
 <p class="aide">« Vérifier les prix » interroge eBay + Vinted/Leboncoin (6 maillots par passage, 1 recherche SerpApi chacun). La veille automatique quotidienne n'interroge qu'eBay, gratuitement. Les prix neufs des boutiques (Google) s'obtiennent avec « Compléter avec Google » dans les annonces d'un maillot ; ils ne servent que de repère. Les prix restent indicatifs.</p>
 <div class="filtres">${STATUTS_WISH.map(([s,l2])=>`<button type="button" class="pilule-btn${etat.statutWish===s?' on':''}" data-a="wish-onglet" data-s="${s}">${l2} <small>${wishlist.filter(w=>(w.statut||'suivi')===s).length}</small></button>`).join('')}</div>
 ${l.length?`<div class="wgrille">${l.map(carteWish).join('')}</div>`:`<div class="vide">${I('heart')}<p>${etat.statutWish==='suivi'?'Aucun maillot suivi. Ajoute ceux que tu cherches, ou pioche dans les idées de l\'accueil.':'Rien ici pour le moment.'}</p></div>`}`}

function carteSugg(s,i){const visu=visuelEquipe(s.equipe,{force:true,c1:s.c1,c2:s.c2,motif:s.motif,wiki:s.wiki,gq:requeteImage(s)});
 return `<article class="sugg"><div class="img">${visu}</div><div class="corps"><div class="raison">${esc(s.raison)}</div><b>${esc(s.equipe)} ${esc(s.saison)}</b><div class="meta">${esc([s.marque,s.joueur].filter(Boolean).join(' · '))}</div>${s.citation?`<p class="cit">${esc(s.citation)}</p>`:''}<div class="wactions"><button type="button" class="btn" data-a="sugg-wish" data-i="${i}">${I('heart')} Wishlist</button><button type="button" class="btn btn-vert" data-a="sugg-col" data-i="${i}">${I('plus')} Je l'ai</button>${btnPhoto(requeteImage(s))}</div></div></article>`}
function pageAccueil(){const sug=suggestions().slice(0,6);const recents=[...collection].sort((a,b)=>(b.date||0)-(a.date||0)).slice(0,4);const nbSuivi=wishlist.filter(w=>w.statut==='suivi').length;const valeur=collection.reduce((s,m)=>s+(Number(m.valeur)||Number(m.prixAchat)||0),0);const h=new Date().getHours();const salut=h<18?'Bonjour':'Bonsoir';
 return `<section class="hero"><div class="deco">${svgMaillot('#1f5a44','#c9a227','bande')}</div><div class="eyebrow">${salut}${params.prenom?' '+esc(params.prenom):''}</div><h1>Ta collection, <em>comme une discothèque</em> de maillots.</h1><div class="stats"><div><b>${collection.length}</b><small>maillots</small></div><div><b>${euros(valeur)}</b><small>valeur estimée</small></div><div><b>${nbSuivi}</b><small>suivis en wishlist</small></div></div><div class="wactions"><button type="button" class="btn btn-vert" data-a="ajouter">${I('plus')} Ajouter un maillot</button><button type="button" class="btn" data-a="page" data-p="wishlist">${I('heart')} Wishlist</button></div></section>
 ${recents.length?`<section class="section"><div class="titre-page"><h2>Derniers ajouts</h2><button type="button" class="btn" data-a="page" data-p="collection">Tout voir ${I('droite')}</button></div><div class="grille">${recents.map(carteMaillot).join('')}</div></section>`:''}
 <section class="section"><div class="titre-page"><div><div class="eyebrow">Maillots cultes</div><h2>Idées pour ta collection</h2></div><button type="button" class="btn" data-a="idees">${I('refresh')} D'autres idées</button></div>${sug.length?`<div class="grille sugg-grille">${sug.map((s,i)=>carteSugg(s,i)).join('')}</div>`:'<p class="aide">Tu as déjà tous nos classiques !</p>'}</section>`}

function pageParametres(){const q=quota();const pct=Math.min(100,Math.round(q.utilise/QUOTA_MAX*100));const ck=(n,l,v)=>`<label class="case"><input type="checkbox" name="${n}"${v?' checked':''}><span>${l}</span></label>`;
 return `<div class="titre-page"><div><div class="eyebrow">Réglages</div><h1>Paramètres</h1></div></div>
 <div class="carte-param"><h3>Toi</h3><div class="form"><label>Prénom<input name="prenom" value="${esc(params.prenom||'')}" placeholder="Pour le bonjour de l'accueil"></label></div></div>
 <div class="carte-param"><h3>Relais Cloudflare</h3><p class="aide">Le relais garde tes clés (SerpApi, eBay) à l'abri : rien n'est stocké dans l'appli.</p><div class="form"><label>Adresse du relais<input name="relais" value="${esc(params.relais||'')}" placeholder="https://maillots-relais.xxx.workers.dev" inputmode="url"></label><label>Code secret<input name="code" type="password" value="${esc(params.code||'')}" placeholder="Le CODE_SECRET du Worker"></label><label>Relais photos (facultatif, sinon le même)<input name="relaisImages" value="${esc(params.relaisImages||'')}" placeholder="Laisser vide"></label>
 ${ck('photosWeb','Photos de maillots via eBay (gratuit, sans SerpApi)',params.photosWeb!==false)}${ck('ebay','Prix d\'occasion eBay (gratuit)',params.ebay!==false)}${ck('vinted','Prix d\'occasion Vinted / Leboncoin via Google (1 recherche SerpApi, gardée 24 h)',params.vinted!==false)}${ck('google','Chercher aussi les boutiques / prix neuf via Google (1 recherche SerpApi, gardée 7 jours)',params.google!==false)}${ck('veille','Veille automatique quotidienne de la wishlist (eBay seulement, gratuit)',params.veille!==false)}
 <div class="wactions"><button type="button" class="btn btn-vert" data-a="sauver-params">${I('check')} Enregistrer</button><button type="button" class="btn" data-a="tester">${I('refresh')} Tester la connexion</button></div><div id="res-test" class="aide"></div></div></div>
 <div class="carte-param"><h3>Quota SerpApi</h3><div class="quota"><div class="jauge"><i style="width:${pct}%"></i></div><div><b>${q.utilise} / ${QUOTA_MAX}</b> recherches ce mois-ci (${q.mois})</div></div><p class="aide">Chaque identification Google Lens, chaque recherche Vinted/Leboncoin (gardée 24 h) et chaque recherche de boutiques Google (gardée 7 jours) compte pour 1. Une estimation complète d'un maillot peut donc coûter jusqu'à 2 recherches. eBay et les photos sont gratuits. Le compteur est approximatif : la référence reste ton tableau de bord SerpApi.</p></div>
 <div class="carte-param"><h3>Sauvegarde</h3><p class="aide">${params.dernierExport?'Dernière sauvegarde : '+dateFr(params.dernierExport)+'.':'Aucune sauvegarde pour l\'instant.'} Le fichier contient collection, wishlist, photos et réglages.</p><div class="wactions"><button type="button" class="btn btn-vert" data-a="exporter">${I('download')} Exporter</button><label class="btn">${I('upload')} Importer<input id="fichier-import" type="file" accept="application/json,.json" hidden></label></div></div>
 <div class="carte-param"><h3>Application</h3><p class="aide">Mes Maillots v${VERSION} · fonctionne hors ligne après la première ouverture.</p><div class="wactions"><button type="button" class="btn" data-a="maj">${I('refresh')} Forcer la mise à jour de l'appli</button><button type="button" class="btn" data-a="vider-wiki">Vider le cache Wikipédia</button><button type="button" class="btn" data-a="vider-img">Vider le cache des photos web</button></div></div>`}

function ficheMaillot(m){const ph=m.photos||[];const n=Math.max(1,ph.length);const i=((etat.carrousel%n)+n)%n;const q=requeteImage(m);
 const visu=ph.length?`<div class="carrousel"><div class="visu grand" data-photo="${ph[i]}"></div>${ph.length>1?`<button type="button" class="fl g" data-a="carrousel" data-d="-1">${I('gauche')}</button><button type="button" class="fl d" data-a="carrousel" data-d="1">${I('droite')}</button><div class="pts">${ph.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div>`:''}</div>`:`<div class="carrousel">${visuelEquipe(m.equipe,{gq:q})}${btnPhoto(q,'position:absolute;right:10px;bottom:10px;z-index:2')}</div>`;
 const det=[['Saison',m.saison],['Marque',m.marque],['Catégorie',m.categorie],['Version',m.version],['Couleur',m.couleur],['Taille',m.taille],['Flocage',m.flocage?([m.joueur,m.numero?'n° '+m.numero:''].filter(Boolean).join(' ')||'Oui'):'Non'],['Acheté le',dateCourte(m.dateAchat)],['Prix d\'achat',m.prixAchat>0?euros(m.prixAchat):''],['Valeur estimée (occasion)',m.valeur>0?euros(m.valeur)+(m.dateEstimation?' · '+dateFr(m.dateEstimation):''):'']].filter(x=>x[1]);
 return `<div class="ftete"><div><div class="eyebrow">${m.type==='selection'?'Sélection nationale':'Club'}</div><h2>${esc(m.equipe)}</h2></div><button type="button" class="heart${m.favori?' on':''}" data-a="favori" data-id="${m.id}" title="Favori">${I('heart')}</button></div>${visu}
 <div class="det">${det.map(([k,v])=>`<div><small>${k}</small><b>${esc(String(v))}</b></div>`).join('')}</div>${m.notes?`<p class="wnote">${esc(m.notes)}</p>`:''}
 <div class="wactions"><button type="button" class="btn btn-vert" data-a="estimer-fiche" data-id="${m.id}">${I('search')} ${m.releve?'Nouvelle estimation':'Estimer la valeur'}</button><button type="button" class="btn" data-a="modifier" data-id="${m.id}">${I('edit')} Modifier</button><button type="button" class="btn btn-rouge" data-a="supprimer" data-id="${m.id}">${I('trash')} Supprimer</button></div>
 ${blocEstimation(m.releve,'m'+m.id,{titre:'Estimation détaillée',actions:actionsVinted(m.id,m.releve)+actionsGoogle(m.id)})}`}

function champsFlocage(f){return `<label>Joueur<input name="joueur" value="${esc(String(f.joueur||''))}" placeholder="Ex. Zidane"></label><label>Numéro<input name="numero" value="${esc(String(f.numero||''))}" inputmode="numeric" placeholder="10"></label>`}
function formMaillot(f){const ph=f.photos||[];
 return `<div class="ftete"><h2>${f.id?'Modifier le maillot':'Nouveau maillot'}</h2></div>
 <div class="photos-edit">${ph.map((p,i)=>`<div class="ph"><div class="visu" data-photo="${p}"></div><button type="button" class="fermer petit" data-a="photo-suppr" data-i="${i}" title="Retirer cette photo">${I('x')}</button></div>`).join('')}${ph.length<4?`<label class="ph ajout" title="Ajouter des photos (4 maximum)">${I('camera')}<span>Photos</span><input id="fichier-photo" type="file" accept="image/*" multiple hidden></label>`:''}</div>
 <div class="lens"><div class="eyebrow">Identifier par la photo</div><div class="form ligne"><label>Indice (facultatif)<input id="lens-indice" value="${esc(etat.lensIndice||'')}" placeholder="Ex. Norvège, OM, Ajax…"></label><button type="button" class="btn" data-a="lens"${ph.length?'':' disabled'} title="Analyse la 1re photo avec Google Lens (1 recherche SerpApi)">${I('lens')} Google Lens</button></div>${ph.length?'':'<p class="aide">Ajoute d\'abord une photo pour utiliser Google Lens.</p>'}<div id="lens-res">${etat.lensHtml||''}</div></div>
 <form id="f-maillot" class="form" onsubmit="return false">
 <label>Équipe *<input name="equipe" list="dl-equipes" required value="${esc(f.equipe||'')}" placeholder="Ex. Olympique de Marseille"></label>
 <div class="ligne"><label>Type<select name="type"><option value="club"${f.type!=='selection'?' selected':''}>Club</option><option value="selection"${f.type==='selection'?' selected':''}>Sélection nationale</option></select></label><label>Saison<input name="saison" list="dl-saisons" value="${esc(f.saison||'')}" placeholder="Ex. 1998-1999"></label></div>
 <div class="ligne"><label>Marque<input name="marque" list="dl-marques" value="${esc(f.marque||'')}" placeholder="Ex. Adidas"></label><label>Catégorie<select name="categorie"><option value="">—</option>${opts(OPT_CATEGORIE,f.categorie||'')}</select></label></div>
 <div class="ligne trois"><label>Version<select name="version">${opts(OPT_VERSION,f.version||'Replica')}</select></label><label>Couleur<select name="couleur"><option value="">—</option>${opts(OPT_COULEUR,f.couleur||'')}</select></label><label>Taille<select name="taille"><option value="">—</option>${opts(OPT_TAILLE,f.taille||'')}</select></label></div>
 <div class="ligne${f.flocage?' trois':''}"><label>Flocage<select name="flocage"><option value="non"${f.flocage?'':' selected'}>Non</option><option value="oui"${f.flocage?' selected':''}>Oui (joueur / numéro)</option></select></label>${f.flocage?champsFlocage(f):''}</div>
 <div class="ligne"><label>Prix d'achat (€)<input name="prixAchat" type="number" min="0" step="0.01" value="${f.prixAchat>0?f.prixAchat:''}" placeholder="Ex. 45"></label><label>Date d'achat<input name="dateAchat" type="date" value="${esc(f.dateAchat||'')}"></label></div>
 <label>Notes<textarea name="notes" placeholder="État, provenance, anecdote…">${esc(f.notes||'')}</textarea></label>
 <label class="case"><input type="checkbox" name="favori"${f.favori?' checked':''}><span>Favori</span></label></form>
 <div class="estim-form"><div class="wactions"><button type="button" class="btn" data-a="estimer">${I('search')} Estimer la valeur via les annonces (eBay, Vinted, Leboncoin${params.google!==false?' + boutiques Google':''})</button></div>${f.valeur>0?`<p class="aide">Valeur estimée (occasion) : <b>${euros(f.valeur)}</b>${f.dateEstimation?' · '+dateFr(f.dateEstimation):''}</p>`:''}${blocEstimation(f.releve,'form',{actions:actionsVinted('form',f.releve)+actionsGoogle('form')})}</div>
 <div class="wactions" style="margin-top:16px"><button type="button" class="btn btn-vert" data-a="enregistrer">${I('check')} Enregistrer</button><button type="button" class="btn" data-a="fermer">Annuler</button></div>`}
function formWish(f){return `<div class="ftete"><h2>${f.id?'Modifier le souhait':'Nouveau souhait'}</h2></div><form id="f-wish" class="form" onsubmit="return false">
 <label>Équipe *<input name="equipe" list="dl-equipes" required value="${esc(f.equipe||'')}" placeholder="Ex. Ajax Amsterdam"></label>
 <div class="ligne"><label>Saison<input name="saison" list="dl-saisons" value="${esc(f.saison||'')}" placeholder="Ex. 1994-1995"></label><label>Marque<input name="marque" list="dl-marques" value="${esc(f.marque||'')}"></label></div>
 <div class="ligne"><label>Catégorie<select name="categorie"><option value="">—</option>${opts(OPT_CATEGORIE,f.categorie||'')}</select></label><label>Version<select name="version">${opts(OPT_VERSION,f.version||'Replica')}</select></label></div>
 <div class="ligne"><label>Flocage<select name="flocage"><option value="non"${f.flocage?'':' selected'}>Non / peu importe</option><option value="oui"${f.flocage?' selected':''}>Oui (joueur / numéro)</option></select></label><label>Budget maxi (€)<input name="budget" type="number" min="0" step="1" value="${f.budget>0?f.budget:''}" placeholder="Ex. 80"></label></div>
 ${f.flocage?`<div class="ligne">${champsFlocage(f)}</div>`:''}
 <label>Lien d'une image (facultatif)<input name="imageUrl" value="${esc(f.imageUrl||'')}" placeholder="https://… (sinon photo eBay automatique)" inputmode="url"></label>
 <label>Notes<textarea name="notes">${esc(f.notes||'')}</textarea></label>
 <label class="case"><input type="checkbox" name="alerte"${f.alerte!==false?' checked':''}><span>M'alerter quand une annonce passe sous le budget</span></label></form>
 <div class="wactions" style="margin-top:16px"><button type="button" class="btn btn-vert" data-a="wish-enregistrer">${I('check')} Enregistrer</button><button type="button" class="btn" data-a="fermer">Annuler</button></div>`}
function modalAnnoncesWish(w){const r=w.releve;const hist=(w.historique||[]).slice(-10).reverse();
 return `<div class="ftete"><div><div class="eyebrow">Wishlist</div><h2>${esc(nomComplet(w))}</h2></div></div>
 ${blocEstimation(r,'w'+w.id,{titre:'Dernier relevé',actions:`<button type="button" class="btn btn-vert" data-a="verifier-un" data-id="${w.id}">${I('refresh')} Nouveau relevé</button>`+actionsVinted('wish:'+w.id,r)+actionsGoogle('wish:'+w.id)})||'<p class="aide">Pas encore de relevé pour ce maillot.</p>'}
 ${hist.length>1?`<div class="estim"><div class="eyebrow">Historique (médiane · moins cher)</div>${hist.map(h=>`<div class="src"><span>${dateFr(h.date)}</span><b style="margin-left:auto">${euros(h.prix)}</b><span>· ${euros(h.min)}</span></div>`).join('')}</div>`:''}`}
function panneauNotifs(){const n=notifications();return `<aside class="panneau"><div class="ftete"><h3>Notifications</h3><div>${n.some(x=>!x.lu)?`<button type="button" class="btn" data-a="notif-lu-tout">Tout marquer lu</button>`:''}<button type="button" class="fermer" data-a="notifs" title="Fermer">${I('x')}</button></div></div>${n.length?n.map(x=>`<button type="button" class="notif${x.lu?' lu':''}" data-a="notif" data-id="${esc(x.id)}" data-p="${x.page}"><b>${esc(x.titre)}</b><span>${esc(x.texte)}</span></button>`).join(''):'<p class="aide">Rien de nouveau.</p>'}</aside>`}

function rendre(){if(!root)return;const md0=$('.modal');const sc=md0?md0.scrollTop:0;let page='';
 switch(etat.page){case 'collection':page=pageCollection();break;case 'wishlist':page=pageWishlist();break;case 'parametres':page=pageParametres();break;default:page=pageAccueil()}
 let modal='';if(etat.modal){let inner='';
  if(etat.modal==='fiche'){const m=collection.find(x=>String(x.id)===String(etat.ficheId));if(m)inner=ficheMaillot(m);else etat.modal=null}
  else if(etat.modal==='form')inner=formMaillot(etat.form||{});else if(etat.modal==='wish-form')inner=formWish(etat.form||{});
  else if(etat.modal==='wish-annonces'){const w=wishlist.find(x=>String(x.id)===String(etat.wishId));if(w)inner=modalAnnoncesWish(w);else etat.modal=null}
  if(inner)modal=`<div class="voile" data-a="fermer-voile"><div class="modal" role="dialog"><button type="button" class="fermer" data-a="fermer" title="Fermer">${I('x')}</button>${inner}</div></div>`}
 root.innerHTML=`${entete()}<main class="${etat.page}">${page}</main>${barre()}${etat.panneau?panneauNotifs():''}${modal}${datalists()}`;
 document.body.classList.toggle('bloque',!!(etat.modal||etat.panneau));const md=$('.modal');if(md&&sc)md.scrollTop=sc;chargerPhotos();chargerVisuels()}
function chargerPhotos(){$$('[data-photo]').forEach(async el=>{const id=el.dataset.photo;el.removeAttribute('data-photo');try{const src=await PHOTOS.get(id);if(src&&el.isConnected){const img=new Image();img.alt='';img.className='visu-img photo';img.src=src;el.innerHTML='';el.appendChild(img)}}catch(e){}})}
let toastTimer=0;
function toast(msg,fixe){let t=$('#toast-mm');if(!t){t=document.createElement('div');t.id='toast-mm';t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);if(!fixe)toastTimer=setTimeout(()=>t.classList.remove('show'),3800)}
function fermerModal(){etat.modal=null;etat.form=null;etat.lens=null;etat.lensHtml='';etat.lensIndice='';etat.carrousel=0;etat.srcOuverte='';rendre()}
function lireForm(sel){const o={};const f=$(sel);if(!f)return o;f.querySelectorAll('[name]').forEach(el=>{const n=el.name;if(el.type==='checkbox')o[n]=el.checked;else if(el.type==='number')o[n]=el.value===''?null:Number(el.value);else o[n]=String(el.value).trim()});if('flocage' in o)o.flocage=o.flocage==='oui';return o}
function synchroForm(){if(!etat.form)return;if(etat.modal==='form'&&$('#f-maillot'))Object.assign(etat.form,lireForm('#f-maillot'));if(etat.modal==='wish-form'&&$('#f-wish'))Object.assign(etat.form,lireForm('#f-wish'))}
function ouvrirFormMaillot(m){etat.form=Object.assign({equipe:'',type:'club',saison:'',marque:'',categorie:'Domicile',version:'Replica',couleur:'',taille:'',flocage:false,joueur:'',numero:'',prixAchat:null,dateAchat:'',notes:'',photos:[],favori:false},m?JSON.parse(JSON.stringify(m)):{});etat.form.photos=[...(etat.form.photos||[])];etat.lens=null;etat.lensHtml='';etat.lensIndice='';etat.srcOuverte='';etat.modal='form';rendre()}
function ouvrirFormWish(w){etat.form=Object.assign({equipe:'',saison:'',marque:'',categorie:'',version:'Replica',flocage:false,joueur:'',numero:'',budget:null,imageUrl:'',alerte:true,notes:''},w?JSON.parse(JSON.stringify(w)):{});etat.modal='wish-form';rendre()}
function depuisWish(w){ouvrirFormMaillot({equipe:w.equipe,type:(trouverEquipe(w.equipe)||{}).type||'club',saison:w.saison||'',marque:w.marque||'',categorie:w.categorie||'',version:w.version||'Replica',flocage:!!w.flocage,joueur:w.joueur||'',numero:w.numero||'',notes:w.notes||''});etat.form.depuisWish=w.id}
async function enregistrerMaillot(){synchroForm();const f=etat.form;if(!f||!f.equipe){toast('Indique au moins l\'équipe.');return}
 const eq=trouverEquipe(f.equipe);
 const data={id:f.id||uid(),date:f.date||Date.now(),equipe:f.equipe,type:f.type||(eq?eq.type:'club'),saison:f.saison||'',marque:f.marque||'',categorie:f.categorie||'',version:f.version||'Replica',couleur:f.couleur||'',taille:f.taille||'',flocage:!!f.flocage,joueur:f.joueur||'',numero:f.numero||'',prixAchat:f.prixAchat>0?Number(f.prixAchat):null,dateAchat:f.dateAchat||'',notes:f.notes||'',photos:[...(f.photos||[])],favori:!!f.favori,valeur:f.valeur||null,dateEstimation:f.dateEstimation||null,releve:f.releve||null};
 for(const id of (f._suppr||[]))await PHOTOS.del(id);
 const i=collection.findIndex(x=>String(x.id)===String(data.id));if(i>=0)collection[i]=data;else collection.unshift(data);
 if(f.depuisWish){const w=wishlist.find(x=>String(x.id)===String(f.depuisWish));if(w)w.statut='trouve'}
 etat.suggCache={};sauver();etat.form=null;etat.lens=null;etat.lensHtml='';etat.lensIndice='';etat.modal='fiche';etat.ficheId=data.id;etat.carrousel=0;etat.srcOuverte='';rendre();toast(i>=0?'Maillot modifié.':'Maillot ajouté à ta collection.')}
function enregistrerWish(){synchroForm();const f=etat.form;if(!f||!f.equipe){toast('Indique au moins l\'équipe.');return}
 const i=wishlist.findIndex(x=>String(x.id)===String(f.id));const base=i>=0?wishlist[i]:{id:uid(),date:Date.now(),statut:'suivi'};
 const w=Object.assign({},base,{equipe:f.equipe,saison:f.saison||'',marque:f.marque||'',categorie:f.categorie||'',version:f.version||'Replica',flocage:!!f.flocage,joueur:f.joueur||'',numero:f.numero||'',budget:f.budget>0?Number(f.budget):null,imageUrl:f.imageUrl||'',alerte:f.alerte!==false,notes:f.notes||''});
 if(i>=0)wishlist[i]=w;else wishlist.unshift(w);etat.suggCache={};sauver();fermerModal();toast(i>=0?'Souhait modifié.':'Ajouté à ta wishlist.')}
async function ajouterPhotos(files){synchroForm();const f=etat.form;if(!f||!files)return;const libres=4-(f.photos||[]).length;const liste=[...files].slice(0,Math.max(0,libres));if(!liste.length){toast('4 photos maximum.');return}toast('Ajout des photos…',true);let n=0;
 for(const file of liste){try{const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(file)});const petit=await compresser(data,1200,0.82);const id=await PHOTOS.put(petit);f.photos.push(id);(f._ajoutees=f._ajoutees||[]).push(id);n++}catch(e){toast('Photo illisible : '+file.name)}}
 rendre();toast(`${n} photo${n>1?'s':''} ajoutée${n>1?'s':''}.`)}
function sauverParams(afficher){const g=n=>$(`main [name="${n}"]`);if(!g('relais'))return;
 params.prenom=g('prenom').value.trim();params.relais=g('relais').value.trim().replace(/\/$/,'');params.code=g('code').value.trim();params.relaisImages=g('relaisImages').value.trim().replace(/\/$/,'');
 params.photosWeb=g('photosWeb').checked;params.ebay=g('ebay').checked;params.vinted=g('vinted').checked;params.google=g('google')?g('google').checked:true;params.veille=g('veille').checked;
 sauver();if(afficher){rendre();toast('Paramètres enregistrés.')}}
async function tester(){sauverParams(false);const el=$('#res-test');if(!params.relais){toast('Renseigne d\'abord l\'adresse du relais.');return}if(el)el.textContent='Test en cours…';
 try{const j=await relais('test');const v=+j.version||0;
  let txt=`Connexion OK · relais v${j.version||'?'} · SerpApi ${j.serpapi?'OK':'absent'} · Lens ${j.lens?'OK':'absent'} · eBay ${j.ebay?'OK':'absent'} · Boutiques Google ${j.google?'OK':'absent'} · Cache KV ${j.kv?'OK':'absent'}`;
  if(v&&v<7)txt+='<br><b style="color:var(--rouge)">Relais ancien : recolle le code v7 du Worker maillots-relais puis « Deploy ».</b>';
  if(Array.isArray(j.details)&&j.details.length)txt+='<br>'+j.details.map(x=>esc(String(x))).join('<br>');
  if(el)el.innerHTML=txt;toast('Relais joignable.');await testerImages()}
 catch(e){if(el)el.innerHTML=`<span style="color:var(--rouge)">Échec : ${esc(e.message)}</span>`;toast('Connexion impossible : '+e.message)}}
async function testerImages(){const el=$('#res-test');if(!el||params.photosWeb===false)return;
 try{const r=await fetch(urlImages(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:params.code,action:'images',q:'maillot France 1998'})});const j=await r.json().catch(()=>({}));const n=(j.images||[]).length;
  el.innerHTML+='<br>Photos eBay : '+(r.ok&&j.ok!==false?(n?`${n} image${n>1?'s':''} trouvée${n>1?'s':''} (test « maillot France 1998 »)`:'aucune image (vérifie EBAY_CLIENT_ID / EBAY_CLIENT_SECRET)'):'erreur '+esc(String(j.erreur||j.error||r.status)))}
 catch(e){el.innerHTML+='<br>Photos eBay : erreur '+esc(e.message)}}
async function exporter(){toast('Préparation de la sauvegarde…',true);const photos=await PHOTOS.tout().catch(()=>({}));
 const d={app:'mes-maillots',version:VERSION,date:new Date().toISOString(),collection,wishlist,params:Object.assign({},params),photos,quota:quota(),img:IMG};
 const blob=new Blob([JSON.stringify(d)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`mes-maillots-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);
 params.dernierExport=Date.now();sauver();rendre();toast('Sauvegarde téléchargée.')}
async function importer(file){if(!file)return;try{const d=JSON.parse(await file.text());if(!d||!Array.isArray(d.collection))throw new Error('fichier non reconnu');
 if(!confirm(`Remplacer la collection actuelle (${collection.length} maillots) par celle du fichier (${d.collection.length} maillots, ${(d.wishlist||[]).length} en wishlist) ?`))return;toast('Import en cours…',true);
 collection=d.collection;wishlist=Array.isArray(d.wishlist)?d.wishlist:[];const anc={relais:params.relais,code:params.code,relaisImages:params.relaisImages};params=Object.assign({},params,d.params||{});if(!params.relais)params.relais=anc.relais;if(!params.code)params.code=anc.code;if(!params.relaisImages)params.relaisImages=anc.relaisImages;
 if(d.photos&&typeof d.photos==='object')for(const [id,data] of Object.entries(d.photos))await PHOTOS.putId(id,data);
 if(d.img&&typeof d.img==='object'){Object.assign(IMG,d.img);ecrire(K.img,IMG)}
 await migrer();etat.suggCache={};sauver();etat.page='collection';rendre();toast('Sauvegarde restaurée.')}catch(e){toast('Import impossible : '+e.message)}}

/* ===================== ÉVÉNEMENTS ===================== */
function brancher(){
 root.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b||!root.contains(b))return;const a=b.dataset.a;const id=b.dataset.id;
  const m=id?collection.find(x=>String(x.id)===String(id)):null;const w=id?wishlist.find(x=>String(x.id)===String(id)):null;
  try{switch(a){
   case 'page':etat.page=b.dataset.p;etat.panneau=false;window.scrollTo(0,0);rendre();break;
   case 'ajouter':ouvrirFormMaillot(null);break;
   case 'ajouter-wish':ouvrirFormWish(null);break;
   case 'fiche':if(m){etat.modal='fiche';etat.ficheId=m.id;etat.carrousel=0;etat.srcOuverte='';rendre()}break;
   case 'favori':if(m){m.favori=!m.favori;sauver();rendre()}break;
   case 'modifier':if(m)ouvrirFormMaillot(m);break;
   case 'supprimer':if(m&&confirm(`Supprimer « ${m.equipe} ${m.saison||''} » de ta collection ?`)){for(const p of (m.photos||[]))await PHOTOS.del(p);collection=collection.filter(x=>x!==m);etat.suggCache={};sauver();fermerModal();toast('Maillot supprimé.')}break;
   case 'estimer-fiche':if(m)await estimerMaillot(m);break;
   case 'estimer':{synchroForm();const f=etat.form;if(!f)break;if(!params.relais){toast('Configure le relais dans Paramètres.');break}if(!f.equipe){toast('Indique d\'abord l\'équipe.');break}
    toast(`Recherche des annonces (eBay, Vinted, Leboncoin${params.google!==false?' + boutiques Google':''})…`,true);const c=await collecter(f,{google:true});f.releve=fusion(f.releve,c);const s=analyserPrix(f.releve.annonces);if(s){f.valeur=s.mediane;f.dateEstimation=Date.now()}rendre();
    toast(s?`Valeur estimée ${euros(s.mediane)} (occasion) · ${c.annonces.length} annonces.`:'Aucune annonce d\'occasion exploitable : essaie « Compléter avec Vinted/Leboncoin » ou simplifie la saison.');break}
   case 'estim-src':synchroForm();etat.srcOuverte=etat.srcOuverte===b.dataset.s?'':b.dataset.s;rendre();break;
   case 'estim-vinted':case 'estim-google':{const c=String(b.dataset.c||'');const google=a==='estim-google';let x=null,type='';
    if(c==='form'){synchroForm();x=etat.form;type='form'}else if(c.startsWith('wish:')){x=wishlist.find(y=>String(y.id)===c.slice(5));type='wish'}else{x=collection.find(y=>String(y.id)===c);type='maillot'}
    if(!x)break;if(!params.relais){toast('Configure le relais dans Paramètres.');break}const base=x.releve;
    toast(google?'Recherche des boutiques (Google)…':'Recherche Vinted/Leboncoin…',true);
    const r=google?Object.assign({sources:[],annonces:[]},await collecterBoutiques(x)):await collecter(x,{sansEbay:true,large:!!(base&&base.vintedCherche)});
    const rel=fusion(base,r);
    if(type==='form'){x.releve=rel;if(!google){const s=analyserPrix(rel.annonces);if(s){x.valeur=s.mediane;x.dateEstimation=Date.now()}}}
    else if(type==='wish'){if(google){x.releve=rel;x.dernierReleve=Date.now()}else appliquerReleveWish(x,rel);sauver()}
    else{if(google)x.releve=rel;else appliquerReleveMaillot(x,rel);sauver()}
    rendre();const nb=google?(r.boutiques||[]).length:(r.annonces||[]).length;
    toast(r.erreurs&&r.erreurs.length?r.erreurs[0]:(google?`${nb} boutique${nb>1?'s':''} trouvée${nb>1?'s':''} (prix neuf, hors calcul).`:`${nb} annonce${nb>1?'s':''} Vinted/Leboncoin ajoutée${nb>1?'s':''}.`));break}
   case 'carrousel':etat.carrousel+=Number(b.dataset.d)||0;rendre();break;
   case 'img-suivante':{const k=norm(b.dataset.q||'');const c=IMG[k];if(c&&c.images&&c.images.length>1){c.i=((c.i||0)+1)%c.images.length;ecrire(K.img,IMG);synchroForm();rendre()}else toast(c&&c.images&&c.images.length?'Une seule photo disponible pour ce maillot.':'Photo pas encore chargée : réessaie dans un instant.');break}
   case 'wish-onglet':etat.statutWish=b.dataset.s;rendre();break;
   case 'wish-modifier':if(w)ouvrirFormWish(w);break;
   case 'wish-annonces':if(w){etat.modal='wish-annonces';etat.wishId=w.id;etat.srcOuverte='';rendre()}break;
   case 'wish-trouve':if(w){w.statut='trouve';sauver();rendre();toast('Bravo ! Retrouve-le dans l\'onglet « Trouvés » pour l\'ajouter à ta collection.')}break;
   case 'wish-pause':if(w){w.statut='pause';sauver();rendre()}break;
   case 'wish-reprendre':if(w){w.statut='suivi';sauver();rendre()}break;
   case 'wish-vers-collection':if(w)depuisWish(w);break;
   case 'wish-alerte':if(w){w.alerte=!w.alerte;sauver();rendre()}break;
   case 'wish-supprimer':if(w&&confirm(`Retirer « ${w.equipe} ${w.saison||''} » de la wishlist ?`)){wishlist=wishlist.filter(x=>x!==w);etat.suggCache={};sauver();if(etat.modal==='wish-annonces')fermerModal();else rendre()}break;
   case 'verifier':await verifierPrix(null,false);break;
   case 'verifier-un':if(w)await verifierPrix([w.id],false);break;
   case 'sugg-wish':{const s=suggestions().slice(0,6)[+b.dataset.i];if(!s)break;if(wishlist.some(x=>norm(x.equipe+'|'+x.saison)===norm(s.equipe+'|'+s.saison))){toast('Déjà dans ta wishlist.');break}
    wishlist.unshift({id:uid(),date:Date.now(),equipe:s.equipe,saison:s.saison,marque:s.marque||'',categorie:'',version:'Replica',flocage:!!s.joueur,joueur:s.joueur||'',numero:'',budget:null,imageUrl:'',alerte:true,statut:'suivi',notes:s.citation||''});etat.suggCache={};sauver();rendre();toast(`${s.equipe} ${s.saison} ajouté à ta wishlist.`);break}
   case 'sugg-col':{const s=suggestions().slice(0,6)[+b.dataset.i];if(!s)break;ouvrirFormMaillot({equipe:s.equipe,type:(trouverEquipe(s.equipe)||{}).type||'club',saison:s.saison,marque:s.marque||'',flocage:!!s.joueur,joueur:s.joueur||'',notes:''});break}
   case 'idees':etat.seed++;etat.suggCache={};rendre();break;
   case 'notifs':etat.panneau=!etat.panneau;rendre();break;
   case 'notif':marquerLu([b.dataset.id]);etat.panneau=false;if(b.dataset.p)etat.page=b.dataset.p;rendre();break;
   case 'notif-lu-tout':marquerLu(notifications().map(n=>n.id));rendre();break;
   case 'fermer':case 'fermer-voile':{if(a==='fermer-voile'&&e.target!==b)break;const f=etat.form;if(f&&f._ajoutees)for(const p of f._ajoutees)await PHOTOS.del(p);fermerModal();break}
   case 'lens':await identifierLens();break;
   case 'appliquer':appliquerLens(+b.dataset.i);break;
   case 'photo-suppr':{synchroForm();const f=etat.form;if(!f)break;const i=+b.dataset.i;const p=f.photos[i];if(p==null)break;f.photos.splice(i,1);if(f._ajoutees&&f._ajoutees.includes(p)){f._ajoutees=f._ajoutees.filter(x=>x!==p);await PHOTOS.del(p)}else(f._suppr=f._suppr||[]).push(p);rendre();break}
   case 'enregistrer':await enregistrerMaillot();break;
   case 'wish-enregistrer':enregistrerWish();break;
   case 'sauver-params':sauverParams(true);break;
   case 'tester':await tester();break;
   case 'exporter':await exporter();break;
   case 'vider-wiki':Object.keys(WIKI).forEach(k=>delete WIKI[k]);ecrire(K.wiki,WIKI);rendre();toast('Cache Wikipédia vidé.');break;
   case 'vider-img':Object.keys(IMG).forEach(k=>delete IMG[k]);ecrire(K.img,IMG);rendre();toast('Cache des photos web vidé.');break;
   case 'maj':{toast('Mise à jour en cours…',true);try{if('serviceWorker' in navigator){const regs=await navigator.serviceWorker.getRegistrations();for(const r of regs)await r.unregister()}if(window.caches){const ks=await caches.keys();for(const k of ks)await caches.delete(k)}}catch(err){}location.reload();break}
   case 'reset-filtres':etat.recherche='';etat.filtres={equipe:'',saison:'',couleur:'',categorie:''};rendre();break;
  }}catch(err){console.error(err);toast('Oups : '+((err&&err.message)||err))}});
 let rechTimer=0;
 root.addEventListener('input',e=>{const t=e.target;if(t.id==='recherche'){etat.recherche=t.value;clearTimeout(rechTimer);rechTimer=setTimeout(()=>{const z=$('#zone-liste');if(z){z.innerHTML=listeCollection();chargerPhotos();chargerVisuels()}},150)}else if(t.id==='lens-indice')etat.lensIndice=t.value});
 root.addEventListener('change',e=>{const t=e.target;if(t.classList.contains('pilule')){etat.filtres[t.dataset.f]=t.value;rendre()}else if(t.name==='flocage'&&t.closest('#f-maillot,#f-wish')){synchroForm();rendre()}else if(t.id==='fichier-photo'){ajouterPhotos(t.files)}else if(t.id==='fichier-import'){importer(t.files[0]);t.value=''}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(etat.modal)fermerModal();else if(etat.panneau){etat.panneau=false;rendre()}}})}

/* ===================== STYLES ===================== */
const STYLE_CSS=`:root{--vert:#143d2f;--vert2:#1f5a44;--or:#c9a227;--lime:#c6e36b;--fond:#f5f3ee;--beige:#efe9dc;--texte:#14201b;--gris:#6b7570;--ligne:#e6e2d9;--rouge:#e11d48}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--fond);color:var(--texte);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.45}body.bloque{overflow:hidden}
h1,h2,h3{font-family:"Playfair Display",Georgia,serif;margin:0;line-height:1.15}h1{font-size:30px}h2{font-size:22px}h3{font-size:19px;margin-bottom:10px}
button{font:inherit;cursor:pointer}input,select,textarea{font:inherit}a{color:inherit}
.ic{width:18px;height:18px;flex:none;vertical-align:-3px}
.entete{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:14px;padding:10px 18px;background:var(--vert);color:#fff}
.marque{display:flex;align-items:center;gap:10px;cursor:pointer}.marque small{display:block;font-size:11px;opacity:.75}.marque b{font-family:"Playfair Display",serif;font-size:18px}
.logo-mm{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--or);color:var(--vert)}.logo-mm .ic{width:22px;height:22px}
.nav{display:flex;gap:4px;margin-left:auto}.nav button{display:flex;align-items:center;gap:6px;padding:8px 14px;border:0;border-radius:999px;background:transparent;color:#fff;opacity:.8}.nav button.on,.nav button:hover{background:rgba(255,255,255,.14);opacity:1}
.bell{position:relative;border:0;background:rgba(255,255,255,.12);color:#fff;width:40px;height:40px;border-radius:12px;display:grid;place-items:center}.bell i{position:absolute;top:-4px;right:-4px;background:var(--or);color:var(--vert);font-style:normal;font-size:11px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:grid;place-items:center;padding:0 4px}
main{max-width:1120px;margin:0 auto;padding:22px 18px 90px}
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border:1px solid var(--ligne);border-radius:12px;background:#fff;color:var(--texte);font-weight:600;font-size:14px;text-decoration:none;line-height:1.2}.btn:hover{border-color:var(--vert2)}.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-vert{background:var(--vert);border-color:var(--vert);color:#fff}.btn-vert:hover{background:var(--vert2)}.btn-ic{padding:9px;width:38px;justify-content:center}.btn-rouge{color:var(--rouge)}
.eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gris);font-weight:700;margin-bottom:4px}
.titre-page{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:16px}.titre-page .actions{display:flex;gap:8px;flex-wrap:wrap}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.kpi{background:#fff;border:1px solid var(--ligne);border-radius:16px;padding:12px 14px}.kpi small{display:block;color:var(--gris);font-size:12px}.kpi b{font-size:20px;font-family:"Playfair Display",serif}
.plus{color:#1b8a3c}.moins{color:var(--rouge)}
.avert{display:flex;gap:10px;align-items:flex-start;background:var(--beige);border-radius:14px;padding:12px 14px;font-size:13px;color:#4b554f;margin-bottom:14px}.avert .ic{margin-top:2px;color:var(--vert2)}
.recherche{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--ligne);border-radius:14px;padding:0 14px;margin-bottom:10px}.recherche input{flex:1;border:0;outline:0;padding:12px 0;background:transparent;font-size:15px;min-width:0}
.filtres{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;align-items:center}.pilule,.pilule-btn{border:1px solid var(--ligne);background:#fff;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600;color:var(--texte);max-width:100%}.pilule-btn.on{background:var(--vert);color:#fff;border-color:var(--vert)}.pilule-btn small{opacity:.7}
.grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.carte{background:#fff;border:1px solid var(--ligne);border-radius:18px;overflow:hidden;cursor:pointer;transition:transform .15s,box-shadow .15s}.carte:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(20,32,27,.08)}
.img{position:relative;aspect-ratio:1;background:var(--beige)}
.visu{position:relative;width:100%;height:100%;overflow:hidden;display:grid;place-items:center;background:var(--beige)}.visu>*{grid-area:1/1}
.visu-img{width:100%;height:100%;object-fit:cover;position:relative;z-index:1;background:#fff}.visu-img.logo{object-fit:contain;padding:14%}.visu-img.photo{object-fit:cover}
.visu-drapeau{width:100%;height:100%;object-fit:cover;opacity:.9}.visu-maillot{width:70%;height:70%}.visu-maillot svg{width:100%;height:100%;filter:drop-shadow(0 6px 10px rgba(0,0,0,.15))}
.badge{position:absolute;left:10px;top:10px;z-index:2;background:rgba(20,61,47,.85);color:#fff;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px}
.heart{position:absolute;right:10px;top:10px;z-index:2;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.9);color:var(--gris);display:grid;place-items:center}.heart.on{color:var(--rouge)}.heart.on svg{fill:var(--rouge)}
.corps{padding:12px 14px 14px}.corps>b{display:block;font-size:15px}.meta{color:var(--gris);font-size:13px;margin-top:2px}
.bas{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--gris)}.bas b{color:var(--texte);font-size:14px;margin-left:auto}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.chip,.floc{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;background:var(--beige);color:#4b554f}.floc{background:var(--vert);color:#fff}.chip.ok{background:var(--lime);color:var(--vert)}
.aide{font-size:13px;color:var(--gris);margin:8px 0}
.wgrille{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
.wcarte{background:#fff;border:1px solid var(--ligne);border-radius:18px;padding:14px}.wcarte.ok{border-color:var(--lime);box-shadow:0 0 0 3px rgba(198,227,107,.35)}
.wtete{display:flex;gap:12px;align-items:flex-start}.wtete>div:nth-child(2){flex:1;min-width:0}.wtete b{font-size:16px}
.wvisu{width:76px;height:76px;border-radius:14px;overflow:hidden;flex:none}.wvisu.grand{width:100%;height:220px}
.wbell{border:0;background:var(--beige);color:var(--gris);width:36px;height:36px;border-radius:10px;display:grid;place-items:center;flex:none}.wbell.on{background:var(--or);color:var(--vert)}
.wsep{height:1px;background:var(--ligne);margin:12px 0}
.wprix{display:flex;gap:18px;flex-wrap:wrap}.wprix small{display:block;color:var(--gris);font-size:11px}.wprix b{font-size:18px;font-family:"Playfair Display",serif}.wprix span{font-size:12px;margin-left:6px;font-weight:600}
.wnote{font-size:12px;color:var(--gris);margin-top:8px}
.wactions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.estim{background:var(--fond);border:1px solid var(--ligne);border-radius:16px;padding:12px 14px;margin-top:14px}.estim-glob{font-size:15px;margin:6px 0 10px}.estim-form{margin-top:16px}
.src{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px dashed var(--ligne);font-size:13px;flex-wrap:wrap}.src>b:first-child{min-width:90px}
.annonces{display:flex;flex-direction:column;gap:6px;margin:4px 0 10px}
.ann{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--ligne);border-radius:12px;padding:9px 12px;color:var(--texte);text-decoration:none;font-size:13px}.ann:hover{border-color:var(--vert2)}.ann .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ann .e{font-size:11px;color:var(--gris);background:var(--beige);padding:2px 7px;border-radius:999px;white-space:nowrap}.ann>b{white-space:nowrap}.ann.sus{opacity:.55;text-decoration:line-through}.ann .ic{width:14px;height:14px;color:var(--gris)}
.hero{position:relative;overflow:hidden;background:var(--vert);color:#fff;border-radius:24px;padding:30px 28px;margin-bottom:26px}.hero h1{font-size:34px;max-width:560px;margin:6px 0 16px}.hero em{color:var(--or);font-style:italic}.hero .eyebrow{color:var(--lime)}
.deco{position:absolute;right:-20px;top:-20px;width:240px;height:240px;opacity:.18;transform:rotate(12deg);pointer-events:none}.deco svg{width:100%;height:100%}
.stats{display:flex;gap:26px;flex-wrap:wrap;margin-bottom:18px;position:relative}.stats b{display:block;font-size:26px;font-family:"Playfair Display",serif}.stats small{opacity:.75}
.hero .btn{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff}.hero .btn-vert{background:var(--or);border-color:var(--or);color:var(--vert)}.hero .wactions{position:relative}
.section{margin-top:26px}
.sugg{background:#fff;border:1px solid var(--ligne);border-radius:18px;overflow:hidden;display:flex;flex-direction:column}.sugg .img{aspect-ratio:4/3}.sugg .corps{display:flex;flex-direction:column;flex:1}.sugg .wactions{margin-top:auto;padding-top:10px}
.sugg-grille{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.cit{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-size:14px;color:#4b554f;margin:8px 0 0}.raison{font-size:11px;font-weight:700;color:var(--vert2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
.vide{text-align:center;padding:50px 20px;color:var(--gris)}.vide .ic{width:40px;height:40px;opacity:.5}.vide p{margin:10px 0 16px}
.carte-param{background:#fff;border:1px solid var(--ligne);border-radius:18px;padding:18px;margin-bottom:14px}
.form{display:grid;gap:12px}.form label{display:grid;gap:5px;font-size:13px;font-weight:600;color:#4b554f;min-width:0}.form input,.form select,.form textarea{width:100%;padding:10px 12px;border:1px solid var(--ligne);border-radius:12px;background:#fff;font-size:15px;color:var(--texte)}.form textarea{min-height:80px;resize:vertical}.form .ligne{display:grid;grid-template-columns:1fr 1fr;gap:12px}.form .ligne.trois{grid-template-columns:1fr 1fr 1fr}
.case{display:flex!important;align-items:center;gap:10px;font-weight:500!important}.case input{width:20px!important;height:20px;accent-color:var(--vert);flex:none}
.quota{display:grid;gap:6px;margin:6px 0}.jauge{height:10px;background:var(--beige);border-radius:5px;overflow:hidden}.jauge i{display:block;height:100%;background:linear-gradient(90deg,var(--vert2),var(--or))}
.voile{position:fixed;inset:0;z-index:40;background:rgba(20,32,27,.55);display:flex;align-items:flex-end;justify-content:center}
.modal{position:relative;background:var(--fond);width:100%;max-width:760px;max-height:94vh;overflow:auto;border-radius:24px 24px 0 0;padding:22px 20px 30px;-webkit-overflow-scrolling:touch}
.fermer{position:absolute;right:14px;top:14px;z-index:3;width:36px;height:36px;border:0;border-radius:50%;background:#fff;color:var(--texte);display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.12)}.fermer.petit{width:26px;height:26px;right:6px;top:6px}
.carrousel{position:relative;aspect-ratio:1;max-height:420px;border-radius:18px;overflow:hidden;background:var(--beige);margin:14px 0}.carrousel .visu{height:100%}
.fl{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;border:0;border-radius:50%;background:rgba(255,255,255,.9);display:grid;place-items:center;z-index:2}.fl.g{left:10px}.fl.d{right:10px}
.pts{position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:6px;z-index:2}.pts i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.6)}.pts i.on{background:#fff}
.ftete{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding-right:44px;margin-bottom:10px}.ftete .heart{position:static;flex:none}
.det{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:14px 0}.det>div{background:#fff;border:1px solid var(--ligne);border-radius:12px;padding:9px 12px;min-width:0}.det small{display:block;color:var(--gris);font-size:11px}.det b{font-size:14px;word-break:break-word}
.photos-edit{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 14px}.ph{position:relative;width:92px;height:92px;border-radius:14px;overflow:hidden;background:var(--beige);border:1px solid var(--ligne)}.ph.ajout{display:grid;place-items:center;align-content:center;gap:4px;cursor:pointer;color:var(--vert2);font-size:12px;font-weight:700;border-style:dashed}
.lens{background:#fff;border:1px solid var(--ligne);border-radius:16px;padding:12px 14px;margin-bottom:14px}.lens .ligne{align-items:end}
.lens-res{margin-top:10px}.props{display:grid;gap:8px;margin-top:8px}.prop{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--fond);border-radius:12px;padding:10px 12px}.mini{font-size:12px;color:var(--gris)}
.simil{display:flex;gap:8px;overflow-x:auto;margin-top:10px;padding-bottom:4px}.simil a{flex:none;width:84px;height:84px;border-radius:10px;overflow:hidden;background:var(--beige)}.simil img{width:100%;height:100%;object-fit:cover}
.panneau{position:fixed;top:0;right:0;bottom:0;z-index:45;width:min(380px,100%);background:#fff;box-shadow:-10px 0 40px rgba(0,0,0,.18);padding:18px;overflow:auto}.panneau .ftete{padding-right:0}.panneau .ftete>div{display:flex;gap:8px;align-items:center}.panneau .fermer{position:static;box-shadow:none;background:var(--beige)}
.notif{display:grid;gap:3px;width:100%;text-align:left;border:1px solid var(--ligne);background:var(--fond);border-radius:14px;padding:12px 14px;margin-bottom:8px;color:var(--texte)}.notif.lu{opacity:.55}.notif span{font-size:13px;color:var(--gris)}
.toast{position:fixed;left:50%;bottom:84px;transform:translate(-50%,20px);z-index:60;background:var(--texte);color:#fff;padding:11px 18px;border-radius:14px;font-size:14px;max-width:min(92vw,520px);opacity:0;pointer-events:none;transition:.2s;text-align:center}.toast.show{opacity:1;transform:translate(-50%,0)}
.barre{display:none}
@media(max-width:760px){.nav{display:none}.barre{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:30;background:#fff;border-top:1px solid var(--ligne);padding:6px 6px calc(6px + env(safe-area-inset-bottom))}.barre button{flex:1;display:grid;place-items:center;gap:2px;border:0;background:transparent;color:var(--gris);font-size:11px;font-weight:600;padding:6px 0}.barre button.on{color:var(--vert)}.barre .ic{width:22px;height:22px}
 main{padding:16px 14px 90px}h1{font-size:26px}.hero{padding:24px 20px}.hero h1{font-size:28px}.kpis{grid-template-columns:1fr 1fr}.grille{grid-template-columns:1fr 1fr;gap:10px}.wgrille{grid-template-columns:1fr}.form .ligne,.form .ligne.trois{grid-template-columns:1fr}.modal{max-height:92vh;padding:18px 14px 28px}.src>b:first-child{min-width:0}.marque small{display:none}.toast{bottom:76px}}
@media(min-width:761px){.voile{align-items:center;padding:20px}.modal{border-radius:24px}}`;
function styles(){$$('style[id^="style-v"]').forEach(s=>s.remove());
 if(!$('#fonts-mm')){const l=document.createElement('link');l.id='fonts-mm';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap';document.head.appendChild(l)}
 const s=document.createElement('style');s.id='style-v35';s.textContent=STYLE_CSS;document.head.appendChild(s)}

/* ===================== DÉMARRAGE ===================== */
async function demarrer(){styles();root=$('#app');if(!root){root=document.createElement('div');root.id='app';document.body.appendChild(root)}brancher();
 try{await migrer()}catch(e){console.error(e)}rendre();
 if('serviceWorker' in navigator){try{await navigator.serviceWorker.register('./sw.js')}catch(e){}}
 setTimeout(veilleAuto,4000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',demarrer);else demarrer();
})();
