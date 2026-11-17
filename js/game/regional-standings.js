/* ==========================================================
   regional-standings.js — Tabela de pontos corridos do modo Regional
   ========================================================== */

// ===== Modo Regional: grupos de pontos corridos (turno e returno) + playoffs menores =====
function initRegionalStandings(teams){
  const st = {};
  teams.forEach(tm=>{ st[tm.id] = {team:tm, points:0, wins:0, losses:0, roundsWon:0, roundsLost:0}; });
  return st;
}
// Vitória = 2 pontos, derrota = 1 ponto (ninguém fica a zero). Desempate por saldo de rounds.
function registrarResultadoGrupoRegional(standings, teamA, teamB, resultado, roundsA, roundsB){
  const sA = standings[teamA.id], sB = standings[teamB.id];
  if(resultado.winner===teamA){ sA.points+=2; sA.wins++; sB.points+=1; sB.losses++; }
  else { sB.points+=2; sB.wins++; sA.points+=1; sA.losses++; }
  sA.roundsWon += roundsA; sA.roundsLost += roundsB;
  sB.roundsWon += roundsB; sB.roundsLost += roundsA;
}
function rankRegionalGroup(standings){
  return Object.values(standings).sort((a,b)=>
    b.points - a.points || (b.roundsWon-b.roundsLost) - (a.roundsWon-a.roundsLost) || b.team.rating-a.team.rating
  );
}
