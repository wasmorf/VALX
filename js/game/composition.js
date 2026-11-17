/* ==========================================================
   composition.js — Bônus e penalidades de composição de time
   ========================================================== */

/* ---------------- COMPOSITION BUFFS/NERFS ---------------- */
// Acha o jogador que ocupa uma função no time. Se "isSlotted" (nosso próprio time, sempre
// organizado por SLOT_ORDER), usa a vaga exata; se não (times de IA, sem vaga fixa), pega o
// primeiro jogador do elenco que consegue jogar naquela função.
function findRolePlayer(roster, roleKey, isSlotted){
  if(!roster || !roster.length) return null;
  if(isSlotted){
    const idx = SLOT_ORDER.indexOf(roleKey);
    return roster[idx] || null;
  }
  return roster.find(p=>p.roles && p.roles.includes(roleKey)) || null;
}
function hasTag(p, tag){ return !!(p && p.tags && p.tags.includes(tag)); }

// Calcula o bônus/penalidade de composição do time, separado em ataque e defesa.
// Entry empurra mais no ataque; Operator empurra mais na defesa (conforme pedido).
function compositionBonus(roster, isSlotted){
  if(!roster || !roster.length) return {attack:0, defense:0};
  let attack = 0, defense = 0;

  const duelist = findRolePlayer(roster, "duelist", isSlotted);
  const sentinel = findRolePlayer(roster, "sentinel", isSlotted);
  const initiator = findRolePlayer(roster, "initiator", isSlotted);

  // Duelista + Iniciador na equipe -> buff de ataque
  if(duelist && initiator) attack += 2;

  // Duelista + Iniciador do MESMO país, ou que já foram campeões mundiais juntos (mesmo elenco
  // real) -> buff extra geral, em cima do buff normal de tê-los os dois no time.
  if(duelist && initiator){
    const dCountries = [PLAYER_COUNTRY[duelist.name.toLowerCase()], PLAYER_RESIDENCE[duelist.name.toLowerCase()]].flat().filter(Boolean);
    const iCountries = [PLAYER_COUNTRY[initiator.name.toLowerCase()], PLAYER_RESIDENCE[initiator.name.toLowerCase()]].flat().filter(Boolean);
    const sameCountry = dCountries.some(c=>iCountries.includes(c));
    const dTeams = PLAYER_TEAM[duelist.name.toLowerCase()] || [];
    const iTeams = PLAYER_TEAM[initiator.name.toLowerCase()] || [];
    const alreadyChampionsTogether = dTeams.some(tm=>iTeams.includes(tm));
    if(sameCountry || alreadyChampionsTogether){ attack += 2; defense += 2; }
    if(sameCountry && alreadyChampionsTogether){ attack += 1; defense += 1; } // os dois ao mesmo tempo: um pouco a mais
  }

  // Operator no Duelista/Sentinela: 1 usuário = buff na defesa; os 2 ao mesmo tempo = nerf geral
  const opUsers = [duelist, sentinel].filter(p=>hasTag(p,"operator")).length;
  if(opUsers===1) defense += 3;
  else if(opUsers===2){ attack -= 2; defense -= 2; }

  // 2+ jogadores com clutch = buff geral
  const clutchCount = roster.filter(p=>hasTag(p,"clutch")).length;
  if(clutchCount>=2){ attack += 2; defense += 2; }

  // IGL: nenhum = nerf sempre; 1 ou 2 = buff (time bem liderado); 3+ = nerf (líderes demais
  // atrapalhando um ao outro), EXCETO em Seleções da Copa do Mundo (lá não pune o excesso).
  const iglCount = roster.filter(p=>hasTag(p,"igl")).length;
  const selecaoKey = rosterSelecaoKey(roster);
  if(iglCount===0){ attack -= 3; defense -= 3; }
  else if(iglCount===1 || iglCount===2){ attack += 2; defense += 2; }
  else if(iglCount>=3 && !selecaoKey){ attack -= 2; defense -= 2; }

  // Seleção "mista" (combinada de vários países, tipo Finlândia/Suécia) leva um nerf leve —
  // o entrosamento de uma seleção de país único é sempre um pouco melhor.
  if(selecaoKey && selecaoKey.includes("/")){ attack -= 1.5; defense -= 1.5; }

  // Cobertura das 5 funções (no nosso sistema de vagas isso é sempre verdade, mas fica a checagem)
  if(isSlotted && SLOT_ORDER.some((rk,i)=>!roster[i])){ attack -= 4; defense -= 4; }

  // Campeões Mundiais: quanto mais, mais buff
  const championCount = roster.filter(p=>hasTag(p,"campeao_mundial")).length;
  attack += championCount*1.5; defense += championCount*1.5;

  // Entry no Duelista: buff se tiver, nerf se não tiver
  if(duelist){
    attack += hasTag(duelist,"entry") ? 2 : -2;
  }

  // Utilidade: quanto mais, melhor — buff cresce direto com a quantidade, sem teto e sem nerf.
  const utilCount = roster.filter(p=>hasTag(p,"utility")).length;
  if(utilCount>0){
    const bonus = utilCount*1.5;
    attack += bonus; defense += bonus;
  }

  // Lurker no Sentinela: buff se tiver, nerf se não tiver
  if(sentinel){
    if(hasTag(sentinel,"lurker")){ attack += 2; defense += 2; }
    else { attack -= 1.5; defense -= 1.5; }
  }
  // Exceção: C0M dá o buff de Lurker mesmo fora da Sentinela (não depende da função dele).
  const lurkerExceptionNames = ["c0m"];
  const lurkerException = roster.find(p=>p!==sentinel && lurkerExceptionNames.includes(p.name.toLowerCase()) && hasTag(p,"lurker"));
  if(lurkerException){ attack += 2; defense += 2; }

  // Mira Monstra: quanto mais jogadores com a tag, mais buff (sem teto)
  const mmCount = roster.filter(p=>hasTag(p,"mm")).length;
  attack += mmCount*1.5; defense += mmCount*1.5;

  return {attack, defense};
}
