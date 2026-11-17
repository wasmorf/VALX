/* ==========================================================
   match-flow.js — Fluxo de partida, MVP e armazenamento
   ========================================================== */

function handleContinue(){
  const tr = state.tournament;
  const won = state.mapsUs === state.mapsToWin;

  if(tr.stage==="regionalGroups"){
    const g = tr.regionalGroups.myGroup;
    const pending = g.pending;
    const oppTeam = pending.teamA.isPlayer ? pending.teamB : pending.teamA;
    const {atual, total} = regionalPlayerRoundNumber(g.schedule, pending.roundIdx);
    state.journey.push({
      stageLabel: `${ascensaoJourneyPrefix()}${t("groupStageTag")} · ${t("groupWord")} ${tr.myGroupLetter} · ${t("regionalRoundLabel")(atual, total)}`,
      opponent: oppTeam.name,
      result: won ? "W" : "L",
      score: `${state.mapsUs}-${state.mapsThem}`,
    });
    const winner = won ? tr.playerTeam : oppTeam;
    const loser = won ? oppTeam : tr.playerTeam;
    // soma o placar de rounds de verdade dos mapas que o jogador acabou de jogar
    let playerRounds = 0, oppRounds = 0;
    state.mapHistory.forEach(m=>{ playerRounds += m.us; oppRounds += m.them; });
    const roundsA = pending.teamA.isPlayer ? playerRounds : oppRounds;
    const roundsB = pending.teamB.isPlayer ? playerRounds : oppRounds;
    registrarResultadoGrupoRegional(g.standings, pending.teamA, pending.teamB, {winner, loser}, roundsA, roundsB);
    g.matchIdxInRound++;
    advanceRegionalGroups();
    return;
  }

  if(tr.stage==="groups"){
    const brk = tr.groupBracket;
    const pending = brk.pending;
    const oppTeam = pending.teamA.isPlayer ? pending.teamB : pending.teamA;
    state.journey.push({
      stageLabel: `${ascensaoJourneyPrefix()}${t("groupStageTag")} · ${t("groupWord")} ${tr.encGroupLetter||"A"} · ${bracketLabel(pending.def.labelKey)}`,
      opponent: oppTeam.name,
      result: won ? "W" : "L",
      score: `${state.mapsUs}-${state.mapsThem}`,
    });
    const winner = won ? tr.playerTeam : oppTeam;
    const loser = won ? oppTeam : tr.playerTeam;
    brk.matches[pending.def.id] = {winner, loser};
    brk.pointerIdx++;

    const qualified = won && GROUP_QUALIFY_IDS.includes(pending.def.id);
    const eliminated = !won && GROUP_ELIM_IDS.includes(pending.def.id);
    if(qualified || eliminated){
      finishGroupBracketAI(); // resolve o que sobrou do grupo (só IA) pra fechar os classificados
      if(qualified){
        const top2 = [
          {...brk.matches.m3.winner, isGroupWinner:true},
          {...brk.matches.m5.winner, isGroupWinner:false},
        ];
        // Copa do Mundo (isolada ou dentro do Ascensão) tem um formato próprio: só 3 grupos de
        // 4 (não 4), e Brasil/Estados Unidos entram direto nos playoffs sem passar pela fase
        // de grupos.
        const qualifiers = (state.difficulty==="copa" || tr.ascensaoPhase==="worldcup" || tr.ascensaoPhase==="masters")
          ? [...top2, ...Object.values(tr.otherGroupsTop2).flat(), ...(tr.byeTeams||[])]
          : [...top2, ...tr.otherGroupsTop2.B, ...tr.otherGroupsTop2.C, ...tr.otherGroupsTop2.D];
        if(tr.ascensaoPhase==="masters"){
          const gs = [top2, ...Object.values(tr.otherGroupsTop2)];
          buildPlayoffBracketSeeded(ascensaoMastersSeeds(gs.map(g=>g[0]), gs.map(g=>g[1])), SIX_TEAM_BRACKET_DEF);
        } else if(state.difficulty==="copa" || tr.ascensaoPhase==="worldcup"){
          buildPlayoffBracket(qualifiers, ENC_BRACKET16_DEF); // Esports Nations Cup: 16 times
        } else {
          buildPlayoffBracket(qualifiers);
        }
        advanceTournament();
      } else {
        ascensaoOrFinalize({type:"groups"});
      }
      return;
    }
    // ainda não decidido (1ª rodada) — segue pro próximo confronto do jogador no grupo
    advanceGroupBracket();
    return;
  }

  if(tr.stage==="playoffs"){
    const brk = tr.bracket;
    const pending = brk.pending;
    const oppTeam = pending.teamA.isPlayer ? pending.teamB : pending.teamA;
    state.journey.push({
      stageLabel: ascensaoJourneyPrefix() + encQualifierPrefix() + bracketLabel(pending.def.labelKey),
      opponent: oppTeam.name,
      result: won ? "W" : "L",
      score: `${state.mapsUs}-${state.mapsThem}`,
    });
    const winner = won ? tr.playerTeam : oppTeam;
    const loser = won ? oppTeam : tr.playerTeam;
    brk.matches[pending.def.id] = {winner, loser};
    brk.pointerIdx++;

    if(won){
      advanceTournament();
      return;
    }
    // jogador perdeu
    const finalId = brk.def ? brk.def[brk.def.length-1].id : "m14";
    if(pending.def.id === finalId){
      ascensaoOrFinalize({type:"runnerup"});
      return;
    }
    if(LB_KEYS.includes(pending.def.labelKey)){
      ascensaoOrFinalize({type:"playoffs", stageLabelKey: pending.def.labelKey});
      return;
    }
    // derrota no upper bracket: cai para o lower, torneio continua
    advanceTournament();
  }
}

// Inicia uma partida nova (MD3 = mapsToWin 2, MD5 = mapsToWin 3).
function startMatch(mapsToWin){
  state.mapsToWin = mapsToWin;
  state.mapsUs = 0;
  state.mapsThem = 0;
  state.mapHistory = [];
  state.matchScore = {us:0, them:0};
  state.roundLog = [];
  initMatchStats();
  initSeriesStats();
}
// Começa o próximo mapa da mesma partida (mantém o placar de mapas e o total de abates da série).
function startNextMap(){
  state.matchScore = {us:0, them:0};
  state.roundLog = [];
  initMatchStats();
}
// Registra o resultado do mapa atual no placar da partida e acumula os abates na série e na campanha.
function finalizeMap(){
  const wonMap = state.matchScore.us > state.matchScore.them;
  state.mapHistory.push({us:state.matchScore.us, them:state.matchScore.them});
  if(wonMap) state.mapsUs++; else state.mapsThem++;
  state.matchStats.us.forEach((p,i)=>{ if(state.seriesStats.us[i]) state.seriesStats.us[i].k += p.k; });
  state.matchStats.them.forEach((p,i)=>{ if(state.seriesStats.them[i]) state.seriesStats.them[i].k += p.k; });
  if(state.campaignStats){
    state.matchStats.us.forEach((p,i)=>{
      const cs = state.campaignStats.us[i];
      if(cs){ cs.k += p.k; cs.d += p.d; cs.a += p.a; }
    });
  }
  // recorde de mapa único da campanha (vale pro seu time E pro adversário)
  const cr = state.campaignRecords;
  [...state.matchStats.us, ...state.matchStats.them].forEach(p=>{
    if(p.k > cr.singleMap.kills) cr.singleMap = {kills:p.k, holder:p.name};
  });
  // recorde de série (MD3/MD5) da campanha — soma o que já tinha na série + este mapa
  const seriesKey = state.mapsToWin===3 ? "md5" : "md3";
  state.matchStats.us.forEach((p,i)=>{
    const total = (state.seriesStats.us[i] ? state.seriesStats.us[i].k : 0);
    if(total > cr[seriesKey].kills) cr[seriesKey] = {kills:total, holder:p.name};
  });
  state.matchStats.them.forEach((p,i)=>{
    const total = (state.seriesStats.them[i] ? state.seriesStats.them[i].k : 0);
    if(total > cr[seriesKey].kills) cr[seriesKey] = {kills:total, holder:p.name};
  });
}

// Melhor jogador da campanha (MVP), baseado numa nota simples de desempenho acumulado.
function getMVP(){
  if(!state.campaignStats || !state.campaignStats.us.length) return null;
  return state.campaignStats.us.reduce((best, p)=>{
    const score = p.k + p.a*0.5 - p.d*0.3;
    const bestScore = best ? (best.k + best.a*0.5 - best.d*0.3) : -Infinity;
    return score > bestScore ? p : best;
  }, null);
}

// Monta o texto de compartilhamento (X / WhatsApp) com o resumo da campanha.
// Marca a campanha como encerrada e salva um registro dela no histórico (armazenamento pessoal).
// Armazenamento com fallback: usa window.storage quando disponível (preview do Claude), e cai
// pra localStorage quando o site está hospedado de verdade fora daqui (GitHub Pages, etc.) —
// sem isso, o histórico de campanhas simplesmente não funciona fora do preview do Claude.
const HAS_ARTIFACT_STORAGE = typeof window!=="undefined" && window.storage && typeof window.storage.get==="function";
async function storageGetValue(key){
  if(HAS_ARTIFACT_STORAGE){
    try{ const res = await window.storage.get(key, false); return res ? res.value : null; }
    catch(e){ return null; }
  }
  try{ return localStorage.getItem(key); }catch(e){ return null; }
}
async function storageSetValue(key, value){
  if(HAS_ARTIFACT_STORAGE){
    try{ await window.storage.set(key, value, false); return; }catch(e){ /* tenta localStorage abaixo */ }
  }
  try{ localStorage.setItem(key, value); }catch(e){ /* armazenamento indisponível — segue o jogo normalmente */ }
}
