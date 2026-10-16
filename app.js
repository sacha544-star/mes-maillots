'use strict';
(function () {
const VERSION = '2.1';
const K = { col: 'mm_collection', wish: 'mm_wishlist', par: 'mm_params', quota: 'mm_quota' };
const TYPES = ['Domicile', 'Extérieur', 'Third', 'Gardien', 'Autre'];
const TAILLES = ['Enfant', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const ETATS = ['Neuf avec étiquette', 'Neuf sans étiquette', 'Très bon état', 'Bon état', 'État correct', 'Abîmé'];
const MARQUES = ['Adidas', 'Nike', 'Puma', 'Umbro', 'Kappa', 'Hummel', 'Macron', 'New Balance', 'Joma', 'Le Coq Sportif', 'Castore', 'Erreà', 'Lotto', 'Diadora', 'Reebok', 'Asics', 'Mizuno', 'Uhlsport', 'Warrior', 'Under Armour', 'Fila', 'Patrick', 'Duarig', 'Airness', 'Jako', 'Score Draw', 'Autre'];
const PRIORITES = ['Normale', 'Haute', 'Rêve absolu'];
const QUOTA_MAX = 250;

/* ---------- SÉLECTIONS : Nom|code drapeau|autres noms (anglais…) ---------- */
const SELECTIONS_BRUT = `
Albanie|al|albania
Allemagne|de|germany;deutschland;dfb
Andorre|ad|andorra
Angleterre|gb-eng|england
Arménie|am|armenia
Autriche|at|austria;osterreich
Azerbaïdjan|az|azerbaijan
Belgique|be|belgium;belgie;red devils;diables rouges
Biélorussie|by|belarus
Bosnie-Herzégovine|ba|bosnia
Bulgarie|bg|bulgaria
Chypre|cy|cyprus
Croatie|hr|croatia;hrvatska
Danemark|dk|denmark;danmark
Écosse|gb-sct|scotland
Espagne|es|spain;espana
Estonie|ee|estonia
Finlande|fi|finland;suomi
France|fr|equipe de france;les bleus
Géorgie|ge|georgia
Gibraltar|gi|
Grèce|gr|greece;hellas
Hongrie|hu|hungary;magyar
Îles Féroé|fo|faroe islands
Irlande|ie|ireland;republic of ireland
Irlande du Nord|gb-nir|northern ireland
Islande|is|iceland
Israël|il|israel
Italie|it|italy;italia;azzurri
Kazakhstan|kz|
Kosovo|xk|
Lettonie|lv|latvia
Liechtenstein|li|
Lituanie|lt|lithuania
Luxembourg|lu|
Macédoine du Nord|mk|north macedonia;macedonia
Malte|mt|malta
Moldavie|md|moldova
Monténégro|me|montenegro
Norvège|no|norway;norge
Pays-Bas|nl|netherlands;holland;hollande;nederland;oranje
Pays de Galles|gb-wls|wales;cymru
Pologne|pl|poland;polska
Portugal|pt|
République tchèque|cz|czech republic;czechia;tchequie
Roumanie|ro|romania
Russie|ru|russia
Saint-Marin|sm|san marino
Serbie|rs|serbia;srbija
Slovaquie|sk|slovakia
Slovénie|si|slovenia
Suède|se|sweden;sverige
Suisse|ch|switzerland;schweiz
Turquie|tr|turkey;turkiye
Ukraine|ua|
Argentine|ar|argentina;afa
Bolivie|bo|bolivia
Brésil|br|brazil;brasil;cbf
Chili|cl|chile
Colombie|co|colombia
Équateur|ec|ecuador
Paraguay|py|
Pérou|pe|peru
Uruguay|uy|
Venezuela|ve|
Canada|ca|
Costa Rica|cr|
Cuba|cu|
Curaçao|cw|curacao
Salvador|sv|el salvador
Guatemala|gt|
Haïti|ht|haiti
Honduras|hn|
Jamaïque|jm|jamaica;reggae boyz
Mexique|mx|mexico
Panama|pa|
Trinité-et-Tobago|tt|trinidad
États-Unis|us|usa;united states;us soccer
Guadeloupe|gp|
Martinique|mq|
Guyane|gf|
Suriname|sr|
Porto Rico|pr|puerto rico
République dominicaine|do|dominican republic
Nicaragua|ni|
Belize|bz|
Bermudes|bm|bermuda
Barbade|bb|barbados
Bahamas|bs|
Guyana|gy|
Antigua-et-Barbuda|ag|antigua
Sainte-Lucie|lc|saint lucia
Saint-Vincent-et-les-Grenadines|vc|
Grenade|gd|grenada
Dominique|dm|dominica
Aruba|aw|
Îles Caïmans|ky|cayman islands
Afrique du Sud|za|south africa;bafana bafana
Algérie|dz|algeria;fennecs
Angola|ao|
Bénin|bj|benin
Botswana|bw|
Burkina Faso|bf|
Burundi|bi|
Cameroun|cm|cameroon;lions indomptables
Cap-Vert|cv|cape verde;cabo verde
République centrafricaine|cf|central african republic
Comores|km|comoros
Congo|cg|congo brazzaville
RD Congo|cd|dr congo;congo kinshasa;leopards;zaire
Côte d'Ivoire|ci|ivory coast;cote d ivoire;elephants
Djibouti|dj|
Égypte|eg|egypt;pharaohs
Érythrée|er|eritrea
Eswatini|sz|swaziland
Éthiopie|et|ethiopia
Gabon|ga|
Gambie|gm|gambia
Ghana|gh|black stars
Guinée|gn|guinea
Guinée-Bissau|gw|guinea bissau
Guinée équatoriale|gq|equatorial guinea
Kenya|ke|harambee stars
Lesotho|ls|
Liberia|lr|
Libye|ly|libya
Madagascar|mg|
Malawi|mw|
Mali|ml|aigles du mali
Maroc|ma|morocco;lions de l atlas;atlas lions
Maurice|mu|mauritius
Mauritanie|mr|mauritania
Mozambique|mz|
Namibie|na|namibia
Niger|ne|
Nigeria|ng|super eagles
Ouganda|ug|uganda
Rwanda|rw|
São Tomé-et-Principe|st|sao tome
Sénégal|sn|senegal;lions de la teranga
Seychelles|sc|
Sierra Leone|sl|
Somalie|so|somalia
Soudan|sd|sudan
Soudan du Sud|ss|south sudan
Tanzanie|tz|tanzania
Tchad|td|chad
Togo|tg|
Tunisie|tn|tunisia;aigles de carthage
Zambie|zm|zambia
Zimbabwe|zw|
Afghanistan|af|
Arabie saoudite|sa|saudi arabia
Australie|au|australia;socceroos
Bahreïn|bh|bahrain
Bangladesh|bd|
Bhoutan|bt|bhutan
Birmanie|mm|myanmar
Brunei|bn|
Cambodge|kh|cambodia
Chine|cn|china
Corée du Nord|kp|north korea
Corée du Sud|kr|south korea;korea republic
Émirats arabes unis|ae|united arab emirates;uae
Hong Kong|hk|
Inde|in|india
Indonésie|id|indonesia
Irak|iq|iraq
Iran|ir|team melli
Japon|jp|japan;nippon;samurai blue
Jordanie|jo|jordan
Kirghizistan|kg|kyrgyzstan
Koweït|kw|kuwait
Laos|la|
Liban|lb|lebanon
Macao|mo|
Malaisie|my|malaysia
Maldives|mv|
Mongolie|mn|mongolia
Népal|np|nepal
Oman|om|
Ouzbékistan|uz|uzbekistan
Pakistan|pk|
Palestine|ps|
Philippines|ph|
Qatar|qa|
Singapour|sg|singapore
Sri Lanka|lk|
Syrie|sy|syria
Tadjikistan|tj|tajikistan
Taïwan|tw|chinese taipei;taiwan
Thaïlande|th|thailand
Timor oriental|tl|timor leste
Turkménistan|tm|turkmenistan
Viêt Nam|vn|vietnam
Yémen|ye|yemen
Guam|gu|
Nouvelle-Zélande|nz|new zealand;all whites
Fidji|fj|fiji
Nouvelle-Calédonie|nc|new caledonia
Papouasie-Nouvelle-Guinée|pg|papua new guinea
Îles Salomon|sb|solomon islands
Samoa|ws|
Tahiti|pf|
Tonga|to|
Vanuatu|vu|
Îles Cook|ck|cook islands
URSS||ussr;soviet union;cccp;union sovietique
Yougoslavie||yugoslavia;jugoslavija
Tchécoslovaquie||czechoslovakia
RDA||east germany;ddr;allemagne de l est
Allemagne de l'Ouest|de|west germany
Serbie-et-Monténégro||serbia and montenegro
Zaïre|cd|zaire
Catalogne|es-ct|catalonia;catalunya
Pays basque|es-pv|basque country;euskadi
Galice|es-ga|galicia
Bretagne||brittany;breizh
Corse||corsica
La Réunion|re|reunion
Mayotte|yt|
Groenland|gl|greenland
Québec||quebec
Kurdistan||
Tibet||
`;

/* ---------- CLUBS : Nom|Pays|couleur 1|couleur 2|motif|autres noms ----------
   motifs : uni, rayures, cerceaux, moitie, diag, manches, bande, bandev */
const CLUBS_BRUT = `
Paris Saint-Germain|France|#004170|#da291c|bandev|psg;paris sg;paris saint germain
Olympique de Marseille|France|#ffffff|#2faee0|uni|om;marseille
Olympique Lyonnais|France|#ffffff|#da291c|uni|ol;lyon
AS Monaco|France|#e30613|#ffffff|diag|monaco
Lille OSC|France|#e30613|#ffffff|uni|losc;lille
OGC Nice|France|#e30613|#000000|rayures|nice
RC Lens|France|#f6c700|#e30613|moitie|lens
Stade Rennais|France|#e30613|#000000|uni|rennes
FC Nantes|France|#ffd500|#007a33|uni|nantes
AS Saint-Étienne|France|#009b48|#ffffff|uni|asse;saint etienne;sainte
Girondins de Bordeaux|France|#0a1f44|#ffffff|uni|bordeaux
RC Strasbourg|France|#0070b8|#ffffff|uni|strasbourg
Montpellier HSC|France|#0a2a6b|#f26522|uni|montpellier
Stade de Reims|France|#e30613|#ffffff|uni|reims
Toulouse FC|France|#5d3b8c|#ffffff|uni|toulouse;tfc
FC Lorient|France|#ff6b00|#000000|uni|lorient
Stade Brestois|France|#e30613|#ffffff|rayures|brest
FC Metz|France|#7a0f2a|#ffffff|uni|metz
AJ Auxerre|France|#ffffff|#1a4f9c|uni|auxerre
Le Havre AC|France|#73c2fb|#0a1f44|moitie|le havre;hac
Angers SCO|France|#ffffff|#000000|rayures|angers
AS Nancy-Lorraine|France|#e30613|#ffffff|uni|nancy
FC Sochaux|France|#ffd500|#1a4f9c|uni|sochaux
EA Guingamp|France|#e30613|#000000|uni|guingamp
ESTAC Troyes|France|#1a4f9c|#ffffff|uni|troyes
SM Caen|France|#1a4f9c|#e30613|uni|caen
SC Bastia|France|#1a4f9c|#ffffff|uni|bastia
AC Ajaccio|France|#e30613|#ffffff|uni|ajaccio
Clermont Foot|France|#e30613|#1a4f9c|uni|clermont
Dijon FCO|France|#e30613|#ffffff|uni|dijon
Nîmes Olympique|France|#e30613|#ffffff|uni|nimes
Grenoble Foot|France|#1a4f9c|#ffffff|uni|grenoble
Paris FC|France|#1a4f9c|#ffffff|uni|
Red Star FC|France|#009b48|#ffffff|uni|red star
Valenciennes FC|France|#e30613|#ffffff|uni|valenciennes
CS Sedan|France|#009b48|#e30613|uni|sedan
Amiens SC|France|#ffffff|#4a4a4a|uni|amiens
Stade Lavallois|France|#ff6b00|#000000|uni|laval
Manchester United|Angleterre|#da291c|#ffffff|uni|man utd;man united;manchester utd
Manchester City|Angleterre|#6cabdd|#ffffff|uni|man city
Liverpool FC|Angleterre|#c8102e|#ffffff|uni|liverpool;lfc
Arsenal|Angleterre|#ef0107|#ffffff|manches|gunners
Chelsea FC|Angleterre|#034694|#ffffff|uni|chelsea
Tottenham Hotspur|Angleterre|#ffffff|#132257|uni|tottenham;spurs
Newcastle United|Angleterre|#000000|#ffffff|rayures|newcastle;nufc
Aston Villa|Angleterre|#670e36|#95bfe5|manches|villa
Everton FC|Angleterre|#003399|#ffffff|uni|everton
West Ham United|Angleterre|#7a263a|#1bb1e7|manches|west ham
Leeds United|Angleterre|#ffffff|#ffcd00|uni|leeds
Leicester City|Angleterre|#003090|#ffffff|uni|leicester
Wolverhampton Wanderers|Angleterre|#fdb913|#231f20|uni|wolves;wolverhampton
Nottingham Forest|Angleterre|#dd0000|#ffffff|uni|forest
Brighton & Hove Albion|Angleterre|#0057b8|#ffffff|rayures|brighton
Crystal Palace|Angleterre|#1b458f|#c4122e|rayures|palace
Southampton FC|Angleterre|#d71920|#ffffff|rayures|southampton;saints
Sunderland AFC|Angleterre|#eb172b|#ffffff|rayures|sunderland
Sheffield United|Angleterre|#ee2737|#ffffff|rayures|sheffield utd;blades
Sheffield Wednesday|Angleterre|#0e00f7|#ffffff|rayures|
Stoke City|Angleterre|#e03a3e|#ffffff|rayures|stoke
Fulham FC|Angleterre|#ffffff|#000000|uni|fulham
Brentford FC|Angleterre|#e30613|#ffffff|rayures|brentford
AFC Bournemouth|Angleterre|#da291c|#000000|rayures|bournemouth
Burnley FC|Angleterre|#6c1d45|#99d6ea|manches|burnley
Ipswich Town|Angleterre|#0044a9|#ffffff|uni|ipswich
Norwich City|Angleterre|#fff200|#00a650|uni|norwich
Blackburn Rovers|Angleterre|#009ee0|#ffffff|moitie|blackburn
Queens Park Rangers|Angleterre|#1d5ba4|#ffffff|cerceaux|qpr
Derby County|Angleterre|#ffffff|#000000|uni|derby
Middlesbrough FC|Angleterre|#e21a23|#ffffff|uni|middlesbrough;boro
Portsmouth FC|Angleterre|#001489|#ffffff|uni|portsmouth;pompey
West Bromwich Albion|Angleterre|#122f67|#ffffff|rayures|west brom;wba
Coventry City|Angleterre|#5fb7f0|#ffffff|uni|coventry
Birmingham City|Angleterre|#0000ff|#ffffff|uni|birmingham
Millwall FC|Angleterre|#001d5e|#ffffff|uni|millwall
Charlton Athletic|Angleterre|#d4021d|#ffffff|uni|charlton
Reading FC|Angleterre|#004494|#ffffff|cerceaux|reading
Huddersfield Town|Angleterre|#0e63ad|#ffffff|rayures|huddersfield
Watford FC|Angleterre|#fbee23|#ed2127|uni|watford
Luton Town|Angleterre|#f78f1e|#002d62|uni|luton
Plymouth Argyle|Angleterre|#004d3d|#ffffff|uni|plymouth
Bristol City|Angleterre|#e21c38|#ffffff|uni|
Hull City|Angleterre|#f5a12d|#000000|rayures|hull
Preston North End|Angleterre|#ffffff|#1b2a6b|uni|preston
Bolton Wanderers|Angleterre|#ffffff|#1b2a6b|uni|bolton
Wigan Athletic|Angleterre|#1d59af|#ffffff|rayures|wigan
Blackpool FC|Angleterre|#f68712|#ffffff|uni|blackpool
Leyton Orient|Angleterre|#e30613|#ffffff|uni|
Wimbledon FC|Angleterre|#2b4596|#ffe400|uni|wimbledon
Real Madrid|Espagne|#ffffff|#1f3b8a|uni|real madrid cf
FC Barcelone|Espagne|#a50044|#004d98|rayures|barcelona;barca;fcb
Atlético de Madrid|Espagne|#cb3524|#ffffff|rayures|atletico madrid;atletico;atleti
Séville FC|Espagne|#ffffff|#d4021d|uni|sevilla;seville
Real Betis|Espagne|#00954c|#ffffff|rayures|betis
Valence CF|Espagne|#ffffff|#000000|uni|valencia
Villarreal CF|Espagne|#ffe667|#005187|uni|villarreal
Athletic Bilbao|Espagne|#ee2523|#ffffff|rayures|athletic club;bilbao
Real Sociedad|Espagne|#0067b1|#ffffff|rayures|real sociedad
RCD Espanyol|Espagne|#007fc8|#ffffff|rayures|espanyol
Celta Vigo|Espagne|#8ac3ee|#ffffff|uni|celta
Deportivo La Corogne|Espagne|#004b9b|#ffffff|rayures|deportivo;depor;la coruna
CA Osasuna|Espagne|#d91a21|#0a346f|uni|osasuna
Getafe CF|Espagne|#005999|#ffffff|uni|getafe
RCD Majorque|Espagne|#e20613|#000000|uni|mallorca;majorque
UD Las Palmas|Espagne|#ffe400|#004a98|uni|las palmas
Rayo Vallecano|Espagne|#ffffff|#e53027|diag|rayo
Girona FC|Espagne|#cd2534|#ffffff|rayures|girona
Real Saragosse|Espagne|#ffffff|#1f3b8a|uni|zaragoza;saragosse
Málaga CF|Espagne|#0078c1|#ffffff|rayures|malaga
Real Valladolid|Espagne|#ffffff|#5a2d82|rayures|valladolid
Sporting Gijón|Espagne|#e30613|#ffffff|rayures|sporting gijon
Deportivo Alavés|Espagne|#0761af|#ffffff|rayures|alaves
Cádiz CF|Espagne|#ffe400|#0a346f|uni|cadiz
Juventus|Italie|#000000|#ffffff|rayures|juve;juventus fc
AC Milan|Italie|#fb090b|#000000|rayures|milan;milan ac
Inter Milan|Italie|#010e80|#000000|rayures|inter;internazionale
AS Roma|Italie|#8e1f2f|#f0bc42|uni|roma
SS Lazio|Italie|#87d8f7|#ffffff|uni|lazio
SSC Naples|Italie|#12a0d7|#ffffff|uni|napoli;naples
ACF Fiorentina|Italie|#482e92|#ffffff|uni|fiorentina
Atalanta Bergame|Italie|#1e71b8|#000000|rayures|atalanta
Torino FC|Italie|#881f19|#ffffff|uni|torino
UC Sampdoria|Italie|#1b5497|#ffffff|bande|sampdoria;samp
Genoa CFC|Italie|#a5131e|#002d62|moitie|genoa
Bologne FC|Italie|#a21c26|#1a2f5a|rayures|bologna;bologne
Parme Calcio|Italie|#ffffff|#ffd600|uni|parma;parme
Udinese Calcio|Italie|#000000|#ffffff|rayures|udinese
US Lecce|Italie|#ffe400|#e30613|rayures|lecce
Cagliari Calcio|Italie|#ad002a|#002c5f|moitie|cagliari
US Sassuolo|Italie|#00a752|#000000|rayures|sassuolo
Palerme FC|Italie|#f4a6c1|#000000|uni|palermo;palerme
Hellas Vérone|Italie|#ffe400|#003399|uni|verona;verone
AC Monza|Italie|#e30613|#ffffff|uni|monza
Venezia FC|Italie|#000000|#f26522|uni|venezia
Brescia Calcio|Italie|#1b4f9c|#ffffff|uni|brescia
Chievo Vérone|Italie|#ffe400|#1b4f9c|uni|chievo
Bayern Munich|Allemagne|#dc052d|#ffffff|uni|bayern;fc bayern;bayern munchen
Borussia Dortmund|Allemagne|#fde100|#000000|uni|dortmund;bvb
Schalke 04|Allemagne|#004d9d|#ffffff|uni|schalke
Bayer Leverkusen|Allemagne|#e32221|#000000|uni|leverkusen
Borussia Mönchengladbach|Allemagne|#ffffff|#000000|uni|gladbach;monchengladbach
Eintracht Francfort|Allemagne|#000000|#e1000f|uni|frankfurt;francfort;eintracht
VfB Stuttgart|Allemagne|#ffffff|#e32219|bande|stuttgart
VfL Wolfsburg|Allemagne|#65b32e|#ffffff|uni|wolfsburg
RB Leipzig|Allemagne|#ffffff|#dd0741|uni|leipzig
Hambourg SV|Allemagne|#ffffff|#0a3f86|uni|hamburg;hsv;hambourg
Werder Brême|Allemagne|#1d9053|#ffffff|uni|werder;bremen;breme
FC Cologne|Allemagne|#ffffff|#ed1c24|uni|koln;cologne
Hertha Berlin|Allemagne|#005ca9|#ffffff|rayures|hertha
FC St. Pauli|Allemagne|#624a2e|#ffffff|uni|st pauli
Kaiserslautern|Allemagne|#e30613|#ffffff|uni|lautern
Union Berlin|Allemagne|#eb1923|#ffffff|uni|
SC Fribourg|Allemagne|#e30613|#ffffff|uni|freiburg;fribourg
TSG Hoffenheim|Allemagne|#1961b5|#ffffff|uni|hoffenheim
Mayence 05|Allemagne|#c3141e|#ffffff|uni|mainz;mayence
FC Nuremberg|Allemagne|#7a1f2b|#000000|uni|nurnberg;nuremberg
Hanovre 96|Allemagne|#e30613|#000000|uni|hannover;hanovre
Fortuna Düsseldorf|Allemagne|#e30613|#ffffff|uni|dusseldorf
FC Augsbourg|Allemagne|#ffffff|#ba3733|uni|augsburg
VfL Bochum|Allemagne|#005ca9|#ffffff|uni|bochum
Dynamo Dresde|Allemagne|#ffe400|#000000|uni|dresden
Benfica Lisbonne|Portugal|#e30613|#ffffff|uni|benfica;slb
FC Porto|Portugal|#ffffff|#003e7e|rayures|porto
Sporting CP|Portugal|#008057|#ffffff|cerceaux|sporting lisbonne;sporting lisbon;sporting clube
SC Braga|Portugal|#e30613|#ffffff|uni|braga
Vitória Guimarães|Portugal|#ffffff|#000000|uni|guimaraes
Boavista FC|Portugal|#000000|#ffffff|rayures|boavista
CS Marítimo|Portugal|#009b48|#e30613|rayures|maritimo
Belenenses|Portugal|#1a4f9c|#ffffff|uni|
Ajax Amsterdam|Pays-Bas|#ffffff|#d2122e|bandev|ajax;afc ajax
PSV Eindhoven|Pays-Bas|#ed1c24|#ffffff|rayures|psv
Feyenoord Rotterdam|Pays-Bas|#e30613|#ffffff|moitie|feyenoord
AZ Alkmaar|Pays-Bas|#e30613|#ffffff|uni|az
FC Twente|Pays-Bas|#e30613|#ffffff|uni|twente
FC Utrecht|Pays-Bas|#e30613|#ffffff|uni|utrecht
Vitesse Arnhem|Pays-Bas|#ffe400|#000000|rayures|vitesse
FC Groningue|Pays-Bas|#009b48|#ffffff|uni|groningen
SC Heerenveen|Pays-Bas|#1a4f9c|#ffffff|rayures|heerenveen
NEC Nimègue|Pays-Bas|#e30613|#009b48|uni|nec nijmegen
Sparta Rotterdam|Pays-Bas|#e30613|#ffffff|uni|
Willem II|Pays-Bas|#e30613|#ffffff|rayures|
NAC Breda|Pays-Bas|#ffe400|#000000|uni|nac
RSC Anderlecht|Belgique|#5c2d91|#ffffff|uni|anderlecht
Club Bruges|Belgique|#0047ab|#000000|rayures|club brugge;bruges
Standard de Liège|Belgique|#e30613|#ffffff|uni|standard;liege
KRC Genk|Belgique|#1a4f9c|#ffffff|uni|genk
La Gantoise|Belgique|#1a4f9c|#ffffff|uni|gent;gand
Royal Antwerp|Belgique|#e30613|#ffffff|uni|antwerp;anvers
Union Saint-Gilloise|Belgique|#ffe400|#1a4f9c|uni|union sg
Sporting Charleroi|Belgique|#000000|#ffffff|rayures|charleroi
Cercle Bruges|Belgique|#009b48|#000000|uni|cercle brugge
KV Malines|Belgique|#ffe400|#e30613|rayures|mechelen;malines
Celtic Glasgow|Écosse|#ffffff|#018749|cerceaux|celtic
Rangers FC|Écosse|#1b458f|#ffffff|uni|rangers;glasgow rangers
Heart of Midlothian|Écosse|#800910|#ffffff|uni|hearts
Hibernian FC|Écosse|#008000|#ffffff|manches|hibernian;hibs
Aberdeen FC|Écosse|#e2001a|#ffffff|uni|aberdeen
Dundee United|Écosse|#f58220|#000000|uni|
Dundee FC|Écosse|#1a2f5a|#ffffff|uni|
Motherwell FC|Écosse|#ffbe00|#7a263a|uni|motherwell
Kilmarnock FC|Écosse|#1a4f9c|#ffffff|rayures|kilmarnock
St Mirren|Écosse|#000000|#ffffff|rayures|
Swansea City|Pays de Galles|#ffffff|#000000|uni|swansea
Cardiff City|Pays de Galles|#0070b5|#ffffff|uni|cardiff
Wrexham AFC|Pays de Galles|#e30613|#ffffff|uni|wrexham
Shamrock Rovers|Irlande|#009b48|#ffffff|cerceaux|
Bohemians Dublin|Irlande|#e30613|#000000|rayures|bohemians
Dundalk FC|Irlande|#ffffff|#000000|uni|dundalk
Cork City|Irlande|#009b48|#ffffff|uni|
Linfield FC|Irlande du Nord|#1a4f9c|#ffffff|uni|linfield
Glentoran FC|Irlande du Nord|#009b48|#e30613|uni|glentoran
Galatasaray|Turquie|#e30613|#ffe400|moitie|gala;cimbom
Fenerbahçe|Turquie|#ffe400|#002f6c|rayures|fenerbahce;fener
Beşiktaş|Turquie|#000000|#ffffff|uni|besiktas
Trabzonspor|Turquie|#6b1e2e|#5bc2e7|rayures|
İstanbul Başakşehir|Turquie|#f26522|#1a2f5a|uni|basaksehir
Bursaspor|Turquie|#009b48|#ffffff|uni|
Olympiakos|Grèce|#e30613|#ffffff|rayures|olympiacos
Panathinaïkos|Grèce|#007a33|#ffffff|uni|panathinaikos;pao
AEK Athènes|Grèce|#ffe400|#000000|uni|aek
PAOK Salonique|Grèce|#000000|#ffffff|uni|paok
Aris Salonique|Grèce|#ffe400|#000000|uni|aris
APOEL Nicosie|Chypre|#f26522|#1a4f9c|uni|apoel
Omonia Nicosie|Chypre|#009b48|#ffffff|uni|omonia
Spartak Moscou|Russie|#e30613|#ffffff|bande|spartak
CSKA Moscou|Russie|#e30613|#1a4f9c|moitie|cska moscow
Zénith Saint-Pétersbourg|Russie|#0097d7|#ffffff|uni|zenit
Lokomotiv Moscou|Russie|#e30613|#009b48|uni|lokomotiv
Dynamo Moscou|Russie|#1a4f9c|#ffffff|uni|dynamo moscow
Dynamo Kiev|Ukraine|#ffffff|#1a4f9c|uni|dynamo kyiv;dinamo kiev
Shakhtar Donetsk|Ukraine|#f26522|#000000|uni|shakhtar
Dinamo Zagreb|Croatie|#1a4f9c|#ffffff|uni|
Hajduk Split|Croatie|#ffffff|#1a4f9c|uni|hajduk
Étoile rouge de Belgrade|Serbie|#e30613|#ffffff|rayures|red star belgrade;crvena zvezda
Partizan Belgrade|Serbie|#000000|#ffffff|rayures|partizan
Sparta Prague|République tchèque|#7a1f2b|#ffe400|uni|sparta praha
Slavia Prague|République tchèque|#e30613|#ffffff|moitie|slavia praha
Viktoria Plzeň|République tchèque|#1a4f9c|#e30613|uni|plzen
Legia Varsovie|Pologne|#009b48|#ffffff|uni|legia
Lech Poznań|Pologne|#1a4f9c|#ffffff|rayures|lech poznan
Wisła Cracovie|Pologne|#e30613|#ffffff|uni|wisla krakow
Ferencváros|Hongrie|#009b48|#ffffff|rayures|ferencvaros;fradi
FCSB Bucarest|Roumanie|#e30613|#1a4f9c|uni|steaua;fcsb
Dinamo Bucarest|Roumanie|#e30613|#ffffff|uni|dinamo bucuresti
CFR Cluj|Roumanie|#7a1f2b|#ffffff|uni|cluj
Ludogorets Razgrad|Bulgarie|#009b48|#ffffff|uni|ludogorets
CSKA Sofia|Bulgarie|#e30613|#ffffff|uni|
Levski Sofia|Bulgarie|#1a4f9c|#ffffff|uni|levski
Qarabağ FK|Azerbaïdjan|#000000|#ffffff|uni|qarabag
Maccabi Tel-Aviv|Israël|#ffe400|#1a4f9c|uni|maccabi tel aviv
Maccabi Haïfa|Israël|#009b48|#ffffff|uni|maccabi haifa
Hapoël Tel-Aviv|Israël|#e30613|#ffffff|uni|hapoel tel aviv
Sheriff Tiraspol|Moldavie|#ffe400|#000000|uni|sheriff
FC Astana|Kazakhstan|#73c2fb|#ffe400|uni|astana
FC Copenhague|Danemark|#ffffff|#1a4f9c|uni|copenhagen;fck
Brøndby IF|Danemark|#ffe400|#1a4f9c|uni|brondby
FC Midtjylland|Danemark|#000000|#e30613|rayures|midtjylland
AGF Aarhus|Danemark|#ffffff|#1a4f9c|uni|agf
Malmö FF|Suède|#73c2fb|#ffffff|uni|malmo
AIK Solna|Suède|#000000|#ffe400|uni|aik
IFK Göteborg|Suède|#1a4f9c|#ffffff|rayures|goteborg
Hammarby IF|Suède|#009b48|#ffffff|rayures|hammarby
Djurgårdens IF|Suède|#1a4f9c|#73c2fb|rayures|djurgarden
Rosenborg BK|Norvège|#ffffff|#000000|uni|rosenborg
Molde FK|Norvège|#1a4f9c|#ffffff|uni|molde
FK Bodø/Glimt|Norvège|#ffe400|#000000|uni|bodo glimt;glimt
SK Brann|Norvège|#e30613|#ffffff|uni|brann
Vålerenga|Norvège|#1a4f9c|#e30613|uni|valerenga
HJK Helsinki|Finlande|#1a4f9c|#ffffff|uni|hjk
FC Bâle|Suisse|#e30613|#1a4f9c|moitie|basel;bale
BSC Young Boys|Suisse|#ffe400|#000000|uni|young boys
FC Zurich|Suisse|#ffffff|#1a4f9c|uni|zurich
Grasshopper Zurich|Suisse|#1a4f9c|#ffffff|moitie|grasshopper
Servette FC|Suisse|#7a1f2b|#ffffff|uni|servette
FC Lugano|Suisse|#000000|#ffffff|uni|lugano
Red Bull Salzbourg|Autriche|#ffffff|#e30613|uni|salzburg;salzbourg
Rapid Vienne|Autriche|#009b48|#ffffff|uni|rapid wien
Austria Vienne|Autriche|#5c2d91|#ffffff|uni|austria wien
Sturm Graz|Autriche|#000000|#ffffff|uni|
LASK Linz|Autriche|#000000|#ffffff|rayures|lask
Boca Juniors|Argentine|#003f87|#f7b500|bande|boca
River Plate|Argentine|#ffffff|#e30613|diag|river
Independiente|Argentine|#e30613|#ffffff|uni|
Racing Club|Argentine|#73c2fb|#ffffff|rayures|racing avellaneda
San Lorenzo|Argentine|#1a4f9c|#e30613|rayures|
Vélez Sarsfield|Argentine|#ffffff|#1a4f9c|bandev|velez
Estudiantes de La Plata|Argentine|#e30613|#ffffff|rayures|estudiantes
Newell's Old Boys|Argentine|#e30613|#000000|moitie|newells
Rosario Central|Argentine|#1a4f9c|#ffe400|rayures|
Argentinos Juniors|Argentine|#e30613|#ffffff|uni|
Peñarol|Uruguay|#ffe400|#000000|rayures|penarol
Nacional Montevideo|Uruguay|#ffffff|#1a4f9c|uni|nacional
Flamengo|Brésil|#e30613|#000000|cerceaux|
Corinthians|Brésil|#ffffff|#000000|uni|
Palmeiras|Brésil|#009b48|#ffffff|uni|
Santos FC|Brésil|#ffffff|#000000|uni|santos
São Paulo FC|Brésil|#ffffff|#e30613|uni|sao paulo
Grêmio|Brésil|#1a4f9c|#000000|rayures|gremio
Internacional|Brésil|#e30613|#ffffff|uni|inter de porto alegre
Vasco da Gama|Brésil|#000000|#ffffff|diag|vasco
Fluminense|Brésil|#7a1f2b|#009b48|rayures|
Botafogo|Brésil|#000000|#ffffff|rayures|
Cruzeiro|Brésil|#1a4f9c|#ffffff|uni|
Atlético Mineiro|Brésil|#000000|#ffffff|rayures|atletico mg;galo
Athletico Paranaense|Brésil|#e30613|#000000|uni|
Bahia|Brésil|#1a4f9c|#e30613|uni|ec bahia
Colo-Colo|Chili|#ffffff|#000000|uni|colo colo
Universidad de Chile|Chili|#1a4f9c|#ffffff|uni|la u
Universidad Católica|Chili|#ffffff|#1a4f9c|diag|
Atlético Nacional|Colombie|#009b48|#ffffff|rayures|
Millonarios|Colombie|#1a4f9c|#ffffff|uni|
América de Cali|Colombie|#e30613|#ffffff|uni|
LDU Quito|Équateur|#ffffff|#000000|uni|ldu
Olimpia Asunción|Paraguay|#ffffff|#000000|bande|olimpia
Cerro Porteño|Paraguay|#e30613|#1a4f9c|rayures|cerro porteno
Alianza Lima|Pérou|#1a2f5a|#ffffff|rayures|
Universitario|Pérou|#f5e6c8|#7a1f2b|uni|
Club América|Mexique|#ffe400|#1a4f9c|uni|america;club america
Chivas Guadalajara|Mexique|#e30613|#ffffff|rayures|chivas;guadalajara
Cruz Azul|Mexique|#1a4f9c|#ffffff|uni|
Pumas UNAM|Mexique|#ffffff|#1a2f5a|uni|pumas
Tigres UANL|Mexique|#ffe400|#1a4f9c|uni|tigres
CF Monterrey|Mexique|#1a4f9c|#ffffff|rayures|monterrey;rayados
Atlas FC|Mexique|#e30613|#000000|rayures|atlas
Santos Laguna|Mexique|#009b48|#ffffff|uni|
LA Galaxy|États-Unis|#ffffff|#00245d|uni|galaxy
Inter Miami|États-Unis|#f7b5cd|#000000|uni|
LAFC|États-Unis|#000000|#c39e6d|uni|los angeles fc
Seattle Sounders|États-Unis|#5d9741|#1a2f5a|uni|sounders
Atlanta United|États-Unis|#80000b|#000000|rayures|
New York Red Bulls|États-Unis|#ffffff|#e30613|uni|red bulls
New York City FC|États-Unis|#6cabdd|#1a2f5a|uni|nycfc
Portland Timbers|États-Unis|#004812|#ffffff|uni|timbers
Columbus Crew|États-Unis|#ffe400|#000000|uni|
DC United|États-Unis|#000000|#e30613|uni|
Toronto FC|Canada|#e30613|#ffffff|uni|
CF Montréal|Canada|#1a4f9c|#000000|uni|montreal impact
Vancouver Whitecaps|Canada|#ffffff|#1a4f9c|uni|whitecaps
Al-Hilal|Arabie saoudite|#1a4f9c|#ffffff|uni|al hilal
Al-Nassr|Arabie saoudite|#ffe400|#1a4f9c|uni|al nassr
Al-Ittihad|Arabie saoudite|#ffe400|#000000|rayures|al ittihad
Al-Ahli Djeddah|Arabie saoudite|#009b48|#ffffff|uni|al ahli saudi
Al-Sadd|Qatar|#ffffff|#000000|uni|al sadd
Al-Duhail|Qatar|#e30613|#ffffff|uni|al duhail
Al-Ain FC|Émirats arabes unis|#5c2d91|#ffffff|uni|al ain
Persepolis|Iran|#e30613|#ffffff|uni|
Esteghlal|Iran|#1a4f9c|#ffffff|uni|
Al Ahly|Égypte|#e30613|#ffffff|uni|al ahly
Zamalek SC|Égypte|#ffffff|#e30613|uni|zamalek
Raja Casablanca|Maroc|#009b48|#ffffff|uni|raja
Wydad Casablanca|Maroc|#e30613|#ffffff|uni|wydad;wac
Espérance de Tunis|Tunisie|#e30613|#ffe400|uni|esperance
Étoile du Sahel|Tunisie|#e30613|#ffffff|uni|etoile sportive du sahel
Club Africain|Tunisie|#e30613|#ffffff|moitie|
JS Kabylie|Algérie|#ffe400|#009b48|uni|jsk
MC Alger|Algérie|#009b48|#e30613|uni|mouloudia
USM Alger|Algérie|#e30613|#000000|uni|usma
TP Mazembe|RD Congo|#000000|#ffffff|uni|mazembe
Mamelodi Sundowns|Afrique du Sud|#ffe400|#1a4f9c|uni|sundowns
Kaizer Chiefs|Afrique du Sud|#c9962f|#000000|uni|
Orlando Pirates|Afrique du Sud|#000000|#ffffff|uni|
Urawa Red Diamonds|Japon|#e30613|#000000|uni|urawa
Kashima Antlers|Japon|#8b0000|#ffffff|uni|kashima
Yokohama F. Marinos|Japon|#1a4f9c|#e30613|rayures|marinos
Gamba Osaka|Japon|#1a4f9c|#000000|uni|gamba
Kawasaki Frontale|Japon|#73c2fb|#000000|uni|frontale
Vissel Kobe|Japon|#7a1f2b|#ffffff|uni|vissel
Cerezo Osaka|Japon|#f4a6c1|#1a2f5a|uni|cerezo
Jeonbuk Hyundai|Corée du Sud|#009b48|#ffffff|uni|jeonbuk
FC Séoul|Corée du Sud|#e30613|#000000|rayures|fc seoul
Ulsan HD|Corée du Sud|#1a4f9c|#ffe400|uni|ulsan
Suwon Bluewings|Corée du Sud|#1a4f9c|#ffffff|uni|suwon
Shanghai Shenhua|Chine|#1a4f9c|#ffffff|uni|shenhua
Beijing Guoan|Chine|#009b48|#ffffff|uni|guoan
Guangzhou FC|Chine|#e30613|#ffffff|uni|guangzhou evergrande
Melbourne Victory|Australie|#1a2f5a|#ffffff|uni|
Sydney FC|Australie|#73c2fb|#1a2f5a|uni|
Western Sydney Wanderers|Australie|#e30613|#000000|rayures|wanderers
Wellington Phoenix|Nouvelle-Zélande|#000000|#ffe400|uni|
Auckland City|Nouvelle-Zélande|#1a4f9c|#ffffff|uni|
Mohun Bagan|Inde|#009b48|#7a1f2b|rayures|
East Bengal|Inde|#e30613|#ffe400|uni|
`;

/* ---------- Maillots cultes pour les suggestions ---------- */
const CLASSIQUES = [
  { equipe: 'Pays-Bas', categorie: 'selection', saison: '1988', type: 'Domicile', raison: "Le maillot orange géométrique de l'Euro 88, une icône absolue" },
  { equipe: 'France', categorie: 'selection', saison: '1998', type: 'Domicile', raison: 'Le maillot de la première étoile' },
  { equipe: 'Nigeria', categorie: 'selection', saison: '2018', type: 'Domicile', raison: 'Le maillot le plus vendu de la Coupe du monde 2018' },
  { equipe: 'Brésil', categorie: 'selection', saison: '2002', type: 'Domicile', raison: 'Ronaldo, Rivaldo, Ronaldinho : la 5e étoile' },
  { equipe: 'Allemagne', categorie: 'selection', saison: '1990', type: 'Domicile', raison: 'Les bandes noir-rouge-or de Rome 1990' },
  { equipe: 'Argentine', categorie: 'selection', saison: '1986', type: 'Domicile', raison: 'Le maillot de Maradona au Mexique' },
  { equipe: 'Danemark', categorie: 'selection', saison: '1986', type: 'Domicile', raison: 'Le Hummel à demi-rayures, culte chez les collectionneurs' },
  { equipe: 'Mexique', categorie: 'selection', saison: '1998', type: 'Domicile', raison: "Le calendrier aztèque d'ABA Sport" },
  { equipe: 'Croatie', categorie: 'selection', saison: '1998', type: 'Domicile', raison: 'Le damier de la génération Šuker' },
  { equipe: 'Italie', categorie: 'selection', saison: '1994', type: 'Domicile', raison: 'Le bleu Diadora de Roberto Baggio' },
  { equipe: 'Cameroun', categorie: 'selection', saison: '2002', type: 'Domicile', raison: 'Le fameux maillot sans manches' },
  { equipe: 'Jamaïque', categorie: 'selection', saison: '1998', type: 'Domicile', raison: 'Les Reggae Boyz et leur Kappa inoubliable' },
  { equipe: 'Juventus', categorie: 'club', saison: '1996-97', type: 'Domicile', raison: 'Kappa + Sony : la Juve de Zidane et Del Piero' },
  { equipe: 'ACF Fiorentina', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Le violet Fila de Batistuta' },
  { equipe: 'Ajax Amsterdam', categorie: 'club', saison: '1994-95', type: 'Domicile', raison: 'La bande rouge Umbro des vainqueurs de la C1' },
  { equipe: 'Parme Calcio', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Les hachures jaune et bleu de Buffon et Crespo' },
  { equipe: 'Borussia Dortmund', categorie: 'club', saison: '1996-97', type: 'Domicile', raison: "Le jaune fluo Nike champion d'Europe" },
  { equipe: 'Arsenal', categorie: 'club', saison: '1991-92', type: 'Extérieur', raison: "Le fameux « bruised banana » d'Adidas" },
  { equipe: 'Boca Juniors', categorie: 'club', saison: '1981', type: 'Domicile', raison: 'Le bleu et or du jeune Maradona' },
  { equipe: 'Olympique de Marseille', categorie: 'club', saison: '1992-93', type: 'Domicile', raison: 'À jamais les premiers' },
  { equipe: 'Manchester United', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Le triplé, la finale de Barcelone' },
  { equipe: 'FC Barcelone', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Le centenaire du Barça' },
  { equipe: 'Real Madrid', categorie: 'club', saison: '2001-02', type: 'Domicile', raison: 'La volée de Zidane à Glasgow' },
  { equipe: 'Newcastle United', categorie: 'club', saison: '1995-96', type: 'Domicile', raison: 'Les rayures Adidas de Shearer et Ginola' }
];

/* ---------- Outils ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const euros = n => (n == null || n === '' || isNaN(Number(n))) ? '—' : Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('Mémoire pleine : exporte ta collection dans Réglages.'); } };

const SELECTIONS = SELECTIONS_BRUT.trim().split('\n').map(l => {
  const p = l.split('|').map(s => (s || '').trim());
  return { nom: p[0], categorie: 'selection', pays: p[0], iso: p[1] || '', c1: '', c2: '', motif: 'uni', alias: p[2] ? p[2].split(';').map(s => s.trim()).filter(Boolean) : [] };
});
const CLUBS = CLUBS_BRUT.trim().split('\n').map(l => {
  const p = l.split('|').map(s => (s || '').trim());
  return { nom: p[0], categorie: 'club', pays: p[1] || '', iso: '', c1: p[2] || '', c2: p[3] || '', motif: p[4] || 'uni', alias: p[5] ? p[5].split(';').map(s => s.trim()).filter(Boolean) : [] };
});
const EQUIPES = [...SELECTIONS, ...CLUBS];
const trouverEquipe = nom => {
  const n = norm(nom); if (!n) return null;
  return EQUIPES.find(e => norm(e.nom) === n) || EQUIPES.find(e => e.alias.some(a => norm(a) === n)) || null;
};

/* ---------- Données ---------- */
let collection = load(K.col, []);
let wishlist = load(K.wish, []);
let params = Object.assign({ relais: '', code: '', prenom: '' }, load(K.par, {}));
const PHOTOS = {};
const DB = {
  db: null,
  open() { return new Promise((res, rej) => { if (this.db) return res(this.db); if (!window.indexedDB) return rej(new Error('pas de base')); const r = indexedDB.open('mes-maillots', 1); r.onupgradeneeded = () => { r.result.createObjectStore('photos'); }; r.onsuccess = () => { this.db = r.result; res(this.db); }; r.onerror = () => rej(r.error); }); },
  async put(k, v) { const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction('photos', 'readwrite'); t.objectStore('photos').put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); },
  async del(k) { const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction('photos', 'readwrite'); t.objectStore('photos').delete(k); t.oncomplete = res; t.onerror = () => rej(t.error); }); },
  async toutCharger() { const db = await this.open(); return new Promise(res => { const r = db.transaction('photos').objectStore('photos').openCursor(); r.onsuccess = () => { const c = r.result; if (c) { PHOTOS[c.key] = c.value; c.continue(); } else res(); }; r.onerror = () => res(); }); }
};
async function stockerPhoto(dataUrl) { const id = 'ph_' + uid(); PHOTOS[id] = dataUrl; try { await DB.put(id, dataUrl); } catch (e) { } return id; }
async function supprimerPhoto(id) { delete PHOTOS[id]; try { await DB.del(id); } catch (e) { } }
const photoPrincipale = m => (m && m.photos && m.photos.length) ? (PHOTOS[m.photos[0]] || '') : '';

async function migrer() {
  try { await DB.toutCharger(); } catch (e) { }
  let change = false;
  for (const liste of [collection, wishlist]) {
    for (const m of liste) {
      if (!m.id) { m.id = uid(); change = true; }
      if (m.photo && !m.photos) { m.photos = [m.photo]; delete m.photo; change = true; }
      if (!Array.isArray(m.photos)) { m.photos = []; change = true; }
      for (let i = 0; i < m.photos.length; i++) {
        const p = m.photos[i];
        if (typeof p === 'string' && p.startsWith('data:')) { m.photos[i] = await stockerPhoto(p); change = true; }
      }
      if (!m.equipe) { m.equipe = m.club || m.nom || m.team || ''; change = true; }
      if (!m.categorie) { const eq = trouverEquipe(m.equipe); m.categorie = eq ? eq.categorie : 'club'; change = true; }
      if (!m.date) { m.date = m.date_ajout || new Date().toISOString(); change = true; }
    }
  }
  if (change) { save(K.col, collection); save(K.wish, wishlist); }
}

/* ---------- Quota SerpApi ---------- */
function quota() { const mois = new Date().toISOString().slice(0, 7); let q = load(K.quota, { mois, utilise: 0 }); if (q.mois !== mois) { q = { mois, utilise: 0 }; save(K.quota, q); } return q; }
function compterQuota() { const q = quota(); q.utilise++; save(K.quota, q); }

/* ---------- Relais Cloudflare ---------- */
async function relais(payload) {
  const url = (params.relais || '').trim().replace(/\/+$/, '');
  if (!url) throw new Error('Adresse du relais manquante : va dans Réglages.');
  if (!params.code) throw new Error('Code secret manquant : va dans Réglages.');
  let r;
  try { r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ code: params.code }, payload)) }); }
  catch (e) { throw new Error('Impossible de joindre le relais (pas de réseau ou adresse fausse).'); }
  let d; try { d = await r.json(); } catch (e) { throw new Error('Réponse illisible du relais (' + r.status + ').'); }
  if (!r.ok || d.ok === false || d.erreur || d.error) throw new Error(d.erreur || d.error || d.message || ('Erreur relais ' + r.status));
  if (d.serpapi_utilise || (d.cache === false && payload.action !== 'test' && payload.action !== 'ebay')) compterQuota();
  return d;
}

/* ---------- Visuels : maillots dessinés + drapeaux ---------- */
const PALETTE = [['#c8102e', '#ffffff'], ['#1d4ed8', '#ffffff'], ['#15803d', '#ffffff'], ['#111111', '#ffffff'], ['#f59e0b', '#111111'], ['#7c3aed', '#ffffff'], ['#0ea5e9', '#0f172a'], ['#be123c', '#fde68a'], ['#065f46', '#fbbf24'], ['#1e3a8a', '#f87171'], ['#9a3412', '#ffffff'], ['#374151', '#f59e0b']];
function clair(hex) { const h = String(hex || '#888888').replace('#', ''); if (h.length < 6) return true; const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return (0.299 * r + 0.587 * g + 0.114 * b) > 165; }
function couleursPour(m) {
  const eq = trouverEquipe(m.equipe);
  let c1, c2, motif = 'uni';
  if (eq && eq.c1) { c1 = eq.c1; c2 = eq.c2 || '#ffffff'; motif = eq.motif || 'uni'; }
  else { let h = 0; for (const ch of norm(m.equipe)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; [c1, c2] = PALETTE[h % PALETTE.length]; }
  const t = norm(m.type);
  if (t.startsWith('ext')) { if (norm(c2) === 'ffffff') { c2 = c1; c1 = '#ffffff'; } else { const x = c1; c1 = c2; c2 = x; } motif = 'uni'; }
  else if (t === 'third') { c2 = c1; c1 = '#1f2937'; motif = 'uni'; }
  else if (t === 'gardien') { c2 = '#111827'; c1 = '#a3e635'; motif = 'uni'; }
  return { c1, c2, motif };
}
function initiales(nom) {
  const stop = ['de', 'of', 'du', 'la', 'le', 'les', 'the', 'and', 'et', '1', '04', '05', '96'];
  const mots = norm(nom).split(' ').filter(w => w && !stop.includes(w));
  return (mots.length ? mots : [norm(nom) || '?']).slice(0, 3).map(w => w[0]).join('').toUpperCase() || '?';
}
function svgMaillot(c1, c2, motif, txt) {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  const body = 'M30 12 L42 6 Q50 14 58 6 L70 12 L94 26 L86 42 L73 36 L73 94 L27 94 L27 36 L14 42 L6 26 Z';
  let deco = '';
  if (motif === 'rayures') { for (let x = 27; x < 73; x += 12) deco += `<rect x="${x}" y="0" width="6" height="100" fill="${c2}"/>`; }
  else if (motif === 'cerceaux') { for (let y = 16; y < 94; y += 14) deco += `<rect x="0" y="${y}" width="100" height="7" fill="${c2}"/>`; }
  else if (motif === 'moitie') { deco = `<rect x="0" y="0" width="50" height="100" fill="${c2}"/>`; }
  else if (motif === 'diag') { deco = `<polygon points="18,20 36,10 78,94 58,94" fill="${c2}"/>`; }
  else if (motif === 'manches') { deco = `<rect x="0" y="0" width="27" height="100" fill="${c2}"/><rect x="73" y="0" width="27" height="100" fill="${c2}"/>`; }
  else if (motif === 'bande') { deco = `<rect x="0" y="48" width="100" height="16" fill="${c2}"/>`; }
  else if (motif === 'bandev') { deco = `<rect x="38" y="0" width="24" height="100" fill="${c2}"/>`; }
  const sombre = clair(c1) && !(motif === 'bandev' && !clair(c2));
  const txtCol = sombre ? '#1f2937' : '#ffffff';
  const texte = txt ? `<text x="50" y="68" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="17" fill="${txtCol}" stroke="${sombre ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.45)'}" stroke-width=".8" paint-order="stroke">${esc(txt)}</text>` : '';
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs><path d="${body}" fill="${c1}"/><g clip-path="url(#${id})">${deco}</g><path d="${body}" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="2" stroke-linejoin="round"/><path d="M42 6 Q50 14 58 6 Q50 22 42 6Z" fill="${c2}" stroke="rgba(0,0,0,.25)" stroke-width="1"/>${texte}</svg>`;
}
function svgMini(m) { const c = couleursPour(m); return svgMaillot(c.c1, c.c2, c.motif, initiales(m.equipe)); }
function visuel(m, extra) {
  extra = extra || '';
  const ph = photoPrincipale(m);
  if (ph) return `<div class="vis ${extra}"><img src="${ph}" alt="" loading="lazy"></div>`;
  const eq = trouverEquipe(m.equipe);
  const sel = m.categorie === 'selection' || (eq && eq.categorie === 'selection');
  const c = couleursPour(m);
  const drapeau = (sel && eq && eq.iso) ? `<img class="drapeau" src="https://flagcdn.com/w320/${eq.iso}.png" alt="" loading="lazy" onerror="this.style.display='none'">` : '';
  return `<div class="vis vis-svg ${sel ? 'vis-sel' : ''} ${extra}"><div class="jersey">${svgMaillot(c.c1, c.c2, c.motif, initiales(m.equipe || '?'))}</div>${drapeau}${sel && drapeau ? `<div class="mini-jersey">${svgMaillot(c.c1, c.c2, c.motif, '')}</div>` : ''}</div>`;
}
function compresser(file, max, q) {
  max = max || 1000; q = q || 0.82;
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => { let w = img.width, h = img.height; const r = Math.min(1, max / Math.max(w, h)); w = Math.round(w * r); h = Math.round(h * r); const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); res(c.toDataURL('image/jpeg', q)); }; img.onerror = rej; img.src = fr.result; };
    fr.onerror = rej; fr.readAsDataURL(file);
  });
}

/* ---------- Analyse des résultats Google Lens ---------- */
function analyserLens(matches) {
  const votes = new Map(), saisons = {}, types = {}, marques = {};
  for (const it of matches) {
    const titre = it.title || it.titre || '';
    const t = ' ' + norm(titre + ' ' + (it.source || '')) + ' ';
    for (const eq of EQUIPES) {
      const noms = [eq.nom].concat(eq.alias);
      if (noms.some(n => { const nn = norm(n); return nn.length >= 3 && t.includes(' ' + nn + ' '); })) votes.set(eq.nom, (votes.get(eq.nom) || 0) + 1);
    }
    const s = titre.match(/(19|20)\d{2}\s?[-\/–]\s?\d{2,4}/) || titre.match(/\b(19|20)\d{2}\b/);
    if (s) { const k = s[0].replace(/\s/g, '').replace('–', '-').replace('/', '-'); saisons[k] = (saisons[k] || 0) + 1; }
    if (/\b(away|exterieur|visitante|auswarts|trasferta|uit)\b/.test(t)) types['Extérieur'] = (types['Extérieur'] || 0) + 1;
    else if (/\b(third|3rd|troisieme|tercera)\b/.test(t)) types['Third'] = (types['Third'] || 0) + 1;
    else if (/\b(goalkeeper|gardien|gk|portero|torwart|portiere)\b/.test(t)) types['Gardien'] = (types['Gardien'] || 0) + 1;
    else if (/\b(home|domicile|local|heim|thuis)\b/.test(t)) types['Domicile'] = (types['Domicile'] || 0) + 1;
    for (const mq of MARQUES) if (mq !== 'Autre' && t.includes(' ' + norm(mq) + ' ')) marques[mq] = (marques[mq] || 0) + 1;
  }
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1])[0];
  const pistes = [...votes.entries()].sort((a, b) => b[1] - a[1]).map(([nom, n]) => ({ nom, n, eq: trouverEquipe(nom) }));
  return { pistes, saison: (top(saisons) || [''])[0], type: (top(types) || [''])[0], marque: (top(marques) || [''])[0] };
}

/* ---------- Prix : annonces + anti-arnaque ---------- */
const extrairePrix = s => { const m = String(s || '').replace(/\u00a0/g, ' ').match(/(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:€|eur\b|euros?)/i) || String(s || '').match(/(?:€|eur)\s?(\d{1,4}(?:[.,]\d{1,2})?)/i); return m ? parseFloat(m[1].replace(',', '.')) : null; };
const motsSuspects = s => /\b(replica|r[ée]plique|fake|copie|contrefa|thai|aaa|1:1|inspir)/i.test(s || '');
const devinerSource = l => /vinted/i.test(l) ? 'Vinted' : /leboncoin/i.test(l) ? 'Leboncoin' : /ebay/i.test(l) ? 'eBay' : 'Web';
async function estimerPrix(q) {
  const d = await relais({ action: 'annonces', q });
  const brut = d.annonces || d.resultats || d.organic_results || d.items || [];
  let liste = brut.map(a => {
    const titre = a.titre || a.title || ''; const texte = titre + ' ' + (a.snippet || a.extrait || a.description || '');
    let prix = a.prix != null ? a.prix : (a.price != null ? a.price : null);
    if (prix && typeof prix === 'object') prix = prix.extracted_value || prix.value || null;
    if (typeof prix === 'string') prix = extrairePrix(prix) || parseFloat(prix.replace(',', '.'));
    if (prix == null || isNaN(prix)) prix = extrairePrix(texte);
    const lien = a.lien || a.link || a.url || '';
    return { titre, lien, source: a.source || devinerSource(lien), prix: (prix && prix > 2) ? Number(prix) : null, suspect: motsSuspects(texte) };
  }).filter(a => a.titre);
  try {
    const e = await relais({ action: 'ebay', q });
    const items = e.annonces || e.items || e.itemSummaries || [];
    items.forEach(a => { const p = a.prix != null ? a.prix : (a.price && (a.price.value || a.price)); const titre = a.titre || a.title || ''; if (titre) liste.push({ titre, lien: a.lien || a.itemWebUrl || a.link || '', source: 'eBay', prix: p ? Number(p) : null, suspect: motsSuspects(titre) }); });
  } catch (e) { }
  const valides = liste.filter(a => a.prix && !a.suspect).map(a => a.prix).sort((a, b) => a - b);
  const mediane = valides.length ? valides[Math.floor(valides.length / 2)] : null;
  liste.forEach(a => { if (mediane && a.prix && a.prix < mediane * 0.35) { a.suspect = true; a.pourquoi = 'Prix anormalement bas'; } else if (a.suspect) a.pourquoi = 'Mot suspect (réplique…)'; });
  const fiables = liste.filter(a => a.prix && !a.suspect).map(a => a.prix).sort((a, b) => a - b);
  const estimation = fiables.length ? fiables[Math.floor(fiables.length / 2)] : null;
  return { liste, estimation, min: fiables[0] || null, max: fiables[fiables.length - 1] || null, nb: fiables.length, cache: !!d.cache };
}

/* ---------- Suggestions locales ---------- */
function suggestions() {
  const cle = m => norm(m.equipe) + '|' + norm(m.saison) + '|' + norm(m.type);
  const possede = new Set(collection.map(cle)), souhaite = new Set(wishlist.map(cle));
  const equipesPossedees = new Set(collection.map(m => norm(m.equipe)));
  const out = [];
  const push = s => { const k = cle(s); if (possede.has(k) || souhaite.has(k) || out.some(o => cle(o) === k)) return; out.push(s); };
  for (const m of collection) {
    if (!m.saison) continue;
    for (const t of ['Domicile', 'Extérieur', 'Third']) {
      if (norm(t) === norm(m.type)) continue;
      if (!collection.some(x => norm(x.equipe) === norm(m.equipe) && norm(x.saison) === norm(m.saison) && norm(x.type) === norm(t)))
        push({ equipe: m.equipe, categorie: m.categorie, saison: m.saison, type: t, raison: `Pour compléter ton jeu ${m.equipe} ${m.saison}`, score: 5 });
    }
  }
  for (const m of collection) {
    const eq = trouverEquipe(m.equipe);
    if (eq && eq.categorie === 'club' && eq.pays) { const sel = SELECTIONS.find(s => s.nom === eq.pays); if (sel && !equipesPossedees.has(norm(sel.nom))) push({ equipe: sel.nom, categorie: 'selection', saison: '', type: 'Domicile', raison: `Tu aimes ${eq.nom} : et la sélection ${sel.nom} ?`, score: 3 }); }
  }
  const pays = {};
  for (const m of collection) { const eq = trouverEquipe(m.equipe); if (eq && eq.categorie === 'club') pays[eq.pays] = (pays[eq.pays] || 0) + 1; }
  for (const [p] of Object.entries(pays).sort((a, b) => b[1] - a[1]).slice(0, 3))
    CLUBS.filter(c => c.pays === p && !equipesPossedees.has(norm(c.nom))).slice(0, 2).forEach(c => push({ equipe: c.nom, categorie: 'club', saison: '', type: 'Domicile', raison: `Un autre grand club de ${p}`, score: 2 }));
  CLASSIQUES.forEach(c => push(Object.assign({ score: 1 }, c)));
  return out.sort((a, b) => b.score - a.score);
}

/* ---------- État de navigation ---------- */
const etat = { vue: 'accueil', id: null, filtre: 'tous', recherche: '', tri: 'recent', mode: 'grille', brouillon: null, editId: null, wishId: null, lens: null, lensChargement: false, prix: null, wbrouillon: null, weditId: null, photoCible: null, test: null };
let toastTimer = null;
function toast(msg) { const t = document.getElementById('mm-toast'); if (!t) return alert(msg); t.textContent = msg; t.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 3200); }
function aller(vue, id) { etat.vue = vue; etat.id = id == null ? null : id; window.scrollTo(0, 0); render(); }
const trouverM = id => collection.find(m => m.id === id);
const trouverW = id => wishlist.find(w => w.id === id);
const libelleType = t => ({ 'Domicile': 'Domicile', 'Extérieur': 'Extérieur', 'Third': 'Third', 'Gardien': 'Gardien' }[t] || (t || ''));
const prioIcone = p => p === 'Rêve absolu' ? '💎' : p === 'Haute' ? '🔥' : '⭐';

/* ---------- Composants ---------- */
function carteMaillot(m, petite) {
  return `<article class="carte ${petite ? 'petite' : ''}" data-act="aller" data-vue="fiche" data-id="${m.id}">
    ${visuel(m)}
    <button class="coeur ${m.favori ? 'on' : ''}" data-act="fav" data-id="${m.id}" title="Favori">${m.favori ? '❤️' : '🤍'}</button>
    ${m.type ? `<span class="badge">${esc(libelleType(m.type))}</span>` : ''}
    ${etat.mode === 'mosaique' && !petite ? '' : `<div class="carte-txt"><div class="carte-titre">${esc(m.equipe)}</div><div class="carte-sous">${esc(m.saison || '')}${m.saison && m.marque ? ' · ' : ''}${esc(m.marque || '')}</div>${m.valeur ? `<div class="carte-prix">${euros(m.valeur)}</div>` : ''}</div>`}
  </article>`;
}
function carteWish(w) {
  return `<article class="carte" data-act="aller" data-vue="wishfiche" data-id="${w.id}">
    ${visuel(w)}
    <span class="badge or">${prioIcone(w.priorite)} ${esc(w.priorite || 'Normale')}</span>
    <div class="carte-txt"><div class="carte-titre">${esc(w.equipe)}</div><div class="carte-sous">${esc(w.saison || '')}${w.saison && w.type ? ' · ' : ''}${esc(w.type || '')}</div>${w.budget ? `<div class="carte-prix">Budget ${euros(w.budget)}</div>` : ''}</div>
  </article>`;
}
function carteSuggestion(s) {
  const d = `data-equipe="${esc(s.equipe)}" data-categorie="${esc(s.categorie)}" data-saison="${esc(s.saison || '')}" data-type="${esc(s.type || '')}"`;
  return `<article class="carte sugg">${visuel(s)}<div class="carte-txt"><div class="carte-titre">${esc(s.equipe)}</div><div class="carte-sous">${esc(s.saison || '')}${s.saison ? ' · ' : ''}${esc(s.type || '')}</div><div class="raison">${esc(s.raison)}</div><div class="actions-mini"><button class="btn petit or" data-act="w-ajouter" ${d}>⭐ Wishlist</button><button class="btn petit sec" data-act="form-prerempli" ${d}>＋ Je l'ai</button></div></div></article>`;
}
function rangee(titre, html, lien) { return `<section class="bloc"><div class="bloc-tete"><h2>${titre}</h2>${lien || ''}</div><div class="rangee">${html}</div></section>`; }
function vide(txt, bouton) { const c = PALETTE[3]; return `<div class="vide"><div class="vide-ill">${svgMaillot('#e9e4d8', '#c9962f', 'bandev', '?')}</div><p>${txt}</p>${bouton || ''}</div>`; }
function selectHTML(id, options, val, vide0) { return `<select id="${id}">${vide0 ? `<option value="">${vide0}</option>` : ''}${options.map(o => `<option value="${esc(o)}" ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`; }
const datalistEquipes = () => `<datalist id="liste-equipes">${EQUIPES.map(e => `<option value="${esc(e.nom)}">`).join('')}</datalist><datalist id="liste-marques">${MARQUES.map(e => `<option value="${esc(e)}">`).join('')}</datalist>`;

/* ---------- Vues ---------- */
function vAccueil() {
  const h = new Date().getHours(); const salut = (h >= 5 && h < 18) ? 'Bonjour' : 'Bonsoir';
  const valeur = collection.reduce((s, m) => s + (Number(m.valeur) || 0), 0);
  const favs = collection.filter(m => m.favori);
  const recents = [...collection].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 10);
  const equipes = [...new Map(collection.map(m => [norm(m.equipe), m])).values()].slice(0, 14);
  const sugg = suggestions().slice(0, 6);
  const fantomes = ['Juventus', 'Paris Saint-Germain', 'FC Barcelone', 'Celtic Glasgow', 'AS Monaco', 'Boca Juniors', 'Arsenal', 'Ajax Amsterdam'].map(n => `<div class="cintre fantome">${svgMini({ equipe: n })}</div>`).join('');
  return `<section class="hero">
    <div class="hero-top"><div><div class="salut">${salut}${params.prenom ? ' ' + esc(params.prenom) : ''} 👋</div><div class="sous">${collection.length ? `${collection.length} maillot${collection.length > 1 ? 's' : ''} dans ton vestiaire` : 'Ton vestiaire attend son premier maillot'}</div></div><button class="rond" data-act="aller" data-vue="parametres" title="Réglages">⚙</button></div>
    <div class="vestiaire">${equipes.length ? equipes.map(m => `<button class="cintre" data-act="aller" data-vue="collection" data-recherche="${esc(m.equipe)}" data-filtre="tous" title="${esc(m.equipe)}">${svgMini({ equipe: m.equipe })}</button>`).join('') : fantomes}</div>
    <div class="tuiles">
      <button class="tuile" data-act="aller" data-vue="collection" data-reset="1"><span class="tuile-ico">👕</span><b>${collection.length}</b><span>maillots</span></button>
      <button class="tuile" data-act="aller" data-vue="collection" data-reset="1" data-tri="valeur"><span class="tuile-ico">💶</span><b>${euros(valeur)}</b><span>valeur estimée</span></button>
      <button class="tuile" data-act="aller" data-vue="collection" data-reset="1" data-filtre="favoris"><span class="tuile-ico">❤️</span><b>${favs.length}</b><span>favoris</span></button>
      <button class="tuile" data-act="aller" data-vue="wishlist"><span class="tuile-ico">⭐</span><b>${wishlist.length}</b><span>wishlist</span></button>
    </div>
  </section>
  ${collection.length === 0 ? `<section class="bloc">${vide('Commence par ajouter ton premier maillot : prends-le en photo et laisse Google Lens l\'identifier.', '<button class="btn" data-act="aller" data-vue="formulaire">＋ Ajouter un maillot</button>')}</section>` : ''}
  ${sugg.length ? rangee('✨ Suggestions pour toi', sugg.map(carteSuggestion).join(''), `<button class="lien" data-act="aller" data-vue="idees">Tout voir ›</button>`) : ''}
  ${recents.length ? rangee('🕒 Ajoutés récemment', recents.map(m => carteMaillot(m, true)).join(''), `<button class="lien" data-act="aller" data-vue="collection" data-reset="1">Tout voir ›</button>`) : ''}
  ${favs.length ? rangee('❤️ Tes favoris', favs.slice(0, 10).map(m => carteMaillot(m, true)).join(''), `<button class="lien" data-act="aller" data-vue="collection" data-reset="1" data-filtre="favoris">Tout voir ›</button>`) : ''}
  ${wishlist.length ? rangee('⭐ Ta wishlist', [...wishlist].sort((a, b) => PRIORITES.indexOf(b.priorite) - PRIORITES.indexOf(a.priorite)).slice(0, 10).map(carteWish).join(''), `<button class="lien" data-act="aller" data-vue="wishlist">Tout voir ›</button>`) : ''}
  ${equipes.length > 1 ? `<section class="bloc"><div class="bloc-tete"><h2>🏷️ Par équipe</h2></div><div class="chips pad">${equipes.map(m => `<button class="chip" data-act="aller" data-vue="collection" data-recherche="${esc(m.equipe)}" data-filtre="tous">${esc(m.equipe)} <small>${collection.filter(x => norm(x.equipe) === norm(m.equipe)).length}</small></button>`).join('')}</div></section>` : ''}`;
}
function filtrer() {
  let l = collection.slice();
  const f = etat.filtre, r = norm(etat.recherche);
  if (f === 'favoris') l = l.filter(m => m.favori);
  else if (f === 'club' || f === 'selection') l = l.filter(m => m.categorie === f);
  else if (TYPES.includes(f)) l = l.filter(m => m.type === f);
  if (r) l = l.filter(m => norm([m.equipe, m.saison, m.marque, m.notes, m.type, m.pays].join(' ')).includes(r));
  const tri = etat.tri;
  if (tri === 'az') l.sort((a, b) => a.equipe.localeCompare(b.equipe, 'fr'));
  else if (tri === 'saison') l.sort((a, b) => String(b.saison || '').localeCompare(String(a.saison || '')));
  else if (tri === 'valeur') l.sort((a, b) => (Number(b.valeur) || 0) - (Number(a.valeur) || 0));
  else l.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return l;
}
function grilleHTML() {
  const l = filtrer();
  if (!l.length) return vide(collection.length ? 'Aucun maillot ne correspond à ce filtre.' : 'Ta collection est vide pour le moment.', collection.length ? '' : '<button class="btn" data-act="aller" data-vue="formulaire">＋ Ajouter un maillot</button>');
  return `<div class="grille ${etat.mode === 'mosaique' ? 'mosaique' : ''}">${l.map(m => carteMaillot(m)).join('')}</div>`;
}
function vCollection() {
  const valeur = collection.reduce((s, m) => s + (Number(m.valeur) || 0), 0);
  const chips = [['tous', 'Tous'], ['favoris', '❤️ Favoris'], ['club', 'Clubs'], ['selection', 'Sélections'], ['Domicile', 'Domicile'], ['Extérieur', 'Extérieur'], ['Third', 'Third'], ['Gardien', 'Gardien']];
  return `<header class="entete"><h1>Ma collection</h1><div class="sous-titre">${collection.length} maillot${collection.length > 1 ? 's' : ''} · ${euros(valeur)}</div></header>
  <div class="barre pad"><input id="c-recherche" type="search" placeholder="Rechercher une équipe, une saison, une marque…" value="${esc(etat.recherche)}">
  <select id="c-tri"><option value="recent" ${etat.tri === 'recent' ? 'selected' : ''}>Récents</option><option value="az" ${etat.tri === 'az' ? 'selected' : ''}>A → Z</option><option value="saison" ${etat.tri === 'saison' ? 'selected' : ''}>Saison</option><option value="valeur" ${etat.tri === 'valeur' ? 'selected' : ''}>Valeur</option></select>
  <button class="icone" data-act="mode" title="Affichage">${etat.mode === 'mosaique' ? '☰' : '▦'}</button></div>
  <div class="chips pad">${chips.map(([v, t]) => `<button class="chip ${etat.filtre === v ? 'on' : ''}" data-act="filtre" data-filtre="${v}">${t}</button>`).join('')}</div>
  <div id="grille" class="pad">${grilleHTML()}</div>`;
}
function vFiche() {
  const m = trouverM(etat.id); if (!m) return vide('Maillot introuvable.');
  const photos = (m.photos || []).map(id => PHOTOS[id]).filter(Boolean);
  const memeClub = collection.filter(x => x.id !== m.id && norm(x.equipe) === norm(m.equipe));
  const manquants = m.saison ? ['Domicile', 'Extérieur', 'Third'].filter(t => t !== m.type && !collection.some(x => norm(x.equipe) === norm(m.equipe) && norm(x.saison) === norm(m.saison) && x.type === t) && !wishlist.some(w => norm(w.equipe) === norm(m.equipe) && norm(w.saison) === norm(m.saison) && w.type === t)) : [];
  const p = etat.prix && etat.prix.pour === m.id ? etat.prix : null;
  const infos = [['Saison', m.saison], ['Type', m.type], ['Marque', m.marque], ['Taille', m.taille], ['État', m.etat], ['Pays', m.pays], ["Prix d'achat", m.prix ? euros(m.prix) : ''], ['Valeur estimée', m.valeur ? euros(m.valeur) : ''], ['Ajouté le', m.date ? new Date(m.date).toLocaleDateString('fr-FR') : '']].filter(x => x[1]);
  return `<div class="fiche-tete"><button class="retour" data-act="retour">‹ Retour</button><button class="coeur grand ${m.favori ? 'on' : ''}" data-act="fav" data-id="${m.id}">${m.favori ? '❤️' : '🤍'}</button></div>
  <div class="carrousel">${photos.length ? photos.map((ph, i) => `<div class="diapo"><img src="${ph}" alt=""><button class="supp-photo" data-act="photo-del" data-id="${m.id}" data-idx="${i}" title="Supprimer cette photo">🗑</button></div>`).join('') : `<div class="diapo">${visuel(m)}</div>`}</div>
  ${photos.length > 1 ? `<div class="points">${photos.map((_, i) => `<span></span>`).join('')}</div>` : ''}
  <div class="pad">
    ${photos.length < 4 ? `<button class="btn sec petit" data-act="photo-add" data-cible="fiche:${m.id}">📷 ${photos.length ? 'Ajouter une photo (dos, étiquette…)' : 'Ajouter une photo'}</button>` : ''}
    <h1 class="titre-fiche">${esc(m.equipe)}</h1>
    <div class="sous-titre">${esc([m.saison, m.type, m.marque].filter(Boolean).join(' · '))}</div>
    <dl class="infos">${infos.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    ${m.notes ? `<p class="notes">${esc(m.notes)}</p>` : ''}
    <div class="actions"><button class="btn" data-act="prix" data-id="${m.id}">💶 Estimer le prix</button><button class="btn sec" data-act="editer" data-id="${m.id}">✏️ Modifier</button></div>
    ${p ? panneauPrix(p, m) : ''}
    ${manquants.length ? `<section class="bloc-in"><h2>🧩 Compléter ce jeu ${esc(m.saison)}</h2><div class="chips">${manquants.map(t => `<button class="chip" data-act="w-ajouter" data-equipe="${esc(m.equipe)}" data-categorie="${esc(m.categorie)}" data-saison="${esc(m.saison)}" data-type="${t}">⭐ ${t}</button>`).join('')}</div></section>` : ''}
    ${memeClub.length ? `<section class="bloc-in"><h2>👕 Du même club</h2><div class="rangee sans-pad">${memeClub.map(x => carteMaillot(x, true)).join('')}</div></section>` : ''}
    <button class="btn danger large" data-act="supprimer" data-id="${m.id}">🗑 Supprimer ce maillot</button>
  </div>`;
}
function panneauPrix(p, cible) {
  if (p.chargement) return `<div class="panneau"><div class="spin"></div> Recherche des annonces en cours…</div>`;
  if (p.erreur) return `<div class="panneau erreur">⚠️ ${esc(p.erreur)}</div>`;
  const r = p.resultat;
  const budget = cible && cible.budget ? Number(cible.budget) : null;
  return `<div class="panneau">
    <div class="estim">${r.estimation ? `<b>${euros(r.estimation)}</b><span>estimation (médiane de ${r.nb} annonce${r.nb > 1 ? 's' : ''}${r.min && r.max ? `, de ${euros(r.min)} à ${euros(r.max)}` : ''})</span>` : '<span>Pas assez d\'annonces avec un prix pour estimer.</span>'}${r.cache ? '<small>résultat en cache (0 recherche utilisée)</small>' : ''}</div>
    ${r.estimation && cible && !cible.budget ? `<button class="btn petit" data-act="valeur-set" data-id="${cible.id}" data-valeur="${r.estimation}">Utiliser comme valeur estimée</button>` : ''}
    <ul class="annonces">${r.liste.slice(0, 15).map(a => `<li class="${a.suspect ? 'suspect' : ''}">${a.lien ? `<a href="${esc(a.lien)}" target="_blank" rel="noopener">` : '<span>'}<span class="src">${esc(a.source)}</span> ${esc(a.titre)}${a.lien ? '</a>' : '</span>'}<b>${a.prix ? euros(a.prix) : '—'}${budget && a.prix && a.prix <= budget ? ' 🎯' : ''}</b>${a.suspect ? `<em>⚠️ ${esc(a.pourquoi || 'Suspect')}</em>` : ''}</li>`).join('') || '<li>Aucune annonce trouvée.</li>'}</ul>
  </div>`;
}
function vFormulaire() {
  const b = etat.brouillon || {};
  const photos = (b.photos || []).map(id => PHOTOS[id]).filter(Boolean);
  const L = etat.lens;
  return `<div class="fiche-tete"><button class="retour" data-act="retour">‹ Annuler</button></div>
  <div class="pad"><h1>${etat.editId ? 'Modifier le maillot' : 'Nouveau maillot'}</h1>
  <div class="photos-form">${photos.map((ph, i) => `<div class="mini-photo"><img src="${ph}" alt=""><button data-act="brouillon-photo-del" data-idx="${i}">✕</button></div>`).join('')}${photos.length < 4 ? `<button class="ajout-photo" data-act="photo-add" data-cible="form">📷<span>${photos.length ? 'Autre photo' : 'Prendre une photo'}</span></button>` : ''}</div>
  ${photos.length ? `<button class="btn or large" data-act="lens" ${etat.lensChargement ? 'disabled' : ''}>${etat.lensChargement ? '<div class="spin"></div> Analyse Google Lens…' : '🔍 Identifier avec Google Lens'}</button>` : '<p class="aide">Ajoute une photo pour pouvoir identifier le maillot automatiquement.</p>'}
  ${L ? panneauLens(L) : ''}
  <label>Équipe<input id="f-equipe" list="liste-equipes" value="${esc(b.equipe || '')}" placeholder="Ex. : Norvège, Juventus…" autocomplete="off"></label>
  <div class="deux"><label>Catégorie${selectHTML('f-categorie', ['club', 'selection'].map(x => x), b.categorie || 'club')}</label><label>Pays<input id="f-pays" value="${esc(b.pays || '')}" placeholder="auto"></label></div>
  <div class="deux"><label>Saison<input id="f-saison" value="${esc(b.saison || '')}" placeholder="Ex. : 1998 ou 2023-24"></label><label>Type${selectHTML('f-type', TYPES, b.type || 'Domicile')}</label></div>
  <div class="deux"><label>Marque<input id="f-marque" list="liste-marques" value="${esc(b.marque || '')}"></label><label>Taille${selectHTML('f-taille', TAILLES, b.taille || '', '—')}</label></div>
  <div class="deux"><label>État${selectHTML('f-etat', ETATS, b.etat || '', '—')}</label><label>Prix d'achat (€)<input id="f-prix" type="number" inputmode="decimal" value="${esc(b.prix || '')}"></label></div>
  <label>Valeur estimée (€)<input id="f-valeur" type="number" inputmode="decimal" value="${esc(b.valeur || '')}"></label>
  <label>Notes<textarea id="f-notes" rows="3" placeholder="Flocage, histoire, défauts…">${esc(b.notes || '')}</textarea></label>
  <label class="case"><input type="checkbox" id="f-favori" ${b.favori ? 'checked' : ''}> ❤️ Mettre en favori</label>
  <button class="btn large" data-act="enregistrer">💾 Enregistrer</button>
  ${datalistEquipes()}</div>`;
}
function panneauLens(L) {
  if (L.erreur) return `<div class="panneau erreur">⚠️ ${esc(L.erreur)}</div>`;
  const top = L.pistes[0];
  return `<div class="panneau">
    ${top ? `<div class="estim"><b>${esc(top.nom)}</b><span>${top.n} indice${top.n > 1 ? 's' : ''}${top.n < 3 ? ' · indice faible, vérifie' : ''}${L.saison ? ' · saison ' + esc(L.saison) : ''}${L.type ? ' · ' + esc(L.type) : ''}${L.marque ? ' · ' + esc(L.marque) : ''}</span></div>` : '<div class="estim"><span>Aucune équipe reconnue dans les résultats. Essaie une photo plus nette, de face, avec l\'écusson visible.</span></div>'}
    ${L.pistes.length > 1 ? `<div class="aide">Autres pistes :</div><div class="chips">${L.pistes.slice(1, 7).map(p => `<button class="chip" data-act="choisir-piste" data-nom="${esc(p.nom)}">${esc(p.nom)} <small>${p.n}</small></button>`).join('')}</div>` : ''}
    ${L.images && L.images.length ? `<div class="aide">Images similaires trouvées sur le web :</div><div class="rangee sans-pad imgs">${L.images.slice(0, 12).map(i => `<a class="img-web" href="${esc(i.lien || '#')}" target="_blank" rel="noopener"><img src="${esc(i.src)}" alt="" loading="lazy" onerror="this.parentNode.style.display='none'"><span>${esc(i.titre || '')}</span></a>`).join('')}</div>` : ''}
    ${L.cache ? '<small>résultat en cache (0 recherche utilisée)</small>' : ''}
  </div>`;
}
function vWishlist() {
  const l = [...wishlist].sort((a, b) => PRIORITES.indexOf(b.priorite) - PRIORITES.indexOf(a.priorite) || String(b.date || '').localeCompare(String(a.date || '')));
  return `<header class="entete"><h1>Wishlist</h1><div class="sous-titre">${wishlist.length} souhait${wishlist.length > 1 ? 's' : ''}</div></header>
  <div class="pad"><button class="btn or large" data-act="wform">⭐ Ajouter un souhait</button></div>
  <div class="pad">${l.length ? `<div class="grille">${l.map(carteWish).join('')}</div>` : vide('Note ici les maillots que tu rêves d\'avoir : l\'appli te donnera les liens Vinted, Leboncoin et eBay, et les prix du moment.')}</div>
  <section class="bloc"><div class="bloc-tete"><h2>💡 Idées</h2><button class="lien" data-act="aller" data-vue="idees">Tout voir ›</button></div><div class="rangee">${suggestions().slice(0, 6).map(carteSuggestion).join('')}</div></section>`;
}
function vWishFiche() {
  const w = trouverW(etat.id); if (!w) return vide('Souhait introuvable.');
  const q = encodeURIComponent(['maillot', w.equipe, w.saison, w.type && w.type !== 'Domicile' ? w.type : ''].filter(Boolean).join(' '));
  const p = etat.prix && etat.prix.pour === w.id ? etat.prix : null;
  const photos = (w.photos || []).map(id => PHOTOS[id]).filter(Boolean);
  return `<div class="fiche-tete"><button class="retour" data-act="retour">‹ Retour</button></div>
  <div class="carrousel">${photos.length ? photos.map(ph => `<div class="diapo"><img src="${ph}" alt=""></div>`).join('') : `<div class="diapo">${visuel(w)}</div>`}</div>
  <div class="pad">
    <h1 class="titre-fiche">${prioIcone(w.priorite)} ${esc(w.equipe)}</h1>
    <div class="sous-titre">${esc([w.saison, w.type].filter(Boolean).join(' · '))}${w.budget ? ` · budget ${euros(w.budget)}` : ''}</div>
    ${w.notes ? `<p class="notes">${esc(w.notes)}</p>` : ''}
    <div class="liens"><a class="btn sec" href="https://www.vinted.fr/catalog?search_text=${q}" target="_blank" rel="noopener">Vinted</a><a class="btn sec" href="https://www.leboncoin.fr/recherche?text=${q}" target="_blank" rel="noopener">Leboncoin</a><a class="btn sec" href="https://www.ebay.fr/sch/i.html?_nkw=${q}" target="_blank" rel="noopener">eBay</a></div>
    <div class="actions"><button class="btn" data-act="prix" data-id="${w.id}" data-wish="1">💶 Prix du moment</button><button class="btn or" data-act="w-trouve" data-id="${w.id}">🎉 Je l'ai trouvé !</button></div>
    ${p ? panneauPrix(p, w) : ''}
    <div class="actions"><button class="btn sec" data-act="wform" data-id="${w.id}">✏️ Modifier</button><button class="btn danger" data-act="w-supprimer" data-id="${w.id}">🗑 Retirer</button></div>
  </div>`;
}
function vWishForm() {
  const b = etat.wbrouillon || {};
  const photos = (b.photos || []).map(id => PHOTOS[id]).filter(Boolean);
  return `<div class="fiche-tete"><button class="retour" data-act="retour">‹ Annuler</button></div>
  <div class="pad"><h1>${etat.weditId ? 'Modifier le souhait' : 'Nouveau souhait'}</h1>
  <div class="photos-form">${photos.map((ph, i) => `<div class="mini-photo"><img src="${ph}" alt=""><button data-act="wbrouillon-photo-del" data-idx="${i}">✕</button></div>`).join('')}${photos.length < 2 ? `<button class="ajout-photo" data-act="photo-add" data-cible="wform">🖼️<span>Image (facultatif)</span></button>` : ''}</div>
  <label>Équipe<input id="w-equipe" list="liste-equipes" value="${esc(b.equipe || '')}" placeholder="Ex. : Pays-Bas, Fiorentina…" autocomplete="off"></label>
  <div class="deux"><label>Saison<input id="w-saison" value="${esc(b.saison || '')}" placeholder="Ex. : 1988"></label><label>Type${selectHTML('w-type', TYPES, b.type || 'Domicile')}</label></div>
  <div class="deux"><label>Budget max (€)<input id="w-budget" type="number" inputmode="decimal" value="${esc(b.budget || '')}"></label><label>Priorité${selectHTML('w-priorite', PRIORITES, b.priorite || 'Normale')}</label></div>
  <label>Notes<textarea id="w-notes" rows="3" placeholder="Taille recherchée, flocage souhaité…">${esc(b.notes || '')}</textarea></label>
  <button class="btn or large" data-act="w-enregistrer">💾 Enregistrer</button>
  ${datalistEquipes()}</div>`;
}
function vIdees() {
  const l = suggestions();
  return `<div class="fiche-tete"><button class="retour" data-act="retour">‹ Retour</button></div><div class="pad"><h1>✨ Suggestions pour toi</h1><p class="aide">Calculées à partir de ta collection : jeux à compléter, sélections de tes clubs, voisins de championnat et grands classiques. Aucune donnée n'est envoyée nulle part.</p><div class="grille">${l.map(carteSuggestion).join('')}</div></div>`;
}
function vParametres() {
  const q = quota(); const t = etat.test;
  return `<header class="entete"><h1>Réglages</h1></header><div class="pad">
  <label>Ton prénom (pour l'accueil)<input id="p-prenom" value="${esc(params.prenom || '')}"></label>
  <label>Adresse du relais Cloudflare<input id="p-relais" value="${esc(params.relais || '')}" placeholder="https://maillots-relais.xxx.workers.dev"></label>
  <label>Code secret<input id="p-code" type="password" value="${esc(params.code || '')}"></label>
  <div class="actions"><button class="btn" data-act="p-enregistrer">💾 Enregistrer</button><button class="btn sec" data-act="tester">🔌 Tester la connexion</button></div>
  ${t ? `<div class="panneau ${t.erreur ? 'erreur' : ''}">${t.erreur ? '⚠️ ' + esc(t.erreur) : `✅ Relais v${esc(t.version || '?')} joignable · SerpApi : ${t.serpapi ? '✅' : '❌'} · Lens : ${t.lens ? '✅' : '❌'} · eBay : ${t.ebay ? '✅' : '➖ facultatif'}${t.details ? '<br><small>' + esc(typeof t.details === 'string' ? t.details : JSON.stringify(t.details)) + '</small>' : ''}`}</div>` : ''}
  <section class="bloc-in"><h2>📊 Recherches SerpApi ce mois-ci</h2><div class="jauge"><div style="width:${Math.min(100, q.utilise / QUOTA_MAX * 100)}%"></div></div><div class="aide">${q.utilise} / ${QUOTA_MAX} utilisées (compteur local, approximatif). <button class="lien" data-act="quota-reset">Remettre à zéro</button></div></section>
  <section class="bloc-in"><h2>💾 Sauvegarde</h2><p class="aide">Ta collection est stockée uniquement sur cet appareil. Exporte-la régulièrement (le fichier contient aussi les photos et la wishlist).</p><div class="actions"><button class="btn sec" data-act="export">⬇️ Exporter (JSON)</button><button class="btn sec" data-act="import">⬆️ Importer</button></div></section>
  <section class="bloc-in"><h2>⚠️ Zone dangereuse</h2><button class="btn danger" data-act="effacer">Tout effacer</button></section>
  <p class="version">Mes Maillots · v${VERSION} · sans IA · ${EQUIPES.length} équipes connues</p></div>`;
}

/* ---------- Rendu ---------- */
function render() {
  const main = document.getElementById('mm-main'); const nav = document.getElementById('mm-nav'); if (!main) return;
  const vues = { accueil: vAccueil, collection: vCollection, fiche: vFiche, formulaire: vFormulaire, wishlist: vWishlist, wishfiche: vWishFiche, wishform: vWishForm, idees: vIdees, parametres: vParametres };
  main.innerHTML = (vues[etat.vue] || vAccueil)();
  const actif = { fiche: 'collection', wishfiche: 'wishlist', wishform: 'wishlist', idees: 'accueil', formulaire: 'formulaire' }[etat.vue] || etat.vue;
  nav.innerHTML = [['accueil', '⌂', 'Accueil'], ['collection', '👕', 'Collection'], ['formulaire', '＋', 'Ajouter'], ['wishlist', '☆', 'Wishlist'], ['parametres', '⚙', 'Réglages']].map(([v, i, t]) => `<button class="${actif === v ? 'actif' : ''}" data-act="nav" data-vue="${v}"><span class="ico">${i}</span>${t}</button>`).join('');
}
function lireBrouillon() {
  const g = id => { const el = document.getElementById(id); return el ? (el.type === 'checkbox' ? el.checked : el.value.trim()) : undefined; };
  if (document.getElementById('f-equipe')) {
    const b = etat.brouillon || {};
    Object.assign(b, { equipe: g('f-equipe'), categorie: g('f-categorie'), pays: g('f-pays'), saison: g('f-saison'), type: g('f-type'), marque: g('f-marque'), taille: g('f-taille'), etat: g('f-etat'), prix: g('f-prix'), valeur: g('f-valeur'), notes: g('f-notes'), favori: g('f-favori') });
    etat.brouillon = b;
  }
  if (document.getElementById('w-equipe')) {
    const b = etat.wbrouillon || {};
    Object.assign(b, { equipe: g('w-equipe'), saison: g('w-saison'), type: g('w-type'), budget: g('w-budget'), priorite: g('w-priorite'), notes: g('w-notes') });
    etat.wbrouillon = b;
  }
}
function ouvrirFormulaire(id, prefill, wishId) {
  etat.editId = id || null; etat.wishId = wishId || null; etat.lens = null; etat.lensChargement = false;
  const src = id ? trouverM(id) : null;
  etat.brouillon = src ? JSON.parse(JSON.stringify(src)) : Object.assign({ photos: [], type: 'Domicile', categorie: 'club' }, prefill || {});
  if (!etat.brouillon.photos) etat.brouillon.photos = [];
  aller('formulaire');
}
function ouvrirWishForm(id, prefill) {
  etat.weditId = id || null;
  const src = id ? trouverW(id) : null;
  etat.wbrouillon = src ? JSON.parse(JSON.stringify(src)) : Object.assign({ photos: [], type: 'Domicile', priorite: 'Normale' }, prefill || {});
  if (!etat.wbrouillon.photos) etat.wbrouillon.photos = [];
  aller('wishform');
}
function retour() {
  const v = etat.vue;
  if (v === 'fiche' || v === 'idees') return aller(v === 'fiche' ? 'collection' : 'accueil');
  if (v === 'formulaire') return etat.editId ? aller('fiche', etat.editId) : aller(etat.wishId ? 'wishlist' : 'collection');
  if (v === 'wishfiche' || v === 'wishform') return (v === 'wishform' && etat.weditId) ? aller('wishfiche', etat.weditId) : aller('wishlist');
  aller('accueil');
}
function ajouterWish(d) {
  const w = { id: uid(), equipe: d.equipe, categorie: d.categorie || (trouverEquipe(d.equipe) || {}).categorie || 'club', saison: d.saison || '', type: d.type || 'Domicile', budget: '', priorite: 'Normale', notes: '', photos: [], date: new Date().toISOString() };
  if (wishlist.some(x => norm(x.equipe) === norm(w.equipe) && norm(x.saison) === norm(w.saison) && x.type === w.type)) return toast('Déjà dans ta wishlist.');
  wishlist.push(w); save(K.wish, wishlist); toast(`⭐ ${w.equipe} ajouté à la wishlist`); render();
}

/* ---------- Actions ---------- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, id = el.dataset.id; const d = el.dataset;
  if (a === 'fav') e.stopPropagation();
  switch (a) {
    case 'nav': {
      if (d.vue === 'formulaire') return ouvrirFormulaire(null);
      if (d.vue === 'collection') { etat.filtre = 'tous'; etat.recherche = ''; }
      return aller(d.vue);
    }
    case 'aller': {
      if (d.reset) { etat.filtre = 'tous'; etat.recherche = ''; etat.tri = 'recent'; }
      if (d.filtre) etat.filtre = d.filtre; if (d.recherche != null) etat.recherche = d.recherche; if (d.tri) etat.tri = d.tri;
      if (d.vue === 'formulaire') return ouvrirFormulaire(null);
      return aller(d.vue, id);
    }
    case 'retour': return retour();
    case 'fav': { const m = trouverM(id); if (m) { m.favori = !m.favori; save(K.col, collection); render(); } return; }
    case 'filtre': { etat.filtre = d.filtre; render(); return; }
    case 'mode': { etat.mode = etat.mode === 'mosaique' ? 'grille' : 'mosaique'; render(); return; }
    case 'editer': return ouvrirFormulaire(id);
    case 'form-prerempli': return ouvrirFormulaire(null, { equipe: d.equipe, categorie: d.categorie, saison: d.saison, type: d.type });
    case 'photo-add': { lireBrouillon(); etat.photoCible = d.cible; document.getElementById('mm-file').click(); return; }
    case 'photo-del': {
      e.stopPropagation(); const m = trouverM(id); if (!m || !confirm('Supprimer cette photo ?')) return;
      const pid = m.photos.splice(Number(d.idx), 1)[0]; await supprimerPhoto(pid); save(K.col, collection); render(); return;
    }
    case 'brouillon-photo-del': { lireBrouillon(); const pid = etat.brouillon.photos.splice(Number(d.idx), 1)[0]; if (!etat.editId || !(trouverM(etat.editId) || { photos: [] }).photos.includes(pid)) await supprimerPhoto(pid); render(); return; }
    case 'wbrouillon-photo-del': { lireBrouillon(); const pid = etat.wbrouillon.photos.splice(Number(d.idx), 1)[0]; await supprimerPhoto(pid); render(); return; }
    case 'lens': return identifier();
    case 'choisir-piste': { lireBrouillon(); appliquerEquipe(d.nom); render(); return; }
    case 'enregistrer': return enregistrer();
    case 'supprimer': {
      const m = trouverM(id); if (!m || !confirm(`Supprimer « ${m.equipe} » de ta collection ?`)) return;
      for (const pid of m.photos || []) await supprimerPhoto(pid);
      collection = collection.filter(x => x.id !== id); save(K.col, collection); toast('Maillot supprimé'); aller('collection'); return;
    }
    case 'prix': {
      const cible = d.wish ? trouverW(id) : trouverM(id); if (!cible) return;
      etat.prix = { pour: id, chargement: true }; render();
      try { const q = ['maillot', cible.equipe, cible.saison, cible.type && cible.type !== 'Domicile' ? cible.type : ''].filter(Boolean).join(' '); const r = await estimerPrix(q); etat.prix = { pour: id, resultat: r }; }
      catch (err) { etat.prix = { pour: id, erreur: err.message }; }
      render(); return;
    }
    case 'valeur-set': { const m = trouverM(id); if (m) { m.valeur = Number(d.valeur); save(K.col, collection); toast('Valeur enregistrée'); render(); } return; }
    case 'wform': return ouvrirWishForm(id);
    case 'w-ajouter': { e.stopPropagation(); return ajouterWish({ equipe: d.equipe, categorie: d.categorie, saison: d.saison, type: d.type }); }
    case 'w-enregistrer': return enregistrerWish();
    case 'w-supprimer': {
      const w = trouverW(id); if (!w || !confirm(`Retirer « ${w.equipe} » de la wishlist ?`)) return;
      for (const pid of w.photos || []) await supprimerPhoto(pid);
      wishlist = wishlist.filter(x => x.id !== id); save(K.wish, wishlist); aller('wishlist'); return;
    }
    case 'w-trouve': { const w = trouverW(id); if (!w) return; return ouvrirFormulaire(null, { equipe: w.equipe, categorie: w.categorie, saison: w.saison, type: w.type, notes: w.notes, favori: w.priorite === 'Rêve absolu' }, w.id); }
    case 'p-enregistrer': {
      params.prenom = document.getElementById('p-prenom').value.trim(); params.relais = document.getElementById('p-relais').value.trim(); params.code = document.getElementById('p-code').value.trim();
      save(K.par, params); toast('Réglages enregistrés'); return;
    }
    case 'tester': {
      params.prenom = document.getElementById('p-prenom').value.trim(); params.relais = document.getElementById('p-relais').value.trim(); params.code = document.getElementById('p-code').value.trim(); save(K.par, params);
      etat.test = { version: '…' }; render();
      try { etat.test = await relais({ action: 'test' }); } catch (err) { etat.test = { erreur: err.message }; }
      render(); return;
    }
    case 'quota-reset': { save(K.quota, { mois: new Date().toISOString().slice(0, 7), utilise: 0 }); render(); return; }
    case 'export': {
      const photos = {}; [...collection, ...wishlist].forEach(m => (m.photos || []).forEach(p => { if (PHOTOS[p]) photos[p] = PHOTOS[p]; }));
      const blob = new Blob([JSON.stringify({ version: VERSION, date: new Date().toISOString(), collection, wishlist, photos })], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const lien = document.createElement('a'); lien.href = url; lien.download = `mes-maillots-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(lien); lien.click(); lien.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast('Fichier de sauvegarde téléchargé'); return;
    }
    case 'import': { etat.photoCible = 'import'; const f = document.getElementById('mm-file'); f.accept = '.json,application/json'; f.click(); return; }
    case 'effacer': {
      if (!confirm('Tout effacer ? Collection, wishlist et photos seront supprimées de cet appareil.')) return;
      if (!confirm('Vraiment sûr ? Cette action est définitive.')) return;
      for (const m of [...collection, ...wishlist]) for (const pid of m.photos || []) await supprimerPhoto(pid);
      collection = []; wishlist = []; save(K.col, collection); save(K.wish, wishlist); toast('Tout a été effacé'); aller('accueil'); return;
    }
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'c-recherche') { etat.recherche = e.target.value; const g = document.getElementById('grille'); if (g) g.innerHTML = grilleHTML(); }
});
document.addEventListener('change', async e => {
  if (e.target.id === 'c-tri') { etat.tri = e.target.value; const g = document.getElementById('grille'); if (g) g.innerHTML = grilleHTML(); return; }
  if (e.target.id === 'f-equipe' || e.target.id === 'w-equipe') { const eq = trouverEquipe(e.target.value); if (eq && e.target.id === 'f-equipe') { const c = document.getElementById('f-categorie'), p = document.getElementById('f-pays'); if (c) c.value = eq.categorie; if (p && !p.value) p.value = eq.pays; } return; }
  if (e.target.id === 'mm-file') {
    const file = e.target.files[0]; const cible = etat.photoCible; e.target.value = ''; if (!file) return;
    if (cible === 'import') { e.target.accept = 'image/*'; return importer(file); }
    let dataUrl; try { dataUrl = await compresser(file); } catch (err) { return toast('Impossible de lire cette image.'); }
    const pid = await stockerPhoto(dataUrl);
    if (cible === 'form') { lireBrouillon(); etat.brouillon.photos.push(pid); etat.lens = null; render(); }
    else if (cible === 'wform') { lireBrouillon(); etat.wbrouillon.photos.push(pid); render(); }
    else if (cible && cible.startsWith('fiche:')) { const m = trouverM(cible.slice(6)); if (m) { m.photos.push(pid); save(K.col, collection); toast('Photo ajoutée'); render(); } }
  }
});
function appliquerEquipe(nom) {
  const b = etat.brouillon; const eq = trouverEquipe(nom);
  b.equipe = eq ? eq.nom : nom; if (eq) { b.categorie = eq.categorie; b.pays = eq.pays; }
}
async function identifier() {
  lireBrouillon(); const b = etat.brouillon; const image = PHOTOS[b.photos[0]]; if (!image) return toast('Ajoute d\'abord une photo.');
  etat.lensChargement = true; etat.lens = null; render();
  try {
    const dd = await relais({ action: 'lens', image });
    const matches = dd.visual_matches || dd.matches || dd.resultats || dd.correspondances || (dd.lens && dd.lens.visual_matches) || [];
    const an = analyserLens(matches);
    an.images = matches.map(it => ({ src: it.thumbnail || it.image || it.vignette || '', lien: it.link || it.lien || '', titre: it.title || it.titre || '' })).filter(i => i.src);
    an.cache = !!dd.cache;
    etat.lens = an;
    if (an.pistes[0]) { appliquerEquipe(an.pistes[0].nom); if (an.saison && !b.saison) b.saison = an.saison; if (an.type) b.type = an.type; if (an.marque && !b.marque) b.marque = an.marque; toast(`Identifié : ${an.pistes[0].nom}${an.pistes[0].n < 3 ? ' (indice faible, vérifie)' : ''}`); }
    else if (!matches.length) etat.lens.erreur = 'Google Lens n\'a renvoyé aucun résultat pour cette photo.';
  } catch (err) { etat.lens = { erreur: err.message, pistes: [] }; }
  etat.lensChargement = false; render();
}
function enregistrer() {
  lireBrouillon(); const b = etat.brouillon;
  if (!b.equipe) return toast('Indique au moins l\'équipe.');
  const eq = trouverEquipe(b.equipe); if (eq) { b.equipe = eq.nom; if (!b.pays) b.pays = eq.pays; b.categorie = eq.categorie; }
  b.prix = b.prix ? Number(b.prix) : ''; b.valeur = b.valeur ? Number(b.valeur) : '';
  if (etat.editId) { const i = collection.findIndex(m => m.id === etat.editId); if (i >= 0) collection[i] = Object.assign({}, collection[i], b); }
  else { b.id = uid(); b.date = new Date().toISOString(); collection.push(b); }
  if (etat.wishId) { wishlist = wishlist.filter(w => w.id !== etat.wishId); save(K.wish, wishlist); toast('🎉 Souhait réalisé et ajouté à ta collection !'); } else toast(etat.editId ? 'Modifications enregistrées' : '👕 Maillot ajouté !');
  save(K.col, collection); const id = etat.editId || b.id; etat.editId = null; etat.wishId = null; etat.brouillon = null; etat.lens = null; aller('fiche', id);
}
function enregistrerWish() {
  lireBrouillon(); const b = etat.wbrouillon;
  if (!b.equipe) return toast('Indique au moins l\'équipe.');
  const eq = trouverEquipe(b.equipe); if (eq) { b.equipe = eq.nom; b.categorie = eq.categorie; } else if (!b.categorie) b.categorie = 'club';
  b.budget = b.budget ? Number(b.budget) : '';
  if (etat.weditId) { const i = wishlist.findIndex(w => w.id === etat.weditId); if (i >= 0) wishlist[i] = Object.assign({}, wishlist[i], b); }
  else { b.id = uid(); b.date = new Date().toISOString(); wishlist.push(b); }
  save(K.wish, wishlist); const id = etat.weditId || b.id; etat.weditId = null; etat.wbrouillon = null; toast('⭐ Souhait enregistré'); aller('wishfiche', id);
}
function importer(file) {
  const fr = new FileReader();
  fr.onload = async () => {
    try {
      const d = JSON.parse(fr.result);
      const col = Array.isArray(d) ? d : (d.collection || d.maillots || []); const wl = d.wishlist || [];
      if (!Array.isArray(col)) throw new Error('format');
      if (!confirm(`Importer ${col.length} maillot(s) et ${wl.length} souhait(s) ? Ils seront ajoutés à ta collection actuelle.`)) return;
      if (d.photos) for (const [k, v] of Object.entries(d.photos)) { PHOTOS[k] = v; try { await DB.put(k, v); } catch (e) { } }
      const ids = new Set(collection.map(m => m.id)); col.forEach(m => { if (!ids.has(m.id)) collection.push(m); });
      const wids = new Set(wishlist.map(m => m.id)); wl.forEach(m => { if (!wids.has(m.id)) wishlist.push(m); });
      await migrer(); save(K.col, collection); save(K.wish, wishlist); toast('Import terminé'); aller('collection');
    } catch (e) { toast('Fichier illisible : il faut un export de Mes Maillots.'); }
  };
  fr.readAsText(file);
}

/* ---------- Style ---------- */
function injecterStyle() {
  ['style-v20', 'style-v21'].forEach(id => { const s = document.getElementById(id); if (s) s.remove(); });
  const st = document.createElement('style'); st.id = 'style-v21';
  st.textContent = `
:root{--vert:#143d2f;--vert2:#1e5a45;--or:#c9962f;--fond:#f6f4ef;--gris:#6b7280;--ligne:#e5e2da}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:var(--fond);color:#1c1c1c;-webkit-tap-highlight-color:transparent}
button,input,select,textarea{font-family:inherit;font-size:15px}
#mm-main{padding-bottom:90px;min-height:100vh;max-width:1100px;margin:0 auto}
#mm-nav{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--ligne);display:flex;justify-content:space-around;padding:6px 0 calc(6px + env(safe-area-inset-bottom));z-index:50}
#mm-nav button{background:none;border:0;font-size:11px;color:var(--gris);display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 10px;cursor:pointer}
#mm-nav button .ico{font-size:22px;line-height:1}#mm-nav button.actif{color:var(--vert);font-weight:700}
#mm-toast{position:fixed;left:50%;bottom:90px;transform:translate(-50%,20px);background:#1c1c1c;color:#fff;padding:12px 18px;border-radius:12px;font-size:14px;opacity:0;pointer-events:none;transition:.25s;z-index:99;max-width:90vw;text-align:center}
#mm-toast.on{opacity:1;transform:translate(-50%,0)}
.pad{padding:0 16px 16px}.bloc{padding:18px 0 4px}.bloc-tete{display:flex;justify-content:space-between;align-items:center;padding:0 16px 10px}
h1{font-size:24px;margin:10px 0 4px;color:var(--vert)}h2{font-size:17px;margin:0;color:var(--vert)}
.entete{padding:18px 16px 6px}.sous-titre{color:var(--gris);font-size:14px}
.lien{background:none;border:0;color:var(--vert2);font-weight:600;cursor:pointer;padding:4px}
.btn{background:var(--vert);color:#fff;border:0;border-radius:12px;padding:12px 16px;font-size:15px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;justify-content:center;text-decoration:none}
.btn.sec{background:#fff;color:var(--vert);border:1.5px solid var(--vert)}.btn.or{background:var(--or)}.btn.danger{background:#fff;color:#b91c1c;border:1.5px solid #b91c1c}
.btn.large{width:100%;margin:10px 0}.btn.petit{padding:8px 12px;font-size:13px;border-radius:10px}.btn:disabled{opacity:.55}
.actions{display:flex;gap:10px;margin:14px 0;flex-wrap:wrap}.actions .btn{flex:1}.liens{display:flex;gap:8px;margin:12px 0}.liens .btn{flex:1;padding:10px}
.rond{width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:20px;cursor:pointer}
.icone{width:44px;border:1px solid var(--ligne);background:#fff;border-radius:12px;font-size:18px;cursor:pointer}
/* hero */
.hero{background:linear-gradient(160deg,var(--vert),var(--vert2));color:#fff;padding:22px 16px 20px;border-radius:0 0 28px 28px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 18px,transparent 18px 36px);pointer-events:none}
.hero>*{position:relative}.hero-top{display:flex;justify-content:space-between;align-items:flex-start}
.salut{font-size:26px;font-weight:800}.hero .sous{opacity:.85;font-size:14px;margin-top:2px}
.vestiaire{display:flex;gap:6px;overflow-x:auto;padding:16px 0 8px;scrollbar-width:none}.vestiaire::-webkit-scrollbar{display:none}
.cintre{width:62px;height:62px;flex:none;background:rgba(255,255,255,.12);border:0;border-radius:14px;padding:6px;cursor:pointer}
.cintre svg{width:100%;height:100%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))}.cintre.fantome{opacity:.5}
.tuiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:6px}
.tuile{background:rgba(255,255,255,.14);border:0;border-radius:16px;color:#fff;padding:12px 6px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer}
.tuile-ico{font-size:20px}.tuile b{font-size:17px}.tuile span:last-child{font-size:11px;opacity:.85}
/* cartes & visuels */
.rangee{display:flex;gap:12px;overflow-x:auto;padding:4px 16px 14px;scroll-snap-type:x mandatory;scrollbar-width:none}.rangee::-webkit-scrollbar{display:none}
.rangee.sans-pad{padding-left:0;padding-right:0}.rangee .carte{width:150px;flex:none;scroll-snap-align:start}.rangee .carte.sugg{width:190px}
.grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}.grille.mosaique{grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:6px}
.carte{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);position:relative;cursor:pointer;transition:transform .15s}.carte:active{transform:scale(.98)}
.vis{position:relative;aspect-ratio:1;background:linear-gradient(135deg,#ece7dc,#d9d2c2);overflow:hidden}
.vis img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vis .jersey{position:absolute;inset:12%}.vis .jersey svg{width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,.25))}
.vis .drapeau{object-fit:cover}.vis .mini-jersey{position:absolute;right:6px;bottom:6px;width:28%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))}
.coeur{position:absolute;top:8px;right:8px;background:rgba(255,255,255,.92);border:0;border-radius:50%;width:34px;height:34px;font-size:16px;cursor:pointer;z-index:2}
.coeur.grand{position:static;width:44px;height:44px;font-size:22px;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.badge{position:absolute;left:8px;top:10px;background:rgba(20,61,47,.88);color:#fff;font-size:11px;padding:3px 9px;border-radius:999px;z-index:2}.badge.or{background:rgba(201,150,47,.95)}
.carte-txt{padding:10px 12px 12px}.carte-titre{font-weight:700;font-size:14px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.carte-sous{color:var(--gris);font-size:12px;margin-top:2px}
.carte-prix{color:var(--vert2);font-weight:700;font-size:13px;margin-top:4px}.raison{font-size:12px;color:#374151;margin-top:6px;line-height:1.3}
.actions-mini{display:flex;gap:6px;margin-top:8px}.actions-mini .btn{flex:1;padding:7px 4px;font-size:12px}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;flex-wrap:nowrap}.chips::-webkit-scrollbar{display:none}
.chip{flex:none;background:#fff;border:1px solid var(--ligne);border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer;color:#1c1c1c}.chip.on{background:var(--vert);color:#fff;border-color:var(--vert)}.chip small{opacity:.6}
.barre{display:flex;gap:8px;margin-top:8px}.barre input{flex:1;min-width:0}.barre select{width:110px}
input,select,textarea{width:100%;padding:12px;border:1px solid var(--ligne);border-radius:12px;background:#fff;color:#1c1c1c}
label{display:block;font-size:13px;color:var(--gris);margin:12px 0 0}label input,label select,label textarea{margin-top:5px}
.deux{display:grid;grid-template-columns:1fr 1fr;gap:10px}.case{display:flex;align-items:center;gap:8px;font-size:15px;color:#1c1c1c;margin:16px 0}.case input{width:20px;height:20px;margin:0}
.vide{text-align:center;padding:30px 20px;color:var(--gris)}.vide-ill{width:120px;margin:0 auto 10px;opacity:.9}.vide p{margin:0 0 14px}
/* fiche */
.fiche-tete{display:flex;justify-content:space-between;align-items:center;padding:12px 16px 6px}
.retour{background:none;border:0;color:var(--vert2);font-weight:600;font-size:16px;cursor:pointer;padding:6px 0}
.carrousel{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:0;scrollbar-width:none}.carrousel::-webkit-scrollbar{display:none}
.diapo{flex:none;width:100%;scroll-snap-align:center;position:relative;aspect-ratio:1;background:#e9e4d8;max-height:70vh}
.diapo>img{width:100%;height:100%;object-fit:contain;background:#111}.diapo .vis{height:100%}
.supp-photo{position:absolute;right:12px;bottom:12px;background:rgba(0,0,0,.6);color:#fff;border:0;border-radius:50%;width:38px;height:38px;cursor:pointer}
.points{display:flex;justify-content:center;gap:6px;padding:8px}.points span{width:7px;height:7px;border-radius:50%;background:#c9c4b8}
.titre-fiche{margin-top:14px}
.infos{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}.infos div{background:#fff;border-radius:12px;padding:10px 12px}.infos dt{font-size:11px;color:var(--gris);text-transform:uppercase;letter-spacing:.3px}.infos dd{margin:2px 0 0;font-weight:600}
.notes{background:#fff;border-radius:12px;padding:12px;white-space:pre-wrap}
.bloc-in{margin:18px 0}.bloc-in h2{margin-bottom:10px}
.panneau{background:#fff;border-radius:14px;padding:14px;margin:12px 0;border:1px solid var(--ligne)}.panneau.erreur{background:#fef2f2;border-color:#fecaca;color:#991b1b}
.estim b{font-size:24px;color:var(--vert);display:block}.estim span{color:var(--gris);font-size:13px}.estim small{display:block;color:var(--gris);margin-top:4px}
.annonces{list-style:none;padding:0;margin:12px 0 0}.annonces li{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center;padding:8px 0;border-top:1px solid var(--ligne);font-size:13px}
.annonces li a,.annonces li>span{flex:1;min-width:60%;color:#1c1c1c;text-decoration:none}.annonces li b{color:var(--vert2)}.annonces .src{display:inline-block;background:#eee;border-radius:6px;padding:1px 6px;font-size:11px;margin-right:4px}
.annonces li.suspect{opacity:.6}.annonces li em{width:100%;font-size:11px;color:#b45309;font-style:normal}
.spin{display:inline-block;width:18px;height:18px;border:3px solid #ccc;border-top-color:var(--vert);border-radius:50%;animation:spin .8s linear infinite;vertical-align:middle;margin-right:6px}@keyframes spin{to{transform:rotate(360deg)}}
.photos-form{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}
.mini-photo{position:relative;width:96px;height:96px;border-radius:12px;overflow:hidden}.mini-photo img{width:100%;height:100%;object-fit:cover}.mini-photo button{position:absolute;top:4px;right:4px;background:rgba(0,0,0,.6);color:#fff;border:0;border-radius:50%;width:26px;height:26px;cursor:pointer}
.ajout-photo{width:96px;height:96px;border:2px dashed #b8b1a3;background:#fff;border-radius:12px;font-size:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:var(--vert)}.ajout-photo span{font-size:11px}
.aide{color:var(--gris);font-size:13px;margin:8px 0}
.imgs .img-web{flex:none;width:110px;text-decoration:none;color:#374151;font-size:11px}.img-web img{width:110px;height:110px;object-fit:cover;border-radius:10px;background:#eee;display:block}.img-web span{display:block;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jauge{height:10px;background:#e5e2da;border-radius:999px;overflow:hidden}.jauge div{height:100%;background:var(--or)}
.version{text-align:center;color:var(--gris);font-size:12px;margin:30px 0 10px}
@media(min-width:700px){.hero{border-radius:0 0 32px 32px;padding:28px 24px}.pad,.bloc-tete,.rangee,.entete,.fiche-tete{padding-left:24px;padding-right:24px}.rangee.sans-pad{padding-left:0;padding-right:0}.grille{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}.diapo{max-height:520px}.carrousel{max-width:520px;margin:0 auto;border-radius:16px;overflow:hidden}}
`;
  document.head.appendChild(st);
}

/* ---------- Démarrage ---------- */
async function demarrer() {
  document.body.innerHTML = '<main id="mm-main"></main><nav id="mm-nav"></nav><div id="mm-toast"></div><input type="file" id="mm-file" accept="image/*" hidden>';
  injecterStyle();
  document.getElementById('mm-main').innerHTML = '<div class="vide"><div class="spin"></div> Chargement…</div>';
  await migrer();
  render();
  if ('serviceWorker' in navigator) { try { navigator.serviceWorker.register('sw.js').then(r => r.update && r.update()); } catch (e) { } }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
