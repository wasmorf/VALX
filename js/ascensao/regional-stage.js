/* ==========================================================
   regional-stage.js — Etapas de território do Ascensão (Kickoff e Cups)
   ========================================================== */

// Monta e começa a fase Regional AO VIVO do Rumo à Ascensão — o jogador joga cada partida.
function setupAscensaoRegionalStage(precomputado, stageKey){
  stageKey = stageKey || "kickoff";
  const c = state.carreira;
  const regiao = c.regiao;
  const format = ASCENSAO_TERRITORY_FORMAT;
  state.difficulty = "ascensao";
  let transferencias, transferenciasCoach;
  if(precomputado){
    transferencias = precomputado.transferencias;
    transferenciasCoach = precomputado.transferenciasCoach;
  } else {
    // simula o mercado da região inteira ANTES, incluindo o time do próprio jogador — craques
    // bons recebem ofertas de fora mesmo em time campeão, então ninguém fica de fora do mercado.
    transferencias = simulateRegionalTransfers(regiao, null);
    transferenciasCoach = simulateRegionalCoachTransfers(regiao, null, transferencias);
    // salva o resultado dessa temporada no snapshot da carreira — a próxima temporada continua
    // dessas escalações, em vez de recalcular sempre a partir do banco original do zero.
    territoryAllOrgs(regiao).forEach(org=>{
      if(transferencias[org]) c.orgRostersSnapshot[org] = {...c.orgRostersSnapshot[org], players: transferencias[org], coach: transferenciasCoach[org] || c.orgRostersSnapshot[org].coach};
    });
    ascensaoDedupeSnapshot(c.orgRostersSnapshot, territoryAllOrgs(regiao));
    ascensaoInitSeason();
    ascensaoRunSeasonMarket(transferencias, transferenciasCoach);
    // Antes de fechar o time, verifica se essa contratação nova deixaria melhor jogar em outra
    // das funções escolhidas — se sim, pergunta antes de continuar, em vez de trocar sozinho.
    const realPlayersDoMeuTime = (transferencias[c.time]||[]).map(n=>poolGet(n)).filter(Boolean);
    const oportunidade = ascensaoCheckRoleSwitchOpportunity(realPlayersDoMeuTime);
    if(oportunidade){
      c.pendingRoleSwitchData = {transferencias, transferenciasCoach, novaFuncao: oportunidade.funcao};
      state.screen = "ascensaoRoleSwitch";
      return;
    }
  }
  const playerOrgTeam = buildAscensaoOrgTeam(c.time, true, transferencias[c.time], transferenciasCoach[c.time]);
  playerOrgTeam.isPlayer = true;
  state.roster = playerOrgTeam.roster;
  state.teamName = c.time;
  state.headCoach = playerOrgTeam.coach;
  state.assistantCoach = playerOrgTeam.ac || null;
  if(ascensaoNeedsLiveQualifier(regiao) && !(c.qualifiers && c.qualifiers[stageKey] && c.qualifiers[stageKey][regiao])){
    return setupAscensaoQualifierStage(stageKey);
  }
  const field = ascensaoTerritoryField(regiao, stageKey);
  c.lastField = field;
  const otherOrgs = field.filter(t=>t!==c.time);
  const aiTeams = otherOrgs.map(org=>buildAscensaoOrgTeam(org, false, transferencias[org], transferenciasCoach[org]));

  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  // os recordes só voltam ao valor real na temporada 1 (carreira nova) — depois disso, ficam
  // valendo o que foi quebrado durante a campanha, até o fim das 16 temporadas.
  if((stageKey==='kickoff' && c.temporada===1) || !state.campaignRecords){
    state.campaignRecords = {singleMap:{kills:RECORDS.singleMap,holder:"aspas"}, md3:{kills:RECORDS.md3,holder:"aspas"}, md5:{kills:RECORDS.md5,holder:"marteen"}};
  }
  if(stageKey==='kickoff'){ state.journey = []; state.journeyStageStart = 0; } else { state.journeyStageStart = state.journey.length; }
  state.screen = "match";

  const allTeams = shuffle([playerOrgTeam, ...aiTeams]);
  const groupA = allTeams.slice(0, format.groupSize);
  const groupB = allTeams.slice(format.groupSize, format.groupSize*2);
  const myGroupLetter = groupA.some(tm=>tm.isPlayer) ? "A" : "B";
  const myGroup = myGroupLetter==="A" ? groupA : groupB;
  const otherGroup = myGroupLetter==="A" ? groupB : groupA;

  state.tournament = {
    stage: "regionalGroups",
    playerTeam: playerOrgTeam,
    regionalFormat: format,
    myGroupLetter,
    ascensaoPhase: "regional",
    ascensaoStageKey: stageKey,
    ascensaoRegionalTransferSnapshot: transferencias,
    ascensaoRegionalCoachSnapshot: transferenciasCoach,
    regionalGroups: {
      myGroup: { teams: myGroup, schedule: roundRobinSchedule(myGroup, format.single), roundIdx:0, matchIdxInRound:0, standings: initRegionalStandings(myGroup), pending:null },
      otherGroup: { teams: otherGroup },
    },
    bracket: null,
  };
  advanceRegionalGroups();
}
