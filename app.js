'use strict';
(function () {
const VERSION = '3.0';
const K = { col: 'mm_collection', wish: 'mm_wishlist', par: 'mm_params', quota: 'mm_quota', lus: 'mm_notifs_lus' };
const TYPES = ['Domicile', 'Extérieur', 'Third', 'Gardien', 'Autre'];
const VERSIONS = ['Replica', 'Authentic', 'Porté en match', 'Autre'];
const TAILLES = ['Enfant', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const ETATS = ['Neuf avec étiquette', 'Neuf sans étiquette', 'Très bon état', 'Bon état', 'État correct', 'Abîmé'];
const MARQUES = ['Adidas', 'Nike', 'Puma', 'Umbro', 'Kappa', 'Hummel', 'Macron', 'New Balance', 'Joma', 'Le Coq Sportif', 'Castore', 'Erreà', 'Lotto', 'Diadora', 'Reebok', 'Asics', 'Mizuno', 'Uhlsport', 'Warrior', 'Under Armour', 'Fila', 'Patrick', 'Duarig', 'Airness', 'Jako', 'Score Draw', 'Autre'];
const PRIORITES = ['Normale', 'Haute', 'Rêve absolu'];
const QUOTA_MAX = 250;

/* ---------- SÉLECTIONS : Nom|code drapeau|autres noms ---------- */
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

/* ---------- CLUBS : Nom|Pays|couleur 1|couleur 2|motif|autres noms ---------- */
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

const CLASSIQUES = [
  { equipe: 'Pays-Bas', categorie: 'selection', saison: '1988', type: 'Domicile', raison: "Le maillot orange géométrique de l'Euro 88, une icône absolue." },
  { equipe: 'France', categorie: 'selection', saison: '1998', type: 'Domicile', raison: 'Le maillot de la première étoile.' },
  { equipe: 'Nigeria', categorie: 'selection', saison: '2018', type: 'Domicile', raison: 'Le maillot le plus vendu de la Coupe du monde 2018.' },
  { equipe: 'Brésil', categorie: 'selection', saison: '2002', type: 'Domicile', raison: 'Ronaldo, Rivaldo, Ronaldinho : la cinquième étoile.' },
  { equipe: 'Allemagne', categorie: 'selection', saison: '1990', type: 'Domicile', raison: 'Les bandes noir, rouge et or de Rome 1990.' },
  { equipe: 'Argentine', categorie: 'selection', saison: '1986', type: 'Domicile', raison: 'Le maillot de Maradona au Mexique.' },
  { equipe: 'Danemark', categorie: 'selection', saison: '1986', type: 'Domicile', raison: 'Le Hummel à demi-rayures, culte chez les collectionneurs.' },
  { equipe: 'Mexique', categorie: 'selection', saison: '1998', type: 'Domicile', raison: "Le calendrier aztèque d'ABA Sport." },
  { equipe: 'Croatie', categorie: 'selection', saison: '1998', type: 'Domicile', raison: 'Le damier de la génération Šuker.' },
  { equipe: 'Italie', categorie: 'selection', saison: '1994', type: 'Domicile', raison: 'Le bleu Diadora de Roberto Baggio.' },
  { equipe: 'Cameroun', categorie: 'selection', saison: '2002', type: 'Domicile', raison: 'Le fameux maillot sans manches.' },
  { equipe: 'Jamaïque', categorie: 'selection', saison: '1998', type: 'Domicile', raison: 'Les Reggae Boyz et leur Kappa inoubliable.' },
  { equipe: 'Juventus', categorie: 'club', saison: '1996-97', type: 'Domicile', raison: 'Kappa et Sony : la Juve de Zidane et Del Piero.' },
  { equipe: 'ACF Fiorentina', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Le violet Fila de Batistuta.' },
  { equipe: 'Ajax Amsterdam', categorie: 'club', saison: '1994-95', type: 'Domicile', raison: 'La bande rouge Umbro des vainqueurs de la C1.' },
  { equipe: 'Parme Calcio', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Les hachures jaune et bleu de Buffon et Crespo.' },
  { equipe: 'Borussia Dortmund', categorie: 'club', saison: '1996-97', type: 'Domicile', raison: "Le jaune Nike champion d'Europe." },
  { equipe: 'Arsenal', categorie: 'club', saison: '1991-92', type: 'Extérieur', raison: "Le fameux « bruised banana » d'Adidas." },
  { equipe: 'Boca Juniors', categorie: 'club', saison: '1981', type: 'Domicile', raison: 'Le bleu et or du jeune Maradona.' },
  { equipe: 'Olympique de Marseille', categorie: 'club', saison: '1992-93', type: 'Domicile', raison: 'À jamais les premiers.' },
  { equipe: 'Manchester United', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Le triplé, la finale de Barcelone.' },
  { equipe: 'FC Barcelone', categorie: 'club', saison: '1998-99', type: 'Domicile', raison: 'Le centenaire du Barça.' },
  { equipe: 'Real Madrid', categorie: 'club', saison: '2001-02', type: 'Domicile', raison: 'La volée de Zidane à Glasgow.' },
  { equipe: 'Newcastle United', categorie: 'club', saison: '1995-96', type: 'Domicile', raison: 'Les rayures Adidas de Shearer et Ginola.' }
];

/* ---------- Outils ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const euros = n => (n == null || n === '' || isNaN(Number(n))) ? '—' : Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('Mémoire pleine : exportez votre collection dans Paramètres.'); } };
const hash = s => { let h = 0; for (const ch of norm(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };

const SELECTIONS = SELECTIONS_BRUT.trim().split('\n').map(l => { const p = l.split('|').map(s => (s || '').trim()); return { nom: p[0], categorie: 'selection', pays: p[0], iso: p[1] || '', c1: '', c2: '', motif: 'uni', alias: p[2] ? p[2].split(';').map(s => s.trim()).filter(Boolean) : [] }; });
const CLUBS = CLUBS_BRUT.trim().split('\n').map(l => { const p = l.split('|').map(s => (s || '').trim()); return { nom: p[0], categorie: 'club', pays: p[1] || '', iso: '', c1: p[2] || '', c2: p[3] || '', motif: p[4] || 'uni', alias: p[5] ? p[5].split(';').map(s => s.trim()).filter(Boolean) : [] }; });
const EQUIPES = [...SELECTIONS, ...CLUBS];
const trouverEquipe = nom => { const n = norm(nom); if (!n) return null; return EQUIPES.find(e => norm(e.nom) === n) || EQUIPES.find(e => e.alias.some(a => norm(a) === n)) || null; };

/* ---------- Données & photos (IndexedDB) ---------- */
let collection = load(K.col, []);
let wishlist = load(K.wish, []);
let params = Object.assign({ relais: '', code: '', prenom: '', dernierExport: '' }, load(K.par, {}));
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
  for (const liste of [collection, wishlist]) for (const m of liste) {
    if (!m.id) { m.id = uid(); change = true; }
    if (m.photo && !m.photos) { m.photos = [m.photo]; delete m.photo; change = true; }
    if (!Array.isArray(m.photos)) { m.photos = []; change = true; }
    for (let i = 0; i < m.photos.length; i++) { const p = m.photos[i]; if (typeof p === 'string' && p.startsWith('data:')) { m.photos[i] = await stockerPhoto(p); change = true; } }
    if (!m.equipe) { m.equipe = m.club || m.nom || ''; change = true; }
    if (!m.categorie) { const eq = trouverEquipe(m.equipe); m.categorie = eq ? eq.categorie : 'club'; change = true; }
    if (!m.date) { m.date = new Date().toISOString(); change = true; }
  }
  if (change) { save(K.col, collection); save(K.wish, wishlist); }
}

/* ---------- Quota & relais ---------- */
function quota() { const mois = new Date().toISOString().slice(0, 7); let q = load(K.quota, { mois, utilise: 0 }); if (q.mois !== mois) { q = { mois, utilise: 0 }; save(K.quota, q); } return q; }
function compterQuota() { const q = quota(); q.utilise++; save(K.quota, q); }
async function relais(payload) {
  const url = (params.relais || '').trim().replace(/\/+$/, '');
  if (!url) throw new Error('Adresse du relais manquante : rendez-vous dans Paramètres.');
  if (!params.code) throw new Error('Code secret manquant : rendez-vous dans Paramètres.');
  let r;
  try { r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ code: params.code }, payload)) }); }
  catch (e) { throw new Error('Impossible de joindre le relais (pas de réseau ou adresse erronée).'); }
  let d; try { d = await r.json(); } catch (e) { throw new Error('Réponse illisible du relais (' + r.status + ').'); }
  if (!r.ok || d.ok === false || d.erreur || d.error) throw new Error(d.erreur || d.error || d.message || ('Erreur relais ' + r.status));
  if (d.serpapi_utilise || (d.cache === false && payload.action !== 'test' && payload.action !== 'ebay')) compterQuota();
  return d;
}

/* ---------- Icônes vectorielles ---------- */
const ICONES = {
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  back: '<polyline points="15 18 9 12 15 6"/>',
  next: '<polyline points="9 18 15 12 9 6"/>',
  ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  euro: '<path d="M18.5 7a7 7 0 1 0 0 10"/><line x1="4" y1="10" x2="15" y2="10"/><line x1="4" y1="14" x2="15" y2="14"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  shirt: '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  puzzle: '<path d="M4 7h4V4a2 2 0 0 1 4 0v3h4a2 2 0 0 1 2 2v4h3a2 2 0 0 1 0 4h-3v4a2 2 0 0 1-2 2h-4v-3a2 2 0 0 0-4 0v3H4v-4a2 2 0 0 1 0-4V7z"/>'
};
const I = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[n] || ''}</svg>`;

/* ---------- Visuels : photographies football, maillots dessinés, drapeaux ---------- */
const PHOTOS_WEB = ['1522778119026-d647f0596c20', '1508098682722-e99c43a406b2', '1574629810360-7efbbe195018', '1431324155629-1a6deb1dec8d', '1459865264687-595d652de67e', '1551958219-acbc608c6377', '1560272564-c83b66b1ad12', '1579952363873-27f3bade9f55', '1489944440615-453fc2b6a9a9', '1575361204480-aadea25e6e68', '1526232761682-d26e03ac148e', '1517466787929-bc90951d0974', '1577223625816-7546f13df25d', '1553778263-73a83bab9b0c', '1510051640316-cee39563ddab', '1486286701208-1d58e9338013', '1529900748604-07564a03e7a6', '1504450758481-7338eba7524a', '1556056504-5c7696c4c28d', '1518604666860-9ed391f76460'];
const photoWeb = (cle, w) => `https://images.unsplash.com/photo-${PHOTOS_WEB[hash(cle) % PHOTOS_WEB.length]}?auto=format&fit=crop&w=${w || 800}&q=70`;
const PALETTE = [['#c8102e', '#ffffff'], ['#1d4ed8', '#ffffff'], ['#15803d', '#ffffff'], ['#111111', '#ffffff'], ['#f59e0b', '#111111'], ['#7c3aed', '#ffffff'], ['#0ea5e9', '#0f172a'], ['#be123c', '#fde68a'], ['#065f46', '#fbbf24'], ['#1e3a8a', '#f87171']];
function couleursPour(m) {
  const eq = trouverEquipe(m.equipe); let c1, c2, motif = 'uni';
  if (eq && eq.c1) { c1 = eq.c1; c2 = eq.c2 || '#ffffff'; motif = eq.motif || 'uni'; } else { [c1, c2] = PALETTE[hash(m.equipe) % PALETTE.length]; }
  const t = norm(m.type);
  if (t.startsWith('ext')) { if (norm(c2) === 'ffffff') { c2 = c1; c1 = '#ffffff'; } else { const x = c1; c1 = c2; c2 = x; } motif = 'uni'; }
  else if (t === 'third') { c2 = c1; c1 = '#1f2937'; motif = 'uni'; }
  else if (t === 'gardien') { c2 = '#111827'; c1 = '#a3e635'; motif = 'uni'; }
  return { c1, c2, motif };
}
function svgMaillot(c1, c2, motif) {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  const body = 'M30 12 L42 6 Q50 14 58 6 L70 12 L94 26 L86 42 L73 36 L73 94 L27 94 L27 36 L14 42 L6 26 Z';
  let deco = '';
  if (motif === 'rayures') { for (let x = 27; x < 73; x += 12) deco += `<rect x="${x}" y="0" width="6" height="100" fill="${c2}"/>`; }
  else if (motif === 'cerceaux') { for (let y = 16; y < 94; y += 14) deco += `<rect x="0" y="${y}" width="100" height="7" fill="${c2}"/>`; }
  else if (motif === 'moitie') deco = `<rect x="0" y="0" width="50" height="100" fill="${c2}"/>`;
  else if (motif === 'diag') deco = `<polygon points="18,20 36,10 78,94 58,94" fill="${c2}"/>`;
  else if (motif === 'manches') deco = `<rect x="0" y="0" width="27" height="100" fill="${c2}"/><rect x="73" y="0" width="27" height="100" fill="${c2}"/>`;
  else if (motif === 'bande') deco = `<rect x="0" y="48" width="100" height="16" fill="${c2}"/>`;
  else if (motif === 'bandev') deco = `<rect x="38" y="0" width="24" height="100" fill="${c2}"/>`;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs><path d="${body}" fill="${c1}"/><g clip-path="url(#${id})">${deco}</g><path d="${body}" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="2" stroke-linejoin="round"/><path d="M42 6 Q50 14 58 6 Q50 22 42 6Z" fill="${c2}" stroke="rgba(0,0,0,.25)"/></svg>`;
}
function media(m, w) {
  const ph = photoPrincipale(m); const c = couleursPour(m);
  return `<div class="media-bg" style="background:linear-gradient(135deg,${c.c1},${c.c2})"><div class="media-jersey">${svgMaillot(c.c1, c.c2, c.motif)}</div></div><img class="media-img ${ph ? 'perso' : ''}" src="${ph || photoWeb(m.equipe + '|' + (m.saison || ''), w)}" alt="" loading="lazy" onerror="this.remove()">`;
}
function pastille(m) {
  const eq = trouverEquipe(m.equipe); const sel = (m.categorie === 'selection' || (eq && eq.categorie === 'selection')) && eq && eq.iso;
  const lettre = (norm(m.equipe)[0] || '?').toUpperCase();
  return sel ? `<span class="pastille drapeau"><img src="https://flagcdn.com/w80/${eq.iso}.png" alt="" onerror="this.parentNode.classList.remove('drapeau');this.parentNode.textContent='${lettre}'"></span>` : `<span class="pastille">${lettre}</span>`;
}
function compresser(file, max, q) {
  max = max || 1000; q = q || 0.82;
  return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => { const img = new Image(); img.onload = () => { let w = img.width, h = img.height; const r = Math.min(1, max / Math.max(w, h)); w = Math.round(w * r); h = Math.round(h * r); const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); res(c.toDataURL('image/jpeg', q)); }; img.onerror = rej; img.src = fr.result; }; fr.onerror = rej; fr.readAsDataURL(file); });
}

/* ---------- Analyse Google Lens ---------- */
function analyserLens(matches) {
  const votes = new Map(), saisons = {}, types = {}, marques = {}, versions = {};
  for (const it of matches) {
    const titre = it.title || it.titre || ''; const t = ' ' + norm(titre + ' ' + (it.source || '')) + ' ';
    for (const eq of EQUIPES) { const noms = [eq.nom].concat(eq.alias); if (noms.some(n => { const nn = norm(n); return nn.length >= 3 && t.includes(' ' + nn + ' '); })) votes.set(eq.nom, (votes.get(eq.nom) || 0) + 1); }
    const s = titre.match(/(19|20)\d{2}\s?[-\/–]\s?\d{2,4}/) || titre.match(/\b(19|20)\d{2}\b/);
    if (s) { const k = s[0].replace(/\s/g, '').replace('–', '-').replace('/', '-'); saisons[k] = (saisons[k] || 0) + 1; }
    if (/\b(away|exterieur|visitante|auswarts|trasferta|uit)\b/.test(t)) types['Extérieur'] = (types['Extérieur'] || 0) + 1;
    else if (/\b(third|3rd|troisieme|tercera)\b/.test(t)) types['Third'] = (types['Third'] || 0) + 1;
    else if (/\b(goalkeeper|gardien|gk|portero|torwart|portiere)\b/.test(t)) types['Gardien'] = (types['Gardien'] || 0) + 1;
    else if (/\b(home|domicile|local|heim|thuis)\b/.test(t)) types['Domicile'] = (types['Domicile'] || 0) + 1;
    if (/\b(authentic|authentique|player issue|player version|match|vapor|adv|heat rdy)\b/.test(t)) versions['Authentic'] = (versions['Authentic'] || 0) + 1;
    else if (/\b(replica|stadium|fan version)\b/.test(t)) versions['Replica'] = (versions['Replica'] || 0) + 1;
    for (const mq of MARQUES) if (mq !== 'Autre' && t.includes(' ' + norm(mq) + ' ')) marques[mq] = (marques[mq] || 0) + 1;
  }
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1])[0];
  const pistes = [...votes.entries()].sort((a, b) => b[1] - a[1]).map(([nom, n]) => ({ nom, n }));
  return { pistes, saison: (top(saisons) || [''])[0], type: (top(types) || [''])[0], marque: (top(marques) || [''])[0], version: (top(versions) || [''])[0] };
}

/* ---------- Prix & anti-arnaque ---------- */
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
  try { const e = await relais({ action: 'ebay', q }); (e.annonces || e.items || e.itemSummaries || []).forEach(a => { const p = a.prix != null ? a.prix : (a.price && (a.price.value || a.price)); const titre = a.titre || a.title || ''; if (titre) liste.push({ titre, lien: a.lien || a.itemWebUrl || a.link || '', source: 'eBay', prix: p ? Number(p) : null, suspect: motsSuspects(titre) }); }); } catch (e) { }
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
  const out = []; const push = s => { const k = cle(s); if (possede.has(k) || souhaite.has(k) || out.some(o => cle(o) === k)) return; out.push(s); };
  for (const m of collection) { if (!m.saison) continue; for (const t of ['Domicile', 'Extérieur', 'Third']) { if (norm(t) === norm(m.type)) continue; if (!collection.some(x => norm(x.equipe) === norm(m.equipe) && norm(x.saison) === norm(m.saison) && norm(x.type) === norm(t))) push({ equipe: m.equipe, categorie: m.categorie, saison: m.saison, type: t, marque: m.marque, raison: `Complète votre jeu ${m.equipe} ${m.saison} avec la version ${t.toLowerCase()}.`, score: 5 }); } }
  for (const m of collection) { const eq = trouverEquipe(m.equipe); if (eq && eq.categorie === 'club' && eq.pays) { const sel = SELECTIONS.find(s => s.nom === eq.pays); if (sel && !equipesPossedees.has(norm(sel.nom))) push({ equipe: sel.nom, categorie: 'selection', saison: '', type: 'Domicile', raison: `Vous collectionnez ${eq.nom} : la sélection ${sel.nom} prolonge naturellement cet intérêt.`, score: 3 }); } }
  const pays = {}; for (const m of collection) { const eq = trouverEquipe(m.equipe); if (eq) pays[eq.categorie === 'club' ? eq.pays : 'sel:' + eq.pays] = (pays[eq.categorie === 'club' ? eq.pays : 'sel:' + eq.pays] || 0) + 1; }
  const NORD = ['Norvège', 'Suède', 'Danemark', 'Finlande', 'Islande', 'Îles Féroé'];
  if (collection.some(m => NORD.includes(m.equipe))) NORD.filter(n => !equipesPossedees.has(norm(n))).forEach(n => push({ equipe: n, categorie: 'selection', saison: '', type: 'Domicile', raison: 'Un design épuré pour compléter votre intérêt pour les sélections nordiques.', score: 4 }));
  for (const [p] of Object.entries(pays).filter(([k]) => !k.startsWith('sel:')).sort((a, b) => b[1] - a[1]).slice(0, 3)) CLUBS.filter(c => c.pays === p && !equipesPossedees.has(norm(c.nom))).slice(0, 2).forEach(c => push({ equipe: c.nom, categorie: 'club', saison: '', type: 'Domicile', raison: `Un autre grand club de ${p}, idéal pour élargir votre collection.`, score: 2 }));
  CLASSIQUES.forEach(c => push(Object.assign({ score: 1 }, c)));
  return out.sort((a, b) => b.score - a.score);
}
function suggestionsAffichees(n) { const l = suggestions(); if (!l.length) return []; const off = (etat.seed * 3) % l.length; return l.slice(off).concat(l.slice(0, off)).slice(0, n); }

/* ---------- Notifications locales ---------- */
function notifications() {
  const lus = new Set(load(K.lus, [])); const out = []; const mois = new Date().toISOString().slice(0, 7);
  if (!params.relais || !params.code) out.push({ id: 'relais', titre: 'Connecter le relais', texte: 'Renseignez l\'adresse du relais et le code secret pour activer l\'identification et les prix.', vue: 'parametres' });
  if (!collection.length) out.push({ id: 'bienvenue', titre: 'Bienvenue dans Mes Maillots', texte: 'Ajoutez votre premier maillot pour obtenir des suggestions personnalisées.', vue: 'formulaire' });
  const nbS = suggestions().length; if (nbS) out.push({ id: 'sugg-' + mois + '-' + collection.length, titre: `${nbS} idée${nbS > 1 ? 's' : ''} pour votre collection`, texte: 'De nouvelles suggestions calculées d\'après vos maillots.', vue: 'idees' });
  wishlist.forEach(w => { if (w.budget && w.dernierPrix && Number(w.dernierPrix) <= Number(w.budget)) out.push({ id: 'prix-' + w.id + '-' + w.dernierPrix, titre: `${w.equipe} dans votre budget`, texte: `Estimation ${euros(w.dernierPrix)} pour un budget de ${euros(w.budget)}.`, vue: 'wishfiche', cible: w.id }); });
  if (collection.length && (!params.dernierExport || (Date.now() - new Date(params.dernierExport)) > 14 * 86400000)) out.push({ id: 'export-' + mois, titre: 'Pensez à sauvegarder', texte: 'Aucune exportation depuis plus de deux semaines. Vos données ne sont stockées que sur cet appareil.', vue: 'parametres' });
  const q = quota(); if (q.utilise >= QUOTA_MAX * 0.8) out.push({ id: 'quota-' + mois, titre: 'Quota de recherches bientôt atteint', texte: `${q.utilise} / ${QUOTA_MAX} recherches utilisées ce mois-ci.`, vue: 'parametres' });
  out.forEach(n => n.lu = lus.has(n.id)); return out;
}
function marquerLues() { save(K.lus, notifications().map(n => n.id).slice(0, 200)); }

/* ---------- État ---------- */
const etat = { vue: 'accueil', id: null, filtre: 'tous', recherche: '', tri: 'recent', brouillon: null, editId: null, wishId: null, lens: null, lensChargement: false, prix: null, wbrouillon: null, weditId: null, photoCible: null, test: null, seed: 0, notifs: false };
let toastTimer = null;
function toast(msg) { const t = document.getElementById('mm-toast'); if (!t) return alert(msg); t.textContent = msg; t.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 3200); }
function aller(vue, id) { etat.vue = vue; etat.id = id == null ? null : id; etat.notifs = false; window.scrollTo(0, 0); render(); }
const trouverM = id => collection.find(m => m.id === id);
const trouverW = id => wishlist.find(w => w.id === id);
const sousTitre = m => [m.saison, m.marque, m.version || m.type].filter(Boolean).join(' · ');
const dansWishlist = s => wishlist.find(w => norm(w.equipe) === norm(s.equipe) && norm(w.saison || '') === norm(s.saison || '') && (w.type || 'Domicile') === (s.type || 'Domicile'));

/* ---------- Composants ---------- */
function coeur(on, attrs) { return `<button class="heart ${on ? 'on' : ''}" ${attrs} aria-label="Favori">${I('heart')}</button>`; }
function carteMaillot(m) {
  return `<article class="card" data-act="aller" data-vue="fiche" data-id="${m.id}"><div class="media">${media(m)}${pastille(m)}${coeur(m.favori, `data-act="fav" data-id="${m.id}"`)}
  <div class="media-txt"><h3>${esc(m.equipe)}</h3><div class="meta">${esc(sousTitre(m) || m.type || '')}</div></div></div>
  ${m.valeur || m.taille || m.etat ? `<div class="card-foot"><span>${esc([m.taille, m.etat].filter(Boolean).join(' · '))}</span><b>${m.valeur ? euros(m.valeur) : ''}</b></div>` : ''}</article>`;
}
function carteWish(w) {
  return `<article class="card" data-act="aller" data-vue="wishfiche" data-id="${w.id}"><div class="media">${media(w)}${pastille(w)}<span class="tag">${esc(w.priorite || 'Normale')}</span>
  <div class="media-txt"><h3>${esc(w.equipe)}</h3><div class="meta">${esc([w.saison, w.type].filter(Boolean).join(' · '))}</div></div></div>
  <div class="card-foot"><span>${w.budget ? 'Budget ' + euros(w.budget) : 'Sans budget'}</span><b>${w.dernierPrix ? euros(w.dernierPrix) : ''}</b></div></article>`;
}
function carteSuggestion(s) {
  const d = `data-equipe="${esc(s.equipe)}" data-categorie="${esc(s.categorie)}" data-saison="${esc(s.saison || '')}" data-type="${esc(s.type || '')}"`;
  return `<article class="card sugg"><div class="media">${media(s)}${pastille(s)}${coeur(!!dansWishlist(s), `data-act="w-toggle" ${d}`)}
  <div class="media-txt"><h3>${esc(s.equipe)}</h3><div class="meta">${esc([s.saison, s.marque, s.type].filter(Boolean).join(' · ') || (s.categorie === 'selection' ? 'Sélection nationale' : 'Club'))}</div></div></div>
  <div class="card-body"><p class="quote">« ${esc(s.raison)} »</p><div class="card-actions"><button class="btn ghost sm" data-act="form-prerempli" ${d}>${I('plus')} Ajouter à ma collection</button><button class="btn ghost sm" data-act="aller" data-vue="wishform" data-prefill="1" ${d}>${I('star')} Wishlist</button></div></div></article>`;
}
function tete(eyebrow, titre, droite) { return `<div class="sec-head"><div>${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<h2>${titre}</h2></div>${droite || ''}</div>`; }
function vide(txt, bouton, cle) { return `<div class="vide"><div class="vide-img"><img src="${photoWeb(cle || 'vide', 900)}" alt="" onerror="this.remove()"></div><div class="vide-txt"><p>${txt}</p>${bouton || ''}</div></div>`; }
function selectHTML(id, options, val, vide0) { return `<select id="${id}">${vide0 ? `<option value="">${vide0}</option>` : ''}${options.map(o => `<option value="${esc(o)}" ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`; }
const datalists = () => `<datalist id="liste-equipes">${EQUIPES.map(e => `<option value="${esc(e.nom)}">`).join('')}</datalist><datalist id="liste-marques">${MARQUES.map(e => `<option value="${esc(e)}">`).join('')}</datalist>`;
const bouton = (txt, icone, cls, attrs) => `<button class="btn ${cls || ''}" ${attrs || ''}>${icone ? I(icone) : ''}<span>${txt}</span></button>`;

/* ---------- En-tête & navigation ---------- */
function enTete() {
  const notifs = notifications(); const nonLues = notifs.filter(n => !n.lu).length;
  const actif = { fiche: 'collection', formulaire: 'collection', wishfiche: 'wishlist', wishform: 'wishlist', idees: 'accueil' }[etat.vue] || etat.vue;
  const nav = [['accueil', 'Accueil', 'home'], ['collection', 'Collection', 'grid'], ['wishlist', 'Wishlist', 'star'], ['parametres', 'Paramètres', 'sliders']];
  return `<header class="top"><div class="wrap top-in">
    <button class="brand" data-act="nav" data-vue="accueil"><span class="brand-n">Mes Maillots</span><span class="brand-s">Collection privée</span></button>
    <nav class="topnav">${nav.map(([v, t]) => `<button class="${actif === v ? 'on' : ''}" data-act="nav" data-vue="${v}">${t}</button>`).join('')}</nav>
    <div class="top-r"><button class="bell ${etat.notifs ? 'on' : ''}" data-act="notifs" aria-label="Notifications">${I('bell')}${nonLues ? '<i class="dot"></i>' : ''}</button>${bouton('Ajouter', 'plus', 'dark add', 'data-act="nav" data-vue="formulaire"')}</div>
  </div>${etat.notifs ? `<div class="notifs"><div class="wrap"><div class="notifs-box"><div class="notifs-head"><h3>Notifications</h3><button class="lien" data-act="notifs-lu">Tout marquer comme lu</button></div>
    ${notifs.length ? `<ul>${notifs.map(n => `<li class="${n.lu ? '' : 'nouveau'}" data-act="aller" data-vue="${n.vue}" ${n.cible ? `data-id="${n.cible}"` : ''}><b>${esc(n.titre)}</b><span>${esc(n.texte)}</span></li>`).join('')}</ul>` : '<p class="aide">Aucune notification pour le moment.</p>'}</div></div></div>` : ''}</header>
  <nav id="mm-nav">${nav.slice(0, 2).map(([v, t, i]) => `<button class="${actif === v ? 'on' : ''}" data-act="nav" data-vue="${v}">${I(i)}<span>${t}</span></button>`).join('')}<button class="nav-add" data-act="nav" data-vue="formulaire">${I('plus')}</button>${nav.slice(2).map(([v, t, i]) => `<button class="${actif === v ? 'on' : ''}" data-act="nav" data-vue="${v}">${I(i)}<span>${t}</span></button>`).join('')}</nav>`;
}

/* ---------- Vues ---------- */
function vAccueil() {
  const valeur = collection.reduce((s, m) => s + (Number(m.valeur) || 0), 0);
  const favs = collection.filter(m => m.favori);
  const recents = [...collection].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 8);
  const compte = {}; collection.forEach(m => compte[m.equipe] = (compte[m.equipe] || 0) + 1);
  const topEq = Object.entries(compte).sort((a, b) => b[1] - a[1])[0];
  const h = new Date().getHours(); const salut = (h >= 5 && h < 18) ? 'Bonjour' : 'Bonsoir';
  const sugg = suggestionsAffichees(6);
  return `<section class="hero"><img class="hero-bg" src="${photoWeb('hero-' + etat.seed, 1600)}" alt="" onerror="this.remove()"><div class="hero-in">
    <div class="eyebrow light">${params.prenom ? `${salut}, ${esc(params.prenom)} · ` : ''}Découverte</div>
    <h1>Des maillots qui pourraient vous plaire</h1>
    <p>Des idées choisies d'après ce que vous collectionnez déjà. Les valeurs restent des estimations indicatives.</p>
    <div class="stats"><span>${collection.length} maillot${collection.length > 1 ? 's' : ''}</span><i></i><span>valeur estimée ${euros(valeur)}</span>${topEq ? `<i></i><span>${trouverEquipe(topEq[0]) && trouverEquipe(topEq[0]).categorie === 'selection' ? 'sélection' : 'club'} le plus présent : ${esc(topEq[0])}</span>` : ''}${wishlist.length ? `<i></i><span>${wishlist.length} souhait${wishlist.length > 1 ? 's' : ''}</span>` : ''}</div>
  </div></section>
  <section class="sec">${tete('Pour vous', 'Suggestions d\'après votre collection', bouton('Nouvelles idées', 'refresh', 'ghost', 'data-act="seed"'))}<div class="grid3">${sugg.map(carteSuggestion).join('')}</div></section>
  ${collection.length === 0 ? `<section class="sec">${vide('Votre collection est vide. Photographiez un maillot et laissez Google Lens l\'identifier, ou saisissez-le manuellement.', bouton('Ajouter un maillot', 'plus', 'dark', 'data-act="nav" data-vue="formulaire"'), 'premier')}</section>` : ''}
  ${recents.length ? `<section class="sec">${tete('Vestiaire', 'Ajoutés récemment', `<button class="lien" data-act="aller" data-vue="collection" data-reset="1">Toute la collection ${I('next')}</button>`)}<div class="row">${recents.map(carteMaillot).join('')}</div></section>` : ''}
  ${favs.length ? `<section class="sec">${tete('Coups de cœur', 'Vos favoris', `<button class="lien" data-act="aller" data-vue="collection" data-reset="1" data-filtre="favoris">Voir tout ${I('next')}</button>`)}<div class="row">${favs.slice(0, 8).map(carteMaillot).join('')}</div></section>` : ''}
  ${wishlist.length ? `<section class="sec">${tete('Recherches', 'Votre wishlist', `<button class="lien" data-act="aller" data-vue="wishlist">Voir tout ${I('next')}</button>`)}<div class="row">${[...wishlist].sort((a, b) => PRIORITES.indexOf(b.priorite) - PRIORITES.indexOf(a.priorite)).slice(0, 8).map(carteWish).join('')}</div></section>` : ''}`;
}
function filtrer() {
  let l = collection.slice(); const f = etat.filtre, r = norm(etat.recherche);
  if (f === 'favoris') l = l.filter(m => m.favori); else if (f === 'club' || f === 'selection') l = l.filter(m => m.categorie === f); else if (TYPES.includes(f)) l = l.filter(m => m.type === f);
  if (r) l = l.filter(m => norm([m.equipe, m.saison, m.marque, m.notes, m.type, m.pays, m.version].join(' ')).includes(r));
  if (etat.tri === 'az') l.sort((a, b) => a.equipe.localeCompare(b.equipe, 'fr')); else if (etat.tri === 'saison') l.sort((a, b) => String(b.saison || '').localeCompare(String(a.saison || ''))); else if (etat.tri === 'valeur') l.sort((a, b) => (Number(b.valeur) || 0) - (Number(a.valeur) || 0)); else l.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return l;
}
function grilleHTML() { const l = filtrer(); if (!l.length) return vide(collection.length ? 'Aucun maillot ne correspond à cette recherche.' : 'Votre collection est vide pour le moment.', collection.length ? '' : bouton('Ajouter un maillot', 'plus', 'dark', 'data-act="nav" data-vue="formulaire"'), 'collection'); return `<div class="grid">${l.map(carteMaillot).join('')}</div>`; }
function vCollection() {
  const valeur = collection.reduce((s, m) => s + (Number(m.valeur) || 0), 0);
  const chips = [['tous', 'Tous'], ['favoris', 'Favoris'], ['club', 'Clubs'], ['selection', 'Sélections'], ['Domicile', 'Domicile'], ['Extérieur', 'Extérieur'], ['Third', 'Third'], ['Gardien', 'Gardien']];
  return `<section class="sec page-head">${tete('Vestiaire', 'Collection')}<p class="aide">${collection.length} maillot${collection.length > 1 ? 's' : ''} · valeur estimée ${euros(valeur)}</p></section>
  <section class="sec"><div class="toolbar"><label class="search">${I('search')}<input id="c-recherche" type="search" placeholder="Équipe, saison, marque…" value="${esc(etat.recherche)}"></label>
  <select id="c-tri"><option value="recent" ${etat.tri === 'recent' ? 'selected' : ''}>Plus récents</option><option value="az" ${etat.tri === 'az' ? 'selected' : ''}>A → Z</option><option value="saison" ${etat.tri === 'saison' ? 'selected' : ''}>Saison</option><option value="valeur" ${etat.tri === 'valeur' ? 'selected' : ''}>Valeur</option></select></div>
  <div class="chips">${chips.map(([v, t]) => `<button class="chip ${etat.filtre === v ? 'on' : ''}" data-act="filtre" data-filtre="${v}">${t}</button>`).join('')}</div>
  <div id="grille">${grilleHTML()}</div></section>`;
}
function vFiche() {
  const m = trouverM(etat.id); if (!m) return `<section class="sec">${vide('Maillot introuvable.')}</section>`;
  const photos = (m.photos || []).map(id => PHOTOS[id]).filter(Boolean);
  const memeClub = collection.filter(x => x.id !== m.id && norm(x.equipe) === norm(m.equipe));
  const manquants = m.saison ? ['Domicile', 'Extérieur', 'Third'].filter(t => t !== m.type && !collection.some(x => norm(x.equipe) === norm(m.equipe) && norm(x.saison) === norm(m.saison) && x.type === t) && !wishlist.some(w => norm(w.equipe) === norm(m.equipe) && norm(w.saison) === norm(m.saison) && w.type === t)) : [];
  const p = etat.prix && etat.prix.pour === m.id ? etat.prix : null;
  const infos = [['Saison', m.saison], ['Type', m.type], ['Version', m.version], ['Marque', m.marque], ['Taille', m.taille], ['État', m.etat], ['Pays', m.pays], ["Prix d'achat", m.prix ? euros(m.prix) : ''], ['Valeur estimée', m.valeur ? euros(m.valeur) : ''], ['Ajouté le', m.date ? new Date(m.date).toLocaleDateString('fr-FR') : '']].filter(x => x[1]);
  return `<section class="sec"><button class="retour" data-act="retour">${I('back')} Collection</button>
  <div class="fiche"><div class="fiche-media"><div class="carrousel">${photos.length ? photos.map((ph, i) => `<div class="diapo"><img src="${ph}" alt=""><button class="icon-btn sur-photo" data-act="photo-del" data-id="${m.id}" data-idx="${i}" aria-label="Supprimer">${I('trash')}</button></div>`).join('') : `<div class="diapo"><div class="media">${media(m, 1200)}</div></div>`}</div>
    ${photos.length < 4 ? bouton(photos.length ? 'Ajouter une photo (dos, étiquette…)' : 'Ajouter une photo', 'camera', 'ghost sm bloc', `data-act="photo-add" data-cible="fiche:${m.id}"`) : ''}</div>
  <div class="fiche-info"><div class="fiche-titre"><div><div class="eyebrow">${m.categorie === 'selection' ? 'Sélection nationale' : 'Club'}${m.pays && m.categorie !== 'selection' ? ' · ' + esc(m.pays) : ''}</div><h1>${esc(m.equipe)}</h1><p class="aide">${esc(sousTitre(m))}</p></div>${coeur(m.favori, `data-act="fav" data-id="${m.id}"`)}</div>
    <dl class="infos">${infos.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    ${m.notes ? `<p class="notes">${esc(m.notes)}</p>` : ''}
    <div class="actions">${bouton('Estimer le prix', 'euro', 'dark', `data-act="prix" data-id="${m.id}"`)}${bouton('Modifier', 'edit', 'ghost', `data-act="editer" data-id="${m.id}"`)}</div>
    ${p ? panneauPrix(p, m) : ''}
    ${manquants.length ? `<div class="encart"><h3>${I('puzzle')} Compléter le jeu ${esc(m.saison)}</h3><div class="chips">${manquants.map(t => `<button class="chip" data-act="w-ajouter" data-equipe="${esc(m.equipe)}" data-categorie="${esc(m.categorie)}" data-saison="${esc(m.saison)}" data-type="${t}">${I('star')} ${t}</button>`).join('')}</div></div>` : ''}
    <button class="lien danger" data-act="supprimer" data-id="${m.id}">${I('trash')} Supprimer ce maillot</button></div></div>
  ${memeClub.length ? `${tete('Même équipe', 'Également dans votre collection')}<div class="row">${memeClub.map(carteMaillot).join('')}</div>` : ''}</section>`;
}
function panneauPrix(p, cible) {
  if (p.chargement) return `<div class="panneau"><span class="spin"></span> Recherche des annonces en cours…</div>`;
  if (p.erreur) return `<div class="panneau erreur">${I('alert')} ${esc(p.erreur)}</div>`;
  const r = p.resultat; const budget = cible && cible.budget ? Number(cible.budget) : null;
  return `<div class="panneau"><div class="estim">${r.estimation ? `<b>${euros(r.estimation)}</b><span>médiane de ${r.nb} annonce${r.nb > 1 ? 's' : ''}${r.min && r.max ? ` · de ${euros(r.min)} à ${euros(r.max)}` : ''}</span>` : '<span>Pas assez d\'annonces avec un prix pour estimer.</span>'}${r.cache ? '<small>Résultat en cache · aucune recherche consommée</small>' : ''}</div>
    ${r.estimation && cible && !cible.budget ? bouton('Utiliser comme valeur estimée', 'check', 'ghost sm', `data-act="valeur-set" data-id="${cible.id}" data-valeur="${r.estimation}"`) : ''}
    <ul class="annonces">${r.liste.slice(0, 15).map(a => `<li class="${a.suspect ? 'suspect' : ''}">${a.lien ? `<a href="${esc(a.lien)}" target="_blank" rel="noopener">` : '<span>'}<span class="src">${esc(a.source)}</span>${esc(a.titre)}${a.lien ? '</a>' : '</span>'}<b>${a.prix ? euros(a.prix) : '—'}${budget && a.prix && a.prix <= budget ? ' <small>dans le budget</small>' : ''}</b>${a.suspect ? `<em>${esc(a.pourquoi || 'Suspect')}</em>` : ''}</li>`).join('') || '<li>Aucune annonce trouvée.</li>'}</ul></div>`;
}
function vFormulaire() {
  const b = etat.brouillon || {}; const photos = (b.photos || []).map(id => PHOTOS[id]).filter(Boolean); const L = etat.lens;
  return `<section class="sec"><button class="retour" data-act="retour">${I('back')} Annuler</button>
  <div class="form"><div class="form-side"><div class="eyebrow">${etat.editId ? 'Modification' : 'Nouveau maillot'}</div><h1>${etat.editId ? 'Modifier la fiche' : 'Ajouter à la collection'}</h1>
    <div class="photos-form">${photos.map((ph, i) => `<div class="mini-photo"><img src="${ph}" alt=""><button class="icon-btn" data-act="brouillon-photo-del" data-idx="${i}" aria-label="Retirer">${I('x')}</button></div>`).join('')}${photos.length < 4 ? `<button class="ajout-photo" data-act="photo-add" data-cible="form">${I('camera')}<span>${photos.length ? 'Autre photo' : 'Photographier'}</span></button>` : ''}</div>
    ${photos.length ? `<button class="btn dark bloc" data-act="lens" ${etat.lensChargement ? 'disabled' : ''}>${etat.lensChargement ? '<span class="spin light"></span><span>Analyse Google Lens…</span>' : I('eye') + '<span>Identifier avec Google Lens</span>'}</button>` : '<p class="aide">Ajoutez une photo nette, de face, écusson visible, pour identifier le maillot automatiquement.</p>'}
    ${L ? panneauLens(L) : ''}</div>
  <div class="form-main">
    <label>Équipe<input id="f-equipe" list="liste-equipes" value="${esc(b.equipe || '')}" placeholder="Norvège, Juventus…" autocomplete="off"></label>
    <div class="deux"><label>Catégorie${selectHTML('f-categorie', ['club', 'selection'], b.categorie || 'club')}</label><label>Pays<input id="f-pays" value="${esc(b.pays || '')}" placeholder="automatique"></label></div>
    <div class="deux"><label>Saison<input id="f-saison" value="${esc(b.saison || '')}" placeholder="1998 ou 2023-24"></label><label>Type${selectHTML('f-type', TYPES, b.type || 'Domicile')}</label></div>
    <div class="deux"><label>Version${selectHTML('f-version', VERSIONS, b.version || 'Replica')}</label><label>Marque<input id="f-marque" list="liste-marques" value="${esc(b.marque || '')}"></label></div>
    <div class="deux"><label>Taille${selectHTML('f-taille', TAILLES, b.taille || '', '—')}</label><label>État${selectHTML('f-etat', ETATS, b.etat || '', '—')}</label></div>
    <div class="deux"><label>Prix d'achat (€)<input id="f-prix" type="number" inputmode="decimal" value="${esc(b.prix || '')}"></label><label>Valeur estimée (€)<input id="f-valeur" type="number" inputmode="decimal" value="${esc(b.valeur || '')}"></label></div>
    <label>Notes<textarea id="f-notes" rows="3" placeholder="Flocage, histoire, défauts…">${esc(b.notes || '')}</textarea></label>
    <label class="case"><input type="checkbox" id="f-favori" ${b.favori ? 'checked' : ''}> Marquer comme favori</label>
    ${bouton('Enregistrer', 'save', 'dark bloc', 'data-act="enregistrer"')}</div></div>${datalists()}</section>`;
}
function panneauLens(L) {
  if (L.erreur) return `<div class="panneau erreur">${I('alert')} ${esc(L.erreur)}</div>`;
  const top = L.pistes[0];
  return `<div class="panneau">${top ? `<div class="estim"><b>${esc(top.nom)}</b><span>${top.n} indice${top.n > 1 ? 's' : ''}${top.n < 3 ? ' · indice faible, à vérifier' : ''}${L.saison ? ' · saison ' + esc(L.saison) : ''}${L.type ? ' · ' + esc(L.type) : ''}${L.marque ? ' · ' + esc(L.marque) : ''}${L.version ? ' · ' + esc(L.version) : ''}</span></div>` : '<div class="estim"><span>Aucune équipe reconnue. Essayez une photo plus nette, de face, écusson visible.</span></div>'}
  ${L.pistes.length > 1 ? `<div class="aide">Autres pistes</div><div class="chips">${L.pistes.slice(1, 7).map(p => `<button class="chip" data-act="choisir-piste" data-nom="${esc(p.nom)}">${esc(p.nom)} <small>${p.n}</small></button>`).join('')}</div>` : ''}
  ${L.images && L.images.length ? `<div class="aide">Images similaires sur le web</div><div class="imgs">${L.images.slice(0, 12).map(i => `<a class="img-web" href="${esc(i.lien || '#')}" target="_blank" rel="noopener"><img src="${esc(i.src)}" alt="" loading="lazy" onerror="this.parentNode.remove()"><span>${esc(i.titre || '')}</span></a>`).join('')}</div>` : ''}
  ${L.cache ? '<small class="aide">Résultat en cache · aucune recherche consommée</small>' : ''}</div>`;
}
function vWishlist() {
  const l = [...wishlist].sort((a, b) => PRIORITES.indexOf(b.priorite) - PRIORITES.indexOf(a.priorite) || String(b.date || '').localeCompare(String(a.date || '')));
  return `<section class="sec page-head">${tete('Recherches', 'Wishlist', bouton('Nouveau souhait', 'plus', 'dark', 'data-act="wform"'))}<p class="aide">${wishlist.length} souhait${wishlist.length > 1 ? 's' : ''} · liens directs vers Vinted, Leboncoin et eBay</p></section>
  <section class="sec">${l.length ? `<div class="grid">${l.map(carteWish).join('')}</div>` : vide('Notez ici les maillots que vous recherchez : l\'application vous donnera les liens et les prix du moment.', bouton('Ajouter un souhait', 'plus', 'dark', 'data-act="wform"'), 'wish')}</section>
  <section class="sec">${tete('Idées', 'Suggestions à ajouter', `<button class="lien" data-act="aller" data-vue="idees">Voir tout ${I('next')}</button>`)}<div class="grid3">${suggestionsAffichees(3).map(carteSuggestion).join('')}</div></section>`;
}
function vWishFiche() {
  const w = trouverW(etat.id); if (!w) return `<section class="sec">${vide('Souhait introuvable.')}</section>`;
  const q = encodeURIComponent(['maillot', w.equipe, w.saison, w.type && w.type !== 'Domicile' ? w.type : ''].filter(Boolean).join(' '));
  const p = etat.prix && etat.prix.pour === w.id ? etat.prix : null; const photos = (w.photos || []).map(id => PHOTOS[id]).filter(Boolean);
  return `<section class="sec"><button class="retour" data-act="retour">${I('back')} Wishlist</button>
  <div class="fiche"><div class="fiche-media"><div class="carrousel">${photos.length ? photos.map(ph => `<div class="diapo"><img src="${ph}" alt=""></div>`).join('') : `<div class="diapo"><div class="media">${media(w, 1200)}</div></div>`}</div></div>
  <div class="fiche-info"><div class="eyebrow">Souhait · priorité ${esc(w.priorite || 'Normale')}</div><h1>${esc(w.equipe)}</h1><p class="aide">${esc([w.saison, w.type].filter(Boolean).join(' · '))}${w.budget ? ` · budget ${euros(w.budget)}` : ''}</p>
    ${w.notes ? `<p class="notes">${esc(w.notes)}</p>` : ''}
    <div class="liens"><a class="btn ghost" href="https://www.vinted.fr/catalog?search_text=${q}" target="_blank" rel="noopener">Vinted ${I('ext')}</a><a class="btn ghost" href="https://www.leboncoin.fr/recherche?text=${q}" target="_blank" rel="noopener">Leboncoin ${I('ext')}</a><a class="btn ghost" href="https://www.ebay.fr/sch/i.html?_nkw=${q}" target="_blank" rel="noopener">eBay ${I('ext')}</a></div>
    <div class="actions">${bouton('Prix du moment', 'euro', 'dark', `data-act="prix" data-id="${w.id}" data-wish="1"`)}${bouton('Je l\'ai trouvé', 'check', 'gold', `data-act="w-trouve" data-id="${w.id}"`)}</div>
    ${p ? panneauPrix(p, w) : ''}
    <div class="actions">${bouton('Modifier', 'edit', 'ghost', `data-act="wform" data-id="${w.id}"`)}<button class="lien danger" data-act="w-supprimer" data-id="${w.id}">${I('trash')} Retirer</button></div></div></div></section>`;
}
function vWishForm() {
  const b = etat.wbrouillon || {}; const photos = (b.photos || []).map(id => PHOTOS[id]).filter(Boolean);
  return `<section class="sec"><button class="retour" data-act="retour">${I('back')} Annuler</button>
  <div class="form"><div class="form-side"><div class="eyebrow">${etat.weditId ? 'Modification' : 'Nouveau souhait'}</div><h1>${etat.weditId ? 'Modifier le souhait' : 'Ajouter à la wishlist'}</h1>
    <div class="photos-form">${photos.map((ph, i) => `<div class="mini-photo"><img src="${ph}" alt=""><button class="icon-btn" data-act="wbrouillon-photo-del" data-idx="${i}">${I('x')}</button></div>`).join('')}${photos.length < 2 ? `<button class="ajout-photo" data-act="photo-add" data-cible="wform">${I('image')}<span>Image (facultatif)</span></button>` : ''}</div></div>
  <div class="form-main"><label>Équipe<input id="w-equipe" list="liste-equipes" value="${esc(b.equipe || '')}" placeholder="Pays-Bas, Fiorentina…" autocomplete="off"></label>
    <div class="deux"><label>Saison<input id="w-saison" value="${esc(b.saison || '')}" placeholder="1988"></label><label>Type${selectHTML('w-type', TYPES, b.type || 'Domicile')}</label></div>
    <div class="deux"><label>Budget max (€)<input id="w-budget" type="number" inputmode="decimal" value="${esc(b.budget || '')}"></label><label>Priorité${selectHTML('w-priorite', PRIORITES, b.priorite || 'Normale')}</label></div>
    <label>Notes<textarea id="w-notes" rows="3" placeholder="Taille recherchée, flocage souhaité…">${esc(b.notes || '')}</textarea></label>
    ${bouton('Enregistrer', 'save', 'dark bloc', 'data-act="w-enregistrer"')}</div></div>${datalists()}</section>`;
}
function vIdees() { return `<section class="sec"><button class="retour" data-act="retour">${I('back')} Accueil</button>${tete('Pour vous', 'Toutes les suggestions', bouton('Mélanger', 'refresh', 'ghost', 'data-act="seed"'))}<p class="aide">Calculées localement à partir de votre collection : jeux à compléter, sélections liées à vos clubs, voisins de championnat et grands classiques. Aucune donnée n'est transmise.</p><div class="grid3">${suggestionsAffichees(60).map(carteSuggestion).join('')}</div></section>`; }
function vParametres() {
  const q = quota(); const t = etat.test;
  return `<section class="sec page-head">${tete('Compte', 'Paramètres')}</section><section class="sec"><div class="form">
  <div class="form-main"><div class="encart"><h3>Profil</h3><label>Prénom (affiché sur l'accueil)<input id="p-prenom" value="${esc(params.prenom || '')}"></label></div>
  <div class="encart"><h3>Relais Cloudflare</h3><label>Adresse du relais<input id="p-relais" value="${esc(params.relais || '')}" placeholder="https://maillots-relais.xxx.workers.dev"></label><label>Code secret<input id="p-code" type="password" value="${esc(params.code || '')}"></label>
    <div class="actions">${bouton('Enregistrer', 'save', 'dark', 'data-act="p-enregistrer"')}${bouton('Tester la connexion', 'zap', 'ghost', 'data-act="tester"')}</div>
    ${t ? `<div class="panneau ${t.erreur ? 'erreur' : ''}">${t.erreur ? I('alert') + ' ' + esc(t.erreur) : `${I('check')} Relais v${esc(t.version || '?')} joignable · SerpApi ${t.serpapi ? 'OK' : 'absent'} · Lens ${t.lens ? 'OK' : 'absent'} · eBay ${t.ebay ? 'OK' : 'facultatif'}${t.details ? '<br><small>' + esc(typeof t.details === 'string' ? t.details : JSON.stringify(t.details)) + '</small>' : ''}`}</div>` : ''}</div>
  <div class="encart"><h3>Recherches SerpApi ce mois-ci</h3><div class="jauge"><div style="width:${Math.min(100, q.utilise / QUOTA_MAX * 100)}%"></div></div><p class="aide">${q.utilise} / ${QUOTA_MAX} utilisées (compteur local, approximatif). <button class="lien" data-act="quota-reset">Remettre à zéro</button></p></div></div>
  <div class="form-side"><div class="encart"><h3>Sauvegarde</h3><p class="aide">Vos données sont stockées uniquement sur cet appareil. Exportez-les régulièrement ; le fichier contient les photos et la wishlist.${params.dernierExport ? `<br>Dernier export : ${new Date(params.dernierExport).toLocaleDateString('fr-FR')}` : ''}</p><div class="actions">${bouton('Exporter', 'download', 'ghost', 'data-act="export"')}${bouton('Importer', 'upload', 'ghost', 'data-act="import"')}</div></div>
  <div class="encart"><h3>Zone sensible</h3><button class="lien danger" data-act="effacer">${I('trash')} Tout effacer sur cet appareil</button></div>
  <p class="version">Mes Maillots · v${VERSION} · ${EQUIPES.length} équipes référencées · photographies Unsplash</p></div></div></section>`;
}

/* ---------- Rendu ---------- */
function render() {
  const app = document.getElementById('mm-app'); if (!app) return;
  const vues = { accueil: vAccueil, collection: vCollection, fiche: vFiche, formulaire: vFormulaire, wishlist: vWishlist, wishfiche: vWishFiche, wishform: vWishForm, idees: vIdees, parametres: vParametres };
  app.innerHTML = enTete() + `<main class="wrap">${(vues[etat.vue] || vAccueil)()}</main>`;
}
function lireBrouillon() {
  const g = id => { const el = document.getElementById(id); return el ? (el.type === 'checkbox' ? el.checked : el.value.trim()) : undefined; };
  if (document.getElementById('f-equipe')) { const b = etat.brouillon || {}; Object.assign(b, { equipe: g('f-equipe'), categorie: g('f-categorie'), pays: g('f-pays'), saison: g('f-saison'), type: g('f-type'), version: g('f-version'), marque: g('f-marque'), taille: g('f-taille'), etat: g('f-etat'), prix: g('f-prix'), valeur: g('f-valeur'), notes: g('f-notes'), favori: g('f-favori') }); etat.brouillon = b; }
  if (document.getElementById('w-equipe')) { const b = etat.wbrouillon || {}; Object.assign(b, { equipe: g('w-equipe'), saison: g('w-saison'), type: g('w-type'), budget: g('w-budget'), priorite: g('w-priorite'), notes: g('w-notes') }); etat.wbrouillon = b; }
}
function ouvrirFormulaire(id, prefill, wishId) {
  etat.editId = id || null; etat.wishId = wishId || null; etat.lens = null; etat.lensChargement = false;
  const src = id ? trouverM(id) : null;
  etat.brouillon = src ? JSON.parse(JSON.stringify(src)) : Object.assign({ photos: [], type: 'Domicile', categorie: 'club', version: 'Replica' }, prefill || {});
  if (!etat.brouillon.photos) etat.brouillon.photos = []; aller('formulaire');
}
function ouvrirWishForm(id, prefill) {
  etat.weditId = id || null; const src = id ? trouverW(id) : null;
  etat.wbrouillon = src ? JSON.parse(JSON.stringify(src)) : Object.assign({ photos: [], type: 'Domicile', priorite: 'Normale' }, prefill || {});
  if (!etat.wbrouillon.photos) etat.wbrouillon.photos = []; aller('wishform');
}
function retour() {
  const v = etat.vue;
  if (v === 'fiche' || v === 'idees') return aller(v === 'fiche' ? 'collection' : 'accueil');
  if (v === 'formulaire') return etat.editId ? aller('fiche', etat.editId) : aller(etat.wishId ? 'wishlist' : 'collection');
  if (v === 'wishfiche' || v === 'wishform') return (v === 'wishform' && etat.weditId) ? aller('wishfiche', etat.weditId) : aller('wishlist');
  aller('accueil');
}
function ajouterWish(d, silencieux) {
  const w = { id: uid(), equipe: d.equipe, categorie: d.categorie || (trouverEquipe(d.equipe) || {}).categorie || 'club', saison: d.saison || '', type: d.type || 'Domicile', budget: '', priorite: 'Normale', notes: '', photos: [], date: new Date().toISOString() };
  if (dansWishlist(w)) { if (!silencieux) toast('Déjà dans votre wishlist.'); return; }
  wishlist.push(w); save(K.wish, wishlist); toast(`${w.equipe} ajouté à la wishlist`); render();
}

/* ---------- Actions ---------- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, id = el.dataset.id, d = el.dataset;
  if (['fav', 'w-toggle', 'w-ajouter', 'photo-del', 'form-prerempli'].includes(a) || (a === 'aller' && d.prefill)) e.stopPropagation();
  switch (a) {
    case 'nav': { if (d.vue === 'formulaire') return ouvrirFormulaire(null); if (d.vue === 'collection') { etat.filtre = 'tous'; etat.recherche = ''; } return aller(d.vue); }
    case 'aller': {
      if (d.reset) { etat.filtre = 'tous'; etat.recherche = ''; etat.tri = 'recent'; }
      if (d.filtre) etat.filtre = d.filtre; if (d.recherche != null) etat.recherche = d.recherche; if (d.tri) etat.tri = d.tri;
      if (d.vue === 'formulaire') return ouvrirFormulaire(null);
      if (d.vue === 'wishform') return ouvrirWishForm(null, d.prefill ? { equipe: d.equipe, categorie: d.categorie, saison: d.saison, type: d.type } : null);
      return aller(d.vue, id);
    }
    case 'retour': return retour();
    case 'notifs': { if (etat.notifs) marquerLues(); etat.notifs = !etat.notifs; render(); return; }
    case 'notifs-lu': { marquerLues(); etat.notifs = false; render(); return; }
    case 'seed': { etat.seed++; render(); return; }
    case 'fav': { const m = trouverM(id); if (m) { m.favori = !m.favori; save(K.col, collection); el.classList.toggle('on', m.favori); el.classList.add('pop'); if (etat.vue !== 'collection') setTimeout(render, 350); } return; }
    case 'w-toggle': { const s = { equipe: d.equipe, categorie: d.categorie, saison: d.saison, type: d.type }; const ex = dansWishlist(s); if (ex) { wishlist = wishlist.filter(w => w.id !== ex.id); save(K.wish, wishlist); el.classList.remove('on'); toast('Retiré de la wishlist'); } else { el.classList.add('on', 'pop'); ajouterWish(s); } return; }
    case 'filtre': { etat.filtre = d.filtre; render(); return; }
    case 'editer': return ouvrirFormulaire(id);
    case 'form-prerempli': return ouvrirFormulaire(null, { equipe: d.equipe, categorie: d.categorie, saison: d.saison, type: d.type });
    case 'photo-add': { lireBrouillon(); etat.photoCible = d.cible; const f = document.getElementById('mm-file'); f.accept = 'image/*'; f.click(); return; }
    case 'photo-del': { const m = trouverM(id); if (!m || !confirm('Supprimer cette photo ?')) return; const pid = m.photos.splice(Number(d.idx), 1)[0]; await supprimerPhoto(pid); save(K.col, collection); render(); return; }
    case 'brouillon-photo-del': { lireBrouillon(); const pid = etat.brouillon.photos.splice(Number(d.idx), 1)[0]; if (!etat.editId || !(trouverM(etat.editId) || { photos: [] }).photos.includes(pid)) await supprimerPhoto(pid); render(); return; }
    case 'wbrouillon-photo-del': { lireBrouillon(); const pid = etat.wbrouillon.photos.splice(Number(d.idx), 1)[0]; await supprimerPhoto(pid); render(); return; }
    case 'lens': return identifier();
    case 'choisir-piste': { lireBrouillon(); appliquerEquipe(d.nom); render(); return; }
    case 'enregistrer': return enregistrer();
    case 'supprimer': { const m = trouverM(id); if (!m || !confirm(`Supprimer « ${m.equipe} » de votre collection ?`)) return; for (const pid of m.photos || []) await supprimerPhoto(pid); collection = collection.filter(x => x.id !== id); save(K.col, collection); toast('Maillot supprimé'); aller('collection'); return; }
    case 'prix': {
      const cible = d.wish ? trouverW(id) : trouverM(id); if (!cible) return;
      etat.prix = { pour: id, chargement: true }; render();
      try { const q = ['maillot', cible.equipe, cible.saison, cible.type && cible.type !== 'Domicile' ? cible.type : ''].filter(Boolean).join(' '); const r = await estimerPrix(q); etat.prix = { pour: id, resultat: r }; if (r.estimation) { cible.dernierPrix = r.estimation; save(d.wish ? K.wish : K.col, d.wish ? wishlist : collection); } }
      catch (err) { etat.prix = { pour: id, erreur: err.message }; }
      render(); return;
    }
    case 'valeur-set': { const m = trouverM(id); if (m) { m.valeur = Number(d.valeur); save(K.col, collection); toast('Valeur enregistrée'); render(); } return; }
    case 'wform': return ouvrirWishForm(id);
    case 'w-ajouter': return ajouterWish({ equipe: d.equipe, categorie: d.categorie, saison: d.saison, type: d.type });
    case 'w-enregistrer': return enregistrerWish();
    case 'w-supprimer': { const w = trouverW(id); if (!w || !confirm(`Retirer « ${w.equipe} » de la wishlist ?`)) return; for (const pid of w.photos || []) await supprimerPhoto(pid); wishlist = wishlist.filter(x => x.id !== id); save(K.wish, wishlist); aller('wishlist'); return; }
    case 'w-trouve': { const w = trouverW(id); if (!w) return; return ouvrirFormulaire(null, { equipe: w.equipe, categorie: w.categorie, saison: w.saison, type: w.type, notes: w.notes, favori: w.priorite === 'Rêve absolu' }, w.id); }
    case 'p-enregistrer': case 'tester': {
      params.prenom = document.getElementById('p-prenom').value.trim(); params.relais = document.getElementById('p-relais').value.trim(); params.code = document.getElementById('p-code').value.trim(); save(K.par, params);
      if (a === 'p-enregistrer') return toast('Paramètres enregistrés');
      etat.test = { version: '…' }; render();
      try { etat.test = await relais({ action: 'test' }); } catch (err) { etat.test = { erreur: err.message }; }
      render(); return;
    }
    case 'quota-reset': { save(K.quota, { mois: new Date().toISOString().slice(0, 7), utilise: 0 }); render(); return; }
    case 'export': {
      const photos = {}; [...collection, ...wishlist].forEach(m => (m.photos || []).forEach(p => { if (PHOTOS[p]) photos[p] = PHOTOS[p]; }));
      const blob = new Blob([JSON.stringify({ version: VERSION, date: new Date().toISOString(), collection, wishlist, photos })], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const lien = document.createElement('a'); lien.href = url; lien.download = `mes-maillots-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(lien); lien.click(); lien.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
      params.dernierExport = new Date().toISOString(); save(K.par, params); toast('Fichier de sauvegarde téléchargé'); render(); return;
    }
    case 'import': { etat.photoCible = 'import'; const f = document.getElementById('mm-file'); f.accept = '.json,application/json'; f.click(); return; }
    case 'effacer': {
      if (!confirm('Tout effacer ? Collection, wishlist et photos seront supprimées de cet appareil.') || !confirm('Confirmer ? Cette action est définitive.')) return;
      for (const m of [...collection, ...wishlist]) for (const pid of m.photos || []) await supprimerPhoto(pid);
      collection = []; wishlist = []; save(K.col, collection); save(K.wish, wishlist); toast('Toutes les données ont été effacées'); aller('accueil'); return;
    }
  }
});
document.addEventListener('input', e => { if (e.target.id === 'c-recherche') { etat.recherche = e.target.value; const g = document.getElementById('grille'); if (g) g.innerHTML = grilleHTML(); } });
document.addEventListener('change', async e => {
  if (e.target.id === 'c-tri') { etat.tri = e.target.value; const g = document.getElementById('grille'); if (g) g.innerHTML = grilleHTML(); return; }
  if (e.target.id === 'f-equipe') { const eq = trouverEquipe(e.target.value); if (eq) { const c = document.getElementById('f-categorie'), p = document.getElementById('f-pays'); if (c) c.value = eq.categorie; if (p && !p.value) p.value = eq.pays; } return; }
  if (e.target.id === 'mm-file') {
    const file = e.target.files[0]; const cible = etat.photoCible; e.target.value = ''; if (!file) return;
    if (cible === 'import') return importer(file);
    let dataUrl; try { dataUrl = await compresser(file); } catch (err) { return toast('Impossible de lire cette image.'); }
    const pid = await stockerPhoto(dataUrl);
    if (cible === 'form') { lireBrouillon(); etat.brouillon.photos.push(pid); etat.lens = null; render(); }
    else if (cible === 'wform') { lireBrouillon(); etat.wbrouillon.photos.push(pid); render(); }
    else if (cible && cible.startsWith('fiche:')) { const m = trouverM(cible.slice(6)); if (m) { m.photos.push(pid); save(K.col, collection); toast('Photo ajoutée'); render(); } }
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && etat.notifs) { marquerLues(); etat.notifs = false; render(); } });
function appliquerEquipe(nom) { const b = etat.brouillon; const eq = trouverEquipe(nom); b.equipe = eq ? eq.nom : nom; if (eq) { b.categorie = eq.categorie; b.pays = eq.pays; } }
async function identifier() {
  lireBrouillon(); const b = etat.brouillon; const image = PHOTOS[b.photos[0]]; if (!image) return toast('Ajoutez d\'abord une photo.');
  etat.lensChargement = true; etat.lens = null; render();
  try {
    const dd = await relais({ action: 'lens', image });
    const matches = dd.visual_matches || dd.matches || dd.resultats || dd.correspondances || (dd.lens && dd.lens.visual_matches) || [];
    const an = analyserLens(matches);
    an.images = matches.map(it => ({ src: it.thumbnail || it.image || it.vignette || '', lien: it.link || it.lien || '', titre: it.title || it.titre || '' })).filter(i => i.src); an.cache = !!dd.cache; etat.lens = an;
    if (an.pistes[0]) { appliquerEquipe(an.pistes[0].nom); if (an.saison && !b.saison) b.saison = an.saison; if (an.type) b.type = an.type; if (an.marque && !b.marque) b.marque = an.marque; if (an.version) b.version = an.version; toast(`Identifié : ${an.pistes[0].nom}${an.pistes[0].n < 3 ? ' (indice faible, à vérifier)' : ''}`); }
    else if (!matches.length) etat.lens.erreur = 'Google Lens n\'a renvoyé aucun résultat pour cette photo.';
  } catch (err) { etat.lens = { erreur: err.message, pistes: [] }; }
  etat.lensChargement = false; render();
}
function enregistrer() {
  lireBrouillon(); const b = etat.brouillon; if (!b.equipe) return toast('Indiquez au moins l\'équipe.');
  const eq = trouverEquipe(b.equipe); if (eq) { b.equipe = eq.nom; if (!b.pays) b.pays = eq.pays; b.categorie = eq.categorie; }
  b.prix = b.prix ? Number(b.prix) : ''; b.valeur = b.valeur ? Number(b.valeur) : '';
  if (etat.editId) { const i = collection.findIndex(m => m.id === etat.editId); if (i >= 0) collection[i] = Object.assign({}, collection[i], b); } else { b.id = uid(); b.date = new Date().toISOString(); collection.push(b); }
  if (etat.wishId) { wishlist = wishlist.filter(w => w.id !== etat.wishId); save(K.wish, wishlist); toast('Souhait réalisé et ajouté à votre collection'); } else toast(etat.editId ? 'Modifications enregistrées' : 'Maillot ajouté à la collection');
  save(K.col, collection); const id = etat.editId || b.id; etat.editId = null; etat.wishId = null; etat.brouillon = null; etat.lens = null; aller('fiche', id);
}
function enregistrerWish() {
  lireBrouillon(); const b = etat.wbrouillon; if (!b.equipe) return toast('Indiquez au moins l\'équipe.');
  const eq = trouverEquipe(b.equipe); if (eq) { b.equipe = eq.nom; b.categorie = eq.categorie; } else if (!b.categorie) b.categorie = 'club';
  b.budget = b.budget ? Number(b.budget) : '';
  if (etat.weditId) { const i = wishlist.findIndex(w => w.id === etat.weditId); if (i >= 0) wishlist[i] = Object.assign({}, wishlist[i], b); } else { b.id = uid(); b.date = new Date().toISOString(); wishlist.push(b); }
  save(K.wish, wishlist); const id = etat.weditId || b.id; etat.weditId = null; etat.wbrouillon = null; toast('Souhait enregistré'); aller('wishfiche', id);
}
function importer(file) {
  const fr = new FileReader();
  fr.onload = async () => {
    try {
      const d = JSON.parse(fr.result); const col = Array.isArray(d) ? d : (d.collection || d.maillots || []); const wl = d.wishlist || [];
      if (!Array.isArray(col)) throw new Error('format');
      if (!confirm(`Importer ${col.length} maillot(s) et ${wl.length} souhait(s) ? Ils seront ajoutés à la collection actuelle.`)) return;
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
  ['style-v20', 'style-v21', 'style-v30'].forEach(id => { const s = document.getElementById(id); if (s) s.remove(); });
  if (!document.getElementById('mm-fonts')) { const l = document.createElement('link'); l.id = 'mm-fonts'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap'; document.head.appendChild(l); }
  const st = document.createElement('style'); st.id = 'style-v30';
  st.textContent = `
:root{--vert:#143d2f;--vert2:#1f5a44;--or:#c9a227;--fond:#f5f3ee;--carte:#fff;--texte:#14201b;--gris:#6b7280;--ligne:#e6e2d9;--rouge:#e11d48;--serif:'Playfair Display',Georgia,'Times New Roman',serif;--sans:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;--r:18px}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:var(--sans);background:var(--fond);color:var(--texte);-webkit-tap-highlight-color:transparent;line-height:1.45}
button,input,select,textarea{font-family:inherit;font-size:15px;color:inherit}button{cursor:pointer}
h1,h2,h3,.brand-n{font-family:var(--serif);font-weight:500;letter-spacing:-.01em;margin:0}
h1{font-size:clamp(30px,4vw,44px);line-height:1.08}h2{font-size:clamp(24px,3vw,34px);line-height:1.12}h3{font-size:18px}
.ic{width:20px;height:20px;flex:none}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
/* en-tête */
.top{position:sticky;top:0;z-index:40;background:rgba(245,243,238,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--ligne)}
.top-in{display:flex;align-items:center;gap:16px;height:72px}
.brand{background:none;border:0;display:flex;align-items:baseline;gap:12px;padding:0;color:var(--texte)}
.brand-n{font-size:26px}.brand-s{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--gris)}
.topnav{margin-left:auto;display:flex;gap:4px}
.topnav button{background:none;border:0;border-radius:999px;padding:10px 20px;font-size:16px;color:#3b4540}.topnav button.on{background:#ebe7df;color:var(--texte)}
.top-r{display:flex;align-items:center;gap:10px}
.bell{position:relative;width:44px;height:44px;border:0;background:none;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--texte);transition:background .2s}
.bell .ic{width:22px;height:22px;transition:fill .2s}.bell.on{background:#ebe7df}.bell.on .ic{fill:#111;stroke:#111}
.bell .dot{position:absolute;top:9px;right:10px;width:8px;height:8px;border-radius:50%;background:var(--rouge);border:2px solid var(--fond)}
.notifs{border-top:1px solid var(--ligne);background:var(--fond)}.notifs-box{max-width:520px;margin-left:auto;padding:14px 0 18px}
.notifs-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.notifs ul{list-style:none;margin:0;padding:0;background:var(--carte);border:1px solid var(--ligne);border-radius:var(--r);overflow:hidden}
.notifs li{padding:12px 16px;border-top:1px solid var(--ligne);cursor:pointer;display:flex;flex-direction:column;gap:2px;font-size:14px}.notifs li:first-child{border-top:0}.notifs li span{color:var(--gris)}
.notifs li.nouveau{background:#fbfaf6}.notifs li.nouveau b::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--or);margin-right:8px;vertical-align:middle}
#mm-nav{display:none}
/* boutons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;padding:12px 22px;font-size:15px;font-weight:500;border:1px solid transparent;text-decoration:none;transition:transform .12s,background .2s}
.btn:active{transform:scale(.98)}.btn.dark{background:var(--vert);color:#fff}.btn.dark:hover{background:var(--vert2)}
.btn.ghost{background:var(--carte);border-color:#d6d1c6;color:var(--texte)}.btn.ghost:hover{border-color:var(--texte)}
.btn.gold{background:var(--or);color:#fff}.btn.sm{padding:9px 14px;font-size:13px}.btn.bloc{width:100%;margin-top:14px}.btn:disabled{opacity:.6}
.lien{background:none;border:0;color:var(--vert2);font-weight:500;padding:6px 0;display:inline-flex;align-items:center;gap:6px}.lien .ic{width:16px;height:16px}.lien.danger{color:#b91c1c;margin-top:24px}
.icon-btn{width:34px;height:34px;border-radius:50%;border:0;background:rgba(20,32,27,.55);color:#fff;display:flex;align-items:center;justify-content:center}.icon-btn .ic{width:16px;height:16px}
.retour{background:none;border:0;color:var(--gris);display:inline-flex;align-items:center;gap:4px;padding:18px 0 6px;font-size:14px}.retour .ic{width:18px;height:18px}
/* héros */
.hero{position:relative;margin:24px 0 8px;border-radius:28px;overflow:hidden;background:radial-gradient(120% 140% at 0% 0%,#2c6a4f 0%,#1a4a38 38%,#0f2e23 100%);color:#fff;min-height:360px;display:flex;align-items:center}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.28;mix-blend-mode:luminosity;mask-image:linear-gradient(90deg,transparent 20%,#000 70%);-webkit-mask-image:linear-gradient(90deg,transparent 20%,#000 70%)}
.hero-in{position:relative;padding:48px 44px;max-width:760px}
.hero h1{margin:14px 0 20px}.hero p{font-size:17px;line-height:1.6;color:rgba(255,255,255,.85);margin:0 0 26px;max-width:620px}
.eyebrow{font-size:12px;letter-spacing:.26em;text-transform:uppercase;color:var(--gris);font-weight:500}.eyebrow.light{color:rgba(255,255,255,.72)}
.stats{display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:16px;color:rgba(255,255,255,.92)}.stats i{width:6px;height:6px;border-radius:50%;background:var(--or)}
/* sections */
.sec{padding:30px 0 6px}.page-head{padding-top:28px}.page-head .aide{margin-top:6px}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:22px}.sec-head h2{margin-top:6px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:20px}
.row{display:flex;gap:20px;overflow-x:auto;padding:4px 2px 18px;scroll-snap-type:x mandatory;scrollbar-width:none}.row::-webkit-scrollbar{display:none}.row .card{width:250px;flex:none;scroll-snap-align:start}
/* cartes */
.card{background:var(--carte);border-radius:22px;overflow:hidden;border:1px solid var(--ligne);box-shadow:0 1px 2px rgba(0,0,0,.04);position:relative;cursor:pointer;transition:transform .2s,box-shadow .2s}
.card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(20,32,27,.12)}.card.sugg{cursor:default}.card.sugg:hover{transform:none}
.media{position:relative;aspect-ratio:1/1;overflow:hidden;background:#1c2b24}.card.sugg .media{aspect-ratio:4/3.2}
.media-bg{position:absolute;inset:0}.media-jersey{position:absolute;inset:18%;opacity:.95;filter:drop-shadow(0 8px 14px rgba(0,0,0,.35))}
.media-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s}.card:hover .media-img{transform:scale(1.04)}
.media::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,0) 35%,rgba(10,25,18,.78) 100%)}
.media-txt{position:absolute;left:0;right:0;bottom:0;padding:18px 20px;color:#fff;z-index:2}.media-txt h3{font-size:24px;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.media-txt .meta{font-size:14px;color:rgba(255,255,255,.85);margin-top:4px}
.pastille{position:absolute;top:14px;left:14px;z-index:3;width:44px;height:44px;border-radius:50%;background:rgba(20,32,27,.55);backdrop-filter:blur(4px);color:#fff;font-family:var(--serif);font-size:18px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.25);overflow:hidden}
.pastille.drapeau img{width:100%;height:100%;object-fit:cover}
.tag{position:absolute;top:18px;right:14px;z-index:3;background:rgba(255,255,255,.92);color:var(--texte);font-size:12px;padding:5px 12px;border-radius:999px;font-weight:500}
.heart{position:absolute;top:14px;right:14px;z-index:3;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(20,32,27,.5);backdrop-filter:blur(4px);color:#fff;display:flex;align-items:center;justify-content:center;transition:background .2s}
.heart .ic{width:20px;height:20px;transition:fill .2s,stroke .2s,transform .2s}.heart.on{background:rgba(255,255,255,.95);border-color:#fff}.heart.on .ic{fill:var(--rouge);stroke:var(--rouge)}
.heart.pop .ic{animation:pop .35s ease}@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
.fiche-titre .heart{position:static;background:var(--carte);border-color:#d6d1c6;color:var(--texte);flex:none}.fiche-titre .heart.on{border-color:var(--rouge)}
.card-body{padding:18px 20px 20px}.quote{font-style:italic;color:#3b4540;font-size:15px;line-height:1.55;margin:0 0 16px;min-height:46px}
.card-actions{display:flex;gap:8px;flex-wrap:wrap}.card-actions .btn{flex:1}
.card-foot{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;font-size:13px;color:var(--gris)}.card-foot b{color:var(--vert2);font-weight:600;font-size:14px}
/* outils collection */
.toolbar{display:flex;gap:12px;margin-bottom:14px}.search{flex:1;display:flex;align-items:center;gap:10px;background:var(--carte);border:1px solid var(--ligne);border-radius:999px;padding:0 18px;color:var(--gris);margin:0}
.search input{border:0;background:none;padding:14px 0;width:100%;outline:none;margin:0}.toolbar select{width:170px;border-radius:999px;padding:0 18px}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:18px;scrollbar-width:none}.chips::-webkit-scrollbar{display:none}
.chip{flex:none;background:var(--carte);border:1px solid var(--ligne);border-radius:999px;padding:9px 16px;font-size:14px;display:inline-flex;align-items:center;gap:6px}.chip.on{background:var(--texte);color:#fff;border-color:var(--texte)}.chip small{color:var(--gris)}.chip .ic{width:15px;height:15px}
/* formulaires */
input,select,textarea{width:100%;padding:13px 16px;border:1px solid #d6d1c6;border-radius:14px;background:var(--carte);outline:none}input:focus,select:focus,textarea:focus{border-color:var(--vert)}
label{display:block;font-size:13px;color:var(--gris);margin:14px 0 0;font-weight:500}label input,label select,label textarea{margin-top:6px;font-weight:400}
.deux{display:grid;grid-template-columns:1fr 1fr;gap:14px}.case{display:flex;align-items:center;gap:10px;font-size:15px;color:var(--texte);margin:18px 0 4px}.case input{width:20px;height:20px;margin:0}
.form{display:grid;grid-template-columns:1fr 1.4fr;gap:40px;align-items:start}.form-side h1{margin:6px 0 18px}
.photos-form{display:flex;gap:12px;flex-wrap:wrap;margin:6px 0 10px}
.mini-photo{position:relative;width:110px;height:110px;border-radius:16px;overflow:hidden}.mini-photo img{width:100%;height:100%;object-fit:cover}.mini-photo .icon-btn{position:absolute;top:6px;right:6px;width:28px;height:28px}
.ajout-photo{width:110px;height:110px;border:1.5px dashed #b8b1a3;background:var(--carte);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--vert);font-size:12px}.ajout-photo .ic{width:24px;height:24px}
.aide{color:var(--gris);font-size:14px;margin:8px 0}
.encart{background:var(--carte);border:1px solid var(--ligne);border-radius:var(--r);padding:20px 22px;margin:18px 0}.encart h3{display:flex;align-items:center;gap:8px;margin-bottom:6px}.encart .chips{padding-bottom:0;margin-top:12px}
.panneau{background:var(--carte);border:1px solid var(--ligne);border-radius:var(--r);padding:18px 20px;margin:16px 0}.panneau.erreur{background:#fef2f2;border-color:#fecaca;color:#991b1b;display:flex;gap:10px;align-items:flex-start}
.estim b{font-family:var(--serif);font-size:34px;display:block;color:var(--vert);line-height:1.1}.estim span{color:var(--gris);font-size:14px}.estim small{display:block;color:var(--gris);margin-top:6px;font-size:12px}
.annonces{list-style:none;padding:0;margin:14px 0 0}.annonces li{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;padding:10px 0;border-top:1px solid var(--ligne);font-size:14px}
.annonces li a,.annonces li>span{flex:1;min-width:60%;color:var(--texte);text-decoration:none}.annonces li b{color:var(--vert2);font-weight:600}.annonces li b small{font-weight:500;color:var(--or);margin-left:6px}
.annonces .src{display:inline-block;background:#efece5;border-radius:6px;padding:1px 7px;font-size:11px;margin-right:8px;color:var(--gris)}.annonces li.suspect{opacity:.55}.annonces li em{width:100%;font-size:12px;color:#b45309;font-style:normal}
.spin{display:inline-block;width:18px;height:18px;border:2px solid #d6d1c6;border-top-color:var(--vert);border-radius:50%;animation:spin .8s linear infinite;vertical-align:middle;margin-right:8px}.spin.light{border-color:rgba(255,255,255,.3);border-top-color:#fff}@keyframes spin{to{transform:rotate(360deg)}}
.imgs{display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none}.img-web{flex:none;width:110px;text-decoration:none;color:var(--gris);font-size:11px}.img-web img{width:110px;height:110px;object-fit:cover;border-radius:12px;background:#eee;display:block}.img-web span{display:block;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jauge{height:8px;background:#e9e5dc;border-radius:999px;overflow:hidden;margin:10px 0}.jauge div{height:100%;background:var(--or)}
.version{text-align:center;color:var(--gris);font-size:12px;margin:30px 0 10px}
/* fiche */
.fiche{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;margin-bottom:30px}
.carrousel{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;border-radius:24px;overflow-y:hidden;background:#111}.carrousel::-webkit-scrollbar{display:none}
.diapo{flex:none;width:100%;scroll-snap-align:center;position:relative;aspect-ratio:1/1}.diapo>img{width:100%;height:100%;object-fit:contain}.diapo .media{height:100%}.diapo .media::after{background:linear-gradient(180deg,transparent 60%,rgba(10,25,18,.5))}
.sur-photo{position:absolute;right:14px;bottom:14px;z-index:3}
.fiche-titre{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding-top:4px}.fiche-info h1{margin:8px 0 4px}
.infos{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:22px 0}.infos div{background:var(--carte);border:1px solid var(--ligne);border-radius:14px;padding:12px 14px}.infos dt{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gris)}.infos dd{margin:3px 0 0;font-weight:500}
.notes{background:var(--carte);border:1px solid var(--ligne);border-radius:14px;padding:14px 16px;white-space:pre-wrap}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0;align-items:center}.liens{display:flex;gap:8px;margin:16px 0;flex-wrap:wrap}.liens .btn{flex:1}
/* état vide */
.vide{display:grid;grid-template-columns:1fr 1fr;background:var(--carte);border:1px solid var(--ligne);border-radius:24px;overflow:hidden;min-height:260px}
.vide-img{background:#1c2b24;min-height:200px}.vide-img img{width:100%;height:100%;object-fit:cover;display:block}
.vide-txt{padding:36px;display:flex;flex-direction:column;justify-content:center;gap:16px;color:#3b4540;font-size:16px}.vide-txt p{margin:0}
#mm-toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,20px);background:var(--texte);color:#fff;padding:12px 20px;border-radius:999px;font-size:14px;opacity:0;pointer-events:none;transition:.25s;z-index:99;max-width:90vw;text-align:center}#mm-toast.on{opacity:1;transform:translate(-50%,0)}
/* tablette / téléphone */
@media(max-width:1000px){.grid3{grid-template-columns:repeat(2,1fr)}.fiche,.form{grid-template-columns:1fr;gap:24px}}
@media(max-width:760px){
.wrap{padding:0 16px}.top-in{height:62px}.brand-n{font-size:22px}.brand-s{display:none}.topnav{display:none}.add span{display:none}.add{width:44px;height:44px;padding:0}
.notifs-box{max-width:none}
#mm-nav{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-top:1px solid var(--ligne);justify-content:space-around;align-items:center;padding:6px 6px calc(8px + env(safe-area-inset-bottom))}
#mm-nav button{background:none;border:0;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;color:var(--gris);padding:6px 10px;min-width:60px}#mm-nav button.on{color:var(--vert)}#mm-nav button .ic{width:22px;height:22px}
#mm-nav .nav-add{background:var(--vert);color:#fff;width:52px;height:52px;border-radius:50%;min-width:0;margin-top:-22px;box-shadow:0 8px 20px rgba(20,61,47,.35)}#mm-nav .nav-add .ic{width:24px;height:24px}
main.wrap{padding-bottom:96px}
.hero{margin-top:16px;min-height:0;border-radius:22px}.hero-in{padding:30px 22px}.hero p{font-size:15px}.stats{font-size:14px;gap:10px}
.sec{padding:24px 0 4px}.sec-head{flex-direction:column;align-items:flex-start;gap:10px;margin-bottom:16px}
.grid3{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 14px;scroll-snap-type:x mandatory;scrollbar-width:none}.grid3::-webkit-scrollbar{display:none}.grid3 .card{width:82vw;max-width:340px;flex:none;scroll-snap-align:start}
.grid{grid-template-columns:repeat(2,1fr);gap:12px}.row .card{width:200px}.media-txt{padding:12px 14px}.media-txt h3{font-size:19px}.media-txt .meta{font-size:12px}
.pastille,.heart{width:38px;height:38px;top:10px}.pastille{left:10px}.heart{right:10px}
.toolbar{flex-direction:column}.toolbar select{width:100%;padding:13px 16px}
.vide{grid-template-columns:1fr}.vide-img{min-height:160px}.vide-txt{padding:22px}
.infos{grid-template-columns:1fr 1fr}.deux{grid-template-columns:1fr 1fr}#mm-toast{bottom:92px}}
`;
  document.head.appendChild(st);
}

/* ---------- Démarrage ---------- */
async function demarrer() {
  document.body.innerHTML = '<div id="mm-app"></div><div id="mm-toast"></div><input type="file" id="mm-file" accept="image/*" hidden>';
  injecterStyle();
  document.getElementById('mm-app').innerHTML = '<div class="wrap" style="padding:60px 20px;color:#6b7280"><span class="spin"></span> Chargement…</div>';
  await migrer(); render();
  if ('serviceWorker' in navigator) { try { navigator.serviceWorker.register('sw.js').then(r => r.update && r.update()); } catch (e) { } }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
