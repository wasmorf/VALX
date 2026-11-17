/* ==========================================================
   screens-main.js — Telas: início, regras, novidades, histórico e criador
   ========================================================== */

function introHTML(){
  return `
  <div class="panel angle">
    <h1 class="hero">${t("hero")}</h1>
    <p class="lead">${t("lead")}</p>
    <div class="mode-grid">
      <button class="mode-card angle-sm" data-mode="classico">
        <div class="mode-text"><h3>${t("diffClassicoTitle")}</h3><p>${t("diffClassicoDesc")}</p></div>
        <div class="mode-arrow">›</div>
      </button>
      <button class="mode-card angle-sm" data-mode="regional">
        <div class="mode-text"><h3>${t("regionalModeBtn")}</h3><p>${t("regionalModeDesc")}</p></div>
        <div class="mode-arrow">›</div>
      </button>
      <button class="mode-card angle-sm" data-mode="selva">
        <div class="mode-text"><h3>${t("diffSelvaTitle")}</h3><p>${t("diffSelvaDesc")}</p></div>
        <div class="mode-arrow">›</div>
      </button>
      <button class="mode-card angle-sm" data-mode="copa">
        <div class="mode-text"><h3>${t("diffCopaTitle")}</h3><p>${t("diffCopaDesc")}</p></div>
        <div class="mode-arrow">›</div>
      </button>
      <button class="mode-card angle-sm" data-mode="ascensao">
        <div class="mode-text"><h3>${t("ascensaoModeBtn")}</h3><p>${t("ascensaoModeDesc")}</p></div>
        <div class="mode-arrow">›</div>
      </button>
    </div>
    <div class="rules-btn-row">
      <button class="rules-link" id="rules-btn">${t("rulesLink")}</button>
      <button class="rules-link" id="history-btn">${t("historyLink")}</button>
    </div>
  </div>
  <p class="disclaimer">${t("disclaimer")}</p>
  <div class="footer-social">
    <button class="social-link" id="creator-btn" aria-label="Sobre o criador">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="3.5" stroke="#F5F5F5" stroke-width="1.8"/>
        <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" stroke="#F5F5F5" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
  `;
}

function rulesHTML(){
  const sectionsHTML = t("rulesSections").map(sec=>`
    <div class="rules-section">
      <h3>${sec.title}</h3>
      ${sec.body}
    </div>
  `).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:22px;">${t("rulesTitle")}</h1>
    ${sectionsHTML}
    <div class="btn-row" style="margin-top:6px;">
      <button class="btn" id="rules-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

function changelogHTML(){
  const sectionsHTML = t("changelogSections").map(sec=>`
    <div class="rules-section">
      <h3>${sec.title}</h3>
      ${sec.body}
    </div>
  `).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:22px;">${t("changelogTitle")}</h1>
    ${sectionsHTML}
    <div class="btn-row" style="margin-top:6px;">
      <button class="btn" id="changelog-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

function historyHTML(){
  const list = state.campaignHistoryList || [];
  const resultLabel = (rec)=>{
    if(rec.resultType==="ascensao") return t("ascensaoModeBtn");
    if(rec.resultType==="champion"){
      if(rec.difficulty==="regional" && rec.regionalRegiao) return t("regionalChampionTitle")(rec.regionalRegiao);
      return t("championTitle");
    }
    if(rec.resultType==="runnerup") return t("runnerUpTitle");
    if(rec.resultType==="playoffs") return `${t("playoffsEliminatedTitle")} (${bracketLabel(rec.stageLabelKey)})`;
    return t("groupsEliminatedTitle");
  };
  const resultColor = (rec)=> rec.resultType==="ascensao" ? "var(--gold)" : rec.resultType==="champion" ? "var(--gold)" : (rec.resultType==="runnerup" ? "var(--text)" : "var(--crimson)");
  const rowsHTML = list.length ? list.map(rec=>{
    if(rec.resultType==="ascensao"){
      return `
    <div class="history-item angle-sm">
      <div class="history-top">
        <span class="history-team">${countryFlag(rec.ascensaoNacionalidade)} ${rec.ascensaoNome}</span>
        <span class="history-date mono">${new Date(rec.date).toLocaleDateString()}</span>
      </div>
      <div class="history-result" style="color:${resultColor(rec)};">${resultLabel(rec)}</div>
      <div class="history-meta mono">${t("ascensaoMundialLabel")}: ${rec.ascensaoMundialTitles} · ${t("ascensaoRegionalLabel")}: ${rec.ascensaoRegionalTitles} · ${t("ascensaoWorldCupLabel")}: ${rec.ascensaoCopaTitles}${rec.ascensaoMvpCount ? " · MVP: "+rec.ascensaoMvpCount : ""}</div>
    </div>
  `;
    }
    return `
    <div class="history-item angle-sm">
      <div class="history-top">
        <span class="history-team">${selecaoLabel(rec.teamName) || "—"}</span>
        <span class="history-date mono">${new Date(rec.date).toLocaleDateString()}</span>
      </div>
      <div class="history-result" style="color:${resultColor(rec)};">${resultLabel(rec)}</div>
      <div class="history-meta mono">${t("shareCampaignLabel")}: ${rec.record} · ${t("shareOverallLabel")}: ${rec.overall}${rec.mvpName ? " · MVP: "+rec.mvpName : ""}</div>
    </div>
  `;
  }).join("") : `<p class="lead" style="text-align:center;">${t("historyEmpty")}</p>`;
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:22px;">${t("historyTitle")}</h1>
    <div class="history-list">${rowsHTML}</div>
    <div class="btn-row" style="margin-top:14px;">
      <button class="btn" id="history-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

function creatorHTML(){
  return `
  <div class="panel angle" style="text-align:center;">
    <h1 class="hero" style="font-size:22px;">${t("creatorTitle")}</h1>
    <p class="lead" style="margin-top:10px;">${t("creatorBody")}</p>
    <a class="social-link" href="https://x.com/wasmorf1?s=11" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter) profile" style="margin:18px auto 0;">
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6 L26 26 M26 6 L6 26" stroke="#F5F5F5" stroke-width="4.5" stroke-linecap="square"/>
      </svg>
    </a>
    <div class="btn-row" style="justify-content:center;margin-top:18px;">
      <button class="btn" id="creator-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}
