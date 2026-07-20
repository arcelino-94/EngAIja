/**
 * ENGAIJA — Render & Display Module
 * Funções que convertem dados em HTML e atualizam a tela
 */

// ====================================================================
// ESTADO GLOBAL
// ====================================================================
/** Estado compartilhado da aplicação */
const STATE = {
  notFollowingBack: [],
  filtered: [],
  page: 1,
  perPage: 15,
  filter: 'all',
  totalFollowing: 0,
  totalFollowers: 0,
  diff: 0,
  ratio: 0,
  deletedCount: 0,
  unfollowedCount: 0,
  removedSuggCount: 0,
  analysisDate: null
};

/** Ativa quando os dados mostrados são fictícios (demonstração) */
let SIM_MODE = false;

// ====================================================================
// RENDERIZAÇÃO — NÚMEROS PRINCIPAIS
// ====================================================================
/**
 * Renderiza os 4 cards de estatísticas principais
 * @param {object} s - Dados { totalFollowing, totalFollowers, diff, ratio, ... }
 */
function renderStats(s) {
  const cards = [
    [fmt(s.totalFollowing), 'Seguindo', ''],
    [fmt(s.totalFollowers), 'Seguidores', ''],
    [(s.diff >= 0 ? '+' : '') + fmt(s.diff), 'Diferença', ''],
    [s.ratio.toFixed(2) + 'x', 'Taxa de retorno', 'tt']
  ];

  const html = cards.map(c => {
    return '<div class="stat-card ' + c[2] + '">' +
      '<div class="num">' + c[0] + '</div>' +
      '<div class="lbl">' + c[1] + '</div>' +
      '</div>';
  }).join('');

  document.getElementById('statsGrid').innerHTML = html;

  // Renderiza data/hora da análise
  const dateEl = document.getElementById('analysisDate');
  if (dateEl && STATE.analysisDate) {
    const d = STATE.analysisDate;
    const formatted = d.toLocaleDateString('pt-BR') + ' às ' +
      d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    dateEl.textContent = 'Análise processada em ' + formatted;
  }
}

// ====================================================================
// RENDERIZAÇÃO — GRÁFICOS
// ====================================================================
/** Instância do gráfico de rosca (seguidores/seguindo) */
let chartFollowInstance;
/** Instância do gráfico de barras (atividade) */
let chartActivityInstance;
/** Cores para gráfico de rosca */
const CHART_COLORS_FOLLOW = ['#962fbf', '#fa7e1e'];
/** Cores para gráfico de barras */
const CHART_COLORS_ACTIVITY = ['#d62976', '#6c6c76', '#0fa968', '#fa7e1e', '#4f5bd5'];

/**
 * Renderiza gráficos de rosca e barras
 * @param {object} d - Dados para os gráficos
 */
function renderCharts(d) {
  // Destroi gráficos anteriores se existem
  if (chartFollowInstance) chartFollowInstance.destroy();
  if (chartActivityInstance) chartActivityInstance.destroy();

  // GRÁFICO 1: Rosca (seguidores vs seguindo)
  const followData = [d.totalFollowers, d.totalFollowing];
  chartFollowInstance = new Chart(document.getElementById('chartFollow'), {
    type: 'doughnut',
    data: {
      labels: ['Seguidores', 'Seguindo'],
      datasets: [{
        data: followData,
        backgroundColor: CHART_COLORS_FOLLOW
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.label + ': ' + fmt(ctx.raw);
            }
          }
        }
      }
    }
  });

  // Legenda textual (mais confiável para PDF)
  document.getElementById('chartFollowLegend').innerHTML =
    '<span style="margin:0 8px"><span class="sw" style="background:' + CHART_COLORS_FOLLOW[0] + '"></span>Seguidores: ' + fmt(d.totalFollowers) + '</span>' +
    '<span style="margin:0 8px"><span class="sw" style="background:' + CHART_COLORS_FOLLOW[1] + '"></span>Seguindo: ' + fmt(d.totalFollowing) + '</span>';

  // GRÁFICO 2: Barras (atividade)
  const activityData = [d.notBack, d.deleted, d.active, d.unfollowed, d.removedSugg];
  const activityLabels = ['Não seguem de volta', 'Deletadas', 'Ativas', 'Deixou de seguir', 'Sugestões removidas'];

  chartActivityInstance = new Chart(document.getElementById('chartActivity'), {
    type: 'bar',
    data: {
      labels: activityLabels,
      datasets: [{
        data: activityData,
        backgroundColor: CHART_COLORS_ACTIVITY
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          ticks: { font: { size: 10 } }
        },
        y: {
          ticks: { font: { size: 10 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return fmt(ctx.raw);
            }
          }
        }
      }
    }
  });

  // Captura versões estáticas dos gráficos (para PDF)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        const img1 = document.getElementById('chartFollowImg');
        img1.src = chartFollowInstance.toBase64Image();
        img1.classList.add('ready');

        const img2 = document.getElementById('chartActivityImg');
        img2.src = chartActivityInstance.toBase64Image();
        img2.classList.add('ready');
      } catch (e) {
        // Se falhar, PDF ainda mostra o restante normalmente
      }
    });
  });
}

// ====================================================================
// RENDERIZAÇÃO — INSIGHTS (Cards de alerta)
// ====================================================================
/**
 * Renderiza cards informativos na aba Visão Geral
 * @param {object} d - Dados de insights
 */
function renderOverviewInsights(d) {
  let html = '';

  // Taxa de retorno com explicação
  const per10 = Math.round(d.ratio * 10);
  html += '<div class="insight' + (d.ratio >= 1 ? ' good' : '') + '">' +
    '<strong>Taxa de retorno: ' + d.ratio.toFixed(2) + 'x</strong>' +
    'Mostra quantos seguidores você tem para cada pessoa que você segue.' +
    '<span class="ex">Ou seja: a cada 10 pessoas que você segue, cerca de ' + per10 + ' seguem você de volta.</span>' +
    '</div>';

  // Diferença de seguidores
  if (d.diff >= 0) {
    html += '<div class="insight good"><strong>Você tem ' + fmt(d.diff) + ' mais seguidores do que segue.</strong></div>';
  } else {
    html += '<div class="insight"><strong>Você segue ' + fmt(-d.diff) + ' pessoas a mais do que te seguem.</strong></div>';
  }

  // Não seguem de volta
  html += '<div class="insight warn"><strong>' + fmt(d.notBack) + ' perfis que você segue não te seguem de volta.</strong>' +
    'Veja a aba "Não seguem de volta" para a lista completa.</div>';

  // Contas deletadas
  if (d.deleted > 0) {
    html += '<div class="insight bad"><strong>' + fmt(d.deleted) + ' contas deletadas</strong> ' +
      'ainda aparecem na sua lista de seguindo.</div>';
  }

  // Pedidos pendentes
  if (d.pendingIn > 0) {
    html += '<div class="insight"><strong>' + fmt(d.pendingIn) + ' solicitação(ões) de seguimento ' +
      'aguardando sua resposta.</strong></div>';
  }

  // Requests não aceitos
  if (d.requestsSentNotAccepted > 0) {
    html += '<div class="insight"><strong>' + fmt(d.requestsSentNotAccepted) + ' solicitação(ões) que você enviou ' +
      'ainda não foram aceitas.</strong></div>';
  }

  document.getElementById('overviewInsights').innerHTML = html;
}

// ====================================================================
// RENDERIZAÇÃO — LISTA DE PERFIS
// ====================================================================
/**
 * Renderiza a grade de perfis "Não seguem de volta" com paginação
 */
function renderProfilesList() {
  const list = STATE.filtered;
  document.getElementById('countLine').textContent =
    'Mostrando ' + fmt(list.length) + ' de ' + fmt(STATE.notFollowingBack.length) + ' perfis';

  const container = document.getElementById('profilesList');

  if (list.length === 0) {
    container.innerHTML = '<div class="empty">Nenhum perfil encontrado com esse filtro/busca.</div>';
    document.getElementById('pager').innerHTML = '';
    return;
  }

  // Pagina os resultados
  const start = (STATE.page - 1) * STATE.perPage;
  const pageItems = list.slice(start, start + STATE.perPage);

  container.innerHTML = pageItems.map(p => {
    const tag = isDeleted(p) ? '<span class="tag del">deletada</span>' : '';
    const fullName = escapeHtml(p.username);
    return '<a class="profile-chip" ' + chipHrefAttrs(p) + ' title="' + fullName +
      (SIM_MODE ? ' (exemplo fictício)' : '') + '">' +
      '<span class="uname">' + fullName + '</span>' + tag + '<span class="arrow">↗</span>' +
      '</a>';
  }).join('');

  // Renderiza botões de página
  const totalPages = Math.ceil(list.length / STATE.perPage);
  let pagerHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    pagerHtml += '<button data-page="' + i + '" class="' + (i === STATE.page ? 'active' : '') + '">' + i + '</button>';
  }

  const pagerEl = document.getElementById('pager');
  pagerEl.innerHTML = pagerHtml;
  pagerEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.page = parseInt(btn.dataset.page, 10);
      renderProfilesList();
      document.getElementById('panel-notback').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ====================================================================
// HELPER — Renderiza card de estatística simples
// ====================================================================
/**
 * Cria HTML de um card de estatística
 * @param {number} n - Número
 * @param {string} label - Rótulo
 * @returns {string} HTML do card
 */
function statCard(n, label) {
  return '<div class="stat-card"><div class="num">' + fmt(n) + '</div><div class="lbl">' + label + '</div></div>';
}

// ====================================================================
// HELPER — Renderiza grade de perfis simples (sem paginação)
// ====================================================================
/**
 * Cria HTML de uma grade de perfis
 * @param {array} arr - Array de perfis
 * @returns {string} HTML com grade
 */
function simpleGrid(arr) {
  return '<div class="profiles-grid" style="margin-bottom:10px">' +
    arr.map(p => {
      const fullName = escapeHtml(p.username);
      return '<a class="profile-chip" ' + chipHrefAttrs(p) + ' title="' + fullName +
        (SIM_MODE ? ' (exemplo fictício)' : '') + '">' +
        '<span class="uname">' + fullName + '</span><span class="arrow">↗</span></a>';
    }).join('') +
    '</div>';
}

// ====================================================================
// RENDERIZAÇÃO — PRIVACIDADE
// ====================================================================
/**
 * Renderiza aba de Privacidade (bloqueados, restringidos, etc)
 * @param {object} d - Dados de privacidade
 */
function renderPrivacy(d) {
  let html = '<div class="stats-grid">' +
    statCard(d.blocked.length, 'Bloqueados') +
    statCard(d.restricted.length, 'Restringidos') +
    statCard(d.hideStory, 'Esconder história de') +
    statCard(d.closeFriends, 'Melhores amigos') +
    statCard(d.favorited, 'Favoritados') +
    statCard(d.pendingIn.length, 'Pedidos pendentes') +
    '</div>';

  if (d.blocked.length) {
    html += '<h3>Bloqueados (' + d.blocked.length + ')</h3>' + simpleGrid(d.blocked);
  }
  if (d.restricted.length) {
    html += '<h3>Restringidos (' + d.restricted.length + ')</h3>' + simpleGrid(d.restricted);
  }
  if (d.pendingIn.length) {
    html += '<h3>Pedidos de seguimento aguardando sua resposta (' + d.pendingIn.length + ')</h3>' + simpleGrid(d.pendingIn);
  }
  if (d.requestsSentList.length) {
    html += '<h3>Solicitações que você enviou e ainda não foram aceitas (' + d.requestsSentList.length + ')</h3>' + simpleGrid(d.requestsSentList);
  }

  document.getElementById('privacyContent').innerHTML = html;
}

// ====================================================================
// RENDERIZAÇÃO — ATIVIDADE
// ====================================================================
/**
 * Renderiza aba de Atividade (posts, stories, etc)
 * @param {object} d - Dados de atividade
 */
function renderActivity(d) {
  let html = '<div class="stats-grid">' +
    statCard(fmt(d.likedPostsCount), '❤️ Posts curtidos') +
    statCard(fmt(d.savedPostsCount), '🔖 Posts salvos') +
    statCard(fmt(d.storiesCount), '📸 Stories') +
    statCard(fmt(d.profilePhotosCount), '🖼️ Fotos de perfil') +
    statCard(fmt(d.repostsCount), '🔄 Reposts') +
    '</div>';

  if (d.likedPostsCount > 0) {
    html += '<div class="insight good"><strong>💪 Você curtiu ' + fmt(d.likedPostsCount) + ' posts</strong>' +
      'Isso mostra engajamento ativo na plataforma.</div>';
  }
  if (d.savedPostsCount > 0) {
    html += '<div class="insight"><strong>📚 ' + fmt(d.savedPostsCount) + ' posts salvos</strong>' +
      'Coisas que você quer revisitar ou usar como inspiração.</div>';
  }
  if (d.storiesCount > 0) {
    html += '<div class="insight"><strong>📝 Você postou ' + fmt(d.storiesCount) + ' stories</strong>' +
      'Stories são ótimos para conexão rápida com seguidores.</div>';
  }

  document.getElementById('activityContent').innerHTML = html;
}

// ====================================================================
// RENDERIZAÇÃO — INTERAÇÕES
// ====================================================================
/**
 * Renderiza aba de Interações (reações, DMs, etc)
 * @param {object} d - Dados de interações
 */
function renderInteractions(d) {
  let html = '<div class="stats-grid">' +
    statCard(fmt(d.emojiReactionsCount), '😊 Reações em stories') +
    statCard(fmt(d.storyLikesCount), '❤️ Curtidas em stories') +
    statCard(fmt(d.pollsCount), '📊 Participou de enquetes') +
    statCard(fmt(d.hypeCount), '🔥 Hypes recebidos') +
    statCard(fmt(d.secretConversationsCount), '🤐 Chats secretos') +
    '</div>';

  if (d.emojiReactionsCount > 0) {
    html += '<div class="insight good"><strong>🎉 ' + fmt(d.emojiReactionsCount) + ' reações em stories</strong>' +
      'As pessoas interagem com suas histórias!</div>';
  }
  if (d.storyLikesCount > 0) {
    html += '<div class="insight good"><strong>👍 Você curtiu ' + fmt(d.storyLikesCount) + ' stories</strong>' +
      'Que legal, você interage bastante com o conteúdo.</div>';
  }
  if (d.secretConversationsCount > 0) {
    html += '<div class="insight"><strong>🤫 ' + fmt(d.secretConversationsCount) + ' chats secretos</strong>' +
      'Conversas privadas que desaparecem.</div>';
  }

  document.getElementById('interactionsContent').innerHTML = html;
}

// ====================================================================
// RENDERIZAÇÃO — PERFIL
// ====================================================================
/**
 * Renderiza aba de Perfil (informações pessoais, datas, etc)
 * @param {object} d - Dados do perfil
 */
function renderProfile(d) {
  let html = '';

  // Data de inscrição
  if (d.signupDetails && d.signupDetails.label_values) {
    let signupTime = null;
    d.signupDetails.label_values.forEach(lv => {
      if (lv.label && lv.label.toLowerCase().indexOf('inscr') !== -1 && lv.timestamp_value) {
        signupTime = new Date(lv.timestamp_value * 1000);
      }
    });
    if (signupTime) {
      const days = Math.floor((new Date() - signupTime) / (1000 * 60 * 60 * 24));
      html += '<div class="insight good"><strong>📅 Membro desde ' + signupTime.toLocaleDateString('pt-BR') +
        '</strong>Você tem essa conta há ' + fmt(days) + ' dias!</div>';
    }
  }

  // Info de perfil (último login, primeira story)
  if (d.profileInfo && d.profileInfo.label_values) {
    let lastLogin = null;
    let inscriptionTime = null;

    d.profileInfo.label_values.forEach(lv => {
      const label = (lv.label || '').toLowerCase();
      if (label.indexOf('último login') !== -1 && lv.timestamp_value) {
        lastLogin = new Date(lv.timestamp_value * 1000);
      }
      if (label.indexOf('primeiro story') !== -1 && lv.timestamp_value) {
        inscriptionTime = new Date(lv.timestamp_value * 1000);
      }
    });

    if (lastLogin) {
      const hoursAgo = Math.floor((new Date() - lastLogin) / (1000 * 60 * 60));
      if (hoursAgo < 24) {
        html += '<div class="insight good"><strong>✅ Último login: ' +
          lastLogin.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) +
          '</strong>Você usa o Instagram regularmente!</div>';
      } else {
        html += '<div class="insight warn"><strong>⏰ Última atividade há ' + hoursAgo +
          ' horas</strong>Data: ' + lastLogin.toLocaleDateString('pt-BR') + '</div>';
      }
    }

    if (inscriptionTime) {
      const years = Math.floor((new Date() - inscriptionTime) / (1000 * 60 * 60 * 24 * 365));
      html += '<div class="insight"><strong>🎂 Primeira story: ' +
        inscriptionTime.toLocaleDateString('pt-BR') + '</strong>Há ' + years +
        ' anos você começou a compartilhar!</div>';
    }
  }

  // Histórico de logins
  if (d.loginActivity && Array.isArray(d.loginActivity) && d.loginActivity.length > 0) {
    const recentLogins = Math.min(5, d.loginActivity.length);
    html += '<h3>📱 Últimos acessos</h3>';
    html += '<div style="background: #faf8fc; padding: 12px; border-radius: 8px; font-size: 0.85rem;">';

    for (let i = 0; i < recentLogins; i++) {
      const login = d.loginActivity[i];
      if (login.label_values) {
        let timestamp = null;
        let device = null;

        login.label_values.forEach(lv => {
          if (lv.timestamp_value) timestamp = lv.timestamp_value;
          if (lv.label && lv.label.toLowerCase().indexOf('dispositivo') !== -1) device = lv.value;
        });

        if (timestamp) {
          const loginDate = new Date(timestamp * 1000);
          html += '<div style="padding: 6px 0; border-bottom: 1px solid #e6d5f5;">' +
            loginDate.toLocaleDateString('pt-BR') + ' às ' +
            loginDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) +
            (device ? ' • ' + device : '') + '</div>';
        }
      }
    }
    html += '</div>';
  }

  if (!html) {
    html = '<div class="empty">Nenhuma informação de perfil disponível neste arquivo.</div>';
  }

  document.getElementById('profileContent').innerHTML = html;
}

// ====================================================================
// RENDERIZAÇÃO — PLANO DE AÇÃO
// ====================================================================
/**
 * Renderiza aba de Plano de Ação (recomendações)
 * @param {object} d - Dados para recomendações
 */
function renderActions(d) {
  let html = '';

  if (d.deleted > 0) {
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

// Exporta para uso global
window.STATE = STATE;
window.SIM_MODE = SIM_MODE;
window.renderStats = renderStats;
window.renderCharts = renderCharts;
window.renderOverviewInsights = renderOverviewInsights;
window.renderProfilesList = renderProfilesList;
window.renderPrivacy = renderPrivacy;
window.renderActivity = renderActivity;
window.renderInteractions = renderInteractions;
window.renderProfile = renderProfile;
window.renderActions = renderActions;
