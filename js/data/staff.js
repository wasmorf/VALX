/* ==========================================================
   staff.js — Técnicos (HC/AC), buffs e Seleções da Copa do Mundo
   ========================================================== */

// Quantos times de cada região se classificam pro Mundial, dependendo do tamanho da região.
const REGIONAL_MUNDIAL_QUALIFY_COUNT = {AMERICAS:4, EMEA:4, PACIFIC:4, CN:4};

// Head coaches disponíveis — 1 escolhido pelo jogador, os outros 15 vão pras equipes adversárias.
const COACHES = ["Rojo","Nbs","bzkA","Potter","frod","mini","Chet","d00mbros","Kaplan","alecks","Romanilly","Bati","bonzitt","Sacy","Stk","Onur","JoshRT","bonkar","shaW","Kamino","SilKanoN","NaThanD","Stunner","KEY","WKN","Ewok","Engh","PatronW","gaabxx","Veer","phonics","ZONYK","solo","neilzinho","ANGE1","peu","DragziKW","Carlao","ryotzz","Negaral","Itopata","pule","Autumn","alexRr","LEGIJA","LohaN","Vlad","ZE1SH","Scuttt","glow","KDG","GUNTER","mitch","Happy","SLK","Desmo","Bambino","Sungmin","hsk","Faded","ryota-","XQQ","Crws","Vorz","JeXeN","pipsoN","hypnotizing","bail","Fayde","destroyeR","AfteR","steady","Milan","Senny","Lefiedot","mltdwn","RBTX","meowvlrt","Persia","effys","Oderus","Immi","monSi","FNS","Tanizhq","Valadao","Luck","slowiscool","Branchies","Godspeed","jovi","Fame","panique","Cyyy","Nearley","ED101","Sunshine","York","DaJ","Anaks","heav1n","meisoN","xikii_gg","Larsson","SKAZZ","Andreas","GAIS","Bromas","hvoya","finalmoment","Johnta","Celo","Viento"];
// Buff de cada Head Coach: bônus fixo aplicado ao rating do time em todo cálculo de vitória
// de rodada/partida — vale pra qualquer equipe (sua ou adversária) que tiver esse técnico.
const COACH_BUFFS = {
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
    players: ["CHICHOO","Haodong","Jieni7","Lysoar","ZmjjKK","happywei","nobody"],
    coaches: ["NaThanD"],
  },
  "Canada": {
    players: ["TenZ","FNS","Asuna","JonahP","Kyu","Timotino","Vora","eeiu","koalanoob","mada","moose","zander","marved"],
    coaches: ["Stunner"],
  },
  "Turkey": {
    players: ["Alfajer","AtaKaptan","LewN","MrFaliN","RieNs","Wo0t","hiro","s0pp","xeus","yetujey","Lar0k"],
    coaches: ["KEY"],
  },
  "Brazil": {
    players: ["Sato","artzin","aspas","basic","blowz","cauanzin","cortezia","dgzin","less","lukxo","mwzera","pANcada","spikezin","tkzin","tuyz"],
    coaches: ["bzkA","shaW","Stk","Kamino"],
  },
  "Argentina": {
    players: ["saadhak","Neon","Dantedeu5","nzr","jotinha"],
    coaches: ["Onur","Romanilly"],
  },
  "Chile": {
    players: ["Mazino","Melser","Shyy","adverso","erde","keznit","kiNgg"],
    coaches: ["WKN"],
  },
  "Morocco": {
    players: ["Johnqt","Reduxx","summoNN","hAwksinho","BreaK"],
    coaches: ["Ewok"],
  },
  "Lithuania": {
    players: ["Boo","MiniBoo","koshmaras","roxie","Kajuks"],
    coaches: ["Nbs"],
  },
  "Finland/Sweden": {
    players: ["Derke","Jamppi","Sayf","Leo","Zyppan"],
    coaches: ["bonkar","d00mbros"],
  },
  "Russia": {
    players: ["Chronicle","Rarga","Shao","nAts","something","trexx"],
    coaches: ["Engh"],
  },
  "Poland/Ukraine": {
    players: ["PROFEK","kaajak","kamo","paTiTek","SUYGETSU","Kolosha"],
    coaches: ["ANGE1"],
  },
  "United Kingdom/Vietnam": {
    players: ["Boaster","benjyfishy","keiko","Okeanos","bao"],
    coaches: ["mini"],
  },
};
// Fator de amortecimento aplicado à soma de (coach + composição + sinergia) antes de somar ao
// rating base — evita que os buffs empilhados deixem o jogo fácil demais.
const BUFF_DAMPING = 0.7;
