/* ==========================================================
   screens-draft-match.js — Telas de draft, partida e fim de campanha
   ========================================================== */

function teamSelectHTML(){
  const terrNames = {AMERICAS:"Americas", EMEA:"EMEA", PACIFIC:"Pacific", CN:"China"};
  const optionsHTML = Object.keys(TEAM_REGIONS).map(r=>`
    <div class="mono" style="color:var(--muted);font-size:12px;letter-spacing:.08em;margin:14px 0 8px;">${terrNames[r]||r}</div>
    <div class="team-grid">${TEAM_REGIONS[r].map(name=>`
      <button class="team-option angle-sm ${state.teamName===name?'selected':''}" data-team="${name}">${name}</button>
    `).join("")}</div>
  `).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:24px;">${t("teamSelectTitle")}</h1>
    <p class="lead">${t("teamSelectLead")}</p>
    ${optionsHTML}
    <div class="btn-row">
      <button class="btn" id="team-continue-btn" ${state.teamName?'':'disabled'}>${t("teamSelectContinue")}</button>
      <button class="btn secondary" id="team-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

function coachSelectHTML(){
  const optionsHTML = state.coachOptions.map(name=>`
    <button class="coach-option angle-sm ${state.headCoach===name?'selected':''}" data-coach="${name}">
      <div class="coach-name">${name} ${countryFlag(COACH_COUNTRY[name.toLowerCase()])}</div>
    </button>
  `).join("");
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:24px;">${t("coachSelectTitle")}</h1>
    <p class="lead">${state.difficulty==="copa" ? t("coachSelectLeadCopa") : t("coachSelectLead")}</p>
    <div class="coach-grid">${optionsHTML}</div>
    <div class="btn-row">
      <button class="btn" id="coach-continue-btn" ${(state.headCoach || (state.coachOptions||[]).length===0)?'':'disabled'}>${t("coachSelectContinue")}</button>
      <button class="btn secondary" id="coach-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

// Modo com atributos escondidos: o Selva "normal" e também o Selva aplicado ao Regional.
function isHiddenStats(){
  return state.difficulty==="selva" || (state.difficulty==="regional" && state.regionalSelva);
}
function draftHTML(){
  const filled = state.roster.filter(Boolean).length;
  const slotsHTML = SLOT_ORDER.map((roleKey,i)=>{
    const p = state.roster[i];
    if(p){
      return `<div class="slot filled"><div class="slot-name">${p.name} ${playerFlag(p)}</div><div class="slot-role">${roleLabel(roleKey)}</div></div>`;
    }
    return `<div class="slot">${roleLabel(roleKey)}</div>`;
  }).join("");

  let candidateHTML = "";
  if(filled>=5){
    candidateHTML = `
    <div class="panel angle" style="text-align:center;">
      <p class="lead" style="margin-bottom:14px;">${t("rosterComplete")} <span class="mono" style="color:var(--gold)">${teamOverall(state.roster)}</span></p>
      <button class="btn" id="to-match-btn">${t("toMatchBtn")}</button>
    </div>`;
  } else if(state.pendingSlotChoice && state.currentCandidate){
    const c = state.currentCandidate;
    const ov = overall(c);
    const tagChipsHTML = (c.tags && c.tags.length) ? `
      <div class="tag-chips">${c.tags.map(tag=>`<span class="tag-chip">${tagLabel(tag)}</span>`).join("")}</div>
    ` : "";
    const statsBlock = !isHiddenStats() ? `
      <div class="overall-badge">${ov}</div>
      ${tagChipsHTML}
    ` : `<div class="hidden-stats">${t("hiddenStats")}</div>`;
    let openSlots = SLOT_ORDER.map((roleKey,i)=>({roleKey,i})).filter(s=>!state.roster[s.i] && c.roles.includes(s.roleKey));
    if(state.difficulty==="copa"){
      const draftedNames = new Set(state.roster.filter(Boolean).map(p=>p.name));
      const selecaoPlayers = selecaoPlayerObjects(state.selecao).filter(p=>!draftedNames.has(p.name) && p.name!==c.name);
      openSlots = openSlots.filter(s=>{
        const remainingRoles = SLOT_ORDER.filter((rk,idx)=>!state.roster[idx] && idx!==s.i);
        return canCompleteRoster(remainingRoles, selecaoPlayers);
      });
    }

    candidateHTML = `
    <div class="candidate angle">
      <div class="cand-name">${c.name} ${playerFlag(c)}</div>
      <div class="cand-meta">${c.roles.map(r=>`<span class="role-pill">${roleLabel(r)}</span>`).join(" ")}</div>
      ${statsBlock}
      <p class="lead" style="margin:10px 0;">${t("chooseSlotPrompt")(c.name)}</p>
      <div class="btn-row" style="justify-content:center;flex-wrap:wrap;">
        ${openSlots.map(s=>`<button class="btn secondary" data-slotidx="${s.i}">${roleLabel(s.roleKey)}</button>`).join("")}
      </div>
    </div>`;
  } else if(state.confirmingCandidate){
    const c = state.confirmingCandidate;
    const ov = overall(c);
    const tagChipsHTML = (c.tags && c.tags.length) ? `
      <div class="tag-chips">${c.tags.map(tag=>`<span class="tag-chip">${tagLabel(tag)}</span>`).join("")}</div>
    ` : "";
    const synergyWith = !isHiddenStats() ? teammateSynergyNote(c) : null;
    const synergyBlock = synergyWith ? `<div class="cr-synergy" style="justify-content:center;margin:8px 0;">🤝 ${t("alreadyPlayedWith")}</div>` : "";
    const statsBlock = !isHiddenStats() ? `
      <div class="overall-badge">${ov}</div>
      ${tagChipsHTML}
      ${synergyBlock}
    ` : `<div class="hidden-stats">${t("hiddenStats")}</div>`;

    candidateHTML = `
    <div class="candidate angle ${synergyWith ? 'synergy-highlight' : ''}">
      <div class="cand-name">${c.name} ${playerFlag(c)}</div>
      <div class="cand-meta">${c.roles.map(r=>`<span class="role-pill">${roleLabel(r)}</span>`).join(" ")}</div>
      ${statsBlock}
      <p class="lead" style="margin:10px 0;">${t("confirmDraftPrompt")(c.name)}</p>
      <div class="btn-row" style="justify-content:center;">
        <button class="btn" id="confirm-draft-btn">${t("confirmBtn")}</button>
        <button class="btn secondary" id="back-to-list-btn">${t("backBtn")}</button>
      </div>
    </div>`;
  } else if(state.currentCandidates.length>0){
    const skipsLeft = 2 - state.skipsUsed;
    const rowsHTML = state.currentCandidates.map(c=>{
      const synergyWith = !isHiddenStats() ? teammateSynergyNote(c) : null;
      return `
      <button class="candidate-row angle-sm ${synergyWith ? 'synergy-highlight' : ''}" data-pick="${c.name}">
        <div class="cr-info">
          <div class="cr-name">${c.name} ${playerFlag(c)}</div>
          <div class="cr-roles">${c.roles.map(r=>roleLabel(r)).join(" · ")}</div>
          ${!isHiddenStats() && c.tags && c.tags.length ? `<div class="cr-tags">${c.tags.map(tag=>`<span class="cr-tag">${tagLabel(tag)}</span>`).join("")}</div>` : ''}
          ${synergyWith ? `<div class="cr-synergy">🤝 ${t("alreadyPlayedWith")}</div>` : ''}
        </div>
        ${!isHiddenStats() ? `<div class="cr-ovr mono">${overall(c)}</div>` : `<div class="cr-ovr mono">?</div>`}
      </button>
    `;
    }).join("");
    candidateHTML = `
    <div class="panel angle">
      <p class="lead" style="margin-bottom:12px;text-align:center;">${t("pickOneLead")}</p>
      <div class="candidate-list">${rowsHTML}</div>
      <p class="lead" style="margin:12px 0 6px;text-align:center;">${t("skipsLeftLabel")(Math.max(0,skipsLeft))}</p>
      <div class="btn-row" style="justify-content:center;">
        ${skipsLeft>0 ? `<button class="btn secondary" id="skip-batch-btn">${t("skipBtn")}</button>` : ''}
      </div>
    </div>`;
  } else {
    candidateHTML = `
    <div class="panel angle" style="text-align:center;">
      <p class="lead" style="margin-bottom:16px;">${t("drawLead")}</p>
      <button class="btn" id="draw-btn" ${(()=>{
        if(state.difficulty==="copa") return "";
        const draftedNames = new Set(state.roster.filter(Boolean).map(p=>p.name));
        return state.poolSource.filter(p=>!draftedNames.has(p.name)).length===0 ? "disabled" : "";
      })()}>${t("drawBtn")}</button>
      ${state.pool.length===0?`<p class="lead" style="margin-top:10px;">${t("poolEmpty")}</p>`:''}
    </div>`;
  }

  return `
  <div class="roster-strip">${slotsHTML}</div>
  <div class="pool-info"><span>${t("poolLabel")} ${state.pool.length}</span><span>${t("filledLabel")(filled)}</span></div>
  ${candidateHTML}
  `;
}

function matchHTML(){
  const opp = currentOpponent();
  const us = teamOverall(state.roster);
  const roundsHTML = state.roundLog.map(r=>`<div class="r ${r}">${r==='win'?'✓':'·'}</div>`).join("");
  const bo = state.mapsToWin*2-1;
  const side = currentSide();
  const sideLabelHTML = side==="attack"
    ? `<span style="color:var(--crimson);">${t("sideAttack")}</span>`
    : `<span style="color:var(--teal);">${t("sideDefense")}</span>`;

  const rosterColHTML = (players, title) => `
    <div class="roster-col">
      <div class="roster-col-title">${title}</div>
      ${players.map(p=>`
        <div class="roster-player">
          <span class="pname">${p.name} ${playerFlag(p)}</span>
          <span class="pkda">${p.k}/${p.d}/${p.a}</span>
        </div>`).join("")}
    </div>`;
  const rostersHTML = (state.matchStats.us.length && state.matchStats.them.length) ? `
    <div class="pool-info" style="justify-content:center;margin-top:14px;"><span class="mono">${t("rostersLabel")}</span></div>
    <div class="roster-compare">
      ${rosterColHTML(state.matchStats.us, selecaoLabel(state.teamName))}
      ${rosterColHTML(state.matchStats.them, selecaoLabel(opp.name))}
    </div>` : "";

  const mapFinished = isMapDecided(state.matchScore.us, state.matchScore.them);
  let actionHTML = "";
  if(!mapFinished){
    actionHTML = `<div class="btn-row" style="justify-content:center;"><button class="btn" id="sim-round-btn">${t("simRoundBtn")}</button> <button class="btn secondary" id="sim-all-btn">${t("simAllBtn")}</button></div>`;
  } else {
    const wonMap = state.matchScore.us > state.matchScore.them;
    const prospUs = state.mapsUs + (wonMap?1:0);
    const prospThem = state.mapsThem + (wonMap?0:1);
    const matchDecided = prospUs===state.mapsToWin || prospThem===state.mapsToWin;
    const rec = checkRecords();
    const buildRecordParts = ()=>{
      const parts = [];
      if(matchDecided && rec.seriesBreak){
        const b = rec.seriesBreak;
        const key = b.side==="us" ? "recordSeriesUs" : "recordSeriesThem";
        parts.push(t(key)(b.name, b.kills, rec.prevSeries.kills, rec.prevSeries.holder, "MD"+(rec.bo==="md5"?5:3)));
      }
      if(rec.singleMapBreak){
        const b = rec.singleMapBreak;
        const key = b.side==="us" ? "recordSingleMapUs" : "recordSingleMapThem";
        parts.push(t(key)(b.name, b.kills, rec.prevSingleMap.kills, rec.prevSingleMap.holder));
      }
      return parts;
    };
    if(matchDecided){
      const wonMatch = prospUs>prospThem;
      const parts = buildRecordParts();
      const recordHTML = parts.length ? `<div class="record-banner">${parts.join("<br><br>")}</div>` : "";
      actionHTML = `
      <div class="result-banner ${wonMatch?'win':'loss'}">
        <div class="label">${wonMatch?t("resultWin"):t("resultLoss")}</div>
      </div>
      ${recordHTML}
      <div class="btn-row" style="justify-content:center;">
        <button class="btn" id="continue-btn">${t("continueBtn")}</button>
      </div>`;
    } else {
      const parts = rec.singleMapBreak ? [(()=>{
        const b = rec.singleMapBreak;
        const key = b.side==="us" ? "recordSingleMapUs" : "recordSingleMapThem";
        return t(key)(b.name, b.kills, rec.prevSingleMap.kills, rec.prevSingleMap.holder);
      })()] : [];
      const recordHTML = parts.length ? `<div class="record-banner">${parts.join("<br><br>")}</div>` : "";
      actionHTML = `
      <div class="result-banner ${wonMap?'win':'loss'}">
        <div class="label">${wonMap?t("resultWin"):t("resultLoss")}</div>
      </div>
      ${recordHTML}
      <div class="btn-row" style="justify-content:center;">
        <button class="btn" id="next-map-btn">${t("nextMapBtn")}</button>
      </div>`;
    }
  }

  return `
  <div class="pool-info" style="justify-content:center;"><span class="mono">${contextLabel()}</span></div>
  <div class="pool-info" style="justify-content:center;"><span class="mono">MD${bo} · ${t("mapsScoreLabel")(state.mapsUs, state.mapsThem)} · ${sideLabelHTML}</span></div>
  <div class="panel angle">
    <div class="vs-row">
      <div class="team-block">
        <div class="team-name">${selecaoLabel(state.teamName)}</div>
        <div class="team-sub mono">OVR ${us}</div>
        <div class="team-sub" style="margin-top:2px;">${state.headCoach||"—"} ${countryFlag(COACH_COUNTRY[(state.headCoach||"").toLowerCase()])}</div>
      </div>
      <div class="vs-x">${t("vs")}</div>
      <div class="team-block">
        <div class="team-name">${selecaoLabel(opp.name)}</div>
        <div class="team-sub mono">OVR ${opp.rating}</div>
        ${opp.coach ? `<div class="team-sub" style="margin-top:2px;">${opp.coach} ${countryFlag(COACH_COUNTRY[opp.coach.toLowerCase()])}</div>` : ''}
      </div>
    </div>
    <div style="text-align:center;">
      <div class="score mono">${state.matchScore.us}<span class="sep">–</span>${state.matchScore.them}</div>
    </div>
    <div class="round-log">${roundsHTML}</div>
    ${rostersHTML}
    ${actionHTML}
  </div>
  `;
}

function endHTML(){
  const info = state.endInfo || {type:"groups"};
  let icon = "🗺️", titleColor = "var(--crimson)", title = "", lead = "";
  if(info.type==="champion"){
    icon = "🏆"; titleColor = "var(--gold)";
    title = state.difficulty==="regional" ? t("regionalChampionTitle")(state.regionalRegiao) : t("championTitle");
    lead = t("championLead");
  } else if(info.type==="runnerup"){
    icon = "🥈"; titleColor = "var(--text)";
    title = state.difficulty==="regional" ? t("regionalRunnerUpTitle")(state.regionalRegiao) : t("runnerUpTitle");
    lead = t("runnerUpLead");
  } else if(info.type==="notQualified"){
    icon = "🗺️";
    title = L3("Não classificou nos qualificatórios","Did not qualify","No clasificó en los clasificatorios");
    lead = L3("Sua seleção ficou fora das vagas do qualificatório da região na Esports Nations Cup.","Your national team missed the regional qualifier spots for the Esports Nations Cup.","Tu selección quedó fuera de los cupos del clasificatorio regional de la Esports Nations Cup.");
  } else if(info.type==="playoffs"){
    icon = "🗺️";
    title = t("playoffsEliminatedTitle"); lead = t("playoffsEliminatedLead")(bracketLabel(info.stageLabelKey));
  } else {
    icon = "🗺️";
    title = t("groupsEliminatedTitle"); lead = t("groupsEliminatedLead");
  }

  const mvp = info.type==="champion" ? getMVP() : null;
  const mvpHTML = mvp ? `
    <div class="mvp-card angle-sm">
      <div class="mvp-eyebrow">${t("mvpLabel")}</div>
      <div class="mvp-name">${mvp.name} ${playerFlag(mvp)}</div>
      <div class="mvp-role">${roleLabel(mvp.role)}</div>
      <div class="mvp-kda">${mvp.k}/${mvp.d}/${mvp.a}</div>
    </div>` : "";

  const journeyHTML = state.journey.length ? `
    <div class="pool-info" style="justify-content:center;margin-top:6px;"><span class="mono">${t("journeyLabel")}</span></div>
    <div class="journey-table">
      ${state.journey.map(j=>`
        <div class="journey-row">
          <div class="jr-stage">${j.stageLabel}</div>
          <div class="jr-opp">${j.opponent}</div>
          <div class="jr-score">${j.score}</div>
          <div class="jr-result ${j.result==='W'?'win':'loss'}">${j.result}</div>
        </div>`).join("")}
    </div>` : "";

  return `
    <div class="panel angle trophy-wrap">
      <div class="trophy-icon">${icon}</div>
      <div class="trophy-title" style="color:${titleColor};">${title}</div>
      <p class="lead">${lead}</p>
      ${state.headCoach ? `<div class="pool-info" style="justify-content:center;"><span class="mono">${t("headCoachLabel")}: ${state.headCoach} ${countryFlag(COACH_COUNTRY[state.headCoach.toLowerCase()])}</span></div>` : ''}
      ${mvpHTML}
      ${journeyHTML}
      <div class="final-roster">
        ${state.roster.map((p,i)=>`<div class="fr-item"><div><div class="n">${p.name} ${playerFlag(p)}${mvp && mvp.name===p.name ? '<span class="mvp-tag">MVP</span>' : ''}</div><div class="r">${roleLabel(SLOT_ORDER[i])}</div></div><div class="o mono">${overall(p)}</div></div>`).join("")}
      </div>
      <button class="btn" id="restart-btn">${info.type==="champion"?t("playAgain"):t("tryAgain")}</button>
      <div class="share-row">
        <button class="share-btn" id="share-x-btn">
          <svg width="15" height="15" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6 L26 26 M26 6 L6 26" stroke="currentColor" stroke-width="4.5" stroke-linecap="square"/>
          </svg>
          ${t("shareXBtn")}
        </button>
      </div>
    </div>`;
}
