/* ==========================================================
   season.js — Temporada: pontos, Masters, Champions e próxima etapa
   ========================================================== */

/* ===== VCT 2027: temporada em etapas (Kickoff, Masters 1, Cup 1, Masters 2, Cup 2, Champions) ===== */
const ASCENSAO_STAGE_SEQ = ["kickoff","masters1","cup1","masters2","cup2","champions"];
const ASCENSAO_STAGE_NAMES = {kickoff:"Kickoff", masters1:"Masters Seoul", cup1:"Cup 1", masters2:"Masters Valencia", cup2:"Cup 2", champions:"Champions", q_kickoff:"Open Qualifier · Kickoff", ql_kickoff:"Última chance · Kickoff", ql_cup1:"Última chance · Cup 1", ql_cup2:"Última chance · Cup 2", q_cup1:"Open Qualifier · Cup 1", q_cup2:"Open Qualifier · Cup 2"};
const ASCENSAO_TERRITORY_POINTS = [10,7,5,4,3,2,1,1,0,0,0,0];
const ASCENSAO_MASTERS_POINTS = [20,14,10,8,5,5,3,3,1,1,1,1];
function ascensaoStageName(key){ return ASCENSAO_STAGE_NAMES[key] || key; }
function L3(pt,en,es){ return state.lang==="en" ? en : state.lang==="es" ? es : pt; }
function ascensaoRegionalTitleCount(h){
  if(h.stages) return h.stages.filter(s=>["kickoff","cup1","cup2"].includes(s.key) && s.placement && s.placement.type==="champion").length;
  return (h.regionalPlacement && h.regionalPlacement.type==="champion") ? 1 : 0;
}
function ascensaoKickoffLabel(h){
  const k = (h.stages||[]).find(s=>s.key==="kickoff");
  if(k && k.notQualified) return L3("Não classificado","Not qualified","No clasificado");
  return ascensaoRegionalPlacementLabel(h.regionalPlacement, null, true);
}
function ascensaoStagesRows(h, mode){
  if(!h.stages) return "";
  return h.stages.filter(s=>s.key!=="champions" || s.notQualified).map(s=>{
    const lbl = s.notQualified ? L3("Não classificado","Not qualified","No clasificado") : ascensaoRegionalPlacementLabel(s.placement, null, true);
    if(mode==="row") return `<div class="test-stat-row"><span>${ascensaoStageName(s.key)}</span><span class="mono" style="color:var(--gold);">${lbl}</span></div>`;
    return `<div style="margin-top:2px;color:var(--muted);font-size:12px;">${ascensaoStageName(s.key)}: ${lbl}</div>`;
  }).join("");
}
function ascensaoJourneyPrefix(){
  if(state.difficulty!=="ascensao" || !state.tournament) return "";
  const tr = state.tournament;
  if(tr.ascensaoPhase==="regional" || tr.ascensaoPhase==="masters") return ascensaoStageName(tr.ascensaoStageKey) + " · ";
  if(tr.ascensaoPhase==="qualifier") return ascensaoStageName("q_"+tr.ascensaoStageKey) + " · ";
  if(tr.ascensaoPhase==="qualifierLC") return ascensaoStageName("ql_"+tr.ascensaoStageKey) + " · ";
  if(tr.ascensaoPhase==="mundial") return "Champions · ";
  if(tr.ascensaoPhase==="worldcup") return t("ascensaoWorldCupLabel") + " · ";
  return "";
}
function ascensaoInitSeason(){
  const c = state.carreira;
  c.seasonPoints = {}; c.seasonStages = []; c.eventRanking = {}; c.mastersField = {}; c.championsOrgs = null; c.championsQualified = false; c.qualifiers = {}; c.qualRank = {};
}
function ascensaoAddPoints(org, pts){
  const c = state.carreira;
  c.seasonPoints[org] = (c.seasonPoints[org]||0) + pts;
}
// Roda o mercado dos 4 territórios uma vez por temporada (o do jogador já veio pronto).
function ascensaoRunSeasonMarket(ownTrans, ownCoach){
  const c = state.carreira;
  c.marketNow = {};
  c.marketNow[c.regiao] = {transferencias: ownTrans, transferenciasCoach: ownCoach};
  const used = new Set(), usedCoach = new Set();
  Object.values(ownTrans).forEach(pl=>pl.filter(Boolean).forEach(n=>used.add(n)));
  Object.values(ownCoach).forEach(x=>{ if(x) usedCoach.add(x); });
  Object.keys(TEAM_REGIONS).filter(r=>r!==c.regiao).forEach(r=>{
    const tr = simulateRegionalTransfers(r, null, used);
    const co = simulateRegionalCoachTransfers(r, null, tr, usedCoach);
    territoryAllOrgs(r).forEach(org=>{
      if(tr[org]) c.orgRostersSnapshot[org] = {...c.orgRostersSnapshot[org], players: tr[org], coach: co[org] || c.orgRostersSnapshot[org].coach};
    });
    ascensaoDedupeSnapshot(c.orgRostersSnapshot, territoryAllOrgs(r));
    c.marketNow[r] = {transferencias: tr, transferenciasCoach: co};
    Object.values(tr).forEach(pl=>pl.filter(Boolean).forEach(n=>used.add(n)));
    Object.values(co).forEach(x=>{ if(x) usedCoach.add(x); });
  });
}
function ascensaoTeamForOrg(org, regiao){
  const m = state.carreira.marketNow[regiao];
  return buildAscensaoOrgTeam(org, false, m.transferencias[org], m.transferenciasCoach[org]);
}
function ascensaoBuildPlayerTeam(){
  const c = state.carreira;
  const m = c.marketNow[c.regiao];
  const tm = buildAscensaoOrgTeam(c.time, true, m.transferencias[c.time], m.transferenciasCoach[c.time]);
  tm.isPlayer = true;
  return tm;
}
// Executa uma chave de eliminação dupla só com IA e devolve os times do 1º ao último.
function ascensaoRunBracketAI(seeds, def){
  const res = {}; const out = [];
  const pick = f=> f.seed!==undefined ? seeds[f.seed] : (f.res==="w" ? res[f.m].winner : res[f.m].loser);
  let finalW = null, finalL = null;
  def.forEach((d,i)=>{
    const r = decideMatchWinner(pick(d.aFrom), pick(d.bFrom), 2);
    res[d.id] = {winner:r.winner, loser:r.loser};
    if(i===def.length-1){ finalW = r.winner; finalL = r.loser; }
    else if(LB_KEYS.includes(d.labelKey)) out.push(r.loser);
  });
  return [finalW, finalL, ...out.reverse()];
}
// Evento de território só com IA (12 times): 2 grupos de 6 (turno único) + chave de 6.
function ascensaoSimTerritoryRanking(teams){
  const sh = shuffle(teams.slice());
  const rank = g=>{
    const st = initRegionalStandings(g);
    roundRobinSchedule(g, true).forEach(rod=>rod.forEach(([a,b])=>{
      const res = decideMatchWinnerWithRounds(a, b, 2);
      registrarResultadoGrupoRegional(st, a, b, res, res.roundsA, res.roundsB);
    }));
    return rankRegionalGroup(st).map(s=>s.team);
  };
  const rA = rank(sh.slice(0,6)), rB = rank(sh.slice(6,12));
  const order = ascensaoRunBracketAI([rA[0],rB[0],rA[1],rB[1],rA[2],rB[2]], SIX_TEAM_BRACKET_DEF);
  return [...order, rA[3], rB[3], rA[4], rB[4], rA[5], rB[5]];
}
function ascensaoPlacementIndex(endInfo){
  if(endInfo.type==="champion") return 0;
  if(endInfo.type==="runnerup") return 1;
  if(endInfo.type==="groups") return 6 + Math.floor(Math.random()*6);
  const k = endInfo.stageLabelKey;
  if(k==="lbFinal") return 2;
  if(k==="lbSemi") return 3;
  return 4 + Math.floor(Math.random()*2);
}
function ascensaoSetRanking(key, regiao, rankingOrgs, tabela){
  const c = state.carreira;
  if(!c.eventRanking[key]) c.eventRanking[key] = {};
  c.eventRanking[key][regiao] = rankingOrgs;
  rankingOrgs.forEach((org,i)=>ascensaoAddPoints(org, tabela[i]||0));
}
function ascensaoSimAITerritory(key, regiao){
  const c = state.carreira;
  const m = c.marketNow[regiao];
  const field = ascensaoTerritoryField(regiao, key);
  const teams = field.map(org=>ascensaoTeamForOrg(org, regiao));
  ascensaoSetRanking(key, regiao, ascensaoSimTerritoryRanking(teams).map(t=>t.name), ASCENSAO_TERRITORY_POINTS);
}
// Fecha um evento de território que o jogador jogou ao vivo: encaixa a colocação real dele no
// ranking simulado dos outros times e simula os outros 3 territórios.
function ascensaoFinishTerritoryEvent(key, endInfo){
  const c = state.carreira;
  const teams = (c.lastField || []).map(org=> org===c.time ? ascensaoBuildPlayerTeam() : ascensaoTeamForOrg(org, c.regiao));
  let ranking = ascensaoSimTerritoryRanking(teams).map(t=>t.name).filter(n=>n!==c.time);
  ranking.splice(Math.min(ascensaoPlacementIndex(endInfo), ranking.length), 0, c.time);
  ascensaoSetRanking(key, c.regiao, ranking, ASCENSAO_TERRITORY_POINTS);
  Object.keys(TEAM_REGIONS).filter(r=>r!==c.regiao).forEach(r=>ascensaoSimAITerritory(key, r));
}
// Masters: top 3 de cada território no evento anterior (12 times).
function ascensaoMastersField(key){
  const c = state.carreira;
  const prev = key==="masters1" ? "kickoff" : "cup1";
  const out = [];
  Object.keys(TEAM_REGIONS).forEach(r=>{
    const rk = (c.eventRanking[prev] && c.eventRanking[prev][r]) || [];
    out.push(...rk.slice(0,3));
  });
  return out;
}
function ascensaoMastersSeeds(w, r){
  return [w[0], w[1], r[2], r[1], w[2], r[0]];
}
function ascensaoSimMasters(teams){
  const sh = shuffle(teams.slice());
  const groups = [sh.slice(0,4), sh.slice(4,8), sh.slice(8,12)];
  const W = [], R = [], rest = [];
  groups.forEach(g=>{
    const q = buildGroupQualifiersAI(shuffle(g.slice()));
    W.push(q[0]); R.push(q[1]);
    g.forEach(t=>{ if(t.name!==q[0].name && t.name!==q[1].name) rest.push(t); });
  });
  const order = ascensaoRunBracketAI(ascensaoMastersSeeds(W, R), SIX_TEAM_BRACKET_DEF);
  return [...order, ...shuffle(rest)];
}
function ascensaoFinishMasters(key, endInfo){
  const c = state.carreira;
  const orgs = c.mastersField[key];
  const teams = orgs.map(org=> org===c.time ? ascensaoBuildPlayerTeam() : ascensaoTeamForOrg(org, ORG_TERRITORY[org]));
  let ranking = ascensaoSimMasters(teams).map(t=>t.name).filter(n=>n!==c.time);
  ranking.splice(Math.min(ascensaoPlacementIndex(endInfo), ranking.length), 0, c.time);
  if(!c.eventRanking[key]) c.eventRanking[key] = {};
  ranking.forEach((org,i)=>ascensaoAddPoints(org, ASCENSAO_MASTERS_POINTS[i]||0));
}
function ascensaoRunMastersAI(key){
  const c = state.carreira;
  const orgs = c.mastersField[key];
  const teams = orgs.map(org=>ascensaoTeamForOrg(org, ORG_TERRITORY[org]));
  ascensaoSimMasters(teams).forEach((t,i)=>ascensaoAddPoints(t.name, ASCENSAO_MASTERS_POINTS[i]||0));
}
// Champions: top 4 de cada território na soma dos pontos da temporada (16 times).
function ascensaoChampionsOrgs(){
  const c = state.carreira;
  const out = [];
  Object.keys(TEAM_REGIONS).forEach(r=>{
    const m = c.marketNow[r];
    const orgs = territoryAllOrgs(r).slice().sort((a,b)=>
      ((c.seasonPoints[b]||0)-(c.seasonPoints[a]||0)) || (ascensaoOrgStrength(b, m.transferencias)-ascensaoOrgStrength(a, m.transferencias)));
    out.push(...orgs.slice(0,4));
  });
  return out;
}
// Descobre a próxima etapa em que o jogador joga, simulando (só IA) as que ele não disputa.
function ascensaoNextAction(currentKey){
  const c = state.carreira;
  let i = ASCENSAO_STAGE_SEQ.indexOf(currentKey) + 1;
  while(i < ASCENSAO_STAGE_SEQ.length){
    const k = ASCENSAO_STAGE_SEQ[i];
    if(k==="masters1" || k==="masters2"){
      c.mastersField[k] = ascensaoMastersField(k);
      if(c.mastersField[k].includes(c.time)) return {type:"stage", key:k};
      ascensaoRunMastersAI(k);
      c.seasonStages.push({key:k, notQualified:true});
    } else if(k==="champions"){
      c.championsOrgs = ascensaoChampionsOrgs();
      c.championsQualified = c.championsOrgs.includes(c.time);
      if(c.championsQualified) return {type:"stage", key:k};
      c.seasonStages.push({key:k, notQualified:true});
    } else {
      return {type:"stage", key:k};
    }
    i++;
  }
  return ascensaoSeasonEndAction();
}
function ascensaoSeasonEndAction(){
  const c = state.carreira;
  const kick = c.seasonStages.find(s=>s.key==="kickoff");
  const champ = c.seasonStages.find(s=>s.key==="champions" && s.resultado);
  const base = {regionalPlacement: kick && kick.placement, qualificou: !!c.championsQualified, mundialResultado: champ ? champ.resultado : undefined};
  return isAscensaoWorldCupSeason(c.temporada) ? {type:"worldcup", ...base} : {type:"finish", ...base};
}
// Texto sobre a classificação pra próxima etapa, mostrado no resumo.
function ascensaoQualifyNote(key){
  const c = state.carreira;
  if(key==="kickoff" || key==="cup1"){
    const mk = key==="kickoff" ? "masters1" : "masters2";
    const ok = c.mastersField[mk] && c.mastersField[mk].includes(c.time);
    return ok ? L3("Classificado para o "+ascensaoStageName(mk), "Qualified for "+ascensaoStageName(mk), "Clasificado a "+ascensaoStageName(mk))
              : L3("Fora do "+ascensaoStageName(mk), "Out of "+ascensaoStageName(mk), "Fuera de "+ascensaoStageName(mk));
  }
  if(key==="cup2"){
    return c.championsQualified ? t("ascensaoQualifiedTitle") : L3("Fora do Champions","Out of Champions","Fuera de Champions");
  }
  return undefined;
}
function setupAscensaoMastersStage(key){
  const c = state.carreira;
  state.difficulty = "ascensao";
  state.screen = "match";
  state.journeyStageStart = state.journey.length;
  const playerOrgTeam = ascensaoBuildPlayerTeam();
  state.roster = playerOrgTeam.roster; state.teamName = c.time; state.headCoach = playerOrgTeam.coach; state.assistantCoach = playerOrgTeam.ac || null;
  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  const others = c.mastersField[key].filter(o=>o!==c.time).map(org=>ascensaoTeamForOrg(org, ORG_TERRITORY[org]));
  const all = shuffle([playerOrgTeam, ...others]);
  const gA = all.slice(0,4), gB = all.slice(4,8), gC = all.slice(8,12);
  const myGroup = [gA,gB,gC].find(g=>g.some(t=>t.isPlayer));
  const otherGroupsTop2 = {};
  [["A",gA],["B",gB],["C",gC]].forEach(([l,g])=>{ if(g!==myGroup) otherGroupsTop2[l] = buildGroupQualifiersAI(g); });
  state.tournament = {
    stage: "groups", playerTeam: playerOrgTeam, otherGroupsTop2,
    ascensaoPhase: "masters", ascensaoStageKey: key,
    groupBracket: { seeds: shuffle(myGroup), matches: {}, pointerIdx:0, pending:null },
  };
  GROUP_BRACKET_DEF.forEach(d=>{ state.tournament.groupBracket.matches[d.id] = {winner:null, loser:null}; });
  advanceGroupBracket();
}
function ascensaoStartStage(key){
  const c = state.carreira;
  if(key==="masters1" || key==="masters2") return setupAscensaoMastersStage(key);
  if(key==="champions") return setupAscensaoMundialStage();
  if(key.startsWith("ql_")) return setupAscensaoQualifierLCStage(key.slice(3));
  const m = c.marketNow[c.regiao];
  return setupAscensaoRegionalStage({transferencias: m.transferencias, transferenciasCoach: m.transferenciasCoach}, key);
}

function ascensaoOrFinalize(endInfo){
  state.endInfo = endInfo;
  if(state.difficulty==="ascensao"){
    ascensaoHandleStageEnd(endInfo);
  } else {
    finalizeCampaign();
  }
}
