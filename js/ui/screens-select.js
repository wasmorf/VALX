/* ==========================================================
   screens-select.js — Telas de seleção (Seleção, Selva, Regional)
   ========================================================== */

// Códigos de bandeira pra cada Seleção (mostra mais de uma quando é combinada).
// Nomes das Seleções traduzidos — a CHAVE em inglês (a mesma do WC_SELECOES) nunca muda, porque
// é usada pra buscar os dados de verdade; só o texto exibido pro jogador muda com o idioma.
const WC_SELECAO_NAMES_I18N = {
  pt:{
    "United States":"Estados Unidos", "South Korea":"Coreia do Sul", "China":"China", "Canada":"Canadá",
    "Turkey":"Turquia", "Brazil":"Brasil", "Argentina":"Argentina", "Chile":"Chile", "Morocco":"Marrocos",
    "Lithuania":"Lituânia", "Finland/Sweden":"Finlândia/Suécia", "Russia":"Rússia",
    "Poland/Ukraine":"Polônia/Ucrânia", "United Kingdom/Vietnam":"Reino Unido/Vietnã",
    "Philippines/Singapore/Indonesia/Malaysia/France":"Filipinas/Cingapura/Indonésia/Malásia/França",
    "Latvia/Czech Republic/Belgium/Estonia/Moldova":"Letônia/Rep. Checa/Bélgica/Estônia/Moldávia",
  },
  en:{
    "United States":"United States", "South Korea":"South Korea", "China":"China", "Canada":"Canada",
    "Turkey":"Turkey", "Brazil":"Brazil", "Argentina":"Argentina", "Chile":"Chile", "Morocco":"Morocco",
    "Lithuania":"Lithuania", "Finland/Sweden":"Finland/Sweden", "Russia":"Russia",
    "Poland/Ukraine":"Poland/Ukraine", "United Kingdom/Vietnam":"United Kingdom/Vietnam",
    "Philippines/Singapore/Indonesia/Malaysia/France":"Philippines/Singapore/Indonesia/Malaysia/France",
    "Latvia/Czech Republic/Belgium/Estonia/Moldova":"Latvia/Czech Republic/Belgium/Estonia/Moldova",
  },
  es:{
    "United States":"Estados Unidos", "South Korea":"Corea del Sur", "China":"China", "Canada":"Canadá",
    "Turkey":"Turquía", "Brazil":"Brasil", "Argentina":"Argentina", "Chile":"Chile", "Morocco":"Marruecos",
    "Lithuania":"Lituania", "Finland/Sweden":"Finlandia/Suecia", "Russia":"Rusia",
    "Poland/Ukraine":"Polonia/Ucrania", "United Kingdom/Vietnam":"Reino Unido/Vietnam",
    "Philippines/Singapore/Indonesia/Malaysia/France":"Filipinas/Singapur/Indonesia/Malasia/Francia",
    "Latvia/Czech Republic/Belgium/Estonia/Moldova":"Letonia/Rep. Checa/Bélgica/Estonia/Moldavia",
  },
};
// Traduz o nome de uma Seleção pro idioma atual, pra EXIBIR — nomes de organizações do modo
// normal (LOUD, Sentinels etc.) não estão nesse dicionário, então voltam sem alteração.
function selecaoLabel(name){
  const label = (WC_SELECAO_NAMES_I18N[state.lang] && WC_SELECAO_NAMES_I18N[state.lang][name]) || name;
  return label.replace(/\//g, "/<wbr>"); // permite quebra de linha depois da barra, sem forçar
}

// Mapa reverso: código do país -> nome da Seleção (mista ou não) a que ele pertence.
const WC_COUNTRY_TO_SELECAO = {};
// Nome de exibição de cada país (pras opções de nacionalidade do Rumo à Ascensão).
const COUNTRY_NAMES_I18N = {
  pt: {US:"Estados Unidos", KR:"Coreia do Sul", CN:"China", CA:"Canadá", TR:"Turquia", BR:"Brasil",
    AR:"Argentina", CL:"Chile", MA:"Marrocos", LT:"Lituânia", FI:"Finlândia", SE:"Suécia", RU:"Rússia",
    PL:"Polônia", UA:"Ucrânia", GB:"Reino Unido", VN:"Vietnã", PH:"Filipinas", SG:"Singapura",
    ID:"Indonésia", MY:"Malásia", FR:"França", LV:"Letônia", CZ:"República Tcheca", BE:"Bélgica",
    EE:"Estônia", MD:"Moldávia", DK:"Dinamarca", NL:"Holanda", TH:"Tailândia"},
  en: {US:"United States", KR:"South Korea", CN:"China", CA:"Canada", TR:"Turkey", BR:"Brazil",
    AR:"Argentina", CL:"Chile", MA:"Morocco", LT:"Lithuania", FI:"Finland", SE:"Sweden", RU:"Russia",
    PL:"Poland", UA:"Ukraine", GB:"United Kingdom", VN:"Vietnam", PH:"Philippines", SG:"Singapore",
    ID:"Indonesia", MY:"Malaysia", FR:"France", LV:"Latvia", CZ:"Czech Republic", BE:"Belgium",
    EE:"Estonia", MD:"Moldova", DK:"Denmark", NL:"Netherlands", TH:"Thailand"},
  es: {US:"Estados Unidos", KR:"Corea del Sur", CN:"China", CA:"Canadá", TR:"Turquía", BR:"Brasil",
    AR:"Argentina", CL:"Chile", MA:"Marruecos", LT:"Lituania", FI:"Finlandia", SE:"Suecia", RU:"Rusia",
    PL:"Polonia", UA:"Ucrania", GB:"Reino Unido", VN:"Vietnam", PH:"Filipinas", SG:"Singapur",
    ID:"Indonesia", MY:"Malasia", FR:"Francia", LV:"Letonia", CZ:"República Checa", BE:"Bélgica",
    EE:"Estonia", MD:"Moldavia", DK:"Dinamarca", NL:"Países Bajos", TH:"Tailandia"},
};
function countryName(code){
  return (COUNTRY_NAMES_I18N[state.lang] && COUNTRY_NAMES_I18N[state.lang][code]) || code;
}
const WC_SELECAO_FLAGS = {
  "United States":["US"], "South Korea":["KR"], "China":["CN"], "Canada":["CA"], "Turkey":["TR"],
  "Brazil":["BR"], "Argentina":["AR"], "Chile":["CL"], "Morocco":["MA"], "Lithuania":["LT"],
  "Finland/Sweden":["FI","SE"], "Russia":["RU"], "Poland/Ukraine":["PL","UA"],
  "United Kingdom/Vietnam":["GB","VN"],
};
Object.entries(WC_SELECAO_FLAGS).forEach(([selecao, codes])=>{
  codes.forEach(code=>{ WC_COUNTRY_TO_SELECAO[code] = selecao; });
});
function selecaoSelectHTML(){
  const roles = ["duelist","flex","initiator","controller","sentinel"];
  const names = Object.keys(WC_SELECOES).filter(name=>canCompleteRoster(roles, selecaoPlayerObjects(name)));
  const totalSelecoes = Object.keys(WC_SELECOES).length;
  if(names.length < totalSelecoes){
    const unavailable = Object.keys(WC_SELECOES).filter(n=>!names.includes(n));
    return `
    <div class="panel angle" style="text-align:center;">
      <h1 class="hero" style="font-size:24px;">${t("selecaoSelectTitle")}</h1>
      <p class="lead" style="margin-top:10px;">${t("copaNotReady")(names.length, unavailable.map(selecaoLabel).join(", "))}</p>
      <div class="btn-row" style="justify-content:center;margin-top:16px;">
        <button class="btn secondary" id="selecao-back-btn">${t("rulesBackBtn")}</button>
      </div>
    </div>
    `;
  }
  const optionsHTML = names.map(name=>{
    const flags = (WC_SELECAO_FLAGS[name]||[]).map(code=>countryFlag(code)).join(" ");
    return `<button class="team-option angle-sm ${state.selecao===name?'selected':''}" data-selecao="${name}">${flags} ${selecaoLabel(name)}</button>`;
  }).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:24px;">${t("selecaoSelectTitle")}</h1>
    <p class="lead">${t("selecaoSelectLead")}</p>
    <div class="selecao-grid">${optionsHTML}</div>
    <div class="btn-row">
      <button class="btn" id="selecao-continue-btn" ${state.selecao?'':'disabled'}>${t("teamSelectContinue")}</button>
    </div>
  </div>
  `;
}

function selvaModeSelectHTML(){
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:24px;">${t("selvaModeSelectTitle")}</h1>
    <p class="lead">${t("selvaModeSelectLead")}</p>
    <div class="mode-grid">
      <button class="mode-card angle-sm" data-selvamode="classico">
        <div class="mode-text"><h3>${t("selvaModeClassicoTitle")}</h3><p>${t("selvaModeClassicoDesc")}</p></div>
        <div class="mode-arrow">›</div>
      </button>
      <button class="mode-card angle-sm" data-selvamode="regional">
        <div class="mode-text"><h3>${t("selvaModeRegionalTitle")}</h3><p>${t("selvaModeRegionalDesc")}</p></div>
        <div class="mode-arrow">›</div>
      </button>
    </div>
    <div class="btn-row">
      <button class="btn secondary" id="selva-mode-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

function regionalSelectHTML(){
  const optionsHTML = Object.keys(TEAM_REGIONS).map(regiao=>{
    const qtdCraques = regionalPlayerObjects(regiao).length;
    return `<button class="team-option angle-sm ${state.regionalRegiao===regiao?'selected':''}" data-regiao="${regiao}">${regiao} <span class="mono" style="color:var(--muted);font-size:12px;">(${t("playersCountLabel")(qtdCraques)})</span></button>`;
  }).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:24px;">${t("regionalSelectTitle")}</h1>
    <p class="lead">${t("regionalSelectLead")}</p>
    <div class="selecao-grid">${optionsHTML}</div>
    <div class="btn-row">
      <button class="btn" id="regional-continue-btn" ${state.regionalRegiao?'':'disabled'}>${t("teamSelectContinue")}</button>
      <button class="btn secondary" id="regional-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

function regionalTeamSelectHTML(){
  const times = TEAM_REGIONS[state.regionalRegiao] || [];
  const optionsHTML = times.map(time=>`<button class="team-option angle-sm ${state.teamName===time?'selected':''}" data-team="${time}">${time}</button>`).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:24px;">${t("regionalTeamSelectTitle")(state.regionalRegiao)}</h1>
    <p class="lead">${t("regionalTeamSelectLead")}</p>
    <div class="selecao-grid">${optionsHTML}</div>
    <div class="btn-row">
      <button class="btn" id="regional-team-continue-btn" ${state.teamName?'':'disabled'}>${t("teamSelectContinue")}</button>
      <button class="btn secondary" id="regional-team-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}
