/* ==========================================================
   screens-ascensao.js — Telas do Rumo à Ascensão
   ========================================================== */

function ascensaoCreateHTML(){
  const c = state.carreira || {nome:"", funcao:null, funcoesSecundarias:[], qualidades:[], regiao:null, nacao:null, nacionalidade:null};
  const roleOptionsHTML = SLOT_ORDER.map(rk=>`
    <button class="diff-card angle-sm ${c.funcao===rk?'selected':''}" data-ascfuncao="${rk}" style="padding:12px 6px;">
      <h3 style="font-size:13px;">${roleLabel(rk)}</h3>
    </button>
  `).join("");
  const secondaryOptionsHTML = SLOT_ORDER.filter(rk=>rk!==c.funcao).map(rk=>`
    <button class="diff-card angle-sm ${c.funcoesSecundarias.includes(rk)?'selected':''}" data-ascfuncaosecundaria="${rk}" style="padding:12px 6px;">
      <h3 style="font-size:13px;">${roleLabel(rk)}</h3>
    </button>
  `).join("");
  const qualityTags = ["mm","entry","operator","clutch","igl","lurker","utility"];
  const qualityOptionsHTML = qualityTags.map(tag=>`
    <button class="diff-card angle-sm ${c.qualidades.includes(tag)?'selected':''}" data-ascqualidade="${tag}" style="padding:10px 6px;">
      <h3 style="font-size:12px;">${tagLabel(tag)}</h3>
    </button>
  `).join("");
  const regionOptionsHTML = Object.keys(TEAM_REGIONS).map(r=>`
    <button class="team-option angle-sm ${c.regiao===r?'selected':''}" data-ascregiao="${r}">${r} (${territoryAllOrgs(r).length} times)</button>
  `).join("");
  const subKeys = c.regiao ? Object.keys(ASCENSAO_SUB_SLOTS[c.regiao]) : [];
  const subOptionsHTML = subKeys.length>1 ? subKeys.map(s=>`
    <button class="team-option angle-sm ${c.subregiao===s?'selected':''}" data-ascsub="${s}">${subLabel(s)}</button>
  `).join("") : "";
  const countryOptionsHTML = Object.keys(WC_COUNTRY_TO_SELECAO).sort((a,b)=>countryName(a).localeCompare(countryName(b))).map(code=>`
    <button class="team-option angle-sm ${c.nacionalidade===code?'selected':''}" data-ascpais="${code}">${countryFlag(code)} ${countryName(code)}</button>
  `).join("");
  const canConfirm = c.nome.trim().length>0 && c.funcao && c.regiao && c.nacionalidade && (subKeys.length<=1 || c.subregiao);
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:22px;">${t("ascensaoCreateTitle")}</h1>
    <p class="lead">${t("ascensaoCreateLead")}</p>

    <label class="test-slot-label" style="display:block;margin:14px 0 6px;">${t("ascensaoNameLabel")}</label>
    <input type="text" id="ascensao-name-input" value="${c.nome.replace(/"/g,'&quot;')}" maxlength="20"
      placeholder="${t("ascensaoNamePlaceholder")}"
      style="width:100%;box-sizing:border-box;background:var(--bg-panel-2);border:1px solid var(--line);color:var(--text);font-family:'IBM Plex Sans';font-size:14px;padding:10px;border-radius:2px;"/>

    <label class="test-slot-label" style="display:block;margin:16px 0 6px;">${t("ascensaoRoleLabel")}</label>
    <div class="diff-grid" style="grid-template-columns:repeat(3,1fr);">${roleOptionsHTML}</div>

    ${c.funcao ? `
    <label class="test-slot-label" style="display:block;margin:16px 0 6px;">${t("ascensaoSecondaryRoleLabel")}</label>
    <div class="diff-grid" style="grid-template-columns:repeat(3,1fr);">${secondaryOptionsHTML}</div>
    ` : ''}

    <label class="test-slot-label" style="display:block;margin:16px 0 6px;">${t("ascensaoQualityLabel")}(${c.qualidades.length}/3)</label>
    <div class="diff-grid" style="grid-template-columns:repeat(3,1fr);">${qualityOptionsHTML}</div>

    <label class="test-slot-label" style="display:block;margin:16px 0 6px;">${t("ascensaoRegionLabel")}</label>
    <div class="selecao-grid">${regionOptionsHTML}</div>
    ${subOptionsHTML ? `<label class="test-slot-label" style="display:block;margin:16px 0 6px;">${L3("Sub-região (Open Qualifier)","Sub-region (Open Qualifier)","Subregión (Open Qualifier)")}</label>
    <div class="selecao-grid">${subOptionsHTML}</div>` : ''}

    <label class="test-slot-label" style="display:block;margin:16px 0 6px;">${t("ascensaoNationLabel")}</label>
    <p class="lead" style="margin-top:0;">${t("ascensaoNationLead")}</p>
    <div class="selecao-grid">${countryOptionsHTML}</div>

    <div class="btn-row" style="margin-top:16px;">
      <button class="btn" id="ascensao-confirm-btn" ${canConfirm?'':'disabled'}>${t("ascensaoConfirmBtn")}</button>
      <button class="btn secondary" id="ascensao-back-btn">${t("rulesBackBtn")}</button>
    </div>
  </div>
  `;
}

function ascensaoRevealHTML(){
  const c = state.carreira;
  return `
  <div class="panel angle" style="text-align:center;">
    <h1 class="hero" style="font-size:22px;">${t("ascensaoRevealTitle")}</h1>
    <p class="lead" style="margin-top:10px;">${t("ascensaoRevealLead")(c.nome, c.time, c.regiao)}</p>
    <div class="test-stats" style="margin-top:18px;text-align:left;">
      <div class="test-stat-row"><span>${t("ascensaoNameLabel")}</span><span class="mono">${c.nome}</span></div>
      <div class="test-stat-row"><span>${t("ascensaoRoleLabel")}</span><span class="mono">${roleLabel(c.funcao)}</span></div>
      ${c.funcoesSecundarias.length ? `<div class="test-stat-row"><span>${t("ascensaoSecondaryRolesLabel")}</span><span class="mono">${c.funcoesSecundarias.map(roleLabel).join(", ")}</span></div>` : ''}
      <div class="test-stat-row"><span>${t("ascensaoQualityLabel")}</span><span class="mono">${c.qualidades.map(tagLabel).join(", ")}</span></div>
      <div class="test-stat-row"><span>${t("ascensaoTeamLabel")}</span><span class="mono">${c.time}</span></div>
      <div class="test-stat-row"><span>${t("ascensaoRegionLabel")}</span><span class="mono">${c.regiao}</span></div>
      ${(()=>{ const r=(c.orgRostersSnapshot||ASCENSAO_TEAM_ROSTERS)[c.time]; const hc=r&&r.coach, ac=r&&r.ac; return (hc?`<div class="test-stat-row"><span>Head Coach</span><span class="mono">${hc}</span></div>`:'')+(ac?`<div class="test-stat-row"><span>Assistant Coach</span><span class="mono">${ac}</span></div>`:''); })()}
      <div class="test-stat-row"><span>${t("ascensaoNationLabel")}</span><span class="mono">${countryFlag(c.nacionalidade)} ${countryName(c.nacionalidade)}</span></div>
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:18px;">
      <button class="btn" id="ascensao-start-season-btn">${t("ascensaoStartSeasonBtn")}</button>
    </div>
  </div>
  `;
}

// Traduz o resultado de uma temporada do Rumo à Ascensão pro texto certo.
// Mostra a colocação real do jogador na fase Regional — Campeão, Vice, ou eliminado em tal
// fase do chaveamento (reaproveita os rótulos do próprio chaveamento, tipo "Semifinal").
// Texto da colocação num evento da temporada.
//  - sem `stageName`: texto regional clássico (modo Regional).
//  - com `stageName`: o nome do evento entra na frase ("CAMPEÃO — KICKOFF"), pra não dizer
//    "campeão regional" em Masters, Cups ou Open Qualifier.
//  - `short`: só a colocação, quando o nome do evento já aparece ao lado.
function ascensaoRegionalPlacementLabel(placement, stageName, short){
  if(!placement) return "";
  if(!stageName && !short){
    if(placement.type==="champion") return t("ascensaoRegionalChampionTitle");
    if(placement.type==="runnerup") return t("ascensaoRegionalRunnerupTitle");
    if(placement.type==="groups") return t("ascensaoRegionalGroupsTitle");
    if(placement.type==="playoffs") return `${t("ascensaoEliminatedPrefix")} — ${bracketLabel(placement.stageLabelKey)}`;
    return "";
  }
  const nome = stageName && !short ? ` — ${String(stageName).toUpperCase()}` : "";
  if(placement.type==="champion") return L3("CAMPEÃO","CHAMPION","CAMPEÓN") + nome;
  if(placement.type==="runnerup") return L3("VICE-CAMPEÃO","RUNNER-UP","SUBCAMPEÓN") + nome;
  if(placement.type==="groups") return L3("ELIMINADO NA FASE DE GRUPOS","ELIMINATED IN THE GROUP STAGE","ELIMINADO EN LA FASE DE GRUPOS") + nome;
  if(placement.type==="playoffs") return `${t("ascensaoEliminatedPrefix")} — ${bracketLabel(placement.stageLabelKey)}${nome}`;
  return "";
}
function ascensaoQualifiedLabel(qualificou){
  return qualificou ? t("ascensaoQualifiedTitle") : t("ascensaoRegionalPlayoffsTitle");
}
function ascensaoResultLabel(resultado){
  return {
    champion: t("championTitle"),
    runnerup: t("runnerUpTitle"),
    worldPlayoffs: t("playoffsEliminatedTitle"),
    worldGroups: t("groupsEliminatedTitle"),
    playoffs: t("playoffsEliminatedTitle"),
    groups: t("groupsEliminatedTitle"),
    regionalPlayoffs: t("ascensaoRegionalPlayoffsTitle"),
    regionalGroups: t("ascensaoRegionalGroupsTitle"),
    eliminatedGroups: t("ascensaoRegionalGroupsTitle"),
    eliminatedPlayoffs: t("ascensaoRegionalPlayoffsTitle"),
    qualified: t("ascensaoQualifiedTitle"),
    notQualified: L3("Não classificou nos qualificatórios","Did not qualify","No clasificó en los clasificatorios"),
  }[resultado];
}
function ascensaoRoleSwitchHTML(){
  const c = state.carreira;
  const funcaoAtual = (c.funcaoAtual && [c.funcao, ...c.funcoesSecundarias].includes(c.funcaoAtual)) ? c.funcaoAtual : c.funcao;
  const novaFuncao = c.pendingRoleSwitchData.novaFuncao;
  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:20px;">${t("ascensaoRoleSwitchTitle")}</h1>
    <p style="color:var(--muted);margin:6px 0 16px;">${t("ascensaoRoleSwitchBody")(roleLabel(funcaoAtual), roleLabel(novaFuncao))}</p>
    <div class="btn-row">
      <button class="btn" id="ascensao-roleswitch-yes">${t("ascensaoRoleSwitchYesBtn")(roleLabel(novaFuncao))}</button>
      <button class="btn" id="ascensao-roleswitch-no">${t("ascensaoRoleSwitchNoBtn")(roleLabel(funcaoAtual))}</button>
    </div>
  </div>
  `;
}
function ascensaoOfferHTML(){
  const c = state.carreira;
  const ofertasHTML = c.ofertas.map((oferta, i)=>{
    const jogadoresHTML = oferta.jogadores.map(nome=>{
      const p = poolGet(nome);
      return `<div class="test-stat-row"><span>${nome} ${p?playerFlag(p):''}</span><span class="mono">${p?roleLabel(p.roles[0]):''}</span></div>`;
    }).join("");
    return `
    <div class="history-item" style="margin-bottom:14px;text-align:left;">
      <h3 style="font-family:'Chakra Petch';margin:0 0 6px;">${oferta.org} <span class="mono" style="color:var(--muted);font-size:12px;">(${oferta.regiao})</span></h3>
      <p style="font-family:'Chakra Petch';font-weight:700;color:var(--crimson);margin:0 0 8px;font-size:13px;">${t("ascensaoOfferRoleLabel")}: ${roleLabel(oferta.funcao)}</p>
      <p style="font-family:'Chakra Petch';color:var(--text);margin:0 0 10px;font-size:13px;">${t("ascensaoOfferCoachLabel")}: ${oferta.coach||"—"} ${oferta.coach?countryFlag(COACH_COUNTRY[oferta.coach.toLowerCase()]):''}</p>
      <div class="test-stats">${jogadoresHTML}</div>
      <div class="btn-row" style="margin-top:10px;">
        <button class="btn" data-ascoferta="${i}">${t("ascensaoOfferAcceptBtn")}</button>
      </div>
    </div>`;
  }).join("");
  return `
  <div class="panel angle" style="text-align:center;">
    <h1 class="hero" style="font-size:22px;">${t("ascensaoOfferTitle")}</h1>
    <p class="lead" style="margin-top:8px;">${t("ascensaoOfferLead")(c.ofertas.length)}</p>
    <div style="margin-top:14px;max-height:420px;overflow-y:auto;">${ofertasHTML}</div>
    <div class="btn-row" style="justify-content:center;margin-top:8px;">
      <button class="btn secondary" id="ascensao-offer-decline-btn">${t("ascensaoOfferDeclineBtn")}</button>
    </div>
  </div>
  `;
}
function ascensaoStageSummaryHTML(){
  const c = state.carreira;
  const s = c.stageSummary;
  const partidasHTML = (s.journey && s.journey.length) ? `
    <div class="pool-info" style="justify-content:center;margin-top:16px;"><span class="mono">${t("journeyLabel")}</span></div>
    <div class="journey-table" style="max-height:260px;overflow-y:auto;">
      ${s.journey.map(j=>`
        <div class="journey-row">
          <div class="jr-stage">${j.stageLabel}</div>
          <div class="jr-opp">${j.opponent}</div>
          <div class="jr-score">${j.score}</div>
          <div class="jr-result ${j.result==='W'?'win':'loss'}">${j.result}</div>
        </div>`).join("")}
    </div>` : "";
  return `
  <div class="panel angle" style="text-align:center;">
    <h1 class="hero" style="font-size:22px;">${s.nomeCompeticao}</h1>
    <p style="font-family:'Chakra Petch';font-weight:700;font-size:20px;color:var(--gold);margin:14px 0;">${s.label}</p>
    ${s.qualificadoLabel ? `<p style="font-family:'Chakra Petch';font-weight:700;font-size:15px;color:var(--muted);margin:-8px 0 14px;">${s.qualificadoLabel}</p>` : ''}
    ${s.mvp ? `
    <div class="mvp-card angle-sm">
      <div class="mvp-eyebrow">${t("mvpLabel")}</div>
      <div class="mvp-name">${s.mvp.name} ${playerFlag(s.mvp)}</div>
      <div class="mvp-role">${roleLabel(s.mvp.role)}</div>
      <div class="mvp-kda">${s.mvp.k}/${s.mvp.d}/${s.mvp.a}</div>
    </div>` : ''}
    ${partidasHTML}
    <div class="btn-row" style="justify-content:center;margin-top:18px;">
      <button class="btn" id="ascensao-stage-continue-btn">${t("ascensaoStageContinueBtn")}</button>
    </div>
  </div>
  `;
}
function ascensaoSeasonHTML(){
  const c = state.carreira;
  const lastEntry = c.historico[c.historico.length-1];
  const historicoHTML = c.historico.map(h=>`
    <div class="history-item" style="margin-bottom:8px;">
      <div class="pool-info" style="margin-bottom:0;">
        <span class="mono">${t("ascensaoSeasonLabel")(h.temporada)}</span>
        <span class="history-team">${h.time} (${h.regiao})</span>
      </div>
      ${h.stages ? '' : `<div style="margin-top:4px;color:var(--muted);font-size:12px;">${ascensaoStageName("kickoff")}: ${ascensaoKickoffLabel(h)}</div>`}
      ${ascensaoStagesRows(h)}
      ${h.mundialResultado ? `<div style="margin-top:2px;color:var(--muted);font-size:12px;">Champions: ${ascensaoResultLabel(h.mundialResultado)}</div>` : ''}
      ${h.copaResultado ? `<div style="margin-top:2px;color:var(--gold);font-size:12px;">${t("ascensaoWorldCupLabel")}: ${ascensaoResultLabel(h.copaResultado)}</div>` : ''}
    </div>
  `).join("");
  const partidasHTML = (lastEntry.journey && lastEntry.journey.length) ? `
    <div class="pool-info" style="justify-content:center;margin-top:16px;"><span class="mono">${t("journeyLabel")}</span></div>
    <div class="journey-table" style="max-height:220px;overflow-y:auto;">
      ${lastEntry.journey.map(j=>`
        <div class="journey-row">
          <div class="jr-stage">${j.stageLabel}</div>
          <div class="jr-opp">${j.opponent}</div>
          <div class="jr-score">${j.score}</div>
          <div class="jr-result ${j.result==='W'?'win':'loss'}">${j.result}</div>
        </div>`).join("")}
    </div>` : "";
  const isOver = c.temporada > 16;
  return `
  <div class="panel angle" style="text-align:center;">
    <h1 class="hero" style="font-size:22px;">${t("ascensaoSeasonLabel")(lastEntry.temporada)}</h1>
    <p class="lead" style="margin-top:8px;">${c.nome} ${countryFlag(c.nacionalidade)} — ${lastEntry.time}</p>
    <div class="test-stats" style="margin:14px 0;text-align:left;">
      ${lastEntry.stages ? '' : `<div class="test-stat-row"><span>${ascensaoStageName("kickoff")}</span><span class="mono" style="color:var(--gold);">${ascensaoKickoffLabel(lastEntry)}</span></div>`}
      ${ascensaoStagesRows(lastEntry, "row")}
      ${lastEntry.mundialResultado ? `<div class="test-stat-row"><span>Champions</span><span class="mono" style="color:var(--gold);">${ascensaoResultLabel(lastEntry.mundialResultado)}</span></div>` : ''}
      ${lastEntry.copaResultado ? `<div class="test-stat-row"><span>${t("ascensaoWorldCupLabel")}</span><span class="mono" style="color:var(--teal);">${ascensaoResultLabel(lastEntry.copaResultado)}</span></div>` : ''}
    </div>
    ${partidasHTML}
    <div class="history-list" style="text-align:left;margin-top:18px;max-height:220px;overflow-y:auto;">${historicoHTML}</div>
    <div class="btn-row" style="justify-content:center;margin-top:18px;flex-wrap:wrap;">
      ${isOver ? `
        <button class="btn" id="ascensao-finish-btn">${t("ascensaoSeeFinalBtn")}</button>
      ` : `
        <button class="btn" id="ascensao-continue-same-btn">${t("ascensaoContinueSameBtn")(lastEntry.time)}</button>
      `}
    </div>
  </div>
  `;
}

function regionalStandingsHTML(){
  const tr = state.tournament;
  const n = tr.regionalFormat.qualifiersPerGroup;
  const myLetter = tr.myGroupLetter;
  const otherLetter = myLetter==="A" ? "B" : "A";

  const tableRows = (ranking, groupIsMine) => ranking.map((s,i)=>{
    const classificado = i<n;
    const isMe = s.team.isPlayer;
    const roundDiff = s.roundsWon - s.roundsLost;
    return `
    <div class="standings-row ${isMe?'me':''} ${classificado?'qualified':''}">
      <span class="standings-pos">${t("ordinal")(i+1)}</span>
      <span class="standings-name">${s.team.name}${isMe?' <span class="mono" style="color:var(--crimson);">('+t("youLabel")+')</span>':''}</span>
      <span class="standings-pts">${s.points} ${t("ptsAbbrev")}</span>
      <span class="standings-wl mono">${t("standingsWLRow")(s.wins, s.losses)}</span>
      <span class="standings-rd mono">${roundDiff>=0?'+':''}${roundDiff}</span>
    </div>`;
  }).join("");

  return `
  <div class="panel angle">
    <h1 class="hero" style="font-size:22px;">${t("regionalStandingsTitle")}</h1>
    <p class="lead">${t("regionalStandingsLead")(n)}</p>

    <h3 style="font-family:'Chakra Petch';margin:16px 0 6px;">${t("groupWord")} ${myLetter} ${myLetter===tr.myGroupLetter?'':''}</h3>
    <div class="standings-table">
      <div class="standings-row standings-header mono">
        <span class="standings-pos">#</span>
        <span class="standings-name">${t("teamWord")}</span>
        <span class="standings-pts">${t("ptsAbbrev")}</span>
        <span class="standings-wl">${t("standingsWLHeader")}</span>
        <span class="standings-rd">${t("standingsRDHeader")}</span>
      </div>
      ${tableRows(tr.regionalGroups.myGroup.finalRanking, true)}
    </div>

    <h3 style="font-family:'Chakra Petch';margin:16px 0 6px;">${t("groupWord")} ${otherLetter}</h3>
    <div class="standings-table">
      <div class="standings-row standings-header mono">
        <span class="standings-pos">#</span>
        <span class="standings-name">${t("teamWord")}</span>
        <span class="standings-pts">${t("ptsAbbrev")}</span>
        <span class="standings-wl">${t("standingsWLHeader")}</span>
        <span class="standings-rd">${t("standingsRDHeader")}</span>
      </div>
      ${tableRows(tr.regionalGroups.otherGroup.finalRanking, false)}
    </div>

    <div class="btn-row" style="margin-top:16px;">
      <button class="btn" id="regional-standings-continue-btn">${t("regionalContinuePlayoffsBtn")}</button>
    </div>
  </div>
  `;
}

function ascensaoFinalHTML(){
  const c = state.carreira;
  const regionalTitles = c.historico.reduce((n,h)=>n+ascensaoRegionalTitleCount(h),0);
  const mundialTitles = c.historico.filter(h=>h.mundialResultado==="champion").length;
  const copaTitles = c.historico.filter(h=>h.copaResultado==="champion").length;
  const historicoHTML = c.historico.map(h=>`
    <div class="history-item" style="margin-bottom:8px;">
      <div class="pool-info" style="margin-bottom:0;">
        <span class="mono">${t("ascensaoSeasonLabel")(h.temporada)}</span>
        <span class="history-team">${h.time} (${h.regiao})</span>
      </div>
      ${h.stages ? '' : `<div style="margin-top:4px;color:var(--muted);font-size:12px;">${ascensaoStageName("kickoff")}: ${ascensaoKickoffLabel(h)}</div>`}
      ${ascensaoStagesRows(h)}
      ${h.mundialResultado ? `<div style="margin-top:2px;color:var(--muted);font-size:12px;">Champions: ${ascensaoResultLabel(h.mundialResultado)}</div>` : ''}
      ${h.copaResultado ? `<div style="margin-top:2px;color:var(--gold);font-size:12px;">${t("ascensaoWorldCupLabel")}: ${ascensaoResultLabel(h.copaResultado)}</div>` : ''}
    </div>
  `).join("");
  return `
  <div class="panel angle" style="text-align:center;">
    <h1 class="hero" style="font-size:22px;">${t("ascensaoFinalTitle")}</h1>
    <p class="lead" style="margin-top:8px;">${countryFlag(c.nacionalidade)} ${t("ascensaoFinalLead")(c.nome)}</p>
    <div class="test-stats" style="margin:14px 0;">
      <div class="test-stat-row"><span>${t("ascensaoMundialLabel")}</span><span class="mono" style="color:var(--gold);">${mundialTitles}</span></div>
      <div class="test-stat-row"><span>${t("ascensaoRegionalLabel")}</span><span class="mono" style="color:var(--gold);">${regionalTitles}</span></div>
      <div class="test-stat-row"><span>${t("ascensaoWorldCupLabel")}</span><span class="mono" style="color:var(--gold);">${copaTitles}</span></div>
    </div>
    <div class="history-list" style="text-align:left;margin-top:18px;max-height:340px;overflow-y:auto;">${historicoHTML}</div>
    <div class="btn-row" style="justify-content:center;margin-top:18px;">
      <button class="btn" id="ascensao-restart-btn">${t("playAgain")}</button>
    </div>
    <div class="share-row">
      <button class="share-btn" id="ascensao-share-x-btn">
        <svg width="15" height="15" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6 L26 26 M26 6 L6 26" stroke="currentColor" stroke-width="4.5" stroke-linecap="square"/>
        </svg>
        ${t("shareXBtn")}
      </button>
    </div>
  </div>
  `;
}
