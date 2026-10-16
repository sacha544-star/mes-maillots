'use strict';
(function () {
  /* ============================================================
     Mes Maillots · v2.0 · sans IA · design façon Discogs
     Accueil personnalisé, favoris, wishlist, suggestions,
     identification Google Lens (SerpApi via relais Cloudflare),
     prix Vinted/Leboncoin/eBay avec filtre anti-arnaque.
     ============================================================ */

  // =============== 1. CONSTANTES ===============
  const VERSION = '2.0';
  const QUOTA = 250;
  const CLE_COLLECTION = 'mm_collection';
  const CLE_WISHLIST = 'mm_wishlist';
  const CLE_PARAMS = 'mm_params';
  const CLE_QUOTA = 'mm_quota';
  const TYPES = ['Domicile', 'Extérieur', 'Third', 'Gardien', 'Entraînement', 'Autre'];
  const ETATS = ['', 'Neuf avec étiquette', 'Neuf sans étiquette', 'Très bon', 'Bon', 'Usé'];
  const TAILLES = ['', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Enfant'];
  const PRIORITES = ['Normale', 'Haute', 'Rêve absolu'];

  // =============== 2. DICTIONNAIRES ===============
  const CLUBS_BRUT = [
    // France
    ['Paris Saint-Germain', 'France', 'psg|paris saint germain|paris saint-germain|paris sg|paris-sg'],
    ['Olympique de Marseille', 'France', 'olympique de marseille|marseille|om'],
    ['Olympique Lyonnais', 'France', 'olympique lyonnais|lyon|ol'],
    ['AS Monaco', 'France', 'as monaco|monaco|asm'],
    ['LOSC Lille', 'France', 'losc|lille'],
    ['AS Saint-Étienne', 'France', 'saint etienne|saint-etienne|asse|st etienne'],
    ['Girondins de Bordeaux', 'France', 'girondins|bordeaux'],
    ['FC Nantes', 'France', 'fc nantes|nantes|canaris'],
    ['RC Lens', 'France', 'rc lens|racing club de lens|sang et or'],
    ['Stade Rennais', 'France', 'stade rennais|rennes'],
    ['OGC Nice', 'France', 'ogc nice|ogcn|nice'],
    ['RC Strasbourg', 'France', 'rc strasbourg|strasbourg|racing strasbourg'],
    ['Montpellier HSC', 'France', 'montpellier|mhsc'],
    ['Toulouse FC', 'France', 'toulouse fc|toulouse|tfc'],
    ['Stade de Reims', 'France', 'stade de reims|reims'],
    ['AJ Auxerre', 'France', 'aj auxerre|auxerre|aja'],
    ['FC Metz', 'France', 'fc metz|metz'],
    ['Stade Brestois', 'France', 'stade brestois|brest'],
    ['Le Havre AC', 'France', 'le havre|hac'],
    ['FC Lorient', 'France', 'fc lorient|lorient'],
    ['Angers SCO', 'France', 'angers|sco angers'],
    ['SM Caen', 'France', 'sm caen|caen'],
    ['EA Guingamp', 'France', 'guingamp|eag'],
    ['FC Sochaux', 'France', 'sochaux|fcsm'],
    ['RC Lens', 'France', 'lens'],
    ['Nîmes Olympique', 'France', 'nimes'],
    ['Dijon FCO', 'France', 'dijon|dfco'],
    ['Amiens SC', 'France', 'amiens'],
    ['ESTAC Troyes', 'France', 'troyes|estac'],
    ['Clermont Foot', 'France', 'clermont foot|clermont'],
    ['SC Bastia', 'France', 'sc bastia|bastia'],
    ['AC Ajaccio', 'France', 'ac ajaccio|ajaccio'],
    ['Paris FC', 'France', 'paris fc'],
    ['Red Star FC', 'France', 'red star fc|red star paris'],
    ['Valenciennes FC', 'France', 'valenciennes|vafc'],
    ['Grenoble Foot', 'France', 'grenoble'],
    ['Nancy', 'France', 'as nancy|nancy lorraine|asnl|nancy'],
    ['Le Mans FC', 'France', 'le mans'],
    ['Racing Club de France', 'France', 'racing club de france|matra racing|racing paris'],
    ['CS Sedan', 'France', 'sedan'],
    ['Stade Lavallois', 'France', 'laval|stade lavallois'],
    // Angleterre
    ['Manchester United', 'Angleterre', 'manchester united|man utd|man united|manchester utd|mufc'],
    ['Manchester City', 'Angleterre', 'manchester city|man city|mcfc'],
    ['Liverpool FC', 'Angleterre', 'liverpool|lfc'],
    ['Chelsea FC', 'Angleterre', 'chelsea|cfc'],
    ['Arsenal FC', 'Angleterre', 'arsenal|gunners'],
    ['Tottenham Hotspur', 'Angleterre', 'tottenham|spurs'],
    ['Leeds United', 'Angleterre', 'leeds'],
    ['Newcastle United', 'Angleterre', 'newcastle|nufc'],
    ['Aston Villa', 'Angleterre', 'aston villa|villa'],
    ['Everton FC', 'Angleterre', 'everton'],
    ['West Ham United', 'Angleterre', 'west ham'],
    ['Leicester City', 'Angleterre', 'leicester'],
    ['Nottingham Forest', 'Angleterre', 'nottingham forest|nottingham'],
    ['Wolverhampton', 'Angleterre', 'wolverhampton|wolves'],
    ['Brighton', 'Angleterre', 'brighton|brighton hove albion'],
    ['Crystal Palace', 'Angleterre', 'crystal palace'],
    ['Fulham FC', 'Angleterre', 'fulham'],
    ['Brentford FC', 'Angleterre', 'brentford'],
    ['Southampton FC', 'Angleterre', 'southampton|saints'],
    ['Sunderland AFC', 'Angleterre', 'sunderland'],
    ['Middlesbrough', 'Angleterre', 'middlesbrough|boro'],
    ['Blackburn Rovers', 'Angleterre', 'blackburn'],
    ['Sheffield United', 'Angleterre', 'sheffield united'],
    ['Sheffield Wednesday', 'Angleterre', 'sheffield wednesday'],
    ['Derby County', 'Angleterre', 'derby county'],
    ['Ipswich Town', 'Angleterre', 'ipswich'],
    ['Norwich City', 'Angleterre', 'norwich'],
    ['Coventry City', 'Angleterre', 'coventry'],
    ['Burnley FC', 'Angleterre', 'burnley'],
    ['Bolton Wanderers', 'Angleterre', 'bolton'],
    ['Wimbledon', 'Angleterre', 'wimbledon'],
    ['QPR', 'Angleterre', 'qpr|queens park rangers'],
    ['Portsmouth FC', 'Angleterre', 'portsmouth'],
    ['Stoke City', 'Angleterre', 'stoke city|stoke'],
    ['West Bromwich Albion', 'Angleterre', 'west brom|west bromwich'],
    ['Birmingham City', 'Angleterre', 'birmingham city'],
    ['Charlton Athletic', 'Angleterre', 'charlton'],
    ['Wrexham AFC', 'Pays de Galles', 'wrexham'],
    ['Cardiff City', 'Pays de Galles', 'cardiff'],
    ['Swansea City', 'Pays de Galles', 'swansea'],
    // Espagne
    ['Real Madrid', 'Espagne', 'real madrid|madrid cf'],
    ['FC Barcelone', 'Espagne', 'fc barcelone|barcelone|barcelona|barca|fcb|blaugrana'],
    ['Atlético de Madrid', 'Espagne', 'atletico madrid|atletico de madrid|atletico|atleti'],
    ['Séville FC', 'Espagne', 'sevilla|seville|sevilla fc'],
    ['Valence CF', 'Espagne', 'valencia cf|valencia|valence cf'],
    ['Athletic Bilbao', 'Espagne', 'athletic bilbao|athletic club|bilbao'],
    ['Real Sociedad', 'Espagne', 'real sociedad'],
    ['Real Betis', 'Espagne', 'real betis|betis'],
    ['Villarreal CF', 'Espagne', 'villarreal'],
    ['Deportivo La Corogne', 'Espagne', 'deportivo|la coruna|deportivo la coruna|depor'],
    ['Celta Vigo', 'Espagne', 'celta|celta vigo|celta de vigo'],
    ['Espanyol', 'Espagne', 'espanyol'],
    ['Real Valladolid', 'Espagne', 'valladolid'],
    ['Real Zaragoza', 'Espagne', 'zaragoza|saragosse'],
    ['Málaga CF', 'Espagne', 'malaga'],
    ['Getafe CF', 'Espagne', 'getafe'],
    ['Osasuna', 'Espagne', 'osasuna'],
    ['RCD Majorque', 'Espagne', 'mallorca|majorque'],
    ['Las Palmas', 'Espagne', 'las palmas'],
    ['Girona FC', 'Espagne', 'girona|gerone'],
    ['Rayo Vallecano', 'Espagne', 'rayo vallecano|rayo'],
    ['Deportivo Alavés', 'Espagne', 'alaves'],
    ['Real Oviedo', 'Espagne', 'oviedo'],
    ['Sporting Gijón', 'Espagne', 'sporting gijon|gijon'],
    // Italie
    ['Juventus', 'Italie', 'juventus|juve|bianconeri'],
    ['AC Milan', 'Italie', 'ac milan|milan ac|milan|rossoneri'],
    ['Inter Milan', 'Italie', 'inter milan|inter|internazionale|fc internazionale|nerazzurri'],
    ['SSC Naples', 'Italie', 'napoli|naples|ssc napoli'],
    ['AS Roma', 'Italie', 'as roma|roma|giallorossi'],
    ['Lazio Rome', 'Italie', 'lazio|ss lazio'],
    ['Fiorentina', 'Italie', 'fiorentina|viola'],
    ['Atalanta', 'Italie', 'atalanta|bergamo'],
    ['Torino FC', 'Italie', 'torino|toro'],
    ['Parme', 'Italie', 'parma|parme'],
    ['Sampdoria', 'Italie', 'sampdoria|samp'],
    ['Genoa CFC', 'Italie', 'genoa'],
    ['Bologne FC', 'Italie', 'bologna|bologne'],
    ['Udinese', 'Italie', 'udinese'],
    ['Cagliari', 'Italie', 'cagliari'],
    ['Hellas Vérone', 'Italie', 'hellas verona|verona|verone'],
    ['US Palerme', 'Italie', 'palermo|palerme'],
    ['US Lecce', 'Italie', 'lecce'],
    ['Sassuolo', 'Italie', 'sassuolo'],
    ['Empoli', 'Italie', 'empoli'],
    ['Brescia', 'Italie', 'brescia'],
    ['Venezia FC', 'Italie', 'venezia|venise'],
    ['Como 1907', 'Italie', 'como 1907|como'],
    ['Monza', 'Italie', 'monza'],
    ['Bari', 'Italie', 'bari'],
    ['Perugia', 'Italie', 'perugia'],
    ['Chievo Vérone', 'Italie', 'chievo'],
    // Allemagne
    ['Bayern Munich', 'Allemagne', 'bayern munich|bayern munchen|bayern|fc bayern'],
    ['Borussia Dortmund', 'Allemagne', 'borussia dortmund|dortmund|bvb'],
    ['Schalke 04', 'Allemagne', 'schalke'],
    ['Bayer Leverkusen', 'Allemagne', 'bayer leverkusen|leverkusen'],
    ['Borussia Mönchengladbach', 'Allemagne', 'monchengladbach|gladbach|borussia mg'],
    ['Eintracht Francfort', 'Allemagne', 'eintracht frankfurt|eintracht|francfort|frankfurt'],
    ['RB Leipzig', 'Allemagne', 'rb leipzig|leipzig'],
    ['Hambourg SV', 'Allemagne', 'hamburger sv|hamburg|hambourg|hsv'],
    ['VfB Stuttgart', 'Allemagne', 'stuttgart'],
    ['Werder Brême', 'Allemagne', 'werder bremen|werder|bremen|breme'],
    ['VfL Wolfsburg', 'Allemagne', 'wolfsburg'],
    ['1. FC Köln', 'Allemagne', 'fc koln|koln|cologne'],
    ['Hertha Berlin', 'Allemagne', 'hertha|hertha bsc|hertha berlin'],
    ['Union Berlin', 'Allemagne', 'union berlin'],
    ['SC Fribourg', 'Allemagne', 'freiburg|fribourg'],
    ['TSG Hoffenheim', 'Allemagne', 'hoffenheim'],
    ['Mayence 05', 'Allemagne', 'mainz|mayence'],
    ['FC Augsbourg', 'Allemagne', 'augsburg|augsbourg'],
    ['1. FC Kaiserslautern', 'Allemagne', 'kaiserslautern'],
    ['1. FC Nuremberg', 'Allemagne', 'nurnberg|nuremberg'],
    ['Fortuna Düsseldorf', 'Allemagne', 'fortuna dusseldorf|dusseldorf'],
    ['FC St. Pauli', 'Allemagne', 'st pauli|sankt pauli'],
    ['Hansa Rostock', 'Allemagne', 'hansa rostock|rostock'],
    ['Dynamo Dresde', 'Allemagne', 'dynamo dresden|dresden|dresde'],
    ['Bochum', 'Allemagne', 'bochum'],
    // Pays-Bas
    ['Ajax Amsterdam', 'Pays-Bas', 'ajax|afc ajax'],
    ['PSV Eindhoven', 'Pays-Bas', 'psv|eindhoven'],
    ['Feyenoord', 'Pays-Bas', 'feyenoord'],
    ['AZ Alkmaar', 'Pays-Bas', 'az alkmaar|alkmaar'],
    ['FC Twente', 'Pays-Bas', 'twente'],
    ['FC Utrecht', 'Pays-Bas', 'fc utrecht|utrecht'],
    ['Vitesse Arnhem', 'Pays-Bas', 'vitesse'],
    ['FC Groningue', 'Pays-Bas', 'groningen|groningue'],
    // Portugal
    ['Benfica', 'Portugal', 'benfica|sl benfica'],
    ['FC Porto', 'Portugal', 'fc porto|porto|fcp'],
    ['Sporting CP', 'Portugal', 'sporting cp|sporting lisbonne|sporting clube|sporting lisbon|sporting'],
    ['SC Braga', 'Portugal', 'braga|sc braga'],
    ['Vitória Guimarães', 'Portugal', 'guimaraes|vitoria guimaraes'],
    ['Boavista FC', 'Portugal', 'boavista'],
    // Belgique
    ['RSC Anderlecht', 'Belgique', 'anderlecht'],
    ['Club Bruges', 'Belgique', 'club brugge|bruges|brugge'],
    ['Standard de Liège', 'Belgique', 'standard liege|standard de liege|standard'],
    ['KRC Genk', 'Belgique', 'genk'],
    ['KAA La Gantoise', 'Belgique', 'kaa gent|gent|la gantoise|gand'],
    ['Royal Antwerp', 'Belgique', 'antwerp|anvers'],
    ['Union Saint-Gilloise', 'Belgique', 'union saint gilloise|union sg|saint gilloise'],
    ['Cercle Bruges', 'Belgique', 'cercle brugge|cercle bruges'],
    ['Sporting Charleroi', 'Belgique', 'charleroi'],
    // Écosse, Irlande
    ['Celtic Glasgow', 'Écosse', 'celtic|celtic fc|celtic glasgow'],
    ['Rangers FC', 'Écosse', 'rangers|glasgow rangers'],
    ['Aberdeen FC', 'Écosse', 'aberdeen'],
    ['Heart of Midlothian', 'Écosse', 'hearts|heart of midlothian'],
    ['Hibernian FC', 'Écosse', 'hibernian|hibs'],
    ['Shamrock Rovers', 'Irlande', 'shamrock rovers'],
    // Suisse, Autriche
    ['FC Bâle', 'Suisse', 'fc basel|basel|bale'],
    ['Young Boys', 'Suisse', 'young boys|bsc young boys'],
    ['FC Zurich', 'Suisse', 'fc zurich|zurich'],
    ['Servette FC', 'Suisse', 'servette'],
    ['Grasshopper', 'Suisse', 'grasshopper'],
    ['Red Bull Salzbourg', 'Autriche', 'red bull salzburg|salzburg|salzbourg'],
    ['Rapid Vienne', 'Autriche', 'rapid wien|rapid vienne|rapid vienna'],
    ['Austria Vienne', 'Autriche', 'austria wien|austria vienne|austria vienna'],
    ['Sturm Graz', 'Autriche', 'sturm graz'],
    // Scandinavie
    ['FC Copenhague', 'Danemark', 'fc kobenhavn|copenhague|copenhagen|fck'],
    ['Brøndby IF', 'Danemark', 'brondby'],
    ['FC Midtjylland', 'Danemark', 'midtjylland'],
    ['Malmö FF', 'Suède', 'malmo|malmo ff'],
    ['AIK Stockholm', 'Suède', 'aik|aik stockholm'],
    ['IFK Göteborg', 'Suède', 'ifk goteborg|goteborg'],
    ['Hammarby IF', 'Suède', 'hammarby'],
    ['Rosenborg BK', 'Norvège', 'rosenborg'],
    ['Molde FK', 'Norvège', 'molde'],
    ['FK Bodø/Glimt', 'Norvège', 'bodo glimt|bodo'],
    ['HJK Helsinki', 'Finlande', 'hjk|hjk helsinki'],
    // Turquie, Grèce, Chypre
    ['Galatasaray', 'Turquie', 'galatasaray|cimbom'],
    ['Fenerbahçe', 'Turquie', 'fenerbahce|fener'],
    ['Beşiktaş', 'Turquie', 'besiktas'],
    ['Trabzonspor', 'Turquie', 'trabzonspor'],
    ['Başakşehir', 'Turquie', 'basaksehir'],
    ['Olympiakos', 'Grèce', 'olympiakos|olympiacos'],
    ['Panathinaïkos', 'Grèce', 'panathinaikos'],
    ['AEK Athènes', 'Grèce', 'aek athens|aek athenes|aek'],
    ['PAOK Salonique', 'Grèce', 'paok'],
    ['APOEL Nicosie', 'Chypre', 'apoel'],
    // Europe de l'Est
    ['Zenit Saint-Pétersbourg', 'Russie', 'zenit'],
    ['Spartak Moscou', 'Russie', 'spartak moscow|spartak moscou|spartak'],
    ['CSKA Moscou', 'Russie', 'cska moscow|cska moscou|cska'],
    ['Lokomotiv Moscou', 'Russie', 'lokomotiv moscow|lokomotiv moscou|lokomotiv'],
    ['Dynamo Moscou', 'Russie', 'dynamo moscow|dynamo moscou'],
    ['Shakhtar Donetsk', 'Ukraine', 'shakhtar|shakhtar donetsk'],
    ['Dynamo Kiev', 'Ukraine', 'dynamo kyiv|dynamo kiev|dinamo kiev'],
    ['Legia Varsovie', 'Pologne', 'legia|legia warszawa|legia varsovie'],
    ['Lech Poznań', 'Pologne', 'lech poznan'],
    ['Wisła Cracovie', 'Pologne', 'wisla krakow|wisla cracovie'],
    ['Sparta Prague', 'Tchéquie', 'sparta praha|sparta prague|sparta'],
    ['Slavia Prague', 'Tchéquie', 'slavia praha|slavia prague|slavia'],
    ['Viktoria Plzeň', 'Tchéquie', 'viktoria plzen|plzen'],
    ['Slovan Bratislava', 'Slovaquie', 'slovan bratislava'],
    ['Ferencváros', 'Hongrie', 'ferencvaros|fradi'],
    ['Steaua Bucarest', 'Roumanie', 'steaua|fcsb|steaua bucuresti|steaua bucarest'],
    ['Dinamo Bucarest', 'Roumanie', 'dinamo bucuresti|dinamo bucarest'],
    ['CFR Cluj', 'Roumanie', 'cfr cluj|cluj'],
    ['Ludogorets', 'Bulgarie', 'ludogorets'],
    ['Levski Sofia', 'Bulgarie', 'levski'],
    ['CSKA Sofia', 'Bulgarie', 'cska sofia'],
    ['Étoile Rouge de Belgrade', 'Serbie', 'etoile rouge|red star belgrade|crvena zvezda|zvezda'],
    ['Partizan Belgrade', 'Serbie', 'partizan'],
    ['Dinamo Zagreb', 'Croatie', 'dinamo zagreb'],
    ['Hajduk Split', 'Croatie', 'hajduk split|hajduk'],
    ['Maribor', 'Slovénie', 'nk maribor|maribor'],
    ['Maccabi Tel-Aviv', 'Israël', 'maccabi tel aviv'],
    ['Maccabi Haïfa', 'Israël', 'maccabi haifa'],
    ['Qarabağ FK', 'Azerbaïdjan', 'qarabag'],
    ['BATE Borisov', 'Biélorussie', 'bate borisov|bate'],
    // Amérique du Sud
    ['Boca Juniors', 'Argentine', 'boca juniors|boca|xeneize'],
    ['River Plate', 'Argentine', 'river plate|river'],
    ['Racing Club', 'Argentine', 'racing club|racing avellaneda'],
    ['Independiente', 'Argentine', 'independiente'],
    ['San Lorenzo', 'Argentine', 'san lorenzo'],
    ['Newell’s Old Boys', 'Argentine', 'newells|newell s old boys|newells old boys'],
    ['Rosario Central', 'Argentine', 'rosario central'],
    ['Estudiantes', 'Argentine', 'estudiantes'],
    ['Vélez Sarsfield', 'Argentine', 'velez|velez sarsfield'],
    ['Argentinos Juniors', 'Argentine', 'argentinos juniors'],
    ['Flamengo', 'Brésil', 'flamengo|mengao'],
    ['Santos FC', 'Brésil', 'santos|santos fc'],
    ['Palmeiras', 'Brésil', 'palmeiras'],
    ['Corinthians', 'Brésil', 'corinthians'],
    ['São Paulo FC', 'Brésil', 'sao paulo|sao paulo fc'],
    ['Fluminense', 'Brésil', 'fluminense'],
    ['Vasco da Gama', 'Brésil', 'vasco|vasco da gama'],
    ['Botafogo', 'Brésil', 'botafogo'],
    ['Grêmio', 'Brésil', 'gremio'],
    ['Internacional', 'Brésil', 'internacional|inter de porto alegre'],
    ['Cruzeiro', 'Brésil', 'cruzeiro'],
    ['Atlético Mineiro', 'Brésil', 'atletico mineiro|galo'],
    ['Peñarol', 'Uruguay', 'penarol'],
    ['Nacional', 'Uruguay', 'club nacional|nacional montevideo|nacional'],
    ['Colo-Colo', 'Chili', 'colo colo|colo-colo'],
    ['Universidad de Chile', 'Chili', 'universidad de chile|la u'],
    ['Atlético Nacional', 'Colombie', 'atletico nacional'],
    ['Millonarios', 'Colombie', 'millonarios'],
    ['América de Cali', 'Colombie', 'america de cali'],
    ['Alianza Lima', 'Pérou', 'alianza lima'],
    ['Universitario', 'Pérou', 'universitario'],
    ['Olimpia', 'Paraguay', 'club olimpia|olimpia'],
    ['Cerro Porteño', 'Paraguay', 'cerro porteno'],
    ['LDU Quito', 'Équateur', 'ldu quito|liga de quito'],
    ['Barcelona SC', 'Équateur', 'barcelona sc|barcelona guayaquil'],
    // Amérique du Nord
    ['Club América', 'Mexique', 'club america|america mexico|aguilas'],
    ['Chivas Guadalajara', 'Mexique', 'chivas|guadalajara'],
    ['Cruz Azul', 'Mexique', 'cruz azul'],
    ['Pumas UNAM', 'Mexique', 'pumas|unam'],
    ['Tigres UANL', 'Mexique', 'tigres|tigres uanl'],
    ['CF Monterrey', 'Mexique', 'monterrey|rayados'],
    ['Inter Miami', 'États-Unis', 'inter miami'],
    ['LA Galaxy', 'États-Unis', 'la galaxy|los angeles galaxy'],
    ['LAFC', 'États-Unis', 'lafc|los angeles fc'],
    ['Seattle Sounders', 'États-Unis', 'seattle sounders|sounders'],
    ['Atlanta United', 'États-Unis', 'atlanta united'],
    ['New York City FC', 'États-Unis', 'new york city fc|nycfc'],
    ['New York Red Bulls', 'États-Unis', 'new york red bulls|ny red bulls|metrostars'],
    ['DC United', 'États-Unis', 'dc united|d c united'],
    ['Portland Timbers', 'États-Unis', 'portland timbers'],
    ['Chicago Fire', 'États-Unis', 'chicago fire'],
    ['CF Montréal', 'Canada', 'cf montreal|impact de montreal|montreal impact'],
    ['Toronto FC', 'Canada', 'toronto fc'],
    ['Vancouver Whitecaps', 'Canada', 'whitecaps|vancouver'],
    // Asie, Océanie
    ['Al-Nassr', 'Arabie saoudite', 'al nassr|al-nassr|alnassr'],
    ['Al-Hilal', 'Arabie saoudite', 'al hilal|al-hilal|alhilal'],
    ['Al-Ittihad', 'Arabie saoudite', 'al ittihad|al-ittihad'],
    ['Al-Ahli Djeddah', 'Arabie saoudite', 'al ahli|al-ahli'],
    ['Al-Sadd', 'Qatar', 'al sadd|al-sadd'],
    ['Al-Ain FC', 'Émirats arabes unis', 'al ain|al-ain'],
    ['Urawa Red Diamonds', 'Japon', 'urawa|urawa reds'],
    ['Kashima Antlers', 'Japon', 'kashima antlers|kashima'],
    ['Yokohama F. Marinos', 'Japon', 'yokohama f marinos|yokohama marinos|marinos'],
    ['Gamba Osaka', 'Japon', 'gamba osaka'],
    ['Vissel Kobe', 'Japon', 'vissel kobe|vissel'],
    ['Kawasaki Frontale', 'Japon', 'kawasaki frontale'],
    ['Jubilo Iwata', 'Japon', 'jubilo iwata'],
    ['Nagoya Grampus', 'Japon', 'nagoya grampus'],
    ['FC Séoul', 'Corée du Sud', 'fc seoul'],
    ['Jeonbuk Hyundai', 'Corée du Sud', 'jeonbuk'],
    ['Ulsan HD', 'Corée du Sud', 'ulsan'],
    ['Guangzhou FC', 'Chine', 'guangzhou evergrande|guangzhou'],
    ['Shanghai Shenhua', 'Chine', 'shanghai shenhua'],
    ['Beijing Guoan', 'Chine', 'beijing guoan'],
    ['Persepolis', 'Iran', 'persepolis'],
    ['Esteghlal', 'Iran', 'esteghlal'],
    ['Melbourne Victory', 'Australie', 'melbourne victory'],
    ['Sydney FC', 'Australie', 'sydney fc'],
    ['Auckland City', 'Nouvelle-Zélande', 'auckland city'],
    // Afrique
    ['Al Ahly', 'Égypte', 'al ahly|al-ahly|ahly'],
    ['Zamalek', 'Égypte', 'zamalek'],
    ['Raja Casablanca', 'Maroc', 'raja casablanca|raja'],
    ['Wydad Casablanca', 'Maroc', 'wydad|wydad casablanca|wac'],
    ['Espérance de Tunis', 'Tunisie', 'esperance|esperance de tunis|est tunis'],
    ['Club Africain', 'Tunisie', 'club africain'],
    ['Étoile du Sahel', 'Tunisie', 'etoile du sahel'],
    ['MC Alger', 'Algérie', 'mc alger|mouloudia'],
    ['JS Kabylie', 'Algérie', 'js kabylie|jsk'],
    ['USM Alger', 'Algérie', 'usm alger|usma'],
    ['TP Mazembe', 'RD Congo', 'tp mazembe|mazembe'],
    ['Mamelodi Sundowns', 'Afrique du Sud', 'mamelodi sundowns|sundowns'],
    ['Kaizer Chiefs', 'Afrique du Sud', 'kaizer chiefs'],
    ['Orlando Pirates', 'Afrique du Sud', 'orlando pirates'],
    ['ASEC Mimosas', "Côte d'Ivoire", 'asec mimosas|asec'],
    ['Hearts of Oak', 'Ghana', 'hearts of oak'],
    ['Asante Kotoko', 'Ghana', 'asante kotoko|kotoko'],
    ['Enyimba', 'Nigeria', 'enyimba'],
    ['Al-Merrikh', 'Soudan', 'al merrikh'],
    ['Simba SC', 'Tanzanie', 'simba sc']
  ];

  const SELECTIONS_BRUT = [
    // Europe
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
    // Amérique du Sud
    ['Brésil', 'Brésil', 'bresil|brasil|brazil|cbf|selecao'],
    ['Argentine', 'Argentine', 'argentine|argentina|afa|albiceleste'],
    ['Uruguay', 'Uruguay', 'uruguay|celeste|auf'],
    ['Colombie', 'Colombie', 'colombie|colombia|cafeteros'],
    ['Chili', 'Chili', 'chili|chile'],
    ['Pérou', 'Pérou', 'perou|peru|blanquirroja'],
    ['Paraguay', 'Paraguay', 'paraguay|albirroja'],
    ['Équateur', 'Équateur', 'equateur|ecuador|la tri'],
    ['Bolivie', 'Bolivie', 'bolivie|bolivia'],
    ['Venezuela', 'Venezuela', 'venezuela|vinotinto'],
    // Amérique du Nord, centrale, Caraïbes
    ['Mexique', 'Mexique', 'mexique|mexico|el tri'],
    ['États-Unis', 'États-Unis', 'etats unis|etats-unis|usa|united states|usmnt|us soccer'],
    ['Canada', 'Canada', 'canada'],
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
    ['Grenade', 'Grenade', 'grenada'],
    ['Sainte-Lucie', 'Sainte-Lucie', 'sainte lucie|saint lucia|st lucia'],
    ['Saint-Vincent-et-les-Grenadines', 'Saint-Vincent-et-les-Grenadines', 'saint vincent|st vincent|grenadines'],
    ['Saint-Kitts-et-Nevis', 'Saint-Kitts-et-Nevis', 'saint kitts|st kitts|nevis'],
    ['Antigua-et-Barbuda', 'Antigua-et-Barbuda', 'antigua|antigua and barbuda|barbuda'],
    ['Dominique', 'Dominique', 'dominica'],
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
    ['Saint-Martin', 'Saint-Martin', 'sint maarten'],
    // Afrique
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
    ['Niger', 'Niger', 'niger'],
    ['Togo', 'Togo', 'togo|eperviers'],
    ['Bénin', 'Bénin', 'benin|ecureuils'],
    ['Gambie', 'Gambie', 'gambie|gambia'],
    ['Sierra Leone', 'Sierra Leone', 'sierra leone'],
    ['Liberia', 'Liberia', 'liberia'],
    ['Mauritanie', 'Mauritanie', 'mauritanie|mauritania|mourabitounes'],
    ['Cap-Vert', 'Cap-Vert', 'cap vert|cabo verde|cape verde'],
    ['RD Congo', 'RD Congo', 'rd congo|rdc|dr congo|congo kinshasa|congo rdc|leopards|zaire'],
    ['Congo', 'Congo', 'congo|congo brazzaville'],
    ['Gabon', 'Gabon', 'gabon|pantheres'],
    ['Centrafrique', 'Centrafrique', 'centrafrique|central african republic'],
    ['Tchad', 'Tchad', 'tchad|chad'],
    ['Angola', 'Angola', 'angola|palancas negras'],
    ['Zambie', 'Zambie', 'zambie|zambia|chipolopolo'],
    ['Zimbabwe', 'Zimbabwe', 'zimbabwe'],
    ['Mozambique', 'Mozambique', 'mozambique|mambas'],
    ['Malawi', 'Malawi', 'malawi'],
    ['Namibie', 'Namibie', 'namibie|namibia'],
    ['Botswana', 'Botswana', 'botswana'],
    ['Afrique du Sud', 'Afrique du Sud', 'afrique du sud|south africa|bafana bafana|bafana'],
    ['Lesotho', 'Lesotho', 'lesotho'],
    ['Eswatini', 'Eswatini', 'eswatini|swaziland'],
    ['Madagascar', 'Madagascar', 'madagascar|barea'],
    ['Maurice', 'Maurice', 'ile maurice|mauritius'],
    ['Seychelles', 'Seychelles', 'seychelles'],
    ['Comores', 'Comores', 'comores|comoros|coelacanthes'],
    ['La Réunion', 'La Réunion', 'la reunion'],
    ['Tanzanie', 'Tanzanie', 'tanzanie|tanzania|taifa stars'],
    ['Kenya', 'Kenya', 'kenya|harambee stars'],
    ['Ouganda', 'Ouganda', 'ouganda|uganda'],
    ['Rwanda', 'Rwanda', 'rwanda|amavubi'],
    ['Burundi', 'Burundi', 'burundi'],
    ['Éthiopie', 'Éthiopie', 'ethiopie|ethiopia'],
    ['Érythrée', 'Érythrée', 'erythree|eritrea'],
    ['Djibouti', 'Djibouti', 'djibouti'],
    ['Somalie', 'Somalie', 'somalie|somalia'],
    ['Soudan', 'Soudan', 'soudan|sudan'],
    ['Soudan du Sud', 'Soudan du Sud', 'soudan du sud|south sudan'],
    ['São Tomé-et-Príncipe', 'São Tomé-et-Príncipe', 'sao tome|sao tome et principe|sao tome and principe'],
    // Asie
    ['Japon', 'Japon', 'japon|japan|nippon|samurai blue|jfa'],
    ['Corée du Sud', 'Corée du Sud', 'coree|coree du sud|south korea|korea republic|korea|taeguk warriors|kfa'],
    ['Corée du Nord', 'Corée du Nord', 'coree du nord|north korea|dprk|dpr korea'],
    ['Chine', 'Chine', 'chine|china|pr china|team china'],
    ['Taïwan', 'Taïwan', 'taiwan|chinese taipei|taipei'],
    ['Hong Kong', 'Hong Kong', 'hong kong'],
    ['Macao', 'Macao', 'macao|macau'],
    ['Mongolie', 'Mongolie', 'mongolie|mongolia'],
    ['Australie', 'Australie', 'australie|australia|socceroos'],
    ['Arabie saoudite', 'Arabie saoudite', 'arabie saoudite|saudi arabia|saudi|green falcons'],
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
    // Océanie
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
    // Historiques et régionales
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

  const MARQUES_BRUT = [
    'Nike', 'Adidas', 'Puma', 'Umbro', 'Kappa', 'Le Coq Sportif|coq sportif', 'Macron', 'Hummel',
    'Joma', 'New Balance', 'Under Armour', 'Lotto', 'Diadora', 'Reebok', 'Erreà|errea', 'Castore',
    'Mizuno', 'Uhlsport', 'Asics', 'Patrick', 'Admiral', 'Fila', 'Warrior', 'Jako', 'Kelme',
    'Duarig', 'Score Draw', 'Legea', 'Givova', 'Zeus', 'Craft', 'Select', 'Hummel', 'Topper', 'Penalty', 'Olympikus'
  ];

  const SPONSORS_BRUT = [
    'Emirates|fly emirates', 'Qatar Airways', 'Etihad', 'Opel', 'Sharp', 'Vodafone', 'AIG', 'Aon',
    'Chevrolet', 'TeamViewer', 'Carlsberg', 'Standard Chartered', 'Samsung', 'Yokohama', 'JVC',
    'O2', 'Siemens', 'Bwin', 'Rakuten', 'Spotify', 'Teka', 'Unicef', 'Jeep', 'Pirelli', 'T-Mobile',
    'Deutsche Telekom', 'Evonik', '1&1', 'Hyundai', 'Orange', 'Pizza Hut', 'Accor|all accor|accorhotels',
    'Qatar Tourism|visit qatar', 'Intermarché', 'Coca-Cola|coca cola', 'Veolia', 'Partouche',
    'Parmalat', 'Mars', 'Sony', 'Panasonic', 'Canon', 'Philips', 'Candy', 'Danone', 'Jupiler', 'Toyota', 'Lipton', 'Petrobras'
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
  const NOMS_SELECTIONS = new Set(SELECTIONS.map(s => s.nom));

  // =============== 3. UTILITAIRES ===============
  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function euros(v) {
    if (v == null || v === '' || isNaN(v)) return '—';
    return Number(v).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €';
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
  function titreMaillot(m) { return [m.club || 'Maillot', m.saison, m.type && m.type !== 'Domicile' ? m.type : ''].filter(Boolean).join(' · '); }
  function estSelection(m) { return NOMS_SELECTIONS.has(m.club); }

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
      numero: '', taille: '', etat: '', prixAchat: '', prixEstime: '', photo: '', notes: '', favori: false, date: new Date().toISOString() };
  }
  function lireWishlist() { return lireJSON(CLE_WISHLIST, []); }
  function ecrireWishlist(w) { return ecrireJSON(CLE_WISHLIST, w); }
  function trouverSouhait(id) { return lireWishlist().find(s => s.id === id) || null; }
  function sauverSouhait(s) {
    const w = lireWishlist();
    const i = w.findIndex(x => x.id === s.id);
    if (i >= 0) w[i] = s; else w.unshift(s);
    return ecrireWishlist(w);
  }
  function supprimerSouhait(id) { ecrireWishlist(lireWishlist().filter(s => s.id !== id)); }
  function nouveauSouhait() {
    return { id: uid(), club: '', pays: '', saison: '', type: 'Domicile', marque: '', joueur: '', taille: '', budget: '', priorite: 'Normale', notes: '', date: new Date().toISOString() };
  }

  // =============== 5. PARAMÈTRES ET QUOTA ===============
  function lireParams() { return Object.assign({ relais: '', code: '', prenom: '' }, lireJSON(CLE_PARAMS, {})); }
  function ecrireParams(p) { ecrireJSON(CLE_PARAMS, p); }
  function moisCourant() { return new Date().toISOString().slice(0, 7); }
  function lireQuota() {
    const q = lireJSON(CLE_QUOTA, { mois: moisCourant(), utilise: 0 });
    if (q.mois !== moisCourant()) { q.mois = moisCourant(); q.utilise = 0; ecrireJSON(CLE_QUOTA, q); }
    return q;
  }
  function consommerQuota(n) { const q = lireQuota(); q.utilise += (n || 1); ecrireJSON(CLE_QUOTA, q); }
  function quotaTexte() { const q = lireQuota(); return q.utilise + ' / ' + QUOTA + ' recherches utilisées ce mois'; }

  // =============== 6. RELAIS CLOUDFLARE ===============
  async function relais(action, donnees) {
    const p = lireParams();
    if (!p.relais) throw new Error('Adresse du relais manquante : va dans Réglages.');
    const ctrl = new AbortController();
    const minuteur = setTimeout(() => ctrl.abort(), 30000);
    let rep;
    try {
      rep = await fetch(p.relais.replace(/\/+$/, ''), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ code: p.code, action: action }, donnees || {})), signal: ctrl.signal
      });
    } catch (e) {
      clearTimeout(minuteur);
      if (e.name === 'AbortError') throw new Error('Le relais ne répond pas (délai dépassé).');
      throw new Error('Relais injoignable : vérifie l’adresse dans Réglages et ta connexion.');
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
    const autres = Object.entries(votes.equipe).sort((a, b) => b[1] - a[1]).slice(1, 4).map(e => e[0] + ' (' + e[1] + ')');
    return {
      club: eq ? eq.valeur : '', pays: eq ? pays[eq.valeur] : '', votesClub: eq ? eq.nb : 0, autres: autres,
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
  function analyserAnnonces(liste, budget) {
    const annonces = liste.map(a => {
      const prix = a.prix != null && a.prix !== '' ? Number(a.prix) : extrairePrix((a.titre || '') + ' ' + (a.extrait || ''));
      const texte = normaliser((a.titre || '') + ' ' + (a.extrait || ''));
      return { titre: a.titre || '(sans titre)', lien: a.lien || '', source: a.source || '', prix: prix,
        suspect: MOTS_SUSPECTS.some(mot => texte.includes(mot)), raison: '', bonneAffaire: false };
    }).filter(a => a.prix && a.prix < 5000);
    annonces.forEach(a => { if (a.suspect) a.raison = 'mot suspect (réplique / contrefaçon ?)'; });
    const med1 = mediane(annonces.filter(a => !a.suspect).map(a => a.prix));
    if (med1) annonces.forEach(a => { if (!a.suspect && a.prix < med1 * 0.4) { a.suspect = true; a.raison = 'prix anormalement bas'; } });
    if (budget) annonces.forEach(a => { if (!a.suspect && a.prix <= Number(budget)) a.bonneAffaire = true; });
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
    const col = lireCollection(), wl = lireWishlist();
    const s = [];
    if (!col.length && !wl.length) return s;
    const possede = (club, saison, type) => col.some(m => m.club === club && (!saison || m.saison === saison) && (!type || m.type === type));
    const dejaSouhaite = (club, saison, type) => wl.some(w => w.club === club && (w.saison || '') === (saison || '') && (!type || w.type === type));
    // 1. Compléter les jeux Domicile / Extérieur / Third
    const groupes = {};
    col.forEach(m => { if (!m.club || !m.saison) return; const k = m.club + '|' + m.saison; (groupes[k] = groupes[k] || []).push(m); });
    Object.keys(groupes).forEach(k => {
      const club = k.split('|')[0], saison = k.split('|')[1];
      const types = groupes[k].map(m => m.type);
      const fav = groupes[k].some(m => m.favori);
      ['Domicile', 'Extérieur', 'Third'].filter(t => !types.includes(t) && !dejaSouhaite(club, saison, t)).forEach(t => {
        s.push({ cat: 'Complète tes jeux', poids: fav ? 3 : 2, texte: club + ' ' + saison + ' — il te manque le maillot ' + t, club: club, saison: saison, type: t });
      });
    });
    // 2. Favoris : autres saisons
    const clubsFav = Array.from(new Set(col.filter(m => m.favori && m.club).map(m => m.club)));
    clubsFav.forEach(club => {
      const saisons = Array.from(new Set(col.filter(m => m.club === club && m.saison).map(m => m.saison))).sort();
      s.push({ cat: 'Parce que tu aimes ' + club, poids: 3, texte: 'Explore d’autres saisons de ' + club + (saisons.length ? ' (tu as : ' + saisons.join(', ') + ')' : ''), club: club, saison: '', type: '', requete: club + ' maillot vintage' });
    });
    // 3. La sélection qui va avec tes clubs
    const paysClubs = {};
    col.forEach(m => { if (m.club && !estSelection(m) && m.pays) paysClubs[m.pays] = (paysClubs[m.pays] || 0) + 1; });
    Object.entries(paysClubs).sort((a, b) => b[1] - a[1]).slice(0, 4).forEach(([pays, nb]) => {
      const sel = SELECTIONS.find(x => x.pays === pays && !/Catalogne|Pays basque|Bretagne|Corse/.test(x.nom));
      if (sel && !possede(sel.nom) && !dejaSouhaite(sel.nom, '')) {
        s.push({ cat: 'Du même pays', poids: 1, texte: 'Tu as ' + nb + ' maillot(s) de clubs ' + (pays === 'France' ? 'français' : 'de ' + pays) + ' : et la sélection « ' + sel.nom + ' » ?', club: sel.nom, saison: '', type: 'Domicile' });
      }
    });
    // 4. Clubs les plus présents
    const compteClubs = {};
    col.forEach(m => { if (m.club) compteClubs[m.club] = (compteClubs[m.club] || 0) + 1; });
    Object.entries(compteClubs).sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([club, nb]) => {
      if (clubsFav.includes(club)) return;
      s.push({ cat: 'Tes clubs les plus présents', poids: 2, texte: club + ' : ' + nb + ' maillot(s) — cherche les saisons qui te manquent', club: club, saison: '', type: '', requete: club + ' maillot' });
    });
    // 5. Wishlist à surveiller
    wl.slice(0, 5).forEach(w => {
      s.push({ cat: 'Ta wishlist', poids: w.priorite === 'Rêve absolu' ? 3 : (w.priorite === 'Haute' ? 2 : 1), texte: titreMaillot(w) + (w.budget ? ' — budget ' + euros(w.budget) : ''), wishId: w.id });
    });
    // 6. Fiches à compléter
    col.filter(m => m.prixEstime === '' || m.prixEstime == null).slice(0, 6).forEach(m => {
      s.push({ cat: 'Fiches à compléter', poids: 0, texte: titreMaillot(m) + ' — pas encore de prix estimé', id: m.id });
    });
    col.filter(m => !m.photo).slice(0, 6).forEach(m => {
      s.push({ cat: 'Fiches à compléter', poids: 0, texte: titreMaillot(m) + ' — ajoute une photo', id: m.id });
    });
    return s.sort((a, b) => b.poids - a.poids);
  }

  // =============== 11. ÉTAT ===============
  const etat = { vue: 'accueil', id: null, brouillon: null, wish: null, depuisWishlist: null, recherche: '', filtre: 'tous', tri: 'date', ident: null, prixRes: null, test: '' };

  function aller(vue, id) {
    etat.vue = vue; etat.id = id || null;
    if (vue === 'formulaire') {
      etat.brouillon = id ? Object.assign({}, trouver(id)) : nouveauMaillot();
      etat.ident = null;
      if (!id) etat.depuisWishlist = null;
    }
    if (vue === 'wishform') etat.wish = id ? Object.assign({}, trouverSouhait(id)) : nouveauSouhait();
    rendre();
    window.scrollTo(0, 0);
  }

  // =============== 12. ACTIONS ===============
  async function chargerPhoto(fichier) {
    if (!fichier) return;
    try { etat.brouillon.photo = await compresserImage(fichier, 1000, 0.82); rendre(); }
    catch (e) { notifier(e.message); }
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
      if (prop.club) {
        etat.ident.etapes.push('Équipe reconnue : ' + prop.club + ' (' + prop.votesClub + ' titre(s) concordant(s)' + (prop.votesClub < 3 ? ' — indice faible, vérifie' : '') + ').');
        if (prop.autres.length) etat.ident.etapes.push('Autres pistes : ' + prop.autres.join(', ') + '.');
      } else etat.ident.etapes.push('Aucune équipe reconnue dans les titres : complète à la main ou colle un résultat Lens.');
    } catch (e) { etat.ident.etapes.push('Erreur : ' + e.message); }
    etat.ident.enCours = false;
    rendre();
  }

  function analyserTexteColle(texte) {
    const lignes = String(texte || '').split(/\n+/).map(l => l.trim()).filter(Boolean);
    if (!lignes.length) { notifier('Colle d’abord du texte.'); return; }
    const prop = analyserTitres(lignes);
    etat.ident = { enCours: false, etapes: [lignes.length + ' ligne(s) analysée(s) (aucune recherche consommée).', prop.club ? 'Équipe reconnue : ' + prop.club : 'Aucune équipe reconnue.'], resultats: [], proposition: prop };
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

  function completerPays(obj) {
    if (obj.club && !obj.pays) { const e = CLUBS.concat(SELECTIONS).find(c => c.nom === obj.club); if (e) obj.pays = e.pays; }
  }

  function enregistrer() {
    const b = etat.brouillon;
    if (!b.club) { notifier('Indique au moins l’équipe.'); return; }
    completerPays(b);
    b.prixAchat = b.prixAchat === '' ? '' : Number(String(b.prixAchat).replace(',', '.'));
    b.prixEstime = b.prixEstime === '' ? '' : Number(String(b.prixEstime).replace(',', '.'));
    if (sauverMaillot(b)) {
      if (etat.depuisWishlist) { supprimerSouhait(etat.depuisWishlist); etat.depuisWishlist = null; notifier('Maillot ajouté et retiré de la wishlist 🎉'); }
      else notifier('Maillot enregistré.');
      aller('fiche', b.id);
    }
  }

  function basculerFavori(id) {
    const m = trouver(id); if (!m) return;
    m.favori = !m.favori; sauverMaillot(m);
    notifier(m.favori ? '❤️ Ajouté aux favoris' : 'Retiré des favoris');
    rendre();
  }

  function enregistrerSouhait() {
    const w = etat.wish;
    if (!w.club) { notifier('Indique au moins l’équipe recherchée.'); return; }
    completerPays(w);
    w.budget = w.budget === '' ? '' : Number(String(w.budget).replace(',', '.'));
    if (sauverSouhait(w)) { notifier('Ajouté à ta wishlist ⭐'); aller('wishlist'); }
  }

  function ajouterSouhaitRapide(club, saison, type) {
    const w = nouveauSouhait();
    w.club = club || ''; w.saison = saison || ''; w.type = type || 'Domicile';
    completerPays(w);
    sauverSouhait(w);
    notifier('⭐ « ' + titreMaillot(w) + ' » ajouté à ta wishlist');
    rendre();
  }

  function trouveSouhait(id) {
    const w = trouverSouhait(id); if (!w) return;
    const b = nouveauMaillot();
    ['club', 'pays', 'saison', 'type', 'marque', 'joueur', 'taille'].forEach(k => { b[k] = w[k] || b[k]; });
    if (w.budget) b.prixAchat = w.budget;
    etat.vue = 'formulaire'; etat.id = null; etat.brouillon = b; etat.ident = null; etat.depuisWishlist = id;
    rendre(); window.scrollTo(0, 0);
    notifier('Complète la fiche : le souhait sera retiré de la wishlist à l’enregistrement.');
  }

  async function chercherPrix(m, budget) {
    const q = requetePrix(m);
    if (!q || q === 'maillot') { notifier('Renseigne au moins l’équipe du maillot.'); return; }
    etat.prixRes = { id: m.id, enCours: true, requete: q, notes: [], resultat: null };
    rendre();
    const taches = [
      relais('annonces', { q: q }).then(j => ({ src: 'Vinted / Leboncoin', liste: j.annonces || [], cache: !!j.cache })).catch(e => ({ src: 'Vinted / Leboncoin', erreur: e.message })),
      relais('ebay', { q: q }).then(j => ({ src: 'eBay', liste: j.annonces || [] })).catch(e => ({ src: 'eBay', erreur: e.message }))
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
    etat.prixRes.resultat = analyserAnnonces(toutes, budget);
    etat.prixRes.enCours = false;
    rendre();
  }

  function analyserAnnoncesCollees(m, texte) {
    const liste = parserAnnoncesCollees(texte);
    if (!liste.length) { notifier('Aucun prix trouvé dans le texte collé (il faut un montant en € par ligne).'); return; }
    etat.prixRes = { id: m.id, enCours: false, requete: 'annonces collées', notes: [liste.length + ' ligne(s) avec un prix (aucune recherche consommée)'], resultat: analyserAnnonces(liste, m.budget) };
    rendre();
  }

  function utiliserEstimation(id, valeur) {
    const m = trouver(id); if (!m) return;
    m.prixEstime = Math.round(valeur); sauverMaillot(m);
    notifier('Prix estimé enregistré : ' + euros(m.prixEstime)); rendre();
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
    const donnees = { version: VERSION, date: new Date().toISOString(), collection: lireCollection(), wishlist: lireWishlist() };
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
        const col = lireCollection(); let n = 0;
        liste.forEach(m => { if (m && m.id && !col.some(x => x.id === m.id)) { col.push(m); n++; } });
        ecrireCollection(col);
        let nw = 0;
        if (j.wishlist && Array.isArray(j.wishlist)) { const wl = lireWishlist(); j.wishlist.forEach(w => { if (w && w.id && !wl.some(x => x.id === w.id)) { wl.push(w); nw++; } }); ecrireWishlist(wl); }
        notifier(n + ' maillot(s) et ' + nw + ' souhait(s) importé(s).'); rendre();
      } catch (e) { notifier('Fichier illisible.'); }
    };
    lecteur.readAsText(fichier);
  }

  // =============== 13. BRIQUES D'AFFICHAGE ===============
  function selectHtml(nom, valeurs, valeur, cible) {
    return '<select data-champ="' + nom + '"' + (cible ? ' data-cible="' + cible + '"' : '') + '>' + valeurs.map(v => '<option value="' + h(v) + '"' + (v === valeur ? ' selected' : '') + '>' + (v || '—') + '</option>').join('') + '</select>';
  }
  function champ(label, nom, valeur, options) {
    options = options || {};
    const cible = options.cible ? ' data-cible="' + options.cible + '"' : '';
    let input;
    if (options.select) input = selectHtml(nom, options.select, valeur, options.cible);
    else if (options.textarea) input = '<textarea data-champ="' + nom + '"' + cible + ' rows="3">' + h(valeur) + '</textarea>';
    else input = '<input data-champ="' + nom + '"' + cible + ' type="' + (options.type || 'text') + '" value="' + h(valeur) + '" placeholder="' + h(options.placeholder || '') + '"' + (options.liste ? ' list="' + options.liste + '"' : '') + '>';
    return '<label class="champ"><span>' + label + '</span>' + input + '</label>';
  }
  function lienVinted(q) { return 'https://www.vinted.fr/catalog?search_text=' + encodeURIComponent(q); }
  function lienEbay(q) { return 'https://www.ebay.fr/sch/i.html?_nkw=' + encodeURIComponent(q); }
  function lienLeboncoin(q) { return 'https://www.leboncoin.fr/recherche?text=' + encodeURIComponent(q); }
  function liensBoutiques(q) {
    return '<span class="liens"><a href="' + lienVinted(q) + '" target="_blank" rel="noopener">Vinted</a><a href="' + lienLeboncoin(q) + '" target="_blank" rel="noopener">Leboncoin</a><a href="' + lienEbay(q) + '" target="_blank" rel="noopener">eBay</a></span>';
  }
  function datalists() {
    return '<datalist id="liste-clubs">' + CLUBS.concat(SELECTIONS).map(c => '<option value="' + h(c.nom) + '">').join('') + '</datalist>' +
      '<datalist id="liste-marques">' + MARQUES.map(c => '<option value="' + h(c.nom) + '">').join('') + '</datalist>' +
      '<datalist id="liste-sponsors">' + SPONSORS.map(c => '<option value="' + h(c.nom) + '">').join('') + '</datalist>';
  }
  function coeur(m) { return '<button class="coeur' + (m.favori ? ' actif' : '') + '" data-action="favori" data-id="' + m.id + '" aria-label="Favori">' + (m.favori ? '♥' : '♡') + '</button>'; }
  function carteMaillot(m) {
    return '<article class="carte" data-action="fiche" data-id="' + m.id + '">' +
      '<div class="visuel">' + (m.photo ? '<img src="' + m.photo + '" alt="" loading="lazy">' : '<div class="sansphoto">👕</div>') + coeur(m) +
      (m.type && m.type !== 'Domicile' ? '<span class="badge">' + h(m.type) + '</span>' : '') + '</div>' +
      '<div class="carte-txt"><b>' + h(m.club || 'Sans nom') + '</b><span>' + h([m.saison, m.marque].filter(Boolean).join(' · ') || ' ') + '</span><em>' + (m.prixEstime !== '' && m.prixEstime != null ? euros(m.prixEstime) : '') + '</em></div></article>';
  }
  function miniCarte(m) {
    return '<article class="mini" data-action="fiche" data-id="' + m.id + '">' + (m.photo ? '<img src="' + m.photo + '" alt="" loading="lazy">' : '<div class="sansphoto">👕</div>') +
      '<b>' + h(m.club || 'Sans nom') + '</b><span>' + h(m.saison || ' ') + '</span></article>';
  }
  function rangee(titre, items, lienAction, lienTexte) {
    if (!items.length) return '';
    return '<section class="section"><div class="titre-ligne"><h3>' + titre + '</h3>' + (lienAction ? '<button class="btn lien" data-action="' + lienAction + '">' + (lienTexte || 'Voir tout') + ' ›</button>' : '') + '</div><div class="rangee">' + items.map(miniCarte).join('') + '</div></section>';
  }
  function suggestionHtml(x) {
    const q = x.requete || [x.club, x.saison, 'maillot', x.type].filter(Boolean).join(' ');
    let actions = '';
    if (x.id) actions = '<button class="btn mini" data-action="fiche" data-id="' + x.id + '">Ouvrir</button>';
    else if (x.wishId) actions = '<button class="btn mini" data-action="wishfiche" data-id="' + x.wishId + '">Voir</button>';
    else actions = liensBoutiques(q) + (x.club ? '<button class="btn mini" data-action="wish-rapide" data-club="' + h(x.club) + '" data-saison="' + h(x.saison || '') + '" data-type="' + h(x.type || '') + '">⭐ Wishlist</button>' : '');
    return '<li><div>' + h(x.texte) + '</div><div class="sugg-actions">' + actions + '</div></li>';
  }

  // =============== 14. VUES ===============
  function vueAccueil() {
    const col = lireCollection(), wl = lireWishlist(), p = lireParams();
    const favoris = col.filter(m => m.favori);
    const recents = col.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 10);
    const valeur = col.reduce((s, m) => s + (Number(m.prixEstime) || 0), 0);
    const heure = new Date().getHours();
    const salut = (heure < 18 ? 'Bonjour' : 'Bonsoir') + (p.prenom ? ' ' + p.prenom : '') + ' 👋';
    let html = '<section class="hero"><p class="salut">' + h(salut) + '</p><h2>Ta collection</h2>' +
      '<div class="tuiles"><button class="tuile" data-action="collection"><b>' + col.length + '</b><span>maillots</span></button>' +
      '<button class="tuile" data-action="collection"><b>' + euros(valeur) + '</b><span>valeur estimée</span></button>' +
      '<button class="tuile" data-action="filtre-favoris"><b>' + favoris.length + '</b><span>favoris</span></button>' +
      '<button class="tuile" data-action="wishlist"><b>' + wl.length + '</b><span>wishlist</span></button></div></section>';
    if (!col.length) {
      html += '<section class="section bienvenue"><h3>Bienvenue !</h3><ol><li>Va dans <b>Réglages</b> pour relier ton relais Cloudflare (une seule fois).</li><li>Appuie sur <b>➕ Ajouter</b>, prends une photo du maillot et laisse Google Lens l’identifier.</li><li>Marque tes préférés d’un ❤️ et note ceux que tu cherches dans la <b>Wishlist</b>.</li></ol><div class="actions"><button class="btn principal" data-action="ajouter">➕ Ajouter mon premier maillot</button><button class="btn" data-action="parametres">⚙️ Réglages</button></div></section>';
      return html;
    }
    const sugg = calculerSuggestions().slice(0, 5);
    if (sugg.length) html += '<section class="section"><div class="titre-ligne"><h3>Suggestions pour toi</h3><button class="btn lien" data-action="idees">Tout voir ›</button></div><ul class="suggestions">' + sugg.map(suggestionHtml).join('') + '</ul></section>';
    html += rangee('Ajoutés récemment', recents, 'collection');
    html += rangee('❤️ Tes favoris', favoris.slice(0, 10), 'filtre-favoris');
    if (wl.length) {
      html += '<section class="section"><div class="titre-ligne"><h3>⭐ Ta wishlist</h3><button class="btn lien" data-action="wishlist">Voir tout ›</button></div><ul class="wish-liste compact">' + wl.slice(0, 3).map(w =>
        '<li data-action="wishfiche" data-id="' + w.id + '"><b>' + h(titreMaillot(w)) + '</b><span>' + h([w.priorite !== 'Normale' ? w.priorite : '', w.budget ? 'budget ' + euros(w.budget) : ''].filter(Boolean).join(' · ') || 'Appuie pour chercher') + '</span></li>').join('') + '</ul></section>';
    } else {
      html += '<section class="section"><h3>⭐ Wishlist</h3><p class="petit">Note les maillots que tu cherches : l’appli te donne des liens directs et surveille les bonnes affaires.</p><button class="btn" data-action="wishform">Ajouter un souhait</button></section>';
    }
    const compte = {};
    col.forEach(m => { if (m.club) compte[m.club] = (compte[m.club] || 0) + 1; });
    const top = Object.entries(compte).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (top.length) html += '<section class="section"><h3>Par équipe</h3><div class="chips">' + top.map(([c, n]) => '<button class="chip" data-action="filtrer" data-q="' + h(c) + '">' + h(c) + ' <small>' + n + '</small></button>').join('') + '</div></section>';
    return html;
  }

  function vueCollection() {
    let col = lireCollection();
    const tout = col.length;
    const r = normaliser(etat.recherche);
    if (etat.filtre === 'favoris') col = col.filter(m => m.favori);
    else if (etat.filtre === 'clubs') col = col.filter(m => !estSelection(m));
    else if (etat.filtre === 'selections') col = col.filter(m => estSelection(m));
    else if (TYPES.includes(etat.filtre)) col = col.filter(m => m.type === etat.filtre);
    if (r) col = col.filter(m => normaliser([m.club, m.pays, m.saison, m.type, m.marque, m.sponsor, m.joueur, m.notes].join(' ')).includes(r));
    const tris = {
      date: (a, b) => (b.date || '').localeCompare(a.date || ''),
      club: (a, b) => (a.club || '').localeCompare(b.club || '', 'fr'),
      saison: (a, b) => (b.saison || '').localeCompare(a.saison || ''),
      prix: (a, b) => (Number(b.prixEstime) || 0) - (Number(a.prixEstime) || 0)
    };
    col.sort(tris[etat.tri] || tris.date);
    const chips = [['tous', 'Tous'], ['favoris', '❤️ Favoris'], ['clubs', 'Clubs'], ['selections', 'Sélections'], ['Domicile', 'Domicile'], ['Extérieur', 'Extérieur'], ['Third', 'Third'], ['Gardien', 'Gardien']];
    let html = '<div class="titre-ligne"><h2>Collection <small>' + col.length + (col.length !== tout ? ' / ' + tout : '') + '</small></h2><button class="btn mini principal" data-action="ajouter">➕ Ajouter</button></div>';
    html += '<div class="barre"><input type="search" data-recherche placeholder="Rechercher (club, saison, marque, joueur…)" value="' + h(etat.recherche) + '">' +
      '<select data-tri>' + [['date', 'Récents'], ['club', 'Club A→Z'], ['saison', 'Saison'], ['prix', 'Prix estimé']].map(t => '<option value="' + t[0] + '"' + (etat.tri === t[0] ? ' selected' : '') + '>' + t[1] + '</option>').join('') + '</select></div>';
    html += '<div class="chips">' + chips.map(c => '<button class="chip' + (etat.filtre === c[0] ? ' actif' : '') + '" data-action="filtre" data-f="' + c[0] + '">' + c[1] + '</button>').join('') + '</div>';
    if (!tout) html += '<div class="vide"><p>Ta collection est vide.</p><button class="btn principal" data-action="ajouter">+ Ajouter mon premier maillot</button></div>';
    else if (!col.length) html += '<div class="vide"><p>Aucun maillot ne correspond.</p><button class="btn" data-action="reset-filtres">Effacer les filtres</button></div>';
    else html += '<div class="grille">' + col.map(carteMaillot).join('') + '</div>';
    return html;
  }

  function blocPrix(m, estSouhait) {
    const q = requetePrix(m);
    let html = '<section class="section"><h3>Trouver au meilleur prix</h3><p class="petit">Liens directs (gratuits) :</p>' + liensBoutiques(q) +
      '<div class="actions"><button class="btn principal" data-action="' + (estSouhait ? 'prix-wish' : 'prix') + '" data-id="' + m.id + '">💶 Chercher les prix en ligne</button></div>' +
      '<details><summary>Coller des annonces (une par ligne, avec le prix en €)</summary><textarea id="annonces-collees" rows="4" placeholder="Maillot PSG 2019 Nike taille M – 45 €"></textarea><button class="btn" data-action="' + (estSouhait ? 'annonces-collees-wish' : 'annonces-collees') + '" data-id="' + m.id + '">Analyser ces annonces</button></details></section>';
    const p = etat.prixRes;
    if (p && p.id === m.id) {
      html += '<section class="section"><h3>Estimation</h3><p class="petit">Recherche : ' + h(p.requete) + '</p>';
      if (p.enCours) html += '<p class="attente">Recherche en cours…</p>';
      html += '<ul class="etapes">' + p.notes.map(n => '<li>' + h(n) + '</li>').join('') + '</ul>';
      if (p.resultat) {
        const r = p.resultat;
        if (r.nb) {
          html += '<div class="estimation"><div><b>' + euros(r.mediane) + '</b><span>médiane (' + r.nb + ' annonces fiables)</span></div><div><b>' + euros(r.min) + ' – ' + euros(r.max) + '</b><span>fourchette</span></div></div>';
          if (!estSouhait) html += '<button class="btn principal" data-action="utiliser-estimation" data-id="' + m.id + '" data-valeur="' + r.mediane + '">Utiliser ' + euros(Math.round(r.mediane)) + ' comme prix estimé</button>';
          else if (m.budget) { const ba = r.annonces.filter(a => a.bonneAffaire).length; html += '<p class="' + (ba ? 'bonne' : 'petit') + '">' + (ba ? '🎯 ' + ba + ' annonce(s) dans ton budget de ' + euros(m.budget) + ' !' : 'Aucune annonce fiable dans ton budget de ' + euros(m.budget) + ' pour l’instant.') + '</p>'; }
        } else if (!p.enCours) html += '<p>Aucune annonce exploitable. Essaie avec d’autres mots (saison, marque) ou colle des annonces.</p>';
        if (r.annonces.length) {
          html += '<ul class="annonces">' + r.annonces.map(a => '<li class="' + (a.suspect ? 'suspect' : '') + (a.bonneAffaire ? ' affaire' : '') + '"><b>' + euros(a.prix) + '</b> ' +
            (a.lien ? '<a href="' + h(a.lien) + '" target="_blank" rel="noopener">' + h(a.titre) + '</a>' : h(a.titre)) +
            ' <small>' + h(a.source) + (a.suspect ? ' · ⚠️ ' + h(a.raison) : '') + (a.bonneAffaire ? ' · 🎯 dans ton budget' : '') + '</small></li>').join('') + '</ul>';
        }
      }
      html += '</section>';
    }
    return html;
  }

  function vueFiche() {
    const m = trouver(etat.id);
    if (!m) return '<p class="vide">Maillot introuvable.</p>';
    const lignes = [['Pays', m.pays], ['Saison', m.saison], ['Type', m.type], ['Marque', m.marque], ['Sponsor', m.sponsor],
      ['Joueur', m.joueur ? m.joueur + (m.numero ? ' · n° ' + m.numero : '') : (m.numero ? 'n° ' + m.numero : '')], ['Taille', m.taille], ['État', m.etat],
      ['Prix d’achat', m.prixAchat !== '' && m.prixAchat != null ? euros(m.prixAchat) : ''], ['Prix estimé', m.prixEstime !== '' && m.prixEstime != null ? euros(m.prixEstime) : ''],
      ['Ajouté le', m.date ? new Date(m.date).toLocaleDateString('fr-FR') : '']].filter(l => l[1]);
    let html = '<button class="btn lien" data-action="retour">‹ Retour</button>';
    html += '<section class="fiche"><div class="visuel grand">' + (m.photo ? '<img class="grande" src="' + m.photo + '" alt="">' : '<div class="sansphoto grande">👕</div>') + coeur(m) + '</div>' +
      '<h2>' + h(m.club || 'Sans nom') + '</h2><p class="sous">' + h([m.saison, m.type, m.marque].filter(Boolean).join(' · ')) + '</p>' +
      '<table>' + lignes.map(l => '<tr><th>' + l[0] + '</th><td>' + h(l[1]) + '</td></tr>').join('') + '</table>' +
      (m.notes ? '<p class="notes">' + h(m.notes) + '</p>' : '') +
      '<div class="actions"><button class="btn" data-action="modifier" data-id="' + m.id + '">✏️ Modifier</button>' +
      '<button class="btn" data-action="favori" data-id="' + m.id + '">' + (m.favori ? '♥ Favori' : '♡ Ajouter aux favoris') + '</button>' +
      '<button class="btn danger" data-action="supprimer" data-id="' + m.id + '">🗑️</button></div></section>';
    html += blocPrix(m, false);
    const freres = lireCollection().filter(x => x.club === m.club && x.id !== m.id).slice(0, 10);
    html += rangee('Du même club dans ta collection', freres, null);
    const manquants = ['Domicile', 'Extérieur', 'Third'].filter(t => m.saison && !lireCollection().some(x => x.club === m.club && x.saison === m.saison && x.type === t));
    if (manquants.length) html += '<section class="section"><h3>Compléter ce jeu</h3><p class="petit">Pour ' + h(m.club + ' ' + m.saison) + ', il te manque : ' + manquants.join(', ') + '.</p><div class="actions">' + manquants.map(t => '<button class="btn mini" data-action="wish-rapide" data-club="' + h(m.club) + '" data-saison="' + h(m.saison) + '" data-type="' + t + '">⭐ ' + t + ' en wishlist</button>').join('') + '</div></section>';
    return html;
  }

  function vueFormulaire() {
    const b = etat.brouillon;
    let html = '<button class="btn lien" data-action="' + (etat.id ? 'fiche' : 'retour') + '" data-id="' + (etat.id || '') + '">‹ Annuler</button>';
    html += '<h2>' + (etat.id ? 'Modifier le maillot' : 'Nouveau maillot') + '</h2>';
    html += '<section class="section photo-zone">' + (b.photo ? '<img class="grande" src="' + b.photo + '" alt="">' : '<div class="sansphoto grande">📷</div>') +
      '<div class="actions"><label class="btn">📷 Photo<input type="file" accept="image/*" capture="environment" data-fichier hidden></label>' +
      '<label class="btn">🖼️ Galerie<input type="file" accept="image/*" data-fichier hidden></label>' +
      (b.photo ? '<button class="btn" data-action="retirer-photo">Retirer</button>' : '') + '</div>' +
      '<button class="btn principal large" data-action="identifier"' + (b.photo ? '' : ' disabled') + '>🔍 Identifier avec Google Lens</button>' +
      '<p class="petit">1 recherche par photo (' + quotaTexte() + ').</p>' +
      '<details><summary>Coller un résultat Lens (plan B gratuit)</summary><p class="petit">Ouvre la photo dans Google Photos → Lens, copie les titres des résultats et colle-les ici (un par ligne).</p><textarea id="lens-colle" rows="4"></textarea><button class="btn" data-action="analyser-colle">Analyser le texte</button></details></section>';
    const i = etat.ident;
    if (i) {
      html += '<section class="section"><h3>Identification</h3><ul class="etapes">' + i.etapes.map(e => '<li>' + h(e) + '</li>').join('') + '</ul>';
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
    html += '<section class="section formulaire">' + datalists() +
      champ('Équipe / club *', 'club', b.club, { liste: 'liste-clubs', placeholder: 'Ex. Olympique de Marseille' }) +
      champ('Pays', 'pays', b.pays, { placeholder: 'Rempli automatiquement si connu' }) +
      champ('Saison', 'saison', b.saison, { placeholder: 'Ex. 1998-99 ou 2023-24' }) +
      champ('Type', 'type', b.type, { select: TYPES }) +
      champ('Marque', 'marque', b.marque, { liste: 'liste-marques' }) +
      champ('Sponsor', 'sponsor', b.sponsor, { liste: 'liste-sponsors' }) +
      champ('Joueur (flocage)', 'joueur', b.joueur) +
      champ('Numéro', 'numero', b.numero, { placeholder: 'Ex. 10' }) +
      champ('Taille', 'taille', b.taille, { select: TAILLES }) +
      champ('État', 'etat', b.etat, { select: ETATS }) +
      champ('Prix d’achat (€)', 'prixAchat', b.prixAchat, { type: 'number', placeholder: '0' }) +
      champ('Prix estimé (€)', 'prixEstime', b.prixEstime, { type: 'number', placeholder: '0' }) +
      champ('Notes', 'notes', b.notes, { textarea: true }) +
      '<label class="case"><input type="checkbox" data-champ="favori"' + (b.favori ? ' checked' : '') + '> ❤️ Marquer comme favori</label>' +
      '<div class="actions"><button class="btn principal large" data-action="enregistrer">💾 Enregistrer</button></div></section>';
    return html;
  }

  function vueWishlist() {
    const wl = lireWishlist();
    let html = '<div class="titre-ligne"><h2>⭐ Wishlist <small>' + wl.length + '</small></h2><button class="btn mini principal" data-action="wishform">➕ Souhait</button></div>';
    html += '<p class="petit">Les maillots que tu cherches. Appuie sur un souhait pour voir les liens et chercher les prix.</p>';
    if (!wl.length) return html + '<div class="vide"><p>Ta wishlist est vide.</p><button class="btn principal" data-action="wishform">Ajouter un premier souhait</button></div>';
    const ordre = { 'Rêve absolu': 0, 'Haute': 1, 'Normale': 2 };
    wl.sort((a, b) => (ordre[a.priorite] || 2) - (ordre[b.priorite] || 2));
    html += '<ul class="wish-liste">' + wl.map(w => '<li data-action="wishfiche" data-id="' + w.id + '"><div class="wish-ico">' + (w.priorite === 'Rêve absolu' ? '🌟' : (w.priorite === 'Haute' ? '⭐' : '☆')) + '</div><div><b>' + h(titreMaillot(w)) + '</b><span>' + h([w.marque, w.joueur, w.taille ? 'taille ' + w.taille : '', w.budget ? 'budget ' + euros(w.budget) : ''].filter(Boolean).join(' · ') || w.priorite) + '</span></div><span class="chevron">›</span></li>').join('') + '</ul>';
    return html;
  }

  function vueWishFiche() {
    const w = trouverSouhait(etat.id);
    if (!w) return '<p class="vide">Souhait introuvable.</p>';
    const lignes = [['Pays', w.pays], ['Saison', w.saison], ['Type', w.type], ['Marque', w.marque], ['Joueur', w.joueur], ['Taille', w.taille], ['Budget max', w.budget ? euros(w.budget) : ''], ['Priorité', w.priorite]].filter(l => l[1]);
    let html = '<button class="btn lien" data-action="wishlist">‹ Wishlist</button>';
    html += '<section class="fiche"><p class="salut">⭐ Souhait</p><h2>' + h(w.club) + '</h2><p class="sous">' + h([w.saison, w.type].filter(Boolean).join(' · ')) + '</p>' +
      '<table>' + lignes.map(l => '<tr><th>' + l[0] + '</th><td>' + h(l[1]) + '</td></tr>').join('') + '</table>' + (w.notes ? '<p class="notes">' + h(w.notes) + '</p>' : '') +
      '<div class="actions"><button class="btn principal" data-action="wish-trouve" data-id="' + w.id + '">🎉 Je l’ai trouvé !</button><button class="btn" data-action="wishform" data-id="' + w.id + '">✏️ Modifier</button><button class="btn danger" data-action="wish-supprimer" data-id="' + w.id + '">🗑️</button></div></section>';
    html += blocPrix(w, true);
    return html;
  }

  function vueWishForm() {
    const w = etat.wish;
    return '<button class="btn lien" data-action="wishlist">‹ Annuler</button><h2>' + (etat.id ? 'Modifier le souhait' : 'Nouveau souhait') + '</h2>' +
      '<section class="section formulaire">' + datalists() +
      champ('Équipe / club *', 'club', w.club, { liste: 'liste-clubs', cible: 'wish', placeholder: 'Ex. Équipe de France' }) +
      champ('Saison', 'saison', w.saison, { cible: 'wish', placeholder: 'Ex. 1998 (facultatif)' }) +
      champ('Type', 'type', w.type, { select: TYPES, cible: 'wish' }) +
      champ('Marque', 'marque', w.marque, { liste: 'liste-marques', cible: 'wish' }) +
      champ('Joueur (flocage)', 'joueur', w.joueur, { cible: 'wish' }) +
      champ('Taille souhaitée', 'taille', w.taille, { select: TAILLES, cible: 'wish' }) +
      champ('Budget max (€)', 'budget', w.budget, { type: 'number', cible: 'wish', placeholder: 'Ex. 60' }) +
      champ('Priorité', 'priorite', w.priorite, { select: PRIORITES, cible: 'wish' }) +
      champ('Notes', 'notes', w.notes, { textarea: true, cible: 'wish' }) +
      '<div class="actions"><button class="btn principal large" data-action="wish-enregistrer">💾 Enregistrer</button></div></section>';
  }

  function vueIdees() {
    const s = calculerSuggestions();
    let html = '<button class="btn lien" data-action="accueil">‹ Accueil</button><h2>💡 Suggestions</h2><p class="petit">Calculées à partir de ta collection, tes favoris et ta wishlist, sans aucune recherche en ligne.</p>';
    if (!s.length) return html + '<div class="vide"><p>Ajoute quelques maillots (et des favoris ❤️) pour obtenir des suggestions.</p></div>';
    const cats = Array.from(new Set(s.map(x => x.cat)));
    cats.forEach(cat => { html += '<section class="section"><h3>' + h(cat) + '</h3><ul class="suggestions">' + s.filter(x => x.cat === cat).map(suggestionHtml).join('') + '</ul></section>'; });
    return html;
  }

  function vueParametres() {
    const p = lireParams();
    return '<h2>⚙️ Réglages</h2>' +
      '<section class="section"><h3>Toi</h3><label class="champ"><span>Ton prénom (pour l’accueil)</span><input id="param-prenom" type="text" value="' + h(p.prenom) + '" placeholder="Facultatif"></label></section>' +
      '<section class="section"><h3>Relais Cloudflare</h3>' +
      '<label class="champ"><span>Adresse du relais</span><input id="param-relais" type="url" value="' + h(p.relais) + '" placeholder="https://maillots-relais.xxxx.workers.dev"></label>' +
      '<label class="champ"><span>Code secret</span><input id="param-code" type="password" value="' + h(p.code) + '" placeholder="Le même que CODE_SECRET sur Cloudflare"></label>' +
      '<div class="actions"><button class="btn principal" data-action="sauver-params">💾 Enregistrer</button><button class="btn" data-action="tester">🔌 Tester</button></div>' +
      (etat.test ? '<p class="test">' + h(etat.test) + '</p>' : '') + '</section>' +
      '<section class="section"><h3>Quota SerpApi</h3><p>' + quotaTexte() + '.</p><p class="petit">Compteur local, remis à zéro chaque mois. Les résultats déjà connus (cache) ne comptent pas.</p><button class="btn mini" data-action="reset-quota">Remettre à zéro</button></section>' +
      '<section class="section"><h3>Sauvegarde</h3><div class="actions"><button class="btn" data-action="exporter">⬇️ Exporter (JSON)</button><label class="btn">⬆️ Importer<input type="file" accept="application/json,.json" data-import hidden></label></div>' +
      '<p class="petit">Tes données (collection + wishlist) restent sur cet appareil. Exporte régulièrement.</p></section>' +
      '<section class="section"><h3>Zone dangereuse</h3><button class="btn danger" data-action="tout-effacer">Effacer toute la collection</button></section>' +
      '<p class="version">Mes Maillots · v' + VERSION + ' · sans IA</p>';
  }

  function rendre() {
    const vues = { accueil: vueAccueil, collection: vueCollection, fiche: vueFiche, formulaire: vueFormulaire, wishlist: vueWishlist, wishfiche: vueWishFiche, wishform: vueWishForm, idees: vueIdees, parametres: vueParametres };
    const corps = (vues[etat.vue] || vueAccueil)();
    const actifs = { accueil: ['accueil', 'idees'], collection: ['collection', 'fiche'], ajouter: ['formulaire'], wishlist: ['wishlist', 'wishfiche', 'wishform'], parametres: ['parametres'] };
    const nav = [['accueil', '⌂', 'Accueil'], ['collection', '👕', 'Collection'], ['ajouter', '＋', 'Ajouter'], ['wishlist', '☆', 'Wishlist'], ['parametres', '⚙', 'Réglages']]
      .map(n => '<button data-action="' + n[0] + '" class="' + (actifs[n[0]].includes(etat.vue) ? 'actif' : '') + '"><span>' + n[1] + '</span>' + n[2] + '</button>').join('');
    document.getElementById('app').innerHTML = '<header class="entete"><h1>Mes Maillots</h1><span class="pastille">' + lireCollection().length + '</span></header><main>' + corps + '</main><nav class="nav">' + nav + '</nav>';
  }

  // =============== 15. ÉVÉNEMENTS ===============
  function brancher() {
    const app = document.getElementById('app');
    app.addEventListener('click', e => {
      const el = e.target.closest('[data-action]');
      if (!el || el.disabled) return;
      if (e.target.closest('a')) return;
      const action = el.getAttribute('data-action');
      const id = el.getAttribute('data-id');
      switch (action) {
        case 'accueil': aller('accueil'); break;
        case 'collection': etat.filtre = 'tous'; etat.recherche = ''; aller('collection'); break;
        case 'filtre-favoris': etat.filtre = 'favoris'; etat.recherche = ''; aller('collection'); break;
        case 'filtrer': etat.filtre = 'tous'; etat.recherche = el.getAttribute('data-q') || ''; aller('collection'); break;
        case 'filtre': etat.filtre = el.getAttribute('data-f'); rendre(); break;
        case 'reset-filtres': etat.filtre = 'tous'; etat.recherche = ''; rendre(); break;
        case 'ajouter': aller('formulaire', null); break;
        case 'idees': aller('idees'); break;
        case 'parametres': aller('parametres'); break;
        case 'retour': aller(etat.depuisWishlist ? 'wishlist' : 'collection'); break;
        case 'fiche': etat.prixRes = null; aller('fiche', id); break;
        case 'modifier': aller('formulaire', id); break;
        case 'favori': basculerFavori(id); break;
        case 'supprimer':
          if (confirm('Supprimer ce maillot ?')) { supprimerMaillot(id); notifier('Maillot supprimé.'); aller('collection'); }
          break;
        case 'retirer-photo': etat.brouillon.photo = ''; rendre(); break;
        case 'identifier': identifier(); break;
        case 'analyser-colle': analyserTexteColle((document.getElementById('lens-colle') || {}).value); break;
        case 'appliquer': appliquerProposition(); break;
        case 'enregistrer': enregistrer(); break;
        case 'prix': { const m = trouver(id); if (m) chercherPrix(m); break; }
        case 'annonces-collees': { const m = trouver(id); if (m) analyserAnnoncesCollees(m, (document.getElementById('annonces-collees') || {}).value); break; }
        case 'utiliser-estimation': utiliserEstimation(id, Number(el.getAttribute('data-valeur'))); break;
        case 'wishlist': aller('wishlist'); break;
        case 'wishform': aller('wishform', id); break;
        case 'wishfiche': etat.prixRes = null; aller('wishfiche', id); break;
        case 'wish-enregistrer': enregistrerSouhait(); break;
        case 'wish-rapide': ajouterSouhaitRapide(el.getAttribute('data-club'), el.getAttribute('data-saison'), el.getAttribute('data-type')); break;
        case 'wish-trouve': trouveSouhait(id); break;
        case 'wish-supprimer':
          if (confirm('Retirer ce souhait de la wishlist ?')) { supprimerSouhait(id); notifier('Souhait retiré.'); aller('wishlist'); }
          break;
        case 'prix-wish': { const w = trouverSouhait(id); if (w) chercherPrix(w, w.budget); break; }
        case 'annonces-collees-wish': { const w = trouverSouhait(id); if (w) analyserAnnoncesCollees(w, (document.getElementById('annonces-collees') || {}).value); break; }
        case 'sauver-params': case 'tester': {
          const relaisVal = (document.getElementById('param-relais').value || '').trim();
          const codeVal = (document.getElementById('param-code').value || '').trim();
          const prenom = (document.getElementById('param-prenom').value || '').trim();
          if (relaisVal && !/^https:\/\//.test(relaisVal)) { notifier('L’adresse doit commencer par https://'); return; }
          ecrireParams({ relais: relaisVal, code: codeVal, prenom: prenom });
          if (action === 'tester') testerRelais(); else { notifier('Réglages enregistrés.'); rendre(); }
          break;
        }
        case 'reset-quota': ecrireJSON(CLE_QUOTA, { mois: moisCourant(), utilise: 0 }); rendre(); break;
        case 'exporter': exporter(); break;
        case 'tout-effacer':
          if (confirm('Effacer TOUTE la collection ? Cette action est définitive.') && confirm('Vraiment sûr ? Pense à exporter avant.')) { ecrireCollection([]); notifier('Collection effacée.'); aller('accueil'); }
          break;
      }
    });
    const surSaisie = e => {
      const el = e.target;
      if (el.hasAttribute('data-champ')) {
        const cible = el.getAttribute('data-cible') === 'wish' ? etat.wish : etat.brouillon;
        if (!cible) return;
        cible[el.getAttribute('data-champ')] = el.type === 'checkbox' ? el.checked : el.value;
        return;
      }
      if (el.hasAttribute('data-recherche')) {
        etat.recherche = el.value; const pos = el.selectionStart; rendre();
        const n = document.querySelector('[data-recherche]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) { /* ignore */ } }
        return;
      }
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

  // =============== 16. SERVICE WORKER ===============
  function enregistrerServiceWorker() {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => { /* hors ligne indisponible */ });
  }

  // =============== 17. STYLE ===============
  function injecterStyle() {
    if (document.getElementById('style-v20')) return;
    const s = document.createElement('style');
    s.id = 'style-v20';
    s.textContent = `
:root{--vert:#143d2f;--vert2:#1e5a45;--or:#c9962f;--fond:#f6f4ef;--carte:#fff;--texte:#1b1b1b;--gris:#6f6f6f;--rouge:#b23a3a;--bord:#e6e1d6;--ombre:0 2px 8px rgba(20,61,47,.08)}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--fond);color:var(--texte);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:16px;line-height:1.4;-webkit-tap-highlight-color:transparent}
a{color:var(--vert2)}
.entete{background:var(--vert);color:#fff;padding:calc(10px + env(safe-area-inset-top)) 16px 10px;position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between}
.entete h1{margin:0;font-size:19px;font-weight:800;letter-spacing:.2px}
.pastille{background:var(--or);color:#fff;border-radius:999px;padding:2px 10px;font-size:13px;font-weight:700}
main{padding:14px 14px calc(92px + env(safe-area-inset-bottom));max-width:760px;margin:0 auto}
h2{color:var(--vert);margin:6px 0 10px;font-size:24px;font-weight:800;letter-spacing:-.3px}
h2 small{color:var(--gris);font-size:15px;font-weight:600;margin-left:6px}
h3{color:var(--vert);margin:0 0 8px;font-size:15px;text-transform:uppercase;letter-spacing:.6px;font-weight:800}
.titre-ligne{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.nav{position:fixed;bottom:0;left:0;right:0;display:flex;background:#fff;border-top:1px solid var(--bord);padding-bottom:env(safe-area-inset-bottom);z-index:5;box-shadow:0 -2px 10px rgba(0,0,0,.04)}
.nav button{flex:1;border:0;background:none;padding:8px 2px 6px;font-size:11px;color:var(--gris);display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;font-family:inherit}
.nav button span{font-size:22px;line-height:1.1}
.nav button.actif{color:var(--vert);font-weight:800}
.hero{background:linear-gradient(135deg,var(--vert),var(--vert2));color:#fff;border-radius:18px;padding:18px 16px;margin-bottom:16px;box-shadow:var(--ombre)}
.hero h2{color:#fff;margin:0 0 12px}
.salut{margin:0 0 2px;font-size:14px;opacity:.85}
.tuiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.tuile{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:10px 4px;text-align:center;color:#fff;cursor:pointer;font-family:inherit}
.tuile b{display:block;font-size:17px;color:#fff}
.tuile span{font-size:11px;opacity:.85}
.section,.fiche{background:var(--carte);border:1px solid var(--bord);border-radius:16px;padding:14px;margin-bottom:14px;box-shadow:var(--ombre)}
.bienvenue ol{padding-left:20px;margin:8px 0}
.bienvenue li{margin:6px 0}
.rangee{display:flex;gap:10px;overflow-x:auto;padding:4px 2px 8px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.mini{min-width:128px;max-width:128px;scroll-snap-align:start;cursor:pointer}
.mini img,.mini .sansphoto{width:128px;height:128px;object-fit:cover;border-radius:12px;background:#ece7db;display:flex;align-items:center;justify-content:center;font-size:40px}
.mini b{display:block;font-size:13px;margin-top:6px;color:var(--vert);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mini span{font-size:12px;color:var(--gris)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 12px}
.chip{border:1px solid var(--bord);background:#fff;border-radius:999px;padding:7px 13px;font-size:13px;font-weight:600;color:var(--texte);cursor:pointer;font-family:inherit;white-space:nowrap}
.chip small{color:var(--gris);font-weight:600}
.chip.actif{background:var(--vert);border-color:var(--vert);color:#fff}
.barre{display:flex;gap:8px;margin-bottom:6px}
.barre input{flex:1}
.barre select{width:auto;max-width:140px}
input,select,textarea{width:100%;padding:11px 12px;border:1px solid var(--bord);border-radius:12px;font-size:16px;background:#fff;color:var(--texte);font-family:inherit}
input:focus,select:focus,textarea:focus{outline:2px solid var(--or);border-color:var(--or)}
.grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(156px,1fr));gap:12px}
.carte{background:var(--carte);border:1px solid var(--bord);border-radius:16px;overflow:hidden;cursor:pointer;box-shadow:var(--ombre);transition:transform .12s}
.carte:active{transform:scale(.98)}
.visuel{position:relative}
.carte img,.carte .sansphoto{width:100%;aspect-ratio:1/1;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:52px;background:#ece7db}
.coeur{position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#c0392b;font-size:20px;line-height:34px;text-align:center;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.15);padding:0}
.coeur.actif{background:#c0392b;color:#fff}
.badge{position:absolute;left:8px;bottom:8px;background:rgba(20,61,47,.9);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px}
.carte-txt{padding:9px 11px 11px;display:flex;flex-direction:column;gap:2px}
.carte-txt b{font-size:14px;color:var(--vert);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.carte-txt span{font-size:12px;color:var(--gris);min-height:16px}
.carte-txt em{font-style:normal;font-weight:800;color:var(--or);font-size:13px;min-height:16px}
.vide{text-align:center;padding:40px 10px;color:var(--gris)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 14px;border:1px solid var(--vert);border-radius:12px;background:#fff;color:var(--vert);font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;text-align:center}
.btn.principal{background:var(--vert);color:#fff}
.btn.danger{border-color:var(--rouge);color:var(--rouge)}
.btn.lien{border:0;background:none;padding:6px 0;font-weight:700}
.btn.mini{padding:6px 11px;font-size:13px;border-radius:999px}
.btn.large{width:100%}
.btn[disabled]{opacity:.45;cursor:not-allowed}
.actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.grande{width:100%;max-height:380px;object-fit:contain;border-radius:12px;background:#ece7db;display:block}
.sansphoto.grande{height:220px;display:flex;align-items:center;justify-content:center;font-size:64px}
.visuel.grand .coeur{width:42px;height:42px;line-height:42px;font-size:24px;top:10px;right:10px}
.fiche h2{margin:12px 0 2px}
.sous{margin:0 0 8px;color:var(--gris);font-size:14px}
table{width:100%;border-collapse:collapse;margin:8px 0}
th{text-align:left;color:var(--gris);font-weight:600;padding:7px 8px 7px 0;width:38%;font-size:14px;vertical-align:top;border-bottom:1px solid var(--bord)}
td{padding:7px 0;font-size:15px;border-bottom:1px solid var(--bord)}
.notes{white-space:pre-wrap;color:var(--gris);font-size:14px}
.champ{display:block;margin-bottom:10px}
.champ span{display:block;font-size:13px;color:var(--gris);margin-bottom:4px;font-weight:700}
.case{display:flex;align-items:center;gap:8px;font-weight:600;margin:6px 0 10px}
.case input{width:20px;height:20px}
.petit{font-size:13px;color:var(--gris);margin:6px 0}
.bonne{font-weight:700;color:#1e7d4a;margin:8px 0}
.liens{display:inline-flex;gap:6px;flex-wrap:wrap}
.liens a{border:1px solid var(--bord);border-radius:999px;padding:5px 11px;font-size:13px;font-weight:700;text-decoration:none;background:#fff}
.etapes{list-style:none;padding:0;margin:8px 0;font-size:14px}
.etapes li{padding:4px 0 4px 18px;position:relative}
.etapes li:before{content:"•";position:absolute;left:4px;color:var(--or)}
.attente{color:var(--or);font-weight:700}
.estimation{display:flex;gap:8px;margin:10px 0}
.estimation div{flex:1;background:var(--fond);border-radius:12px;padding:10px;text-align:center}
.estimation b{display:block;color:var(--vert);font-size:18px}
.estimation span{font-size:12px;color:var(--gris)}
.annonces{list-style:none;padding:0;margin:10px 0 0;font-size:14px}
.annonces li{padding:8px 0;border-top:1px solid var(--bord)}
.annonces li b{color:var(--vert);margin-right:6px}
.annonces li small{display:block;color:var(--gris)}
.annonces li.suspect{opacity:.5}
.annonces li.suspect b{text-decoration:line-through}
.annonces li.affaire b{color:#1e7d4a}
.suggestions{list-style:none;padding:0;margin:0}
.suggestions li{padding:10px 0;border-top:1px solid var(--bord);font-size:15px;display:flex;flex-direction:column;gap:6px}
.suggestions li:first-child{border-top:0;padding-top:4px}
.sugg-actions{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.wish-liste{list-style:none;padding:0;margin:0}
.wish-liste li{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--bord);cursor:pointer}
.wish-liste li:first-child{border-top:0}
.wish-liste li>div:not(.wish-ico){flex:1;min-width:0}
.wish-liste b{display:block;color:var(--vert);font-size:15px}
.wish-liste span{display:block;font-size:13px;color:var(--gris)}
.wish-ico{font-size:22px;width:30px;text-align:center}
.chevron{color:var(--gris);font-size:22px}
.wish-liste.compact li{padding:9px 0}
details{margin-top:10px}
summary{cursor:pointer;color:var(--vert2);font-weight:700;font-size:14px}
details textarea{margin:8px 0}
.test{background:var(--fond);padding:10px;border-radius:12px;font-weight:700;word-break:break-word}
.version{text-align:center;color:var(--gris);font-size:12px;margin:20px 0}
#mm-toast{position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom));transform:translateX(-50%) translateY(20px);background:var(--vert);color:#fff;padding:11px 16px;border-radius:14px;font-size:14px;opacity:0;transition:.25s;z-index:20;max-width:90%;text-align:center;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.2)}
#mm-toast.visible{opacity:1;transform:translateX(-50%) translateY(0)}
@media(min-width:600px){.tuile b{font-size:20px}.grille{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}}
`;
    document.head.appendChild(s);
  }

  // =============== 18. DÉMARRAGE ===============
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
