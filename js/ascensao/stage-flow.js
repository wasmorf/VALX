/* ==========================================================
   stage-flow.js — Fim de etapa, Mundial, Copa e virada de temporada
   ========================================================== */

// Ponto central: quando um estágio do torneio chega ao fim (elimina ou fecha o chaveamento),
// decide se finaliza a campanha normal OU passa pro próximo estágio do Rumo à Ascensão
// (Regional -> Mundial -> Copa do Mundo, se for o ano certo).
// Decide se a colocação alcançada nos playoffs Regionais/Mundiais classifica pro próximo
// estágio, baseado em ONDE o jogador foi eliminado (sem precisar do chaveamento inteiro
// resolvido, já que na campanha ao vivo o resto do chaveamento pode não ter rodado ainda).
function ascensaoQualifiesFromPlayoffs(qualifyCount, endInfo){
  if(endInfo.type==="champion") return true;
  if(endInfo.type==="runnerup") return qualifyCount>=2;
  const labelKey = endInfo.stageLabelKey;
  if(labelKey==="lbFinal") return qualifyCount>=3;
  if(labelKey==="lbSemi") return qualifyCount>=4;
  return false; // lbR1/lbR2 — eliminado cedo demais, nunca classifica
}
// Controlador central do Rumo à Ascensão ao vivo: decide o que acontece quando um estágio
// termina (Regional -> Mundial -> Copa do Mundo, se for o ano certo -> fim da temporada).
// Registra os craques do elenco atual como campeões Mundiais/Copa do Mundo dessa campanha —
// eles ganham o bônus de overall até o fim das 16 temporadas. Se o próprio personagem foi o
// MVP daquela conquista, conta mais uma pro contador de MVPs da carreira.
function ascensaoRegisterChampions(mvp){
  const c = state.carreira;
  if(!c.campeoesMundiais) c.campeoesMundiais = [];
  if(!c.campeoesMundiaisCoach) c.campeoesMundiaisCoach = [];
  state.roster.filter(Boolean).forEach(p=>{
    if(!c.campeoesMundiais.some(n=>n.toLowerCase()===p.name.toLowerCase())) c.campeoesMundiais.push(p.name);
  });
  if(state.headCoach && !c.campeoesMundiaisCoach.some(n=>n.toLowerCase()===state.headCoach.toLowerCase())){
    c.campeoesMundiaisCoach.push(state.headCoach);
  }
  if(mvp && mvp.isCharacter){
    c.mvpCount = (c.mvpCount||0) + 1;
  }
}
// Igual acima, mas pro título Regional (bônus menor) — jogadores e o técnico do time que
// ganhou o Regional entram nessa lista separada.
function ascensaoRegisterRegionalChampions(mvp){
  const c = state.carreira;
  if(!c.campeoesRegionais) c.campeoesRegionais = [];
  if(!c.campeoesRegionaisCoach) c.campeoesRegionaisCoach = [];
  state.roster.filter(Boolean).forEach(p=>{
    if(!c.campeoesRegionais.some(n=>n.toLowerCase()===p.name.toLowerCase())) c.campeoesRegionais.push(p.name);
  });
  if(state.headCoach && !c.campeoesRegionaisCoach.some(n=>n.toLowerCase()===state.headCoach.toLowerCase())){
    c.campeoesRegionaisCoach.push(state.headCoach);
  }
  if(mvp && mvp.isCharacter){
    c.mvpCount = (c.mvpCount||0) + 1;
  }
}
function ascensaoHandleStageEnd(endInfo){
  const tr = state.tournament;
  const c = state.carreira;
  const phase = tr.ascensaoPhase;

  if(phase==="qualifier" || phase==="qualifierLC"){
    const key = tr.ascensaoStageKey;
    const lc = phase==="qualifierLC";
    const placement = {type: endInfo.type, stageLabelKey: endInfo.stageLabelKey};
    const r = lc ? (ascensaoFinishQualifierLC(key, endInfo) ? "yes" : "no") : ascensaoFinishQualifier(key, endInfo);
    c.seasonStages.push({key:(lc?"ql_":"q_")+key, placement});
    let proxima, nota;
    if(r==="yes"){
      proxima = {type:"stage", key};
      nota = L3("Classificado para o "+ascensaoStageName(key), "Qualified for "+ascensaoStageName(key), "Clasificado a "+ascensaoStageName(key));
    } else if(r==="lc"){
      proxima = {type:"stage", key:"ql_"+key};
      nota = L3("Vice da sub-região: vai pra chave de última chance pela vaga", "Sub-region runner-up: off to the last-chance bracket for a slot", "Subcampeón de la subregión: va a la llave de última chance por un cupo");
    } else {
      Object.keys(TEAM_REGIONS).forEach(rg=>ascensaoSimAITerritory(key, rg));
      c.seasonStages.push({key, notQualified:true});
      proxima = ascensaoNextAction(key);
      nota = L3("Eliminado no qualifier: fora do "+ascensaoStageName(key), "Out of the qualifier: not in "+ascensaoStageName(key), "Eliminado en el qualifier: fuera de "+ascensaoStageName(key));
    }
    ascensaoShowStageSummary(ascensaoStageName((lc?"ql_":"q_")+key), placement, null, proxima, nota, null);
    return;
  }
  if(phase==="regional" || phase==="masters"){
    const key = tr.ascensaoStageKey || "kickoff";
    const placement = {type: endInfo.type, stageLabelKey: endInfo.stageLabelKey};
    const mvp = endInfo.type==="champion" ? getMVP() : null;
    if(endInfo.type==="champion") ascensaoRegisterRegionalChampions(mvp);
    if(phase==="regional") ascensaoFinishTerritoryEvent(key, endInfo);
    else ascensaoFinishMasters(key, endInfo);
    c.seasonStages.push({key, placement});
    const proxima = ascensaoNextAction(key);
    ascensaoShowStageSummary(ascensaoStageName(key), placement, null, proxima, ascensaoQualifyNote(key), mvp);
    return;
  }
  if(phase==="mundial"){
    let mundialResultado;
    let mvpMundial = null;
    if(endInfo.type==="groups") mundialResultado = "worldGroups";
    else if(endInfo.type==="champion"){ mundialResultado = "champion"; mvpMundial = getMVP(); ascensaoRegisterChampions(mvpMundial); }
    else if(endInfo.type==="runnerup") mundialResultado = "runnerup";
    else mundialResultado = "worldPlayoffs";
    c.seasonStages.push({key:"champions", resultado: mundialResultado});
    ascensaoShowStageSummary("Champions", null, mundialResultado, ascensaoSeasonEndAction(), undefined, mvpMundial);
    return;
  }
  if(phase==="worldcup"){
    let copaResultado;
    let mvpCopa = null;
    if(endInfo.type==="groups") copaResultado = "groups";
    else if(endInfo.type==="champion"){ copaResultado = "champion"; mvpCopa = getMVP(); ascensaoRegisterChampions(mvpCopa); }
    else if(endInfo.type==="runnerup") copaResultado = "runnerup";
    else copaResultado = "playoffs";
    ascensaoShowStageSummary(t("ascensaoWorldCupLabel"), null, copaResultado, {
      type:"finish", regionalPlacement: tr.ascensaoRegionalPlacement, qualificou: tr.ascensaoQualificou,
      mundialResultado: tr.ascensaoMundialResultado, copaResultado,
    }, undefined, mvpCopa);
    return;
  }
}
// Mostra um resumo da competição que acabou de terminar (com o caminho de partidas dela) e
// espera o jogador clicar em "Continuar" antes de seguir pra próxima etapa da temporada.
function ascensaoShowStageSummary(nomeCompeticao, regionalPlacement, resultadoGenerico, proximaAcao, qualificou, mvp){
  const c = state.carreira;
  c.stageSummary = {
    nomeCompeticao,
    label: regionalPlacement ? ascensaoRegionalPlacementLabel(regionalPlacement, nomeCompeticao) : ascensaoResultLabel(resultadoGenerico),
    qualificadoLabel: typeof qualificou==="string" ? qualificou : (qualificou!==undefined ? ascensaoQualifiedLabel(qualificou) : null),
    journey: state.journey.slice(state.journeyStageStart || 0),
    mvp: mvp || null,
  };
  c.pendingNextAction = proximaAcao;
  state.screen = "ascensaoStageSummary";
}
// Executa a próxima etapa da temporada depois que o jogador confirma o resumo da competição.
function ascensaoAdvanceFromSummary(){
  const c = state.carreira;
  const acao = c.pendingNextAction;
  c.pendingNextAction = null;
  c.stageSummary = null;
  if(acao.type==="stage"){
    ascensaoStartStage(acao.key);
  } else if(acao.type==="mundial"){
    setupAscensaoMundialStage();
  } else if(acao.type==="worldcup"){
    setupAscensaoWorldCupStage(acao.regionalPlacement, acao.qualificou, acao.mundialResultado);
  } else if(acao.type==="finish"){
    ascensaoFinishSeason(acao.regionalPlacement, acao.qualificou, acao.mundialResultado, acao.copaResultado);
  }
}
// Monta e começa a fase Mundial ao vivo (16 times, os classificados de todas as 6 regiões).
function setupAscensaoMundialStage(){
  const c = state.carreira;
  state.difficulty = "ascensao";
  state.screen = "match";
  state.journeyStageStart = state.journey.length;
  const playerOrgTeam = ascensaoBuildPlayerTeam();
  const kick = (c.seasonStages||[]).find(s=>s.key==="kickoff");
  const regionalPlacementSalvo = kick && kick.placement;
  state.campaignStats = { us: playerOrgTeam.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };
  const worldQualifiers = [playerOrgTeam];
  (c.championsOrgs||[]).filter(o=>o!==c.time).forEach(org=>worldQualifiers.push(ascensaoTeamForOrg(org, ORG_TERRITORY[org])));
  state.roster = playerOrgTeam.roster;
  state.teamName = playerOrgTeam.name;
  state.headCoach = playerOrgTeam.coach;
  state.assistantCoach = playerOrgTeam.ac || null;
  const allTeams = shuffle(worldQualifiers);
  const groupA = allTeams.slice(0,4), groupB = allTeams.slice(4,8), groupC = allTeams.slice(8,12), groupD = allTeams.slice(12,16);
  const myGroup = [groupA,groupB,groupC,groupD].find(g=>g.some(tm=>tm.isPlayer));
  const others = [groupA,groupB,groupC,groupD].filter(g=>g!==myGroup);
  const otherGroupsTop2 = {};
  ["B","C","D"].forEach((letra,i)=>{
    const g = others[i];
    const brkAI = { seeds: shuffle(g), matches: {} };
    GROUP_BRACKET_DEF.forEach(d=>{ brkAI.matches[d.id] = {winner:null,loser:null}; });
    GROUP_BRACKET_DEF.forEach(d=>{
      const a = resolveBracketTeam(d.aFrom, brkAI), b = resolveBracketTeam(d.bFrom, brkAI);
      brkAI.matches[d.id] = decideMatchWinner(a, b, 2);
    });
    otherGroupsTop2[letra] = [
      {...brkAI.matches.m3.winner, isGroupWinner:true},
      {...brkAI.matches.m5.winner, isGroupWinner:false},
    ];
  });
  state.tournament = {
    stage: "groups",
    playerTeam: playerOrgTeam,
    otherGroupsTop2,
    ascensaoPhase: "mundial",
    ascensaoRegionalPlacement: regionalPlacementSalvo,
    groupBracket: { seeds: shuffle(myGroup), matches: {}, pointerIdx:0, pending:null },
  };
  GROUP_BRACKET_DEF.forEach(d=>{ state.tournament.groupBracket.matches[d.id] = {winner:null, loser:null}; });
  advanceGroupBracket();
}
// Monta e começa a Copa do Mundo ao vivo (16 Seleções, 4 grupos estilo GSL, playoffs de 8) —
// o personagem entra na Seleção do seu país, substituindo um craque real na função dele.
function setupAscensaoWorldCupStage(regionalPlacement, qualificou, mundialResultado){
  const c = state.carreira;
  state.tournament = {ascensaoRegionalPlacement: regionalPlacement, ascensaoQualificou: qualificou, ascensaoMundialResultado: mundialResultado};
  state.screen = "match";
  state.journeyStageStart = state.journey.length;
  const myRoster = buildAscensaoNationalTeam();
  const playerTeam = {id:"player", isPlayer:true, name:c.nacao, roster:myRoster, coach:bestSelecaoCoach(c.nacao), rating:teamOverall(myRoster)};
  state.roster = myRoster;
  state.teamName = c.nacao;
  state.headCoach = playerTeam.coach;
  state.assistantCoach = null;
  const outrasNacoes = Object.keys(WC_SELECOES).filter(n=>n!==c.nacao);
  const montaTimeNacao = nacao=>{
    const roster = ascensaoApplyChampionBonus(buildBestRoster(ascensaoSelecaoPlayerObjects(nacao)));
    return {id:nacao, name:nacao, roster, coach:bestSelecaoCoach(nacao), rating:teamOverall(roster)};
  };
  const outrosComBye = outrasNacoes.filter(n=>WC_SELECAO_BYE_TEAMS.includes(n)).map(montaTimeNacao);
  const outrosDeGrupo = shuffle(outrasNacoes.filter(n=>!WC_SELECAO_BYE_TEAMS.includes(n))).map(montaTimeNacao);
  // reseta as estatísticas da campanha pro elenco da SELEÇÃO (não o do clube, que é o que
  // ficou salvo do estágio Regional anterior) — senão o MVP dessa fase pode sair um craque
  // do seu time de clube que nem está jogando pela Seleção. Vale pros dois caminhos (bye ou
  // fase de grupos), então fica antes da bifurcação.
  state.campaignStats = { us: myRoster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i], isCharacter:p.isCharacter, country:p.country, k:0, d:0, a:0})) };

  if(WC_SELECAO_BYE_TEAMS.includes(c.nacao)){
    // minha propria selecao (Brasil ou Estados Unidos) ja tem bye — vai direto pros playoffs
    const grupoA = outrosDeGrupo.slice(0,4), grupoB = outrosDeGrupo.slice(4,8), grupoC = outrosDeGrupo.slice(8,12);
    const qualA = buildGroupQualifiersAI(grupoA), qualB = buildGroupQualifiersAI(grupoB), qualC = buildGroupQualifiersAI(grupoC);
    const seeds = shuffle([playerTeam, ...outrosComBye, ...qualA, ...qualB, ...qualC]);
    state.tournament = {
      stage: "groups_skip", playerTeam, ascensaoPhase: "worldcup",
      ascensaoRegionalPlacement: regionalPlacement, ascensaoQualificou: qualificou, ascensaoMundialResultado: mundialResultado,
    };
    buildPlayoffBracketSeeded(seeds, BRACKET_DEF);
    advanceTournament();
    return;
  }

  const todosDeGrupo = shuffle([playerTeam, ...outrosDeGrupo]);
  const grupoA = todosDeGrupo.slice(0,4), grupoB = todosDeGrupo.slice(4,8), grupoC = todosDeGrupo.slice(8,12);
  const myGroup = grupoA.some(t=>t.isPlayer) ? grupoA : (grupoB.some(t=>t.isPlayer) ? grupoB : grupoC);
  const otherGroupsTop2 = {};
  if(myGroup!==grupoA) otherGroupsTop2.A = buildGroupQualifiersAI(grupoA);
  if(myGroup!==grupoB) otherGroupsTop2.B = buildGroupQualifiersAI(grupoB);
  if(myGroup!==grupoC) otherGroupsTop2.C = buildGroupQualifiersAI(grupoC);
  state.tournament = {
    stage: "groups",
    playerTeam,
    otherGroupsTop2,
    byeTeams: outrosComBye,
    ascensaoPhase: "worldcup",
    ascensaoRegionalPlacement: regionalPlacement,
    ascensaoQualificou: qualificou,
    ascensaoMundialResultado: mundialResultado,
    groupBracket: { seeds: shuffle(myGroup), matches: {}, pointerIdx:0, pending:null },
  };
  GROUP_BRACKET_DEF.forEach(d=>{ state.tournament.groupBracket.matches[d.id] = {winner:null, loser:null}; });
  advanceGroupBracket();
}
// Fecha a temporada: guarda o resultado (e o da Copa do Mundo, se rolou) no histórico e mostra
// a tela de resumo da temporada, com o caminho de partidas que o jogador acabou de jogar.
// Sorteia se o craque recebe uma oferta de transferência de outro time (~25% de chance) —
// guarda a oferta em state.carreira.oferta e retorna true se rolou.
// Proximidade entre regiões — usada pra pesar de onde as ofertas de transferência vêm.
// BR/LAS são vizinhas, APAC/CHN são vizinhas, NA e EMEA ficam mais isoladas.
// De qual região esportiva cada país costuma fazer parte — usado pra saber a "região de casa"
// do craque pela nacionalidade dele (não pelo time atual).
const COUNTRY_TO_REGION = {
  US:"AMERICAS", CA:"AMERICAS", MX:"AMERICAS", BR:"AMERICAS", DO:"AMERICAS",
  AR:"AMERICAS", CL:"AMERICAS", BO:"AMERICAS", CO:"AMERICAS", EC:"AMERICAS", GY:"AMERICAS", PY:"AMERICAS", PE:"AMERICAS", SR:"AMERICAS", UY:"AMERICAS", VE:"AMERICAS",
  KR:"PACIFIC", VN:"PACIFIC", PH:"PACIFIC", SG:"PACIFIC", ID:"PACIFIC", MY:"PACIFIC", TH:"PACIFIC", JP:"PACIFIC", KH:"PACIFIC", IN:"PACIFIC", AU:"PACIFIC", NZ:"PACIFIC",
  CN:"CN", TW:"CN", HK:"CN",
  TR:"EMEA", RU:"EMEA", PL:"EMEA", UA:"EMEA", GB:"EMEA", FR:"EMEA", MA:"EMEA", DK:"EMEA", NL:"EMEA",
  LT:"EMEA", FI:"EMEA", SE:"EMEA", LV:"EMEA", CZ:"EMEA", BE:"EMEA", EE:"EMEA", MD:"EMEA", DE:"EMEA", ES:"EMEA",
  PT:"EMEA", RS:"EMEA", BG:"EMEA", IE:"EMEA", KZ:"EMEA", EG:"EMEA", SA:"EMEA", LB:"EMEA", KG:"EMEA", RO:"EMEA", ZA:"EMEA", IT:"EMEA", AT:"EMEA", NO:"EMEA",
};
const ASCENSAO_REGION_PROXIMITY = {
  AMERICAS: [], EMEA: [],
  PACIFIC: ["CN"], CN: ["PACIFIC"],
};
function ascensaoOrgOfferWeight(orgRegiao, minhaRegiao, minhaRegiaoDeCasa){
  if(orgRegiao===minhaRegiao) return 4;
  if(orgRegiao===minhaRegiaoDeCasa) return 4; // região do seu país também prioriza igual
  if((ASCENSAO_REGION_PROXIMITY[minhaRegiao]||[]).includes(orgRegiao)) return 3;
  return 1;
}
// Sorteia N itens sem repetir, respeitando pesos (quanto maior o peso, mais chance de sair).
function weightedSampleWithoutReplacement(items, weights, count){
  const pool = items.map((item,i)=>({item, weight:weights[i]}));
  const resultado = [];
  for(let k=0; k<count && pool.length>0; k++){
    const total = pool.reduce((s,p)=>s+p.weight, 0);
    let r = Math.random()*total;
    let idx = 0;
    for(; idx<pool.length; idx++){
      r -= pool[idx].weight;
      if(r<=0) break;
    }
    idx = Math.min(idx, pool.length-1);
    resultado.push(pool[idx].item);
    pool.splice(idx, 1);
  }
  return resultado;
}
function ascensaoRollTransferOffer(){
  const c = state.carreira;
  const baseRosters = c.orgRostersSnapshot || ASCENSAO_TEAM_ROSTERS;
  if(Math.random()>=0.82) return false;
  const candidatos = Object.keys(TEAM_REGIONS).flatMap(regiao=>territoryAllOrgs(regiao).map(org=>({org,regiao})))
    .filter(o=>o.org!==c.time && baseRosters[o.org]);
  if(candidatos.length===0) return false;
  const quantidade = Math.min(candidatos.length, Math.floor(Math.random()*4)); // 0 a 3
  if(quantidade===0) return false;
  const minhaRegiaoDeCasa = COUNTRY_TO_REGION[c.nacionalidade];
  const pesos = candidatos.map(o=>ascensaoOrgOfferWeight(o.regiao, c.regiao, minhaRegiaoDeCasa));
  // sorteia bem mais candidatos do que precisa, porque alguns vão ser descartados por não
  // terem vaga pra nenhuma função que o craque escolheu (principal ou secundária).
  const sorteados = weightedSampleWithoutReplacement(candidatos, pesos, Math.min(candidatos.length, quantidade*3));
  // usa o elenco ATUAL (depois das transferências dessa temporada), não o elenco original —
  // simula uma vez por região dos escolhidos e reaproveita.
  const transferenciasPorRegiao = {};
  const transferenciasCoachPorRegiao = {};
  const ofertasComFuncao = [];
  for(const o of sorteados){
    if(ofertasComFuncao.length>=quantidade) break;
    if(!transferenciasPorRegiao[o.regiao]){
      transferenciasPorRegiao[o.regiao] = simulateRegionalTransfers(o.regiao, o.regiao===c.regiao ? c.time : null);
      transferenciasCoachPorRegiao[o.regiao] = simulateRegionalCoachTransfers(o.regiao, o.regiao===c.regiao ? c.time : null, transferenciasPorRegiao[o.regiao]);
    }
    const jogadores = transferenciasPorRegiao[o.regiao][o.org] || baseRosters[o.org].players;
    const coach = transferenciasCoachPorRegiao[o.regiao][o.org] || baseRosters[o.org].coach;
    const realPlayers = jogadores.map(n=>poolGet(n)).filter(Boolean);
    const rosterComPersonagem = buildTeamWithCharacterRandomRole(realPlayers);
    const personagemNoTime = rosterComPersonagem.find(p=>p && p.isCharacter);
    if(!personagemNoTime) continue; // não coube em nenhuma função que o craque escolheu — não oferece
    const funcaoNaOferta = SLOT_ORDER[rosterComPersonagem.indexOf(personagemNoTime)];
    ofertasComFuncao.push({ org: o.org, regiao: o.regiao, jogadores, coach, funcao: funcaoNaOferta });
  }
  if(ofertasComFuncao.length===0) return false;
  c.ofertas = ofertasComFuncao;
  return true;
}
// Atualiza a "forma" de cada organização com base no retrospecto REAL dela na temporada
// inteira (todas as vitórias e derrotas, não só contra o jogador) — quem teve mais derrota
// que vitória fica "mal" (mais chance de buscar reforço na próxima), quem teve saldo positivo
// fica "bem" (menos chance de mexer no time).
function ascensaoUpdateOrgForm(){
  const c = state.carreira;
  if(!c.orgForm) c.orgForm = {};
  const sr = c.seasonResults || {};
  Object.entries(sr).forEach(([org, rec])=>{
    if(!(org in c.orgForm)) c.orgForm[org] = 0;
    const saldo = rec.losses - rec.wins; // positivo = temporada ruim, negativo = temporada boa
    const delta = Math.max(-2, Math.min(2, Math.round(saldo/2)));
    c.orgForm[org] = Math.max(-4, Math.min(4, c.orgForm[org] + delta));
  });
  c.seasonResults = {};
}
function ascensaoFinishSeason(regionalPlacement, regionalQualificou, mundialResultado, copaResultado){
  const c = state.carreira;
  const entry = {temporada:c.temporada, time:c.time, regiao:c.regiao, regionalPlacement, regionalQualificou, journey: state.journey, stages: (c.seasonStages||[]).slice()};
  if(mundialResultado) entry.mundialResultado = mundialResultado;
  if(copaResultado) entry.copaResultado = copaResultado;
  c.historico.push(entry);
  c.seasonStages = []; c.seasonPoints = {}; c.eventRanking = {}; c.mastersField = {}; c.qualifiers = {}; c.qualRank = {};
  ascensaoUpdateOrgForm();
  c.temporada += 1;
  state.difficulty = null;
  state.screen = "ascensaoSeason";
}
