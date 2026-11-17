/* ==========================================================
   formats.js — Formatos de torneio, chaves e recordes
   ========================================================== */

// Topologia do chaveamento de playoffs (8 times, dupla eliminação — Upper/Lower).
// Config do formato Regional por região: quantos grupos, tamanho de cada grupo,
// quantos classificam por grupo, e o tamanho do chaveamento de playoffs.
const REGIONAL_FORMAT = {
  AMERICAS: {groups:2, groupSize:4, qualifiersPerGroup:2, playoffSize:4},
  EMEA:     {groups:2, groupSize:4, qualifiersPerGroup:2, playoffSize:4},
  PACIFIC:  {groups:2, groupSize:4, qualifiersPerGroup:2, playoffSize:4},
  CN:       {groups:2, groupSize:4, qualifiersPerGroup:2, playoffSize:4},
};
// Formato dos eventos de território no Rumo à Ascensão (Kickoff/Cups): 12 times — 8 parceiros +
// 4 vindos do qualifier —, 2 grupos de 6 (turno único) e playoffs de 6 times em dupla eliminação.
const ASCENSAO_TERRITORY_FORMAT = {groups:2, groupSize:6, qualifiersPerGroup:3, playoffSize:6, single:true};
const ASCENSAO_TERRITORY_SLOTS = 12;

// Chaveamento de eliminação dupla com 4 times (mesma lógica do GROUP_BRACKET_DEF, só que
// termina numa Grande Final de verdade em vez de só gerar 2 classificados).
const FOUR_TEAM_BRACKET_DEF = [
  {id:"m1", round:1, aFrom:{seed:0}, bFrom:{seed:3}, labelKey:"ubR1"},
  {id:"m2", round:1, aFrom:{seed:1}, bFrom:{seed:2}, labelKey:"ubR1"},
  {id:"m3", round:2, aFrom:{m:"m1",res:"w"}, bFrom:{m:"m2",res:"w"}, labelKey:"ubFinal"},
  {id:"m4", round:2, aFrom:{m:"m1",res:"l"}, bFrom:{m:"m2",res:"l"}, labelKey:"lbR1"},
  {id:"m5", round:3, aFrom:{m:"m4",res:"w"}, bFrom:{m:"m3",res:"l"}, labelKey:"lbFinal"},
  {id:"m6", round:4, aFrom:{m:"m3",res:"w"}, bFrom:{m:"m5",res:"w"}, labelKey:"grandFinal"},
];

// Chaveamento de eliminação dupla com 6 times: 1º e 2º colocado jogam a upper bracket
// (1º de um grupo enfrenta o 2º do outro), enquanto o 3º colocado de cada grupo já entra
// direto na lower bracket, esperando o perdedor da primeira rodada da upper pra continuar.
const SIX_TEAM_BRACKET_DEF = [
  {id:"m1", round:1, aFrom:{seed:0}, bFrom:{seed:3}, labelKey:"ubR1"},
  {id:"m2", round:1, aFrom:{seed:1}, bFrom:{seed:2}, labelKey:"ubR1"},
  {id:"m3", round:2, aFrom:{m:"m1",res:"w"}, bFrom:{m:"m2",res:"w"}, labelKey:"ubFinal"},
  {id:"m4", round:2, aFrom:{m:"m1",res:"l"}, bFrom:{seed:5}, labelKey:"lbR1"},
  {id:"m5", round:2, aFrom:{m:"m2",res:"l"}, bFrom:{seed:4}, labelKey:"lbR1"},
  {id:"m6", round:3, aFrom:{m:"m4",res:"w"}, bFrom:{m:"m5",res:"w"}, labelKey:"lbSemi"},
  {id:"m7", round:4, aFrom:{m:"m6",res:"w"}, bFrom:{m:"m3",res:"l"}, labelKey:"lbFinal"},
  {id:"m8", round:5, aFrom:{m:"m3",res:"w"}, bFrom:{m:"m7",res:"w"}, labelKey:"grandFinal"},
];

// Gera a tabela de turno e returno (todo mundo enfrenta todo mundo 2x) pelo método do círculo.
// Retorna uma lista de "rodadas", cada rodada é uma lista de confrontos [timeA, timeB].
function roundRobinSchedule(teams, single){
  let list = teams.slice();
  if(list.length % 2 !== 0) list.push(null); // bye fantasma se for ímpar
  const n = list.length;
  const turno = [];
  for(let r=0; r<n-1; r++){
    const rodada = [];
    for(let i=0; i<n/2; i++){
      const a = list[i], b = list[n-1-i];
      if(a && b) rodada.push([a,b]);
    }
    turno.push(rodada);
    list = [list[0], ...list.slice(2), list[1]];
  }
  return single ? turno : [...turno, ...turno]; // returno = repete a mesma tabela (turno e returno)
}
// Conta a rodada como "1, 2, 3..." só contando as rodadas em que o jogador realmente joga —
// ignora as rodadas de folga (que existem quando o grupo tem número ímpar de times).
function regionalPlayerRoundNumber(schedule, roundIdx){
  let atual = 0, total = 0;
  schedule.forEach((rodada, i)=>{
    const jogaNessaRodada = rodada.some(([a,b])=>a.isPlayer || b.isPlayer);
    if(jogaNessaRodada){
      total++;
      if(i<=roundIdx) atual = total;
    }
  });
  return {atual, total};
}

const BRACKET_DEF = [
  {id:"m1",  round:1, aFrom:{seed:0}, bFrom:{seed:7}, labelKey:"ubR1"},
  {id:"m2",  round:1, aFrom:{seed:3}, bFrom:{seed:4}, labelKey:"ubR1"},
  {id:"m3",  round:1, aFrom:{seed:2}, bFrom:{seed:5}, labelKey:"ubR1"},
  {id:"m4",  round:1, aFrom:{seed:1}, bFrom:{seed:6}, labelKey:"ubR1"},
  {id:"m5",  round:2, aFrom:{m:"m1",res:"w"}, bFrom:{m:"m2",res:"w"}, labelKey:"ubSemi"},
  {id:"m6",  round:2, aFrom:{m:"m3",res:"w"}, bFrom:{m:"m4",res:"w"}, labelKey:"ubSemi"},
  {id:"m7",  round:2, aFrom:{m:"m1",res:"l"}, bFrom:{m:"m4",res:"l"}, labelKey:"lbR1"},
  {id:"m8",  round:2, aFrom:{m:"m2",res:"l"}, bFrom:{m:"m3",res:"l"}, labelKey:"lbR1"},
  {id:"m9",  round:3, aFrom:{m:"m7",res:"w"}, bFrom:{m:"m6",res:"l"}, labelKey:"lbR2"},
  {id:"m10", round:3, aFrom:{m:"m8",res:"w"}, bFrom:{m:"m5",res:"l"}, labelKey:"lbR2"},
  {id:"m11", round:4, aFrom:{m:"m5",res:"w"}, bFrom:{m:"m6",res:"w"}, labelKey:"ubFinal"},
  {id:"m12", round:4, aFrom:{m:"m9",res:"w"}, bFrom:{m:"m10",res:"w"}, labelKey:"lbSemi"},
  {id:"m13", round:5, aFrom:{m:"m11",res:"l"}, bFrom:{m:"m12",res:"w"}, labelKey:"lbFinal"},
  {id:"m14", round:6, aFrom:{m:"m11",res:"w"}, bFrom:{m:"m13",res:"w"}, labelKey:"grandFinal"},
];
const LB_KEYS = ["lbR1","lbR2","lbSemi","lbFinal"];
// Recordes reais de abates no cenário profissional do VALORANT (referência do usuário).
const RECORDS = { singleMap: 47, md3: 82, md5: 126 };
