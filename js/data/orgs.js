/* ==========================================================
   orgs.js — Organizações, territórios parceiros/não parceiros e sub-regiões
   ========================================================== */

const POOL_MAP = new Map(); POOL.forEach(p=>{ const k=p.name.toLowerCase(); if(!POOL_MAP.has(k)) POOL_MAP.set(k,p); });
function poolGet(n){ return n ? POOL_MAP.get(String(n).toLowerCase()) : undefined; }

// 16 organizações parceiras do VCT 2027 (4 de cada território) — uma é escolhida pelo jogador,
// as outras 15 viram adversárias no Mundial.
const TEAM_NAMES = [
  {name:"100 Thieves",        rating:91},
  {name:"G2 Esports",         rating:97},
  {name:"Leviatán Esports",   rating:92},
  {name:"Sentinels",          rating:90},
  {name:"Team Vitality",      rating:95},
  {name:"FNATIC",             rating:95},
  {name:"Team Liquid",        rating:90},
  {name:"Team Heretics",      rating:94},
  {name:"Paper Rex",          rating:99},
  {name:"T1",                 rating:93},
  {name:"Gen.G",              rating:92},
  {name:"Rex Regum Qeon",     rating:90},
  {name:"EDward Gaming",      rating:94},
  {name:"TYLOO",              rating:90},
  {name:"All Gamers",         rating:88},
  {name:"Trace Esports",      rating:89},
];

// Organização dos times por região — dado guardado pra uso futuro, NÃO está conectado a
// nenhuma tela ou lógica do jogo ainda (o jogo continua usando só o TEAM_NAMES acima, com
// as 16 organizações de sempre). Só 6 desses times já existem no TEAM_NAMES hoje; os outros
// 50 são times novos que ainda não têm elenco nem entram no draft/torneio.
const TEAM_REGIONS = {
  "AMERICAS": ["Sentinels", "100 Thieves", "G2 Esports", "NRG", "LOUD", "MIBR", "KRÜ Visa", "Leviatán Esports"],
  "EMEA": ["Team Vitality", "FNATIC", "Team Liquid", "Team Heretics", "Karmine Corp", "Gentle Mates", "FUT Esports", "BBL Esports"],
  "PACIFIC": ["Paper Rex", "T1", "Gen.G", "Rex Regum Qeon", "ZETA DIVISION", "FULL SENSE", "Crazy Raccoon", "GAM Esports"],
  "CN": ["EDward Gaming", "Bilibili Gaming", "TYLOO", "JD Gaming", "All Gamers", "Trace Esports", "Xi Lai Gaming", "Weibo Gaming"],
};
// Times não parceiros (Challengers/Game Changers): entram no Kickoff/Cups via qualifier.
const TERRITORY_CHALLENGERS = {
  "AMERICAS": ["Shopify Rebellion", "Cloud9", "ENVY", "Shopify Rebellion Gold", "FlyQuest", "Masterclass", "Arashi", "2GAME Esports", "PxS' team", "Winthrop University", "9z", "Untamable Beasts", "Team Solid", "Yellow Dragon Gaming", "Evictix", "OAFS", "Wildcard", "EL LEGADO", "counterfeit", "TIME DO B3M", "SÓ TEM VELHO", "Rejects", "BRASIL2002", "NXG", "X-MEN", "0 intelecto", "ARRANCA DREAMS", "Mafiosos", "Master Bank", "505", "Old School Krew", "Squirtle Rangers", "STREAMER ARENA", "ARG.MIX", "fracasados ny", "MALAJUNTA", "TRAMITE"],
  "EMEA": ["R8 Esports", "Barça eSports", "Mandatory", "Team Stallions", "Beşiktaş Esports", "UCAM Esports", "Aurora Gaming", "F9 EICAR", "NAVI Junior", "WIP Esports", "Joblife", "NKVT", "Eternal Fire", "Galatasaray Esports", "Eintracht Frankfurt", "Misa Esports", "Trigon Titans"],
  "PACIFIC": ["Murash Gaming", "Alter Ego × Kertanegara", "BOOM Esports", "QT DIG", "Nongshim RedForce"],
  "CN": ["UR", "Havoc Yonder Gaming", "Any Questions Gaming", "LGD Gaming", "TEC", "KeepBest Gaming", "VLG", "XJG", "Young Gaming"],
};
function territoryAllOrgs(r){ return [...(TEAM_REGIONS[r]||[]), ...(TERRITORY_CHALLENGERS[r]||[])]; }
const ORG_TERRITORY = {};
Object.keys(TEAM_REGIONS).forEach(r=>territoryAllOrgs(r).forEach(o=>{ ORG_TERRITORY[o]=r; }));
function orgIsPartner(org){ const r=ORG_TERRITORY[org]; return !!(r && TEAM_REGIONS[r].includes(org)); }
// Sub-regiões (circuitos de Open Qualifier) de cada território: o campeão de cada uma garante 1 vaga e os vices disputam as que sobram.
const ASCENSAO_SUB_SLOTS = {
  AMERICAS:{NA:1, BR:1, LATAM_N:1, LATAM_S:1},
  EMEA:{EU:3, TR:1},
  PACIFIC:{KR:1, JP:1, SEA:2},
  CN:{CN:4},
};
const ORG_SUB = {};
(function(){
  const m = {
    BR:["LOUD","MIBR","Team Solid","TIME DO B3M","SÓ TEM VELHO","BRASIL2002","0 intelecto","ARRANCA DREAMS","Mafiosos","Master Bank"],
    NA:["Sentinels","100 Thieves","G2 Esports","NRG","Shopify Rebellion","Cloud9","ENVY","Shopify Rebellion Gold","FlyQuest","Masterclass","2GAME Esports","Winthrop University","Untamable Beasts","Evictix","OAFS","Wildcard","PxS' team","Yellow Dragon Gaming","counterfeit","Rejects","NXG","X-MEN"],
    LATAM_N:["505","Old School Krew","Squirtle Rangers","STREAMER ARENA"],
    LATAM_S:["KRÜ Visa","Leviatán Esports","9z","Arashi","EL LEGADO","ARG.MIX","fracasados ny","MALAJUNTA","TRAMITE"],
    EU:["Team Vitality","FNATIC","Team Liquid","Team Heretics","Karmine Corp","Gentle Mates","Barça eSports","Mandatory","UCAM Esports","F9 EICAR","NAVI Junior","WIP Esports","Joblife","NKVT","Eintracht Frankfurt"],
    TR:["FUT Esports","BBL Esports","R8 Esports","Team Stallions","Beşiktaş Esports","Aurora Gaming","Eternal Fire","Galatasaray Esports","Misa Esports","Trigon Titans"],
    KR:["T1","Gen.G","Murash Gaming","Nongshim RedForce"],
    JP:["ZETA DIVISION","Crazy Raccoon","QT DIG"],
    SEA:["Paper Rex","Rex Regum Qeon","FULL SENSE","GAM Esports","Alter Ego × Kertanegara","BOOM Esports"],
  };
  Object.entries(m).forEach(([s,l])=>l.forEach(o=>{ ORG_SUB[o]=s; }));
  territoryAllOrgs("CN").forEach(o=>{ ORG_SUB[o]="CN"; });
})();
function subLabel(s){
  return ({BR:"Brasil", LATAM_N:L3("LATAM Norte","LATAM North","LATAM Norte"), LATAM_S:L3("LATAM Sul","LATAM South","LATAM Sur"), NA:"NA", EU:L3("Europa","Europe","Europa"), TR:L3("Turquia e MENA","Turkey & MENA","Turquía y MENA"), KR:L3("Coreia","Korea","Corea"), JP:L3("Japão","Japan","Japón"), SEA:L3("Sudeste Asiático","Southeast Asia","Sudeste Asiático"), CN:"China"})[s] || s;
}
// Alguns nomes em TEAM_REGIONS já existem em TEAM_NAMES com grafia um pouco diferente —
// esse mapa aproveita o rating de quem já existe em vez de recalcular do zero.
const TEAM_REGION_NAME_ALIASES = {
  "Sentinels":"SENTINELS", "OpTic":"OPTIC", "100 Thieves":"100T",
  "Leviatán":"LEVIATAN", "KRÜ":"KRU", "Paper Rex":"PAPER REX",
  "Team Liquid":"LIQUID", "Team Heretics":"HERETICS",
};
// Times novos que ainda não têm elenco de verdade cadastrado usam essa força padrão.
const TEAM_REGION_DEFAULT_RATING = 85;
function teamRegionRating(name){
  const officialName = TEAM_REGION_NAME_ALIASES[name] || name;
  const found = TEAM_NAMES.find(t=>t.name===officialName);
  return found ? found.rating : TEAM_REGION_DEFAULT_RATING;
}
