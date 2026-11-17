/* ==========================================================
   qualifiers.js — Open Qualifiers por sub-região (Ascensão)
   ========================================================== */

function ascensaoOrgStrength(org, snapshot){
  const base = (state.carreira && state.carreira.orgRostersSnapshot) || ASCENSAO_TEAM_ROSTERS;
  const names = (snapshot && snapshot[org]) || (base[org] && base[org].players) || [];
  const ovs = names.filter(Boolean).map(n=>{ const p = poolGet(n); return p ? p.overall : 70; });
  while(ovs.length<5) ovs.push(66);
  return ovs.reduce((a,b)=>a+b,0)/ovs.length;
}
// Sorteia n times sem repetir, com mais chance pra quem tem elenco mais forte.
function ascensaoWeightedPick(orgs, snapshot, n){
  const items = orgs.slice(); const out = [];
  while(out.length<n && items.length){
    const ws = items.map(o=>Math.pow(1.35, ascensaoOrgStrength(o, snapshot)-75));
    const tot = ws.reduce((a,b)=>a+b,0);
    let r = Math.random()*tot, i = 0;
    for(; i<ws.length-1; i++){ r -= ws[i]; if(r<=0) break; }
    out.push(items.splice(i,1)[0]);
  }
  return out;
}
// Open Qualifier por sub-região: 8 times não parceiros (os da sub-região primeiro, completando com
// outros não parceiros do território) disputam as vagas que aquela sub-região dá nos 12 times.
function ascensaoQualifierField(regiao, sub, playerOrg, snapshot){
  const ch = TERRITORY_CHALLENGERS[regiao]||[];
  const inSub = ch.filter(o=>ORG_SUB[o]===sub), others = ch.filter(o=>ORG_SUB[o]!==sub);
  const n = Math.min(8, ch.length);
  let picked = (playerOrg && inSub.includes(playerOrg))
    ? [playerOrg, ...ascensaoWeightedPick(inSub.filter(o=>o!==playerOrg), snapshot, Math.min(7, inSub.length-1))]
    : ascensaoWeightedPick(inSub, snapshot, Math.min(8, inSub.length));
  if(picked.length<n) picked = [...picked, ...ascensaoWeightedPick(others, snapshot, n-picked.length)];
  return picked;
}
function ascensaoNeedsLiveQualifier(regiao){
  const c = state.carreira;
  if(!c.time || orgIsPartner(c.time)) return false;
  const ch = TERRITORY_CHALLENGERS[regiao]||[];
  return ch.length>=8 && ch.filter(o=>ORG_SUB[o]===ORG_SUB[c.time]).length>=2;
}
function ascensaoSimQualifier(teams){
  if(teams.length===8) return ascensaoRunBracketAI(shuffle(teams.slice()), BRACKET_DEF);
  const st = initRegionalStandings(teams);
  roundRobinSchedule(teams, true).forEach(rod=>rod.forEach(([a,b])=>{
    const res = decideMatchWinnerWithRounds(a, b, 2);
    registrarResultadoGrupoRegional(st, a, b, res, res.roundsA, res.roundsB);
  }));
  return rankRegionalGroup(st).map(s=>s.team);
}
// Ranking (só times da sub-região) do Open Qualifier dela. Simula se ainda não rolou.
function ascensaoSubRanking(key, regiao, sub, override){
  const c = state.carreira;
  if(!c.qualRank) c.qualRank = {};
  if(!c.qualRank[key]) c.qualRank[key] = {};
  if(!c.qualRank[key][regiao]) c.qualRank[key][regiao] = {};
  const rr = c.qualRank[key][regiao];
  if(override){ rr[sub] = override; return override; }
  if(!rr[sub]){
    const ch = TERRITORY_CHALLENGERS[regiao]||[];
    const inSub = ch.filter(o=>ORG_SUB[o]===sub);
    if(inSub.length<=1) rr[sub] = inSub.slice();
    else {
      const m = c.marketNow && c.marketNow[regiao];
      const own = regiao===c.regiao && c.time && !orgIsPartner(c.time);
      const orgs = ascensaoQualifierField(regiao, sub, own && ORG_SUB[c.time]===sub ? c.time : null, m ? m.transferencias : null);
      const teams = orgs.map(o=> m ? ascensaoTeamForOrg(o, regiao) : buildAscensaoOrgTeam(o, false));
      rr[sub] = ascensaoSimQualifier(teams).map(t=>t.name).filter(o=>ORG_SUB[o]===sub);
    }
  }
  return rr[sub];
}
// Formato: o campeão de cada sub-região garante uma vaga; os vices (completando 4 times com os
// próximos colocados) disputam as vagas que sobraram numa chave de última chance.
function ascensaoQualifierPlan(key, regiao){
  const ch = TERRITORY_CHALLENGERS[regiao]||[];
  const need = ASCENSAO_TERRITORY_SLOTS - TEAM_REGIONS[regiao].length;
  const subs = Object.keys(ASCENSAO_SUB_SLOTS[regiao]).filter(s=>ch.some(o=>ORG_SUB[o]===s));
  const ranks = subs.map(s=>ascensaoSubRanking(key, regiao, s));
  if(subs.length<=1) return {direct: (ranks[0]||[]).slice(0, need), contenders:[], lastSlots:0};
  const direct = ranks.map(r=>r[0]).filter(Boolean);
  const contenders = [];
  for(let place=1; contenders.length<4 && place<10; place++){
    ranks.forEach(r=>{ if(r[place] && contenders.length<4) contenders.push(r[place]); });
  }
  const lastSlots = Math.max(0, Math.min(need - direct.length, contenders.length));
  return {direct, contenders, lastSlots};
}
// As 4 vagas abertas de um território num evento (simula tudo da IA se ainda não rolou).
// lastResult: ordem final da chave de última chance quando o jogador jogou ao vivo.
function ascensaoQualifiersFor(key, regiao, lastResult){
  const c = state.carreira;
  if(!c.qualifiers) c.qualifiers = {};
  if(!c.qualifiers[key]) c.qualifiers[key] = {};
  if(lastResult || !c.qualifiers[key][regiao]){
    const m = c.marketNow && c.marketNow[regiao];
    const ch = TERRITORY_CHALLENGERS[regiao]||[];
    const need = ASCENSAO_TERRITORY_SLOTS - TEAM_REGIONS[regiao].length;
    const plan = ascensaoQualifierPlan(key, regiao);
    let res = plan.direct.slice();
    if(plan.lastSlots>0){
      let order = lastResult;
      if(!order){
        if(plan.contenders.length<=plan.lastSlots) order = plan.contenders;
        else {
          const teams = plan.contenders.map(o=> m ? ascensaoTeamForOrg(o, regiao) : buildAscensaoOrgTeam(o, false));
          order = teams.length===4 ? ascensaoRunBracketAI(shuffle(teams), FOUR_TEAM_BRACKET_DEF).map(t=>t.name) : ascensaoSimQualifier(teams).map(t=>t.name);
        }
      }
      res.push(...order.slice(0, plan.lastSlots));
    }
    if(res.length<need) res.push(...ascensaoWeightedPick(ch.filter(o=>!res.includes(o)), m ? m.transferencias : null, need-res.length));
    res = res.slice(0, need);
    const own = regiao===c.regiao && c.time && !orgIsPartner(c.time);
    // Pacific tem poucos não parceiros: o time do jogador entra direto no evento.
    if(own && ch.length<8 && !res.includes(c.time)) res = [...res.slice(0, res.length-1), c.time];
    c.qualifiers[key][regiao] = res;
  }
  return c.qualifiers[key][regiao];
}
function ascensaoTerritoryField(regiao, key){
  return [...TEAM_REGIONS[regiao], ...ascensaoQualifiersFor(key, regiao)];
}
function setupAscensaoQualifierStage(key){
  const c = state.carreira;
  state.difficulty = "ascensao";
  state.screen = "match";
  if(key==="kickoff") state.journey = [];
  state.journeyStageStart = state.journey.length;
  if(!state.campaignRecords || (key==="kickoff" && c.temporada===1)){
    state.campaignRecords = {singleMap:{kills:RECORDS.singleMap,holder:"aspas"}, md3:{kills:RECORDS.md3,holder:"aspas"}, md5:{kills:RECORDS.md5,holder:"marteen"}};
  }
  const playerOrgTeam = ascensaoBuildPlayerTeam();
  state.roster = playerOrgTeam.roster; state.teamName = c.time; state.headCoach = playerOrgTeam.coach; state.assistantCoach = playerOrgTeam.ac || null;
  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  const m = c.marketNow[c.regiao];
  c.qualifierSub = ORG_SUB[c.time];
  c.qualifierOrgs = ascensaoQualifierField(c.regiao, c.qualifierSub, c.time, m.transferencias);
  const others = c.qualifierOrgs.filter(o=>o!==c.time).map(o=>ascensaoTeamForOrg(o, c.regiao));
  state.tournament = {stage:"groups_skip", playerTeam:playerOrgTeam, ascensaoPhase:"qualifier", ascensaoStageKey:key};
  buildPlayoffBracketSeeded(shuffle([playerOrgTeam, ...others]), BRACKET_DEF);
  advanceTournament();
}
// Resultado do 1º qualifier ao vivo: "yes" (campeão da sub-região), "lc" (vai pra última chance) ou "no".
function ascensaoFinishQualifier(key, endInfo){
  const c = state.carreira;
  const teams = c.qualifierOrgs.map(o=> o===c.time ? ascensaoBuildPlayerTeam() : ascensaoTeamForOrg(o, c.regiao));
  const ranking = ascensaoSimQualifier(teams).map(t=>t.name).filter(n=>n!==c.time);
  ranking.splice(Math.min(ascensaoPlacementIndex(endInfo), ranking.length), 0, c.time);
  ascensaoSubRanking(key, c.regiao, c.qualifierSub, ranking.filter(o=>ORG_SUB[o]===c.qualifierSub));
  const plan = ascensaoQualifierPlan(key, c.regiao);
  if(plan.direct.includes(c.time)){ ascensaoQualifiersFor(key, c.regiao); return "yes"; }
  if(plan.lastSlots>0 && plan.contenders.length>plan.lastSlots && plan.contenders.includes(c.time)){
    c.qualifierLC = plan.contenders.slice();
    return "lc";
  }
  ascensaoQualifiersFor(key, c.regiao);
  return ascensaoQualifiersFor(key, c.regiao).includes(c.time) ? "yes" : "no";
}
// Chave de última chance (4 vices/próximos colocados disputam as vagas que sobraram).
function setupAscensaoQualifierLCStage(key){
  const c = state.carreira;
  state.difficulty = "ascensao";
  state.screen = "match";
  state.journeyStageStart = state.journey.length;
  const playerOrgTeam = ascensaoBuildPlayerTeam();
  state.roster = playerOrgTeam.roster; state.teamName = c.time; state.headCoach = playerOrgTeam.coach; state.assistantCoach = playerOrgTeam.ac || null;
  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  const others = c.qualifierLC.filter(o=>o!==c.time).map(o=>ascensaoTeamForOrg(o, c.regiao));
  state.tournament = {stage:"groups_skip", playerTeam:playerOrgTeam, ascensaoPhase:"qualifierLC", ascensaoStageKey:key};
  buildPlayoffBracketSeeded(shuffle([playerOrgTeam, ...others]), FOUR_TEAM_BRACKET_DEF);
  advanceTournament();
}
function ascensaoFinishQualifierLC(key, endInfo){
  const c = state.carreira;
  const plan = ascensaoQualifierPlan(key, c.regiao);
  const teams = c.qualifierLC.map(o=> o===c.time ? ascensaoBuildPlayerTeam() : ascensaoTeamForOrg(o, c.regiao));
  const order = ascensaoRunBracketAI(shuffle(teams), FOUR_TEAM_BRACKET_DEF).map(t=>t.name).filter(n=>n!==c.time);
  order.splice(Math.min(ascensaoPlacementIndex(endInfo), order.length), 0, c.time);
  return ascensaoQualifiersFor(key, c.regiao, order).includes(c.time);
}
