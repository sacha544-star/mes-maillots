'use strict';
(function () {
  /* ============================================================
     Mes Maillots · v1.2 · sans IA
     Collection de maillots de foot (appli web installable).
     Identification : Google Lens via le relais Cloudflare (SerpApi)
     + dictionnaires intégrés. Prix : Vinted/Leboncoin (SerpApi) + eBay.
     ============================================================ */

  // =============== 1. CONSTANTES ===============
  const VERSION = '1.2';
  const QUOTA = 250;
  const CLE_COLLECTION = 'mm_collection';
  const CLE_PARAMS = 'mm_params';
  const CLE_QUOTA = 'mm_quota';
  const TYPES = ['Domicile', 'Extérieur', 'Third', 'Gardien', 'Entraînement', 'Autre'];
  const ETATS = ['', 'Neuf avec étiquette', 'Neuf sans étiquette', 'Très bon', 'Bon', 'Usé'];
  const TAILLES = ['', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Enfant'];

  // =============== 2. DICTIONNAIRES ===============
  // Format : [nom affiché, pays, alias séparés par | ]
  const CLUBS_BRUT = [
    // France
    ['Paris Saint-Germain', 'France', 'psg|paris saint germain|paris saint-germain|paris sg|paris-sg'],
    ['Olympique de Marseille', 'France', 'olympique de marseille|marseille|om'],
    ['Olympique Lyonnais', 'France', 'olympique lyonnais|lyon|ol'],
    ['AS Monaco', 'France', 'as monaco|monaco|asm'],
    ['LOSC Lille', 'France', 'losc|lille'],
    ['AS Saint-Étienne', 'France', 'saint etienne|saint-etienne|asse|st etienne'],
    ['Girondins de Bordeaux', 'France', 'girondins|bordeaux'],
    ['FC Nantes', 'France', 'fc nantes|nantes'],
    ['RC Lens', 'France', 'rc lens|racing club de lens'],
    ['Stade Rennais', 'France', 'stade rennais|rennes'],
    ['OGC Nice', 'France', 'ogc nice|ogcn'],
    ['RC Strasbourg', 'France', 'rc strasbourg|strasbourg|racing strasbourg'],
    ['Montpellier HSC', 'France', 'montpellier|mhsc'],
    ['Toulouse FC', 'France', 'toulouse fc|toulouse|tfc'],
    ['Stade de Reims', 'France', 'stade de reims|reims'],
    ['AJ Auxerre', 'France', 'aj auxerre|auxerre|aja'],
    ['FC Metz', 'France', 'fc metz|metz'],
    ['Stade Brestois', 'France', 'stade brestois|brest'],
    ['Le Havre AC', 'France', 'le havre|hac'],
    ['FC Lorient', 'France', 'fc lorient|lorient'],
    // Angleterre
    ['Manchester United', 'Angleterre', 'manchester united|man utd|man united|manchester utd'],
    ['Manchester City', 'Angleterre', 'manchester city|man city'],
    ['Liverpool FC', 'Angleterre', 'liverpool|lfc'],
    ['Chelsea FC', 'Angleterre', 'chelsea'],
    ['Arsenal FC', 'Angleterre', 'arsenal'],
    ['Tottenham Hotspur', 'Angleterre', 'tottenham|spurs'],
    ['Leeds United', 'Angleterre', 'leeds'],
    ['Newcastle United', 'Angleterre', 'newcastle'],
    ['Aston Villa', 'Angleterre', 'aston villa'],
    ['Everton FC', 'Angleterre', 'everton'],
    ['West Ham United', 'Angleterre', 'west ham'],
    ['Leicester City', 'Angleterre', 'leicester'],
    ['Nottingham Forest', 'Angleterre', 'nottingham forest|nottingham'],
    ['Wolverhampton', 'Angleterre', 'wolverhampton|wolves'],
    // Espagne
    ['Real Madrid', 'Espagne', 'real madrid'],
    ['FC Barcelone', 'Espagne', 'fc barcelone|barcelone|barcelona|barca|fcb'],
    ['Atlético de Madrid', 'Espagne', 'atletico madrid|atletico de madrid|atletico|atleti'],
    ['Séville FC', 'Espagne', 'sevilla|seville|sevilla fc'],
    ['Valence CF', 'Espagne', 'valencia cf|valencia|valence cf'],
    ['Athletic Bilbao', 'Espagne', 'athletic bilbao|athletic club|bilbao'],
    ['Real Sociedad', 'Espagne', 'real sociedad'],
    ['Real Betis', 'Espagne', 'real betis|betis'],
    ['Villarreal CF', 'Espagne', 'villarreal'],
    // Italie
    ['Juventus', 'Italie', 'juventus|juve'],
    ['AC Milan', 'Italie', 'ac milan|milan ac|milan'],
    ['Inter Milan', 'Italie', 'inter milan|inter|internazionale|fc internazionale'],
    ['SSC Naples', 'Italie', 'napoli|naples|ssc napoli'],
    ['AS Roma', 'Italie', 'as roma|roma'],
    ['Lazio Rome', 'Italie', 'lazio|ss lazio'],
    ['Fiorentina', 'Italie', 'fiorentina'],
    ['Atalanta', 'Italie', 'atalanta'],
    ['Torino FC', 'Italie', 'torino'],
    ['Parme', 'Italie', 'parma|parme'],
    ['Sampdoria', 'Italie', 'sampdoria'],
    // Allemagne
    ['Bayern Munich', 'Allemagne', 'bayern munich|bayern munchen|bayern|fc bayern'],
    ['Borussia Dortmund', 'Allemagne', 'borussia dortmund|dortmund|bvb'],
    ['Schalke 04', 'Allemagne', 'schalke'],
    ['Bayer Leverkusen', 'Allemagne', 'bayer leverkusen|leverkusen'],
    ['Borussia Mönchengladbach', 'Allemagne', 'monchengladbach|gladbach'],
    ['Eintracht Francfort', 'Allemagne', 'eintracht frankfurt|eintracht|francfort|frankfurt'],
    ['RB Leipzig', 'Allemagne', 'rb leipzig|leipzig'],
    ['Hambourg SV', 'Allemagne', 'hamburger sv|hamburg|hambourg|hsv'],
    ['VfB Stuttgart', 'Allemagne', 'stuttgart'],
    ['Werder Brême', 'Allemagne', 'werder bremen|werder|bremen|breme'],
    // Pays-Bas, Portugal, Belgique, Écosse
    ['Ajax Amsterdam', 'Pays-Bas', 'ajax'],
    ['PSV Eindhoven', 'Pays-Bas', 'psv|eindhoven'],
    ['Feyenoord', 'Pays-Bas', 'feyenoord'],
    ['Benfica', 'Portugal', 'benfica|sl benfica'],
    ['FC Porto', 'Portugal', 'fc porto|porto'],
    ['Sporting CP', 'Portugal', 'sporting cp|sporting lisbonne|sporting clube|sporting'],
    ['RSC Anderlecht', 'Belgique', 'anderlecht'],
    ['Club Bruges', 'Belgique', 'club brugge|bruges|brugge'],
    ['Standard de Liège', 'Belgique', 'standard liege|standard de liege'],
    ['Celtic Glasgow', 'Écosse', 'celtic'],
    ['Rangers FC', 'Écosse', 'rangers|glasgow rangers'],
    // Reste du monde
    ['Galatasaray', 'Turquie', 'galatasaray'],
    ['Fenerbahçe', 'Turquie', 'fenerbahce'],
    ['Beşiktaş', 'Turquie', 'besiktas'],
    ['Olympiakos', 'Grèce', 'olympiakos|olympiacos'],
    ['Zenit Saint-Pétersbourg', 'Russie', 'zenit'],
    ['Shakhtar Donetsk', 'Ukraine', 'shakhtar'],
    ['Boca Juniors', 'Argentine', 'boca juniors|boca'],
    ['River Plate', 'Argentine', 'river plate'],
    ['Flamengo', 'Brésil', 'flamengo'],
    ['Santos FC', 'Brésil', 'santos'],
    ['Palmeiras', 'Brésil', 'palmeiras'],
    ['Corinthians', 'Brésil', 'corinthians'],
    ['Inter Miami', 'États-Unis', 'inter miami'],
    ['LA Galaxy', 'États-Unis', 'la galaxy|los angeles galaxy'],
    ['Al-Nassr', 'Arabie saoudite', 'al nassr|al-nassr'],
    ['Al-Hilal', 'Arabie saoudite', 'al hilal|al-hilal'],
    ['Red Bull Salzbourg', 'Autriche', 'red bull salzburg|salzburg|salzbourg'],
    ['Étoile Rouge de Belgrade', 'Serbie', 'etoile rouge|red star belgrade|crvena zvezda']
  ];

   const SELECTIONS_BRUT = [
    // ---------- EUROPE (UEFA) ----------
    ['Équipe de France', 'France', 'equipe de france|france|fff|les bleus'],
    ['Allemagne', 'Allemagne', 'allemagne|germany|deutschland|dfb|die mannschaft'],
    ['Angleterre', 'Angleterre', 'angleterre|england|three lions'],
    ['Espagne', 'Espagne', 'espagne|espana|spain|la roja|rfef'],
    ['Italie', 'Italie', 'italie|italia|italy|azzurri|figc'],
    ['Portugal', 'Portugal', 'portugal|selecao das quinas|fpf'],
    ['Pays-Bas', 'Pays-Bas', 'pays bas|pays-bas|netherlands|holland|hollande|nederland|holanda|oranje|knvb'],
    ['Belgique', 'Belgique', 'belgique|belgium|belgie|diables rouges|red devils'],
    ['Croatie', 'Croatie', 'croatie|croatia|hrvatska'],
    ['Suisse', 'Suisse', 'suisse|switzerland|schweiz|svizzera'],
    ['Autriche', 'Autriche', 'autriche|austria|osterreich'],
    ['Danemark', 'Danemark', 'danemark|denmark|danmark'],
    ['Suède', 'Suède', 'suede|sweden|sverige'],
    ['Norvège', 'Norvège', 'norvege|norway|norge'],
    ['Finlande', 'Finlande', 'finlande|finland|suomi'],
    ['Islande', 'Islande', 'islande|iceland|island'],
    ['Îles Féroé', 'Îles Féroé', 'iles feroe|feroe|faroe islands|faroe'],
    ['Écosse', 'Écosse', 'ecosse|scotland'],
    ['Pays de Galles', 'Pays de Galles', 'pays de galles|wales|cymru'],
    ['Irlande', 'Irlande', 'irlande|ireland|republic of ireland|eire'],
    ['Irlande du Nord', 'Irlande du Nord', 'irlande du nord|northern ireland'],
    ['Pologne', 'Pologne', 'pologne|poland|polska'],
    ['Tchéquie', 'Tchéquie', 'tchequie|republique tcheque|czech republic|czech|czechia|cesko'],
    ['Slovaquie', 'Slovaquie', 'slovaquie|slovakia|slovensko'],
    ['Hongrie', 'Hongrie', 'hongrie|hungary|magyarorszag|magyar'],
    ['Roumanie', 'Roumanie', 'roumanie|romania'],
    ['Bulgarie', 'Bulgarie', 'bulgarie|bulgaria'],
    ['Grèce', 'Grèce', 'grece|greece|hellas|ellada'],
    ['Turquie', 'Turquie', 'turquie|turkey|turkiye'],
    ['Chypre', 'Chypre', 'chypre|cyprus'],
    ['Serbie', 'Serbie', 'serbie|serbia|srbija'],
    ['Monténégro', 'Monténégro', 'montenegro|crna gora'],
    ['Bosnie-Herzégovine', 'Bosnie-Herzégovine', 'bosnie|bosnie herzegovine|bosnia|bosnia and herzegovina'],
    ['Slovénie', 'Slovénie', 'slovenie|slovenia|slovenija'],
    ['Macédoine du Nord', 'Macédoine du Nord', 'macedoine|macedoine du nord|north macedonia|macedonia|makedonija'],
    ['Albanie', 'Albanie', 'albanie|albania|shqiperia'],
    ['Kosovo', 'Kosovo', 'kosovo|kosova'],
    ['Russie', 'Russie', 'russie|russia|rossiya'],
    ['Ukraine', 'Ukraine', 'ukraine|ukraina'],
    ['Biélorussie', 'Biélorussie', 'bielorussie|belarus'],
    ['Moldavie', 'Moldavie', 'moldavie|moldova'],
    ['Lituanie', 'Lituanie', 'lituanie|lithuania|lietuva'],
    ['Lettonie', 'Lettonie', 'lettonie|latvia|latvija'],
    ['Estonie', 'Estonie', 'estonie|estonia|eesti'],
    ['Géorgie', 'Géorgie', 'georgie|georgia|sakartvelo'],
    ['Arménie', 'Arménie', 'armenie|armenia'],
    ['Azerbaïdjan', 'Azerbaïdjan', 'azerbaidjan|azerbaijan'],
    ['Kazakhstan', 'Kazakhstan', 'kazakhstan'],
    ['Israël', 'Israël', 'israel'],
    ['Luxembourg', 'Luxembourg', 'luxembourg'],
    ['Malte', 'Malte', 'malte|malta'],
    ['Andorre', 'Andorre', 'andorre|andorra'],
    ['Saint-Marin', 'Saint-Marin', 'saint marin|san marino'],
    ['Liechtenstein', 'Liechtenstein', 'liechtenstein'],
    ['Gibraltar', 'Gibraltar', 'gibraltar'],
    // ---------- AMÉRIQUE DU SUD (CONMEBOL) ----------
    ['Brésil', 'Brésil', 'bresil|brasil|brazil|cbf|selecao'],
    ['Argentine', 'Argentine', 'argentine|argentina|afa|albiceleste'],
    ['Uruguay', 'Uruguay', 'uruguay|celeste|auf'],
    ['Colombie', 'Colombie', 'colombie|colombia|cafeteros'],
    ['Chili', 'Chili', 'chili|chile|la roja chilena'],
    ['Pérou', 'Pérou', 'perou|peru|blanquirroja'],
    ['Paraguay', 'Paraguay', 'paraguay|albirroja'],
    ['Équateur', 'Équateur', 'equateur|ecuador|la tri'],
    ['Bolivie', 'Bolivie', 'bolivie|bolivia'],
    ['Venezuela', 'Venezuela', 'venezuela|vinotinto'],
    // ---------- AMÉRIQUE DU NORD, CENTRALE ET CARAÏBES (CONCACAF) ----------
    ['Mexique', 'Mexique', 'mexique|mexico|el tri'],
    ['États-Unis', 'États-Unis', 'etats unis|etats-unis|usa|united states|usmnt|us soccer'],
    ['Canada', 'Canada', 'canada|les rouges'],
    ['Costa Rica', 'Costa Rica', 'costa rica|ticos'],
    ['Honduras', 'Honduras', 'honduras|catrachos'],
    ['Panama', 'Panama', 'panama'],
    ['Salvador', 'Salvador', 'salvador|el salvador'],
    ['Guatemala', 'Guatemala', 'guatemala'],
    ['Nicaragua', 'Nicaragua', 'nicaragua'],
    ['Belize', 'Belize', 'belize'],
    ['Jamaïque', 'Jamaïque', 'jamaique|jamaica|reggae boyz'],
    ['Haïti', 'Haïti', 'haiti|grenadiers'],
    ['Cuba', 'Cuba', 'cuba'],
    ['République dominicaine', 'République dominicaine', 'republique dominicaine|dominican republic|dominicana'],
    ['Trinité-et-Tobago', 'Trinité-et-Tobago', 'trinite|trinite et tobago|trinidad|trinidad and tobago|soca warriors'],
    ['Curaçao', 'Curaçao', 'curacao'],
    ['Suriname', 'Suriname', 'suriname|surinam'],
    ['Guyana', 'Guyana', 'guyana'],
    ['Porto Rico', 'Porto Rico', 'porto rico|puerto rico'],
    ['Barbade', 'Barbade', 'barbade|barbados'],
    ['Bahamas', 'Bahamas', 'bahamas'],
    ['Bermudes', 'Bermudes', 'bermudes|bermuda'],
    ['Grenade', 'Grenade', 'grenade|grenada'],
    ['Sainte-Lucie', 'Sainte-Lucie', 'sainte lucie|saint lucia|st lucia'],
    ['Saint-Vincent-et-les-Grenadines', 'Saint-Vincent-et-les-Grenadines', 'saint vincent|st vincent|grenadines'],
    ['Saint-Kitts-et-Nevis', 'Saint-Kitts-et-Nevis', 'saint kitts|st kitts|nevis'],
    ['Antigua-et-Barbuda', 'Antigua-et-Barbuda', 'antigua|antigua and barbuda|barbuda'],
    ['Dominique', 'Dominique', 'dominique|dominica'],
    ['Aruba', 'Aruba', 'aruba'],
    ['Anguilla', 'Anguilla', 'anguilla'],
    ['Montserrat', 'Montserrat', 'montserrat'],
    ['Îles Caïmans', 'Îles Caïmans', 'iles caimans|cayman islands|cayman'],
    ['Îles Turques-et-Caïques', 'Îles Turques-et-Caïques', 'turks and caicos|turques et caiques'],
    ['Îles Vierges britanniques', 'Îles Vierges britanniques', 'british virgin islands|iles vierges britanniques'],
    ['Îles Vierges américaines', 'Îles Vierges américaines', 'us virgin islands|iles vierges americaines'],
    ['Guadeloupe', 'Guadeloupe', 'guadeloupe|gwada'],
    ['Martinique', 'Martinique', 'martinique|matinino'],
    ['Guyane', 'Guyane', 'guyane|guyane francaise|french guiana'],
    ['Saint-Martin', 'Saint-Martin', 'saint martin|sint maarten'],
    // ---------- AFRIQUE (CAF) ----------
    ['Maroc', 'Maroc', 'maroc|morocco|lions de l atlas|atlas lions|frmf'],
    ['Algérie', 'Algérie', 'algerie|algeria|fennecs|les verts|faf'],
    ['Tunisie', 'Tunisie', 'tunisie|tunisia|aigles de carthage'],
    ['Égypte', 'Égypte', 'egypte|egypt|pharaons|pharaohs'],
    ['Libye', 'Libye', 'libye|libya'],
    ['Sénégal', 'Sénégal', 'senegal|lions de la teranga'],
    ["Côte d'Ivoire", "Côte d'Ivoire", 'cote d ivoire|cote divoire|ivory coast|elephants'],
    ['Cameroun', 'Cameroun', 'cameroun|cameroon|lions indomptables|indomitable lions|fecafoot'],
    ['Nigeria', 'Nigeria', 'nigeria|super eagles|nff'],
    ['Ghana', 'Ghana', 'ghana|black stars'],
    ['Mali', 'Mali', 'mali|aigles du mali'],
    ['Guinée', 'Guinée', 'guinee|guinea|syli national'],
    ['Guinée-Bissau', 'Guinée-Bissau', 'guinee bissau|guinea bissau|guine bissau'],
    ['Guinée équatoriale', 'Guinée équatoriale', 'guinee equatoriale|equatorial guinea|guinea ecuatorial'],
    ['Burkina Faso', 'Burkina Faso', 'burkina faso|burkina|etalons'],
    ['Niger', 'Niger', 'niger|mena'],
    ['Togo', 'Togo', 'togo|eperviers'],
    ['Bénin', 'Bénin', 'benin|ecureuils'],
    ['Gambie', 'Gambie', 'gambie|gambia'],
    ['Sierra Leone', 'Sierra Leone', 'sierra leone'],
    ['Liberia', 'Liberia', 'liberia'],
    ['Mauritanie', 'Mauritanie', 'mauritanie|mauritania|mourabitounes'],
    ['Cap-Vert', 'Cap-Vert', 'cap vert|cabo verde|cape verde'],
    ['RD Congo', 'RD Congo', 'rd congo|rdc|dr congo|congo kinshasa|congo rdc|leopards|zaire'],
    ['Congo', 'Congo', 'congo|congo brazzaville|diables rouges du congo'],
    ['Gabon', 'Gabon', 'gabon|pantheres'],
    ['Centrafrique', 'Centrafrique', 'centrafrique|central african republic|rca'],
    ['Tchad', 'Tchad', 'tchad|chad'],
    ['Angola', 'Angola', 'angola|palancas negras'],
    ['Zambie', 'Zambie', 'zambie|zambia|chipolopolo'],
    ['Zimbabwe', 'Zimbabwe', 'zimbabwe|warriors zimbabwe'],
    ['Mozambique', 'Mozambique', 'mozambique|mambas'],
    ['Malawi', 'Malawi', 'malawi'],
    ['Namibie', 'Namibie', 'namibie|namibia'],
    ['Botswana', 'Botswana', 'botswana'],
    ['Afrique du Sud', 'Afrique du Sud', 'afrique du sud|south africa|bafana bafana|bafana'],
    ['Lesotho', 'Lesotho', 'lesotho'],
    ['Eswatini', 'Eswatini', 'eswatini|swaziland'],
    ['Madagascar', 'Madagascar', 'madagascar|barea'],
    ['Maurice', 'Maurice', 'ile maurice|maurice|mauritius'],
    ['Seychelles', 'Seychelles', 'seychelles'],
    ['Comores', 'Comores', 'comores|comoros|coelacanthes'],
    ['La Réunion', 'La Réunion', 'la reunion|reunion'],
    ['Tanzanie', 'Tanzanie', 'tanzanie|tanzania|taifa stars'],
    ['Kenya', 'Kenya', 'kenya|harambee stars'],
    ['Ouganda', 'Ouganda', 'ouganda|uganda|cranes'],
    ['Rwanda', 'Rwanda', 'rwanda|amavubi'],
    ['Burundi', 'Burundi', 'burundi'],
    ['Éthiopie', 'Éthiopie', 'ethiopie|ethiopia'],
    ['Érythrée', 'Érythrée', 'erythree|eritrea'],
    ['Djibouti', 'Djibouti', 'djibouti'],
    ['Somalie', 'Somalie', 'somalie|somalia'],
    ['Soudan', 'Soudan', 'soudan|sudan'],
    ['Soudan du Sud', 'Soudan du Sud', 'soudan du sud|south sudan'],
    ['São Tomé-et-Príncipe', 'São Tomé-et-Príncipe', 'sao tome|sao tome et principe|sao tome and principe'],
    // ---------- ASIE (AFC) ----------
    ['Japon', 'Japon', 'japon|japan|nippon|samurai blue|jfa'],
    ['Corée du Sud', 'Corée du Sud', 'coree|coree du sud|south korea|korea republic|korea|taeguk warriors|kfa'],
    ['Corée du Nord', 'Corée du Nord', 'coree du nord|north korea|dprk|dpr korea'],
    ['Chine', 'Chine', 'chine|china|pr china|team china'],
    ['Taïwan', 'Taïwan', 'taiwan|chinese taipei|taipei'],
    ['Hong Kong', 'Hong Kong', 'hong kong'],
    ['Macao', 'Macao', 'macao|macau'],
    ['Mongolie', 'Mongolie', 'mongolie|mongolia'],
    ['Australie', 'Australie', 'australie|australia|socceroos'],
    ['Arabie saoudite', 'Arabie saoudite', 'arabie saoudite|saudi arabia|saudi|al saqour|green falcons'],
    ['Qatar', 'Qatar', 'qatar|al annabi'],
    ['Émirats arabes unis', 'Émirats arabes unis', 'emirats arabes unis|emirats|united arab emirates|uae'],
    ['Koweït', 'Koweït', 'koweit|kuwait'],
    ['Bahreïn', 'Bahreïn', 'bahrein|bahrain'],
    ['Oman', 'Oman', 'oman'],
    ['Yémen', 'Yémen', 'yemen'],
    ['Irak', 'Irak', 'irak|iraq|lions of mesopotamia'],
    ['Iran', 'Iran', 'iran|team melli'],
    ['Syrie', 'Syrie', 'syrie|syria'],
    ['Liban', 'Liban', 'liban|lebanon'],
    ['Jordanie', 'Jordanie', 'jordanie|jordan national team|al nashama'],
    ['Palestine', 'Palestine', 'palestine'],
    ['Inde', 'Inde', 'inde|india|blue tigers'],
    ['Pakistan', 'Pakistan', 'pakistan'],
    ['Bangladesh', 'Bangladesh', 'bangladesh'],
    ['Sri Lanka', 'Sri Lanka', 'sri lanka'],
    ['Népal', 'Népal', 'nepal'],
    ['Bhoutan', 'Bhoutan', 'bhoutan|bhutan'],
    ['Maldives', 'Maldives', 'maldives'],
    ['Afghanistan', 'Afghanistan', 'afghanistan'],
    ['Ouzbékistan', 'Ouzbékistan', 'ouzbekistan|uzbekistan'],
    ['Kirghizistan', 'Kirghizistan', 'kirghizistan|kyrgyzstan|kyrgyz'],
    ['Tadjikistan', 'Tadjikistan', 'tadjikistan|tajikistan'],
    ['Turkménistan', 'Turkménistan', 'turkmenistan'],
    ['Thaïlande', 'Thaïlande', 'thailande|thailand|war elephants'],
    ['Viêt Nam', 'Viêt Nam', 'vietnam|viet nam'],
    ['Malaisie', 'Malaisie', 'malaisie|malaysia|harimau malaya'],
    ['Singapour', 'Singapour', 'singapour|singapore'],
    ['Indonésie', 'Indonésie', 'indonesie|indonesia|garuda'],
    ['Philippines', 'Philippines', 'philippines|azkals'],
    ['Cambodge', 'Cambodge', 'cambodge|cambodia'],
    ['Laos', 'Laos', 'laos'],
    ['Myanmar', 'Myanmar', 'myanmar|birmanie|burma'],
    ['Brunei', 'Brunei', 'brunei'],
    ['Timor oriental', 'Timor oriental', 'timor oriental|timor leste|east timor'],
    ['Guam', 'Guam', 'guam'],
    // ---------- OCÉANIE (OFC) ----------
    ['Nouvelle-Zélande', 'Nouvelle-Zélande', 'nouvelle zelande|new zealand|all whites'],
    ['Nouvelle-Calédonie', 'Nouvelle-Calédonie', 'nouvelle caledonie|new caledonia|caledonie|cagous'],
    ['Tahiti', 'Tahiti', 'tahiti|polynesie francaise|french polynesia|toa aito'],
    ['Fidji', 'Fidji', 'fidji|fiji'],
    ['Papouasie-Nouvelle-Guinée', 'Papouasie-Nouvelle-Guinée', 'papouasie|papua new guinea|papua'],
    ['Îles Salomon', 'Îles Salomon', 'iles salomon|solomon islands'],
    ['Vanuatu', 'Vanuatu', 'vanuatu'],
    ['Samoa', 'Samoa', 'samoa'],
    ['Samoa américaines', 'Samoa américaines', 'samoa americaines|american samoa'],
    ['Tonga', 'Tonga', 'tonga'],
    ['Îles Cook', 'Îles Cook', 'iles cook|cook islands'],
    ['Kiribati', 'Kiribati', 'kiribati'],
    ['Tuvalu', 'Tuvalu', 'tuvalu'],
    // ---------- ÉQUIPES HISTORIQUES ET RÉGIONALES ----------
    ['URSS', 'URSS', 'urss|ussr|cccp|union sovietique|soviet union'],
    ['Yougoslavie', 'Yougoslavie', 'yougoslavie|yugoslavia|jugoslavija|serbie et montenegro|serbia and montenegro'],
    ['Tchécoslovaquie', 'Tchécoslovaquie', 'tchecoslovaquie|czechoslovakia'],
    ['RDA (Allemagne de l’Est)', 'RDA', 'rda|allemagne de l est|east germany|ddr'],
    ['Allemagne de l’Ouest', 'Allemagne de l’Ouest', 'allemagne de l ouest|west germany|rfa'],
    ['Catalogne', 'Espagne', 'catalogne|catalunya|catalonia'],
    ['Pays basque', 'Espagne', 'pays basque|euskadi|euskal selekzioa|basque country'],
    ['Bretagne', 'France', 'bretagne|breizh|brittany'],
    ['Corse', 'France', 'corse|squadra corsa|corsica']
  ];


  // Format : 'Nom|alias|alias'
  const MARQUES_BRUT = [
    'Nike', 'Adidas', 'Puma', 'Umbro', 'Kappa', 'Le Coq Sportif|coq sportif', 'Macron', 'Hummel',
    'Joma', 'New Balance', 'Under Armour', 'Lotto', 'Diadora', 'Reebok', 'Erreà|errea', 'Castore',
    'Mizuno', 'Uhlsport', 'Asics', 'Patrick', 'Admiral', 'Fila', 'Warrior', 'Jako', 'Kelme',
    'Duarig', 'Score Draw'
  ];

  const SPONSORS_BRUT = [
    'Emirates|fly emirates', 'Qatar Airways', 'Etihad', 'Opel', 'Sharp', 'Vodafone', 'AIG', 'Aon',
    'Chevrolet', 'TeamViewer', 'Carlsberg', 'Standard Chartered', 'Samsung', 'Yokohama', 'JVC',
    'O2', 'Siemens', 'Bwin', 'Rakuten', 'Spotify', 'Teka', 'Unicef', 'Jeep', 'Pirelli', 'T-Mobile',
    'Deutsche Telekom', 'Evonik', '1&1', 'Hyundai', 'Orange', 'Pizza Hut', 'Accor|all accor|accorhotels',
    'Qatar Tourism|visit qatar', 'Intermarché', 'Coca-Cola|coca cola', 'Veolia', 'Partouche'
  ];

  const MOTS_SUSPECTS = ['replica', 'replique', 'copie', 'fake', 'thai', 'thailandais', 'aaa', '1:1',
    'dhgate', 'aliexpress', 'unbranded', 'sans marque', 'non officiel', 'imitation', 'contrefacon'];

  function normaliser(s) {
    return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[’'`]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function construireEquipes(liste) {
    return liste.map(e => ({ nom: e[0], pays: e[1], alias: e[2].split('|').map(normaliser) }));
  }
  function construireSimple(liste) {
    return liste.map(e => { const p = e.split('|'); return { nom: p[0], alias: p.map(normaliser) }; });
  }
  const CLUBS = construireEquipes(CLUBS_BRUT);
  const SELECTIONS = construireEquipes(SELECTIONS_BRUT);
  const MARQUES = construireSimple(MARQUES_BRUT);
  const SPONSORS = construireSimple(SPONSORS_BRUT);

  // =============== 3. UTILITAIRES ===============
  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function euros(v) {
    if (v == null || v === '' || isNaN(v)) return '—';
    return Number(v).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' €';
  }
  function mediane(arr) {
    if (!arr.length) return null;
    const a = arr.slice().sort((x, y) => x - y);
    const m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function lireJSON(cle, defaut) {
    try { const v = localStorage.getItem(cle); return v ? JSON.parse(v) : defaut; } catch (e) { return defaut; }
  }
  function ecrireJSON(cle, val) {
    try { localStorage.setItem(cle, JSON.stringify(val)); return true; }
    catch (e) { notifier('Stockage plein : exporte ta collection ou supprime des photos.'); return false; }
  }
  let minuteurToast = null;
  function notifier(msg) {
    let t = document.getElementById('mm-toast');
    if (!t) { t = document.createElement('div'); t.id = 'mm-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('visible');
    clearTimeout(minuteurToast);
    minuteurToast = setTimeout(() => t.classList.remove('visible'), 3500);
  }
  function echapperRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // =============== 4. STOCKAGE ===============
  function lireCollection() { return lireJSON(CLE_COLLECTION, []); }
  function ecrireCollection(c) { return ecrireJSON(CLE_COLLECTION, c); }
  function trouver(id) { return lireCollection().find(m => m.id === id) || null; }
  function sauverMaillot(m) {
    const c = lireCollection();
    const i = c.findIndex(x => x.id === m.id);
    if (i >= 0) c[i] = m; else c.unshift(m);
    return ecrireCollection(c);
  }
  function supprimerMaillot(id) { ecrireCollection(lireCollection().filter(m => m.id !== id)); }
  function nouveauMaillot() {
    return { id: uid(), club: '', pays: '', saison: '', type: 'Domicile', marque: '', sponsor: '', joueur: '',
      numero: '', taille: '', etat: '', prixAchat: '', prixEstime: '', photo: '', notes: '', date: new Date().toISOString() };
  }

  // =============== 5. PARAMÈTRES ET QUOTA ===============
  function lireParams() { return Object.assign({ relais: '', code: '' }, lireJSON(CLE_PARAMS, {})); }
  function ecrireParams(p) { ecrireJSON(CLE_PARAMS, p); }
  function moisCourant() { return new Date().toISOString().slice(0, 7); }
  function lireQuota() {
    const q = lireJSON(CLE_QUOTA, { mois: moisCourant(), utilise: 0 });
    if (q.mois !== moisCourant()) { q.mois = moisCourant(); q.utilise = 0; ecrireJSON(CLE_QUOTA, q); }
    return q;
  }
  function consommerQuota(n) {
    const q = lireQuota(); q.utilise += (n || 1); ecrireJSON(CLE_QUOTA, q);
  }

  // =============== 6. RELAIS CLOUDFLARE ===============
  async function relais(action, donnees) {
    const p = lireParams();
    if (!p.relais) throw new Error('Adresse du relais manquante : va dans Paramètres.');
    const ctrl = new AbortController();
    const minuteur = setTimeout(() => ctrl.abort(), 30000);
    let rep;
    try {
      rep = await fetch(p.relais.replace(/\/+$/, ''), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ code: p.code, action: action }, donnees || {})),
        signal: ctrl.signal
      });
    } catch (e) {
      clearTimeout(minuteur);
      if (e.name === 'AbortError') throw new Error('Le relais ne répond pas (délai dépassé).');
      throw new Error('Relais injoignable : vérifie l’adresse dans Paramètres et ta connexion.');
    }
    clearTimeout(minuteur);
    let j;
    try { j = await rep.json(); } catch (e) { throw new Error('Réponse illisible du relais (HTTP ' + rep.status + ').'); }
    if (!rep.ok || j.erreur) throw new Error(j.erreur || ('Erreur du relais (HTTP ' + rep.status + ').'));
    if (j.serpapi_utilise && !j.cache) consommerQuota(1);
    return j;
  }

  // =============== 7. PHOTO ===============
  function compresserImage(fichier, max, qualite) {
    return new Promise((resoudre, rejeter) => {
      const img = new Image();
      const url = URL.createObjectURL(fichier);
      img.onload = () => {
        let w = img.width, hh = img.height;
        const r = Math.min(1, (max || 1000) / Math.max(w, hh));
        w = Math.round(w * r); hh = Math.round(hh * r);
        const c = document.createElement('canvas');
        c.width = w; c.height = hh;
        c.getContext('2d').drawImage(img, 0, 0, w, hh);
        URL.revokeObjectURL(url);
        resoudre(c.toDataURL('image/jpeg', qualite || 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); rejeter(new Error('Photo illisible.')); };
      img.src = url;
    });
  }

  // =============== 8. ANALYSE DE TEXTE ===============
  function chercherDans(liste, texte) {
    const t = normaliser(texte);
    let meilleur = null, longueur = 0;
    liste.forEach(entree => {
      entree.alias.forEach(alias => {
        if (alias.length <= longueur) return;
        const re = new RegExp('(^|[^a-z0-9])' + echapperRegex(alias) + '($|[^a-z0-9])');
        if (re.test(t)) { meilleur = entree; longueur = alias.length; }
      });
    });
    return meilleur;
  }
  function detecterEquipe(texte) { return chercherDans(CLUBS, texte) || chercherDans(SELECTIONS, texte); }
  function detecterType(texte) {
    const t = normaliser(texte);
    if (/\b(third|3rd|troisieme|3eme|3e maillot)\b/.test(t)) return 'Third';
    if (/\b(away|exterieur|ext|visitante|auswarts)\b/.test(t)) return 'Extérieur';
    if (/\b(gardien|goalkeeper|gk|portero|torwart|keeper)\b/.test(t)) return 'Gardien';
    if (/\b(training|entrainement|pre match|prematch|echauffement)\b/.test(t)) return 'Entraînement';
    if (/\b(home|domicile|local|heim)\b/.test(t)) return 'Domicile';
    return null;
  }
  function detecterSaison(texte) {
    const t = String(texte || '');
    let m = t.match(/\b((?:19|20)\d{2})\s*[-\/–]\s*((?:19|20)?\d{2})\b/);
    if (m) { let b = m[2]; if (b.length === 4) b = b.slice(2); return m[1] + '-' + b; }
    m = t.match(/\b((?:19|20)\d{2})\b/);
    return m ? m[1] : null;
  }
  function detecterNumero(texte) {
    const m = normaliser(texte).match(/(?:n[°o]\s?|#|numero\s)(\d{1,2})\b/);
    return m ? m[1] : null;
  }
  function detecterTaille(texte) {
    const m = normaliser(texte).match(/\b(?:taille|size|tg|t\.)\s?(xs|s|m|l|xl|xxl|3xl|xxxl)\b/);
    if (!m) return null;
    const v = m[1].toUpperCase();
    return v === 'XXXL' ? '3XL' : v;
  }
  function analyserTitres(titres) {
    const votes = { equipe: {}, marque: {}, sponsor: {}, saison: {}, type: {} };
    const pays = {};
    let numero = null, taille = null;
    const voter = (cat, val) => { if (val) votes[cat][val] = (votes[cat][val] || 0) + 1; };
    titres.forEach(t => {
      const e = detecterEquipe(t); if (e) { voter('equipe', e.nom); pays[e.nom] = e.pays; }
      const m = chercherDans(MARQUES, t); if (m) voter('marque', m.nom);
      const s = chercherDans(SPONSORS, t); if (s) voter('sponsor', s.nom);
      voter('saison', detecterSaison(t));
      voter('type', detecterType(t));
      if (!numero) numero = detecterNumero(t);
      if (!taille) taille = detecterTaille(t);
    });
    const top = o => { const e = Object.entries(o).sort((a, b) => b[1] - a[1])[0]; return e ? { valeur: e[0], nb: e[1] } : null; };
    const eq = top(votes.equipe), ma = top(votes.marque), sp = top(votes.sponsor), sa = top(votes.saison), ty = top(votes.type);
    return {
      club: eq ? eq.valeur : '', pays: eq ? pays[eq.valeur] : '', votesClub: eq ? eq.nb : 0,
      marque: ma ? ma.valeur : '', sponsor: sp ? sp.valeur : '', saison: sa ? sa.valeur : '',
      type: ty ? ty.valeur : '', numero: numero || '', taille: taille || '', total: titres.length
    };
  }

  // =============== 9. PRIX ===============
  function extrairePrix(texte) {
    const t = String(texte || '').replace(/\u00a0/g, ' ');
    const m = t.match(/(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:€|eur\b|euros?\b)/i) || t.match(/€\s?(\d{1,4}(?:[.,]\d{1,2})?)/);
    if (!m) return null;
    const v = parseFloat(m[1].replace(',', '.'));
    return isFinite(v) && v > 0 ? v : null;
  }
  function requetePrix(m) {
    const type = (m.type && m.type !== 'Domicile' && m.type !== 'Autre') ? m.type : '';
    return [m.club, m.saison, 'maillot', m.marque, type, m.joueur].filter(Boolean).join(' ').trim();
  }
  function analyserAnnonces(liste) {
    const annonces = liste.map(a => {
      const prix = a.prix != null && a.prix !== '' ? Number(a.prix) : extrairePrix((a.titre || '') + ' ' + (a.extrait || ''));
      const texte = normaliser((a.titre || '') + ' ' + (a.extrait || ''));
      return { titre: a.titre || '(sans titre)', lien: a.lien || '', source: a.source || '', prix: prix,
        suspect: MOTS_SUSPECTS.some(mot => texte.includes(mot)), raison: '' };
    }).filter(a => a.prix && a.prix < 5000);
    annonces.forEach(a => { if (a.suspect) a.raison = 'mot suspect (réplique / contrefaçon ?)'; });
    const med1 = mediane(annonces.filter(a => !a.suspect).map(a => a.prix));
    if (med1) annonces.forEach(a => { if (!a.suspect && a.prix < med1 * 0.4) { a.suspect = true; a.raison = 'prix anormalement bas'; } });
    const valides = annonces.filter(a => !a.suspect).map(a => a.prix);
    annonces.sort((a, b) => a.prix - b.prix);
    return { annonces: annonces, nb: valides.length, mediane: mediane(valides),
      min: valides.length ? Math.min.apply(null, valides) : null, max: valides.length ? Math.max.apply(null, valides) : null };
  }
  function parserAnnoncesCollees(texte) {
    return String(texte || '').split(/\n+/).map(l => l.trim()).filter(Boolean)
      .map(l => ({ titre: l, source: 'collé' })).filter(a => extrairePrix(a.titre));
  }

  // =============== 10. SUGGESTIONS ===============
  function calculerSuggestions() {
    const col = lireCollection();
    const s = [];
    if (!col.length) return s;
    const groupes = {};
    col.forEach(m => { if (!m.club) return; const k = m.club + '|' + (m.saison || ''); (groupes[k] = groupes[k] || []).push(m); });
    Object.keys(groupes).forEach(k => {
      const club = k.split('|')[0], saison = k.split('|')[1];
      const types = groupes[k].map(m => m.type);
      ['Domicile', 'Extérieur', 'Third'].filter(t => !types.includes(t)).forEach(t => {
        s.push({ cat: 'À compléter', texte: club + (saison ? ' ' + saison : '') + ' — il te manque le maillot ' + t,
          requete: [club, saison, 'maillot', t].filter(Boolean).join(' ') });
      });
    });
    const compteClubs = {};
    col.forEach(m => { if (m.club) compteClubs[m.club] = (compteClubs[m.club] || 0) + 1; });
    Object.entries(compteClubs).sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([club, nb]) => {
      const saisons = col.filter(m => m.club === club && m.saison).map(m => m.saison);
      s.push({ cat: 'Tes clubs favoris', texte: club + ' : ' + nb + ' maillot(s)' + (saisons.length ? ' (' + Array.from(new Set(saisons)).sort().join(', ') + ')' : '') + ' — cherche d’autres saisons', requete: club + ' maillot vintage' });
    });
    col.filter(m => !m.prixEstime).slice(0, 10).forEach(m => {
      s.push({ cat: 'Sans estimation', texte: (m.club || 'Maillot') + (m.saison ? ' ' + m.saison : '') + ' — pas encore de prix estimé', id: m.id });
    });
    col.filter(m => !m.photo).slice(0, 10).forEach(m => {
      s.push({ cat: 'Sans photo', texte: (m.club || 'Maillot') + (m.saison ? ' ' + m.saison : '') + ' — ajoute une photo', id: m.id });
    });
    return s;
  }

  // =============== 11. ÉTAT DE L'INTERFACE ===============
  const etat = { vue: 'liste', id: null, brouillon: null, recherche: '', tri: 'date', ident: null, prixRes: null, test: '' };

  function aller(vue, id) {
    etat.vue = vue; etat.id = id || null;
    if (vue === 'formulaire') {
      etat.brouillon = id ? Object.assign({}, trouver(id)) : nouveauMaillot();
      etat.ident = null;
    }
    rendre();
    window.scrollTo(0, 0);
  }

  // =============== 12. ACTIONS ===============
  async function chargerPhoto(fichier) {
    if (!fichier) return;
    try {
      etat.brouillon.photo = await compresserImage(fichier, 1000, 0.82);
      rendre();
    } catch (e) { notifier(e.message); }
  }

  async function identifier() {
    const b = etat.brouillon;
    if (!b || !b.photo) { notifier('Ajoute d’abord une photo.'); return; }
    etat.ident = { enCours: true, etapes: ['Envoi de la photo au relais…'], resultats: [], proposition: null };
    rendre();
    try {
      const j = await relais('lens', { image: b.photo });
      const res = j.resultats || [];
      etat.ident.etapes.push(j.cache ? 'Résultat déjà connu : aucune recherche consommée.' : 'Google Lens interrogé (1 recherche SerpApi consommée).');
      etat.ident.etapes.push(res.length + ' correspondance(s) visuelle(s) trouvée(s).');
      etat.ident.resultats = res;
      const prop = analyserTitres(res.map(r => (r.titre || '') + ' ' + (r.source || '')));
      etat.ident.proposition = prop;
      etat.ident.etapes.push(prop.club ? 'Équipe reconnue : ' + prop.club + ' (' + prop.votesClub + ' titre(s) concordant(s)).' : 'Aucune équipe reconnue dans les titres : complète à la main ou colle un résultat Lens.');
    } catch (e) {
      etat.ident.etapes.push('Erreur : ' + e.message);
    }
    etat.ident.enCours = false;
    rendre();
  }

  function analyserTexteColle(texte) {
    const lignes = String(texte || '').split(/\n+/).map(l => l.trim()).filter(Boolean);
    if (!lignes.length) { notifier('Colle d’abord du texte.'); return; }
    const prop = analyserTitres(lignes);
    etat.ident = { enCours: false, etapes: [lignes.length + ' ligne(s) analysée(s) (aucune recherche consommée).',
      prop.club ? 'Équipe reconnue : ' + prop.club : 'Aucune équipe reconnue.'], resultats: [], proposition: prop };
    rendre();
  }

  function appliquerProposition() {
    const p = etat.ident && etat.ident.proposition; const b = etat.brouillon;
    if (!p || !b) return;
    let n = 0;
    ['club', 'pays', 'marque', 'sponsor', 'saison', 'type', 'numero', 'taille'].forEach(ch => {
      if (p[ch] && !b[ch]) { b[ch] = p[ch]; n++; }
      else if (p[ch] && ch === 'type' && b[ch] === 'Domicile') { b[ch] = p[ch]; n++; }
    });
    notifier(n ? n + ' champ(s) rempli(s). Vérifie et corrige si besoin.' : 'Rien à remplir : les champs sont déjà renseignés.');
    rendre();
  }

  function enregistrer() {
    const b = etat.brouillon;
    if (!b.club) { notifier('Indique au moins l’équipe.'); return; }
    b.prixAchat = b.prixAchat === '' ? '' : Number(String(b.prixAchat).replace(',', '.'));
    b.prixEstime = b.prixEstime === '' ? '' : Number(String(b.prixEstime).replace(',', '.'));
    if (sauverMaillot(b)) { notifier('Maillot enregistré.'); aller('fiche', b.id); }
  }

  async function chercherPrix(m) {
    const q = requetePrix(m);
    if (!q || q === 'maillot') { notifier('Renseigne au moins l’équipe du maillot.'); return; }
    etat.prixRes = { id: m.id, enCours: true, requete: q, notes: [], resultat: null };
    rendre();
    const taches = [
      relais('annonces', { q: q }).then(j => ({ src: 'Vinted / Leboncoin', liste: j.annonces || [], cache: !!j.cache }))
        .catch(e => ({ src: 'Vinted / Leboncoin', erreur: e.message })),
      relais('ebay', { q: q }).then(j => ({ src: 'eBay', liste: j.annonces || [] }))
        .catch(e => ({ src: 'eBay', erreur: e.message }))
    ];
    const reponses = await Promise.all(taches);
    let toutes = [];
    reponses.forEach(r => {
      if (r.erreur) etat.prixRes.notes.push(r.src + ' : ' + r.erreur);
      else {
        etat.prixRes.notes.push(r.src + ' : ' + r.liste.length + ' annonce(s)' + (r.cache ? ' (déjà connu, aucune recherche consommée)' : ''));
        toutes = toutes.concat(r.liste.map(a => Object.assign({ source: r.src }, a)));
      }
    });
    etat.prixRes.resultat = analyserAnnonces(toutes);
    etat.prixRes.enCours = false;
    rendre();
  }

  function analyserAnnoncesCollees(m, texte) {
    const liste = parserAnnoncesCollees(texte);
    if (!liste.length) { notifier('Aucun prix trouvé dans le texte collé (il faut un montant en € par ligne).'); return; }
    etat.prixRes = { id: m.id, enCours: false, requete: 'annonces collées', notes: [liste.length + ' ligne(s) avec un prix (aucune recherche consommée)'], resultat: analyserAnnonces(liste) };
    rendre();
  }

  function utiliserEstimation(id, valeur) {
    const m = trouver(id); if (!m) return;
    m.prixEstime = Math.round(valeur);
    sauverMaillot(m);
    notifier('Prix estimé enregistré : ' + euros(m.prixEstime));
    rendre();
  }

  async function testerRelais() {
    etat.test = 'Test en cours…'; rendre();
    try {
      const j = await relais('test', {});
      const c = v => v ? '✔' : '✖';
      etat.test = 'Relais OK (version ' + (j.version || '?') + ') · SerpApi ' + c(j.serpapi) + ' · Lens ' + c(j.lens) + ' · eBay ' + c(j.ebay);
    } catch (e) { etat.test = 'Échec : ' + e.message; }
    rendre();
  }

  function exporter() {
    const donnees = { version: VERSION, date: new Date().toISOString(), collection: lireCollection() };
    const blob = new Blob([JSON.stringify(donnees)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mes-maillots-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function importer(fichier) {
    if (!fichier) return;
    const lecteur = new FileReader();
    lecteur.onload = () => {
      try {
        const j = JSON.parse(lecteur.result);
        const liste = Array.isArray(j) ? j : (j.collection || []);
        if (!Array.isArray(liste)) throw new Error('format inconnu');
        const col = lireCollection();
        let n = 0;
        liste.forEach(m => { if (m && m.id && !col.some(x => x.id === m.id)) { col.push(m); n++; } });
        ecrireCollection(col);
        notifier(n + ' maillot(s) importé(s).');
        rendre();
      } catch (e) { notifier('Fichier illisible.'); }
    };
    lecteur.readAsText(fichier);
  }

  // =============== 13. RENDU ===============
  function selectHtml(nom, valeurs, valeur) {
    return '<select data-champ="' + nom + '">' + valeurs.map(v => '<option value="' + h(v) + '"' + (v === valeur ? ' selected' : '') + '>' + (v || '—') + '</option>').join('') + '</select>';
  }
  function champ(label, nom, valeur, options) {
    options = options || {};
    let input;
    if (options.select) input = selectHtml(nom, options.select, valeur);
    else if (options.textarea) input = '<textarea data-champ="' + nom + '" rows="3">' + h(valeur) + '</textarea>';
    else input = '<input data-champ="' + nom + '" type="' + (options.type || 'text') + '" value="' + h(valeur) + '" placeholder="' + h(options.placeholder || '') + '"' + (options.liste ? ' list="' + options.liste + '"' : '') + '>';
    return '<label class="champ"><span>' + label + '</span>' + input + '</label>';
  }
  function lienVinted(q) { return 'https://www.vinted.fr/catalog?search_text=' + encodeURIComponent(q); }
  function lienEbay(q) { return 'https://www.ebay.fr/sch/i.html?_nkw=' + encodeURIComponent(q); }
  function lienLeboncoin(q) { return 'https://www.leboncoin.fr/recherche?text=' + encodeURIComponent(q); }

  function vueListe() {
    let col = lireCollection();
    const r = normaliser(etat.recherche);
    if (r) col = col.filter(m => normaliser([m.club, m.pays, m.saison, m.type, m.marque, m.sponsor, m.joueur, m.notes].join(' ')).includes(r));
    const tris = {
      date: (a, b) => (b.date || '').localeCompare(a.date || ''),
      club: (a, b) => (a.club || '').localeCompare(b.club || '', 'fr'),
      saison: (a, b) => (b.saison || '').localeCompare(a.saison || ''),
      prix: (a, b) => (Number(b.prixEstime) || 0) - (Number(a.prixEstime) || 0)
    };
    col.sort(tris[etat.tri] || tris.date);
    const tout = lireCollection();
    const totalEstime = tout.reduce((s, m) => s + (Number(m.prixEstime) || 0), 0);
    const totalAchat = tout.reduce((s, m) => s + (Number(m.prixAchat) || 0), 0);
    let html = '<section class="stats"><div><b>' + tout.length + '</b><span>maillots</span></div><div><b>' + euros(totalEstime) + '</b><span>valeur estimée</span></div><div><b>' + euros(totalAchat) + '</b><span>total achats</span></div></section>';
    html += '<div class="barre"><input type="search" data-recherche placeholder="Rechercher (club, saison, marque…)" value="' + h(etat.recherche) + '">' +
      '<select data-tri><option value="date"' + (etat.tri === 'date' ? ' selected' : '') + '>Récents</option><option value="club"' + (etat.tri === 'club' ? ' selected' : '') + '>Club A→Z</option><option value="saison"' + (etat.tri === 'saison' ? ' selected' : '') + '>Saison</option><option value="prix"' + (etat.tri === 'prix' ? ' selected' : '') + '>Prix estimé</option></select></div>';
    if (!tout.length) {
      html += '<div class="vide"><p>Ta collection est vide.</p><button class="btn principal" data-action="ajouter">+ Ajouter mon premier maillot</button></div>';
    } else if (!col.length) {
      html += '<div class="vide"><p>Aucun maillot ne correspond à « ' + h(etat.recherche) + ' ».</p></div>';
    } else {
      html += '<div class="grille">' + col.map(m =>
        '<article class="carte" data-action="fiche" data-id="' + m.id + '">' +
        (m.photo ? '<img src="' + m.photo + '" alt="">' : '<div class="sansphoto">👕</div>') +
        '<div class="carte-txt"><b>' + h(m.club || 'Sans nom') + '</b><span>' + h([m.saison, m.type].filter(Boolean).join(' · ')) + '</span><em>' + (m.prixEstime ? euros(m.prixEstime) : '') + '</em></div></article>'
      ).join('') + '</div>';
    }
    return html;
  }

  function vueFiche() {
    const m = trouver(etat.id);
    if (!m) return '<p class="vide">Maillot introuvable.</p>';
    const lignes = [['Pays', m.pays], ['Saison', m.saison], ['Type', m.type], ['Marque', m.marque], ['Sponsor', m.sponsor],
      ['Joueur', m.joueur ? m.joueur + (m.numero ? ' · n° ' + m.numero : '') : (m.numero ? 'n° ' + m.numero : '')], ['Taille', m.taille], ['État', m.etat],
      ['Prix d’achat', m.prixAchat !== '' ? euros(m.prixAchat) : ''], ['Prix estimé', m.prixEstime !== '' ? euros(m.prixEstime) : '']].filter(l => l[1]);
    let html = '<button class="btn lien" data-action="liste">← Collection</button>';
    html += '<section class="fiche">' + (m.photo ? '<img class="grande" src="' + m.photo + '" alt="">' : '<div class="sansphoto grande">👕</div>') +
      '<h2>' + h(m.club || 'Sans nom') + '</h2><table>' + lignes.map(l => '<tr><th>' + l[0] + '</th><td>' + h(l[1]) + '</td></tr>').join('') + '</table>' +
      (m.notes ? '<p class="notes">' + h(m.notes) + '</p>' : '') +
      '<div class="actions"><button class="btn" data-action="modifier" data-id="' + m.id + '">✏️ Modifier</button>' +
      '<button class="btn principal" data-action="prix" data-id="' + m.id + '">💶 Chercher les prix</button>' +
      '<button class="btn danger" data-action="supprimer" data-id="' + m.id + '">🗑️ Supprimer</button></div></section>';
    const q = requetePrix(m);
    html += '<section class="bloc"><h3>Vérifier soi-même (gratuit)</h3><p class="liens"><a href="' + lienVinted(q) + '" target="_blank" rel="noopener">Vinted</a> · <a href="' + lienLeboncoin(q) + '" target="_blank" rel="noopener">Leboncoin</a> · <a href="' + lienEbay(q) + '" target="_blank" rel="noopener">eBay</a></p>' +
      '<details><summary>Coller des annonces (une par ligne, avec le prix en €)</summary><textarea id="annonces-collees" rows="5" placeholder="Maillot PSG 2019 Nike taille M – 45 €\nMaillot PSG 2019 neuf – 70 €"></textarea><button class="btn" data-action="annonces-collees" data-id="' + m.id + '">Analyser ces annonces</button></details></section>';
    const p = etat.prixRes;
    if (p && p.id === m.id) {
      html += '<section class="bloc"><h3>Estimation de prix</h3><p class="petit">Recherche : ' + h(p.requete) + '</p>';
      if (p.enCours) html += '<p class="attente">Recherche en cours…</p>';
      html += '<ul class="etapes">' + p.notes.map(n => '<li>' + h(n) + '</li>').join('') + '</ul>';
      if (p.resultat) {
        const r = p.resultat;
        if (r.nb) {
          html += '<div class="estimation"><div><b>' + euros(r.mediane) + '</b><span>médiane (' + r.nb + ' annonces fiables)</span></div><div><b>' + euros(r.min) + ' – ' + euros(r.max) + '</b><span>fourchette</span></div></div>' +
            '<button class="btn principal" data-action="utiliser-estimation" data-id="' + m.id + '" data-valeur="' + r.mediane + '">Utiliser ' + euros(Math.round(r.mediane)) + ' comme prix estimé</button>';
        } else if (!p.enCours) html += '<p>Aucune annonce exploitable. Essaie avec d’autres mots dans la fiche (saison, marque) ou colle des annonces.</p>';
        if (r.annonces.length) {
          html += '<ul class="annonces">' + r.annonces.map(a => '<li class="' + (a.suspect ? 'suspect' : '') + '"><b>' + euros(a.prix) + '</b> ' +
            (a.lien ? '<a href="' + h(a.lien) + '" target="_blank" rel="noopener">' + h(a.titre) + '</a>' : h(a.titre)) +
            ' <small>' + h(a.source) + (a.suspect ? ' · ⚠️ ' + h(a.raison) : '') + '</small></li>').join('') + '</ul>';
        }
      }
      html += '</section>';
    }
    return html;
  }

  function vueFormulaire() {
    const b = etat.brouillon;
    const listeClubs = '<datalist id="liste-clubs">' + CLUBS.concat(SELECTIONS).map(c => '<option value="' + h(c.nom) + '">').join('') + '</datalist>';
    const listeMarques = '<datalist id="liste-marques">' + MARQUES.map(c => '<option value="' + h(c.nom) + '">').join('') + '</datalist>';
    const listeSponsors = '<datalist id="liste-sponsors">' + SPONSORS.map(c => '<option value="' + h(c.nom) + '">').join('') + '</datalist>';
    let html = '<button class="btn lien" data-action="' + (etat.id ? 'fiche' : 'liste') + '" data-id="' + (etat.id || '') + '">← Annuler</button>';
    html += '<h2>' + (etat.id ? 'Modifier le maillot' : 'Nouveau maillot') + '</h2>';
    html += '<section class="bloc photo-zone">' + (b.photo ? '<img class="grande" src="' + b.photo + '" alt="">' : '<div class="sansphoto grande">📷</div>') +
      '<div class="actions"><label class="btn">📷 Prendre une photo<input type="file" accept="image/*" capture="environment" data-fichier hidden></label>' +
      '<label class="btn">🖼️ Choisir une image<input type="file" accept="image/*" data-fichier hidden></label>' +
      (b.photo ? '<button class="btn" data-action="retirer-photo">Retirer la photo</button>' : '') + '</div>' +
      '<button class="btn principal" data-action="identifier"' + (b.photo ? '' : ' disabled') + '>🔍 Identifier avec Google Lens</button>' +
      '<p class="petit">1 recherche SerpApi par photo (' + quotaTexte() + '). Sinon, plan B gratuit ci-dessous.</p>' +
      '<details><summary>Coller un résultat Lens (plan B gratuit)</summary><p class="petit">Ouvre la photo dans Google Photos → Lens, copie les titres des résultats et colle-les ici (un par ligne).</p><textarea id="lens-colle" rows="4"></textarea><button class="btn" data-action="analyser-colle">Analyser le texte</button></details></section>';
    const i = etat.ident;
    if (i) {
      html += '<section class="bloc"><h3>Identification</h3><ul class="etapes">' + i.etapes.map(e => '<li>' + h(e) + '</li>').join('') + '</ul>';
      if (i.enCours) html += '<p class="attente">Analyse en cours…</p>';
      if (i.proposition) {
        const p = i.proposition;
        const items = [['Équipe', p.club], ['Pays', p.pays], ['Saison', p.saison], ['Type', p.type], ['Marque', p.marque], ['Sponsor', p.sponsor], ['Numéro', p.numero], ['Taille', p.taille]].filter(x => x[1]);
        html += items.length ? '<table>' + items.map(x => '<tr><th>' + x[0] + '</th><td>' + h(x[1]) + '</td></tr>').join('') + '</table><button class="btn principal" data-action="appliquer">✅ Remplir la fiche avec ces infos</button>' : '<p>Rien de reconnu.</p>';
      }
      if (i.resultats && i.resultats.length) {
        html += '<details><summary>Voir les ' + i.resultats.length + ' correspondances Lens</summary><ul class="annonces">' + i.resultats.map(r =>
          '<li>' + (r.lien ? '<a href="' + h(r.lien) + '" target="_blank" rel="noopener">' + h(r.titre) + '</a>' : h(r.titre)) + ' <small>' + h(r.source || '') + (r.prix ? ' · ' + h(r.prix) : '') + '</small></li>').join('') + '</ul></details>';
      }
      html += '</section>';
    }
    html += '<section class="bloc formulaire">' + listeClubs + listeMarques + listeSponsors +
      champ('Équipe / club *', 'club', b.club, { liste: 'liste-clubs', placeholder: 'Ex. Olympique de Marseille' }) +
      champ('Pays', 'pays', b.pays) +
      champ('Saison', 'saison', b.saison, { placeholder: 'Ex. 1998-99 ou 2023-24' }) +
      champ('Type', 'type', b.type, { select: TYPES }) +
      champ('Marque', 'marque', b.marque, { liste: 'liste-marques' }) +
      champ('Sponsor', 'sponsor', b.sponsor, { liste: 'liste-sponsors' }) +
      champ('Joueur (flocage)', 'joueur', b.joueur) +
      champ('Numéro', 'numero', b.numero, { type: 'text', placeholder: 'Ex. 10' }) +
      champ('Taille', 'taille', b.taille, { select: TAILLES }) +
      champ('État', 'etat', b.etat, { select: ETATS }) +
      champ('Prix d’achat (€)', 'prixAchat', b.prixAchat, { type: 'number', placeholder: '0' }) +
      champ('Prix estimé (€)', 'prixEstime', b.prixEstime, { type: 'number', placeholder: '0' }) +
      champ('Notes', 'notes', b.notes, { textarea: true }) +
      '<div class="actions"><button class="btn principal large" data-action="enregistrer">💾 Enregistrer</button></div></section>';
    return html;
  }

  function vueSuggestions() {
    const s = calculerSuggestions();
    let html = '<h2>Suggestions</h2><p class="petit">Calculées à partir de ta collection, sans aucune recherche en ligne.</p>';
    if (!s.length) return html + '<div class="vide"><p>Ajoute quelques maillots pour obtenir des suggestions.</p></div>';
    const cats = Array.from(new Set(s.map(x => x.cat)));
    cats.forEach(cat => {
      html += '<section class="bloc"><h3>' + h(cat) + '</h3><ul class="suggestions">' + s.filter(x => x.cat === cat).map(x =>
        '<li>' + h(x.texte) + (x.requete ? '<br><small><a href="' + lienVinted(x.requete) + '" target="_blank" rel="noopener">Vinted</a> · <a href="' + lienEbay(x.requete) + '" target="_blank" rel="noopener">eBay</a> · <a href="' + lienLeboncoin(x.requete) + '" target="_blank" rel="noopener">Leboncoin</a></small>' : '') +
        (x.id ? ' <button class="btn mini" data-action="fiche" data-id="' + x.id + '">Ouvrir</button>' : '') + '</li>').join('') + '</ul></section>';
    });
    return html;
  }

  function quotaTexte() { const q = lireQuota(); return q.utilise + ' / ' + QUOTA + ' recherches utilisées ce mois'; }

  function vueParametres() {
    const p = lireParams();
    return '<h2>Paramètres</h2>' +
      '<section class="bloc"><h3>Relais Cloudflare</h3>' +
      '<label class="champ"><span>Adresse du relais</span><input id="param-relais" type="url" value="' + h(p.relais) + '" placeholder="https://maillots-relais.xxxx.workers.dev"></label>' +
      '<label class="champ"><span>Code secret</span><input id="param-code" type="password" value="' + h(p.code) + '" placeholder="Le même que CODE_SECRET sur Cloudflare"></label>' +
      '<div class="actions"><button class="btn principal" data-action="sauver-params">💾 Enregistrer</button><button class="btn" data-action="tester">🔌 Tester</button></div>' +
      (etat.test ? '<p class="test">' + h(etat.test) + '</p>' : '') + '</section>' +
      '<section class="bloc"><h3>Quota SerpApi</h3><p>' + quotaTexte() + '.</p><p class="petit">Compteur local : il se remet à zéro chaque mois. Les résultats déjà connus (cache) ne comptent pas.</p><button class="btn mini" data-action="reset-quota">Remettre le compteur à zéro</button></section>' +
      '<section class="bloc"><h3>Sauvegarde</h3><div class="actions"><button class="btn" data-action="exporter">⬇️ Exporter (fichier JSON)</button><label class="btn">⬆️ Importer<input type="file" accept="application/json,.json" data-import hidden></label></div>' +
      '<p class="petit">Tes données restent sur cet appareil. Exporte régulièrement pour ne rien perdre.</p></section>' +
      '<section class="bloc"><h3>Zone dangereuse</h3><button class="btn danger" data-action="tout-effacer">Effacer toute la collection</button></section>' +
      '<p class="version">Mes Maillots · v' + VERSION + ' · sans IA</p>';
  }

  function rendre() {
    const vues = { liste: vueListe, fiche: vueFiche, formulaire: vueFormulaire, suggestions: vueSuggestions, parametres: vueParametres };
    const corps = (vues[etat.vue] || vueListe)();
    const nav = [['liste', '👕', 'Collection'], ['ajouter', '➕', 'Ajouter'], ['suggestions', '💡', 'Idées'], ['parametres', '⚙️', 'Réglages']]
      .map(n => '<button data-action="' + n[0] + '" class="' + ((etat.vue === n[0] || (n[0] === 'ajouter' && etat.vue === 'formulaire' && !etat.id)) ? 'actif' : '') + '"><span>' + n[1] + '</span>' + n[2] + '</button>').join('');
    document.getElementById('app').innerHTML = '<header class="entete"><h1>⚽ Mes Maillots</h1></header><main>' + corps + '</main><nav class="nav">' + nav + '</nav>';
  }

  // =============== 14. ÉVÉNEMENTS ===============
  function brancher() {
    const app = document.getElementById('app');
    app.addEventListener('click', e => {
      const el = e.target.closest('[data-action]');
      if (!el || el.disabled) return;
      const action = el.getAttribute('data-action');
      const id = el.getAttribute('data-id');
      switch (action) {
        case 'liste': aller('liste'); break;
        case 'ajouter': aller('formulaire', null); break;
        case 'suggestions': aller('suggestions'); break;
        case 'parametres': aller('parametres'); break;
        case 'fiche': aller('fiche', id); break;
        case 'modifier': aller('formulaire', id); break;
        case 'supprimer':
          if (confirm('Supprimer ce maillot ?')) { supprimerMaillot(id); notifier('Maillot supprimé.'); aller('liste'); }
          break;
        case 'retirer-photo': etat.brouillon.photo = ''; rendre(); break;
        case 'identifier': identifier(); break;
        case 'analyser-colle': analyserTexteColle((document.getElementById('lens-colle') || {}).value); break;
        case 'appliquer': appliquerProposition(); break;
        case 'enregistrer': enregistrer(); break;
        case 'prix': { const m = trouver(id); if (m) chercherPrix(m); break; }
        case 'annonces-collees': { const m = trouver(id); if (m) analyserAnnoncesCollees(m, (document.getElementById('annonces-collees') || {}).value); break; }
        case 'utiliser-estimation': utiliserEstimation(id, Number(el.getAttribute('data-valeur'))); break;
        case 'sauver-params': {
          const relaisVal = (document.getElementById('param-relais').value || '').trim();
          const codeVal = (document.getElementById('param-code').value || '').trim();
          if (relaisVal && !/^https:\/\//.test(relaisVal)) { notifier('L’adresse doit commencer par https://'); return; }
          ecrireParams({ relais: relaisVal, code: codeVal });
          notifier('Paramètres enregistrés.'); rendre(); break;
        }
        case 'tester': {
          const relaisVal = (document.getElementById('param-relais').value || '').trim();
          const codeVal = (document.getElementById('param-code').value || '').trim();
          ecrireParams({ relais: relaisVal, code: codeVal });
          testerRelais(); break;
        }
        case 'reset-quota': ecrireJSON(CLE_QUOTA, { mois: moisCourant(), utilise: 0 }); rendre(); break;
        case 'exporter': exporter(); break;
        case 'tout-effacer':
          if (confirm('Effacer TOUTE la collection ? Cette action est définitive.') && confirm('Vraiment sûr ? Pense à exporter avant.')) { ecrireCollection([]); notifier('Collection effacée.'); aller('liste'); }
          break;
      }
    });
    const surSaisie = e => {
      const el = e.target;
      if (el.hasAttribute('data-champ') && etat.brouillon) { etat.brouillon[el.getAttribute('data-champ')] = el.value; return; }
      if (el.hasAttribute('data-recherche')) { etat.recherche = el.value; const main = document.querySelector('main'); if (main) { const pos = el.selectionStart; rendre(); const n = document.querySelector('[data-recherche]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) { /* ignore */ } } } return; }
      if (el.hasAttribute('data-tri')) { etat.tri = el.value; rendre(); }
    };
    app.addEventListener('input', surSaisie);
    app.addEventListener('change', e => {
      const el = e.target;
      if (el.hasAttribute('data-fichier')) { chargerPhoto(el.files && el.files[0]); return; }
      if (el.hasAttribute('data-import')) { importer(el.files && el.files[0]); return; }
      if (el.hasAttribute('data-champ') || el.hasAttribute('data-tri')) surSaisie(e);
    });
  }

  // =============== 15. SERVICE WORKER ===============
  function enregistrerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* hors ligne non disponible */ });
    }
  }

  // =============== 16. STYLE ===============
  function injecterStyle() {
    if (document.getElementById('style-v12')) return;
    const s = document.createElement('style');
    s.id = 'style-v12';
    s.textContent = `
:root{--vert:#194838;--or:#b8862b;--fond:#f4f1ea;--carte:#fff;--texte:#1e1e1e;--gris:#6b6b6b;--rouge:#b23a3a;--bord:#e2dccf}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--fond);color:var(--texte);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:16px;line-height:1.4}
a{color:var(--vert)}
.entete{background:var(--vert);color:#fff;padding:calc(12px + env(safe-area-inset-top)) 16px 12px;position:sticky;top:0;z-index:5}
.entete h1{margin:0;font-size:20px;letter-spacing:.3px}
main{padding:14px 14px calc(90px + env(safe-area-inset-bottom));max-width:720px;margin:0 auto}
h2{color:var(--vert);margin:6px 0 12px;font-size:22px}
h3{color:var(--vert);margin:0 0 8px;font-size:16px;text-transform:uppercase;letter-spacing:.5px}
.nav{position:fixed;bottom:0;left:0;right:0;display:flex;background:#fff;border-top:1px solid var(--bord);padding-bottom:env(safe-area-inset-bottom);z-index:5}
.nav button{flex:1;border:0;background:none;padding:8px 4px;font-size:12px;color:var(--gris);display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer}
.nav button span{font-size:22px}
.nav button.actif{color:var(--vert);font-weight:700}
.stats{display:flex;gap:8px;margin-bottom:12px}
.stats div{flex:1;background:var(--carte);border:1px solid var(--bord);border-radius:12px;padding:10px 6px;text-align:center}
.stats b{display:block;color:var(--vert);font-size:17px}
.stats span{font-size:11px;color:var(--gris)}
.barre{display:flex;gap:8px;margin-bottom:12px}
.barre input{flex:1}
input,select,textarea{width:100%;padding:10px 12px;border:1px solid var(--bord);border-radius:10px;font-size:16px;background:#fff;color:var(--texte);font-family:inherit}
input:focus,select:focus,textarea:focus{outline:2px solid var(--or);border-color:var(--or)}
.grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.carte{background:var(--carte);border:1px solid var(--bord);border-radius:14px;overflow:hidden;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.carte img,.carte .sansphoto{width:100%;aspect-ratio:1/1;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:48px;background:#ece7db}
.carte-txt{padding:8px 10px;display:flex;flex-direction:column;gap:2px}
.carte-txt b{font-size:14px;color:var(--vert);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.carte-txt span{font-size:12px;color:var(--gris)}
.carte-txt em{font-style:normal;font-weight:700;color:var(--or);font-size:13px;min-height:16px}
.vide{text-align:center;padding:40px 10px;color:var(--gris)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 14px;border:1px solid var(--vert);border-radius:10px;background:#fff;color:var(--vert);font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;text-align:center}
.btn.principal{background:var(--vert);color:#fff}
.btn.danger{border-color:var(--rouge);color:var(--rouge)}
.btn.lien{border:0;background:none;padding:6px 0;font-weight:600}
.btn.mini{padding:5px 10px;font-size:13px}
.btn.large{width:100%}
.btn[disabled]{opacity:.45;cursor:not-allowed}
.actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.bloc,.fiche{background:var(--carte);border:1px solid var(--bord);border-radius:14px;padding:14px;margin-bottom:14px}
.grande{width:100%;max-height:360px;object-fit:contain;border-radius:10px;background:#ece7db;display:block}
.sansphoto.grande{height:200px;display:flex;align-items:center;justify-content:center;font-size:64px}
.fiche h2{margin-top:12px}
table{width:100%;border-collapse:collapse;margin:8px 0}
th{text-align:left;color:var(--gris);font-weight:600;padding:6px 8px 6px 0;width:38%;font-size:14px;vertical-align:top}
td{padding:6px 0;font-size:15px}
.notes{white-space:pre-wrap;color:var(--gris);font-size:14px}
.champ{display:block;margin-bottom:10px}
.champ span{display:block;font-size:13px;color:var(--gris);margin-bottom:4px;font-weight:600}
.petit{font-size:13px;color:var(--gris);margin:6px 0}
.liens{font-size:15px}
.etapes{list-style:none;padding:0;margin:8px 0;font-size:14px}
.etapes li{padding:4px 0 4px 18px;position:relative}
.etapes li:before{content:"•";position:absolute;left:4px;color:var(--or)}
.attente{color:var(--or);font-weight:600}
.estimation{display:flex;gap:8px;margin:10px 0}
.estimation div{flex:1;background:var(--fond);border-radius:10px;padding:10px;text-align:center}
.estimation b{display:block;color:var(--vert);font-size:18px}
.estimation span{font-size:12px;color:var(--gris)}
.annonces{list-style:none;padding:0;margin:10px 0 0;font-size:14px}
.annonces li{padding:8px 0;border-top:1px solid var(--bord)}
.annonces li b{color:var(--vert);margin-right:6px}
.annonces li small{display:block;color:var(--gris)}
.annonces li.suspect{opacity:.55}
.annonces li.suspect b{text-decoration:line-through}
.suggestions{list-style:none;padding:0;margin:0}
.suggestions li{padding:8px 0;border-top:1px solid var(--bord);font-size:15px}
.suggestions li:first-child{border-top:0}
.suggestions small{color:var(--gris)}
details{margin-top:10px}
summary{cursor:pointer;color:var(--vert);font-weight:600;font-size:14px}
details textarea{margin:8px 0}
.test{background:var(--fond);padding:10px;border-radius:10px;font-weight:600;word-break:break-word}
.version{text-align:center;color:var(--gris);font-size:12px;margin:20px 0}
#mm-toast{position:fixed;left:50%;bottom:calc(80px + env(safe-area-inset-bottom));transform:translateX(-50%) translateY(20px);background:var(--vert);color:#fff;padding:10px 16px;border-radius:12px;font-size:14px;opacity:0;transition:.25s;z-index:20;max-width:90%;text-align:center;pointer-events:none}
#mm-toast.visible{opacity:1;transform:translateX(-50%) translateY(0)}
`;
    document.head.appendChild(s);
  }

  // =============== 17. DÉMARRAGE ===============
  function demarrer() {
    injecterStyle();
    if (!document.getElementById('app')) { const d = document.createElement('div'); d.id = 'app'; document.body.appendChild(d); }
    brancher();
    rendre();
    enregistrerServiceWorker();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
