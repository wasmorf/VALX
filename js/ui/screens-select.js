/* ==========================================================
   screens-select.js — Telas de seleção (Seleção, Selva, Regional)
   ========================================================== */

// Códigos de bandeira pra cada Seleção (mostra mais de uma quando é combinada).
// Nomes das Seleções traduzidos — a CHAVE em inglês (a mesma do WC_SELECOES) nunca muda, porque
// é usada pra buscar os dados de verdade; só o texto exibido pro jogador muda com o idioma.
const WC_SELECAO_NAMES_I18N = {
  pt:{
    "United States":"Estados Unidos", "South Korea":"Coreia do Sul", "China":"China", "Canada":"Canadá", "Turkey":"Turquia", "Brazil":"Brasil", "Lithuania":"Lituânia", "Chile":"Chile", "Singapore":"Singapura", "Poland":"Polônia", "Philippines":"Filipinas", "Great Britain":"Grã-Bretanha", "Chinese Taipei":"Taipé Chinês", "Malaysia":"Malásia", "Thailand":"Tailândia", "Finland":"Finlândia", "Russia":"Rússia",
  },
  en:{
    "United States":"United States", "South Korea":"South Korea", "China":"China", "Canada":"Canada", "Turkey":"Turkey", "Brazil":"Brazil", "Lithuania":"Lithuania", "Chile":"Chile", "Singapore":"Singapore", "Poland":"Poland", "Philippines":"Philippines", "Great Britain":"Great Britain", "Chinese Taipei":"Chinese Taipei", "Malaysia":"Malaysia", "Thailand":"Thailand", "Finland":"Finland", "Russia":"Russia",
  },
  es:{
    "United States":"Estados Unidos", "South Korea":"Corea del Sur", "China":"China", "Canada":"Canadá", "Turkey":"Turquía", "Brazil":"Brasil", "Lithuania":"Lituania", "Chile":"Chile", "Singapore":"Singapur", "Poland":"Polonia", "Philippines":"Filipinas", "Great Britain":"Gran Bretaña", "Chinese Taipei":"Taipéi Chino", "Malaysia":"Malasia", "Thailand":"Tailandia", "Finland":"Finlandia", "Russia":"Rusia",
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
    PL:"Polônia", UA:"Ucrânia", GB:"Reino Unido", VN:"Vietnã", PH:"Filipinas", SG:"Singapura", TW:"Taipé Chinês",
    ID:"Indonésia", MY:"Malásia", FR:"França", LV:"Letônia", CZ:"República Tcheca", BE:"Bélgica",
    EE:"Estônia", MD:"Moldávia", DK:"Dinamarca", NL:"Holanda", TH:"Tailândia", JP:"Japão"},
  en: {US:"United States", KR:"South Korea", CN:"China", CA:"Canada", TR:"Turkey", BR:"Brazil",
    AR:"Argentina", CL:"Chile", MA:"Morocco", LT:"Lithuania", FI:"Finland", SE:"Sweden", RU:"Russia",
    PL:"Poland", UA:"Ukraine", GB:"United Kingdom", VN:"Vietnam", PH:"Philippines", SG:"Singapore", TW:"Chinese Taipei",
    ID:"Indonesia", MY:"Malaysia", FR:"France", LV:"Latvia", CZ:"Czech Republic", BE:"Belgium",
    EE:"Estonia", MD:"Moldova", DK:"Denmark", NL:"Netherlands", TH:"Thailand", JP:"Japan"},
  es: {US:"Estados Unidos", KR:"Corea del Sur", CN:"China", CA:"Canadá", TR:"Turquía", BR:"Brasil",
    AR:"Argentina", CL:"Chile", MA:"Marruecos", LT:"Lituania", FI:"Finlandia", SE:"Suecia", RU:"Rusia",
    PL:"Polonia", UA:"Ucrania", GB:"Reino Unido", VN:"Vietnam", PH:"Filipinas", SG:"Singapur", TW:"Taipéi Chino",
    ID:"Indonesia", MY:"Malasia", FR:"Francia", LV:"Letonia", CZ:"República Checa", BE:"Bélgica",
    EE:"Estonia", MD:"Moldavia", DK:"Dinamarca", NL:"Países Bajos", TH:"Tailandia", JP:"Japón"},
};
function countryName(code){
  return (COUNTRY_NAMES_I18N[state.lang] && COUNTRY_NAMES_I18N[state.lang][code]) || code;
}
const WC_SELECAO_FLAGS = {
  "United States":["US"], "South Korea":["KR"], "China":["CN"], "Canada":["CA"], "Turkey":["TR"], "Brazil":["BR"], "Singapore":["SG"], "Poland":["PL"], "Philippines":["PH"], "Great Britain":["GB"], "Chinese Taipei":["TW"], "Malaysia":["MY"], "Finland":["FI"], "Lithuania":["LT"], "Thailand":["TH"], "Chile":["CL"], "Russia":["RU"],
};
Object.entries(WC_SELECAO_FLAGS).forEach(([selecao, codes])=>{
  codes.forEach(code=>{ WC_COUNTRY_TO_SELECAO[code] = selecao; });
});
// Nomes das seleções de qualificatório da Esports Nations Cup (chave inglesa -> [pt, en, es]).
const ENC_NATION_NAMES = {
  "Bahamas":["Bahamas","Bahamas","Bahamas"],
  "Colombia":["Colômbia","Colombia","Colombia"],
  "Costa Rica":["Costa Rica","Costa Rica","Costa Rica"],
  "Dominican Republic":["República Dominicana","Dominican Republic","República Dominicana"],
  "Ecuador":["Equador","Ecuador","Ecuador"],
  "Guatemala":["Guatemala","Guatemala","Guatemala"],
  "Honduras":["Honduras","Honduras","Honduras"],
  "Mexico":["México","Mexico","México"],
  "Panama":["Panamá","Panama","Panamá"],
  "Puerto Rico":["Porto Rico","Puerto Rico","Puerto Rico"],
  "Venezuela":["Venezuela","Venezuela","Venezuela"],
  "Argentina":["Argentina","Argentina","Argentina"],
  "Paraguay":["Paraguai","Paraguay","Paraguay"],
  "Peru":["Peru","Peru","Perú"],
  "Uruguay":["Uruguai","Uruguay","Uruguay"],
  "Cameroon":["Camarões","Cameroon","Camerún"],
  "Cote d'Ivoire":["Costa do Marfim","Côte d'Ivoire","Costa de Marfil"],
  "Ethiopia":["Etiópia","Ethiopia","Etiopía"],
  "Ghana":["Gana","Ghana","Ghana"],
  "Malawi":["Malawi","Malawi","Malaui"],
  "Mali":["Mali","Mali","Malí"],
  "Mauritius":["Maurício","Mauritius","Mauricio"],
  "Nigeria":["Nigéria","Nigeria","Nigeria"],
  "Senegal":["Senegal","Senegal","Senegal"],
  "South Africa":["África do Sul","South Africa","Sudáfrica"],
  "Sudan":["Sudão","Sudan","Sudán"],
  "Algeria":["Argélia","Algeria","Argelia"],
  "Azerbaijan":["Azerbaijão","Azerbaijan","Azerbaiyán"],
  "Bahrain":["Bahrein","Bahrain","Baréin"],
  "Egypt":["Egito","Egypt","Egipto"],
  "Georgia":["Geórgia","Georgia","Georgia"],
  "Iraq":["Iraque","Iraq","Irak"],
  "Jordan":["Jordânia","Jordan","Jordania"],
  "Kazakhstan":["Cazaquistão","Kazakhstan","Kazajistán"],
  "Kyrgyzstan":["Quirguistão","Kyrgyzstan","Kirguistán"],
  "Lebanon":["Líbano","Lebanon","Líbano"],
  "Morocco":["Marrocos","Morocco","Marruecos"],
  "Oman":["Omã","Oman","Omán"],
  "Palestine":["Palestina","Palestine","Palestina"],
  "Saudi Arabia":["Arábia Saudita","Saudi Arabia","Arabia Saudita"],
  "Syria":["Síria","Syria","Siria"],
  "Tunisia":["Tunísia","Tunisia","Túnez"],
  "Turkmenistan":["Turcomenistão","Turkmenistan","Turkmenistán"],
  "United Arab Emirates":["Emirados Árabes","United Arab Emirates","Emiratos Árabes"],
  "Uzbekistan":["Uzbequistão","Uzbekistan","Uzbekistán"],
  "Austria":["Áustria","Austria","Austria"],
  "Belgium":["Bélgica","Belgium","Bélgica"],
  "Cyprus":["Chipre","Cyprus","Chipre"],
  "Denmark":["Dinamarca","Denmark","Dinamarca"],
  "France":["França","France","Francia"],
  "Germany":["Alemanha","Germany","Alemania"],
  "Greece":["Grécia","Greece","Grecia"],
  "Iceland":["Islândia","Iceland","Islandia"],
  "Ireland":["Irlanda","Ireland","Irlanda"],
  "Italy":["Itália","Italy","Italia"],
  "Netherlands":["Países Baixos","Netherlands","Países Bajos"],
  "Norway":["Noruega","Norway","Noruega"],
  "Portugal":["Portugal","Portugal","Portugal"],
  "Spain":["Espanha","Spain","España"],
  "Sweden":["Suécia","Sweden","Suecia"],
  "Switzerland":["Suíça","Switzerland","Suiza"],
  "Australia":["Austrália","Australia","Australia"],
  "Brunei Darussalam":["Brunei","Brunei","Brunéi"],
  "Cambodia":["Camboja","Cambodia","Camboya"],
  "Guam":["Guam","Guam","Guam"],
  "Indonesia":["Indonésia","Indonesia","Indonesia"],
  "Myanmar":["Myanmar","Myanmar","Myanmar"],
  "New Zealand":["Nova Zelândia","New Zealand","Nueva Zelanda"],
  "Vietnam":["Vietnã","Vietnam","Vietnam"],
  "Bangladesh":["Bangladesh","Bangladesh","Bangladés"],
  "Hong Kong":["Hong Kong","Hong Kong","Hong Kong"],
  "India":["Índia","India","India"],
  "Japan":["Japão","Japan","Japón"],
  "Maldives":["Maldivas","Maldives","Maldivas"],
  "Mongolia":["Mongólia","Mongolia","Mongolia"],
  "Nepal":["Nepal","Nepal","Nepal"],
  "Pakistan":["Paquistão","Pakistan","Pakistán"],
  "Sri Lanka":["Sri Lanka","Sri Lanka","Sri Lanka"],
};
// Registra todas as seleções de qualificatório: código do país -> seleção, e os nomes traduzidos.
Object.values(ENC_QUALIFIER_NATIONS).forEach(region=>{
  Object.entries(region).forEach(([nome, dados])=>{
    WC_COUNTRY_TO_SELECAO[dados.code] = nome;
    const nm = ENC_NATION_NAMES[nome] || [nome,nome,nome];
    ["pt","en","es"].forEach((lang,i)=>{
      COUNTRY_NAMES_I18N[lang][dados.code] = nm[i];
      WC_SELECAO_NAMES_I18N[lang][nome] = nm[i];
    });
  });
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
  const optBtn = name=>{
    const flags = (WC_SELECAO_FLAGS[name]||[]).map(code=>countryFlag(code)).join(" ") || countryFlag((encNationData(name)||{}).code);
    return `<button class="team-option angle-sm ${state.selecao===name?'selected':''}" data-selecao="${name}">${flags} ${selecaoLabel(name)}</button>`;
  };
  const roles2 = ["duelist","flex","initiator","controller","sentinel"];
  const convidadas = Object.keys(WC_SELECOES).filter(n=>names.includes(n));
  // seleções dos qualificatórios, agrupadas por região e em ordem alfabética
  const regioesNomes = {NA:L3("América do Norte","North America","América del Norte"), SA:L3("América do Sul","South America","América del Sur"), SSA:L3("África","Africa","África"), MENA:L3("Oriente Médio e Norte da África","Middle East & North Africa","Medio Oriente y Norte de África"), EU:L3("Europa","Europe","Europa"), SEA:L3("Sudeste Asiático e Oceania","Southeast Asia & Oceania","Sudeste Asiático y Oceanía"), AS:L3("Ásia","Asia","Asia")};
  const qualHTML = Object.keys(ENC_QUALIFIER_NATIONS).map(r=>{
    const lista = Object.keys(ENC_QUALIFIER_NATIONS[r]).filter(n=>canCompleteRoster(roles2, selecaoPlayerObjects(n)))
      .sort((a,b)=>selecaoLabel(a).localeCompare(selecaoLabel(b)));
    return `<label class="test-slot-label" style="display:block;margin:14px 0 6px;">${regioesNomes[r]} · ${L3("qualificatório","qualifier","clasificatorio")} (${ENC_QUALIFIER_SLOTS[r]} ${L3("vagas","spots","cupos")})</label>
    <div class="selecao-grid">${lista.map(optBtn).join("")}</div>`;
  }).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:24px;">${t("selecaoSelectTitle")}</h1>
    <p class="lead">${t("selecaoSelectLead")}</p>
    <label class="test-slot-label" style="display:block;margin:10px 0 6px;">${L3("Convidadas (direto na fase de grupos)","Invited (straight to the group stage)","Invitadas (directo a la fase de grupos)")}</label>
    <div class="selecao-grid">${convidadas.map(optBtn).join("")}</div>
    ${qualHTML}
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
