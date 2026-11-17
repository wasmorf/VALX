/* ==========================================================
   chemistry.js — Química entre jogadores e técnicos, buff de técnico
   ========================================================== */

// Sinergia: quanto mais craques do MESMO time real (vlr.gg) ou do MESMO país estiverem juntos na
// equipe, maior o buff — e o Head Coach também entra nessa conta (país em comum com os jogadores,
// ou já ter trabalhado com o mesmo time real que algum craque do elenco). Cobertura de dados é
// parcial; quem não tem país/time confirmado simplesmente não conta pra essa sinergia.
function playerCountries(name){
  const lc = name.toLowerCase();
  return [PLAYER_COUNTRY[lc], PLAYER_RESIDENCE[lc]].flat().filter(Boolean);
}
// Alguns países sempre contam como "o mesmo" pra sinergia (mesmo sem ninguém marcar residência
// manualmente) — por enquanto só Canadá e EUA, já que são culturalmente muito próximos e
// competem na mesma região (NA). Funciona pra qualquer craque desses países, atual ou futuro.
const COUNTRY_SYNERGY_GROUP = { US:"NA_SYNERGY", CA:"NA_SYNERGY" };
function normalizeSynergyCountry(code){ return COUNTRY_SYNERGY_GROUP[code] || code; }
function chemistryBonus(roster, coachName){
  if(!roster || roster.length<2) return 0;
  const countryLists = roster.map(p=>playerCountries(p.name).map(normalizeSynergyCountry));
  const teamLists = roster.map(p=>PLAYER_TEAM[p.name.toLowerCase()] || []);
  function countExtraPairs(list){
    const counts = {};
    list.forEach(v=>{ counts[v]=(counts[v]||0)+1; });
    let extra = 0;
    Object.values(counts).forEach(n=>{ if(n>=2) extra += (n-1); }); // 2 juntos=+1, 3 juntos=+2, etc.
    return extra;
  }
  const countryPairs = countExtraPairs(countryLists.flat());
  const teamPairs = countExtraPairs(teamLists.flat());
  return countryPairs*0.75 + teamPairs*1.5 + coachChemistry(roster, coachName);
}
function coachChemistry(roster, coachName){
  let coachBonus = 0;
  if(coachName){
    const residenciaCoach = COACH_RESIDENCE[coachName.toLowerCase()];
    const residenciasCoach = Array.isArray(residenciaCoach) ? residenciaCoach : [residenciaCoach];
    const ccList = [COACH_COUNTRY[coachName.toLowerCase()], ...residenciasCoach].filter(Boolean).map(normalizeSynergyCountry);
    const ct = COACH_TEAM[coachName.toLowerCase()];
    const ctRegional = COACH_REGIONAL_CHAMPION[coachName.toLowerCase()];
    if(ccList.length) coachBonus += roster.filter(p=>playerCountries(p.name).map(normalizeSynergyCountry).some(c=>ccList.includes(c))).length * 0.75;
    if(ct) coachBonus += roster.filter(p=>(PLAYER_TEAM[p.name.toLowerCase()]||[]).includes(ct)).length * 1.5;
    if(ctRegional) coachBonus += roster.filter(p=>(PLAYER_TEAM[p.name.toLowerCase()]||[]).includes(ctRegional)).length * 1.5;
  }
  return coachBonus; // já ter jogado junto pesa bem mais que só ser do mesmo país
}
// Assistant Coach: soma metade do buff e da química de um HC.
function assistantBuff(roster, acName){
  if(!acName) return 0;
  return 0.5*(coachBuff(acName) + coachChemistry(roster, acName));
}
// Técnico Campeão Mundial (está no COACH_TEAM) dá um bônus extra de +2, além do buff normal dele.
function coachBuff(coachName){
  if(!coachName) return 0;
  const chaveExata = coachName in COACH_BUFFS ? coachName : Object.keys(COACH_BUFFS).find(k=>k.toLowerCase()===coachName.toLowerCase());
  let b = chaveExata!==undefined ? COACH_BUFFS[chaveExata] : 0;
  if(COACH_TEAM[coachName.toLowerCase()]) b += 2;
  if(COACH_REGIONAL_CHAMPION[coachName.toLowerCase()]) b += ASCENSAO_REGIONAL_CHAMPION_BONUS;
  if(state.difficulty==="ascensao" && state.carreira){
    const nomeLower = coachName.toLowerCase();
    if((state.carreira.campeoesMundiaisCoach||[]).some(n=>n.toLowerCase()===nomeLower)) b += ASCENSAO_CHAMPION_BONUS;
    if((state.carreira.campeoesRegionaisCoach||[]).some(n=>n.toLowerCase()===nomeLower)) b += ASCENSAO_REGIONAL_CHAMPION_BONUS;
  }
  return b;
}
// Técnicos de uma Seleção: os cadastrados + qualquer técnico do banco com a nacionalidade dela.
function selecaoCoaches(nacao){
  if(!WC_SELECOES[nacao]) return [];
  const extras = COACHES.filter(c=>{
    const code = COACH_COUNTRY[c.toLowerCase()];
    return code && WC_COUNTRY_TO_SELECAO[code]===nacao;
  });
  return [...new Set([...WC_SELECOES[nacao].coaches, ...extras])];
}
// Entre os HCs disponíveis de uma Seleção, escolhe sempre o melhor (maior coachBuff) — se tiver
// só uma opção, é essa mesmo; com mais de uma, nunca fica preso na primeira da lista à toa.
function bestSelecaoCoach(nacao){
  const coaches = selecaoCoaches(nacao);
  if(!coaches || !coaches.length) return null;
  if(coaches.length===1) return coaches[0];
  return [...coaches].sort((a,b)=>coachBuff(b)-coachBuff(a))[0];
}
