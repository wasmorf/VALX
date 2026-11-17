/* ==========================================================
   handlers.js — Eventos de clique e formulários
   ========================================================== */

/* ---------------- HANDLERS ---------------- */
function attachHandlers(){
  document.querySelectorAll(".lang-btn").forEach(el=>{
    el.onclick = ()=>{ state.lang = el.dataset.lang; render(); };
  });
  document.querySelectorAll("[data-mode]").forEach(el=>{
    el.onclick = ()=>{
      const mode = el.dataset.mode;
      if(mode==="classico"){
        state.difficulty = "classico";
        state.regionalSelva = false;
        state.screen = "teamselect";
      } else if(mode==="selva"){
        state.screen = "selvaModeSelect";
      } else if(mode==="copa"){
        state.difficulty = "copa";
        state.screen = "selecaoselect";
      } else if(mode==="ascensao"){
        state.carreira = {nome:"", funcao:null, funcoesSecundarias:[], qualidades:[], regiao:null, nacao:null, nacionalidade:null, time:null, temporada:1, historico:[], campeoesMundiais:[], campeoesMundiaisCoach:[], campeoesRegionais:[], campeoesRegionaisCoach:[], orgRostersSnapshot: ascensaoBuildFreshSnapshot()};
        state.screen = "ascensaoCreate";
      } else if(mode==="regional"){
        state.regionalRegiao = null;
        state.regionalSelva = false;
        state.screen = "regionalSelect";
      }
      render();
    };
  });
  document.querySelectorAll("[data-selvamode]").forEach(el=>{
    el.onclick = ()=>{
      const sub = el.dataset.selvamode;
      if(sub==="classico"){
        state.difficulty = "selva";
        state.regionalSelva = false;
        state.screen = "teamselect";
      } else if(sub==="regional"){
        state.difficulty = "regional";
        state.regionalSelva = true;
        state.regionalRegiao = null;
        state.screen = "regionalSelect";
      }
      render();
    };
  });
  const selvaModeBackBtn = document.getElementById("selva-mode-back-btn");
  if(selvaModeBackBtn) selvaModeBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };
  const rulesBtn = document.getElementById("rules-btn");
  if(rulesBtn) rulesBtn.onclick = ()=>{
    state.screen = "rules";
    render();
  };
  const rulesBackBtn = document.getElementById("rules-back-btn");
  if(rulesBackBtn) rulesBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };
  const versionBadgeBtn = document.getElementById("version-badge-btn");
  if(versionBadgeBtn) versionBadgeBtn.onclick = ()=>{
    state.screen = "changelog";
    render();
  };
  const changelogBackBtn = document.getElementById("changelog-back-btn");
  if(changelogBackBtn) changelogBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };
  const historyBtn = document.getElementById("history-btn");
  if(historyBtn) historyBtn.onclick = async ()=>{
    state.campaignHistoryList = await loadCampaignHistory();
    state.screen = "history";
    render();
  };
  const historyBackBtn = document.getElementById("history-back-btn");
  if(historyBackBtn) historyBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };
  const creatorBtn = document.getElementById("creator-btn");
  if(creatorBtn) creatorBtn.onclick = ()=>{
    state.screen = "creator";
    render();
  };
  const creatorBackBtn = document.getElementById("creator-back-btn");
  if(creatorBackBtn) creatorBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };

  document.querySelectorAll(".team-option[data-selecao]").forEach(el=>{
    el.onclick = ()=>{ state.selecao = el.dataset.selecao; render(); };
  });
  document.querySelectorAll("[data-regiao]").forEach(el=>{
    el.onclick = ()=>{ state.regionalRegiao = el.dataset.regiao; render(); };
  });
  const regionalContinueBtn = document.getElementById("regional-continue-btn");
  if(regionalContinueBtn) regionalContinueBtn.onclick = ()=>{
    state.teamName = null;
    state.screen = "regionalTeamSelect";
    render();
  };
  const regionalBackBtn = document.getElementById("regional-back-btn");
  if(regionalBackBtn) regionalBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };
  const regionalTeamContinueBtn = document.getElementById("regional-team-continue-btn");
  if(regionalTeamContinueBtn) regionalTeamContinueBtn.onclick = ()=>{
    state.difficulty = "regional";
    const coachesDaRegiao = regionalCoachObjects(state.regionalRegiao);
    state.coachOptions = coachesDaRegiao.length > 5 ? shuffle(coachesDaRegiao).slice(0,5) : shuffle(coachesDaRegiao);
    state.headCoach = null; state.assistantCoach = null;
    state.screen = "coachselect";
    render();
  };
  const regionalTeamBackBtn = document.getElementById("regional-team-back-btn");
  if(regionalTeamBackBtn) regionalTeamBackBtn.onclick = ()=>{
    state.screen = "regionalSelect";
    render();
  };
  const selecaoContinueBtn = document.getElementById("selecao-continue-btn");
  if(selecaoContinueBtn) selecaoContinueBtn.onclick = ()=>{
    state.teamName = state.selecao;
    state.coachOptions = selecaoCoaches(state.selecao);
    state.headCoach = null; state.assistantCoach = null;
    state.screen = "coachselect";
    render();
  };
  const selecaoBackBtn = document.getElementById("selecao-back-btn");
  if(selecaoBackBtn) selecaoBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };

  const ascensaoBackBtn = document.getElementById("ascensao-back-btn");
  if(ascensaoBackBtn) ascensaoBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };
  const ascensaoNameInput = document.getElementById("ascensao-name-input");
  if(ascensaoNameInput) ascensaoNameInput.oninput = ()=>{
    state.carreira.nome = ascensaoNameInput.value;
    const btn = document.getElementById("ascensao-confirm-btn");
    if(btn) btn.disabled = !(state.carreira.nome.trim().length>0 && state.carreira.funcao && state.carreira.regiao && state.carreira.nacionalidade && (Object.keys(ASCENSAO_SUB_SLOTS[state.carreira.regiao]).length<=1 || state.carreira.subregiao));
  };
  document.querySelectorAll("[data-ascfuncao]").forEach(el=>{
    el.onclick = ()=>{
      state.carreira.funcao = el.dataset.ascfuncao;
      state.carreira.funcoesSecundarias = state.carreira.funcoesSecundarias.filter(f=>f!==state.carreira.funcao);
      render();
    };
  });
  document.querySelectorAll("[data-ascfuncaosecundaria]").forEach(el=>{
    el.onclick = ()=>{
      const rk = el.dataset.ascfuncaosecundaria;
      const c = state.carreira;
      if(c.funcoesSecundarias.includes(rk)) c.funcoesSecundarias = c.funcoesSecundarias.filter(f=>f!==rk);
      else c.funcoesSecundarias.push(rk);
      render();
    };
  });
  document.querySelectorAll("[data-ascqualidade]").forEach(el=>{
    el.onclick = ()=>{
      const tag = el.dataset.ascqualidade;
      const c = state.carreira;
      if(c.qualidades.includes(tag)){
        c.qualidades = c.qualidades.filter(q=>q!==tag);
      } else if(c.qualidades.length<3){
        c.qualidades.push(tag);
      }
      render();
    };
  });
  document.querySelectorAll("[data-ascregiao]").forEach(el=>{
    el.onclick = ()=>{ state.carreira.regiao = el.dataset.ascregiao; state.carreira.subregiao = null; render(); };
  });
  document.querySelectorAll("[data-ascsub]").forEach(el=>{
    el.onclick = ()=>{ state.carreira.subregiao = el.dataset.ascsub; render(); };
  });
  document.querySelectorAll("[data-ascpais]").forEach(el=>{
    el.onclick = ()=>{
      const code = el.dataset.ascpais;
      state.carreira.nacionalidade = code;
      state.carreira.nacao = WC_COUNTRY_TO_SELECAO[code];
      render();
    };
  });
  const ascensaoConfirmBtn = document.getElementById("ascensao-confirm-btn");
  if(ascensaoConfirmBtn) ascensaoConfirmBtn.onclick = ()=>{
    const c = state.carreira;
    const subKeys = Object.keys(ASCENSAO_SUB_SLOTS[c.regiao]);
    const noSub = o=> subKeys.length<=1 || ORG_SUB[o]===c.subregiao;
    const partners = TEAM_REGIONS[c.regiao].filter(noSub), challengers = (TERRITORY_CHALLENGERS[c.regiao]||[]).filter(noSub);
    // parceiros têm mais chance (peso 3) do que os não parceiros (peso 1)
    const pesos = [...partners.map(()=>3), ...challengers.map(()=>1)];
    c.time = weightedSampleWithoutReplacement([...partners, ...challengers], pesos, 1)[0];
    state.screen = "ascensaoReveal";
    render();
  };
  const ascensaoStartSeasonBtn = document.getElementById("ascensao-start-season-btn");
  if(ascensaoStartSeasonBtn) ascensaoStartSeasonBtn.onclick = ()=>{
    setupAscensaoRegionalStage();
    render();
  };
  const ascensaoContinueSameBtn = document.getElementById("ascensao-continue-same-btn");
  if(ascensaoContinueSameBtn) ascensaoContinueSameBtn.onclick = ()=>{
    if(ascensaoRollTransferOffer()){
      state.screen = "ascensaoOffer";
    } else {
      setupAscensaoRegionalStage();
    }
    render();
  };
  const ascensaoRoleSwitchYesBtn = document.getElementById("ascensao-roleswitch-yes");
  if(ascensaoRoleSwitchYesBtn) ascensaoRoleSwitchYesBtn.onclick = ()=>{
    const c = state.carreira;
    c.funcaoAtual = c.pendingRoleSwitchData.novaFuncao;
    const precomputado = {transferencias: c.pendingRoleSwitchData.transferencias, transferenciasCoach: c.pendingRoleSwitchData.transferenciasCoach};
    c.pendingRoleSwitchData = null;
    setupAscensaoRegionalStage(precomputado);
    render();
  };
  const ascensaoRoleSwitchNoBtn = document.getElementById("ascensao-roleswitch-no");
  if(ascensaoRoleSwitchNoBtn) ascensaoRoleSwitchNoBtn.onclick = ()=>{
    const c = state.carreira;
    const precomputado = {transferencias: c.pendingRoleSwitchData.transferencias, transferenciasCoach: c.pendingRoleSwitchData.transferenciasCoach};
    c.pendingRoleSwitchData = null;
    setupAscensaoRegionalStage(precomputado);
    render();
  };
  document.querySelectorAll("[data-ascoferta]").forEach(el=>{
    el.onclick = ()=>{
      const oferta = state.carreira.ofertas[parseInt(el.dataset.ascoferta,10)];
      state.carreira.time = oferta.org;
      state.carreira.regiao = oferta.regiao;
      state.carreira.funcaoAtual = oferta.funcao;
      state.carreira.ofertas = null;
      setupAscensaoRegionalStage();
      render();
    };
  });
  const ascensaoOfferDeclineBtn = document.getElementById("ascensao-offer-decline-btn");
  if(ascensaoOfferDeclineBtn) ascensaoOfferDeclineBtn.onclick = ()=>{
    state.carreira.ofertas = null;
    setupAscensaoRegionalStage();
    render();
  };
  const ascensaoStageContinueBtn = document.getElementById("ascensao-stage-continue-btn");
  if(ascensaoStageContinueBtn) ascensaoStageContinueBtn.onclick = ()=>{
    ascensaoAdvanceFromSummary();
    render();
  };
  const ascensaoFinishBtn = document.getElementById("ascensao-finish-btn");
  if(ascensaoFinishBtn) ascensaoFinishBtn.onclick = ()=>{
    state.screen = "ascensaoFinal";
    saveAscensaoCareerRecord();
    render();
  };
  const ascensaoRestartBtn = document.getElementById("ascensao-restart-btn");
  if(ascensaoRestartBtn) ascensaoRestartBtn.onclick = ()=>{
    resetToIntro();
    render();
  };
  const regionalStandingsContinueBtn = document.getElementById("regional-standings-continue-btn");
  if(regionalStandingsContinueBtn) regionalStandingsContinueBtn.onclick = ()=>{
    confirmRegionalStandings();
    render();
  };

  document.querySelectorAll(".team-option[data-team]").forEach(el=>{
    el.onclick = ()=>{ state.teamName = el.dataset.team; render(); };
  });
  const teamContinueBtn = document.getElementById("team-continue-btn");
  if(teamContinueBtn) teamContinueBtn.onclick = ()=>{
    state.coachOptions = shuffle(COACHES).slice(0, Math.round(COACHES.length/2));
    state.headCoach = null; state.assistantCoach = null;
    state.screen = "coachselect";
    render();
  };
  const teamBackBtn = document.getElementById("team-back-btn");
  if(teamBackBtn) teamBackBtn.onclick = ()=>{
    state.screen = "intro";
    render();
  };

  document.querySelectorAll(".coach-option").forEach(el=>{
    el.onclick = ()=>{ state.headCoach = el.dataset.coach; render(); };
  });
  const coachContinueBtn = document.getElementById("coach-continue-btn");
  if(coachContinueBtn) coachContinueBtn.onclick = ()=>{
    if(state.difficulty==="copa"){
      state.remainingCoaches = selecaoCoaches(state.selecao).filter(c=>c!==state.headCoach);
      state.poolSource = selecaoPlayerObjects(state.selecao);
      state.pool = weightedDrawOrder(state.poolSource);
    } else if(state.difficulty==="regional"){
      state.remainingCoaches = shuffle(regionalCoachObjects(state.regionalRegiao).filter(c=>c!==state.headCoach));
      state.poolSource = regionalPlayerObjects(state.regionalRegiao);
      state.pool = weightedDrawOrder(state.poolSource);
    } else {
      state.remainingCoaches = shuffle(COACHES.filter(c=>c!==state.headCoach));
      state.poolSource = POOL;
      state.pool = weightedDrawOrder(state.poolSource);
    }
    state.roster = SLOT_ORDER.map(()=>null);
    state.currentCandidate = null;
    state.currentCandidates = [];
    state.confirmingCandidate = null;
    state.pendingSlotChoice = false;
    state.skipsUsed = 0;
    state.screen = "draft";
    render();
  };
  const coachBackBtn = document.getElementById("coach-back-btn");
  if(coachBackBtn) coachBackBtn.onclick = ()=>{
    if(state.difficulty==="copa") state.screen = "selecaoselect";
    else if(state.difficulty==="regional") state.screen = "regionalTeamSelect";
    else state.screen = "teamselect";
    render();
  };

  const drawBtn = document.getElementById("draw-btn");
  if(drawBtn) drawBtn.onclick = ()=>{
    let batch;
    if(state.difficulty==="copa"){
      // Seleções são pequenas — nunca "perde" ninguém de vista: recalcula do zero quem ainda
      // não foi escalado e tem vaga aberta compatível, em vez de consumir o pool aos poucos.
      const draftedNames = new Set(state.roster.filter(Boolean).map(p=>p.name));
      const stillAvailable = selecaoPlayerObjects(state.selecao).filter(c=>{
        if(draftedNames.has(c.name)) return false;
        return SLOT_ORDER.some((roleKey,i)=>!state.roster[i] && c.roles.includes(roleKey));
      });
      batch = shuffle(stillAvailable).slice(0,5);
    } else {
      // sorteio inteligente: só entram candidatos com pelo menos 1 vaga aberta compatível;
      // quem não tem vaga nenhuma disponível é descartado do BATCH (não do pool geral).
      batch = [];
      while(batch.length<5){
        if(state.pool.length===0){
          // pool esgotado sem fechar o elenco — redesenha do zero a partir da fonte original,
          // trazendo de volta quem foi descartado antes (agora pode servir, já que outras
          // vagas fecharam nesse meio tempo) — exclui quem já está escalado E quem já apareceu
          // nesse mesmo sorteio (senão o redesenho pode repetir alguém dentro da mesma leva).
          const draftedNames = new Set(state.roster.filter(Boolean).map(p=>p.name));
          const batchNames = new Set(batch.map(p=>p.name));
          const restante = state.poolSource.filter(p=>!draftedNames.has(p.name) && !batchNames.has(p.name));
          if(restante.length===0) break; // ninguém mais disponível de verdade
          state.pool = weightedDrawOrder(restante);
        }
        const c = state.pool.pop();
        const hasOpenSlot = SLOT_ORDER.some((roleKey,i)=>!state.roster[i] && c.roles.includes(roleKey));
        if(hasOpenSlot) batch.push(c);
      }
    }
    state.currentCandidates = batch;
    render();
  };
  document.querySelectorAll("[data-pick]").forEach(el=>{
    el.onclick = ()=>{
      const name = el.dataset.pick;
      const c = state.currentCandidates.find(p=>p.name===name);
      state.confirmingCandidate = c;
      render();
    };
  });
  const confirmDraftBtn = document.getElementById("confirm-draft-btn");
  if(confirmDraftBtn) confirmDraftBtn.onclick = ()=>{
    const c = state.confirmingCandidate;
    state.confirmingCandidate = null;
    state.currentCandidates = [];
    let openSlots = SLOT_ORDER.map((roleKey,i)=>i).filter(i=>!state.roster[i] && c.roles.includes(SLOT_ORDER[i]));
    if(state.difficulty==="copa" && openSlots.length>1){
      // Seleções são pequenas — só oferece vagas que não travem o resto do draft depois.
      const draftedNames = new Set(state.roster.filter(Boolean).map(p=>p.name));
      const selecaoPlayers = selecaoPlayerObjects(state.selecao).filter(p=>!draftedNames.has(p.name) && p.name!==c.name);
      openSlots = openSlots.filter(i=>{
        const remainingRoles = SLOT_ORDER.filter((rk,idx)=>!state.roster[idx] && idx!==i);
        return canCompleteRoster(remainingRoles, selecaoPlayers);
      });
    }
    if(openSlots.length===1){
      state.roster[openSlots[0]] = c;
      state.currentCandidate = null;
    } else {
      state.currentCandidate = c;
      state.pendingSlotChoice = true;
    }
    render();
  };
  const backToListBtn = document.getElementById("back-to-list-btn");
  if(backToListBtn) backToListBtn.onclick = ()=>{
    state.confirmingCandidate = null;
    render();
  };
  document.querySelectorAll("[data-slotidx]").forEach(el=>{
    el.onclick = ()=>{
      const idx = parseInt(el.dataset.slotidx, 10);
      state.roster[idx] = state.currentCandidate;
      state.currentCandidate = null;
      state.pendingSlotChoice = false;
      render();
    };
  });
  const skipBatchBtn = document.getElementById("skip-batch-btn");
  if(skipBatchBtn) skipBatchBtn.onclick = ()=>{
    state.skipsUsed++;
    state.currentCandidates = [];
    render();
  };
  const toMatchBtn = document.getElementById("to-match-btn");
  if(toMatchBtn) toMatchBtn.onclick = ()=>{
    setupTournament();
    state.screen = "match";
    render();
  };

  const simRoundBtn = document.getElementById("sim-round-btn");
  if(simRoundBtn) simRoundBtn.onclick = ()=>{ simulateRound(); render(); };
  const simAllBtn = document.getElementById("sim-all-btn");
  if(simAllBtn) simAllBtn.onclick = ()=>{
    while(!isMapDecided(state.matchScore.us, state.matchScore.them)){ simulateRound(); }
    render();
  };
  const nextMapBtn = document.getElementById("next-map-btn");
  if(nextMapBtn) nextMapBtn.onclick = ()=>{ finalizeMap(); startNextMap(); render(); };
  const continueBtn = document.getElementById("continue-btn");
  if(continueBtn) continueBtn.onclick = ()=>{ finalizeMap(); handleContinue(); render(); };

  const restartBtn = document.getElementById("restart-btn");
  if(restartBtn) restartBtn.onclick = ()=>{
    resetToIntro();
    render();
  };
  const brandHomeBtn = document.getElementById("brand-home-btn");
  if(brandHomeBtn) brandHomeBtn.onclick = ()=>{
    resetToIntro();
    render();
  };
  const ascensaoShareXBtn = document.getElementById("ascensao-share-x-btn");
  if(ascensaoShareXBtn) ascensaoShareXBtn.onclick = ()=>{
    const text = buildAscensaoShareText();
    const webUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    if(isMobile){
      window.location.href = webUrl;
    } else {
      window.open(webUrl, "_blank", "noopener");
    }
  };
  const shareXBtn = document.getElementById("share-x-btn");
  if(shareXBtn) shareXBtn.onclick = ()=>{
    const text = buildShareText();
    const webUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    // Usa sempre a URL normal do X — se o app estiver instalado, o próprio celular (iOS/Android)
    // já abre ele automaticamente a partir desse link (Universal Links), sem precisar de nenhum
    // truque de esquema customizado (tipo "twitter://"), que é frágil e o Safari bloqueia quando
    // acionado de forma assíncrona (ex: dentro de um setTimeout), mesmo vindo de um clique real.
    if(isMobile){
      window.location.href = webUrl;
    } else {
      window.open(webUrl, "_blank", "noopener");
    }
  };
}
