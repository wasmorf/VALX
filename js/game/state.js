/* ==========================================================
   state.js — Estado global do jogo
   ========================================================== */

/* ---------------- STATE ---------------- */
let state = {
  screen: "intro",
  campaignHistoryList: [],
  lang: "pt",            // "pt" | "en" | "es"
  difficulty: null,     // "classico" | "selva"
  teamName: null,
  selecao: null,
  carreira: null, // {nome, funcao, qualidades, regiao, time, temporada, historico}
  regionalRegiao: null,
  regionalSelva: false,
  headCoach: null,
  assistantCoach: null,
  coachOptions: [],
  remainingCoaches: [],
  pool: [],
  poolSource: [],
  roster: [],
  pendingSlotChoice: false,
  skipsUsed: 0,
  currentCandidate: null,
  currentCandidates: [],
  confirmingCandidate: null,
  matchScore: {us:0, them:0},
  roundLog: [],
  mapsToWin: 2,
  mapsUs: 0,
  mapsThem: 0,
  mapHistory: [],
  matchStats: {us:[], them:[]},
  seriesStats: {us:[], them:[]},
  campaignStats: null,
  journey: [],
  campaignRecords: {singleMap:{kills:47,holder:"aspas"}, md3:{kills:82,holder:"aspas"}, md5:{kills:126,holder:"marteen"}},
  tournament: null,
  endInfo: null, // {type:'champion'|'runnerup'|'groups'|'playoffs', stageLabelKey?}
};

function overall(p){ return p.overall; }
function teamOverall(roster){ return Math.round(roster.reduce((s,p)=>s+overall(p),0)/roster.length); }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
// Ordem de sorteio do draft: dá um peso maior pra craques com overall 90+ aparecerem,
// sem tirar a aleatoriedade — só aumenta um pouco a chance.
function weightedDrawOrder(arr){
  function pickIdx(weights){
    const total = weights.reduce((s,w)=>s+Math.max(0.01,w),0);
    let r = Math.random()*total;
    for(let i=0;i<weights.length;i++){
      r -= Math.max(0.01,weights[i]);
      if(r<=0) return i;
    }
    return weights.length-1;
  }
  const remaining = [...arr];
  const order = [];
  while(remaining.length){
    const weights = remaining.map(p=>{
      let w = 1;
      if(p.overall>=90) w *= 0.55;
      if((p.tags||[]).includes("campeao_mundial")) w *= 0.55;
      return w;
    });
    const idx = pickIdx(weights);
    order.push(remaining.splice(idx,1)[0]);
  }
  return order.reverse(); // reverso pois o sorteio consome o array via pop() (do final)
}
