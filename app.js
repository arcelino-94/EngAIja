/**
 * ENGAIJA — Main Application Entry Point
 * Orquestra toda a lógica de upload, processamento e renderização
 */

(function() {
  'use strict';

  // ====================================================================
  // SELEÇÃO DE ELEMENTOS DOM
  // ====================================================================
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const statusEl = document.getElementById('status');
  const errorBox = document.getElementById('errorBox');
  const resetLink = document.getElementById('resetLink');
  const uploadScreen = document.getElementById('uploadScreen');
  const dashboard = document.getElementById('dashboard');
  const simBanner = document.getElementById('simBanner');
  const simExit = document.getElementById('simExit');

  // ====================================================================
  // UPLOAD FILE HANDLERS
  // ====================================================================
  /**
   * Handler para mudança de arquivo (input file)
   */
  fileInput.addEventListener('change', function(e) {
    if (e.target.files[0]) handleZip(e.target.files[0]);
  });

  /**
   * Handlers para drag-and-drop
   */
  ['dragenter', 'dragover'].forEach(evt => {
    dropZone.addEventListener(evt, function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', function(e) {
    const f = e.dataTransfer.files[0];
    if (f) handleZip(f);
  });

  // ====================================================================
  // RESET E NAVEGAÇÃO
  // ====================================================================
  /**
   * Volta para tela inicial ao clicar "Analisar outro arquivo"
   */
  resetLink.addEventListener('click', function() {
    location.reload();
  });

  /**
   * Sai do modo demonstração
   */
  simExit.addEventListener('click', function() {
    location.reload();
  });

  /**
   * Botão para explorar demonstração com dados fictícios
   */
  document.getElementById('btnVerExemplo').addEventListener('click', function() {
    window.SIM_MODE = true;
    buildDashboard(generateFakeRaw());
    simBanner.classList.add('active');
  });

  // ====================================================================
  // PROCESSAMENTO DE ARQUIVO
  // ====================================================================
  /**
   * Mostra mensagem de erro
   * @param {string} msg - Mensagem
   */
  function showError(msg) {
    errorBox.style.display = 'block';
    errorBox.textContent = msg;
    statusEl.textContent = '';
  }

  /**
   * Handler principal para leitura de ZIP
   * @param {File} file - Arquivo selecionado
   */
  function handleZip(file) {
    errorBox.style.display = 'none';

    // Valida extensão
    if (!file.name.toLowerCase().endsWith('.zip')) {
      showError('Isso não parece um arquivo .zip. Envie o ZIP baixado do Instagram (Configurações → Central de Contas → Suas informações e permissões → Baixar suas informações).');
      return;
    }

    statusEl.textContent = 'Lendo o arquivo...';

    JSZip.loadAsync(file).then(function(zip) {
      statusEl.textContent = 'Procurando os arquivos de conexões...';

      // Procura pelos arquivos no ZIP
      const found = {};
      const wanted = {};

      for (const k in TARGETS) {
        wanted[TARGETS[k]] = k;
      }

      zip.forEach(function(relPath, zipEntry) {
        const name = relPath.split('/').pop();
        if (wanted[name]) {
          found[wanted[name]] = zipEntry;
        }
      });

      // Valida se os arquivos principais foram encontrados
      if (!found.following || !found.followers) {
        showError('Não encontrei following.json e/ou followers_1.json dentro do ZIP. Confirme que este é o export de "Conexões" do Instagram.');
        return;
      }

      // Lê e parse todos os arquivos encontrados
      const keys = Object.keys(found);
      const promises = keys.map(k => {
        return found[k].async('string').then(function(text) {
          try {
            return { key: k, data: JSON.parse(text) };
          } catch (e) {
            return { key: k, data: null };
          }
        });
      });

      Promise.all(promises).then(function(results) {
        const raw = {};
        results.forEach(r => {
          raw[r.key] = r.data ? itemsFromJson(r.data) : [];
        });

        statusEl.textContent = 'Processando dados...';

        // Pequeno delay para deixar status visível
        setTimeout(function() {
          buildDashboard(raw);
        }, 50);
      });
    }).catch(function(err) {
      showError('Não consegui abrir esse ZIP (' + err.message + '). Tente exportar de novo pelo Instagram.');
    });
  }

  // ====================================================================
  // CONSTRUÇÃO DO DASHBOARD
  // ====================================================================
  /**
   * Função principal que orquestra toda a renderização
   * @param {object} raw - Dados brutos extraídos do ZIP
   */
  function buildDashboard(raw) {
    // Processa dados brutos
    const data = processRawData(raw);

    // Atualiza STATE global
    STATE.notFollowingBack = data.notFollowingBack;
    STATE.filtered = data.notFollowingBack;
    STATE.totalFollowing = data.totalFollowing;
    STATE.totalFollowers = data.totalFollowers;
    STATE.diff = data.diff;
    STATE.ratio = data.ratio;
    STATE.deletedCount = data.deletedCount;
    STATE.analysisDate = new Date();
    STATE.unfollowedCount = data.unfollowedCount;
    STATE.removedSuggCount = data.removedSuggCount;

    // Alterna visibilidade de telas
    uploadScreen.style.display = 'none';
    dashboard.style.display = 'block';
    resetLink.style.display = 'inline';

    // Renderiza todos os componentes
    renderStats({
      totalFollowing: data.totalFollowing,
      totalFollowers: data.totalFollowers,
      diff: data.diff,
      ratio: data.ratio,
      notBack: data.notFollowingBack.length,
      deleted: data.deletedCount
    });

    renderCharts({
      totalFollowing: data.totalFollowing,
      totalFollowers: data.totalFollowers,
      notBack: data.notFollowingBack.length,
      deleted: data.deletedCount,
      active: data.notFollowingBack.length - data.deletedCount,
      unfollowed: data.unfollowedCount,
      removedSugg: data.removedSuggCount
    });

    renderOverviewInsights({
      diff: data.diff,
      ratio: data.ratio,
      notBack: data.notFollowingBack.length,
      deleted: data.deletedCount,
      pendingIn: Object.keys(data.pendingIn).length,
      requestsSentNotAccepted: countNotAccepted(data.requestsSent, data.followersSet),
      totalFollowing: data.totalFollowing,
      totalFollowers: data.totalFollowers
    });

    renderPrivacy({
      blocked: Object.values(data.blocked),
      restricted: Object.values(data.restricted),
      closeFriends: Object.keys(data.closeFriends).length,
      hideStory: Object.keys(data.hideStory).length,
      favorited: Object.keys(data.favorited).length,
      pendingIn: Object.values(data.pendingIn),
      requestsSentList: Object.values(data.requestsSent)
        .filter(p => !data.followersSet[p.username.toLowerCase()])
    });

    renderActivity({
      likedPostsCount: (raw.likedPosts || []).length,
      savedPostsCount: (raw.savedPosts || []).length,
      storiesCount: (raw.stories || []).length,
      repostsCount: (raw.reposts || []).length,
      profilePhotosCount: (raw.profilePhotos || []).length
    });

    renderInteractions({
      emojiReactionsCount: (raw.emojiReactions || []).length,
      storyLikesCount: (raw.storyLikes || []).length,
      pollsCount: (raw.polls || []).length,
      hypeCount: (raw.hype || []).length,
      secretConversationsCount: (raw.secretConversations || []).length
    });

    renderProfile({
      profileInfo: (raw.profileInfo || []).length > 0 ? raw.profileInfo[0] : null,
      personalInfo: (raw.personalInfo || []).length > 0 ? raw.personalInfo[0] : null,
      signupDetails: (raw.signupDetails || []).length > 0 ? raw.signupDetails[0] : null,
      loginActivity: raw.loginActivity || []
    });

    renderActions({
      deleted: data.deletedCount,
      notBack: data.notFollowingBack.length,
      restricted: Object.keys(data.restricted).length
    });

    // Inicializa funcionalidades interativas
    setupTabs();
    setupToolbar();
    setupExport();
    renderProfilesList();

    statusEl.textContent = '';
  }

  // ====================================================================
  // INICIALIZAÇÃO
  // ====================================================================
  // Aplica idioma padrão
  applyLanguage('pt');
})();
