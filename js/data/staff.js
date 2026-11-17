/* ==========================================================
   staff.js — Técnicos (HC/AC), buffs e Seleções da Copa do Mundo
   ========================================================== */

// Quantos times de cada região se classificam pro Mundial, dependendo do tamanho da região.
const REGIONAL_MUNDIAL_QUALIFY_COUNT = {AMERICAS:4, EMEA:4, PACIFIC:4, CN:4};

// Head coaches disponíveis — 1 escolhido pelo jogador, os outros 15 vão pras equipes adversárias.
const COACHES = ["Benkai","yaotziN","KUNDIKUNDI","MYM","Rojo","Nbs","bzkA","Potter","frod","mini","Chet","d00mbros","Kaplan","alecks","Romanilly","Bati","bonzitt","Sacy","Stk","Onur","JoshRT","bonkar","shaW","Kamino","SilKanoN","NaThanD","Stunner","KEY","WKN","Ewok","Engh","PatronW","gaabxx","Veer","phonics","ZONYK","solo","neilzinho","ANGE1","peu","DragziKW","Carlao","ryotzz","Negaral","Itopata","pule","Autumn","alexRr","LEGIJA","LohaN","Vlad","ZE1SH","Scuttt","glow","KDG","GUNTER","mitch","Happy","SLK","Desmo","Bambino","Sungmin","hsk","Faded","ryota-","XQQ","Crws","Vorz","JeXeN","pipsoN","hypnotizing","bail","Fayde","destroyeR","AfteR","steady","Milan","Senny","Lefiedot","mltdwn","RBTX","meowvlrt","Persia","effys","Oderus","Immi","monSi","FNS","Tanizhq","Valadao","Luck","slowiscool","Branchies","Godspeed","jovi","Fame","panique","Cyyy","Nearley","ED101","Sunshine","York","DaJ","Anaks","heav1n","meisoN","xikii_gg","Larsson","SKAZZ","Andreas","GAIS","Bromas","hvoya","finalmoment","Johnta","Celo","Viento"];
// Buff de cada Head Coach: bônus fixo aplicado ao rating do time em todo cálculo de vitória
// de rodada/partida — vale pra qualquer equipe (sua ou adversária) que tiver esse técnico.
const COACH_BUFFS = {
  "Benkai":4,
  "yaotziN":4,
  "KUNDIKUNDI":4,
  "MYM":4,
  "GUNTER":4,
  "mitch":4,
  "Happy":4,
  "SLK":4,
  "Desmo":4,
  "Bambino":4,
  "Sungmin":4,
  "hsk":4,
  "Faded":5,
  "ryota-":5,
  "XQQ":4,
  "Crws":5,
  "Vorz":5,
  "JeXeN":4,
  "pipsoN":5,
  "hypnotizing":4,
  "bail":5,
  "Fayde":5,
  "destroyeR":5,
  "AfteR":4,
  "steady":4,
  "Milan":5,
  "Senny":4,
  "Lefiedot":5,
  "mltdwn":4,
  "RBTX":5,
  "meowvlrt":5,
  "Persia":5,
  "effys":5,
  "Oderus":4,
  "Immi":5,
  "monSi":5,
  "FNS":5,
  "Tanizhq":4,
  "Valadao":5,
  "Luck":4,
  "slowiscool":5,
  "Branchies":4,
  "Godspeed":5,
  "jovi":5,
  "Fame":5,
  "panique":4,
  "Cyyy":5,
  "Nearley":4,
  "ED101":5,
  "Sunshine":4,
  "York":5,
  "DaJ":4,
  "Anaks":5,
  "heav1n":5,
  "meisoN":5,
  "xikii_gg":4,
  "Larsson":5,
  "SKAZZ":4,
  "Andreas":5,
  "GAIS":5,
  "Bromas":5,
  "hvoya":5,
  "finalmoment":5,
  "Johnta":5,
  "Celo":5,
  "Viento":5,
  Rojo:5,
  Nbs:5, bzka:5, Potter:7, frod:5, mini:5, Chet:4, d00mbros:5, kaplan:5,
  alecks:5, romanilly:5, Stk:5, onur:5, JoshRT:8, bonkar:5, shaw:5, Kamino:5,
  SilKanoN:5, nathand:5, Stunner:5, KEY:5, WKN:5, Ewok:5, ENGH:5, PatronW:5,
  gaabxx:5, Veer:5, phonics:5, ZONYK:5, solo:5, neilzinho:5,
  ANGE1:5, peu:5, DragziKW:5, Carlao:5, ryotzz:5, Negaral:5, Itopata:5, pule:5,
  Bati:5, bonzitt:5, Sacy:8, Autumn:5, alexRr:5, LEGIJA:5, LohaN:5, Vlad:5, ZE1SH:5, Scuttt:5, glow:5, KDG:5,
};
// Elencos das Seleções pro futuro Modo Copa do Mundo — separado do país "real" de cada craque
// (usado no modo normal) porque aqui alguns jogam por uma seleção diferente da nacionalidade
// deles (ex: Reduxx é dos EUA mas joga pelo Marrocos). Times sem 5 funções cobertas ainda não
// entram no modo até o banco crescer mais.
const WC_SELECOES = {
  "United States": {
    players: ["BABYBAY","Boostio","C0M","Cryocells","Demon1","Ethan","N4RRATE","OXY","Verno","Victor","Zellsis","bang","brawk","crashies","leaf","s0m","skuba","trent","valyn","yay","zekken"],
    coaches: ["JoshRT","Potter","Chet","Kaplan","frod"],
  },
  "South Korea": {
    players: ["Ash","BuZz","Dambi","Flashback","Francis","Ivy","Karon","Lakia","MaKo","Meteor","Munchkin","Rb","Smoggy","Sylvan","Xross","iZu","stax","t3xture"],
    coaches: ["SilKanoN"],
  },
  "China": {
    players: ["CHICHOO","Haodong","Jieni7","Lysoar","ZmjjKK","happywei","nobody","ZmjKK","Knight","slowly","K1ra"],
    coaches: ["NaThanD"],
  },
  "Canada": {
    players: ["Tenz","FNS","Asuna","JonahP","Kyu","Timotino","Vora","eeiu","koalanoob","mada","moose","zander","Marved"],
    coaches: ["Stunner"],
  },
  "Turkey": {
    players: ["Alfajer","AtaKaptan","LewN","MrFaliN","RieNs","Wo0t","hiro","s0pp","xeus","yetujey","Lar0k","Ruxic"],
    coaches: ["KEY"],
  },
  "Brazil": {
    players: ["Sato","artzin","aspas","basic","blowz","cauanzin","cortezia","dgzin","less","lukxo","mwzera","pANcada","spikezin","tkzin","tuyz"],
    coaches: ["bzkA","shaW","Stk","Kamino"],
  },
  "Singapore": {
    players: ["Deryeon","Jinggg","nephh","STYRON","Wayne","Vera","JayH","Juicy"],
    coaches: ["Benkai"],
  },
  "Poland": {
    players: ["kaajak","kamo","starxo","PROFEK","westside","paTiTek","UNFAKE"],
    coaches: ["yaotziN"],
  },
  "Philippines": {
    players: ["Zeus","kellyS","xavi8k","invy","PatMen","Markyyy","Wild0reoo","Boni","GLYPH"],
    coaches: ["rbtx"],
  },
  "Great Britain": {
    players: ["Lime","Sevire","benjyfishy","keiko","Ticey","YaBoiLewis","Chaza","Boaster"],
    coaches: ["gunter","bambino","mini","neilzinho"],
  },
  "Chinese Taipei": {
    players: ["Nicc","SpiritZ1","WsLeo","spring","S1Mon","Yuicaw","BerLIN","Yoyo","Setrod"],
    coaches: ["AfteR"],
  },
  "Malaysia": {
    players: ["d4v41","theDoctorr","Riza","Fixy","toggle","aplycs"],
    coaches: ["Fayde"],
  },
  "Finland": {
    players: ["Derke","Jamppi","Yohpa_","KingTitoune5","poethFPS","Kajuksz","H1ber","iluri","Famsii","hoody","Snowi"],
    coaches: ["KUNDIKUNDI","finalmoment"],
  },
  "Lithuania": {
    players: ["Boo","MiniBoo","koshmaras","roxie","Kajuks","Destrian","vakk"],
    coaches: ["Nbs"],
  },
  "Thailand": {
    players: ["killua","Primmie","JitBoyS","PTC","Apinya","Kadoom","seph1roth","dodonut"],
    coaches: ["MYM","crws"],
  },
  "Chile": {
    players: ["Mazino","Melser","Shyy","adverso","erde","keznit","kiNgg","tunaso","david"],
    coaches: ["WKN"],
  },
  "Russia": {
    players: ["Shao","nAts","Chronicle","Redgar","Sheydos","f4ngeer","cloud","purp0","something","trexx","Rarga","Kr1stal","Razziss","d3murr","Tenkai","CHADONjr","BlockVALO","TarboshEG","Vandetaa420"],
    coaches: ["steady","engh"],
  },
};
// Esports Nations Cup — Qualificatórios da América do Norte, América do Sul, África, Oriente Médio, Europa, Ásia e Sudeste Asiático/Oceania (seleções NÃO convidadas).
// Elencos reais da ENC; ainda não entram no jogo até o formato de 32 seleções ficar completo.
const ENC_QUALIFIER_NATIONS = {
  NA: {
    "Bahamas": {code:"BS", players:["DrNoL","Khris","BahamianRay","Reed","CoconutEater","Synth"], coaches:[]},
    "Colombia": {code:"CO", players:["Fresht","theory","Mited","Darker","Jow"], coaches:[]},
    "Costa Rica": {code:"CR", players:["Feniz","LiNLiN","Snapss","Juss","Herrera"], coaches:[]},
    "Dominican Republic": {code:"DO", players:["Dobsha","Virtyy","MiniNiwde","Xhowi","Megumi"], coaches:[]},
    "Ecuador": {code:"EC", players:["Halcha","Wuigi","DR3ED","Sokann","ElBacho","Kpasa"], coaches:[]},
    "Guatemala": {code:"GT", players:["RAINMAKER","JuW","GeneralSteak","Hody","JmFolgar","DAST"], coaches:[]},
    "Honduras": {code:"HN", players:["Bull3tZ","xJaileerr","Shuba","Joshe","Tonezer"], coaches:[]},
    "Mexico": {code:"MX", players:["mmonch","Peloncito","solution","otaQ","Mephisto","Sabortzz"], coaches:[]},
    "Panama": {code:"PA", players:["RPD","x1no","Takeda","Yeyostyle","Yukihira","Zeldris"], coaches:[]},
    "Puerto Rico": {code:"PR", players:["MYTHI","vale","gioØ2x","Faith","Amaze"], coaches:[]},
    "Venezuela": {code:"VE", players:["prask","Yaoming","vandals","v1bz","Sitolui"], coaches:[]},
  },
  SA: {
    "Argentina": {code:"AR", players:["saadhak","rubkkoide","jotinha","Neon","Dantedeu5","ruso","Darky"], coaches:[]},
    "Paraguay": {code:"PY", players:["hEN","TOOMEN","Desruzin","Straydog","xKussy","TDY"], coaches:[]},
    "Peru": {code:"PE", players:["Xuto","Lied","SAYLED","Jeffrey","fabiziN","Grimmjow"], coaches:[]},
    "Uruguay": {code:"UY", players:["NaNoW","Zisorz","Mathi","PhriZ","Kombak"], coaches:[]},
  },
  SSA: {
    "Cameroon": {code:"CM", players:["JeromeEmpire","Ryujin Jaka","Mec Bizzvre","Jordan404","The Ccursed"], coaches:[]},
    "Cote d'Ivoire": {code:"CI", players:["Funkaku","OptimusPrime","Nevevra","Trelone King","Franckem"], coaches:[]},
    "Ethiopia": {code:"ET", players:["Saibot","Kuro","Hale","Azazel","Kira"], coaches:[]},
    "Ghana": {code:"GH", players:["Mufasa","Dessy","Viron","Classicle","Renny"], coaches:[]},
    "Malawi": {code:"MW", players:["Godspeed","Comrade","Fish","Megumi (MW)","GmanTheGreat","Evo"], coaches:[]},
    "Mali": {code:"ML", players:["Human","BADMOHFA","MistgunAIN","Mei_huncho","SatsuiNoAdou"], coaches:[]},
    "Mauritius": {code:"MU", players:["Twin","Kagami","Sushi","Mikaa","Wrongway","Le Loup","Skayan"], coaches:[]},
    "Nigeria": {code:"NG", players:["Necro","zek","Zoltox","zeta","Digulous"], coaches:[]},
    "Senegal": {code:"SN", players:["Mbch","KA","4ndre","Breezouu","Bigmoust","Mitsu"], coaches:[]},
    "South Africa": {code:"ZA", players:["thewy","TRAVIS","MORGS","RUDY","Astral"], coaches:[]},
    "Sudan": {code:"SD", players:["Electric","Mobeen","Musta","Alort","Nemo","Check","Awad"], coaches:[]},
  },
  MENA: {
    "Algeria": {code:"DZ", players:["keloqz","zMART","Nail","nysHAA","LALO"], coaches:[]},
    "Azerbaijan": {code:"AZ", players:["NamazoV","Bender","Berlin (AZ)","SairoN","Bezwans"], coaches:[]},
    "Bahrain": {code:"BH", players:["West","Fire","Mary","Max (BH)","Yara"], coaches:[]},
    "Egypt": {code:"EG", players:["avez","Sand","Depyro","Shniider","Yassien","tripz"], coaches:[]},
    "Georgia": {code:"GE", players:["jeLAc","Shifty","Foxy","Fpsdrope","SNesh","K1dd"], coaches:[]},
    "Iraq": {code:"IQ", players:["Rawi","Makarov","ouka","JAH","CHEETAH"], coaches:[]},
    "Jordan": {code:"JO", players:["alvar","Batly","Blittz","Kaito","yellowflash"], coaches:[]},
    "Kazakhstan": {code:"KZ", players:["screwdriver","dos9","doventor","Nrk","Abelzinho","STORM7331"], coaches:[]},
    "Kyrgyzstan": {code:"KG", players:["reos","alym","sak1","Asteria","Adamaliya","Cl0ud"], coaches:[]},
    "Lebanon": {code:"LB", players:["SpYzera","Khodor","P0PPIN","Yohpa","Waddles"], coaches:[]},
    "Morocco": {code:"MA", players:["johnqt","Reduxx","summoNN","Yotaa","BreaK","hAwksinho"], coaches:[]},
    "Oman": {code:"OM", players:["Taloot","RaMio","Venom","Biego","Ezy"], coaches:[]},
    "Palestine": {code:"PS", players:["B4HA","Kohla","M0dy","cobra","broken"], coaches:[]},
    "Saudi Arabia": {code:"SA", players:["KHaaLiD","ExiT","Zimo","Fighter","ada"], coaches:[]},
    "Syria": {code:"SY", players:["Blackcat","Mango","Mohamed S","Slove","BlackBird"], coaches:[]},
    "Tunisia": {code:"TN", players:["Nartzie","Terra","YappA","mazen","Neptunee"], coaches:[]},
    "Turkmenistan": {code:"TM", players:["AUFI","Zero","Anssss","Mered1aN","Mdj"], coaches:[]},
    "United Arab Emirates": {code:"AE", players:["fr1","DVDOV","Ebeeee","TTyke","Akai","Koji"], coaches:[]},
    "Uzbekistan": {code:"UZ", players:["Shake","H4SH1","seito","sladki snov","ins"], coaches:[]},
  },
  EU: {
    "Austria": {code:"AT", players:["eNes","samed","InsaneDINI","Tezics","Kuroo"], coaches:[]},
    "Belgium": {code:"BE", players:["JohnnieBoy","Madaô","Syratch","Flickless","Bluee"], coaches:[]},
    "Cyprus": {code:"CY", players:["Joka","Kotsios","B1ngo","Vourvoullas","Al3x"], coaches:[]},
    "Denmark": {code:"DK", players:["AvovA","mimi","Noia","KPZET","Pa1ze","Bjorn"], coaches:[]},
    "France": {code:"FR", players:["TakaS","mikee","sh1n","CyvOph","Kada"], coaches:[]},
    "Germany": {code:"DE", players:["musashi","Vince","azury","al0rante","zery"], coaches:[]},
    "Greece": {code:"GR", players:["KhA","fanboy","stavros","Cild","Panagios"], coaches:[]},
    "Iceland": {code:"IS", players:["In0X","Dethkeik","Magmag","Wooht","DAJUSY"], coaches:[]},
    "Ireland": {code:"IE", players:["juseu","cmd","Drog","curve","Fractioned"], coaches:[]},
    "Italy": {code:"IT", players:["xazyy","Z3RO","Braso","fraNdina","Bosh"], coaches:[]},
    "Netherlands": {code:"NL", players:["RobbieBk","kya","Apyr","rYn","Tenshi"], coaches:[]},
    "Norway": {code:"NO", players:["laser","Cintyx","fsau","Martux","Leooo"], coaches:[]},
    "Portugal": {code:"PT", players:["Fizzy","OLIZERA","DaviH","Fragger","tomaszy"], coaches:[]},
    "Spain": {code:"ES", players:["Fit1nho","Guardy","Saiz","YuNo","azaziN"], coaches:[]},
    "Sweden": {code:"SE", players:["Demiurge","rehn","Creamydreamy","kappi","Keatz"], coaches:[]},
    "Switzerland": {code:"CH", players:["Ayokz","Sucette","LuKksTt","quo","Glacenz"], coaches:[]},
  },
  SEA: {
    "Australia": {code:"AU", players:["Autumn","LEW","SWERL","Minimise","KADIRI"], coaches:[]},
    "Brunei Darussalam": {code:"BN", players:["Mojo","brat","Wyte","cearr","pia"], coaches:[]},
    "Cambodia": {code:"KH", players:["Spector","2ez4Ploy","angg","Park","Lazer (KH)"], coaches:[]},
    "Guam": {code:"GU", players:["Junho","sprunch","Leverage","Termulo","akaPD"], coaches:[]},
    "Indonesia": {code:"ID", players:["Kushy","xffero","NcSlasher","deLb","splash (ID)"], coaches:[]},
    "Myanmar": {code:"MM", players:["Sharkie","Unblocker","yanty","loaded","Kkatamina"], coaches:[]},
    "New Zealand": {code:"NZ", players:["Blessed","FETA","BiggieCheese","Swifty","RESLYDE"], coaches:[]},
    "Vietnam": {code:"VN", players:["YESicaN","f1cio","Crus","Pr0digy","bucute"], coaches:[]},
  },
  AS: {
    "Bangladesh": {code:"BD", players:["Zami","SkillzAura","Tamim","Saikat","Samin","Shah"], coaches:[]},
    "Hong Kong": {code:"HK", players:["Ace","SiufatBB","YRSelect","NoMan","Kiuuuu"], coaches:[]},
    "India": {code:"IN", players:["Lightningfast","hellff","Hoax","deecee","Venka"], coaches:[]},
    "Japan": {code:"JP", players:["Dep","SugarZ3ro","Meiy","Caedye","Aace"], coaches:[]},
    "Maldives": {code:"MV", players:["Asitte","maestr0","Raitoz","Ahu","Orangehas"], coaches:[]},
    "Mongolia": {code:"MN", players:["decoy","Batenkh","diky","Chintu","rinA"], coaches:[]},
    "Nepal": {code:"NP", players:["Nitrate","Gothey","Frsty","Nooze","TrapperX"], coaches:[]},
    "Pakistan": {code:"PK", players:["tr1ck","Kenshiro","dem0n","D3XT3R","SALT"], coaches:[]},
    "Sri Lanka": {code:"LK", players:["1NSANE","GearZ","Toxii","Russel","R4ky"], coaches:[]},
  },
};
// Esports Nations Cup: 17 seleções convidadas (WC_SELECOES) + 15 vindas dos qualificatórios regionais.
// Vagas por região (sem wildcards): América do Norte 2, América do Sul 2, África 2, MENA 2, Europa 3,
// Sudeste Asiático/Oceania 2, Ásia 2.
const ENC_QUALIFIER_SLOTS = {NA:2, SA:2, SSA:2, MENA:2, EU:3, SEA:2, AS:2};
// Dados (jogadores/técnicos) de qualquer seleção — convidada ou de qualificatório.
function encNationData(name){
  if(WC_SELECOES[name]) return WC_SELECOES[name];
  for(const region of Object.keys(ENC_QUALIFIER_NATIONS)){
    if(ENC_QUALIFIER_NATIONS[region][name]) return ENC_QUALIFIER_NATIONS[region][name];
  }
  return null;
}
// Fator de amortecimento aplicado à soma de (coach + composição + sinergia) antes de somar ao
// rating base — evita que os buffs empilhados deixem o jogo fácil demais.
const BUFF_DAMPING = 0.7;
