/* ==========================================================
   roster-builders.js — Montagem de times, reservas e mercado de transferências
   ========================================================== */

// Cria uma cópia independente dos elencos/técnicos originais — usada uma vez no início de cada
// carreira do Ascensão. As trocas de mercado atualizam ESSA cópia, não o banco original, e cada
// temporada nova continua de onde a anterior parou (em vez de resetar sempre pro mesmo ponto de
// partida) — isso é o que faz os times evoluírem de verdade ao longo da carreira.
// Reservas (6º jogador) ficam fora do mercado de agentes livres: já têm time.
function ascensaoReserveNames(baseRosters){
  return Object.values(baseRosters).flatMap(d=>(d.reserve||[]).map(n=>n.toLowerCase()));
}
function ascensaoBuildFreshSnapshot(){
  const snapshot = {};
  Object.entries(ASCENSAO_TEAM_ROSTERS).forEach(([org, dados])=>{
    snapshot[org] = {players: [...dados.players], coach: dados.coach, ac: dados.ac||null, reserve: [...(dados.reserve||[])]};
  });
  return snapshot;
}
// Depois de atualizar o snapshot com o resultado do mercado de uma região, garante que nenhum
// craque continue "preso" no elenco de um time de OUTRA região de uma temporada anterior —
// tira ele de lá (vira vaga em aberto, preenchida normalmente na próxima vez que aquele time
// jogar) em vez de deixar o mesmo craque escalado em dois times ao mesmo tempo.
function ascensaoDedupeSnapshot(snapshot, orgsAutoritativos){
  const usadosAgora = new Set();
  orgsAutoritativos.forEach(org=>{
    if(snapshot[org]) snapshot[org].players.filter(Boolean).forEach(n=>usadosAgora.add(n.toLowerCase()));
  });
  Object.keys(snapshot).forEach(org=>{
    if(orgsAutoritativos.includes(org)) return;
    snapshot[org].players = snapshot[org].players.map(n=>{
      if(n && usadosAgora.has(n.toLowerCase())) return null;
      return n;
    });
  });
}
// Calcula a força de um time pra "Rumo à Ascensão": usa o elenco real + composição/química
// quando já pesquisamos esse time; senão cai pra força genérica (teamRegionRating).
// Monta o time completo (elenco+coach) de uma organização do Rumo à Ascensão — usa o elenco
// real se já tivermos pesquisado, senão monta um elenco genérico (sorteado do banco geral)
// só pra ter alguém pra calcular a força do time.
// Craques que já foram campeões Mundiais ou da Copa do Mundo NESSA campanha do Ascensão
// ganham um bônus de overall até o fim das 16 temporadas — representa o "peso" de já ter
// sido campeão. Não mexe no objeto original do banco (POOL), só numa cópia pro time atual.
// Campeão Regional dá um bônus menor que Campeão Mundial — quem ganhou os dois soma os dois.
// Craques que NUNCA devem aparecer no Rumo à Ascensão (nem escalados em time, nem como agente
// livre no mercado) — mesmo continuando disponíveis normalmente nos outros modos.
const ASCENSAO_EXCLUDED_PLAYERS = new Set([]);
// Igual acima, mas pra técnicos — nunca aparecem escalados nem como agente livre no Ascensão.
const ASCENSAO_EXCLUDED_COACHES = new Set([]);
const ASCENSAO_CHAMPION_BONUS = 3;
const ASCENSAO_REGIONAL_CHAMPION_BONUS = 1.5;
function ascensaoApplyChampionBonus(roster){
  const c = state.carreira;
  const mundiais = new Set((c && c.campeoesMundiais || []).map(n=>n.toLowerCase()));
  const regionais = new Set((c && c.campeoesRegionais || []).map(n=>n.toLowerCase()));
  return roster.map(p=>{
    if(!p) return p;
    let bonus = 0;
    const nomeLower = p.name.toLowerCase();
    if(mundiais.has(nomeLower) || PLAYER_WORLD_CHAMPION.has(nomeLower)) bonus += ASCENSAO_CHAMPION_BONUS;
    if(regionais.has(nomeLower) || PLAYER_REGIONAL_CHAMPION.has(nomeLower)) bonus += ASCENSAO_REGIONAL_CHAMPION_BONUS;
    if(bonus>0) return {...p, overall: Math.min(99, p.overall + bonus)};
    return p;
  });
}
// Casamento bipartido genérico pra um subconjunto específico de funções (não precisa ser as
// 5 do SLOT_ORDER inteiro) — usado pra encaixar o personagem numa Seleção real ou elenco de org.
// Temporadas em que a Copa do Mundo acontece: a cada 3, a partir da 2ª (2,5,8,11,14...).
function isAscensaoWorldCupSeason(temporada){
  return temporada>=2 && (temporada-2)%3===0;
}
function assignRolesFrom(roles, players){
  const matchRole = {};
  function tryAssign(roleKey, visited){
    for(const p of players){
      if(!p.roles.includes(roleKey) || visited.has(p.name)) continue;
      visited.add(p.name);
      if(!(p.name in matchRole) || tryAssign(matchRole[p.name], visited)){
        matchRole[p.name] = roleKey;
        return true;
      }
    }
    return false;
  }
  const ok = roles.every(r=>tryAssign(r, new Set()));
  if(!ok) return null;
  return roles.map(r=>{
    const name = Object.keys(matchRole).find(n=>matchRole[n]===r);
    return players.find(p=>p.name===name);
  });
}
// Monta um roster de 5 encaixando o personagem numa das funções dele (a principal, se der,
// senão tenta as secundárias em ordem) — os outros 4 vêm do pool de craques reais passado.
// Quais qualidades são "essenciais" pra cada função — dão o bônus maior quando o craque tem.
const ASCENSAO_ESSENTIAL_QUALITIES = {
  duelist: ["entry","mm","clutch"],
  sentinel: ["lurker","mm","clutch"],
  controller: ["mm","clutch","utility"],
  initiator: ["utility","clutch"],
  flex: ["utility","clutch"],
};
// Qualidades "opcionais" — ajudam bem, mas não são essenciais (Operator no Duelista/Sentinela).
const ASCENSAO_OPTIONAL_QUALITIES = {
  duelist: ["operator"],
  sentinel: ["operator"],
};
// Funções em que o IGL ajuda mesmo não sendo "essencial" pra elas.
const ASCENSAO_IGL_GOOD_FUNCTIONS = ["initiator","flex","controller"];
// Funções em que o IGL não soma nada (nem ajuda nem atrapalha).
const ASCENSAO_IGL_NEUTRAL_FUNCTIONS = ["duelist","sentinel"];
// Calcula o overall do craque criado no Rumo à Ascensão — base 82. Cada qualidade soma um
// valor diferente dependendo se ela é essencial pra função escolhida ou não: essencial soma
// mais, opcional soma um pouco menos, mm sempre ajuda (mesmo fora da lista), IGL ajuda em
// Iniciador/Flex/Controlador mas não soma nada em Duelista/Sentinela — nenhuma qualidade
// nunca DIMINUI o overall, só ajuda mais, menos, ou nada.
function ascensaoCharacterOverall(){
  const c = state.carreira;
  let overall = 82;
  const essenciais = ASCENSAO_ESSENTIAL_QUALITIES[c.funcao] || [];
  const opcionais = ASCENSAO_OPTIONAL_QUALITIES[c.funcao] || [];
  c.qualidades.forEach(q=>{
    if(essenciais.includes(q)) overall += 3;
    else if(opcionais.includes(q)) overall += 2;
    else if(q==="mm") overall += 2;
    else if(q==="igl" && ASCENSAO_IGL_NEUTRAL_FUNCTIONS.includes(c.funcao)) overall += 0;
    else if(q==="igl" && ASCENSAO_IGL_GOOD_FUNCTIONS.includes(c.funcao)) overall += 2;
    else overall += 1;
  });
  overall += c.funcoesSecundarias.length * 1.5;
  return Math.min(93, Math.round(overall));
}
function buildTeamWithCharacter(realPlayers, ignoreFuncaoAtual){
  const c = state.carreira;
  let characterRoles = [c.funcao, ...c.funcoesSecundarias];
  // Se aceitou uma oferta pra jogar numa função específica, tenta ESSA primeiro — senão o time
  // sempre monta na função principal e ignora o que foi combinado na oferta. A Seleção da Copa
  // do Mundo é exceção: lá é sempre a função principal, não importa onde o craque jogue no time.
  if(!ignoreFuncaoAtual && c.funcaoAtual && characterRoles.includes(c.funcaoAtual)){
    characterRoles = [c.funcaoAtual, ...characterRoles.filter(r=>r!==c.funcaoAtual)];
  }
  const characterOverall = ascensaoCharacterOverall();
  const characterPlayer = {name:c.nome, roles:characterRoles, overall:characterOverall, tags:c.qualidades, isCharacter:true, country:c.nacionalidade};
  for(const myRole of characterRoles){
    const remainingRoles = SLOT_ORDER.filter(rk=>rk!==myRole);
    const assigned = assignRolesFrom(remainingRoles, realPlayers);
    if(assigned){
      return SLOT_ORDER.map(rk=>{
        if(rk===myRole) return characterPlayer;
        return assigned[remainingRoles.indexOf(rk)];
      });
    }
  }
  return buildValidRoster(realPlayers); // não coube em nenhuma função — joga só com o time real
}
// Igual buildTeamWithCharacter, mas em vez de parar na primeira função que der certo (que
// quase sempre é a principal), testa TODAS as funções do craque (principal + secundárias) e
// sorteia entre as que realmente cabem — assim ofertas de transferência têm chance real de
// vir pra alguma função secundária também, não só sempre a principal.
// Verifica se, com o elenco NOVO da temporada, alguma função escolhida (principal ou
// secundária) diferente da que o craque está jogando agora deixaria o time melhor — se sim,
// retorna qual e o quanto melhora, pra perguntar antes de fechar a temporada.
function ascensaoCheckRoleSwitchOpportunity(realPlayers){
  const c = state.carreira;
  const characterRoles = [c.funcao, ...c.funcoesSecundarias];
  if(characterRoles.length<2) return null; // sem funcao alternativa pra oferecer
  const funcaoAtual = (c.funcaoAtual && characterRoles.includes(c.funcaoAtual)) ? c.funcaoAtual : c.funcao;
  const characterOverall = ascensaoCharacterOverall();
  const characterPlayer = {name:c.nome, roles:characterRoles, overall:characterOverall, tags:c.qualidades, isCharacter:true, country:c.nacionalidade};
  let melhorFuncao = null, melhorScore = -1, scoreAtual = -1;
  for(const myRole of characterRoles){
    const remainingRoles = SLOT_ORDER.filter(rk=>rk!==myRole);
    const assigned = assignRolesFrom(remainingRoles, realPlayers);
    if(!assigned) continue;
    const roster = SLOT_ORDER.map(rk=>{
      if(rk===myRole) return characterPlayer;
      return assigned[remainingRoles.indexOf(rk)];
    });
    const score = teamOverall(roster);
    if(myRole===funcaoAtual) scoreAtual = score;
    if(score>melhorScore){ melhorScore = score; melhorFuncao = myRole; }
  }
  if(melhorFuncao && melhorFuncao!==funcaoAtual && scoreAtual>=0 && melhorScore-scoreAtual>=1){
    return {funcao: melhorFuncao, diff: melhorScore-scoreAtual};
  }
  return null;
}
function buildTeamWithCharacterRandomRole(realPlayers){
  const c = state.carreira;
  const characterRoles = [c.funcao, ...c.funcoesSecundarias];
  const characterOverall = ascensaoCharacterOverall();
  const characterPlayer = {name:c.nome, roles:characterRoles, overall:characterOverall, tags:c.qualidades, isCharacter:true, country:c.nacionalidade};
  const opcoesValidas = []; // cada item: {roster, peso}
  for(const myRole of characterRoles){
    const remainingRoles = SLOT_ORDER.filter(rk=>rk!==myRole);
    const assigned = assignRolesFrom(remainingRoles, realPlayers);
    if(assigned){
      const roster = SLOT_ORDER.map(rk=>{
        if(rk===myRole) return characterPlayer;
        return assigned[remainingRoles.indexOf(rk)];
      });
      // a função principal pesa o dobro de CADA secundária — assim ela continua sendo a mais
      // provável mesmo quando o craque escolheu várias funções secundárias (senão elas juntas
      // ficam mais prováveis só por serem mais opções, mesmo pesando igual uma por uma).
      opcoesValidas.push({roster, peso: myRole===c.funcao ? 2 : 1});
    }
  }
  if(opcoesValidas.length===0) return buildValidRoster(realPlayers);
  const totalPeso = opcoesValidas.reduce((s,o)=>s+o.peso,0);
  let sorteio = Math.random()*totalPeso;
  let idx = 0;
  while(idx<opcoesValidas.length-1 && sorteio>opcoesValidas[idx].peso){ sorteio -= opcoesValidas[idx].peso; idx++; }
  return opcoesValidas[idx].roster;
}
// Igual selecaoPlayerObjects, mas tirando quem está na lista de excluídos do Ascensão — usado
// só nas telas do Ascensão, a Copa do Mundo isolada continua podendo escalar esses craques.
function ascensaoSelecaoPlayerObjects(nacao){
  return selecaoPlayerObjects(nacao).filter(p=>!ASCENSAO_EXCLUDED_PLAYERS.has(p.name.toLowerCase()));
}
// Só pra Seleção: testa TODAS as funções que o craque escolheu (principal + secundárias) e
// monta o time com a que deixa a Seleção com o maior overall possível — diferente do time do
// clube, aqui não pergunta nada, já monta automaticamente na melhor função entre as escolhidas.
function buildTeamWithCharacterBestRole(realPlayers){
  const c = state.carreira;
  const characterRoles = [c.funcao, ...c.funcoesSecundarias];
  const characterOverall = ascensaoCharacterOverall();
  const characterPlayer = {name:c.nome, roles:characterRoles, overall:characterOverall, tags:c.qualidades, isCharacter:true, country:c.nacionalidade};
  let melhorRoster = null, melhorScore = -1;
  for(const myRole of characterRoles){
    const remainingRoles = SLOT_ORDER.filter(rk=>rk!==myRole);
    const assigned = assignRolesFrom(remainingRoles, realPlayers);
    if(!assigned) continue;
    const roster = SLOT_ORDER.map(rk=>{
      if(rk===myRole) return characterPlayer;
      return assigned[remainingRoles.indexOf(rk)];
    });
    const score = teamOverall(roster);
    if(score>melhorScore){ melhorScore = score; melhorRoster = roster; }
  }
  return melhorRoster || buildValidRoster(realPlayers);
}
function buildAscensaoNationalTeam(){
  const jogadoresOrdenados = [...ascensaoSelecaoPlayerObjects(state.carreira.nacao)].sort((a,b)=>b.overall-a.overall);
  return ascensaoApplyChampionBonus(buildTeamWithCharacterBestRole(jogadoresOrdenados));
}
// Monta o time com 5 em funções válidas; se o elenco real não cobre as 5 funções (comum nos
// elencos novos do VCT 2027), quem sobra joga fora de posição com -3 de overall.
function ascensaoForceRoster(players){
  const roster = buildValidRoster(players);
  const placed = new Set(roster.filter(Boolean).map(p=>p.name));
  const spare = players.filter(p=>!placed.has(p.name));
  return roster.map(p=>{
    if(p) return p;
    const extra = spare.shift();
    return extra ? {...extra, overall: Math.max(60, extra.overall-3), outOfRole:true} : null;
  });
}
function buildAscensaoOrgTeam(name, insertCharacter, overridePlayers, overrideCoach){
  const baseRosters = (state.carreira && state.carreira.orgRostersSnapshot) || ASCENSAO_TEAM_ROSTERS;
  const real = baseRosters[name];
  const playerNames = overridePlayers || (real && real.players);
  const coachFinal = overrideCoach!==undefined ? overrideCoach : (real && real.coach);
  const acFinal = (real && real.ac) || null;
  if(playerNames){
    const roster = playerNames.filter(Boolean).map(n=>poolGet(n)).filter(Boolean);
    if(roster.length>=5){
      if(insertCharacter){
        const roster2 = ascensaoApplyChampionBonus(buildTeamWithCharacter(roster));
        if(!roster2.some(p=>!p)) return {id:name, name, roster:roster2, coach:coachFinal, ac:acFinal, rating:teamOverall(roster2)};
      }
      const validRoster = ascensaoApplyChampionBonus(ascensaoForceRoster(roster));
      if(!validRoster.some(p=>!p)){
        return {id:name, name, roster:validRoster, coach:coachFinal, ac:acFinal, rating:teamOverall(validRoster)};
      }
    }
  }
  // sem elenco real confiável — monta um genérico só pra ter numero pra simular
  const roster = buildAIRoster(shuffle(POOL).slice());
  return {id:name, name, roster, coach:null, rating:teamOverall(roster)};
}
// Simula o "mercado de transferências" dos times adversários de uma região pra essa temporada
// — alguns times trocam um craque com outro time da região, tentando melhorar o elenco. Só
// mexe numa cópia local (não mexe no banco de dados de verdade, cada temporada é sorteada de
// novo). Retorna um mapa {nomeDoTime: [craques atualizados]} pra usar só nessa simulação.
// Igual o mercado de craques, só que pra técnicos: cada time só troca de HC se aparecer
// alguém melhor no mercado (usando o buff do técnico como "qualidade") — o técnico antigo só
// vira opção pros próximos times depois que o meu já foi substituído de verdade.
function simulateRegionalCoachTransfers(regiao, excludeOrg, transferenciasDeJogadores, usadosGlobalmenteCoach){
  const baseRosters = (state.carreira && state.carreira.orgRostersSnapshot) || ASCENSAO_TEAM_ROSTERS;
  const orgs = territoryAllOrgs(regiao).filter(o=>o!==excludeOrg && baseRosters[o]);
  const coachCopies = {};
  orgs.forEach(org=>{ coachCopies[org] = baseRosters[org].coach; });
  function buffDe(nomeCoach){ return nomeCoach ? coachBuff(nomeCoach) : -1; }
  // Pontua um técnico candidato pra um time: o buff é a base, mas pesa também se o país dele
  // bate com a região do time (ou é vizinho), e sinergia com o elenco de jogadores do time.
  function pontuaCandidatoCoach(nomeCoach, orgAlvo){
    if(!nomeCoach) return -1;
    let pontos = buffDe(nomeCoach);
    const paisCoach = COACH_COUNTRY[nomeCoach.toLowerCase()];
    if(paisCoach){
      const regiaoDoPais = COUNTRY_TO_REGION[paisCoach];
      const fitCo = orgTransferFit(coachTransferPrefs(nomeCoach.toLowerCase()), orgAlvo);
      if(fitCo!==null){ if(fitCo>0) pontos += fitCo; else if(regiaoDoPais===regiao) pontos += 3; }
      else if(regiaoDoPais===regiao) pontos += 15;
      else if((ASCENSAO_REGION_PROXIMITY[regiao]||[]).includes(regiaoDoPais)) pontos += 6;
      const rosterDoTime = transferenciasDeJogadores && transferenciasDeJogadores[orgAlvo];
      if(rosterDoTime){
        const sinergia = rosterDoTime.filter(nomeJogador=>PLAYER_COUNTRY[nomeJogador.toLowerCase()]===paisCoach).length;
        pontos += sinergia;
      }
    }
    return pontos;
  }
  const RODADAS_DE_MERCADO = 1;
  for(let rodada=0; rodada<RODADAS_DE_MERCADO; rodada++){
    // Técnicos sem time (nunca escalados em nenhuma organização do jogo) também entram no
    // mercado como opção, igual os agentes livres de jogador.
    const jaEmAlgumTimeNoJogo = new Set(Object.values(baseRosters).filter(d=>d.coach).map(d=>d.coach.toLowerCase()));
    if(usadosGlobalmenteCoach) usadosGlobalmenteCoach.forEach(n=>jaEmAlgumTimeNoJogo.add(n.toLowerCase()));
    const agentesLivres = Object.keys(COACH_COUNTRY).filter(c=>!jaEmAlgumTimeNoJogo.has(c) && !ASCENSAO_EXCLUDED_COACHES.has(c));
    // Todo time libera o próprio técnico ao mesmo tempo — o mercado já nasce com opção pra
    // todo time, sem depender de ninguém trocar primeiro. Só uma parte dos times participa
    // de fato a cada temporada, igual o mercado de jogadores — reduz o volume de trocas.
    const CHANCE_PARTICIPAR_DO_MERCADO_COACH = 0.17;
    const orgsParticipandoCoach = orgs.filter(()=>Math.random()<CHANCE_PARTICIPAR_DO_MERCADO_COACH);
    const meuOriginal = {};
    orgsParticipandoCoach.forEach(org=>{ meuOriginal[org] = coachCopies[org]; });
    let mercado = [...orgsParticipandoCoach.map(org=>meuOriginal[org]).filter(Boolean), ...agentesLivres];
    shuffle(orgsParticipandoCoach).forEach(org=>{
      const meuAntigo = meuOriginal[org];
      const opcoes = shuffle(mercado.filter(c=>c!==meuAntigo)).sort((a,b)=>pontuaCandidatoCoach(b,org)-pontuaCandidatoCoach(a,org));
      const qualificados = opcoes.filter(c=>pontuaCandidatoCoach(c,org) > pontuaCandidatoCoach(meuAntigo,org)).slice(0,10);
      let contratado = null;
      if(qualificados.length>0){
        const pesos = qualificados.map((_,i)=>Math.sqrt(qualificados.length-i));
        const totalPeso = pesos.reduce((a,b)=>a+b,0);
        let sorteio = Math.random()*totalPeso;
        let idx = 0;
        while(idx<pesos.length-1 && sorteio>pesos[idx]){ sorteio -= pesos[idx]; idx++; }
        contratado = qualificados[idx];
      }
      if(contratado){
        coachCopies[org] = contratado;
        mercado = mercado.filter(c=>c!==contratado);
      } else if(mercado.includes(meuAntigo)){
        // ninguém levou meu técnico ainda — fica com o mesmo, sem risco.
        coachCopies[org] = meuAntigo;
        mercado = mercado.filter(c=>c!==meuAntigo);
      } else {
        // meu técnico original já foi levado por outro time antes de mim, e eu não achei
        // ninguém melhor — fico com quem sobrou no mercado (ou sem técnico, em último caso).
        const sobra = mercado[0] || null;
        coachCopies[org] = sobra;
        if(sobra) mercado = mercado.filter(c=>c!==sobra);
      }
    });
  }
  return coachCopies;
}
function simulateRegionalTransfers(regiao, excludeOrg, usadosGlobalmente){
  const baseRosters = (state.carreira && state.carreira.orgRostersSnapshot) || ASCENSAO_TEAM_ROSTERS;
  const orgs = territoryAllOrgs(regiao).filter(o=>o!==excludeOrg && baseRosters[o]);
  const rosterCopies = {};
  orgs.forEach(org=>{ rosterCopies[org] = [...baseRosters[org].players]; });
  const roles = ["duelist","flex","initiator","controller","sentinel"];
  function overallDe(nome){
    if(!nome) return -1;
    const p = poolGet(nome);
    return p ? p.overall : 80;
  }
  // Pontua um candidato pra uma vaga: overall é a base, mas pesa também se o país dele bate
  // com a região do time (ou é vizinho), e sinergia com quem já tá no elenco (mesmo país).
  function pontuaCandidato(nomeCandidato, restanteDoElenco, orgAlvo){
    const p = poolGet(nomeCandidato);
    let pontos = overallDe(nomeCandidato);
    if(!p) return pontos;
    const paisesCandidato = playerCountries(p.name);
    const regiaoDoPais = freeAgentRegion(p.name.toLowerCase());
    const fit = orgAlvo ? orgTransferFit(playerTransferPrefs(p.name.toLowerCase()), orgAlvo) : null;
    if(fit!==null){
      // circuito preferido pela nacionalidade (ex.: Europa/Turquia pra África e MENA)
      if(fit>0) pontos += fit;
      else if(regiaoDoPais===regiao) pontos += 3;
    } else if(regiaoDoPais===regiao) pontos += 15;
    else if((ASCENSAO_REGION_PROXIMITY[regiao]||[]).includes(regiaoDoPais)) pontos += 6;
    const sinergia = restanteDoElenco.filter(nomeColega=>{
      const pColega = poolGet(nomeColega);
      return pColega && playerCountries(pColega.name).some(pc=>paisesCandidato.includes(pc));
    }).length;
    pontos += sinergia * 1.5;
    return pontos;
  }
  // Preenche vagas em aberto (time com "null" no elenco fixo do banco) ANTES do mercado normal
  // rodar — simula o time contratando às pressas assim que a temporada/carreira começa, usando
  // a mesma pontuação de nacionalidade/proximidade/sinergia dos reforços normais.
  orgs.forEach(org=>{
    if(!rosterCopies[org].includes(null)) return;
    const jaEmAlgumTimeNoJogo = new Set([...Object.values(rosterCopies).flatMap(r=>r.filter(Boolean).map(n=>n.toLowerCase())), ...ascensaoReserveNames(baseRosters)]);
    if(usadosGlobalmente) usadosGlobalmente.forEach(n=>jaEmAlgumTimeNoJogo.add(n.toLowerCase()));
    const fixos = rosterCopies[org].filter(Boolean).map(n=>poolGet(n)).filter(Boolean);
    const nomesFixos = new Set(fixos.map(f=>f.name.toLowerCase()));
    const candidatosPontuados = POOL.filter(p=>!jaEmAlgumTimeNoJogo.has(p.name.toLowerCase()) && !ASCENSAO_EXCLUDED_PLAYERS.has(p.name.toLowerCase()) && !nomesFixos.has(p.name.toLowerCase()))
      .sort((a,b)=>pontuaCandidato(b.name, fixos.map(f=>f.name), org)-pontuaCandidato(a.name, fixos.map(f=>f.name), org));
    // embaralha só dentro do grupo dos melhores (top ~12) — mantém a prioridade geral por
    // nacionalidade/proximidade/sinergia, mas sem sempre montar a combinação idêntica.
    // não parceiros não contratam craque de elite pra preencher vaga (teto de overall 82)
    const tetoVaga = orgIsPartner(org) ? 99 : 82;
    const candidatosFiltrados = candidatosPontuados.filter(p=>p.overall<=tetoVaga);
    const candidatosBase = candidatosFiltrados.length>=20 ? candidatosFiltrados : candidatosPontuados;
    const topCandidatos = shuffle(candidatosBase.slice(0,12));
    const restoCandidatos = candidatosBase.slice(12);
    const candidatosOrdenados = [...topCandidatos, ...restoCandidatos];
    const completo = ascensaoForceRoster([...fixos, ...candidatosOrdenados.slice(0,40)]);
    if(completo.every(Boolean)) rosterCopies[org] = completo.map(p=>p.name);
  });
  // Elencos reais que não cobrem as 5 funções não conseguem "fechar" nenhuma troca; pra eles,
  // qualquer reforço vale (jogam fora de posição, igual na hora de montar o time).
  const coverableOrg = {};
  orgs.forEach(org=>{
    const objs = rosterCopies[org].filter(Boolean).map(n=>poolGet(n)).filter(Boolean);
    coverableOrg[org] = objs.length<5 || canCompleteRoster(roles, objs);
  });
  // Agentes livres — craques do banco que hoje não estão escalados em nenhum time — também
  // entram no mercado como opção de contratação. Recalculado a cada rodada (ver abaixo) pra
  // não oferecer de novo quem já foi contratado numa rodada anterior dessa mesma simulação.
  // Roda o mercado várias rodadas na mesma temporada — cada time pode tentar melhorar mais de
  // uma posição do elenco, não só uma.
  const RODADAS_DE_MERCADO = 1;
  for(let rodada=0; rodada<RODADAS_DE_MERCADO; rodada++){
    const jaEmAlgumTimeAgora = new Set(Object.values(rosterCopies).flat().filter(Boolean).map(n=>n.toLowerCase()));
    if(usadosGlobalmente) usadosGlobalmente.forEach(n=>jaEmAlgumTimeAgora.add(n.toLowerCase()));
    // Agentes livres de verdade — craques do banco que não estão em NENHUM elenco fixo do jogo,
    // atribuídos a essa região pela nacionalidade deles (playerRegionKey não serve aqui, porque
    // ele só reconhece quem já tem time — por definição, um agente livre nunca teria região).
    const todosOsEscaladosNoJogo = new Set([...Object.values(baseRosters).flatMap(d=>d.players.filter(Boolean).map(n=>n.toLowerCase())), ...ascensaoReserveNames(baseRosters)]);
    const agentesLivresDaRegiao = POOL.filter(p=>{
      if(todosOsEscaladosNoJogo.has(p.name.toLowerCase())) return false;
      if(jaEmAlgumTimeAgora.has(p.name.toLowerCase())) return false;
      if(ASCENSAO_EXCLUDED_PLAYERS.has(p.name.toLowerCase())) return false;
      return freeAgentRegion(p.name.toLowerCase()) === regiao;
    }).map(p=>p.name);
    // Passo 1: TODO time tira o craque mais fraco do próprio elenco ao mesmo tempo — fica uma
    // vaga temporária, e o craque vai pro mercado compartilhado (isso já resolve o "ninguém
    // consegue comprar primeiro porque o mercado começa vazio"). Agentes livres entram juntos.
    const vaga = {};
    let pool = [...agentesLivresDaRegiao];
    const CHANCE_LIBERAR_ALEATORIO = 0.2;
    const CHANCE_PARTICIPAR_DO_MERCADO = 0.78;
    const orgsParticipando = orgs.filter(()=>Math.random()<CHANCE_PARTICIPAR_DO_MERCADO);
    orgsParticipando.forEach(org=>{
      const elenco = rosterCopies[org].map((nome,idx)=>({nome, idx, overall:overallDe(nome)}));
      elenco.sort((a,b)=>a.overall-b.overall);
      // normalmente libera o craque mais fraco do time, mas às vezes (chance pequena) libera
      // um craque aleatório do elenco — exceto o MELHOR, pra não correr o risco dele ser
      // roubado e o time cair pra um reforço de emergência pior (troca sem sentido).
      const candidatosParaLiberar = elenco.slice(0, -1); // tira o melhor (ultimo, ja que esta ordenado crescente)
      // Craque "fora de lugar" (nacionalidade de uma região, jogando em time de outra) tem
      // prioridade alta pra ser liberado — representa ele querendo voltar a jogar mais perto
      // de casa. Não é garantido (senão o time nunca teria opção), só bem mais provável.
      const foraDeLugar = candidatosParaLiberar.filter(c=>{
        const fitC = orgTransferFit(playerTransferPrefs(c.nome.toLowerCase()), org);
        if(fitC!==null) return fitC===0;
        const regiaoDoCraque = freeAgentRegion(c.nome.toLowerCase());
        return regiaoDoCraque && regiaoDoCraque!==regiao;
      });
      let liberado;
      if(foraDeLugar.length>0 && Math.random()<0.7){
        liberado = foraDeLugar[Math.floor(Math.random()*foraDeLugar.length)];
      } else {
        liberado = (Math.random() < CHANCE_LIBERAR_ALEATORIO && candidatosParaLiberar.length>0)
          ? candidatosParaLiberar[Math.floor(Math.random()*candidatosParaLiberar.length)]
          : elenco[0];
      }
      vaga[org] = liberado;
      pool.push(liberado.nome);
      rosterCopies[org][vaga[org].idx] = null; // vaga temporária
    });
    // Passo 2: cada time (ordem aleatória) tenta contratar o MELHOR disponível no mercado
    // (de qualquer outro time ou agente livre), pesando nacionalidade/proximidade/sinergia.
    // Se não achar ninguém que sirva, o próprio craque volta pro time de origem.
    shuffle(orgsParticipando).forEach(org=>{
      const restanteDoElenco = rosterCopies[org].filter(Boolean);
      const opcoes = shuffle(pool.filter(n=>n!==vaga[org].nome)).sort((a,b)=>pontuaCandidato(b,restanteDoElenco,org)-pontuaCandidato(a,restanteDoElenco,org));
      // Junta os primeiros candidatos que REALMENTE fecham o time (cobrem as 5 funções) e
      // sorteia entre eles com peso maior pros melhores — assim o mercado ainda respeita
      // nacionalidade/proximidade/sinergia (quem pontua mais tem mais chance), mas não repete
      // sempre o mesmo "candidato perfeito" toda vez que rodar de novo.
      const validos = [];
      // não troca um craque do circuito certo por alguém de fora da preferência de circuito dele
      const fitLiberado = orgTransferFit(playerTransferPrefs(vaga[org].nome.toLowerCase()), org);
      for(const candidato of opcoes){
        if(fitLiberado>0 && Math.random()<0.7 && orgTransferFit(playerTransferPrefs(candidato.toLowerCase()), org)===0) continue;
        const tentativa = [...rosterCopies[org]];
        tentativa[vaga[org].idx] = candidato;
        const rosterObjs = tentativa.map(n=>n && poolGet(n)).filter(Boolean);
        if(rosterObjs.length===5 && (canCompleteRoster(roles, rosterObjs) || !coverableOrg[org])){
          validos.push(candidato);
          if(validos.length>=10) break;
        }
      }
      let contratado = null;
      if(validos.length>0){
        const pesos = validos.map((_,i)=>Math.sqrt(validos.length-i));
        const totalPeso = pesos.reduce((a,b)=>a+b,0);
        let sorteio = Math.random()*totalPeso;
        let idx = 0;
        while(idx<pesos.length-1 && sorteio>pesos[idx]){ sorteio -= pesos[idx]; idx++; }
        contratado = validos[idx];
        rosterCopies[org][vaga[org].idx] = contratado;
      }
      if(contratado){
        pool = pool.filter(n=>n!==contratado);
      } else if(pool.includes(vaga[org].nome)){
        // ninguém comprou o meu craque liberado ainda — volta pro time de origem, sem risco.
        rosterCopies[org][vaga[org].idx] = vaga[org].nome;
        pool = pool.filter(n=>n!==vaga[org].nome);
      } else {
        // meu craque liberado JÁ foi comprado por outro time antes de mim, e eu não achei
        // ninguém no mercado que sirva — busco um reforço de emergência fora do mercado atual
        // (na região, excluindo quem já está escalado em qualquer time) pra não ficar com
        // buraco nem duplicar o craque que já foi embora de verdade.
        const jaEscalados = new Set([...Object.values(rosterCopies).flat().filter(Boolean).map(n=>n.toLowerCase()), ...ascensaoReserveNames(baseRosters)]);
        if(excludeOrg && baseRosters[excludeOrg]) baseRosters[excludeOrg].players.filter(Boolean).forEach(n=>jaEscalados.add(n.toLowerCase()));
        if(usadosGlobalmente) usadosGlobalmente.forEach(n=>jaEscalados.add(n.toLowerCase()));
        ASCENSAO_EXCLUDED_PLAYERS.forEach(n=>jaEscalados.add(n));
        const emergencia = shuffle(POOL.filter(p=>!jaEscalados.has(p.name.toLowerCase())))
          .sort((a,b)=>pontuaCandidato(b.name, restanteDoElenco, org)-pontuaCandidato(a.name, restanteDoElenco, org));
        const validosEmergencia = [];
        for(const cand of emergencia){
          const tentativa = [...rosterCopies[org]];
          tentativa[vaga[org].idx] = cand.name;
          const rosterObjs = tentativa.map(n=>n && poolGet(n)).filter(Boolean);
          if(rosterObjs.length===5 && (canCompleteRoster(roles, rosterObjs) || !coverableOrg[org])){
            validosEmergencia.push(cand.name);
            if(validosEmergencia.length>=10) break;
          }
        }
        if(validosEmergencia.length>0){
          const pesos = validosEmergencia.map((_,i)=>Math.sqrt(validosEmergencia.length-i));
          const totalPeso = pesos.reduce((a,b)=>a+b,0);
          let sorteio = Math.random()*totalPeso;
          let idx = 0;
          while(idx<pesos.length-1 && sorteio>pesos[idx]){ sorteio -= pesos[idx]; idx++; }
          rosterCopies[org][vaga[org].idx] = validosEmergencia[idx];
        }
      }
    });
  }
  return rosterCopies;
}
