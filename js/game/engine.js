/* ==========================================================
   engine.js — Motor de partidas e montagem de torneios
   ========================================================== */

/* ---------------- TOURNAMENT LOGIC ---------------- */
function decideWinner(teamA, teamB){
  const compA = compositionBonus(teamA.roster, false);
  const compB = compositionBonus(teamB.roster, false);
  const buffA = coachBuff(teamA.coach) + assistantBuff(teamA.roster, teamA.ac) + (compA.attack+compA.defense)/2 + chemistryBonus(teamA.roster, teamA.coach);
  const buffB = coachBuff(teamB.coach) + assistantBuff(teamB.roster, teamB.ac) + (compB.attack+compB.defense)/2 + chemistryBonus(teamB.roster, teamB.coach);
  const ratingA = teamA.rating + buffA*BUFF_DAMPING;
  const ratingB = teamB.rating + buffB*BUFF_DAMPING;
  const diff = ratingA - ratingB;
  const prob = Math.min(0.94, Math.max(0.06, 0.5 + diff/130));
  return Math.random() < prob ? teamA : teamB;
}

// Decide uma partida em melhor-de-N mapas (mapsToWin=2 → MD3, mapsToWin=3 → MD5).
// Registra o resultado de QUALQUER partida da temporada (não só as que o jogador jogou) —
// usado no Rumo à Ascensão pra saber o retrospecto real de cada time na temporada inteira.
function ascensaoTrackResult(winner, loser){
  if(state.difficulty!=="ascensao" || !state.carreira) return;
  if(!state.carreira.seasonResults) state.carreira.seasonResults = {};
  const sr = state.carreira.seasonResults;
  [[winner,"wins"],[loser,"losses"]].forEach(([team,campo])=>{
    if(!team || !team.name || team.isPlayer || team.isCharacter) return;
    if(!sr[team.name]) sr[team.name] = {wins:0, losses:0};
    sr[team.name][campo]++;
  });
}
function decideMatchWinner(teamA, teamB, mapsToWin){
  let wa=0, wb=0;
  while(wa<mapsToWin && wb<mapsToWin){
    if(decideWinner(teamA,teamB)===teamA) wa++; else wb++;
  }
  const result = wa>wb ? {winner:teamA, loser:teamB, scoreWinner:wa, scoreLoser:wb} : {winner:teamB, loser:teamA, scoreWinner:wb, scoreLoser:wa};
  ascensaoTrackResult(result.winner, result.loser);
  return result;
}
function matchFormatFor(labelKey){
  return (labelKey==="lbFinal" || labelKey==="grandFinal") ? 3 : 2;
}

// Gera um placar de rounds plausível pra um mapa decidido por simulação (sem jogar round a
// round de verdade) — quem venceu sempre fecha em 13, quem perdeu fica entre 0 e 10 (sem OT,
// pra manter simples). Usado só pra ter dado de "rounds" nos jogos que a IA decide sozinha.
function simulateMapRoundScore(aWon){
  const loserRounds = Math.floor(Math.random()*11); // 0 a 10
  return aWon ? {a:13, b:loserRounds} : {a:loserRounds, b:13};
}
// Igual ao decideMatchWinner, mas também soma o placar de rounds de cada mapa da série —
// usado na fase de grupos do modo Regional pra critério de desempate.
function decideMatchWinnerWithRounds(teamA, teamB, mapsToWin){
  let wa=0, wb=0, roundsA=0, roundsB=0;
  while(wa<mapsToWin && wb<mapsToWin){
    const aWon = decideWinner(teamA,teamB)===teamA;
    if(aWon) wa++; else wb++;
    const placar = simulateMapRoundScore(aWon);
    roundsA += placar.a; roundsB += placar.b;
  }
  const result = wa>wb ? {winner:teamA, loser:teamB, scoreWinner:wa, scoreLoser:wb} : {winner:teamB, loser:teamA, scoreWinner:wb, scoreLoser:wa};
  ascensaoTrackResult(result.winner, result.loser);
  return {...result, roundsA, roundsB};
}

// Converte a lista de nomes de uma Seleção em objetos de jogador de verdade (do POOL).
// Mapa reverso: nome do craque (minusculo) -> chave da Seleção dele. Usado pra saber, só olhando
// o elenco, se estamos no Modo Copa do Mundo e se a Seleção é "mista" (combinada de vários países).
const PLAYER_TO_SELECAO_KEY = {};
Object.entries(WC_SELECOES).forEach(([key, data])=>{
  data.players.forEach(n=>{ PLAYER_TO_SELECAO_KEY[n.toLowerCase()] = key; });
});
// Dado um elenco, acha a Seleção dele (se for um time de Copa do Mundo) — null se não for.
function rosterSelecaoKey(roster){
  if(!roster || !roster.length) return null;
  const p = roster.find(Boolean);
  if(!p) return null;
  return PLAYER_TO_SELECAO_KEY[p.name.toLowerCase()] || null;
}

// Seleções que têm craque de sobra (10+ opções) só liberam quem tem overall 87+ pra defender
// o país — assim o elenco fica mais competitivo, sem esvaziar Seleções menores que precisam
// de todo mundo disponível pra fechar um time completo.
const WC_SELECAO_OVERALL_RESTRICTED = new Set(["United States","South Korea","Brazil","Canada"]);
function selecaoPlayerObjects(selecaoName){
  const names = new Set(WC_SELECOES[selecaoName].players.map(n=>n.toLowerCase()));
  let jogadores = POOL.filter(p=>names.has(p.name.toLowerCase()));
  if(WC_SELECAO_OVERALL_RESTRICTED.has(selecaoName)) jogadores = jogadores.filter(p=>p.overall>=87);
  return jogadores;
}

// Modo Regional: descobre a região de um craque pelo TIME REAL dele no Rumo à Ascensão
// (não pela nacionalidade) — usado pra restringir o draft do modo Regional.
function playerRegionKey(playerName){
  const nameLower = playerName.toLowerCase();
  for(const [time, dados] of Object.entries(ASCENSAO_TEAM_ROSTERS)){
    if(dados.players.some(p=>p && p.toLowerCase()===nameLower)){
      if(ORG_TERRITORY[time]) return ORG_TERRITORY[time];
    }
  }
  return null;
}
// Região de um craque (pra fins de mercado/agente livre) — prioriza país de RESIDÊNCIA sobre
// nacionalidade quando os dois existem, já que quem mora em outro país tende a competir por lá.
function freeAgentRegion(nomeMinusculo){
  const residencia = PLAYER_RESIDENCE[nomeMinusculo];
  if(typeof residencia==="string" && COUNTRY_TO_REGION[residencia]) return COUNTRY_TO_REGION[residencia];
  return COUNTRY_TO_REGION[PLAYER_COUNTRY[nomeMinusculo]];
}
function regionalPlayerObjects(regiao){
  return POOL.filter(p=>{
    const regiaoDoTime = playerRegionKey(p.name);
    if(regiaoDoTime){
      if(regiaoDoTime===regiao) return true;
      // BR e LAS são vizinhos: um craque de nacionalidade BR jogando num time do LAS (ou
      // vice-versa) também pode ser sorteado no draft da região da sua própria nacionalidade.
      if((regiao==="BR" && regiaoDoTime==="LAS") || (regiao==="LAS" && regiaoDoTime==="BR")){
        const pais = PLAYER_COUNTRY[p.name.toLowerCase()];
        if(COUNTRY_TO_REGION[pais]===regiao) return true;
      }
      return false;
    }
    // sem time nenhum (ex: saiu de um elenco e não foi realocado) — conta pela nacionalidade,
    // senão a região perde opções toda vez que alguém tira um craque de um time sem repor.
    if(ASCENSAO_EXCLUDED_PLAYERS.has(p.name.toLowerCase())) return false;
    return freeAgentRegion(p.name.toLowerCase()) === regiao;
  });
}
// Mesma lógica, mas pros técnicos: só entram no sorteio do modo Regional os HC cujo time
// de verdade (no Rumo à Ascensão) está naquela região.
function coachRegionKey(coachName){
  const nameLower = coachName.toLowerCase();
  for(const [time, dados] of Object.entries(ASCENSAO_TEAM_ROSTERS)){
    if(dados.coach && dados.coach.toLowerCase()===nameLower){
      if(ORG_TERRITORY[time]) return ORG_TERRITORY[time];
    }
  }
  return null;
}
function regionalCoachObjects(regiao){
  return COACHES.filter(c=>coachRegionKey(c)===regiao);
}

// Monta um elenco de IA cobrindo as 5 funções de verdade — tira jogadores do pool compartilhado
// (mutando o array recebido), preferindo sempre alguém que jogue aquela função.
// Casamento bipartido (algoritmo de Kuhn) — usado só no Modo Copa do Mundo, onde os elencos das
// Seleções são pequenos e um sorteio ingênuo pode travar (alguém que só serve pra 1 vaga já foi
// escalado em outra). Garante que sempre existe uma forma válida de fechar as 5 vagas.
function canCompleteRoster(openRoles, availablePlayers){
  const matchRole = {};
  function tryAssign(roleKey, visited){
    for(const p of availablePlayers){
      if(!p.roles.includes(roleKey) || visited.has(p.name)) continue;
      visited.add(p.name);
      if(!matchRole[p.name] || tryAssign(matchRole[p.name], visited)){
        matchRole[p.name] = roleKey;
        return true;
      }
    }
    return false;
  }
  return openRoles.every(r=>tryAssign(r, new Set()));
}
// Monta um elenco válido garantido (usa casamento bipartido) — para Seleções pequenas da Copa,
// em vez do preenchimento guloso simples usado no modo normal.
function buildValidRoster(players){
  const roster = [null,null,null,null,null];
  const matchRole = {}; // nome do jogador -> indice de slot que ele ocupa
  function tryAssign(slotIdx, visited){
    for(const p of players){
      if(!p.roles.includes(SLOT_ORDER[slotIdx]) || visited.has(p.name)) continue;
      visited.add(p.name);
      if(!(p.name in matchRole) || tryAssign(matchRole[p.name], visited)){
        matchRole[p.name] = slotIdx;
        return true;
      }
    }
    return false;
  }
  SLOT_ORDER.forEach((rk,i)=>tryAssign(i, new Set()));
  Object.entries(matchRole).forEach(([name, slotIdx])=>{
    roster[slotIdx] = players.find(p=>p.name===name);
  });
  return roster;
}
// Pontua um craque considerando não só o overall dele, mas a sinergia com o resto do grupo de
// candidatos — craques que jogaram no mesmo time de verdade juntos, ou que têm país em comum
// (incluindo país de residência), pontuam mais alto, já que tendem a fechar um time mais coeso.
function scoreComSinergia(jogador, pool){
  let pontos = jogador.overall;
  const timesDoJogador = PLAYER_TEAM[jogador.name.toLowerCase()] || [];
  const paisesDoJogador = playerCountries(jogador.name);
  pool.forEach(outro=>{
    if(outro.name===jogador.name) return;
    const timesDoOutro = PLAYER_TEAM[outro.name.toLowerCase()] || [];
    if(timesDoJogador.some(t=>timesDoOutro.includes(t))) pontos += 0.75;
    const paisesDoOutro = playerCountries(outro.name);
    if(paisesDoJogador.some(p=>paisesDoOutro.includes(p))) pontos += 0.3;
  });
  return pontos;
}
// Igual buildValidRoster, mas ordena os craques por overall + sinergia antes de montar — assim
// o casamento de funções sempre prioriza o craque mais forte E mais encaixado no grupo
// disponível pra cada posição, montando o melhor time possível em vez de qualquer combinação
// válida.
function buildBestRoster(players){
  const pontuados = players.map(p=>({p, score: scoreComSinergia(p, players)}));
  pontuados.sort((a,b)=>b.score-a.score);
  return buildValidRoster(pontuados.map(x=>x.p));
}

function buildAIRoster(sharedPool){
  // Ordena por overall + sinergia antes de casar as funções — assim o time da IA sempre monta
  // a MELHOR combinação possível com quem sobrou no pool, não só a primeira que encaixar.
  const ordenados = [...sharedPool].sort((a,b)=>scoreComSinergia(b,sharedPool)-scoreComSinergia(a,sharedPool));
  const roster = buildValidRoster(ordenados);
  if(roster.every(Boolean)){
    roster.forEach(p=>{
      const idx = sharedPool.findIndex(x=>x.name===p.name);
      if(idx!==-1) sharedPool.splice(idx,1);
    });
    return roster;
  }
  // sobra insuficiente pra fechar as 5 funções — fallback pro método antigo (pega o que der)
  const fallback = [];
  SLOT_ORDER.forEach(roleKey=>{
    const idx = sharedPool.findIndex(p=>p.roles.includes(roleKey));
    if(idx!==-1) fallback.push(sharedPool.splice(idx,1)[0]);
  });
  while(fallback.length<5 && sharedPool.length){ fallback.push(sharedPool.pop()); }
  return fallback;
}

// Topologia do "mini-chaveamento suíço" de cada grupo (4 times: você + 3 da IA).
// m1/m2 = rodada 1; m3 = Upper (quem vence está classificado, 2-0); m4 = Lower (quem perde é
// eliminado, 0-2); m5 = decisão entre os dois times 1-1 — vencedor classifica, perdedor cai.
const GROUP_BRACKET_DEF = [
  {id:"m1", aFrom:{seed:0}, bFrom:{seed:1}, labelKey:"groupR1"},
  {id:"m2", aFrom:{seed:2}, bFrom:{seed:3}, labelKey:"groupR1"},
  {id:"m3", aFrom:{m:"m1",res:"w"}, bFrom:{m:"m2",res:"w"}, labelKey:"groupUpper"},
  {id:"m4", aFrom:{m:"m1",res:"l"}, bFrom:{m:"m2",res:"l"}, labelKey:"groupLower"},
  {id:"m5", aFrom:{m:"m3",res:"l"}, bFrom:{m:"m4",res:"w"}, labelKey:"groupDecider"},
];
const GROUP_QUALIFY_IDS = ["m3","m5"]; // vencer aqui classifica
const GROUP_ELIM_IDS = ["m4","m5"];    // perder aqui elimina (2ª derrota)

// Resolve o mini-chaveamento de um grupo 100% controlado pela IA (grupos B/C/D).
function buildGroupQualifiersAI(teams){
  const brk = { seeds: teams, matches: {} };
  GROUP_BRACKET_DEF.forEach(def=>{ brk.matches[def.id] = {winner:null, loser:null}; });
  GROUP_BRACKET_DEF.forEach(def=>{
    const teamA = resolveBracketTeam(def.aFrom, brk);
    const teamB = resolveBracketTeam(def.bFrom, brk);
    brk.matches[def.id] = decideMatchWinner(teamA, teamB, 2);
  });
  return [
    {...brk.matches.m3.winner, isGroupWinner:true},
    {...brk.matches.m5.winner, isGroupWinner:false},
  ];
}

// Brasil e Estados Unidos entram direto nos playoffs, sem passar pela fase de grupos — as
// outras 12 Seleções disputam 3 grupos de 4, e os 2 primeiros de cada grupo (6 no total) se
// juntam aos 2 times de bye pra fechar os 8 dos playoffs.
const WC_SELECAO_BYE_TEAMS = ["Brazil","United States"];
function setupCopaTournament(){
  const rolesNeeded = ["duelist","flex","initiator","controller","sentinel"];
  const outrasSelecoes = Object.keys(WC_SELECOES).filter(n=>n!==state.selecao && canCompleteRoster(rolesNeeded, selecaoPlayerObjects(n)));
  const montaTime = (name,i)=>{
    const roster = buildValidRoster(shuffle(selecaoPlayerObjects(name)));
    return {id:"t"+i, name, roster, rating: teamOverall(roster), coach: bestSelecaoCoach(name)};
  };
  const outrosComBye = outrasSelecoes.filter(n=>WC_SELECAO_BYE_TEAMS.includes(n)).map(montaTime);
  const outrosDeGrupo = shuffle(outrasSelecoes.filter(n=>!WC_SELECAO_BYE_TEAMS.includes(n))).map(montaTime);

  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  state.campaignRecords = {singleMap:{kills:RECORDS.singleMap,holder:"aspas"}, md3:{kills:RECORDS.md3,holder:"aspas"}, md5:{kills:RECORDS.md5,holder:"marteen"}};
  state.journey = [];

  const playerTeam = {id:"player", isPlayer:true, name:state.selecao, roster:state.roster, coach:state.headCoach, rating: teamOverall(state.roster)};

  if(WC_SELECAO_BYE_TEAMS.includes(state.selecao)){
    // o próprio jogador escolheu Brasil ou Estados Unidos — já tem bye, vai direto pros playoffs
    const grupoA = outrosDeGrupo.slice(0,4), grupoB = outrosDeGrupo.slice(4,8), grupoC = outrosDeGrupo.slice(8,12);
    const qualA = buildGroupQualifiersAI(grupoA), qualB = buildGroupQualifiersAI(grupoB), qualC = buildGroupQualifiersAI(grupoC);
    const seeds = shuffle([playerTeam, ...outrosComBye, ...qualA, ...qualB, ...qualC]);
    state.tournament = {stage:"groups_skip", playerTeam};
    buildPlayoffBracketSeeded(seeds, BRACKET_DEF);
    advanceTournament();
    return;
  }

  // o jogador está numa das 12 Seleções normais — cai num dos 3 grupos (o dele fica "ao vivo",
  // os outros dois são resolvidos na hora).
  const todosDeGrupo = shuffle([playerTeam, ...outrosDeGrupo]);
  const grupoA = todosDeGrupo.slice(0,4), grupoB = todosDeGrupo.slice(4,8), grupoC = todosDeGrupo.slice(8,12);
  const meuGrupo = grupoA.some(t=>t.isPlayer) ? grupoA : (grupoB.some(t=>t.isPlayer) ? grupoB : grupoC);
  const otherGroupsTop2 = {};
  if(meuGrupo!==grupoA) otherGroupsTop2.A = buildGroupQualifiersAI(grupoA);
  if(meuGrupo!==grupoB) otherGroupsTop2.B = buildGroupQualifiersAI(grupoB);
  if(meuGrupo!==grupoC) otherGroupsTop2.C = buildGroupQualifiersAI(grupoC);

  const groupBracket = { seeds: meuGrupo, matches: {}, pointerIdx: 0, pending: null };
  GROUP_BRACKET_DEF.forEach(def=>{ groupBracket.matches[def.id] = {winner:null, loser:null}; });

  state.tournament = {
    stage:"groups",
    playerTeam,
    groupATeams: meuGrupo,
    groupBracket,
    otherGroupsTop2,
    byeTeams: outrosComBye,
    bracket: null,
  };
  advanceGroupBracket();
}
function setupTournament(){
  if(state.difficulty==="regional"){ setupRegionalTournament(); return; }
  if(state.difficulty==="copa"){ setupCopaTournament(); return; }
  const playerTeam = {id:"player", isPlayer:true, rating: teamOverall(state.roster)};
  const pool = shuffle(
    TEAM_NAMES.filter(tm=>tm.name!==state.teamName).map((tm,i)=>({id:"t"+i, name:tm.name, rating:tm.rating}))
  );
  const groupATeams = [playerTeam, pool[0], pool[1], pool[2]];
  const rest = pool.slice(3);
  const groupB = rest.slice(0,4), groupC = rest.slice(4,8), groupD = rest.slice(8,12);
  const aiTeams = [...groupATeams.slice(1), ...groupB, ...groupC, ...groupD];

  // monta um elenco de 5 jogadores para cada equipe adversária — cobrindo as 5 funções
  // de verdade (igual um draft), em vez de um recorte aleatório do pool.
  const usedNames = new Set(state.roster.map(p=>p.name));
  const availablePlayers = shuffle(POOL.filter(p=>!usedNames.has(p.name)));
  aiTeams.forEach((tm,i)=>{
    tm.roster = buildAIRoster(availablePlayers);
    tm.coach = state.remainingCoaches[i] || null;
  });

  const otherGroupsTop2 = {};
  [["B",groupB],["C",groupC],["D",groupD]].forEach(([letter, teams])=>{
    otherGroupsTop2[letter] = buildGroupQualifiersAI(teams);
  });

  const groupBracket = { seeds: groupATeams, matches: {}, pointerIdx: 0, pending: null };
  GROUP_BRACKET_DEF.forEach(def=>{ groupBracket.matches[def.id] = {winner:null, loser:null}; });

  state.tournament = {
    stage:"groups",
    playerTeam,
    groupATeams,
    groupBracket,
    otherGroupsTop2,
    bracket: null,
  };
  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  state.campaignRecords = {singleMap:{kills:RECORDS.singleMap,holder:"aspas"}, md3:{kills:RECORDS.md3,holder:"aspas"}, md5:{kills:RECORDS.md5,holder:"marteen"}};
  state.journey = [];
  advanceGroupBracket();
}
