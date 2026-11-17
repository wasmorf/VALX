/* ==========================================================
   persistence-share.js — Histórico salvo e texto de compartilhamento
   ========================================================== */

function finalizeCampaign(){
  state.screen = "end";
  saveCampaignRecord();
}
async function saveCampaignRecord(){
  try{
    const info = state.endInfo || {type:"groups"};
    const wins = state.journey.filter(j=>j.result==="W").length;
    const losses = state.journey.filter(j=>j.result==="L").length;
    const mvp = info.type==="champion" ? getMVP() : null;
    const record = {
      date: new Date().toISOString(),
      resultType: info.type,
      stageLabelKey: info.stageLabelKey || null,
      teamName: state.teamName,
      headCoach: state.headCoach,
      difficulty: state.difficulty,
      regionalRegiao: state.regionalRegiao || null,
      overall: teamOverall(state.roster),
      record: `${wins}V-${losses}D`,
      roster: state.roster.map((p,i)=>({name:p.name, role:SLOT_ORDER[i]})),
      mvpName: mvp ? mvp.name : null,
    };
    const raw = await storageGetValue("campaign_history");
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    if(list.length>50) list.length = 50; // guarda só as 50 mais recentes
    await storageSetValue("campaign_history", JSON.stringify(list));
  } catch(e){ /* armazenamento indisponível — segue o jogo normalmente */ }
}
// Salva o resumo de uma carreira COMPLETA do Rumo à Ascensão em "Campanhas Anteriores" —
// mesmo histórico compartilhado dos outros modos, só que com um formato de registro próprio.
async function saveAscensaoCareerRecord(){
  try{
    const c = state.carreira;
    const regionalTitles = c.historico.reduce((n,h)=>n+ascensaoRegionalTitleCount(h),0);
    const mundialTitles = c.historico.filter(h=>h.mundialResultado==="champion").length;
    const copaTitles = c.historico.filter(h=>h.copaResultado==="champion").length;
    const record = {
      date: new Date().toISOString(),
      resultType: "ascensao",
      difficulty: "ascensao",
      teamName: c.time,
      headCoach: null,
      overall: ascensaoCharacterOverall(),
      record: `16 temporadas`,
      roster: null,
      mvpName: null,
      ascensaoNome: c.nome,
      ascensaoNacionalidade: c.nacionalidade,
      ascensaoMundialTitles: mundialTitles,
      ascensaoRegionalTitles: regionalTitles,
      ascensaoCopaTitles: copaTitles,
      ascensaoMvpCount: c.mvpCount || 0,
    };
    const raw = await storageGetValue("campaign_history");
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    if(list.length>50) list.length = 50;
    await storageSetValue("campaign_history", JSON.stringify(list));
  } catch(e){ /* armazenamento indisponível — segue o jogo normalmente */ }
}
async function loadCampaignHistory(){
  try{
    const raw = await storageGetValue("campaign_history");
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}

// Monta o texto de compartilhamento do FIM DE CARREIRA do Rumo à Ascensão — nome, funções,
// títulos por competição e quantas vezes foi MVP.
function buildAscensaoShareText(){
  const c = state.carreira;
  const regionalTitles = c.historico.reduce((n,h)=>n+ascensaoRegionalTitleCount(h),0);
  const mundialTitles = c.historico.filter(h=>h.mundialResultado==="champion").length;
  const copaTitles = c.historico.filter(h=>h.copaResultado==="champion").length;
  const funcoes = [c.funcao, ...c.funcoesSecundarias].map(roleLabel).join(", ");
  const lines = [t("ascensaoShareHeadline")(c.nome), ""];
  lines.push(`${t("ascensaoShareFuncoesLabel")}: ${funcoes}`);
  lines.push(`${t("ascensaoShareMundialLabel")}: ${mundialTitles}`);
  lines.push(`${t("ascensaoShareRegionalLabel")}: ${regionalTitles}`);
  lines.push(`${t("ascensaoShareCopaLabel")}: ${copaTitles}`);
  if(c.mvpCount) lines.push(`${t("shareMvpLabel")}: ${c.mvpCount}`);
  lines.push("");
  lines.push(t("ascensaoShareCta"));
  try{
    const href = window.location.href;
    if(/^https?:\/\//.test(href)) lines.push(href);
  }catch(e){}
  return lines.join("\n");
}
// Escolhe a frase de call-to-action certa pro compartilhamento, de acordo com o modo atual.
function shareCtaText(){
  if(state.difficulty==="copa") return t("shareCtaCopa");
  if(state.difficulty==="regional") return t("shareCtaRegional");
  return t("shareCta");
}
function buildShareText(){
  const info = state.endInfo || {type:"groups"};
  let headline;
  if(info.type==="champion") headline = state.difficulty==="regional" ? t("shareHeadlineRegionalChampion")(state.regionalRegiao) : t("shareHeadlineChampion");
  else if(info.type==="runnerup") headline = state.difficulty==="regional" ? t("shareHeadlineRegionalRunnerup")(state.regionalRegiao) : t("shareHeadlineRunnerup");
  else if(info.type==="playoffs") headline = t("shareHeadlinePlayoffs")(bracketLabel(info.stageLabelKey));
  else headline = t("shareHeadlineGroups");

  const modeLabel = state.difficulty==="classico" ? t("diffClassicoTitle") : state.difficulty==="copa" ? t("diffCopaTitle") : state.difficulty==="regional" ? (state.regionalSelva ? t("selvaModeRegionalTitle") : t("regionalModeBtn")) : t("diffSelvaTitle");
  const wins = state.journey.filter(j=>j.result==="W").length;
  const losses = state.journey.filter(j=>j.result==="L").length;
  let mapsWon=0, mapsLost=0;
  state.journey.forEach(j=>{
    const parts = j.score.split("-").map(Number);
    mapsWon += parts[0]||0; mapsLost += parts[1]||0;
  });
  const mvp = info.type==="champion" ? getMVP() : null;

  const lines = [headline, ""];
  lines.push(`${t("shareModeLabel")}: ${modeLabel}`);
  lines.push(`${t("shareCampaignLabel")}: ${wins}V - ${losses}D`);
  lines.push(`${t("shareMapsLabel")}: ${mapsWon}-${mapsLost}`);
  lines.push(`${t("shareOverallLabel")}: ${teamOverall(state.roster)}`);
  if(mvp) lines.push(`${t("shareMvpLabel")}: ${mvp.name}`);
  SLOT_ORDER.forEach((roleKey,i)=>{
    const p = state.roster[i];
    if(p) lines.push(`${t("shareTeamMemberLabel")(roleLabel(roleKey))}: ${p.name}`);
  });
  if(state.headCoach) lines.push(`${t("shareCoachLabel")}: ${state.headCoach}`);
  lines.push("");
  lines.push(shareCtaText());
  try{
    const href = window.location.href;
    if(/^https?:\/\//.test(href)) lines.push(href);
  }catch(e){}
  return lines.join("\n");
}
