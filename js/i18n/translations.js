/* ==========================================================
   translations.js — Textos em português, inglês e espanhol
   ========================================================== */

/* ---------------- I18N ---------------- */
const I18N = {
  pt:{
    phase_intro:"SETUP", phase_rules:"REGRAS", phase_teamselect:"EQUIPE", phase_draft:"DRAFT", phase_match:"PARTIDA", phase_end:"RESULTADO",
    rulesLink:"📖 Ver regras completas",
    rulesTitle:"Regras e Mecânicas",
    changelogTitle:"Notas de Atualização",
    rulesBackBtn:"Voltar",
    historyLink:"📜 Campanhas anteriores",
    historyTitle:"Suas Campanhas",
    historyEmpty:"Nenhuma campanha salva ainda. Jogue até o fim pra registrar seu resultado aqui.",
    creatorTitle:"Sobre o Criador",
    creatorBody:"Meu nome é Wasmorf. Sou estudante de Análise e Desenvolvimento de Sistemas (ADS), e o VALX foi um projeto que fiz com muito carinho por conta própria. Estou muito feliz com o resultado até aqui, e espero de coração que dê certo. Obrigado por jogar!",
    hero:"Monte seu Super Time e busque o título mundial.",
    lead:"Escale seus 5 Pro Players e corra atrás do título Mundial. Cada escolha pesa — a diferença entre um super time e um fracasso é mais fina do que parece. Overall não conta a história toda.",
    diffClassicoTitle:"Modo Clássico",
    diffClassicoDesc:"Jogue o Mundial",
    diffCopaTitle:"Esports Nations Cup",
    diffCopaDesc:"Jogue por uma Seleção",
    diffSelvaTitle:"Modo Selva",
    diffSelvaDesc:"Atributos ocultos",
    disclaimer:"Nomes de jogadores e organizações profissionais reais são usados de forma homenageante, em um jogo de simulação de fã. Atributos são estimativas fictícias para fins de jogo, não estatísticas oficiais.",
    teamSelectTitle:"Escolha o nome da sua equipe",
    teamSelectLead:"Essa será a identidade do seu time durante toda a campanha.",
    selecaoSelectTitle:"Escolha sua Seleção",
    selecaoSelectLead:"Essa vai ser sua Seleção nacional durante toda a Esports Nations Cup.",
    ascensaoModeBtn:"Rumo à Ascensão",
    ascensaoMundialLabel:"Mundial",
    ascensaoRegionalLabel:"Regional",
    ascensaoModeDesc:"Faça sua História",
    regionalModeBtn:"Modo Regional",
    regionalModeDesc:"Jogue o Regional",
    regionalSelectTitle:"Escolha a Região",
    regionalSelectLead:"O draft vai usar só craques que jogam de verdade nessa região.",
    regionalTeamSelectTitle:regiao=>`Escolha o Time (${regiao})`,
    regionalTeamSelectLead:"Esse será o nome do seu time na campanha.",
    regionalRoundLabel:(n,total)=>`Rodada ${n} de ${total}`,
    playersCountLabel:n=>`${n} craques`,
    selvaModeSelectTitle:"Escolha o Selva",
    selvaModeSelectLead:"Os dois escondem overall e qualidades durante o draft — só muda o formato do torneio.",
    selvaModeClassicoTitle:"Selva Clássico",
    selvaModeClassicoDesc:"Modo Clássico com Atributos Ocultos",
    selvaModeRegionalTitle:"Regional Selva",
    selvaModeRegionalDesc:"Modo Regional com Atributos Ocultos",
    regionalStandingsTitle:"Fase de Grupos Encerrada",
    regionalStandingsLead:n=>`Os ${n} melhores de cada grupo avançam para os playoffs.`,
    youLabel:"você",
    ptsAbbrev:"PTS",
    teamWord:"Time",
    standingsWLHeader:"V-D",
    standingsRDHeader:"SR",
    standingsWLRow:(v,d)=>`${v}V-${d}D`,
    ordinal:n=>`${n}º`,
    regionalContinuePlayoffsBtn:"Continuar para os playoffs",
    ascensaoCreateTitle:"Crie seu Craque",
    ascensaoCreateLead:"Monte seu jogador e comece a carreira — 16 temporadas rumo ao topo.",
    ascensaoNameLabel:"Nome",
    ascensaoNamePlaceholder:"Nome do seu craque",
    ascensaoRoleLabel:"Função",
    ascensaoSecondaryRolesLabel:"Funções secundárias",
    ascensaoSecondaryRoleLabel:"Funções secundárias (opcional)",
    ascensaoQualityLabel:"Qualidades táticas ",
    ascensaoRegionLabel:"Região",
    ascensaoNationLabel:"Nacionalidade",
    ascensaoNationLead:"A cada 3 temporadas (a partir da 2ª), você representa a Seleção do seu país na Esports Nations Cup.",
    ascensaoConfirmBtn:"Confirmar e sortear time",
    ascensaoRevealTitle:"Bem-vindo!",
    ascensaoRevealLead:(nome,time,regiao)=>`${nome} acaba de assinar com a ${time} (${regiao})!`,
    ascensaoTeamLabel:"Time",
    ascensaoStartSeasonBtn:"Começar Temporada 1",
    ascensaoSeasonLabel:n=>`Temporada ${n}`,
    ascensaoContinueSameBtn:time=>`Continuar na ${time}`,
    ascensaoOfferTitle:"Oferta de Transferência!",
    ascensaoOfferLead:n=>`Você recebeu ${n} oferta${n===1?"":"s"} de transferência! Escolha uma pra aceitar:`,
    ascensaoOfferAcceptBtn:"Aceitar oferta",
    ascensaoOfferRoleLabel:"Você jogaria de",
    ascensaoOfferCoachLabel:"Técnico atual",
    ascensaoRoleSwitchTitle:"Troca de função?",
    ascensaoRoleSwitchBody:(atual,nova)=>`Com a contratação dessa temporada, o time ficaria melhor com você jogando de ${nova} em vez de ${atual}. Quer trocar?`,
    ascensaoRoleSwitchYesBtn:(nova)=>`Jogar de ${nova}`,
    ascensaoRoleSwitchNoBtn:(atual)=>`Continuar de ${atual}`,
    ascensaoOfferDeclineBtn:"Recusar",
    ascensaoSeeFinalBtn:"Ver resumo da carreira",
    ascensaoStageContinueBtn:"Continuar",
    ascensaoWorldCupLabel:"Esports Nations Cup",
    ascensaoFinalTitle:"Fim de Carreira",
    ascensaoFinalLead:(nome)=>`${nome} encerrou a carreira de 16 temporadas.`,
    ascensaoShareHeadline:nome=>`${nome} encerrou a carreira no Rumo à Ascensão!`,
    ascensaoShareFuncoesLabel:"Funções",
    ascensaoShareMundialLabel:"Títulos Mundiais",
    ascensaoShareRegionalLabel:"Títulos Regionais",
    ascensaoShareCopaLabel:"Títulos de Esports Nations Cup",
    copaNotReady:(n,names)=>`O Modo Esports Nations Cup ainda não está pronto — precisa de 16 Seleções completas pra fechar o formato do torneio, e hoje só ${n} conseguem fechar time de 5. Falta reforço em: ${names}.`,
    teamSelectContinue:"Continuar para o draft",
    phase_coachselect:"TÉCNICO",
    coachSelectTitle:"Escolha o Head Coach",
    coachSelectLead:"Escolha seu HeadCoach",
    coachSelectLeadCopa:"Esses são os técnicos disponíveis pra sua Seleção — escolha um pra liderar o time.",
    coachSelectContinue:"Continuar para o draft",
    headCoachLabel:"HEAD COACH",
    poolLabel:"Craques no pool:",
    filledLabel:n=>`${n}/5 escalados`,
    rosterComplete:"Escalação completa. Overall do time:",
    toMatchBtn:"Ir para o Mundial",
    drawLead:"Sorteie os próximos craques disponíveis para avaliar.",
    drawBtn:"Sortear Players",
    pickOneLead:"Escolha um craque para escalar:",
    poolEmpty:"Pool esgotado.",
    skipBtn:"Pular",
    skipsLeftLabel:n=>`Pulos restantes: ${n}`,
    chooseSlotPrompt:name=>`Em qual vaga encaixar ${name}?`,
    confirmDraftPrompt:name=>`Confirmar escalação de ${name}?`,
    confirmBtn:"Confirmar",
    backBtn:"Voltar",
    alreadyPlayedWith:"Já foi campeão junto",
    hiddenStats:"Atributos ocultos neste modo — confie no nome.",
    vs:"VS", rostersLabel:"K / D / A",
    recordSingleMapUs:(name,kills,prevKills,prevHolder)=>`🔥 NOVO RECORDE! ${name} fechou o mapa com ${kills} abates, superando os ${prevKills} de ${prevHolder} — o novo recorde da campanha.`,
    recordSingleMapThem:(name,kills,prevKills,prevHolder)=>`😮 O ADVERSÁRIO BATEU O RECORDE! ${name}, do time rival, fechou o mapa com ${kills} abates, superando os ${prevKills} de ${prevHolder}. Esse agora é o recorde a bater na sua campanha.`,
    recordSeriesUs:(name,kills,prevKills,prevHolder,bo)=>`🔥 NOVO RECORDE! ${name} fechou a série com ${kills} abates, superando os ${prevKills} de ${prevHolder} — o recorde de uma série ${bo} na campanha.`,
    recordSeriesThem:(name,kills,prevKills,prevHolder,bo)=>`😮 O ADVERSÁRIO BATEU O RECORDE! ${name}, do time rival, fechou a série com ${kills} abates, superando os ${prevKills} de ${prevHolder} — novo recorde de série ${bo} na sua campanha.`,
    simRoundBtn:"Simular próxima rodada",
    simAllBtn:"Simular mapa inteiro",
    nextMapBtn:"Próximo mapa",
    mapsScoreLabel:(a,b)=>`Mapas ${a}-${b}`,
    sideAttack:"ATAQUE",
    sideDefense:"DEFESA",
    resultWin:"VITÓRIA", resultLoss:"DERROTA",
    continueBtn:"Continuar",
    championTitle:"CAMPEÃO MUNDIAL",
    regionalChampionTitle:regiao=>`CAMPEÃO DO REGIONAL ${regiao}`,
    championLead:"Seu superteam venceu todos os confrontos da campanha e levantou o título.",
    playAgain:"Jogar novamente",
    mvpLabel:"MVP DA CAMPANHA",
    journeyLabel:"CAMINHO NA COMPETIÇÃO",
    tryAgain:"Tentar novamente",
    roles:{duelist:"Duelista", flex:"Flex", initiator:"Iniciador", sentinel:"Sentinela", controller:"Controlador"},
    tags:{mm:"Mira Monstra", entry:"Entry", operator:"Operator", clutch:"Clutch", igl:"IGL", lurker:"Lurker", utility:"Utilidade", campeao_mundial:"Campeão Mundial", campeao_regional:"Campeão Regional"},
    groupWord:"Grupo",
    groupStageTag:"FASE DE GRUPOS",
    playoffsTag:"PLAYOFFS",
    labels:{
      ubR1:"Upper Bracket — Rodada 1", ubQuarter:"Upper Bracket — Quartas", lbR3:"Lower Bracket — Rodada 3", lbR4:"Lower Bracket — Rodada 4", ubSemi:"Upper Bracket — Semifinal", ubFinal:"Upper Bracket — Final",
      groupR1:"Primeira Fase", groupUpper:"Upper (classifica)", groupLower:"Lower (eliminação)", groupDecider:"Decisão do grupo",
      lbR1:"Lower Bracket — Rodada 1", lbR2:"Lower Bracket — Rodada 2", lbSemi:"Lower Bracket — Semifinal", lbFinal:"Lower Bracket — Final",
      grandFinal:"Grande Final",
    },
    groupsEliminatedTitle:"ELIMINADO NA FASE DE GRUPOS",
    ascensaoRegionalGroupsTitle:"ELIMINADO NA FASE DE GRUPOS REGIONAL",
    ascensaoRegionalChampionTitle:"CAMPEÃO REGIONAL",
    ascensaoRegionalRunnerupTitle:"VICE-CAMPEÃO REGIONAL",
    ascensaoEliminatedPrefix:"ELIMINADO",
    ascensaoQualifiedTitle:"CLASSIFICADO PRO MUNDIAL",
    ascensaoRegionalPlayoffsTitle:"NÃO SE CLASSIFICOU PRO MUNDIAL",
    groupsEliminatedLead:"Seu time ficou fora do Top 2 do Grupo e não avançou aos playoffs.",
    playoffsEliminatedTitle:"ELIMINADO NOS PLAYOFFS",
    playoffsEliminatedLead:stage=>`Seu time caiu n${stage.toLowerCase().startsWith("upper")||stage.toLowerCase().startsWith("lower")?"a":"o"} ${stage} e foi eliminado do Mundial.`,
    runnerUpTitle:"VICE-CAMPEÃO MUNDIAL",
    regionalRunnerUpTitle:regiao=>`VICE-CAMPEÃO DO REGIONAL ${regiao}`,
    runnerUpLead:"Seu time chegou à Grande Final mas não conseguiu erguer a taça desta vez.",
    shareHeadlineChampion:"FUI CAMPEÃO MUNDIAL no VALX 🏆",
    shareHeadlineRegionalChampion:regiao=>`FUI CAMPEÃO DO REGIONAL ${regiao} no VALX 🏆`,
    shareHeadlineRunnerup:"FUI VICE-CAMPEÃO MUNDIAL no VALX 🥈",
    shareHeadlineRegionalRunnerup:regiao=>`FUI VICE-CAMPEÃO DO REGIONAL ${regiao} no VALX 🥈`,
    shareHeadlinePlayoffs:stage=>`FUI ELIMINADO NOS PLAYOFFS (${stage}) no VALX`,
    shareHeadlineGroups:"FUI ELIMINADO NA FASE DE GRUPOS no VALX",
    shareModeLabel:"Modo",
    shareCampaignLabel:"Campanha",
    shareMapsLabel:"Mapas",
    shareOverallLabel:"Overall",
    shareMvpLabel:"MVP",
    shareTeamMemberLabel:role=>`${role}`,
    shareCoachLabel:"Coach",
    shareCta:"Tente ganhar o Mundial você também",
    shareCtaRegional:"Tente ganhar o Regional você também",
    shareCtaCopa:"Tente ganhar a Esports Nations Cup você também",
    ascensaoShareCta:"Faça sua História também",
    shareXBtn:"Compartilhar no X",
    rulesSections:[
      {title:"Equipe e Head Coach", body:`
        <p>Você escolhe o nome da sua equipe entre 16 organizações reais — as outras 15 viram suas adversárias no Mundial. Em seguida, 4 técnicos são sorteados pra você escolher 1; os outros 15 vão pras equipes rivais. Cada técnico dá um bônus fixo (e escondido) no rating do time — vale pra qualquer equipe que tiver aquele coach. Técnicos que já foram <strong>Campeões Mundiais</strong> dão um bônus extra nesse buff. São considerados títulos mundiais: <strong>Champions, Masters e EWC</strong>.</p>
      `},
      {title:"O Draft", body:`
        <p>O time tem 5 vagas fixas: <strong>Duelista, Flex, Iniciador, Controlador, Sentinela</strong>. Um craque só pode entrar numa vaga cuja função ele joga — muitos jogam mais de uma.</p>
        <p>A cada sorteio aparecem <strong>5 opções</strong>, e o jogo é inteligente: só mostra craques que têm pelo menos uma vaga aberta compatível. Você pode pular o grupo de 5 no máximo <strong>2 vezes</strong> em todo o draft.</p>
      `},
      {title:"Qualidades Táticas", body:`
        <ul>
          <li><strong>Mira Monstra (MM):</strong> craque de mira absurda — mais chance de partidas monstruosas.</li>
          <li><strong>Entry:</strong> agressivo, abre o round — fortalece o ataque, principalmente no Duelista.</li>
          <li><strong>Operator:</strong> especialista na precisão — fortalece a defesa.</li>
          <li><strong>Clutch:</strong> fecha rounds sob pressão.</li>
          <li><strong>IGL:</strong> o cérebro tático do time.</li>
          <li><strong>Lurker:</strong> joga isolado, flanqueia — importante no Sentinela.</li>
          <li><strong>Utilidade:</strong> uso de habilidades do time.</li>
          <li><strong>Campeão Mundial:</strong> já ergueu uma taça antes — experiência que pesa.</li>
        </ul>
      `},
      {title:"Sinergias da Equipe (buffs e nerfs)", body:`
        <p>A composição do seu elenco afeta silenciosamente o ataque e a defesa em cada rodada — e o time alterna de lado a cada 12 rounds, igual numa partida real.</p>
        <div class="rules-good">✓ VANTAGENS</div>
        <ul>
          <li>Duelista + Iniciador na equipe: buff no ataque.</li>
          <li>Duelista e Iniciador do mesmo país, ou que já foram Campeões Mundiais juntos: buff geral extra (se os dois ao mesmo tempo, um pouco mais ainda).</li>
          <li>Exatamente 1 jogador com Operator (Duelista ou Sentinela): buff na defesa.</li>
          <li>2 ou mais jogadores com Clutch: buff geral.</li>
          <li>Ter Campeões Mundiais no elenco: buff geral, cresce a cada campeão.</li>
          <li>Duelista com Entry: buff no ataque.</li>
          <li>Jogadores com Utilidade: buff geral, cresce a cada um — sem limite.</li>
          <li>Sentinela com Lurker: buff geral.</li>
          <li>Craques com Mira Monstra: buff geral, sem limite.</li>
        </ul>
        <div class="rules-bad">✗ DESVANTAGENS</div>
        <ul>
          <li>Duelista <em>e</em> Sentinela usando Operator ao mesmo tempo: nerf geral.</li>
          <li>Nenhum jogador com IGL: nerf geral.</li>
          <li>1 ou 2 jogadores com IGL: buff geral (time bem liderado).</li>
          <li>3 ou mais jogadores com IGL: nerf geral (não vale nas Seleções da Esports Nations Cup).</li>
          <li>Duelista sem Entry: nerf no ataque.</li>
          <li>Sentinela sem Lurker: nerf geral.</li>
        </ul>
      `},
      {title:"Química de Elenco (país e time real)", body:`
        <p>Além das sinergias de composição, existe um bônus extra e silencioso baseado em dados reais do vlr.gg: craques do <strong>mesmo país</strong> ganham um pequeno buff, e craques que <strong>já foram campeões mundiais juntos</strong> — no mesmo elenco que ergueu a taça de verdade — ganham um buff ainda maior. O Head Coach também entra nessa conta, se ele tiver treinado algum desses elencos campeões.</p>
        <p>Importante: essa parte de "já jogou junto" não vale pra qualquer combinação de craques que passaram pelo mesmo time em épocas diferentes — é específica dos elencos que <strong>foram Campeões Mundiais juntos</strong> (ex: a LOUD de 2022, a Evil Geniuses de 2023). São considerados títulos mundiais: <strong>Champions, Masters e EWC</strong>. A cobertura desse banco de dados é parcial e vai crescendo aos poucos.</p>
      `},
      {title:"Formato do Mundial", body:`
        <p>16 equipes (você + 15 adversárias) divididas em <strong>4 grupos de 4</strong>. Você enfrenta os outros 3 do seu grupo; os demais jogos e grupos são resolvidos automaticamente. O <strong>Top 2</strong> de cada grupo (8 times) avança aos playoffs.</p>
        <p>Os playoffs são de <strong>dupla eliminação</strong> (Upper/Lower Bracket): perder na Upper te derruba pra Lower (ainda vivo); perder na Lower te elimina. Todas as partidas são <strong>MD3</strong>, exceto a Final da Lower Bracket e a Grande Final, que são <strong>MD5</strong>.</p>
        <p>Cada mapa vai até <strong>13 rounds</strong> — mas se empatar em <strong>12-12</strong>, vai pra <strong>prorrogação</strong>: ninguém fecha o mapa só chegando em 13, precisa abrir <strong>2 rounds de vantagem</strong> (13-12 não é suficiente; só fecha em 14-12, ou 15-13, e assim por diante), igual no jogo de verdade.</p>
      `},
      {title:"Recordes Reais", body:`
        <p>Existem 3 recordes reais do cenário profissional: <strong>47 abates</strong> num mapa único, <strong>82</strong> numa série MD3 (ambos de aspas) e <strong>126</strong> numa série MD5 (de marteen). Craques com Mira Monstra e overall 95+ têm uma chance rara de superá-los numa partida monstruosa. O recorde "a bater" vale pros dois lados — seu time ou o adversário — e, uma vez quebrado, passa a ser o novo recorde <strong>durante toda a campanha</strong> (inclusive se for a IA quem bater primeiro). No fim da campanha, tudo volta aos valores reais.</p>
      `},
      {title:"MVP da Campanha", body:`
        <p>Só aparece se você for Campeão Mundial: o craque com melhor nota (abates + metade das assistências − mortes) somada ao longo de toda a campanha.</p>
      `},
      {title:"Modo Clássico x Modo Selva", body:`
        <p>No <strong>Clássico</strong>, você vê o overall e as qualidades táticas de cada craque durante o draft. Na <strong>Selva</strong>, tudo isso fica escondido — você recruta só pelo nome e reputação.</p>
      `},
      {title:"Esports Nations Cup", body:`
        <p>Em vez de escolher uma organização, você escolhe uma <strong>Seleção nacional</strong> — o draft só sorteia craques que jogam por aquele país (algumas Seleções são combinadas entre países menores, tipo Polônia/Suécia). O Head Coach também vem só da lista daquela Seleção.</p>
        <p>O resto funciona igual ao modo normal: fase de grupos, playoffs, tudo — só que as outras 15 "equipes" adversárias também são Seleções, cada uma com o elenco real dela.</p>
        <p>Diferença de regra específica da Esports Nations Cup: o nerf de "3 ou mais IGL" não vale aqui (afinal, numa seleção de verdade é normal ter vários craques com liderança tática).</p>
      `},
      {title:"Modo Regional", body:`
        <p>Escolha uma região (BR, NA, LAS, EMEA, APAC ou CHN) e um time de verdade de lá — o draft só sorteia craques que jogam nessa região. Regiões maiores passam por fase de grupos antes dos playoffs; as menores vão direto pro chaveamento.</p>
      `},
      {title:"Rumo à Ascensão", body:`
        <p>Crie seu próprio craque — função, qualidades táticas e nacionalidade — e viva uma carreira de <strong>16 temporadas</strong>. A cada ano você disputa o Regional; classificando, também disputa o Mundial; e a cada poucas temporadas, a Esports Nations Cup pela Seleção do seu país.</p>
        <p>Entre temporadas, os times fazem transferências entre si, e você também pode receber propostas de outras organizações.</p>
      `},
    ],
    changelogSections:[
      {title:"v 1.4 → v 1.5", body:`
        <p><strong>Clássico</strong> — agora dá pra escolher qualquer um dos 32 times parceiros (por território). O time escolhido entra no lugar de um time do mesmo território, mantendo 4 por território.</p>
        <p><strong>Esports Nations Cup ao vivo</strong> — as 95 nações estão disponíveis no solo e no Road to the Top. Quem escolhe uma nação sem convite joga o qualificatório regional ao vivo, e o cabeçalho das partidas mostra o qualificatório (ex.: "Qualificatório América do Sul · Playoffs"). A fase de grupos mostra a letra do seu grupo (A–H).</p>
        <p><strong>Bandeiras e elencos</strong> — bandeiras desenhadas para todas as novas nações e elencos reais para as 78 não convidadas (sem jogadores repetidos entre nações). Novos jogadores entram com overall entre 80 e 86.</p>
        <p><strong>Desempenho</strong> — iniciar uma campanha no Clássico ficou muito mais rápido (de ~45s para menos de 1s).</p>
      `},
      {title:"v 1.3 → v 1.4", body:`
        <p><strong>VCT 2027</strong> — 32 times parceiros em 4 territórios (Américas, EMEA, Pacific e CN) mais os times não parceiros, com centenas de jogadores e staff novos no banco. Elencos incompletos ficam incompletos até o time anunciar, e o jogo contrata dentro do mercado de transferências.</p>
        <p><strong>Esports Nations Cup</strong> — a antiga Copa do Mundo agora tem 32 seleções: 17 convidadas (já nos grupos) + 15 vindas dos qualificatórios regionais (NA 2, SA 2, África 2, MENA 2, Europa 3, Sudeste Asiático/Oceania 2, Ásia 2), 8 grupos de 4 e playoffs de 16. Sem seleções juntas e sem wildcards.</p>
        <p><strong>Calendário</strong> — Open Qualifier, Kickoff, Masters 1, Cup 1, Masters 2, Cup 2 e Champions com 16 times, mais a Esports Nations Cup nas temporadas de Mundial. Eventos de 12 times: 8 parceiros mais 4 vagas decididas no Open Qualifier entre os times não parceiros. Os 4 melhores de cada território por pontos vão pro Champions.</p>
        <p><strong>Assistant Coach</strong> — agora tem efeito real no jogo, com metade da força de um Head Coach. O 6º jogador fica como reserva.</p>
        <p><strong>Open Qualifiers por sub-região</strong> — ao criar o craque você escolhe NA, Brasil, LATAM Norte ou LATAM Sul (Américas), Europa ou Turquia e MENA (EMEA), Coreia, Japão ou Sudeste Asiático (Pacific). Cada sub-região tem seu Open Qualifier, que você joga ao vivo com um time não parceiro: o campeão de cada sub-região garante uma vaga, e os vices disputam as vagas que sobram numa chave de última chance, completando os 12 do Kickoff e das Cups junto com os 8 parceiros.</p>
        <p><strong>Mundial</strong> — os 16 times agora são parceiros do VCT 2027 (4 de cada território). O Regional também usa só os 8 parceiros de cada território.</p>
        <p><strong>Elencos</strong> — times sem as 5 funções cobertas agora ajustam a função de um jogador em vez de perder 3 de overall. yay foi liberado para o mercado.</p>
      `},
      {title:"v 1.4 → v 1.5", body:`
        <p><strong>Classic</strong> — you can now pick any of the 32 partner teams (by territory). Your team takes the place of a team from the same territory, keeping 4 per territory.</p>
        <p><strong>Esports Nations Cup live</strong> — all 95 nations are available in solo and Road to the Top. Picking a non-invited nation means playing the regional qualifier live, and the match header shows the qualifier (e.g. "South America Qualifier · Playoffs"). The group stage shows your group letter (A–H).</p>
        <p><strong>Flags and rosters</strong> — hand-drawn flags for all new nations and real rosters for the 78 non-invited ones (no repeated players across nations). New players come in with overall between 80 and 86.</p>
        <p><strong>Performance</strong> — starting a Classic campaign is much faster (from ~45s to under 1s).</p>
      `},
      {title:"v 1.3 → v 1.4", body:`
        <p><strong>VCT 2027</strong> — 32 partner teams across 4 territories (Americas, EMEA, Pacific and CN) plus non-partner teams, with hundreds of new players and staff in the pool. Incomplete rosters stay incomplete until the team announces, and the game signs players through the transfer market.</p>
        <p><strong>Esports Nations Cup</strong> — the old World Cup now has 32 national teams: 17 invited (straight into groups) + 15 from regional qualifiers (NA 2, SA 2, Africa 2, MENA 2, Europe 3, SEA/Oceania 2, Asia 2), 8 groups of 4 and a 16-team playoff. No combined teams and no wildcards.</p>
        <p><strong>Calendar</strong> — Open Qualifier, Kickoff, Masters 1, Cup 1, Masters 2, Cup 2 and a 16-team Champions, plus the Esports Nations Cup in Esports Nations Cup seasons. 12-team events: 8 partners plus 4 slots decided in the Open Qualifier among non-partner teams. The top 4 of each territory by points go to Champions.</p>
        <p><strong>Assistant Coach</strong> — now has a real effect in the game, at half the strength of a Head Coach. The 6th player is kept as a reserve.</p>
        <p><strong>Open Qualifiers by sub-region</strong> — when you create your player you pick NA, Brazil, LATAM North or LATAM South (Americas), Europe or Turkey & MENA (EMEA), Korea, Japan or Southeast Asia (Pacific). Each sub-region has its own Open Qualifier, which you play live with a non-partner team: each sub-region champion earns a slot, and the runners-up fight for the remaining slots in a last-chance bracket, completing the 12 teams of the Kickoff and Cups alongside the 8 partners.</p>
        <p><strong>World mode</strong> — the 16 teams are now VCT 2027 partners (4 per territory). Regional also uses only the 8 partners of each territory.</p>
        <p><strong>Rosters</strong> — teams that did not cover all 5 roles now adjust one player's role instead of losing 3 overall. yay was released to the market.</p>
      `},
      {title:"v 1.4 → v 1.5", body:`
        <p><strong>Clásico</strong> — ahora podés elegir cualquiera de los 32 equipos socios (por territorio). Tu equipo ocupa el lugar de uno del mismo territorio, manteniendo 4 por territorio.</p>
        <p><strong>Esports Nations Cup en vivo</strong> — las 95 naciones están disponibles en solo y Rumbo a la Cima. Quien elige una nación sin invitación juega el clasificatorio regional en vivo, y el encabezado de las partidas muestra el clasificatorio (ej.: "Clasificatorio Sudamérica · Playoffs"). La fase de grupos muestra la letra de tu grupo (A–H).</p>
        <p><strong>Banderas y planteles</strong> — banderas dibujadas para todas las naciones nuevas y planteles reales para las 78 no invitadas (sin jugadores repetidos entre naciones). Los jugadores nuevos entran con overall entre 80 y 86.</p>
        <p><strong>Rendimiento</strong> — iniciar una campaña en Clásico es mucho más rápido (de ~45s a menos de 1s).</p>
      `},
      {title:"v 1.3 → v 1.4", body:`
        <p><strong>VCT 2027</strong> — 32 equipos socios en 4 territorios (Américas, EMEA, Pacific y CN) más los equipos no socios, con cientos de jugadores y staff nuevos en la base. Los planteles incompletos siguen incompletos hasta que el equipo los anuncie, y el juego ficha a través del mercado de transferencias.</p>
        <p><strong>Esports Nations Cup</strong> — el antiguo Mundial ahora tiene 32 selecciones: 17 invitadas (directo a grupos) + 15 de clasificatorios regionales (NA 2, SA 2, África 2, MENA 2, Europa 3, Sudeste Asiático/Oceanía 2, Asia 2), 8 grupos de 4 y playoffs de 16. Sin selecciones combinadas y sin wildcards.</p>
        <p><strong>Calendario</strong> — Open Qualifier, Kickoff, Masters 1, Cup 1, Masters 2, Cup 2 y Champions con 16 equipos, más la Esports Nations Cup en las temporadas de Mundial. Eventos de 12 equipos: 8 socios más 4 cupos definidos en el Open Qualifier entre los no socios. Los 4 mejores de cada territorio por puntos van al Champions.</p>
        <p><strong>Assistant Coach</strong> — ahora tiene efecto real en el juego, con la mitad de la fuerza de un Head Coach. El 6º jugador queda como reserva.</p>
        <p><strong>Open Qualifiers por subregión</strong> — al crear tu jugador elegís NA, Brasil, LATAM Norte o LATAM Sur (Américas), Europa o Turquía y MENA (EMEA), Corea, Japón o Sudeste Asiático (Pacific). Cada subregión tiene su Open Qualifier, que jugás en vivo con un equipo no socio: el campeón de cada subregión asegura un cupo, y los subcampeones disputan los cupos restantes en una llave de última chance, completando los 12 del Kickoff y las Cups junto con los 8 socios.</p>
        <p><strong>Mundial</strong> — los 16 equipos ahora son socios del VCT 2027 (4 por territorio). El Regional también usa solo los 8 socios de cada territorio.</p>
        <p><strong>Planteles</strong> — los equipos que no cubrían las 5 funciones ahora ajustan la función de un jugador en vez de perder 3 de overall. yay fue liberado al mercado.</p>
      `},
      {title:"v 1.2 → v 1.3", body:`
        <p><strong>KRU GC campeã mundial 2026</strong> — antG, none, ponix, micaela e tok1o agora são Campeãs Mundiais, e o HC bonzitt entra como técnico campeão mundial. Os jogadores novos estão no banco, e antG subiu pra 87 e ganhou IGL e mira monstra.</p>
      `},
      {title:"v 1.1 → v 1.2", body:`
        <p><strong>LOUD 2026 campeã mundial</strong> — Darker, lukxo, tkzin, erde e DaviH agora são Campeões Mundiais, e Romanilly e Bati entram como HCs campeões mundiais. Bati e DaviH têm sinergia com brasileiros e sul-americanos.</p>
        <p><strong>Seleções</strong> — Seleções com mais de um HC agora sempre pegam o melhor disponível (bzkA no Brasil). Na Seleção do Ascensão, o jogo monta automaticamente na função (entre as que você escolheu) que deixa o time mais forte.</p>
        <p><strong>Correção</strong> — o MVP da Esports Nations Cup do Ascensão podia mostrar um craque do seu clube que nem estava na Seleção.</p>
        <p><strong>Overalls</strong> — Darker, DaviH, Jamppi, Sayonara e PROFEK subiram pra 90, tkzin pra 92, e erde e lukxo pra 93. less agora também joga de controlador.</p>
      `},
      {title:"v 1.0 → v 1.1", body:`
        <p><strong>Visual novo</strong> — layout inteiro atualizado: mais limpo, moderno e responsivo tanto no computador quanto no celular, com as fontes certas carregando pela primeira vez.</p>
        <p><strong>Ascensão sem repetição</strong> — o mercado agora lembra as trocas de temporadas anteriores em vez de recalcular tudo do zero, então os times evoluem de verdade ao longo da carreira. Craques fora da sua região tendem a voltar pra casa com o tempo.</p>
        <p><strong>Ofertas de transferência mais inteligentes</strong> — só chegam ofertas pras funções que você escolheu (principal ou secundárias), mostrando a função e o técnico atual do time antes de aceitar. A Seleção na Esports Nations Cup sempre usa sua função principal.</p>
        <p><strong>Troca de função por contratação</strong> — se uma contratação nova deixaria seu time melhor numa função secundária, o jogo pergunta antes de trocar, em vez de decidir sozinho.</p>
        <p><strong>Regra de IGL ajustada</strong> — 1 ou 2 craques com IGL no time agora dão buff; só a partir de 3 é que vira nerf.</p>
        <p>Além disso: mais craques novas adicionadas ao banco, e mais correções de bugs no mercado de transferências.</p>
      `},
      {title:"Beta → v 1.0", body:`
        <p><strong>Rumo à Ascensão</strong> — modo de carreira completo: crie seu craque, jogue 16 temporadas passando por Regional, Mundial e Esports Nations Cup, receba ofertas de outros times e acompanhe sua história até o fim.</p>
        <p><strong>Mercado de transferências</strong> — times reais trocam craques e técnicos entre si a cada temporada, levando em conta nacionalidade, proximidade de região e sinergia. Agentes livres também entram no mercado.</p>
        <p><strong>Temas visuais</strong> — o Modo Selva ganhou um visual vermelho escuro e denso, e a Esports Nations Cup muda de cor de acordo com a Seleção escolhida.</p>
        <p><strong>MVP e recordes</strong> — MVP da campanha aparece ao ser campeão de qualquer competição, e recordes quebrados durante uma campanha do Ascensão valem até o fim dela.</p>
        <p><strong>Campeãs Mundiais e Regionais</strong> — dezenas de craques novas adicionadas ao banco, com bônus permanente pra quem já foi campeã de verdade e sinergia entre quem jogou junto.</p>
        <p>Além disso: várias correções de bugs, ajustes de equilíbrio no mercado, e a tela de Campanhas Anteriores agora também guarda as carreiras do Ascensão.</p>
      `},
    ],
  },
  en:{
    phase_intro:"SETUP", phase_rules:"RULES", phase_teamselect:"TEAM", phase_draft:"DRAFT", phase_match:"MATCH", phase_end:"RESULT",
    rulesLink:"📖 View full rules",
    rulesTitle:"Rules & Mechanics",
    changelogTitle:"Update Notes",
    rulesBackBtn:"Back",
    historyLink:"📜 Past campaigns",
    historyTitle:"Your Campaigns",
    historyEmpty:"No saved campaigns yet. Play through to the end to log your result here.",
    creatorTitle:"About the Creator",
    creatorBody:"My name is Wasmorf. I'm a Systems Analysis and Development (ADS) student, and VALX was a project I built on my own with a lot of care. I'm really happy with how it's turned out so far, and I genuinely hope it does well. Thanks for playing!",
    hero:"Build your Super Team and chase the world title.",
    lead:"Draft your 5 pro players and chase the World Championship.<br>Every pick matters — the line between a super team and a disaster is thinner than it looks.<br>And Overall doesn't tell the whole story.",
    diffClassicoTitle:"Classic Mode",
    diffClassicoDesc:"Visible attributes",
    diffCopaTitle:"Esports Nations Cup",
    diffCopaDesc:"Play for a National Team",
    diffSelvaTitle:"Wild Mode",
    diffSelvaDesc:"Hidden attributes",
    disclaimer:"Real pro player names and real esports organizations are used respectfully in a fan-made simulation game. Attributes are fictional estimates for gameplay purposes, not official statistics.",
    teamSelectTitle:"Choose your team name",
    teamSelectLead:"This will be your team's identity for the whole campaign.",
    selecaoSelectTitle:"Choose your National Team",
    selecaoSelectLead:"This will be your national team for the whole Esports Nations Cup.",
    ascensaoModeBtn:"Road to the Top",
    ascensaoModeDesc:"Create your pro, land on a real team, and follow a 16-season career.",
    ascensaoMundialLabel:"Worlds",
    regionalModeBtn:"Regional",
    ascensaoRegionalLabel:"Regional",
    regionalModeDesc:"Pick a region and a team — the draft only uses pros who actually play there.",
    regionalSelectTitle:"Choose a Region",
    regionalSelectLead:"The draft will only use pros who actually play in this region.",
    regionalTeamSelectTitle:regiao=>`Choose a Team (${regiao})`,
    regionalTeamSelectLead:"This will be your team's name for the campaign.",
    regionalRoundLabel:(n,total)=>`Round ${n} of ${total}`,
    playersCountLabel:n=>`${n} players`,
    selvaModeSelectTitle:"Choose Selva",
    selvaModeSelectLead:"Both hide overall and qualities during the draft — only the tournament format changes.",
    selvaModeClassicoTitle:"Classic Selva",
    selvaModeClassicoDesc:"The regular Selva mode — recruit by name and reputation only.",
    selvaModeRegionalTitle:"Regional Selva",
    selvaModeRegionalDesc:"Regional mode, but with attributes hidden during the draft.",
    regionalStandingsTitle:"Group Stage Complete",
    regionalStandingsLead:n=>`The top ${n} of each group advance to the playoffs.`,
    youLabel:"you",
    ptsAbbrev:"PTS",
    teamWord:"Team",
    standingsWLHeader:"W-L",
    standingsRDHeader:"RD",
    standingsWLRow:(v,d)=>`${v}W-${d}L`,
    ordinal:n=>{const s=["th","st","nd","rd"];const v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);},
    regionalContinuePlayoffsBtn:"Continue to the playoffs",
    ascensaoCreateTitle:"Create your Pro",
    ascensaoCreateLead:"Build your player and start the career — 16 seasons on the way to the top.",
    ascensaoNameLabel:"Name",
    ascensaoNamePlaceholder:"Your pro's name",
    ascensaoRoleLabel:"Role",
    ascensaoSecondaryRoleLabel:"Secondary roles (optional)",
    ascensaoSecondaryRolesLabel:"Secondary roles",
    ascensaoQualityLabel:"Tactical qualities ",
    ascensaoRegionLabel:"Region",
    ascensaoNationLabel:"Nationality",
    ascensaoNationLead:"Every 3 seasons (starting from season 2), you represent your country's team at the Esports Nations Cup.",
    ascensaoConfirmBtn:"Confirm and draw team",
    ascensaoRevealTitle:"Welcome!",
    ascensaoRevealLead:(nome,time,regiao)=>`${nome} just signed with ${time} (${regiao})!`,
    ascensaoTeamLabel:"Team",
    ascensaoStartSeasonBtn:"Start Season 1",
    ascensaoSeasonLabel:n=>`Season ${n}`,
    ascensaoContinueSameBtn:time=>`Stay with ${time}`,
    ascensaoOfferTitle:"Transfer Offer!",
    ascensaoOfferLead:n=>`You received ${n} transfer offer${n===1?"":"s"}! Pick one to accept:`,
    ascensaoOfferAcceptBtn:"Accept offer",
    ascensaoOfferRoleLabel:"You would play",
    ascensaoOfferCoachLabel:"Current coach",
    ascensaoRoleSwitchTitle:"Switch role?",
    ascensaoRoleSwitchBody:(atual,nova)=>`With this season's signing, the team would be better off with you playing ${nova} instead of ${atual}. Want to switch?`,
    ascensaoRoleSwitchYesBtn:(nova)=>`Play ${nova}`,
    ascensaoRoleSwitchNoBtn:(atual)=>`Stay on ${atual}`,
    ascensaoOfferDeclineBtn:"Decline",
    ascensaoSeeFinalBtn:"See career summary",
    ascensaoWorldCupLabel:"Esports Nations Cup",
    ascensaoStageContinueBtn:"Continue",
    ascensaoFinalTitle:"Career Over",
    ascensaoFinalLead:(nome)=>`${nome} finished a 16-season career.`,
    ascensaoShareHeadline:nome=>`${nome} finished their Road to the Top career!`,
    ascensaoShareFuncoesLabel:"Roles",
    ascensaoShareMundialLabel:"World Titles",
    ascensaoShareRegionalLabel:"Regional Titles",
    ascensaoShareCopaLabel:"Esports Nations Cup Titles",
    copaNotReady:(n,names)=>`Esports Nations Cup Mode isn't ready yet — the tournament format needs 16 complete national teams, and right now only ${n} can field a full 5-player squad. Still needs reinforcements for: ${names}.`,
    teamSelectContinue:"Continue to the draft",
    phase_coachselect:"COACH",
    coachSelectTitle:"Choose your Head Coach",
    coachSelectLead:"Choose your HeadCoach",
    coachSelectLeadCopa:"These are the coaches available for your National Team — pick one to lead the squad.",
    coachSelectContinue:"Continue to the draft",
    headCoachLabel:"HEAD COACH",
    poolLabel:"Pros in pool:",
    filledLabel:n=>`${n}/5 drafted`,
    rosterComplete:"Roster complete. Team overall:",
    toMatchBtn:"Go to the World Championship",
    drawLead:"Draw the next available pros to evaluate.",
    drawBtn:"Draw players",
    pickOneLead:"Pick one to draft:",
    poolEmpty:"Pool exhausted.",
    skipBtn:"Skip",
    skipsLeftLabel:n=>`Skips left: ${n}`,
    chooseSlotPrompt:name=>`Which slot should ${name} fill?`,
    confirmDraftPrompt:name=>`Draft ${name}?`,
    confirmBtn:"Confirm",
    backBtn:"Back",
    alreadyPlayedWith:"Already a champion together",
    hiddenStats:"Attributes hidden in this mode — trust the name.",
    vs:"VS", rostersLabel:"K / D / A",
    recordSingleMapUs:(name,kills,prevKills,prevHolder)=>`🔥 NEW RECORD! ${name} closed the map with ${kills} kills, breaking ${prevHolder}'s ${prevKills} — the new campaign record.`,
    recordSingleMapThem:(name,kills,prevKills,prevHolder)=>`😮 THE OPPONENT BROKE THE RECORD! ${name}, from the rival team, closed the map with ${kills} kills, breaking ${prevHolder}'s ${prevKills}. That's now the record to beat in your campaign.`,
    recordSeriesUs:(name,kills,prevKills,prevHolder,bo)=>`🔥 NEW RECORD! ${name} closed the series with ${kills} kills, breaking ${prevHolder}'s ${prevKills} — the ${bo} series record for this campaign.`,
    recordSeriesThem:(name,kills,prevKills,prevHolder,bo)=>`😮 THE OPPONENT BROKE THE RECORD! ${name}, from the rival team, closed the series with ${kills} kills, breaking ${prevHolder}'s ${prevKills} — new ${bo} series record in your campaign.`,
    simRoundBtn:"Simulate next round",
    simAllBtn:"Simulate full map",
    nextMapBtn:"Next map",
    mapsScoreLabel:(a,b)=>`Maps ${a}-${b}`,
    sideAttack:"ATTACK",
    sideDefense:"DEFENSE",
    resultWin:"VICTORY", resultLoss:"DEFEAT",
    continueBtn:"Continue",
    championTitle:"WORLD CHAMPION",
    regionalChampionTitle:regiao=>`${regiao} REGIONAL CHAMPION`,
    championLead:"Your super team won every matchup in the campaign and lifted the title.",
    playAgain:"Play again",
    mvpLabel:"CAMPAIGN MVP",
    journeyLabel:"TOURNAMENT PATH",
    tryAgain:"Try again",
    roles:{duelist:"Duelist", flex:"Flex", initiator:"Initiator", sentinel:"Sentinel", controller:"Controller"},
    tags:{mm:"Monster Aim", entry:"Entry", operator:"Operator", clutch:"Clutch", igl:"IGL", lurker:"Lurker", utility:"Utility", campeao_mundial:"World Champion", campeao_regional:"Regional Champion"},
    groupWord:"Group",
    groupStageTag:"GROUP STAGE",
    playoffsTag:"PLAYOFFS",
    labels:{
      ubR1:"Upper Bracket — Round 1", ubQuarter:"Upper Bracket — Quarterfinal", lbR3:"Lower Bracket — Round 3", lbR4:"Lower Bracket — Round 4", ubSemi:"Upper Bracket — Semifinal", ubFinal:"Upper Bracket — Final",
      groupR1:"Opening Stage", groupUpper:"Upper (qualify)", groupLower:"Lower (elimination)", groupDecider:"Group decider",
      lbR1:"Lower Bracket — Round 1", lbR2:"Lower Bracket — Round 2", lbSemi:"Lower Bracket — Semifinal", lbFinal:"Lower Bracket — Final",
      grandFinal:"Grand Final",
    },
    groupsEliminatedTitle:"ELIMINATED IN THE GROUP STAGE",
    ascensaoRegionalGroupsTitle:"ELIMINATED IN THE REGIONAL GROUP STAGE",
    ascensaoRegionalChampionTitle:"REGIONAL CHAMPION",
    ascensaoRegionalRunnerupTitle:"REGIONAL RUNNER-UP",
    ascensaoEliminatedPrefix:"ELIMINATED",
    ascensaoRegionalPlayoffsTitle:"DID NOT QUALIFY FOR WORLDS",
    ascensaoQualifiedTitle:"QUALIFIED FOR WORLDS",
    groupsEliminatedLead:"Your team missed the group's Top 2 and didn't advance to the playoffs.",
    playoffsEliminatedTitle:"ELIMINATED IN THE PLAYOFFS",
    playoffsEliminatedLead:stage=>`Your team fell in the ${stage} and was knocked out of the World Championship.`,
    runnerUpTitle:"WORLD RUNNER-UP",
    regionalRunnerUpTitle:regiao=>`${regiao} REGIONAL RUNNER-UP`,
    runnerUpLead:"Your team reached the Grand Final but couldn't lift the trophy this time.",
    shareHeadlineChampion:"I WAS WORLD CHAMPION on VALX 🏆",
    shareHeadlineRegionalChampion:regiao=>`I WAS ${regiao} REGIONAL CHAMPION on VALX 🏆`,
    shareHeadlineRunnerup:"I WAS WORLD RUNNER-UP on VALX 🥈",
    shareHeadlineRegionalRunnerup:regiao=>`I WAS ${regiao} REGIONAL RUNNER-UP on VALX 🥈`,
    shareHeadlinePlayoffs:stage=>`I WAS ELIMINATED IN THE PLAYOFFS (${stage}) on VALX`,
    shareHeadlineGroups:"I WAS ELIMINATED IN THE GROUP STAGE on VALX",
    shareModeLabel:"Mode",
    shareCampaignLabel:"Campaign",
    shareMapsLabel:"Maps",
    shareOverallLabel:"Overall",
    shareMvpLabel:"MVP",
    shareTeamMemberLabel:role=>`${role}`,
    shareCoachLabel:"Coach",
    shareCta:"Try to win the World Championship too",
    shareCtaRegional:"Try to win the Regional too",
    shareCtaCopa:"Try to win the Esports Nations Cup too",
    ascensaoShareCta:"Make your own story too",
    shareXBtn:"Share on X",
    rulesSections:[
      {title:"Team & Head Coach", body:`
        <p>You choose your team's name from 16 real organizations — the other 15 become your rivals at the World Championship. Then 4 coaches are drawn for you to pick one; the other 15 go to rival teams. Each coach grants a fixed (hidden) rating bonus — it applies to whichever team has that coach. Coaches who've already been <strong>World Champions</strong> add an extra bonus on top. World titles counted: <strong>Champions, Masters, and EWC</strong>.</p>
      `},
      {title:"The Draft", body:`
        <p>The team has 5 fixed slots: <strong>Duelist, Flex, Initiator, Controller, Sentinel</strong>. A pro can only fill a slot for a role they actually play — many play more than one.</p>
        <p>Each draw shows <strong>5 options</strong>, and it's smart about it: only pros with at least one matching open slot show up. You can skip the group of 5 at most <strong>2 times</strong> in the whole draft.</p>
      `},
      {title:"Tactical Qualities", body:`
        <ul>
          <li><strong>Monster Aim (MM):</strong> insane aim — more chance of monster games.</li>
          <li><strong>Entry:</strong> aggressive, opens the round — boosts attack, especially on the Duelist.</li>
          <li><strong>Operator:</strong> precision rifle specialist — boosts defense.</li>
          <li><strong>Clutch:</strong> closes out rounds under pressure.</li>
          <li><strong>IGL:</strong> the team's tactical brain.</li>
          <li><strong>Lurker:</strong> plays solo, flanks — important on the Sentinel.</li>
          <li><strong>Utility:</strong> ability usage.</li>
          <li><strong>World Champion:</strong> already lifted a trophy — experience that counts.</li>
        </ul>
      `},
      {title:"Team Synergies (buffs & nerfs)", body:`
        <p>Your roster's composition silently affects attack and defense every round — and the team switches sides every 12 rounds, just like a real map.</p>
        <div class="rules-good">✓ ADVANTAGES</div>
        <ul>
          <li>Duelist + Initiator on the team: attack buff.</li>
          <li>Duelist and Initiator from the same country, or already World Champions together: extra general buff (a bit more if both at once).</li>
          <li>Exactly 1 Operator user (Duelist or Sentinel): defense buff.</li>
          <li>2+ players with Clutch: general buff.</li>
          <li>World Champions on the roster: general buff, grows with each one.</li>
          <li>Duelist with Entry: attack buff.</li>
          <li>Players with Utility: general buff, grows with each one — no cap.</li>
          <li>Sentinel with Lurker: general buff.</li>
          <li>Players with Monster Aim: general buff, uncapped.</li>
        </ul>
        <div class="rules-bad">✗ DISADVANTAGES</div>
        <ul>
          <li>Duelist <em>and</em> Sentinel both using Operator: general nerf.</li>
          <li>No player with IGL: general nerf.</li>
          <li>1 or 2 players with IGL: general buff (well-led team).</li>
          <li>3 or more players with IGL: general nerf (doesn't apply to Esports Nations Cup national teams).</li>
          <li>Duelist without Entry: attack nerf.</li>
          <li>Sentinel without Lurker: general nerf.</li>
        </ul>
      `},
      {title:"Roster Chemistry (country & real team)", body:`
        <p>On top of composition synergies, there's an extra silent bonus based on real vlr.gg data: pros from the <strong>same country</strong> get a small buff, and pros who <strong>became World Champions together</strong> — on the actual roster that lifted the trophy — get an even bigger buff. Your Head Coach counts too, if they coached one of those championship rosters.</p>
        <p>Important: this "played together" bonus doesn't apply to any two players who happened to pass through the same org at different times — it's specific to rosters that <strong>won a World Championship together</strong> (e.g. LOUD 2022, Evil Geniuses 2023). World titles counted: <strong>Champions, Masters, and EWC</strong>. Coverage of this database is partial and keeps growing over time.</p>
      `},
      {title:"World Championship Format", body:`
        <p>16 teams (you + 15 rivals) split into <strong>4 groups of 4</strong>. You face the other 3 in your group; the rest is resolved automatically. The <strong>Top 2</strong> from each group (8 teams) advance to the playoffs.</p>
        <p>The playoffs are <strong>double elimination</strong> (Upper/Lower Bracket): losing in Upper drops you to Lower (still alive); losing in Lower eliminates you. Every match is <strong>Bo3</strong>, except the Lower Bracket Final and the Grand Final, which are <strong>Bo5</strong>.</p>
        <p>Each map goes to <strong>13 rounds</strong> — but if it ties <strong>12-12</strong>, it goes to <strong>overtime</strong>: hitting 13 alone doesn't close the map, you need a <strong>2-round lead</strong> (13-12 isn't enough; it only ends at 14-12, or 15-13, and so on), just like the real game.</p>
      `},
      {title:"Real-World Records", body:`
        <p>There are 3 real pro-scene records: <strong>47 kills</strong> in a single map, <strong>82</strong> in a Bo3 series (both by aspas), and <strong>126</strong> in a Bo5 series (by marteen). Players with Monster Aim and 95+ overall have a rare shot at beating them in a monster game. The record "to beat" applies to both sides — your team or the opponent — and once broken, it becomes the new record <strong>for the rest of the campaign</strong> (even if the AI breaks it first). Everything resets to the real marks once the campaign ends.</p>
      `},
      {title:"Campaign MVP", body:`
        <p>Only shown if you become World Champion: the pro with the best score (kills + half the assists − deaths) added up across the whole campaign.</p>
      `},
      {title:"Classic Mode vs Wild Mode", body:`
        <p>In <strong>Classic</strong>, you see each pro's overall and tactical qualities during the draft. In <strong>Wild</strong>, all of that stays hidden — you recruit on name and reputation alone.</p>
      `},
      {title:"Esports Nations Cup", body:`
        <p>Instead of picking an organization, you pick a <strong>national team</strong> — the draft only draws pros who play for that country (some national teams are combined from smaller countries, like Poland/Sweden). The Head Coach also comes only from that national team's own list.</p>
        <p>Everything else works like the normal mode: group stage, playoffs, all of it — except the other 15 rival "teams" are national teams too, each with their own real roster.</p>
        <p>Esports Nations Cup-specific rule difference: the "3 or more IGL" nerf doesn't apply here (a real national team having several tactical leaders is normal).</p>
      `},
      {title:"Regional Mode", body:`
        <p>Pick a region (BR, NA, LAS, EMEA, APAC or CHN) and a real team from there — the draft only draws pros who actually play in that region. Bigger regions go through a group stage before playoffs; smaller ones go straight to the bracket.</p>
      `},
      {title:"Road to the Top", body:`
        <p>Create your own pro — role, tactical qualities, and nationality — and live a <strong>16-season</strong> career. Every year you compete in your Regional; qualifying also gets you into Worlds; and every few seasons, the Esports Nations Cup with your country's national team.</p>
        <p>Between seasons, real teams make transfers among themselves, and you can also receive offers from other organizations.</p>
      `},
    ],
    changelogSections:[
      {title:"v 1.2 → v 1.3", body:`
        <p><strong>KRU GC 2026 world champions</strong> — antG, none, ponix, micaela and tok1o are now World Champions, and HC bonzitt joins as a world champion coach. The new players are in the pool, and antG went up to 87 and gained IGL and monster aim.</p>
      `},
      {title:"v 1.1 → v 1.2", body:`
        <p><strong>LOUD 2026 world champions</strong> — Darker, lukxo, tkzin, erde and DaviH are now World Champions, and Romanilly and Bati join as world champion HCs. Bati and DaviH have synergy with Brazilians and South Americans.</p>
        <p><strong>National Teams</strong> — National Teams with more than one HC now always get the best one available (bzkA for Brazil). On your Road to the Top national team, the game automatically picks whichever of your chosen roles makes the team strongest.</p>
        <p><strong>Fix</strong> — the Road to the Top Esports Nations Cup MVP could show a club player who wasn't on the national team.</p>
        <p><strong>Overalls</strong> — Darker, DaviH, Jamppi, Sayonara and PROFEK went up to 90, tkzin to 92, and erde and lukxo to 93. less can now also play controller.</p>
      `},
      {title:"v 1.0 → v 1.1", body:`
        <p><strong>New visuals</strong> — the whole layout got an update: cleaner, more modern, and properly responsive on both desktop and mobile, with the right fonts loading for the first time.</p>
        <p><strong>Road to the Top without the repetition</strong> — the market now remembers previous seasons' trades instead of recalculating everything from scratch, so teams genuinely evolve over a career. Players outside their home region tend to move back over time.</p>
        <p><strong>Smarter transfer offers</strong> — offers only come for roles you chose (primary or secondary), and show the role and the team's current coach before you accept. The Esports Nations Cup national team always uses your primary role.</p>
        <p><strong>Role switch on signing</strong> — if a new signing would make your team better off with you in a secondary role, the game asks before switching instead of deciding on its own.</p>
        <p><strong>IGL rule adjusted</strong> — 1 or 2 players with IGL on the team now give a buff; only 3 or more turns into a nerf.</p>
        <p>Also: more new pros added to the pool, and more bug fixes in the transfer market.</p>
      `},
      {title:"Beta → v 1.0", body:`
        <p><strong>Road to the Top</strong> — full career mode: create your pro, play 16 seasons through Regional, Worlds, and the Esports Nations Cup, receive offers from other teams, and follow your story to the end.</p>
        <p><strong>Transfer market</strong> — real teams trade players and coaches among themselves every season, factoring in nationality, region proximity, and synergy. Free agents also join the market.</p>
        <p><strong>Visual themes</strong> — Selva Mode got a dark, dense red look, and the Esports Nations Cup changes color based on the national team you pick.</p>
        <p><strong>MVP and records</strong> — campaign MVP shows up whenever you win any competition, and records broken during a Road to the Top career hold until the career ends.</p>
        <p><strong>World and Regional Champions</strong> — dozens of new pros added to the pool, with a permanent bonus for real-life champions and synergy for those who played together.</p>
        <p>Also: several bug fixes, market balance tweaks, and the Previous Campaigns screen now also saves Road to the Top careers.</p>
      `},
    ],
  },
  es:{
    phase_intro:"CONFIG", phase_rules:"REGLAS", phase_teamselect:"EQUIPO", phase_draft:"DRAFT", phase_match:"PARTIDO", phase_end:"RESULTADO",
    rulesLink:"📖 Ver reglas completas",
    rulesTitle:"Reglas y Mecánicas",
    changelogTitle:"Notas de Actualización",
    rulesBackBtn:"Volver",
    historyLink:"📜 Campañas anteriores",
    historyTitle:"Tus Campañas",
    historyEmpty:"Todavía no hay campañas guardadas. Juega hasta el final para registrar tu resultado aquí.",
    creatorTitle:"Sobre el Creador",
    creatorBody:"Mi nombre es Wasmorf. Soy estudiante de Análisis y Desarrollo de Sistemas (ADS), y VALX fue un proyecto que hice por mi cuenta con mucho cariño. Estoy muy feliz con el resultado hasta ahora, y espero de corazón que le vaya bien. ¡Gracias por jugar!",
    hero:"Arma tu Super Equipo y busca el título mundial.",
    lead:"Arma tus 5 jugadores profesionales y ve tras el título Mundial.<br>Cada elección pesa — la diferencia entre un súper equipo y un fracaso es más fina de lo que parece.<br>Y el Overall no cuenta toda la historia.",
    diffClassicoTitle:"Modo Clásico",
    diffClassicoDesc:"Atributos visibles",
    diffCopaTitle:"Esports Nations Cup",
    diffCopaDesc:"Juega por una Selección",
    diffSelvaTitle:"Modo Selva",
    diffSelvaDesc:"Atributos ocultos",
    disclaimer:"Los nombres de jugadores profesionales y organizaciones reales de esports se usan de forma respetuosa en un juego de simulación hecho por fans. Los atributos son estimaciones ficticias para el juego, no estadísticas oficiales.",
    teamSelectTitle:"Elige el nombre de tu equipo",
    teamSelectLead:"Esta será la identidad de tu equipo durante toda la campaña.",
    selecaoSelectTitle:"Elige tu Selección",
    selecaoSelectLead:"Esta será tu Selección nacional durante todo el Mundial.",
    ascensaoModeBtn:"Rumbo a la Cima",
    ascensaoModeDesc:"Crea tu crack, cae en un equipo real y sigue 16 temporadas de carrera.",
    regionalModeBtn:"Regional",
    ascensaoMundialLabel:"Mundial",
    regionalModeDesc:"Elige una región y un equipo — el draft usa solo cracks que juegan ahí de verdad.",
    ascensaoRegionalLabel:"Regional",
    regionalSelectTitle:"Elige la Región",
    regionalSelectLead:"El draft va a usar solo cracks que juegan de verdad en esa región.",
    regionalTeamSelectTitle:regiao=>`Elige el Equipo (${regiao})`,
    regionalTeamSelectLead:"Este será el nombre de tu equipo en la campaña.",
    regionalRoundLabel:(n,total)=>`Ronda ${n} de ${total}`,
    playersCountLabel:n=>`${n} cracks`,
    selvaModeSelectTitle:"Elige el Selva",
    selvaModeSelectLead:"Los dos esconden el overall y las cualidades durante el draft — solo cambia el formato del torneo.",
    selvaModeClassicoTitle:"Selva Clásico",
    selvaModeClassicoDesc:"El Modo Selva de siempre — reclutas solo por nombre y reputación.",
    selvaModeRegionalTitle:"Regional Selva",
    selvaModeRegionalDesc:"El modo Regional, pero con los atributos escondidos durante el draft.",
    regionalStandingsTitle:"Fase de Grupos Terminada",
    regionalStandingsLead:n=>`Los ${n} mejores de cada grupo avanzan a los playoffs.`,
    youLabel:"tú",
    ptsAbbrev:"PTS",
    teamWord:"Equipo",
    standingsWLHeader:"V-D",
    standingsRDHeader:"DR",
    standingsWLRow:(v,d)=>`${v}V-${d}D`,
    ordinal:n=>`${n}º`,
    regionalContinuePlayoffsBtn:"Continuar a los playoffs",
    ascensaoCreateTitle:"Crea tu Crack",
    ascensaoCreateLead:"Arma tu jugador y comienza la carrera — 16 temporadas rumbo a la cima.",
    ascensaoNameLabel:"Nombre",
    ascensaoNamePlaceholder:"Nombre de tu crack",
    ascensaoRoleLabel:"Función",
    ascensaoSecondaryRoleLabel:"Funciones secundarias (opcional)",
    ascensaoSecondaryRolesLabel:"Funciones secundarias",
    ascensaoQualityLabel:"Cualidades tácticas ",
    ascensaoRegionLabel:"Región",
    ascensaoNationLabel:"Nacionalidad",
    ascensaoNationLead:"Cada 3 temporadas (a partir de la 2ª), representas a la Selección de tu país en el Mundial.",
    ascensaoConfirmBtn:"Confirmar y sortear equipo",
    ascensaoRevealTitle:"¡Bienvenido!",
    ascensaoRevealLead:(nome,time,regiao)=>`¡${nome} acaba de firmar con ${time} (${regiao})!`,
    ascensaoTeamLabel:"Equipo",
    ascensaoStartSeasonBtn:"Comenzar Temporada 1",
    ascensaoSeasonLabel:n=>`Temporada ${n}`,
    ascensaoContinueSameBtn:time=>`Continuar en ${time}`,
    ascensaoOfferTitle:"¡Oferta de Transferencia!",
    ascensaoOfferLead:n=>`¡Recibiste ${n} oferta${n===1?"":"s"} de transferencia! Elige una para aceptar:`,
    ascensaoOfferAcceptBtn:"Aceptar oferta",
    ascensaoOfferRoleLabel:"Jugarías de",
    ascensaoOfferCoachLabel:"Entrenador actual",
    ascensaoRoleSwitchTitle:"¿Cambiar de función?",
    ascensaoRoleSwitchBody:(atual,nova)=>`Con la contratación de esta temporada, el equipo estaría mejor con vos jugando de ${nova} en vez de ${atual}. ¿Querés cambiar?`,
    ascensaoRoleSwitchYesBtn:(nova)=>`Jugar de ${nova}`,
    ascensaoRoleSwitchNoBtn:(atual)=>`Seguir de ${atual}`,
    ascensaoOfferDeclineBtn:"Rechazar",
    ascensaoSeeFinalBtn:"Ver resumen de carrera",
    ascensaoWorldCupLabel:"Esports Nations Cup",
    ascensaoStageContinueBtn:"Continuar",
    ascensaoFinalTitle:"Fin de Carrera",
    ascensaoFinalLead:(nome)=>`${nome} terminó una carrera de 16 temporadas.`,
    ascensaoShareHeadline:nome=>`¡${nome} terminó su carrera en Rumbo a la Cima!`,
    ascensaoShareFuncoesLabel:"Funciones",
    ascensaoShareMundialLabel:"Títulos Mundiales",
    ascensaoShareRegionalLabel:"Títulos Regionales",
    ascensaoShareCopaLabel:"Títulos de Esports Nations Cup",
    copaNotReady:(n,names)=>`El Modo Esports Nations Cup todavía no está listo — el formato del torneo necesita 16 Selecciones completas, y hoy solo ${n} pueden armar un equipo completo de 5. Todavía falta refuerzo en: ${names}.`,
    teamSelectContinue:"Continuar al draft",
    phase_coachselect:"ENTRENADOR",
    coachSelectTitle:"Elige tu Head Coach",
    coachSelectLead:"Elige tu HeadCoach",
    coachSelectLeadCopa:"Estos son los entrenadores disponibles para tu Selección — elige uno para liderar el equipo.",
    coachSelectContinue:"Continuar al draft",
    headCoachLabel:"HEAD COACH",
    poolLabel:"Cracks en el pool:",
    filledLabel:n=>`${n}/5 reclutados`,
    rosterComplete:"Plantilla completa. Overall del equipo:",
    toMatchBtn:"Ir al Mundial",
    drawLead:"Sortea los próximos cracks disponibles para evaluar.",
    drawBtn:"Sortear jugadores",
    pickOneLead:"Elige uno para reclutar:",
    poolEmpty:"Pool agotado.",
    skipBtn:"Saltar",
    skipsLeftLabel:n=>`Saltos restantes: ${n}`,
    chooseSlotPrompt:name=>`¿En qué vaga encajar a ${name}?`,
    confirmDraftPrompt:name=>`¿Confirmar el reclutamiento de ${name}?`,
    confirmBtn:"Confirmar",
    backBtn:"Volver",
    alreadyPlayedWith:"Ya fue campeón junto",
    hiddenStats:"Atributos ocultos en este modo — confía en el nombre.",
    vs:"VS", rostersLabel:"K / D / A",
    recordSingleMapUs:(name,kills,prevKills,prevHolder)=>`🔥 ¡NUEVO RÉCORD! ${name} cerró el mapa con ${kills} bajas, superando las ${prevKills} de ${prevHolder} — el nuevo récord de la campaña.`,
    recordSingleMapThem:(name,kills,prevKills,prevHolder)=>`😮 ¡EL RIVAL BATIÓ EL RÉCORD! ${name}, del equipo rival, cerró el mapa con ${kills} bajas, superando las ${prevKills} de ${prevHolder}. Ese es ahora el récord a batir en tu campaña.`,
    recordSeriesUs:(name,kills,prevKills,prevHolder,bo)=>`🔥 ¡NUEVO RÉCORD! ${name} cerró la serie con ${kills} bajas, superando las ${prevKills} de ${prevHolder} — el récord de una serie ${bo} en la campaña.`,
    recordSeriesThem:(name,kills,prevKills,prevHolder,bo)=>`😮 ¡EL RIVAL BATIÓ EL RÉCORD! ${name}, del equipo rival, cerró la serie con ${kills} bajas, superando las ${prevKills} de ${prevHolder} — nuevo récord de serie ${bo} en tu campaña.`,
    simRoundBtn:"Simular próxima ronda",
    simAllBtn:"Simular mapa completo",
    nextMapBtn:"Siguiente mapa",
    mapsScoreLabel:(a,b)=>`Mapas ${a}-${b}`,
    sideAttack:"ATAQUE",
    sideDefense:"DEFENSA",
    resultWin:"VICTORIA", resultLoss:"DERROTA",
    continueBtn:"Continuar",
    championTitle:"CAMPEÓN MUNDIAL",
    regionalChampionTitle:regiao=>`CAMPEÓN DEL REGIONAL ${regiao}`,
    championLead:"Tu súper equipo ganó todos los enfrentamientos de la campaña y levantó el título.",
    playAgain:"Jugar de nuevo",
    mvpLabel:"MVP DE LA CAMPAÑA",
    journeyLabel:"CAMINO EN EL TORNEO",
    tryAgain:"Intentar de nuevo",
    roles:{duelist:"Duelista", flex:"Flex", initiator:"Iniciador", sentinel:"Centinela", controller:"Controlador"},
    tags:{mm:"Mira Monstruosa", entry:"Entry", operator:"Operator", clutch:"Clutch", igl:"IGL", lurker:"Lurker", utility:"Utilidad", campeao_mundial:"Campeón Mundial", campeao_regional:"Campeón Regional"},
    groupWord:"Grupo",
    groupStageTag:"FASE DE GRUPOS",
    playoffsTag:"PLAYOFFS",
    labels:{
      ubR1:"Upper Bracket — Ronda 1", ubQuarter:"Upper Bracket — Cuartos", lbR3:"Lower Bracket — Ronda 3", lbR4:"Lower Bracket — Ronda 4", ubSemi:"Upper Bracket — Semifinal", ubFinal:"Upper Bracket — Final",
      groupR1:"Primera Fase", groupUpper:"Upper (clasifica)", groupLower:"Lower (eliminación)", groupDecider:"Decisión del grupo",
      lbR1:"Lower Bracket — Ronda 1", lbR2:"Lower Bracket — Ronda 2", lbSemi:"Lower Bracket — Semifinal", lbFinal:"Lower Bracket — Final",
      grandFinal:"Gran Final",
    },
    groupsEliminatedTitle:"ELIMINADO EN LA FASE DE GRUPOS",
    ascensaoRegionalGroupsTitle:"ELIMINADO EN LA FASE DE GRUPOS REGIONAL",
    ascensaoRegionalChampionTitle:"CAMPEÓN REGIONAL",
    ascensaoRegionalRunnerupTitle:"SUBCAMPEÓN REGIONAL",
    ascensaoEliminatedPrefix:"ELIMINADO",
    ascensaoRegionalPlayoffsTitle:"NO SE CLASIFICÓ AL MUNDIAL",
    groupsEliminatedLead:"Tu equipo quedó fuera del Top 2 del Grupo y no avanzó a los playoffs.",
    ascensaoQualifiedTitle:"CLASIFICADO AL MUNDIAL",
    playoffsEliminatedTitle:"ELIMINADO EN LOS PLAYOFFS",
    playoffsEliminatedLead:stage=>`Tu equipo cayó en ${stage} y quedó fuera del Mundial.`,
    runnerUpTitle:"SUBCAMPEÓN MUNDIAL",
    regionalRunnerUpTitle:regiao=>`SUBCAMPEÓN DEL REGIONAL ${regiao}`,
    runnerUpLead:"Tu equipo llegó a la Gran Final pero no pudo levantar el trofeo esta vez.",
    shareHeadlineChampion:"FUI CAMPEÓN MUNDIAL en VALX 🏆",
    shareHeadlineRegionalChampion:regiao=>`FUI CAMPEÓN DEL REGIONAL ${regiao} en VALX 🏆`,
    shareHeadlineRunnerup:"FUI SUBCAMPEÓN MUNDIAL en VALX 🥈",
    shareHeadlineRegionalRunnerup:regiao=>`FUI SUBCAMPEÓN DEL REGIONAL ${regiao} en VALX 🥈`,
    shareHeadlinePlayoffs:stage=>`FUI ELIMINADO EN LOS PLAYOFFS (${stage}) en VALX`,
    shareHeadlineGroups:"FUI ELIMINADO EN LA FASE DE GRUPOS en VALX",
    shareModeLabel:"Modo",
    shareCampaignLabel:"Campaña",
    shareMapsLabel:"Mapas",
    shareOverallLabel:"Overall",
    shareMvpLabel:"MVP",
    shareTeamMemberLabel:role=>`${role}`,
    shareCoachLabel:"Coach",
    shareCta:"Intenta ganar el Mundial tú también",
    shareCtaRegional:"Intenta ganar el Regional tú también",
    shareCtaCopa:"Intenta ganar la Esports Nations Cup tú también",
    ascensaoShareCta:"Haz tu propia historia también",
    shareXBtn:"Compartir en X",
    rulesSections:[
      {title:"Equipo y Head Coach", body:`
        <p>Eliges el nombre de tu equipo entre 16 organizaciones reales — las otras 15 se convierten en tus rivales en el Mundial. Después se sortean 4 entrenadores para que elijas uno; los otros 15 van a los equipos rivales. Cada entrenador da un bono fijo (oculto) al rating del equipo — vale para cualquier equipo que tenga ese coach. Entrenadores que ya fueron <strong>Campeones Mundiales</strong> suman un bono extra a ese bono. Se consideran títulos mundiales: <strong>Champions, Masters y EWC</strong>.</p>
      `},
      {title:"El Draft", body:`
        <p>El equipo tiene 5 vagas fijas: <strong>Duelista, Flex, Iniciador, Controlador, Centinela</strong>. Un crack solo puede entrar en una vaga cuya función realmente juega — muchos juegan más de una.</p>
        <p>Cada sorteo muestra <strong>5 opciones</strong>, y es inteligente: solo aparecen cracks con al menos una vaga abierta compatible. Puedes saltar el grupo de 5 como máximo <strong>2 veces</strong> en todo el draft.</p>
      `},
      {title:"Cualidades Tácticas", body:`
        <ul>
          <li><strong>Mira Monstruosa (MM):</strong> puntería descomunal — más chance de partidos monstruosos.</li>
          <li><strong>Entry:</strong> agresivo, abre el round — potencia el ataque, sobre todo en el Duelista.</li>
          <li><strong>Operator:</strong> especialista en precisión — potencia la defensa.</li>
          <li><strong>Clutch:</strong> cierra rounds bajo presión.</li>
          <li><strong>IGL:</strong> el cerebro táctico del equipo.</li>
          <li><strong>Lurker:</strong> juega aislado, flanquea — importante en el Centinela.</li>
          <li><strong>Utilidad:</strong> uso de habilidades del equipo.</li>
          <li><strong>Campeón Mundial:</strong> ya levantó un trofeo antes — experiencia que pesa.</li>
        </ul>
      `},
      {title:"Sinergias del Equipo (buffs y nerfs)", body:`
        <p>La composición de tu plantilla afecta en silencio el ataque y la defensa en cada ronda — y el equipo cambia de lado cada 12 rounds, igual que en un partido real.</p>
        <div class="rules-good">✓ VENTAJAS</div>
        <ul>
          <li>Duelista + Iniciador en el equipo: buff de ataque.</li>
          <li>Duelista e Iniciador del mismo país, o que ya fueron Campeones Mundiales juntos: buff general extra (un poco más si son ambos a la vez).</li>
          <li>Exactamente 1 jugador con Operator (Duelista o Centinela): buff de defensa.</li>
          <li>2 o más jugadores con Clutch: buff general.</li>
          <li>Tener Campeones Mundiales en la plantilla: buff general, crece con cada uno.</li>
          <li>Duelista con Entry: buff de ataque.</li>
          <li>Jugadores con Utilidad: buff general, crece con cada uno — sin límite.</li>
          <li>Centinela con Lurker: buff general.</li>
          <li>Cracks con Mira Monstruosa: buff general, sin límite.</li>
        </ul>
        <div class="rules-bad">✗ DESVENTAJAS</div>
        <ul>
          <li>Duelista <em>y</em> Centinela usando Operator al mismo tiempo: nerf general.</li>
          <li>Ningún jugador con IGL: nerf general.</li>
          <li>1 o 2 jugadores con IGL: buff general (equipo bien liderado).</li>
          <li>3 o más jugadores con IGL: nerf general (no aplica en las Selecciones de la Esports Nations Cup).</li>
          <li>Duelista sin Entry: nerf de ataque.</li>
          <li>Centinela sin Lurker: nerf general.</li>
        </ul>
      `},
      {title:"Química de Plantilla (país y time real)", body:`
        <p>Además de las sinergias de composición, existe un bono extra y silencioso basado en datos reales del vlr.gg: cracks del <strong>mismo país</strong> ganan un pequeño buff, y cracks que <strong>ya fueron campeones mundiales juntos</strong> — en la misma plantilla que levantó el trofeo de verdad — ganan un buff aún mayor. El Head Coach también cuenta, si entrenó a alguna de esas plantillas campeonas.</p>
        <p>Importante: esta parte de "ya jugó junto" no aplica a cualquier combinación de cracks que pasaron por el mismo equipo en épocas distintas — es específica de las plantillas que <strong>fueron Campeonas Mundiales juntas</strong> (ej: la LOUD de 2022, la Evil Geniuses de 2023). Se consideran títulos mundiales: <strong>Champions, Masters y EWC</strong>. La cobertura de esta base de datos es parcial y va creciendo de a poco.</p>
      `},
      {title:"Formato del Mundial", body:`
        <p>16 equipos (tú + 15 rivales) divididos en <strong>4 grupos de 4</strong>. Enfrentas a los otros 3 de tu grupo; el resto se resuelve automáticamente. El <strong>Top 2</strong> de cada grupo (8 equipos) avanza a los playoffs.</p>
        <p>Los playoffs son de <strong>doble eliminación</strong> (Upper/Lower Bracket): perder en Upper te baja a Lower (aún vivo); perder en Lower te elimina. Todos los partidos son <strong>MD3</strong>, excepto la Final de la Lower Bracket y la Gran Final, que son <strong>MD5</strong>.</p>
        <p>Cada mapa llega hasta los <strong>13 rounds</strong> — pero si empata <strong>12-12</strong>, va a <strong>prórroga</strong>: llegar a 13 solo no cierra el mapa, hace falta abrir <strong>2 rounds de ventaja</strong> (13-12 no alcanza; recién cierra en 14-12, o 15-13, y así sucesivamente), igual que en el juego real.</p>
      `},
      {title:"Récords Reales", body:`
        <p>Existen 3 récords reales del circuito profesional: <strong>47 bajas</strong> en un solo mapa, <strong>82</strong> en una serie MD3 (ambos de aspas) y <strong>126</strong> en una serie MD5 (de marteen). Los cracks con Mira Monstruosa y overall 95+ tienen una chance rara de superarlos en un partido monstruoso. El récord "a batir" vale para ambos lados — tu equipo o el rival — y, una vez roto, pasa a ser el nuevo récord <strong>durante toda la campaña</strong> (incluso si la IA lo rompe primero). Al terminar la campaña, todo vuelve a los valores reales.</p>
      `},
      {title:"MVP de la Campaña", body:`
        <p>Solo aparece si te conviertes en Campeón Mundial: el crack con mejor nota (bajas + mitad de las asistencias − muertes) acumulada durante toda la campaña.</p>
      `},
      {title:"Modo Clásico vs Modo Selva", body:`
        <p>En <strong>Clásico</strong>, ves el overall y las cualidades tácticas de cada crack durante el draft. En <strong>Selva</strong>, todo eso queda oculto — reclutas solo por el nombre y la reputación.</p>
      `},
      {title:"Esports Nations Cup", body:`
        <p>En vez de elegir una organización, eliges una <strong>Selección nacional</strong> — el draft solo sortea cracks que juegan por ese país (algunas Selecciones son combinadas entre países más chicos, como Polonia/Suecia). El Head Coach también viene solo de la lista de esa Selección.</p>
        <p>El resto funciona igual que el modo normal: fase de grupos, playoffs, todo — solo que los otros 15 "equipos" rivales también son Selecciones, cada una con su elenco real.</p>
        <p>Diferencia de regla específica de la Esports Nations Cup: el nerf de "3 o más IGL" no aplica acá (una selección real con varios líderes tácticos es normal).</p>
      `},
      {title:"Modo Regional", body:`
        <p>Elige una región (BR, NA, LAS, EMEA, APAC o CHN) y un equipo real de ahí — el draft solo sortea cracks que juegan de verdad en esa región. Las regiones más grandes tienen fase de grupos antes de los playoffs; las más chicas van directo al cuadro.</p>
      `},
      {title:"Rumbo a la Cima", body:`
        <p>Crea tu propio crack — función, cualidades tácticas y nacionalidad — y vive una carrera de <strong>16 temporadas</strong>. Cada año juegas tu Regional; si clasificas, también el Mundial; y cada pocas temporadas, la Esports Nations Cup con la Selección de tu país.</p>
        <p>Entre temporadas, los equipos reales hacen transferencias entre ellos, y vos también podés recibir ofertas de otras organizaciones.</p>
      `},
    ],
    changelogSections:[
      {title:"v 1.2 → v 1.3", body:`
        <p><strong>KRU GC campeona mundial 2026</strong> — antG, none, ponix, micaela y tok1o ahora son Campeonas Mundiales, y el HC bonzitt entra como entrenador campeón mundial. Los jugadores nuevos están en la base, y antG subió a 87 y ganó IGL y mira monstruosa.</p>
      `},
      {title:"v 1.1 → v 1.2", body:`
        <p><strong>LOUD 2026 campeona mundial</strong> — Darker, lukxo, tkzin, erde y DaviH ahora son Campeones Mundiales, y Romanilly y Bati entran como HCs campeones mundiales. Bati y DaviH tienen sinergia con brasileños y sudamericanos.</p>
        <p><strong>Selecciones</strong> — las Selecciones con más de un HC ahora siempre toman el mejor disponible (bzkA en Brasil). En la Selección de Rumbo a la Cima, el juego arma el equipo automáticamente en la función (entre las que elegiste) que lo deje más fuerte.</p>
        <p><strong>Corrección</strong> — el MVP de la Esports Nations Cup de Rumbo a la Cima podía mostrar a un jugador de tu club que no estaba en la Selección.</p>
        <p><strong>Overalls</strong> — Darker, DaviH, Jamppi, Sayonara y PROFEK subieron a 90, tkzin a 92, y erde y lukxo a 93. less ahora también juega de controlador.</p>
      `},
      {title:"v 1.0 → v 1.1", body:`
        <p><strong>Visual nuevo</strong> — todo el diseño fue actualizado: más limpio, moderno y responsive tanto en computadora como en celular, con las fuentes correctas cargando por primera vez.</p>
        <p><strong>Rumbo a la Cima sin repetición</strong> — el mercado ahora recuerda las transferencias de temporadas anteriores en vez de recalcular todo desde cero, así que los equipos evolucionan de verdad a lo largo de la carrera. Los cracks fuera de su región tienden a volver a casa con el tiempo.</p>
        <p><strong>Ofertas de transferencia más inteligentes</strong> — solo llegan ofertas para las funciones que elegiste (principal o secundarias), mostrando la función y el entrenador actual del equipo antes de aceptar. La Selección en la Esports Nations Cup siempre usa tu función principal.</p>
        <p><strong>Cambio de función por contratación</strong> — si una contratación nueva dejaría tu equipo mejor en una función secundaria, el juego pregunta antes de cambiar, en vez de decidir solo.</p>
        <p><strong>Regla de IGL ajustada</strong> — 1 o 2 jugadores con IGL en el equipo ahora dan buff; recién a partir de 3 se vuelve nerf.</p>
        <p>Además: más cracks nuevas agregadas a la base, y más correcciones de errores en el mercado de transferencias.</p>
      `},
      {title:"Beta → v 1.0", body:`
        <p><strong>Rumbo a la Cima</strong> — modo de carrera completo: creá tu crack, jugá 16 temporadas pasando por el Regional, el Mundial y la Esports Nations Cup, recibí ofertas de otros equipos y seguí tu historia hasta el final.</p>
        <p><strong>Mercado de transferencias</strong> — los equipos reales intercambian jugadores y técnicos entre ellos cada temporada, considerando nacionalidad, proximidad de región y sinergia. Los agentes libres también entran al mercado.</p>
        <p><strong>Temas visuales</strong> — el Modo Selva tiene ahora un look rojo oscuro y denso, y la Esports Nations Cup cambia de color según la Selección elegida.</p>
        <p><strong>MVP y récords</strong> — el MVP de la campaña aparece al ser campeón de cualquier competición, y los récords rotos durante una carrera de Rumbo a la Cima valen hasta el final de la carrera.</p>
        <p><strong>Campeonas Mundiales y Regionales</strong> — docenas de cracks nuevas agregadas a la base, con un bono permanente para quienes ya fueron campeonas de verdad y sinergia entre quienes jugaron juntas.</p>
        <p>Además: varias correcciones de errores, ajustes de equilibrio en el mercado, y la pantalla de Campañas Anteriores ahora también guarda las carreras de Rumbo a la Cima.</p>
      `},
    ],
  }
};
function t(key){
  const dict = I18N[state.lang] || I18N.pt;
  return dict[key] !== undefined ? dict[key] : I18N.pt[key];
}
function roleLabel(roleKey){ return t("roles")[roleKey] || roleKey; }
function tagLabel(tagKey){ return t("tags")[tagKey] || tagKey; }
// Ordem fixa das vagas do time: cada função tem sua vaga; Flex encaixa em qualquer uma.
const SLOT_ORDER = ["duelist","flex","initiator","controller","sentinel"];
function bracketLabel(labelKey){ return t("labels")[labelKey] || labelKey; }
