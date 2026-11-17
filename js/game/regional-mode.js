/* ==========================================================
   regional-mode.js — Modo Regional
   ========================================================== */

function setupRegionalTournament(){
  const regiao = state.regionalRegiao;
  const format = REGIONAL_FORMAT[regiao];
  const playerTeam = {id:"player", isPlayer:true, name:state.teamName, roster:state.roster, coach:state.headCoach, rating: teamOverall(state.roster)};
  const otherOrgs = TEAM_REGIONS[regiao].filter(t=>t!==state.teamName);
  // adversários também fazem "draft" — sorteia um elenco cobrindo as 5 funções a partir do
  // pool da região (igual ao Clássico/Selva), em vez de usar o elenco real fixo.
  const usedNames = new Set(state.roster.map(p=>p.name));
  const availablePlayers = shuffle(regionalPlayerObjects(regiao).filter(p=>!usedNames.has(p.name)));
  const aiTeams = otherOrgs.map((orgName,i)=>{
    const roster = buildAIRoster(availablePlayers);
    return {id:orgName, name:orgName, roster, rating:teamOverall(roster), coach: state.remainingCoaches[i] || null};
  });

  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  state.campaignRecords = {singleMap:{kills:RECORDS.singleMap,holder:"aspas"}, md3:{kills:RECORDS.md3,holder:"aspas"}, md5:{kills:RECORDS.md5,holder:"marteen"}};
  state.journey = [];

  if(format.groups===0){
    // APAC/CHN: só 4 times na região inteira — vai direto pro chaveamento, sem fase de grupos.
    const seeds = shuffle([playerTeam, ...aiTeams]);
    state.tournament = {stage:"groups_skip", playerTeam, regionalFormat:format};
    buildPlayoffBracketSeeded(seeds, FOUR_TEAM_BRACKET_DEF);
    advanceTournament();
    return;
  }

  const allTeams = shuffle([playerTeam, ...aiTeams]);
  const groupA = allTeams.slice(0, format.groupSize);
  const groupB = allTeams.slice(format.groupSize, format.groupSize*2);
  const myGroupLetter = groupA.some(tm=>tm.isPlayer) ? "A" : "B";
  const myGroup = myGroupLetter==="A" ? groupA : groupB;
  const otherGroup = myGroupLetter==="A" ? groupB : groupA;

  state.tournament = {
    stage: "regionalGroups",
    playerTeam,
    regionalFormat: format,
    myGroupLetter,
    regionalGroups: {
      myGroup: { teams: myGroup, schedule: roundRobinSchedule(myGroup), roundIdx:0, matchIdxInRound:0, standings: initRegionalStandings(myGroup), pending:null, totalRounds: roundRobinSchedule(myGroup).length },
      otherGroup: { teams: otherGroup },
    },
    bracket: null,
  };
  advanceRegionalGroups();
}

// Processa a tabela de turno e returno do grupo do jogador — resolve na hora os confrontos
// que não envolvem ele, e pausa pra jogar quando chega a vez dele.
function advanceRegionalGroups(){
  const tr = state.tournament;
  if(tr.stage!=="regionalGroups") return;
  const g = tr.regionalGroups.myGroup;
  g.pending = null;
  while(g.roundIdx < g.schedule.length){
    const rodada = g.schedule[g.roundIdx];
    while(g.matchIdxInRound < rodada.length){
      const [teamA, teamB] = rodada[g.matchIdxInRound];
      if(teamA.isPlayer || teamB.isPlayer){
        g.pending = {teamA, teamB, roundIdx:g.roundIdx};
        startMatch(2); // fase de grupos regional é sempre MD3
        return;
      }
      const resultado = decideMatchWinnerWithRounds(teamA, teamB, 2);
      registrarResultadoGrupoRegional(g.standings, teamA, teamB, resultado, resultado.roundsA, resultado.roundsB);
      g.matchIdxInRound++;
    }
    g.roundIdx++;
    g.matchIdxInRound = 0;
  }
  finishRegionalGroupsAndAdvance();
}

// Fecha a fase de grupos: resolve o outro grupo inteiro (só IA), calcula a classificação dos
// dois grupos por pontos, e para na tela de tabela — os playoffs só começam quando o
// jogador confirmar (botão "Continuar").
function finishRegionalGroupsAndAdvance(){
  const tr = state.tournament;
  const myG = tr.regionalGroups.myGroup;
  const otherG = tr.regionalGroups.otherGroup;

  const otherStandings = initRegionalStandings(otherG.teams);
  roundRobinSchedule(otherG.teams, tr.regionalFormat.single).forEach(rodada=>{
    rodada.forEach(([teamA, teamB])=>{
      const resultado = decideMatchWinnerWithRounds(teamA, teamB, 2);
      registrarResultadoGrupoRegional(otherStandings, teamA, teamB, resultado, resultado.roundsA, resultado.roundsB);
    });
  });

  const myRanked = rankRegionalGroup(myG.standings);
  const otherRanked = rankRegionalGroup(otherStandings);
  tr.regionalGroups.myGroup.finalRanking = myRanked;
  tr.regionalGroups.otherGroup.finalRanking = otherRanked;
  tr.stage = "regionalStandings";
}

// Chamado quando o jogador clica em "Continuar" na tela de classificação — só agora de fato
// monta os playoffs (ou encerra a campanha, se o jogador não se classificou).
function confirmRegionalStandings(){
  const tr = state.tournament;
  const myRanked = tr.regionalGroups.myGroup.finalRanking;
  const otherRanked = tr.regionalGroups.otherGroup.finalRanking;
  const n = tr.regionalFormat.qualifiersPerGroup;
  const myQualifiers = myRanked.slice(0,n).map(s=>s.team);
  const otherQualifiers = otherRanked.slice(0,n).map(s=>s.team);

  if(!myQualifiers.some(tm=>tm.isPlayer)){
    ascensaoOrFinalize({type:"groups"});
    return;
  }

  // seed cruzado: 1º de cada grupo, depois 2º de cada grupo, depois 3º de cada grupo...
  const seeds = [];
  for(let i=0;i<n;i++){
    seeds.push(myQualifiers[i]);
    if(otherQualifiers[i]) seeds.push(otherQualifiers[i]);
  }
  const bracketDef = tr.regionalFormat.playoffSize===8 ? BRACKET_DEF : tr.regionalFormat.playoffSize===6 ? SIX_TEAM_BRACKET_DEF : FOUR_TEAM_BRACKET_DEF;
  buildPlayoffBracketSeeded(seeds, bracketDef);
  advanceTournament();
}
