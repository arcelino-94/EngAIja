      <div style="font-size:2rem">📦</div>
      <p><strong data-i18n="uploadTitle">Envie seu arquivo</strong></p>
      <label class="upload-btn" for="fileInput" data-i18n="uploadBtn">Escolher arquivo .zip</label>
      <input type="file" id="fileInput" accept=".zip">
      <p class="file-hint" data-i18n="uploadHint">Selecione ou arraste o arquivo .zip enviado pelo Instagram</p>
    </div>
    <div id="status"></div>
    <div id="errorBox"></div>
  </div>

  <!-- ===================================================== -->
  <!-- PAINEL DE RESULTADOS (tudo que aparece DEPOIS de enviar o arquivo) -->
  <!-- ===================================================== -->
  <div id="dashboard">

    <!-- FAIXA DE AVISO "isto é uma simulação" (só aparece no modo demonstração) -->
    <div class="sim-banner" id="simBanner"><span data-i18n="simBannerText">⚠ Isto é uma simulação com dados fictícios, nenhum link leva a um perfil real</span><span class="exit" id="simExit" data-i18n="simExitBtn">Sair do exemplo</span></div>

    <!-- CARDS DE NÚMEROS NO TOPO (Seguindo, Seguidores, Diferença, Taxa) -->
    <div class="analysis-date" id="analysisDate"></div>
    <div class="stats-grid" id="statsGrid"></div>


    <!-- BOTÕES DAS 7 ABAS -->
    <nav class="tabs">
      <button class="tab-btn active" data-tab="overview">Visão geral</button>
      <button class="tab-btn" data-tab="notback">Não seguem de volta</button>
      <button class="tab-btn" data-tab="privacy">Privacidade</button>
      <button class="tab-btn" data-tab="activity">Atividade</button>
      <button class="tab-btn" data-tab="interactions">Interações</button>
      <button class="tab-btn" data-tab="profile">Perfil</button>
      <button class="tab-btn" data-tab="actions">Plano de ação</button>
    </nav>

    <!-- ABA 1: VISÃO GERAL (gráficos + cards de alerta) -->
    <section class="panel active" id="panel-overview">
      <h2>Visão geral</h2>
      <div class="charts-row">
        <div class="chart-col chart-col-follow">
          <div class="chart-wrap">
            <canvas id="chartFollow"></canvas>
            <img class="chart-print-img" id="chartFollowImg" alt="">
          </div>
          <div class="chart-legend-values" id="chartFollowLegend"></div>
        </div>
        <div class="chart-col">
          <div class="chart-wrap">
            <canvas id="chartActivity"></canvas>
            <img class="chart-print-img" id="chartActivityImg" alt="">
          </div>
        </div>
      </div>
      <div id="overviewInsights"></div>
    </section>

    <!-- ABA 2: NÃO SEGUEM DE VOLTA (busca, filtros e lista de perfis) -->
    <section class="panel" id="panel-notback">
      <h2>Quem você segue mas não te segue de volta</h2>
      <div class="toolbar">
        <input type="text" class="search-box" id="searchInput" placeholder="Procurar por username...">
        <div class="filters">
          <button class="filter-btn active" data-filter="all">Todos</button>
          <button class="filter-btn" data-filter="deleted">Contas deletadas</button>
          <button class="filter-btn" data-filter="active">Ativas</button>
        </div>
      </div>
      <div class="count-line" id="countLine"></div>
      <div class="profiles-grid" id="profilesList"></div>
      <div class="pager" id="pager"></div>
    </section>

    <!-- ABA 3: PRIVACIDADE (bloqueados, restringidos, melhores amigos etc) -->
    <section class="panel" id="panel-privacy">
      <h2>Privacidade e listas especiais</h2>
      <div id="privacyContent"></div>
    </section>

    <!-- ABA 4: ATIVIDADE (posts, stories, comentários, likes) -->
    <section class="panel" id="panel-activity">
      <h2>Sua atividade no Instagram</h2>
      <div id="activityContent"></div>
    </section>

    <!-- ABA 5: INTERAÇÕES (DMs, reações, salvos) -->
    <section class="panel" id="panel-interactions">
      <h2>Interações e engajamento</h2>
      <div id="interactionsContent"></div>
    </section>

    <!-- ABA 6: PERFIL (info pessoal, datas) -->
    <section class="panel" id="panel-profile">
      <h2>Informações do seu perfil</h2>
      <div id="profileContent"></div>
    </section>

    <!-- ABA 7: PLANO DE AÇÃO -->
    <section class="panel" id="panel-actions">
      <h2>Plano de ação</h2>
      <div id="actionsContent"></div>
    </section>

    <!-- BOTÃO "EXPORTAR DADOS" COM MENU (PDF simples / PDF completo / CSV) -->
    <div class="export-wrap">
      <div class="subscribe-strip subscribe-strip-inline" id="subscribeStripExport">
        <span class="subscribe-strip-text">⭐ Exportação gratuita limitada. Assine para exportar sem limites.</span>
        <button class="subscribe-strip-btn" id="btnOpenSubscribeExport">Assinar por $1/mês</button>
      </div>
      <div class="export-menu" id="exportMenu">
        <button data-export="report">📄 Relatório (PDF)<span class="desc">Visão geral, privacidade e plano de ação</span></button>
        <button data-export="full">📋 Relatório + Lista completa (PDF)<span class="desc">Tudo, com a lista em colunas no final</span></button>
        <button data-export="csv">📊 Lista para Excel (CSV)<span class="desc">Todos os perfis que não seguem de volta</span></button>
      </div>
      <button class="export-main-btn" id="exportMainBtn">⬇ Exportar dados</button>
    </div>

  </div>
  <!-- FIM DO PAINEL DE RESULTADOS -->

  <!-- Link para reiniciar e analisar outro arquivo -->
  <p style="text-align:center; margin-top:18px" id="resetWrap">
    <span class="reset-link" id="resetLink" style="display:none" data-i18n="resetLink">Analisar outro arquivo</span>
  </p>

</main>

<!-- ===================================================== -->
<!-- MODAL DE ASSINATURA (visual, sem cobrança real)             -->
<!-- Abre a partir de qualquer um dos botões "Assinar por $1/mês" -->
<!-- Nenhum dado de cartão digitado aqui sai do formulário — não  -->
<!-- existe backend nem Stripe conectado ainda. Ao confirmar,     -->
<!-- mostra uma tela de sucesso simulada, só pra ver o fluxo.     -->
<!-- ===================================================== -->
<div class="pay-modal" id="payModal">
  <div class="pay-box">

    <!-- TELA 1: formulário de pagamento -->
    <div id="payFormScreen">
      <div class="pay-header">
        <span>Assinar EngAIja Premium</span>
        <button class="pay-close" id="payClose" aria-label="Fechar">✕</button>
      </div>

      <div class="pay-plan-summary">
        <div class="pay-plan-name">Plano mensal</div>
        <div class="pay-plan-price">$1<span>/mês</span></div>
        <div class="pay-plan-desc">Cancele quando quiser. Sem fidelidade.</div>
      </div>

      <div class="pay-methods">
        <button type="button" class="pay-method-btn active" data-method="card">💳 Cartão</button>
        <button type="button" class="pay-method-btn" data-method="pix">🔳 Pix</button>
        <button type="button" class="pay-method-btn" data-method="paypal">🅿️ PayPal</button>
      </div>

      <form id="payFakeForm" class="pay-form">
        <label class="pay-field">
          <span>Número do cartão</span>
          <input type="text" inputmode="numeric" placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="off">
        </label>
        <div class="pay-field-row">
          <label class="pay-field">
            <span>Validade</span>
            <input type="text" placeholder="MM/AA" maxlength="5" autocomplete="off">
          </label>
          <label class="pay-field">
            <span>CVV</span>
            <input type="text" inputmode="numeric" placeholder="123" maxlength="4" autocomplete="off">
          </label>
        </div>
        <label class="pay-field">
          <span>Nome impresso no cartão</span>
          <input type="text" placeholder="Como está no cartão" autocomplete="off">
        </label>

        <div class="pay-3ds-note">🔒 Pagamento protegido com autenticação 3D Secure. Seus dados de cartão nunca são armazenados pelo EngAIja.</div>

        <button type="submit" class="pay-submit-btn">Confirmar assinatura de $1/mês</button>
        <div class="pay-badges">
          <span>VISA</span><span>Mastercard</span><span>Elo</span><span>Amex</span>
        </div>
      </form>
    </div>

    <!-- TELA 2: sucesso simulado -->
    <div id="paySuccessScreen" style="display:none">
      <div class="pay-success-icon">✓</div>
      <div class="pay-success-title">Simulação concluída</div>
      <p class="pay-success-body">Esta é uma demonstração visual. Nenhuma cobrança real foi feita e nenhum dado de cartão foi enviado a lugar nenhum.</p>
      <button class="pay-submit-btn" id="payBackToForm">Voltar</button>
    </div>

  </div>
</div>

<!-- RODAPÉ: link "Sobre" + aviso legal em letra pequena -->
<footer>
  <span class="about-link" id="aboutLink" data-i18n="aboutLink">Sobre o EngAIja</span>
  <p class="disclaimer" data-i18n="disclaimer">As análises são produzidas a partir do arquivo enviado pelo usuário. Alguns resultados representam interpretações estatísticas e podem variar conforme os dados disponibilizados pelo Instagram.</p>
</footer>

<!-- JANELA "SOBRE" (abre quando clica no link do rodapé) -->
<div class="about-modal" id="aboutModal">
  <div class="about-box">
    <h3 data-i18n="aboutBlock1Title">Nossa missão</h3>
    <p data-i18n="aboutBlock1Body">Ajudar qualquer pessoa a compreender sua rede social sem precisar fornecer senha ou instalar aplicativos inseguros.</p>
    <h3 data-i18n="aboutBlock2Title">Como funciona</h3>
    <p data-i18n="aboutBlock2Body">Você baixa o arquivo oficial do Instagram. O processamento acontece direto no seu navegador. Nenhuma informação é enviada para nossos servidores.</p>
    <h3 data-i18n="aboutBlock3Title">Nosso compromisso</h3>
    <p data-i18n="aboutBlock3Body">Privacidade, transparência e análises úteis. Sem automações. Sem acesso à sua conta.</p>
    <button class="about-close" id="aboutClose">Fechar</button>
  </div>
</div>

<script>
(function(){

  // ---------------------------------------------------------------
  // 0. TRADUÇÃO (PT / EN)
  // Dicionário central: cada texto visível da tela inicial e do
  // rodapé tem uma chave aqui. O HTML marca o texto original em
  // português com data-i18n="chave", e applyLanguage() troca o
  // textContent pela versão do idioma escolhido.
  // ---------------------------------------------------------------
  var I18N = {
    pt: {
      slogan: 'A IA que revela o que seus dados escondem',
      pitch: 'Descubra quem realmente faz parte da sua audiência usando apenas o arquivo oficial do Instagram. Ideal para criadores, empresas e qualquer pessoa que queira entender melhor a própria rede.',
      badge1: '🟢 Não pedimos sua senha',
      badge2: '🔒 Processamento local',
      badge3: '📦 Arquivo oficial do Instagram',
      previewLabel: 'Veja um exemplo antes de começar',
      statFollowing: 'Seguindo',
      statFollowers: 'Seguidores',
      statDiff: 'Diferença',
      previewBtn: '▶ Explorar demonstração',
      previewCta: 'Conheça todas as análises usando um perfil fictício. Nenhuma informação pertence a uma pessoa real.',
      securityTitle: '🔒 Seus dados ficam só no seu navegador',
      securityBody: 'Todo o processamento acontece no seu navegador. Seu arquivo não é enviado para nossos servidores e sua senha nunca é solicitada.',
      howtoTitle: '📥 Como obter seu arquivo do Instagram',
      howtoStep1: 'Abra o Instagram e acesse a Central de Contas.',
      howtoStep2: 'Entre em "Suas informações e permissões" e escolha "Baixar suas informações".',
      howtoStep3: 'Selecione apenas "Conexões" para gerar um arquivo menor e mais rápido.',
      howtoStep4: 'Escolha o formato JSON e aguarde o arquivo chegar por e-mail.',
      howtoBtn: 'Abrir Central de Contas →',
      uploadTitle: 'Envie seu arquivo',
      uploadBtn: 'Escolher arquivo .zip',
      uploadHint: 'Selecione ou arraste o arquivo .zip enviado pelo Instagram',
      simBannerText: '⚠ Isto é uma simulação com dados fictícios, nenhum link leva a um perfil real',
      simExitBtn: 'Sair do exemplo',
      resetLink: 'Analisar outro arquivo',
      aboutLink: 'Sobre o EngAIja',
      disclaimer: 'As análises são produzidas a partir do arquivo enviado pelo usuário. Alguns resultados representam interpretações estatísticas e podem variar conforme os dados disponibilizados pelo Instagram.',
      aboutBlock1Title: 'Nossa missão',
      aboutBlock1Body: 'Ajudar qualquer pessoa a compreender sua rede social sem precisar fornecer senha ou instalar aplicativos inseguros.',
      aboutBlock2Title: 'Como funciona',
      aboutBlock2Body: 'Você baixa o arquivo oficial do Instagram. O processamento acontece direto no seu navegador. Nenhuma informação é enviada para nossos servidores.',
      aboutBlock3Title: 'Nosso compromisso',
      aboutBlock3Body: 'Privacidade, transparência e análises úteis. Sem automações. Sem acesso à sua conta.'
    },
    en: {
      slogan: 'The AI that reveals what your data hides',
      pitch: 'Find out who really makes up your audience using only the official Instagram file. Great for creators, businesses and anyone who wants to understand their network better.',
      badge1: '🟢 We never ask for your password',
      badge2: '🔒 Local processing',
      badge3: '📦 Official Instagram file',
      previewLabel: 'See an example before you start',
      statFollowing: 'Following',
      statFollowers: 'Followers',
      statDiff: 'Difference',
      previewBtn: '▶ Explore demo',
      previewCta: 'See every analysis using a fictional profile. No information belongs to a real person.',
      securityTitle: '🔒 Your data stays in your browser',
      securityBody: 'All processing happens in your browser. Your file is never sent to our servers and we never ask for your password.',
      howtoTitle: '📥 How to get your Instagram file',
      howtoStep1: 'Open Instagram and go to Accounts Center.',
      howtoStep2: 'Go to "Your information and permissions" and choose "Download your information".',
      howtoStep3: 'Select only "Connections" to get a smaller, faster file.',
      howtoStep4: 'Choose the JSON format and wait for the file to arrive by email.',
      howtoBtn: 'Open Accounts Center →',
      uploadTitle: 'Upload your file',
      uploadBtn: 'Choose .zip file',
      uploadHint: 'Select or drag the .zip file sent by Instagram',
      simBannerText: '⚠ This is a simulation with fictional data, no link leads to a real profile',
      simExitBtn: 'Exit demo',
      resetLink: 'Analyze another file',
      aboutLink: 'About EngAIja',
      disclaimer: 'Analyses are produced from the file uploaded by the user. Some results represent statistical interpretations and may vary depending on the data Instagram provides.',
      aboutBlock1Title: 'Our mission',
      aboutBlock1Body: 'Help anyone understand their social network without needing to provide a password or install unsafe apps.',
      aboutBlock2Title: 'How it works',
      aboutBlock2Body: 'You download the official Instagram file. Processing happens directly in your browser. No information is sent to our servers.',
      aboutBlock3Title: 'Our commitment',
      aboutBlock3Body: 'Privacy, transparency and useful analysis. No automation. No access to your account.'
    }
  };

  var currentLang = 'pt';

  // Função de troca de idioma mantida (não removida) — só não é mais
  // chamada por nenhum botão. Se quiser reativar o inglês no futuro,
  // é só devolver o botão no HTML e religar o addEventListener abaixo.
  function applyLanguage(lang){
    currentLang = lang;
    var dict = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }

  // Idioma desligado por enquanto — botão removido do HTML.
  // var langBtn = document.getElementById('langSwitch');
  // if (langBtn) langBtn.addEventListener('click', function(){
  //   applyLanguage(currentLang === 'pt' ? 'en' : 'pt');
  // });

  // ===================================================================
  // ÁREA DE FUNÇÕES (JAVASCRIPT) — a "lógica" por trás da tela
  // ===================================================================

  // ---------------------------------------------------------------
  // 1. EXTRAÇÃO — lê um perfil de dentro do arquivo JSON do Instagram
  // (o Instagram usa formatos ligeiramente diferentes conforme o arquivo,
  // esta função entende os dois formatos que existem)
  // ---------------------------------------------------------------
  function extractProfile(item){
    if (item.string_list_data && item.string_list_data.length){
      var e = item.string_list_data[0];
      var username = item.title || e.value || null;
      if (!username) return null;
      return { username: username, href: 'https://www.instagram.com/' + username.replace(/^@/,'') + '/', timestamp: e.timestamp || 0 };
    }
    if (item.label_values && item.label_values.length){
      var username = null;
      for (var i=0;i<item.label_values.length;i++){
        var lv = item.label_values[i];
        var label = (lv.label||'').toLowerCase();
        if (label.indexOf('usu') !== -1){ username = lv.value; break; }
      }
      if (!username) return null;
      return { username: username, href: 'https://www.instagram.com/' + username.replace(/^@/,'') + '/', timestamp: item.timestamp || 0 };
    }
    return null;
  }

  function itemsFromJson(parsed){
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object'){ for (var k in parsed){ if (Array.isArray(parsed[k])) return parsed[k]; } }
    return [];
  }

  function toMap(rawList){
    var map = {};
    for (var i=0;i<rawList.length;i++){ var p = extractProfile(rawList[i]); if (p) map[p.username.toLowerCase()] = p; }
    return map;
  }

  var TARGETS = {
    following: 'following.json', followers: 'followers_1.json',
    blocked: 'blocked_profiles.json', restricted: 'restricted_profiles.json',
    closeFriends: 'close_friends.json', hideStoryFrom: 'hide_story_from.json',
    pendingIncoming: 'pending_follow_requests.json', requestsSent: 'recent_follow_requests.json',
    recentlyUnfollowed: 'recently_unfollowed_profiles.json', removedSuggestions: 'removed_suggestions.json',
    favorited: 'profiles_you_ve_favorited.json',
    // Atividade
    likedPosts: 'liked_posts.json', savedPosts: 'saved_posts.json',
    profilePhotos: 'profile_photos.json', stories: 'stories.json', reposts: 'reposts.json',
    // Interações
    secretConversations: 'secret_conversations.json', emojiReactions: 'emoji_story_reactions.json',
    storyLikes: 'story_likes.json', polls: 'polls.json', hype: 'hype.json',
    // Perfil
    profileInfo: 'instagram_profile_information.json', personalInfo: 'personal_information.json',
    signupDetails: 'signup_details.json', loginActivity: 'login_activity.json'
  };

  // ---------------------------------------------------------------
  // 2. LEITURA DO ZIP — abre o arquivo enviado pelo usuário, procura
  // os arquivos certos dentro dele (following.json, followers_1.json etc)
  // e trata erros (arquivo errado, zip corrompido, etc)
  // ---------------------------------------------------------------
  var fileInput = document.getElementById('fileInput');
  var dropZone  = document.getElementById('dropZone');
  var statusEl  = document.getElementById('status');
  var errorBox  = document.getElementById('errorBox');
  var resetLink = document.getElementById('resetLink');

  fileInput.addEventListener('change', function(e){ if (e.target.files[0]) handleZip(e.target.files[0]); });

  ;['dragenter','dragover'].forEach(function(evt){
    dropZone.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); dropZone.classList.add('dragover'); });
  });
  ;['dragleave','drop'].forEach(function(evt){
    dropZone.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover'); });
  });
  dropZone.addEventListener('drop', function(e){ var f = e.dataTransfer.files[0]; if (f) handleZip(f); });

  resetLink.addEventListener('click', function(){ location.reload(); });

  function showError(msg){ errorBox.style.display = 'block'; errorBox.textContent = msg; statusEl.textContent = ''; }

  function handleZip(file){
    errorBox.style.display = 'none';
    if (!file.name.toLowerCase().endsWith('.zip')){
      showError('Isso não parece um arquivo .zip. Envie o ZIP baixado do Instagram (Configurações → Central de Contas → Suas informações e permissões → Baixar suas informações).');
      return;
    }
    statusEl.textContent = 'Lendo o arquivo...';

    JSZip.loadAsync(file).then(function(zip){
      statusEl.textContent = 'Procurando os arquivos de conexões...';
      var found = {}; var wanted = {};
      for (var k in TARGETS) wanted[TARGETS[k]] = k;
      zip.forEach(function(relPath, zipEntry){
        var name = relPath.split('/').pop();
        if (wanted[name] !== undefined){ found[wanted[name]] = zipEntry; }
      });
      if (!found.following || !found.followers){
        showError('Não encontrei following.json e/ou followers_1.json dentro do ZIP. Confirme que este é o export de "Conexões" do Instagram.');
        return;
      }
      var keys = Object.keys(found);
      var promises = keys.map(function(k){
        return found[k].async('string').then(function(text){
          try { return { key:k, data: JSON.parse(text) }; } catch(e){ return { key:k, data: null }; }
        });
      });
      Promise.all(promises).then(function(results){
        var raw = {};
        results.forEach(function(r){ raw[r.key] = r.data ? itemsFromJson(r.data) : []; });
        statusEl.textContent = 'Processando dados...';
        setTimeout(function(){ buildDashboard(raw); }, 50);
      });
    }).catch(function(err){
      showError('Não consegui abrir esse ZIP (' + err.message + '). Tente exportar de novo pelo Instagram.');
    });
  }

  // ---------------------------------------------------------------
  // 3. PROCESSAMENTO — pega os dados brutos do zip (ou da simulação
  // fictícia) e monta tudo que o painel de resultados precisa mostrar:
  // quem não segue de volta, contas deletadas, listas de privacidade etc
  // ---------------------------------------------------------------
  var STATE = { notFollowingBack: [], filtered: [], page:1, perPage:15, filter:'all', unfollowedCount:0, removedSuggCount:0 };
  var SIM_MODE = false; // true durante a simulação com dados fictícios — bloqueia navegação real dos links

  // -----------------------------------------------------------------
  // 3.1 GERADOR DE DADOS FICTÍCIOS — cria os números de mentira usados
  // no botão "Explorar demonstração". Gera dados no MESMO formato bruto
  // que vem do ZIP real, então passam pelas mesmas funções de sempre.
  // Nenhum destes nomes corresponde a perfil real; os links usam um
  // endereço que claramente não navega a lugar nenhum.
  // -----------------------------------------------------------------
  function buildFakeUsername(i){
    var nomes = ['perfil_exemplo','conta_fake','usuario_teste','demo_criador','exemplo_conta','fake_perfil','conta_simulada','usuario_demo','perfil_teste','exemplo_fake'];
    return nomes[i % nomes.length] + '_' + (100 + i);
  }
  function fakeStringListItem(i){
    return { title: buildFakeUsername(i), string_list_data: [{ value: buildFakeUsername(i), href: 'exemplo://perfil-fake/'+i, timestamp: 1700000000 + i*1000 }] };
  }
  function generateFakeRaw(){
    var following = [];
    for (var i=0;i<843;i++) following.push(fakeStringListItem(i));
    var followers = [];
    // ~636 dos 843 seguidos seguem de volta (gera ~207 que não seguem, perto do card ilustrativo)
    for (var j=0;j<1050;j++){
      if (j < 636) followers.push(fakeStringListItem(j));
      else followers.push(fakeStringListItem(900 + j)); // seguidores extras que ele não segue
    }
    // marca algumas contas "não seguem de volta" como deletadas, pra simular esse cenário também
    for (var k=636;k<644;k++){ following[k].title = '__deleted__' + buildFakeUsername(k); following[k].string_list_data[0].value = following[k].title; }

    var blocked = [fakeStringListItem(9001), fakeStringListItem(9002)];
    var restricted = [fakeStringListItem(9010)];
    var closeFriends = [fakeStringListItem(9020), fakeStringListItem(9021), fakeStringListItem(9022)];
    var hideStoryFrom = [fakeStringListItem(9030)];
    var pendingIncoming = [fakeStringListItem(9040)];
    var recentFollowRequests = [fakeStringListItem(9050), fakeStringListItem(9051)];
    var recentlyUnfollowed = [fakeStringListItem(9060), fakeStringListItem(9061), fakeStringListItem(9062)];
    var removedSuggestions = [fakeStringListItem(9070)];
    var favorited = [fakeStringListItem(9080)];

    return {
      following: following, followers: followers, blocked: blocked, restricted: restricted,
      closeFriends: closeFriends, hideStoryFrom: hideStoryFrom, pendingIncoming: pendingIncoming,
      requestsSent: recentFollowRequests, recentlyUnfollowed: recentlyUnfollowed,
      removedSuggestions: removedSuggestions, favorited: favorited
    };
  }

  // Liga o modo demonstração quando a pessoa clica no botão "Explorar demonstração"
  function startSimulation(){
    SIM_MODE = true;
    buildDashboard(generateFakeRaw());
    document.getElementById('simBanner').classList.add('active');
  }

  document.getElementById('btnVerExemplo').addEventListener('click', startSimulation);
  document.getElementById('simExit').addEventListener('click', function(){ location.reload(); });

  // ---------------------------------------------------------------
  // 3.2 MONTAGEM DO PAINEL — a função principal. Recebe os dados
  // (reais ou fictícios) e chama todas as funções de RENDER abaixo
  // para preencher a tela inteira: números, gráficos, listas, etc
  // ---------------------------------------------------------------
  function buildDashboard(raw){
    var following  = toMap(raw.following  || []);
    var followers  = toMap(raw.followers  || []);
    var blocked    = toMap(raw.blocked    || []);
    var restricted = toMap(raw.restricted || []);
    var closeFriends = toMap(raw.closeFriends || []);
    var hideStory  = toMap(raw.hideStoryFrom || []);
    var pendingIn  = toMap(raw.pendingIncoming || []);
    var requestsSent = toMap(raw.requestsSent || []);
    var unfollowed = toMap(raw.recentlyUnfollowed || []);
    var removedSugg = toMap(raw.removedSuggestions || []);
    var favorited  = toMap(raw.favorited || []);

    var followingKeys = Object.keys(following);
    var followersKeys = Object.keys(followers);
    var followersSet = {}; followersKeys.forEach(function(k){ followersSet[k]=true; });

    var notFollowingBack = [];
    followingKeys.forEach(function(k){ if (!followersSet[k]) notFollowingBack.push(following[k]); });
    notFollowingBack.sort(function(a,b){ return a.username.localeCompare(b.username); });

    var deletedCount = notFollowingBack.filter(isDeleted).length;
    var totalFollowing = followingKeys.length;
    var totalFollowers = followersKeys.length;
    var diff = totalFollowers - totalFollowing;
    var ratio = totalFollowing ? (totalFollowers/totalFollowing) : 0;

    STATE.notFollowingBack = notFollowingBack;
    STATE.filtered = notFollowingBack;
    STATE.totalFollowing = totalFollowing;
    STATE.totalFollowers = totalFollowers;
    STATE.diff = diff;
    STATE.ratio = ratio;
    STATE.deletedCount = deletedCount;
    STATE.analysisDate = new Date();

    document.getElementById('uploadScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    resetLink.style.display = 'inline';

    renderStats({ totalFollowing: totalFollowing, totalFollowers: totalFollowers, diff: diff, ratio: ratio,
      notBack: notFollowingBack.length, deleted: deletedCount });

    STATE.unfollowedCount = Object.keys(unfollowed).length;
    STATE.removedSuggCount = Object.keys(removedSugg).length;
    renderCharts({ totalFollowing: totalFollowing, totalFollowers: totalFollowers,
      notBack: notFollowingBack.length, deleted: deletedCount, active: notFollowingBack.length - deletedCount,
      unfollowed: STATE.unfollowedCount, removedSugg: STATE.removedSuggCount });

    renderOverviewInsights({ diff: diff, ratio: ratio, notBack: notFollowingBack.length, deleted: deletedCount,
      pendingIn: Object.keys(pendingIn).length, requestsSentNotAccepted: countNotAccepted(requestsSent, followersSet),
      totalFollowing: totalFollowing, totalFollowers: totalFollowers });

    renderPrivacy({ blocked: Object.values(blocked), restricted: Object.values(restricted),
      closeFriends: Object.keys(closeFriends).length, hideStory: Object.keys(hideStory).length,
      favorited: Object.keys(favorited).length, pendingIn: Object.values(pendingIn),
      requestsSentList: Object.values(requestsSent).filter(function(p){ return !followersSet[p.username.toLowerCase()]; }) });

    renderActivity({ likedPostsCount: (raw.likedPosts || []).length, savedPostsCount: (raw.savedPosts || []).length,
      storiesCount: (raw.stories || []).length, repostsCount: (raw.reposts || []).length,
      profilePhotosCount: (raw.profilePhotos || []).length });

    renderInteractions({ emojiReactionsCount: (raw.emojiReactions || []).length, storyLikesCount: (raw.storyLikes || []).length,
      pollsCount: (raw.polls || []).length, hypeCount: (raw.hype || []).length,
      secretConversationsCount: (raw.secretConversations || []).length });

    renderProfile({ profileInfo: (raw.profileInfo || []).length > 0 ? raw.profileInfo[0] : null,
      personalInfo: (raw.personalInfo || []).length > 0 ? raw.personalInfo[0] : null,
      signupDetails: (raw.signupDetails || []).length > 0 ? raw.signupDetails[0] : null,
      loginActivity: raw.loginActivity || [] });

    renderActions({ deleted: deletedCount, notBack: notFollowingBack.length, restricted: Object.keys(restricted).length });

    setupTabs();
    setupToolbar();
    setupExport();
    renderProfilesList();
  }

  function isDeleted(p){ return /__deleted__/i.test(p.username) || /^instagramuser$/i.test(p.username); }

  // No modo simulação, o link nunca navega — href vazio + preventDefault via onclick.
  // Isso é mais seguro que confiar só no protocolo customizado do dado fictício.
  function chipHrefAttrs(p){
    if (SIM_MODE){
      return 'href="javascript:void(0)" onclick="return false;"';
    }
    var safeHref = p.href.replace(/"/g,'&quot;');
    return 'href="' + safeHref + '" target="_blank" rel="noopener"';
  }
  function countNotAccepted(requestsSent, followersSet){ var n=0; for (var k in requestsSent){ if (!followersSet[k]) n++; } return n; }
  function fmt(n){ return n.toLocaleString('pt-BR'); }
  function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ---------------------------------------------------------------
  // 4. RENDER — CARDS DE NÚMEROS (Seguindo, Seguidores, Diferença, Taxa)
  // ---------------------------------------------------------------
  function renderStats(s){
    var cards = [
      [fmt(s.totalFollowing), 'Seguindo', ''],
      [fmt(s.totalFollowers), 'Seguidores', ''],
      [(s.diff>=0?'+':'') + fmt(s.diff), 'Diferença', ''],
      [s.ratio.toFixed(2)+'x', 'Taxa de retorno', 'tt']
    ];
    var html = cards.map(function(c){
      return '<div class="stat-card '+c[2]+'"><div class="num">'+c[0]+'</div><div class="lbl">'+c[1]+'</div></div>';
    }).join('');
    document.getElementById('statsGrid').innerHTML = html;

    var dateEl = document.getElementById('analysisDate');
    if (dateEl && STATE.analysisDate){
      var d = STATE.analysisDate;
      var formatted = d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
      dateEl.textContent = 'Análise processada em ' + formatted;
    }
  }

  // ---------------------------------------------------------------
  // 5. RENDER — GRÁFICOS (rosca de seguidores/seguindo + barras de atividade)
  // Também gera uma versão em imagem de cada gráfico, usada depois
  // na hora de montar o PDF de exportação
  // ---------------------------------------------------------------
  var chartFollowInstance, chartActivityInstance;
  var CHART_COLORS_FOLLOW = ['#962fbf','#fa7e1e'];
  var CHART_COLORS_ACTIVITY = ['#d62976','#6c6c76','#0fa968','#fa7e1e','#4f5bd5'];

  function renderCharts(d){
    if (chartFollowInstance) chartFollowInstance.destroy();
    if (chartActivityInstance) chartActivityInstance.destroy();

    var followData = [d.totalFollowers, d.totalFollowing];
    chartFollowInstance = new Chart(document.getElementById('chartFollow'), {
      type:'doughnut',
      data:{ labels:['Seguidores','Seguindo'], datasets:[{ data: followData, backgroundColor: CHART_COLORS_FOLLOW }] },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false },
          tooltip:{ callbacks:{ label:function(ctx){ return ctx.label + ': ' + fmt(ctx.raw); } } } } }
    });
    // legenda com números visíveis embaixo (em vez de depender de plugin extra)
    // cada span tem margem própria (não só gap do container pai) pra garantir
    // espaçamento mesmo quando capturado pelo html2canvas na exportação de PDF
    document.getElementById('chartFollowLegend').innerHTML =
      '<span style="margin:0 8px"><span class="sw" style="background:'+CHART_COLORS_FOLLOW[0]+'"></span>Seguidores: '+fmt(d.totalFollowers)+'</span>' +
      '<span style="margin:0 8px"><span class="sw" style="background:'+CHART_COLORS_FOLLOW[1]+'"></span>Seguindo: '+fmt(d.totalFollowing)+'</span>';

    var activityData = [d.notBack, d.deleted, d.active, d.unfollowed, d.removedSugg];
    var activityLabels = ['Não seguem de volta','Deletadas','Ativas','Deixou de seguir','Sugestões removidas'];
    chartActivityInstance = new Chart(document.getElementById('chartActivity'), {
      // barras horizontais (indexAxis:y) — leitura melhor no celular do que rótulos na diagonal
      type:'bar',
      data:{ labels: activityLabels, datasets:[{ data: activityData, backgroundColor: CHART_COLORS_ACTIVITY }] },
      options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
        scales:{ x:{ beginAtZero:true, ticks:{font:{size:10}} }, y:{ ticks:{font:{size:10}} } },
        plugins:{ legend:{ display:false },
          tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.raw); } } } } }
    });

    // Prepara as versões estáticas (toBase64Image) dos gráficos, usadas
    // depois na montagem do PDF de exportação (buildPrintContainer).
    // Precisa esperar o navegador terminar de aplicar o layout (incluindo
    // o aspect-ratio do container da rosca) antes de capturar — senão a
    // imagem gerada carrega uma proporção errada, mesmo que a tela já
    // pareça correta visualmente um instante depois. Duas chamadas
    // encadeadas de requestAnimationFrame garantem que pelo menos um
    // ciclo completo de layout+pintura já rodou, o que é mais confiável
    // do que esperar um número fixo de milissegundos.
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        try{
          var img1 = document.getElementById('chartFollowImg');
          img1.src = chartFollowInstance.toBase64Image();
          img1.classList.add('ready');
          var img2 = document.getElementById('chartActivityImg');
          img2.src = chartActivityInstance.toBase64Image();
          img2.classList.add('ready');
        } catch(e){ /* se falhar, o PDF ainda mostra o restante do relatório normalmente */ }
      });
    });
  }

  // ---------------------------------------------------------------
  // 6. RENDER — CARDS DE ALERTA da aba Visão Geral (inclui a explicação
  // da "Taxa de retorno" com o exemplo em português simples)
  // ---------------------------------------------------------------
  function renderOverviewInsights(d){
    var html = '';

    // Explicação da Taxa com exemplo simples, sem fórmula
    var per10 = Math.round(d.ratio * 10);
    html += '<div class="insight'+(d.ratio>=1?' good':'')+'">' +
      '<strong>Taxa de retorno: ' + d.ratio.toFixed(2) + 'x</strong>' +
      'Mostra quantos seguidores você tem para cada pessoa que você segue.' +
      '<span class="ex">Ou seja: a cada 10 pessoas que você segue, cerca de ' + per10 + ' seguem você de volta.</span>' +
    '</div>';

    if (d.diff >= 0){
      html += '<div class="insight good"><strong>Você tem ' + fmt(d.diff) + ' mais seguidores do que segue.</strong></div>';
    } else {
      html += '<div class="insight"><strong>Você segue ' + fmt(-d.diff) + ' pessoas a mais do que te seguem.</strong></div>';
    }
    html += '<div class="insight warn"><strong>' + fmt(d.notBack) + ' perfis que você segue não te seguem de volta.</strong>Veja a aba "Não seguem de volta" para a lista completa.</div>';
    if (d.deleted > 0){
      html += '<div class="insight bad"><strong>' + fmt(d.deleted) + ' contas deletadas</strong> ainda aparecem na sua lista de seguindo.</div>';
    }
    if (d.pendingIn > 0){
      html += '<div class="insight"><strong>' + fmt(d.pendingIn) + ' solicitação(ões) de seguimento aguardando sua resposta.</strong></div>';
    }
    if (d.requestsSentNotAccepted > 0){
      html += '<div class="insight"><strong>' + fmt(d.requestsSentNotAccepted) + ' solicitação(ões) que você enviou ainda não foram aceitas.</strong></div>';
    }
    document.getElementById('overviewInsights').innerHTML = html;
  }

  // ---------------------------------------------------------------
  // 7. RENDER — LISTA "NÃO SEGUEM DE VOLTA" (busca, filtros, paginação)
  // ---------------------------------------------------------------
  function setupToolbar(){
    document.getElementById('searchInput').addEventListener('input', function(e){ applyFilterAndSearch(e.target.value); });
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        STATE.filter = btn.dataset.filter;
        STATE.page = 1;
        applyFilterAndSearch(document.getElementById('searchInput').value);
      });
    });
  }

  function applyFilterAndSearch(query){
    var base = STATE.notFollowingBack;
    if (STATE.filter === 'deleted') base = base.filter(isDeleted);
    if (STATE.filter === 'active')  base = base.filter(function(p){ return !isDeleted(p); });
    query = (query||'').toLowerCase().trim();
    if (query){ base = base.filter(function(p){ return p.username.toLowerCase().indexOf(query) !== -1; }); }
    STATE.filtered = base;
    STATE.page = 1;
    renderProfilesList();
  }

  function renderProfilesList(){
    var list = STATE.filtered;
    document.getElementById('countLine').textContent = 'Mostrando ' + fmt(list.length) + ' de ' + fmt(STATE.notFollowingBack.length) + ' perfis';

    var container = document.getElementById('profilesList');
    if (list.length === 0){
      container.innerHTML = '<div class="empty">Nenhum perfil encontrado com esse filtro/busca.</div>';
      document.getElementById('pager').innerHTML = '';
      return;
    }

    var start = (STATE.page-1) * STATE.perPage;
    var pageItems = list.slice(start, start+STATE.perPage);

    container.innerHTML = pageItems.map(function(p){
      var tag = isDeleted(p) ? '<span class="tag del">deletada</span>' : '';
      var fullName = escapeHtml(p.username);
      return '<a class="profile-chip" ' + chipHrefAttrs(p) + ' title="' + fullName + (SIM_MODE ? ' (exemplo fictício)' : '') + '">' +
               '<span class="uname">' + fullName + '</span>' + tag + '<span class="arrow">↗</span>' +
             '</a>';
    }).join('');

    var totalPages = Math.ceil(list.length / STATE.perPage);
    var pagerHtml = '';
    for (var i=1; i<=totalPages; i++){ pagerHtml += '<button data-page="'+i+'" class="'+(i===STATE.page?'active':'')+'">'+i+'</button>'; }
    var pagerEl = document.getElementById('pager');
    pagerEl.innerHTML = pagerHtml;
    pagerEl.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click', function(){
        STATE.page = parseInt(btn.dataset.page, 10);
        renderProfilesList();
        document.getElementById('panel-notback').scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
  }

  // ---------------------------------------------------------------
  // 8. RENDER — ABA PRIVACIDADE (bloqueados, restringidos, melhores amigos etc)
  // ---------------------------------------------------------------
  function renderPrivacy(d){
    var html = '';
    html += '<div class="stats-grid">' +
      statCard(d.blocked.length, 'Bloqueados') + statCard(d.restricted.length, 'Restringidos') +
      statCard(d.hideStory, 'Esconder história de') + statCard(d.closeFriends, 'Melhores amigos') +
      statCard(d.favorited, 'Favoritados') + statCard(d.pendingIn.length, 'Pedidos pendentes') +
    '</div>';

    if (d.blocked.length){ html += '<h3>Bloqueados (' + d.blocked.length + ')</h3>' + simpleGrid(d.blocked); }
    if (d.restricted.length){ html += '<h3>Restringidos (' + d.restricted.length + ')</h3>' + simpleGrid(d.restricted); }
    if (d.pendingIn.length){ html += '<h3>Pedidos de seguimento aguardando sua resposta (' + d.pendingIn.length + ')</h3>' + simpleGrid(d.pendingIn); }
    if (d.requestsSentList.length){ html += '<h3>Solicitações que você enviou e ainda não foram aceitas (' + d.requestsSentList.length + ')</h3>' + simpleGrid(d.requestsSentList); }
    document.getElementById('privacyContent').innerHTML = html;
  }

  function statCard(n, label){ return '<div class="stat-card"><div class="num">'+fmt(n)+'</div><div class="lbl">'+label+'</div></div>'; }

  function simpleGrid(arr){
    return '<div class="profiles-grid" style="margin-bottom:10px">' + arr.map(function(p){
      var fullName = escapeHtml(p.username);
      return '<a class="profile-chip" '+chipHrefAttrs(p)+' title="'+fullName+(SIM_MODE ? ' (exemplo fictício)' : '')+'">' +
             '<span class="uname">'+fullName+'</span><span class="arrow">↗</span></a>';
    }).join('') + '</div>';
  }

  // ---------------------------------------------------------------
  // 9. RENDER — PLANO DE AÇÃO (cards "Agora", "Esta semana", "Manutenção")
  // ---------------------------------------------------------------
  function renderActions(d){
    var html = '';
    if (d.deleted > 0){
      html += '<div class="reco urgent"><h4>Agora (2 minutos)</h4><ul>' +
        '<li>Deixe de seguir as ' + d.deleted + ' contas marcadas como "deletada" — não existem mais.</li>' +
      '</ul></div>';
    }
    html += '<div class="reco mid"><h4>Esta semana</h4><ul>' +
      '<li>Revise os ' + fmt(d.notBack - d.deleted) + ' perfis ativos que não seguem você de volta.</li>' +
      '<li>Use a busca e os filtros na aba "Não seguem de volta" para ir marcando o que quer manter.</li>' +
    '</ul></div>';
    html += '<div class="reco"><h4>Manutenção contínua</h4><ul>' +
      (d.restricted > 0 ? '<li>Revise os ' + d.restricted + ' perfis restringidos — ainda fazem sentido?</li>' : '') +
      '<li>Ative o download recorrente no Instagram e volte aqui a cada nova exportação.</li>' +
    '</ul></div>';
    document.getElementById('actionsContent').innerHTML = html;
  }

  // ---------------------------------------------------------------
  // 9A. RENDER — ATIVIDADE (posts, stories, comentários, likes)
  // ---------------------------------------------------------------
  function renderActivity(d){
    var html = '<div class="stats-grid">' +
      statCard(fmt(d.likedPostsCount), '❤️ Posts curtidos') +
      statCard(fmt(d.savedPostsCount), '🔖 Posts salvos') +
      statCard(fmt(d.storiesCount), '📸 Stories') +
      statCard(fmt(d.profilePhotosCount), '🖼️ Fotos de perfil') +
      statCard(fmt(d.repostsCount), '🔄 Reposts') +
    '</div>';
    
    if (d.likedPostsCount > 0) {
      html += '<div class="insight good"><strong>💪 Você curtiu ' + fmt(d.likedPostsCount) + ' posts</strong>Isso mostra engajamento ativo na plataforma.</div>';
    }
    if (d.savedPostsCount > 0) {
      html += '<div class="insight"><strong>📚 ' + fmt(d.savedPostsCount) + ' posts salvos</strong>Coisas que você quer revisitar ou usar como inspiração.</div>';
    }
    if (d.storiesCount > 0) {
      html += '<div class="insight"><strong>📝 Você postou ' + fmt(d.storiesCount) + ' stories</strong>Stories são ótimos para conexão rápida com seguidores.</div>';
    }
    
    document.getElementById('activityContent').innerHTML = html;
  }

  // ---------------------------------------------------------------
  // 9B. RENDER — INTERAÇÕES (DMs, reações, salvos)
  // ---------------------------------------------------------------
  function renderInteractions(d){
    var html = '<div class="stats-grid">' +
      statCard(fmt(d.emojiReactionsCount), '😊 Reações em stories') +
      statCard(fmt(d.storyLikesCount), '❤️ Curtidas em stories') +
      statCard(fmt(d.pollsCount), '📊 Participou de enquetes') +
      statCard(fmt(d.hypeCount), '🔥 Hypes recebidos') +
      statCard(fmt(d.secretConversationsCount), '🤐 Chats secretos') +
    '</div>';
    
    if (d.emojiReactionsCount > 0) {
      html += '<div class="insight good"><strong>🎉 ' + fmt(d.emojiReactionsCount) + ' reações em stories</strong>As pessoas interagem com suas histórias!</div>';
    }
    if (d.storyLikesCount > 0) {
      html += '<div class="insight good"><strong>👍 Você curtiu ' + fmt(d.storyLikesCount) + ' stories</strong>Que legal, você interage bastante com o conteúdo.</div>';
    }
    if (d.secretConversationsCount > 0) {
      html += '<div class="insight"><strong>🤫 ' + fmt(d.secretConversationsCount) + ' chats secretos</strong>Conversas privadas que desaparecem.</div>';
    }
    
    document.getElementById('interactionsContent').innerHTML = html;
  }

  // ---------------------------------------------------------------
  // 9C. RENDER — PERFIL (info pessoal, datas, logins)
  // ---------------------------------------------------------------
  function renderProfile(d){
    var html = '';
    
    if (d.signupDetails && d.signupDetails.label_values){
      var signupTime = null;
      d.signupDetails.label_values.forEach(function(lv){
        if (lv.label && lv.label.toLowerCase().indexOf('inscr') !== -1 && lv.timestamp_value){
          signupTime = new Date(lv.timestamp_value * 1000);
        }
      });
      if (signupTime){
        var days = Math.floor((new Date() - signupTime) / (1000*60*60*24));
        html += '<div class="insight good"><strong>📅 Membro desde ' + signupTime.toLocaleDateString('pt-BR') + '</strong>Você tem essa conta há ' + fmt(days) + ' dias!</div>';
      }
    }

    if (d.profileInfo && d.profileInfo.label_values){
      var lastLogin = null, inscriptionTime = null;
      d.profileInfo.label_values.forEach(function(lv){
        var label = (lv.label || '').toLowerCase();
        if (label.indexOf('último login') !== -1 && lv.timestamp_value){
          lastLogin = new Date(lv.timestamp_value * 1000);
        }
        if (label.indexOf('primeiro story') !== -1 && lv.timestamp_value){
          inscriptionTime = new Date(lv.timestamp_value * 1000);
        }
      });
      
      if (lastLogin){
        var hoursAgo = Math.floor((new Date() - lastLogin) / (1000*60*60));
        if (hoursAgo < 24){
          html += '<div class="insight good"><strong>✅ Último login: ' + lastLogin.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) + '</strong>Você usa o Instagram regularmente!</div>';
        } else {
          html += '<div class="insight warn"><strong>⏰ Última atividade há ' + hoursAgo + ' horas</strong>Data: ' + lastLogin.toLocaleDateString('pt-BR') + '</div>';
        }
      }
      
      if (inscriptionTime){
        var years = Math.floor((new Date() - inscriptionTime) / (1000*60*60*24*365));
        html += '<div class="insight"><strong>🎂 Primeira story: ' + inscriptionTime.toLocaleDateString('pt-BR') + '</strong>Há ' + years + ' anos você começou a compartilhar!</div>';
      }
    }

    if (d.loginActivity && Array.isArray(d.loginActivity) && d.loginActivity.length > 0){
      var recentLogins = Math.min(5, d.loginActivity.length);
      html += '<h3>📱 Últimos acessos</h3>';
      html += '<div style="background: #faf8fc; padding: 12px; border-radius: 8px; font-size: 0.85rem;">';
      for (var i = 0; i < recentLogins; i++){
        var login = d.loginActivity[i];
        if (login.label_values){
          var timestamp = null, device = null;
          login.label_values.forEach(function(lv){
            if (lv.timestamp_value) timestamp = lv.timestamp_value;
            if (lv.label && lv.label.toLowerCase().indexOf('dispositivo') !== -1) device = lv.value;
          });
          if (timestamp){
            var loginDate = new Date(timestamp * 1000);
            html += '<div style="padding: 6px 0; border-bottom: 1px solid #e6d5f5;">' + loginDate.toLocaleDateString('pt-BR') + ' às ' + loginDate.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) + (device ? ' • ' + device : '') + '</div>';
          }
        }
      }
      html += '</div>';
    }

    if (!html){
      html = '<div class="empty">Nenhuma informação de perfil disponível neste arquivo.</div>';
    }

    document.getElementById('profileContent').innerHTML = html;
  }

  // ---------------------------------------------------------------
  // 10. NAVEGAÇÃO DAS ABAS — troca qual aba fica visível quando clica
  // ---------------------------------------------------------------
  function setupTabs(){
    var tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        tabBtns.forEach(function(b){ b.classList.remove('active'); });
        document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });
  }

  // ===================================================================
  // 11. EXPORTAÇÃO — tudo relacionado a baixar PDF e CSV
  // ===================================================================

  // --- 11.1 Abre/fecha o menuzinho do botão "Exportar dados" ---
  function setupExport(){
    var mainBtn = document.getElementById('exportMainBtn');
    var menu = document.getElementById('exportMenu');
    mainBtn.addEventListener('click', function(e){
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function(e){
      if (!menu.contains(e.target) && e.target !== mainBtn){ menu.classList.remove('open'); }
    });
    menu.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click', function(){
        menu.classList.remove('open');
        var type = btn.dataset.export;
        if (type === 'csv') exportCsv();
        else exportPdf(type === 'full');
      });
    });
  }

  // --- 11.2 Monta o conteúdo do PDF (invisível na tela, só usado internamente) ---
  // Copia os números e cards já calculados e organiza em "blocos".
  // Formato de página estreito (parecido com celular), não A4.
  // Não depende de @media print / window.print(), que não funciona de
  // forma confiável em apps de "compartilhar como PDF" no celular —
  // eles não disparam a media query corretamente. Aqui o PDF é montado
  // programaticamente a partir de uma "foto" (canvas) do conteúdo,
  // então o resultado é o mesmo em qualquer navegador ou app.
  // ---------------------------------------------------------------
  // GERAÇÃO DE PDF — DESENHO NATIVO (não captura de tela)
  // Depois de repetidos problemas de corte/sobreposição usando
  // html2canvas para fotografar pedaços de HTML, a exportação foi
  // refeita para desenhar texto, números e barras diretamente com
  // os comandos do jsPDF (pdf.text, pdf.rect). Isso elimina a causa
  // raiz dos bugs anteriores: não existe mais "foto" de tela que possa
  // sair cortada ou embaralhada — cada elemento vai exatamente para
  // a coordenada calculada. Só o gráfico de rosca continua sendo uma
  // imagem, por ser a única peça realmente visual (círculo colorido).
  // ---------------------------------------------------------------

  var PDF_COLORS = {
    purple: [150,47,191], purpleLight: [247,242,251], ink: [28,28,31], muted: [108,108,118],
    green: [15,169,104], greenBg: [226,248,239], amber: [201,138,4], amberBg: [255,243,205],
    red: [224,41,75], redBg: [255,227,233], orange: [250,126,30]
  };

  // Desenha texto quebrado em várias linhas, uma por uma, em posições que EU
  // controlo (y + i*lineHeight) — não depende de adivinhar a altura de linha
  // interna do jsPDF quando se passa um array pra pdf.text(). É isso que evita
  // texto sobreposto ou com espaçamento estranho entre linhas.
  function drawWrappedText(pdf, text, x, y, maxWidth, lineHeight, align){
    if (!text) return y;
    var lines = pdf.splitTextToSize(text, maxWidth);
    lines.forEach(function(line, i){
      if (align) pdf.text(line, x, y + i*lineHeight, { align: align });
      else pdf.text(line, x, y + i*lineHeight);
    });
    return y + lines.length * lineHeight;
  }

  // Fatia de pizza desenhada como um leque de triângulos finos (~4° cada) —
  // método simples e confiável do jsPDF, sem depender de path/bezier.
  function drawPieSlice(pdf, cx, cy, r, startDeg, sweepDeg, color){
    if (sweepDeg <= 0) return;
    var steps = Math.max(1, Math.ceil(sweepDeg / 4));
    var stepDeg = sweepDeg / steps;
    pdf.setFillColor(color[0], color[1], color[2]);
    for (var i = 0; i < steps; i++){
      var a1 = (startDeg + i*stepDeg) * Math.PI/180;
      var a2 = (startDeg + (i+1)*stepDeg) * Math.PI/180;
      var x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
      var x2 = cx + r*Math.cos(a2), y2 = cy + r*Math.sin(a2);
      pdf.triangle(cx, cy, x1, y1, x2, y2, 'F');
    }
  }

  // Gráfico de rosca desenhado matematicamente — substitui de vez a versão
  // que capturava o canvas do Chart.js como imagem. Nunca mais depende de
  // canvas renderizar em proporção quadrada: aqui é geometria calculada,
  // sempre um círculo de verdade, testável sem navegador nenhum.
  function drawDonutChart(pdf, cx, cy, r, values, colors){
    var total = values.reduce(function(a,b){ return a+b; }, 0);
    if (total <= 0) return;
    var startDeg = -90;
    values.forEach(function(v, i){
      var sweep = (v/total) * 360;
      drawPieSlice(pdf, cx, cy, r, startDeg, sweep, colors[i]);
      startDeg += sweep;
    });
    pdf.setFillColor(255,255,255);
    pdf.circle(cx, cy, r*0.55, 'F');
  }

  // --- Extração de dado (DOM → objeto simples), separada do desenho ---
  // Isolar isso permite testar a lógica de desenho sozinha, com dado de
  // mentira, sem precisar de navegador — foi essa falta de teste real que
  // deixou passar bugs nas versões anteriores.
  function extractInsightData(){
    return Array.prototype.map.call(document.querySelectorAll('#overviewInsights .insight'), function(el){
      var strongEl = el.querySelector('strong');
      var exEl = el.querySelector('.ex');
      var strongText = strongEl ? strongEl.textContent.trim() : '';
      var exText = exEl ? exEl.textContent.trim() : '';
      // Remove os nós strong/ex de uma CÓPIA do elemento antes de ler o texto
      // restante — mais confiável que "substituir substring", que pode falhar
      // se o texto se repetir ou tiver espaçamento diferente do esperado.
      var clone = el.cloneNode(true);
      var cStrong = clone.querySelector('strong');
      var cEx = clone.querySelector('.ex');
      if (cStrong && cStrong.parentNode) cStrong.parentNode.removeChild(cStrong);
      if (cEx && cEx.parentNode) cEx.parentNode.removeChild(cEx);
      var bodyText = clone.textContent.trim();
      var kind = el.classList.contains('bad') ? 'bad' : el.classList.contains('good') ? 'good' : el.classList.contains('warn') ? 'warn' : 'default';
      return { strongText: strongText, bodyText: bodyText, exText: exText, kind: kind };
    });
  }

  function extractRecoData(){
    return Array.prototype.map.call(document.querySelectorAll('#actionsContent .reco'), function(el){
      var h4 = el.querySelector('h4') ? el.querySelector('h4').textContent.trim() : '';
      var items = Array.prototype.map.call(el.querySelectorAll('li'), function(li){ return li.textContent.trim(); });
      var kind = el.classList.contains('urgent') ? 'urgent' : el.classList.contains('mid') ? 'mid' : 'default';
      return { title: h4, items: items, kind: kind };
    });
  }

  // --- Desenho (dado simples → PDF), sem tocar em DOM ---
  // totalH nunca passa de uma página inteira (maxCardH) — trava de segurança
  // contra qualquer cálculo de altura sair errado e gerar páginas em branco.
  function drawInsightCard(pdf, data, x, w, ensureSpace, pageHeight, margin){
    var bg = data.kind==='bad' ? PDF_COLORS.redBg : data.kind==='good' ? PDF_COLORS.greenBg : data.kind==='warn' ? PDF_COLORS.amberBg : PDF_COLORS.purpleLight;
    var bar = data.kind==='bad' ? PDF_COLORS.red : data.kind==='good' ? PDF_COLORS.green : data.kind==='warn' ? PDF_COLORS.amber : PDF_COLORS.purple;
    var lh = 3.6;

    pdf.setFontSize(7.5);
    var strongLines = data.strongText ? pdf.splitTextToSize(data.strongText, w-6) : [];
    var bodyLines = data.bodyText ? pdf.splitTextToSize(data.bodyText, w-6) : [];
    var exLines = data.exText ? pdf.splitTextToSize(data.exText, w-6) : [];
    var maxCardH = pageHeight - margin*2 - 6;
    var totalH = Math.min(5 + strongLines.length*lh + bodyLines.length*lh + exLines.length*lh + 3, maxCardH);

    // ensureSpace devolve a posição Y verdadeira (já considerando se
    // acabou de quebrar de página) — é ISSO que usamos pra desenhar,
    // nunca um valor de Y recebido como parâmetro antes dessa checagem.
    var y = ensureSpace(totalH + 3);
    pdf.setFillColor(bg[0],bg[1],bg[2]); pdf.rect(x, y, w, totalH, 'F');
    pdf.setFillColor(bar[0],bar[1],bar[2]); pdf.rect(x, y, 1.3, totalH, 'F');

    var ty = y + 4.5;
    pdf.setFont(undefined,'bold'); pdf.setTextColor(28,28,31); pdf.setFontSize(7.5);
    strongLines.forEach(function(line){ pdf.text(line, x+4, ty); ty += lh; });
    pdf.setFont(undefined,'normal');
    bodyLines.forEach(function(line){ pdf.text(line, x+4, ty); ty += lh; });
    if (exLines.length){
      pdf.setFont(undefined,'italic');
      exLines.forEach(function(line){ pdf.text(line, x+4, ty); ty += lh; });
    }
    return y + totalH + 3;
  }

  function drawRecoCard(pdf, data, x, w, ensureSpace, pageHeight, margin){
    var bg = data.kind==='urgent' ? PDF_COLORS.redBg : data.kind==='mid' ? PDF_COLORS.amberBg : PDF_COLORS.greenBg;
    var titleColor = data.kind==='urgent' ? PDF_COLORS.red : data.kind==='mid' ? PDF_COLORS.amber : PDF_COLORS.green;
    var lh = 3.8;

    pdf.setFontSize(7.5);
    var allLines = [];
    data.items.forEach(function(it){ allLines = allLines.concat(pdf.splitTextToSize('• ' + it, w-6)); });
    var maxCardH = pageHeight - margin*2 - 6;
    var totalH = Math.min(6 + allLines.length*lh + 3, maxCardH);

    var y = ensureSpace(totalH + 3);
    pdf.setFillColor(bg[0],bg[1],bg[2]); pdf.rect(x, y, w, totalH, 'F');

    var ty = y + 5.5;
    pdf.setFont(undefined,'bold'); pdf.setTextColor(titleColor[0],titleColor[1],titleColor[2]); pdf.setFontSize(8);
    pdf.text(data.title, x+3, ty); ty += 5;
    pdf.setFont(undefined,'normal'); pdf.setTextColor(28,28,31); pdf.setFontSize(7.5);
    allLines.forEach(function(line){ pdf.text(line, x+3, ty); ty += lh; });
    return y + totalH + 3;
  }

  function exportPdf(includeList){
    statusEl.textContent = '';
    var menuBtn = document.getElementById('exportMainBtn');
    var originalText = menuBtn.textContent;
    menuBtn.textContent = 'Gerando PDF...';
    menuBtn.disabled = true;

    try{
      var pageWidth = 100, pageHeight = 217, margin = 8;
      var usableWidth = pageWidth - margin*2;
      var pdf = new jspdf.jsPDF('p','mm',[pageWidth, pageHeight]);
      var y = margin;

      function ensureSpace(needed){
        if (y + needed > pageHeight - margin){ pdf.addPage(); y = margin; }
        return y;
      }
      function setColor(fn, rgb){ pdf[fn](rgb[0], rgb[1], rgb[2]); }

      // --- Cabeçalho + data da análise ---
      pdf.setFont(undefined, 'bold'); pdf.setFontSize(15);
      setColor('setTextColor', PDF_COLORS.ink);
      pdf.text('EngAIja', pageWidth/2, y, { align:'center' }); y += 5;
      pdf.setFont(undefined, 'normal'); pdf.setFontSize(8);
      setColor('setTextColor', PDF_COLORS.muted);
      pdf.text('Inteligência para Redes Sociais — Relatório', pageWidth/2, y, { align:'center' }); y += 4.5;
      if (STATE.analysisDate){
        pdf.setFontSize(6.5);
        var d = STATE.analysisDate;
        var dateStr = 'Análise processada em ' + d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
        pdf.text(dateStr, pageWidth/2, y, { align:'center' }); y += 6;
      } else { y += 2; }

      // --- Cards de números (lidos direto do STATE, não da tela) ---
      var statCards = [
        [fmt(STATE.totalFollowing), 'Seguindo'],
        [fmt(STATE.totalFollowers), 'Seguidores'],
        [(STATE.diff>=0?'+':'') + fmt(STATE.diff), 'Diferença'],
        [STATE.ratio.toFixed(2)+'x', 'Taxa de retorno']
      ];
      var colW = usableWidth / 2, rowH = 15, gap = 3;
      statCards.forEach(function(c, i){
        var col = i % 2, row = Math.floor(i / 2);
        var bx = margin + col * (colW + gap) - (col ? gap : 0);
        var by = y + row * (rowH + gap);
        pdf.setDrawColor(150,47,191); pdf.setLineWidth(0.6);
        pdf.line(bx, by, bx + colW - gap, by);
        pdf.setFont(undefined, 'bold'); pdf.setFontSize(13);
        setColor('setTextColor', PDF_COLORS.purple);
        pdf.text(c[0], bx + (colW-gap)/2, by + 7, { align:'center' });
        pdf.setFont(undefined, 'normal'); pdf.setFontSize(7);
        setColor('setTextColor', PDF_COLORS.muted);
        pdf.text(c[1], bx + (colW-gap)/2, by + 11, { align:'center' });
      });
      y += Math.ceil(statCards.length/2) * (rowH + gap) + 4;

      // --- Gráfico de rosca — desenhado, não é mais imagem de canvas ---
      ensureSpace(48);
      var chartR = 18;
      drawDonutChart(pdf, pageWidth/2, y + chartR, chartR,
        [STATE.totalFollowers, STATE.totalFollowing],
        [PDF_COLORS.purple, PDF_COLORS.orange]);
      y += chartR*2 + 5;
      // Legenda construída direto dos números (não lida do HTML) — evita o
      // bug de texto grudado tipo "Seguidores1.464Seguindo1.192" que vinha
      // de ler .textContent de dois <span> vizinhos sem separador entre eles.
      pdf.setFontSize(8); pdf.setFont(undefined, 'bold');
      setColor('setTextColor', PDF_COLORS.purple);
      pdf.text('●', pageWidth/2 - 24, y);
      setColor('setTextColor', PDF_COLORS.ink);
      pdf.text('Seguidores: ' + fmt(STATE.totalFollowers), pageWidth/2 - 20, y);
      setColor('setTextColor', PDF_COLORS.orange);
      pdf.text('●', pageWidth/2 + 4, y);
      setColor('setTextColor', PDF_COLORS.ink);
      pdf.text('Seguindo: ' + fmt(STATE.totalFollowing), pageWidth/2 + 8, y);
      y += 8;

      // --- Gráfico de barras (já desenhado nativamente, mantido) ---
      var activityLabels = ['Não seguem de volta','Deletadas','Ativas','Deixou de seguir','Sugestões removidas'];
      var activityValues = [
        STATE.notFollowingBack.length,
        STATE.deletedCount,
        STATE.notFollowingBack.length - STATE.deletedCount,
        STATE.unfollowedCount,
        STATE.removedSuggCount
      ];
      var activityColors = [[214,41,118],[108,108,118],[15,169,104],[250,126,30],[79,91,213]];
      var maxVal = Math.max.apply(null, activityValues.concat([1]));
      var barLabelW = 26, barMaxW = usableWidth - barLabelW, barH = 5, barGap = 3;
      ensureSpace(activityLabels.length * (barH+barGap) + 6);
      activityLabels.forEach(function(label, i){
        pdf.setFontSize(6.5); pdf.setFont(undefined, 'normal');
        setColor('setTextColor', PDF_COLORS.ink);
        var labelLines = pdf.splitTextToSize(label, barLabelW - 2);
        pdf.text(labelLines[0], margin, y + barH/2 + 1.3);
        var barW = Math.max(0.8, (activityValues[i] / maxVal) * barMaxW);
        pdf.setFillColor(activityColors[i][0], activityColors[i][1], activityColors[i][2]);
        pdf.rect(margin + barLabelW, y, barW, barH, 'F');
        pdf.setFontSize(6.5); setColor('setTextColor', PDF_COLORS.muted);
        pdf.text(String(activityValues[i]), margin + barLabelW + barW + 1.5, y + barH/2 + 1.3);
        y += barH + barGap;
      });
      y += 6;

      // --- Cards de alerta/insight (Visão Geral) ---
      extractInsightData().forEach(function(data){
        y = drawInsightCard(pdf, data, margin, usableWidth, ensureSpace, pageHeight, margin);
      });
      y += 3;

      // --- Privacidade ---
      ensureSpace(10);
      pdf.setFont(undefined, 'bold'); pdf.setFontSize(11);
      setColor('setTextColor', PDF_COLORS.purple);
      pdf.text('Privacidade e listas especiais', margin, y); y += 7;

      var privacyStatCards = document.querySelectorAll('#privacyContent .stats-grid .stat-card');
      Array.prototype.forEach.call(privacyStatCards, function(c, i){
        if (i % 2 === 0) ensureSpace(rowH + gap);
        var col = i % 2;
        var bx = margin + col * (colW + gap) - (col ? gap : 0);
        pdf.setDrawColor(150,47,191); pdf.setLineWidth(0.5);
        pdf.line(bx, y, bx + colW - gap, y);
        pdf.setFont(undefined, 'bold'); pdf.setFontSize(11);
        setColor('setTextColor', PDF_COLORS.purple);
        pdf.text(c.querySelector('.num').textContent, bx + (colW-gap)/2, y + 6, { align:'center' });
        pdf.setFont(undefined, 'normal'); pdf.setFontSize(6.5);
        setColor('setTextColor', PDF_COLORS.muted);
        pdf.text(c.querySelector('.lbl').textContent, bx + (colW-gap)/2, y + 9.5, { align:'center' });
        if (col === 1) y += rowH;
      });
      if (privacyStatCards.length % 2 === 1) y += rowH;
      y += 5;

      var privacyContentEl = document.getElementById('privacyContent');
      var privacyChildren = privacyContentEl ? Array.prototype.slice.call(privacyContentEl.children) : [];
      for (var pi = 0; pi < privacyChildren.length; pi++){
        var pel = privacyChildren[pi];
        if (pel.tagName === 'H3' && privacyChildren[pi+1] && privacyChildren[pi+1].classList.contains('profiles-grid')){
          ensureSpace(9);
          pdf.setFont(undefined, 'bold'); pdf.setFontSize(8.5);
          setColor('setTextColor', PDF_COLORS.ink);
          pdf.text(pel.textContent, margin, y); y += 5;
          var names = Array.prototype.map.call(privacyChildren[pi+1].querySelectorAll('.uname'), function(n){ return n.textContent; });
          pdf.setFont(undefined, 'normal'); pdf.setFontSize(7);
          setColor('setTextColor', PDF_COLORS.ink);
          names.forEach(function(name){
            ensureSpace(4.2);
            pdf.text('• ' + name, margin + 2, y); y += 4.2;
          });
          y += 3;
          pi++;
        }
      }

      // --- Plano de ação ---
      ensureSpace(10);
      pdf.setFont(undefined, 'bold'); pdf.setFontSize(11);
      setColor('setTextColor', PDF_COLORS.purple);
      pdf.text('Plano de ação', margin, y); y += 7;

      extractRecoData().forEach(function(data){
        y = drawRecoCard(pdf, data, margin, usableWidth, ensureSpace, pageHeight, margin);
      });

      // --- Lista completa (só no PDF "relatório + lista") ---
      if (includeList){
        pdf.addPage(); y = margin;
        pdf.setFont(undefined, 'bold'); pdf.setFontSize(10);
        setColor('setTextColor', PDF_COLORS.purple);
        y = drawWrappedText(pdf, 'Perfis que você segue e não te seguem de volta ('+STATE.notFollowingBack.length+')', margin, y, usableWidth, 4.5);
        y += 3;

        pdf.setFont(undefined, 'normal'); pdf.setFontSize(7);
        var colCount = 2, listColW = usableWidth / colCount, lineH = 4.2, col = 0, startY = y;
        STATE.notFollowingBack.forEach(function(p){
          if (y + lineH > pageHeight - margin){
            col++; y = startY;
            if (col >= colCount){ pdf.addPage(); y = margin; startY = y; col = 0; }
          }
          var lx = margin + col * listColW;
          setColor('setTextColor', isDeleted(p) ? PDF_COLORS.red : PDF_COLORS.ink);
          pdf.text(p.username + (isDeleted(p) ? ' (deletada)' : ''), lx, y, { maxWidth: listColW - 3 });
          y += lineH;
        });
      }

      pdf.save(includeList ? 'engaija_relatorio_completo.pdf' : 'engaija_relatorio.pdf');
    } catch(err){
      showError('Não consegui gerar o PDF (' + err.message + '). Tenta de novo ou usa a exportação CSV.');
    } finally {
      menuBtn.textContent = originalText;
      menuBtn.disabled = false;
    }
  }

  // --- 11.4 Gera o arquivo CSV (abre no Excel/Google Sheets) ---
  function exportCsv(){
    var rows = [['username','link_perfil','status']];
    STATE.notFollowingBack.forEach(function(p){ rows.push([p.username, p.href, isDeleted(p) ? 'deletada' : 'ativa']); });
    var csvContent = rows.map(function(r){ return r.map(csvEscape).join(','); }).join('\r\n');
    var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'engaija_lista_nao_seguem_de_volta.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function csvEscape(val){
    val = String(val);
    if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1){ return '"' + val.replace(/"/g,'""') + '"'; }
    return val;
  }

  // ---------------------------------------------------------------
  // 12. JANELA "SOBRE" — abre e fecha quando clica no link do rodapé
  // ---------------------------------------------------------------
  var aboutModal = document.getElementById('aboutModal');
  document.getElementById('aboutLink').addEventListener('click', function(){ aboutModal.classList.add('open'); });
  document.getElementById('aboutClose').addEventListener('click', function(){ aboutModal.classList.remove('open'); });
  aboutModal.addEventListener('click', function(e){ if (e.target === aboutModal) aboutModal.classList.remove('open'); });

  // ===================================================================
  // 13. LATARIA VISUAL — menu de conta + assinatura/pagamento
  // NADA nesta seção processa dado real. Não existe backend, não existe
  // Stripe, não existe login de verdade. Cartão digitado no formulário
  // não é lido, não é validado, não é enviado a lugar nenhum — o clique
  // em "Confirmar assinatura" só troca qual <div> está visível.
  // Isto existe para dar uma prévia do fluxo visual completo antes de
  // qualquer integração real ser construída (ver decisão registrada
  // na conversa: backend fica para quando o projeto for publicado).
  // ===================================================================

  // --- 13.1 Menu de conta (☰) — abre/fecha, itens não fazem nada real ---
  var accountMenu = document.getElementById('accountMenu');
  document.getElementById('accountMenuBtn').addEventListener('click', function(){
    accountMenu.classList.add('open');
  });
  accountMenu.addEventListener('click', function(e){
    if (e.target === accountMenu) accountMenu.classList.remove('open');
  });
  document.querySelectorAll('.account-menu-item').forEach(function(btn){
    btn.addEventListener('click', function(){
      accountMenu.classList.remove('open');
      // "Minha assinatura" abre o modal de pagamento; os demais itens
      // (login, salvos, anexar, continuidade, sair) são só visuais por
      // enquanto — não têm tela própria ainda.
      if (btn.dataset.fakeAction === 'subscription') openPayModal();
    });
  });

  // --- 13.2 Modal de assinatura — três pontos de entrada abrem o mesmo modal ---
  var payModal = document.getElementById('payModal');
  var payFormScreen = document.getElementById('payFormScreen');
  var paySuccessScreen = document.getElementById('paySuccessScreen');

  function openPayModal(){
    payFormScreen.style.display = 'block';
    paySuccessScreen.style.display = 'none';
    payModal.classList.add('open');
  }
  function closePayModal(){ payModal.classList.remove('open'); }

  document.getElementById('btnOpenSubscribeTop').addEventListener('click', openPayModal);
  document.getElementById('btnOpenSubscribeExport').addEventListener('click', openPayModal);
  document.getElementById('payClose').addEventListener('click', closePayModal);
  payModal.addEventListener('click', function(e){ if (e.target === payModal) closePayModal(); });

  // Troca visual entre Cartão / Pix / PayPal — só estilo, o formulário de
  // cartão continua sendo o mesmo por baixo (é só demonstração de layout)
  document.querySelectorAll('.pay-method-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.pay-method-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  // Envio do formulário fake — nunca lê os valores dos campos, só mostra
  // a tela de sucesso simulada
  document.getElementById('payFakeForm').addEventListener('submit', function(e){
    e.preventDefault();
    payFormScreen.style.display = 'none';
    paySuccessScreen.style.display = 'block';
  });
  document.getElementById('payBackToForm').addEventListener('click', function(){
    paySuccessScreen.style.display = 'none';
    payFormScreen.style.display = 'block';
  });

})();
// ===================================================================
// FIM DA ÁREA DE FUNÇÕES (JAVASCRIPT)
// ===================================================================
<!-- ===================================================== -->
<!-- FIM DA ÁREA DE ESTRUTURA HTML -->
<!-- ===================================================== -->
</body>
</html>
