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
  const names = new Set(encNationData(selecaoName).players.map(n=>n.toLowerCase()));
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
  // Pontua cada jogador UMA vez (e com times/países em cache) — com o pool grande, recalcular
  // dentro do comparador do sort levava ~45s pra montar os 15 elencos da IA.
  const info = sharedPool.map(p=>({p, t:PLAYER_TEAM[p.name.toLowerCase()]||[], c:playerCountries(p.name)}));
  info.forEach(a=>{
    let pts = a.p.overall;
    info.forEach(b=>{
      if(b===a) return;
      if(a.t.length && b.t.length && a.t.some(t=>b.t.includes(t))) pts += 0.75;
      if(a.c.length && b.c.length && a.c.some(c=>b.c.includes(c))) pts += 0.3;
    });
    a.pts = pts;
  });
  const ordenados = info.sort((a,b)=>b.pts-a.pts).map(a=>a.p);
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

// Esports Nations Cup: 32 seleções — 17 convidadas (já nos grupos) + 15 classificadas dos
// qualificatórios regionais —, 8 grupos de 4 (estilo GSL) e playoffs de 16 em dupla eliminação.
const WC_SELECAO_BYE_TEAMS = [];  // sem byes: todas as convidadas começam na fase de grupos
const ENC_GROUP_LETTERS = ["A","B","C","D","E","F","G","H"];
const ENC_ROLES_NEEDED = ["duelist","flex","initiator","controller","sentinel"];
// Nome da região de qualificatório (NA, SA, SSA, MENA, EU, SEA, AS) no idioma atual.
function encRegionLabel(r){
  return ({NA:L3("América do Norte","North America","América del Norte"), SA:L3("América do Sul","South America","América del Sur"), SSA:L3("África","Africa","África"), MENA:L3("Oriente Médio e Norte da África","Middle East & North Africa","Medio Oriente y Norte de África"), EU:L3("Europa","Europe","Europa"), SEA:L3("Sudeste Asiático e Oceania","Southeast Asia & Oceania","Sudeste Asiático y Oceanía"), AS:L3("Ásia","Asia","Asia")})[r] || r;
}
// Prefixo "Qualificatório · <Região> · " quando o jogador está na chave do qualificatório da ENC.
function encQualifierPrefix(){
  const tr = state.tournament;
  if(!tr || tr.ascensaoPhase!=="encQualifier" || !tr.encCtx) return "";
  return L3("Qualificatório","Qualifier","Clasificatorio") + " " + encRegionLabel(tr.encCtx.region) + " · ";
}
// Monta o time de uma seleção qualquer (convidada ou de qualificatório).
function encBuildNationTeam(name, id){
  const roster = buildValidRoster(shuffle(selecaoPlayerObjects(name)));
  return {id, name, roster, rating: teamOverall(roster), coach: bestSelecaoCoach(name)};
}
// Região de qualificatório (NA, SA, SSA, MENA, EU, SEA, AS) de uma seleção não convidada — ou null.
function encNationRegion(name){
  return Object.keys(ENC_QUALIFIER_NATIONS).find(r=>ENC_QUALIFIER_NATIONS[r][name]) || null;
}
// Simula os qualificatórios regionais (todos contra todos entre as seleções da região) e devolve
// as classificadas. Se o jogador representa uma seleção não convidada (playerTeam), o time dele
// disputa o qualificatório da própria região: se ficar nas vagas, entra no lugar de uma IA.
// Retorna {qualified: nomes das seleções IA classificadas, playerQualified: true/false/null}.
function encSimulateQualifiers(playerNation, playerTeam, skipRegion){
  const qualified = [];
  let playerQualified = null;
  Object.entries(ENC_QUALIFIER_SLOTS).forEach(([region, slots])=>{
    if(region===skipRegion) return;
    const nomes = Object.keys(ENC_QUALIFIER_NATIONS[region]).filter(n=>n!==playerNation && canCompleteRoster(ENC_ROLES_NEEDED, selecaoPlayerObjects(n)));
    const times = nomes.map((n,i)=>encBuildNationTeam(n, "q"+region+i));
    const meuTime = (playerTeam && encNationRegion(playerNation)===region);
    if(meuTime) times.push(playerTeam);
    const ordem = ascensaoSimQualifier(times).slice(0, slots);
    if(meuTime) playerQualified = ordem.some(t=>t.isPlayer);
    qualified.push(...ordem.filter(t=>!t.isPlayer).map(t=>t.name));
  });
  return {qualified, playerQualified};
}
// Seleções adversárias: convidadas (menos a do jogador) + as classificadas dos qualificatórios.
// Se o jogador está numa seleção não convidada e NÃO se classifica, playerQualified vem false.
function encOpponentNations(myNation, playerTeam){
  const convidadas = Object.keys(WC_SELECOES).filter(n=>n!==myNation && canCompleteRoster(ENC_ROLES_NEEDED, selecaoPlayerObjects(n)));
  const q = encSimulateQualifiers(myNation, playerTeam);
  return {opponents:[...convidadas, ...q.qualified], playerQualified: q.playerQualified};
}
// Divide as 32 seleções em 8 grupos; o do jogador fica "ao vivo", os outros 7 são resolvidos na hora.
function encSetupGroups(playerTeam, outrosDeGrupo){
  const todos = shuffle([playerTeam, ...outrosDeGrupo]);
  const grupos = ENC_GROUP_LETTERS.map((_,i)=>todos.slice(i*4, i*4+4));
  const meuGrupo = grupos.find(g=>g.some(t=>t.isPlayer));
  const letra = ENC_GROUP_LETTERS[grupos.indexOf(meuGrupo)];
  const otherGroupsTop2 = {};
  ENC_GROUP_LETTERS.forEach((letra,i)=>{ if(grupos[i]!==meuGrupo) otherGroupsTop2[letra] = buildGroupQualifiersAI(grupos[i]); });
  return {meuGrupo, otherGroupsTop2, letra};
}
// Fecha a montagem da Copa solo: 8 grupos com as 31 adversárias já definidas.
function encStartCopaGroups(playerTeam, opponentNames){
  const outrosDeGrupo = shuffle(opponentNames).map((name,i)=>encBuildNationTeam(name, "t"+i));
  const {meuGrupo, otherGroupsTop2, letra} = encSetupGroups(playerTeam, outrosDeGrupo);

  const groupBracket = { seeds: meuGrupo, matches: {}, pointerIdx: 0, pending: null };
  GROUP_BRACKET_DEF.forEach(def=>{ groupBracket.matches[def.id] = {winner:null, loser:null}; });

  state.tournament = {
    stage:"groups",
    playerTeam,
    groupATeams: meuGrupo,
    groupBracket,
    otherGroupsTop2,
    encGroupLetter: letra,
    byeTeams: [],
    bracket: null,
  };
  advanceGroupBracket();
}
function setupCopaTournament(){
  state.campaignStats = { us: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  state.campaignRecords = {singleMap:{kills:RECORDS.singleMap,holder:"aspas"}, md3:{kills:RECORDS.md3,holder:"aspas"}, md5:{kills:RECORDS.md5,holder:"marteen"}};
  state.journey = [];

  const playerTeam = {id:"player", isPlayer:true, name:state.selecao, roster:state.roster, coach:state.headCoach, rating: teamOverall(state.roster)};
  if(!WC_SELECOES[state.selecao]){
    // seleção não convidada: joga o qualificatório regional ao vivo antes dos grupos
    encStartLiveQualifier(playerTeam, {mode:"copa"});
    return;
  }
  encStartCopaGroups(playerTeam, encOpponentNations(state.selecao).opponents);
}
// ===== Qualificatório regional ao vivo (seleções não convidadas da Esports Nations Cup) =====
// O jogador enfrenta outras seleções da própria região numa chave de dupla eliminação (4 ou 8
// times); as vagas da região (2 ou 3) vão pra quem terminar nas primeiras colocações.
function encStartLiveQualifier(playerTeam, ctx){
  const nation = playerTeam.name;
  const region = encNationRegion(nation);
  const slots = ENC_QUALIFIER_SLOTS[region];
  const outras = shuffle(Object.keys(ENC_QUALIFIER_NATIONS[region]).filter(n=>n!==nation && canCompleteRoster(ENC_ROLES_NEEDED, selecaoPlayerObjects(n))));
  const size = outras.length>=7 ? 8 : 4;
  const adversarios = outras.slice(0, size-1).map((n,i)=>encBuildNationTeam(n, "q"+i));
  const def = size===8 ? BRACKET_DEF : FOUR_TEAM_BRACKET_DEF;
  state.screen = "match";
  state.tournament = {stage:"groups_skip", playerTeam, ascensaoPhase:"encQualifier", encCtx:{...ctx, nation, region, slots, field: adversarios}};
  buildPlayoffBracketSeeded(shuffle([playerTeam, ...adversarios]), def);
  advanceTournament();
}
// Fim do qualificatório ao vivo: decide se o jogador se classificou, fecha as vagas das IAs e
// segue pros grupos (ou encerra, se ficou de fora).
function encHandleQualifierEnd(endInfo){
  const tr = state.tournament, ctx = tr.encCtx, playerTeam = tr.playerTeam;
  const passou = ascensaoQualifiesFromPlayoffs(ctx.slots, endInfo);
  const ranking = ascensaoSimQualifier(ctx.field).map(t=>t.name);
  ranking.splice(Math.min(ascensaoPlacementIndex(endInfo), ranking.length), 0, "__player__");
  const regiaoIA = ranking.slice(0, ctx.slots).filter(n=>n!=="__player__");
  const outrasRegioes = encSimulateQualifiers(ctx.nation, null, ctx.region).qualified;
  const opponents = [...Object.keys(WC_SELECOES).filter(n=>canCompleteRoster(ENC_ROLES_NEEDED, selecaoPlayerObjects(n))), ...regiaoIA, ...outrasRegioes];
  if(passou){
    if(ctx.mode==="copa") encStartCopaGroups(playerTeam, opponents);
    else encStartAscensaoGroups(playerTeam, opponents, ctx.asc);
    return;
  }
  if(ctx.mode==="copa"){
    state.endInfo = {type:"notQualified"};
    finalizeCampaign();
  } else {
    state.endInfo = {type:"notQualified"};
    ascensaoShowStageSummary(t("ascensaoWorldCupLabel"), null, "notQualified", {
      type:"finish", regionalPlacement: ctx.asc.regionalPlacement, qualificou: ctx.asc.qualificou,
      mundialResultado: ctx.asc.mundialResultado, copaResultado: "notQualified",
    }, undefined, null);
  }
}
function setupTournament(){
  if(state.difficulty==="regional"){ setupRegionalTournament(); return; }
  if(state.difficulty==="copa"){ setupCopaTournament(); return; }
  const playerTeam = {id:"player", isPlayer:true, rating: teamOverall(state.roster)};
  // Campo de 16 times (4 por território). Se o jogador escolheu um parceiro fora dos 16 "base",
  // ele toma a vaga de um time base aleatório do mesmo território.
  let baseField = TEAM_NAMES.slice();
  if(!baseField.some(tm=>tm.name===state.teamName)){
    const terr = ORG_TERRITORY[state.teamName];
    const sameTerr = baseField.filter(tm=>ORG_TERRITORY[tm.name]===terr);
    const drop = sameTerr.length ? sameTerr[Math.floor(Math.random()*sameTerr.length)] : baseField[Math.floor(Math.random()*baseField.length)];
    baseField = baseField.filter(tm=>tm!==drop);
  }
  const pool = shuffle(
    baseField.filter(tm=>tm.name!==state.teamName).map((tm,i)=>({id:"t"+i, name:tm.name, rating:tm.rating}))
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
