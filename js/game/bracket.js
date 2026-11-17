/* ==========================================================
   bracket.js — Chaves eliminatórias e avanço do torneio
   ========================================================== */

// Verifica se o craque já jogou (mesmo time real, vlr.gg) com alguém já escalado no time,
// ou se já foi treinado pelo Head Coach escolhido — vale mesmo no primeiro sorteio.
function teammateSynergyNote(candidate){
  const ct = PLAYER_TEAM[candidate.name.toLowerCase()] || [];
  if(ct.length===0) return null;
  const names = state.roster.filter(Boolean).filter(p=>{
    const pt = PLAYER_TEAM[p.name.toLowerCase()] || [];
    return pt.some(t=>ct.includes(t));
  }).map(p=>p.name);
  if(state.headCoach){
    const coachTeam = COACH_TEAM[state.headCoach.toLowerCase()];
    const coachTeamRegional = COACH_REGIONAL_CHAMPION[state.headCoach.toLowerCase()];
    if((coachTeam && ct.includes(coachTeam)) || (coachTeamRegional && ct.includes(coachTeamRegional))) names.push(state.headCoach);
  }
  if(names.length===0) return null;
  return names.join(", ");
}

function currentOpponent(){
  const tr = state.tournament;
  if(!tr) return null;
  if(tr.stage==="regionalGroups" && tr.regionalGroups.myGroup.pending){
    const p = tr.regionalGroups.myGroup.pending;
    return p.teamA.isPlayer ? p.teamB : p.teamA;
  }
  if(tr.stage==="groups" && tr.groupBracket && tr.groupBracket.pending){
    const p = tr.groupBracket.pending;
    return p.teamA.isPlayer ? p.teamB : p.teamA;
  }
  if(tr.stage==="playoffs" && tr.bracket && tr.bracket.pending){
    const p = tr.bracket.pending;
    return p.teamA.isPlayer ? p.teamB : p.teamA;
  }
  return null;
}

// No Rumo à Ascensão, mostra "Temporada X · Competição · " antes do resto do cabeçalho,
// pra saber sempre em que competição e temporada você está durante a partida ao vivo.
function ascensaoContextPrefix(){
  if(state.difficulty!=="ascensao" || !state.tournament || !state.carreira) return "";
  const fase = state.tournament.ascensaoPhase;
  const nomeCompeticao = fase==="qualifierLC" ? ascensaoStageName("ql_"+state.tournament.ascensaoStageKey) : fase==="qualifier" ? ascensaoStageName("q_"+state.tournament.ascensaoStageKey)
    : (fase==="regional" || fase==="masters") ? ascensaoStageName(state.tournament.ascensaoStageKey)
    : fase==='mundial' ? 'Champions'
    : fase==="worldcup" ? t("ascensaoWorldCupLabel")
    : fase==="encQualifier" ? t("ascensaoWorldCupLabel")
    : "";
  return `${t("ascensaoSeasonLabel")(state.carreira.temporada)} · ${nomeCompeticao} · `;
}
function contextLabel(){
  const tr = state.tournament;
  if(!tr) return "";
  const prefix = ascensaoContextPrefix() + encQualifierPrefix();
  if(tr.stage==="regionalGroups"){
    const g = tr.regionalGroups.myGroup;
    const roundLabel = g.pending ? t("regionalRoundLabel")(regionalPlayerRoundNumber(g.schedule, g.pending.roundIdx).atual, regionalPlayerRoundNumber(g.schedule, g.pending.roundIdx).total) : "";
    return `${prefix}${t("groupStageTag")} · ${t("groupWord")} ${tr.myGroupLetter}${roundLabel ? " · "+roundLabel : ""}`;
  }
  if(tr.stage==="groups"){
    const roundLabel = tr.groupBracket && tr.groupBracket.pending ? bracketLabel(tr.groupBracket.pending.def.labelKey) : "";
    return `${prefix}${t("groupStageTag")} · ${t("groupWord")} ${tr.encGroupLetter||"A"}${roundLabel ? " · "+roundLabel : ""}`;
  }
  if(tr.stage==="playoffs" && tr.bracket && tr.bracket.pending){
    return `${prefix}${t("playoffsTag")} · ${bracketLabel(tr.bracket.pending.def.labelKey)}`;
  }
  return `${prefix}${t("playoffsTag")}`;
}

function resolveBracketTeam(fromDef, bracket){
  if(fromDef.seed!==undefined) return bracket.seeds[fromDef.seed];
  const m = bracket.matches[fromDef.m];
  return fromDef.res==="w" ? m.winner : m.loser;
}

// Os qualifiers chegam intercalados por grupo: [Aupper,Alower,Bupper,Blower,Cupper,Clower,...].
// Mantendo essa ordem de grupo (em vez de reordenar tudo por rating), o BRACKET_DEF garante
// que upper sempre enfrenta lower de OUTRO grupo na primeira rodada — nunca uma repetição do
// mesmo grupo que já se enfrentou na fase de grupos.
function buildPlayoffBracket(qualifiers, bracketDef){
  const def = bracketDef || BRACKET_DEF;
  const uppers = qualifiers.filter((q,i)=>i%2===0);
  const lowers = qualifiers.filter((q,i)=>i%2===1);
  const seeds = [...uppers, ...lowers];
  const matches = {};
  def.forEach(d=>{ matches[d.id] = {winner:null, loser:null}; });
  state.tournament.bracket = { seeds, matches, pointerIdx:0, pending:null, def };
  state.tournament.stage = "playoffs";
}

// Igual ao buildPlayoffBracket, mas recebe os seeds já na ordem final (usado no modo Regional,
// onde a ordem de classificação já vem dos grupos de pontos corridos, não de winner/runnerup).
function buildPlayoffBracketSeeded(seeds, bracketDef){
  const matches = {};
  bracketDef.forEach(d=>{ matches[d.id] = {winner:null, loser:null}; });
  state.tournament.bracket = { seeds, matches, pointerIdx:0, pending:null, def:bracketDef };
  state.tournament.stage = "playoffs";
}

// Processa o mini-chaveamento do grupo automaticamente até chegar numa partida do jogador.
function advanceGroupBracket(){
  const tr = state.tournament;
  if(tr.stage!=="groups") return;
  const brk = tr.groupBracket;
  brk.pending = null;
  while(brk.pointerIdx < GROUP_BRACKET_DEF.length){
    const def = GROUP_BRACKET_DEF[brk.pointerIdx];
    const teamA = resolveBracketTeam(def.aFrom, brk);
    const teamB = resolveBracketTeam(def.bFrom, brk);
    if(teamA.isPlayer || teamB.isPlayer){
      brk.pending = {def, teamA, teamB};
      startMatch(2); // fase de grupos é sempre MD3
      return;
    }
    brk.matches[def.id] = decideMatchWinner(teamA, teamB, 2);
    brk.pointerIdx++;
  }
}
// Termina de resolver (só IA) o que sobrou do mini-chaveamento do grupo, sem pausar.
function finishGroupBracketAI(){
  const brk = state.tournament.groupBracket;
  while(brk.pointerIdx < GROUP_BRACKET_DEF.length){
    const def = GROUP_BRACKET_DEF[brk.pointerIdx];
    const teamA = resolveBracketTeam(def.aFrom, brk);
    const teamB = resolveBracketTeam(def.bFrom, brk);
    brk.matches[def.id] = decideMatchWinner(teamA, teamB, 2);
    brk.pointerIdx++;
  }
}

// Processa partidas automaticamente até chegar numa partida do jogador, ou até o torneio terminar.
function advanceTournament(){
  const tr = state.tournament;
  if(tr.stage!=="playoffs") return;
  const brk = tr.bracket;
  const def = brk.def || BRACKET_DEF;
  brk.pending = null;
  while(brk.pointerIdx < def.length){
    const d = def[brk.pointerIdx];
    const teamA = resolveBracketTeam(d.aFrom, brk);
    const teamB = resolveBracketTeam(d.bFrom, brk);
    if(teamA.isPlayer || teamB.isPlayer){
      brk.pending = {def:d, teamA, teamB};
      startMatch(matchFormatFor(d.labelKey));
      return;
    }
    const {winner, loser} = decideMatchWinner(teamA, teamB, matchFormatFor(d.labelKey));
    brk.matches[d.id] = {winner, loser};
    brk.pointerIdx++;
  }
  // chaveamento concluído sem mais partidas do jogador pendentes
  const finalMatch = brk.matches[def[def.length-1].id];
  ascensaoOrFinalize(finalMatch.winner.isPlayer ? {type:"champion"} : {type:"runnerup"});
}
