/* ==========================================================
   match-stats.js — Estatísticas e simulação de rounds
   ========================================================== */

function initSeriesStats(){
  state.seriesStats = {
    us: state.matchStats.us.map(p=>({name:p.name, k:0})),
    them: state.matchStats.them.map(p=>({name:p.name, k:0})),
  };
}

// Verifica (sem alterar o estado) se a partida atual — incluindo o mapa em andamento —
// já superou o recorde "a bater" desta partida (que pode já ter sido elevado nesta mesma
// partida por um mapa anterior). Usado para exibir o aviso na tela de resultado.
// Verifica (sem alterar o estado) se o mapa/série atual — incluindo o que está rolando agora —
// já superou o recorde "a bater" da CAMPANHA (que pode já ter sido elevado por qualquer um dos
// dois lados, em qualquer partida anterior desta campanha). Usado para exibir o aviso na tela.
function checkRecords(){
  const bo = state.mapsToWin===3 ? "md5" : "md3";
  const cr = state.campaignRecords;

  function bestBreak(usArr, themArr, currentRecord){
    let best = null;
    function consider(p, side){
      if(p.kills > currentRecord.kills && (!best || p.kills>best.kills)){
        best = {side, name:p.name, kills:p.kills};
      }
    }
    usArr.forEach(x=>consider(x,"us"));
    themArr.forEach(x=>consider(x,"them"));
    return best;
  }

  const singleMapUs = state.matchStats.us.map(p=>({name:p.name, kills:p.k}));
  const singleMapThem = state.matchStats.them.map(p=>({name:p.name, kills:p.k}));
  const singleMapBreak = bestBreak(singleMapUs, singleMapThem, cr.singleMap);

  const seriesUs = state.matchStats.us.map((p,i)=>({name:p.name, kills:(state.seriesStats.us[i]?state.seriesStats.us[i].k:0)+p.k}));
  const seriesThem = state.matchStats.them.map((p,i)=>({name:p.name, kills:(state.seriesStats.them[i]?state.seriesStats.them[i].k:0)+p.k}));
  const seriesBreak = bestBreak(seriesUs, seriesThem, cr[bo]);

  return {singleMapBreak, seriesBreak, bo, prevSingleMap:cr.singleMap, prevSeries:cr[bo]};
}

// Decide se o mapa acabou: precisa de pelo menos 13 rounds E vantagem de 2 — em prorrogação
// (12-12 pra frente), continua até alguém abrir 2 de diferença, igual na vida real.
function isMapDecided(us, them){
  const leader = Math.max(us, them);
  const diff = Math.abs(us-them);
  return leader>=13 && diff>=2;
}

function initMatchStats(){
  const opp = currentOpponent();
  const sideStats = rosterArr => rosterArr.map((p,i)=>({name:p.name, slot:SLOT_ORDER[i], roles:p.roles||[], tags:p.tags||[], overall:p.overall||75, isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0}));
  state.matchStats = {
    us: sideStats(state.roster),
    them: sideStats(opp && opp.roster ? opp.roster : []),
  };
}

function weightedPick(weights){
  const total = weights.reduce((s,w)=>s+Math.max(1,w),0);
  let r = Math.random()*total;
  for(let i=0;i<weights.length;i++){
    r -= Math.max(1,weights[i]);
    if(r<=0) return i;
  }
  return weights.length-1;
}
function sampleDistinct(n, k){
  const idx = Array.from({length:n}, (_,i)=>i);
  const out = [];
  const count = Math.min(k, n);
  for(let i=0;i<count;i++){
    const j = Math.floor(Math.random()*idx.length);
    out.push(idx.splice(j,1)[0]);
  }
  return out;
}
// Peso de abate: craques com a tag "mm" (Mira Monstra) e overall 95+ têm chance ampliada de
// puxar os kills da rodada (mais forte em duelistas), abrindo caminho — nem sempre, só nas
// partidas monstruosas — para baterem os recordes reais de abates. Entry/Operator dão um empurrão menor.
// Elegível pra sistema de recorde: é Duelista OU tem Mira Monstra OU tem Clutch (qualquer um dos
// três já basta, não precisa ser tudo junto). Precisa também ter overall alto — senão fica fácil demais.
function isRecordCandidate(p){
  if((p.overall||0) < 89) return false;
  const roles = p.roles||[];
  const tags = p.tags||[];
  return roles.includes("duelist") || tags.includes("mm") || tags.includes("clutch");
}
function killWeight(p){
  let w = 10; // piso: todo mundo tem chance real de abater, mesmo sem destaque nenhum
  w += (p.overall - 75) * 0.3;
  const tags = p.tags||[];
  if(tags.includes("entry") && p.slot==="duelist") w += 1.5;
  if(tags.includes("operator")) w += 1;
  if(tags.includes("clutch")) w += 1.2;
  if(isRecordCandidate(p)) w += ((p.roles||[]).includes("duelist") ? 5.5 : 3.2);
  return w;
}
// Peso de assistência: craques com utilidade/IGL/lurker tendem a puxar mais assistências.
function assistWeight(p){
  let w = 10;
  w += (p.overall - 75) * 0.3;
  const tags = p.tags||[];
  if(tags.includes("utility")) w += 1.5;
  if(tags.includes("igl")) w += 1;
  if(tags.includes("lurker")) w += 0.8;
  return w;
}
function updateMatchStats(weWin){
  const winSide = weWin ? state.matchStats.us : state.matchStats.them;
  const loseSide = weWin ? state.matchStats.them : state.matchStats.us;
  if(!winSide.length || !loseSide.length) return;
  const killCount = 3 + Math.floor(Math.random()*3); // 3 a 5 baixas na rodada
  const diedIdx = sampleDistinct(loseSide.length, killCount);

  // rodada de ACE: craques com Mira Monstra (95+) ou Duelistas com Clutch (93+) têm uma chance
  // bem rara de fechar a rodada sozinhos — é o que permite (raramente) alcançar recordes como o
  // de 47 abates num mapa único, que exigem dominância extrema em várias rodadas.
  const aceCandidates = winSide.filter(isRecordCandidate);
  if(aceCandidates.length && Math.random()<0.22){
    const acePlayer = aceCandidates[Math.floor(Math.random()*aceCandidates.length)];
    diedIdx.forEach(idx=>{ loseSide[idx].d++; });
    acePlayer.k += killCount;
  } else {
    diedIdx.forEach(idx=>{
      loseSide[idx].d++;
      const killerIdx = weightedPick(winSide.map(killWeight));
      winSide[killerIdx].k++;
      if(Math.random()<0.55 && winSide.length>1){
        let assisterIdx = weightedPick(winSide.map(assistWeight));
        if(assisterIdx===killerIdx) assisterIdx = (assisterIdx+1)%winSide.length;
        winSide[assisterIdx].a++;
      }
    });
  }
  // chance de uma baixa "de troca" do lado perdedor
  if(Math.random()<0.2){
    const tradedIdx = weightedPick(loseSide.map(killWeight));
    loseSide[tradedIdx].k++;
    const victimIdx = Math.floor(Math.random()*winSide.length);
    winSide[victimIdx].d++;
  }
  // rodada de destaque: craques com Mira Monstra (95+) ou Duelistas com Clutch (93+) têm uma
  // chance rara de puxar 1 abate extra na rodada.
  const stars = winSide.filter(isRecordCandidate);
  if(stars.length && Math.random()<0.09){
    const idx = winSide.indexOf(stars[Math.floor(Math.random()*stars.length)]);
    winSide[idx].k++;
  }
}

// Lado atual (ataque/defesa) do jogador no mapa em andamento — troca a cada 12 rounds, igual real.
function currentSide(){
  const totalRounds = state.matchScore.us + state.matchScore.them;
  return (Math.floor(totalRounds/12) % 2 === 0) ? "attack" : "defense";
}

const DEFENSE_EDGE = 1.5; // defesa tem uma vantagem estatística pequena sobre o ataque, sempre
const PISTOL_ECON_BONUS = 3; // quem vence a pistola (rodada 1 ou 13) leva vantagem só na rodada seguinte

function simulateRound(){
  const opp = currentOpponent();
  const ourSide = currentSide();
  const theirSide = ourSide==="attack" ? "defense" : "attack";
  const ourComp = compositionBonus(state.roster, true);
  const theirComp = compositionBonus(opp.roster, false);
  const ourBuff = coachBuff(state.headCoach) + assistantBuff(state.roster, state.assistantCoach) + ourComp[ourSide] + chemistryBonus(state.roster, state.headCoach);
  const theirBuff = coachBuff(opp.coach) + assistantBuff(opp.roster, opp.ac) + theirComp[theirSide] + chemistryBonus(opp.roster, opp.coach);

  // vantagem estatística da defesa (independente de composição/química)
  const ourDefenseEdge = ourSide==="defense" ? DEFENSE_EDGE : 0;
  const theirDefenseEdge = theirSide==="defense" ? DEFENSE_EDGE : 0;

  // economia de pistola: só vale na rodada IMEDIATAMENTE seguinte à rodada 1 ou à rodada 13
  const roundsPlayed = state.matchScore.us + state.matchScore.them;
  let ourPistolBonus = 0, theirPistolBonus = 0;
  if(roundsPlayed===1 || roundsPlayed===13){
    const pistolWinnerIdx = roundsPlayed===1 ? 0 : 12;
    if(state.roundLog[pistolWinnerIdx]==="win") ourPistolBonus = PISTOL_ECON_BONUS;
    else theirPistolBonus = PISTOL_ECON_BONUS;
  }

  const us = teamOverall(state.roster) + ourBuff*BUFF_DAMPING + ourDefenseEdge + ourPistolBonus;
  const oppRating = opp.rating + theirBuff*BUFF_DAMPING + theirDefenseEdge + theirPistolBonus;
  const diff = us - oppRating;
  const baseProb = 0.5 + diff/130;
  const prob = Math.min(0.94, Math.max(0.06, baseProb));
  const weWin = Math.random() < prob;
  if(weWin){ state.matchScore.us++; state.roundLog.push("win"); }
  else { state.matchScore.them++; state.roundLog.push("loss"); }
  updateMatchStats(weWin);
}
