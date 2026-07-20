/**
 * ENGAIJA — Components & Interactions Module
 * Controla tabs, filtros, busca, modais e exportação
 */

// ====================================================================
// NAVEGAÇÃO DE ABAS
// ====================================================================
/**
 * Inicializa listeners para navegação entre abas
 * Permite trocar conteúdo ao clicar nos botões de tab
 */
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active de todos os botões e painéis
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

      // Ativa o clicado
      btn.classList.add('active');
      const panelId = 'panel-' + btn.dataset.tab;
      document.getElementById(panelId).classList.add('active');
    });
  });
}

// ====================================================================
// BARRA DE FERRAMENTAS — Busca e filtros
// ====================================================================
/**
 * Inicializa handlers para busca e filtros na aba "Não seguem de volta"
 */
function setupToolbar() {
  // Evento de input na busca
  document.getElementById('searchInput').addEventListener('input', function(e) {
    applyFilterAndSearch(e.target.value);
  });

  // Eventos dos botões de filtro
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active de todos
      filterBtns.forEach(b => b.classList.remove('active'));
      // Ativa o clicado
      btn.classList.add('active');
      STATE.filter = btn.dataset.filter;
      STATE.page = 1;
      applyFilterAndSearch(document.getElementById('searchInput').value);
    });
  });
}

/**
 * Aplica filtros e busca na lista de perfis
 * Atualiza STATE.filtered com resultados
 * @param {string} query - Termo de busca
 */
function applyFilterAndSearch(query) {
  let base = STATE.notFollowingBack;

  // Aplica filtro de tipo
  if (STATE.filter === 'deleted') {
    base = base.filter(isDeleted);
  } else if (STATE.filter === 'active') {
    base = base.filter(p => !isDeleted(p));
  }

  // Aplica busca por texto
  query = (query || '').toLowerCase().trim();
  if (query) {
    base = base.filter(p => p.username.toLowerCase().indexOf(query) !== -1);
  }

  // Reseta para página 1 e renderiza
  STATE.filtered = base;
  STATE.page = 1;
  renderProfilesList();
}

// ====================================================================
// MODAIS — Genérica para abrir/fechar
// ====================================================================
/**
 * Abre um modal
 * @param {HTMLElement} modal - Elemento do modal
 */
function openModal(modal) {
  modal.classList.add('open');
}

/**
 * Fecha um modal
 * @param {HTMLElement} modal - Elemento do modal
 */
function closeModal(modal) {
  modal.classList.remove('open');
}

/**
 * Handler genérico: fecha modal se clicou no fundo
 * @param {HTMLElement} modal - Elemento do modal
 */
function setupModalClose(modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

// ====================================================================
// MODAL "SOBRE"
// ====================================================================
const aboutModal = document.getElementById('aboutModal');

document.getElementById('aboutLink').addEventListener('click', () => {
  openModal(aboutModal);
});

document.getElementById('aboutClose').addEventListener('click', () => {
  closeModal(aboutModal);
});

setupModalClose(aboutModal);

// ====================================================================
// MODAL DE PAGAMENTO (Visual, sem função real)
// ====================================================================
const payModal = document.getElementById('payModal');
const payFormScreen = document.getElementById('payFormScreen');
const paySuccessScreen = document.getElementById('paySuccessScreen');

/**
 * Abre modal de pagamento mostrando formulário
 */
function openPayModal() {
  payFormScreen.style.display = 'block';
  paySuccessScreen.style.display = 'none';
  openModal(payModal);
}

/**
 * Fecha modal de pagamento
 */
function closePayModal() {
  closeModal(payModal);
}

// Botões que abrem o modal de pagamento
document.getElementById('btnOpenSubscribeTop').addEventListener('click', openPayModal);
document.getElementById('btnOpenSubscribeExport').addEventListener('click', openPayModal);

// Botão de fechar
document.getElementById('payClose').addEventListener('click', closePayModal);

// Fecha ao clicar fundo
setupModalClose(payModal);

// Troca visual entre métodos de pagamento (Cartão / Pix / PayPal)
document.querySelectorAll('.pay-method-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Formulário fake de pagamento
document.getElementById('payFakeForm').addEventListener('submit', e => {
  e.preventDefault();
  payFormScreen.style.display = 'none';
  paySuccessScreen.style.display = 'block';
});

// Volta do sucesso para form
document.getElementById('payBackToForm').addEventListener('click', () => {
  paySuccessScreen.style.display = 'none';
  payFormScreen.style.display = 'block';
});

// ====================================================================
// MENU DE CONTA (Menu ☰)
// ====================================================================
const accountMenu = document.getElementById('accountMenu');

document.getElementById('accountMenuBtn').addEventListener('click', () => {
  accountMenu.classList.add('open');
});

// Fecha ao clicar fundo
accountMenu.addEventListener('click', e => {
  if (e.target === accountMenu) {
    accountMenu.classList.remove('open');
  }
});

// Items do menu
document.querySelectorAll('.account-menu-item').forEach(btn => {
  btn.addEventListener('click', () => {
    accountMenu.classList.remove('open');

    // "Minha assinatura" abre o modal de pagamento
    if (btn.dataset.fakeAction === 'subscription') {
      openPayModal();
    }
    // Outros itens são visuais por enquanto
  });
});

// ====================================================================
// EXPORTAÇÃO — Botão e menu
// ====================================================================
/**
 * Inicializa menu de exportação (PDF / CSV)
 */
function setupExport() {
  const mainBtn = document.getElementById('exportMainBtn');
  const menu = document.getElementById('exportMenu');

  // Abre/fecha menu ao clicar botão principal
  mainBtn.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && e.target !== mainBtn) {
      menu.classList.remove('open');
    }
  });

  // Handlers dos botões de exportação
  menu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      menu.classList.remove('open');

      const type = btn.dataset.export;
      if (type === 'csv') {
        exportCsv();
      } else {
        exportPdf(type === 'full');
      }
    });
  });
}

// ====================================================================
// EXPORTAÇÃO PDF — Geração programática
// ====================================================================
/** Cores para geração de PDF */
const PDF_COLORS = {
  purple: [150, 47, 191],
  purpleLight: [247, 242, 251],
  ink: [28, 28, 31],
  muted: [108, 108, 118],
  green: [15, 169, 104],
  greenBg: [226, 248, 239],
  amber: [201, 138, 4],
  amberBg: [255, 243, 205],
  red: [224, 41, 75],
  redBg: [255, 227, 233],
  orange: [250, 126, 30]
};

/**
 * Desenha texto quebrado em múltiplas linhas
 * @param {jsPDF} pdf - Instância do PDF
 * @param {string} text - Texto
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {number} maxWidth - Largura máxima
 * @param {number} lineHeight - Altura da linha
 * @param {string} align - Alinhamento (center, left, right)
 * @returns {number} Nova posição Y
 */
function drawWrappedText(pdf, text, x, y, maxWidth, lineHeight, align) {
  if (!text) return y;
  const lines = pdf.splitTextToSize(text, maxWidth);
  lines.forEach((line, i) => {
    if (align) pdf.text(line, x, y + i * lineHeight, { align: align });
    else pdf.text(line, x, y + i * lineHeight);
  });
  return y + lines.length * lineHeight;
}

/**
 * Desenha fatia de pizza (para gráfico de rosca)
 * @param {jsPDF} pdf - Instância do PDF
 * @param {number} cx - Centro X
 * @param {number} cy - Centro Y
 * @param {number} r - Raio
 * @param {number} startDeg - Ângulo inicial
 * @param {number} sweepDeg - Ângulo varrido
 * @param {array} color - Cor [R, G, B]
 */
function drawPieSlice(pdf, cx, cy, r, startDeg, sweepDeg, color) {
  if (sweepDeg <= 0) return;
  const steps = Math.max(1, Math.ceil(sweepDeg / 4));
  const stepDeg = sweepDeg / steps;
  pdf.setFillColor(color[0], color[1], color[2]);
  for (let i = 0; i < steps; i++) {
    const a1 = (startDeg + i * stepDeg) * Math.PI / 180;
    const a2 = (startDeg + (i + 1) * stepDeg) * Math.PI / 180;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    pdf.triangle(cx, cy, x1, y1, x2, y2, 'F');
  }
}

/**
 * Desenha gráfico de rosca
 * @param {jsPDF} pdf - Instância do PDF
 * @param {number} cx - Centro X
 * @param {number} cy - Centro Y
 * @param {number} r - Raio
 * @param {array} values - Valores [v1, v2, ...]
 * @param {array} colors - Cores [[R,G,B], ...]
 */
function drawDonutChart(pdf, cx, cy, r, values, colors) {
  const total = values.reduce((a, b) => a + b, 0);
  if (total <= 0) return;
  let startDeg = -90;
  values.forEach((v, i) => {
    const sweep = (v / total) * 360;
    drawPieSlice(pdf, cx, cy, r, startDeg, sweep, colors[i]);
    startDeg += sweep;
  });
  // Buraco do meio
  pdf.setFillColor(255, 255, 255);
  pdf.circle(cx, cy, r * 0.55, 'F');
}

/**
 * Extrai dados de insights do DOM
 * @returns {array} Array de objetos { strongText, bodyText, exText, kind }
 */
function extractInsightData() {
  return Array.prototype.map.call(
    document.querySelectorAll('#overviewInsights .insight'),
    el => {
      const strongEl = el.querySelector('strong');
      const exEl = el.querySelector('.ex');
      const strongText = strongEl ? strongEl.textContent.trim() : '';
      const exText = exEl ? exEl.textContent.trim() : '';

      const clone = el.cloneNode(true);
      const cStrong = clone.querySelector('strong');
      const cEx = clone.querySelector('.ex');
      if (cStrong && cStrong.parentNode) cStrong.parentNode.removeChild(cStrong);
      if (cEx && cEx.parentNode) cEx.parentNode.removeChild(cEx);

      const bodyText = clone.textContent.trim();
      const kind = el.classList.contains('bad') ? 'bad' :
        el.classList.contains('good') ? 'good' :
        el.classList.contains('warn') ? 'warn' : 'default';

      return { strongText, bodyText, exText, kind };
    }
  );
}

/**
 * Extrai dados de recomendações do DOM
 * @returns {array} Array de objetos { title, items, kind }
 */
function extractRecoData() {
  return Array.prototype.map.call(
    document.querySelectorAll('#actionsContent .reco'),
    el => {
      const h4 = el.querySelector('h4');
      const items = Array.prototype.map.call(
        el.querySelectorAll('li'),
        li => li.textContent.trim()
      );
      const kind = el.classList.contains('urgent') ? 'urgent' :
        el.classList.contains('mid') ? 'mid' : 'default';
      return { title: h4 ? h4.textContent.trim() : '', items, kind };
    }
  );
}

/**
 * Desenha card de insight no PDF
 * @param {jsPDF} pdf - Instância
 * @param {object} data - Dados do insight
 * @param {number} x - Posição X
 * @param {number} w - Largura
 * @param {function} ensureSpace - Função que garante espaço
 * @param {number} pageHeight - Altura da página
 * @param {number} margin - Margem
 * @returns {number} Nova posição Y
 */
function drawInsightCard(pdf, data, x, w, ensureSpace, pageHeight, margin) {
  const bg = data.kind === 'bad' ? PDF_COLORS.redBg :
    data.kind === 'good' ? PDF_COLORS.greenBg :
    data.kind === 'warn' ? PDF_COLORS.amberBg :
    PDF_COLORS.purpleLight;

  const bar = data.kind === 'bad' ? PDF_COLORS.red :
    data.kind === 'good' ? PDF_COLORS.green :
    data.kind === 'warn' ? PDF_COLORS.amber :
    PDF_COLORS.purple;

  const lh = 3.6;
  pdf.setFontSize(7.5);

  const strongLines = data.strongText ? pdf.splitTextToSize(data.strongText, w - 6) : [];
  const bodyLines = data.bodyText ? pdf.splitTextToSize(data.bodyText, w - 6) : [];
  const exLines = data.exText ? pdf.splitTextToSize(data.exText, w - 6) : [];

  const maxCardH = pageHeight - margin * 2 - 6;
  const totalH = Math.min(5 + strongLines.length * lh + bodyLines.length * lh + exLines.length * lh + 3, maxCardH);

  const y = ensureSpace(totalH + 3);
  pdf.setFillColor(bg[0], bg[1], bg[2]);
  pdf.rect(x, y, w, totalH, 'F');
  pdf.setFillColor(bar[0], bar[1], bar[2]);
  pdf.rect(x, y, 1.3, totalH, 'F');

  let ty = y + 4.5;
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(28, 28, 31);
  pdf.setFontSize(7.5);
  strongLines.forEach(line => { pdf.text(line, x + 4, ty); ty += lh; });

  pdf.setFont(undefined, 'normal');
  bodyLines.forEach(line => { pdf.text(line, x + 4, ty); ty += lh; });

  if (exLines.length) {
    pdf.setFont(undefined, 'italic');
    exLines.forEach(line => { pdf.text(line, x + 4, ty); ty += lh; });
  }

  return y + totalH + 3;
}

/**
 * Desenha card de recomendação no PDF
 * Similar a drawInsightCard mas com cores específicas
 */
function drawRecoCard(pdf, data, x, w, ensureSpace, pageHeight, margin) {
  const bg = data.kind === 'urgent' ? PDF_COLORS.redBg :
    data.kind === 'mid' ? PDF_COLORS.amberBg :
    PDF_COLORS.greenBg;

  const titleColor = data.kind === 'urgent' ? PDF_COLORS.red :
    data.kind === 'mid' ? PDF_COLORS.amber :
    PDF_COLORS.green;

  const lh = 3.8;
  pdf.setFontSize(7.5);

  let allLines = [];
  data.items.forEach(it => {
    allLines = allLines.concat(pdf.splitTextToSize('• ' + it, w - 6));
  });

  const maxCardH = pageHeight - margin * 2 - 6;
  const totalH = Math.min(6 + allLines.length * lh + 3, maxCardH);

  const y = ensureSpace(totalH + 3);
  pdf.setFillColor(bg[0], bg[1], bg[2]);
  pdf.rect(x, y, w, totalH, 'F');

  let ty = y + 5.5;
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
  pdf.setFontSize(8);
  pdf.text(data.title, x + 3, ty);
  ty += 5;

  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(28, 28, 31);
  pdf.setFontSize(7.5);
  allLines.forEach(line => { pdf.text(line, x + 3, ty); ty += lh; });

  return y + totalH + 3;
}

/**
 * Exporta relatório em PDF
 * @param {boolean} includeList - Se deve incluir lista completa no final
 */
function exportPdf(includeList) {
  const statusEl = document.getElementById('status');
  const menuBtn = document.getElementById('exportMainBtn');
  const originalText = menuBtn.textContent;

  menuBtn.textContent = 'Gerando PDF...';
  menuBtn.disabled = true;

  try {
    const pageWidth = 100;
    const pageHeight = 217;
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;

    const pdf = new jspdf.jsPDF('p', 'mm', [pageWidth, pageHeight]);
    let y = margin;

    // Função que garante espaço em página (quebra se necessário)
    function ensureSpace(needed) {
      if (y + needed > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      return y;
    }

    function setColor(fn, rgb) {
      pdf[fn](rgb[0], rgb[1], rgb[2]);
    }

    // HEADER
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(15);
    setColor('setTextColor', PDF_COLORS.ink);
    pdf.text('EngAIja', pageWidth / 2, y, { align: 'center' });
    y += 5;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    setColor('setTextColor', PDF_COLORS.muted);
    pdf.text('Inteligência para Redes Sociais — Relatório', pageWidth / 2, y, { align: 'center' });
    y += 4.5;

    // Data da análise
    if (STATE.analysisDate) {
      pdf.setFontSize(6.5);
      const d = STATE.analysisDate;
      const dateStr = 'Análise processada em ' + d.toLocaleDateString('pt-BR') + ' às ' +
        d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      pdf.text(dateStr, pageWidth / 2, y, { align: 'center' });
      y += 6;
    } else {
      y += 2;
    }

    // Cards de números
    const statCards = [
      [fmt(STATE.totalFollowing), 'Seguindo'],
      [fmt(STATE.totalFollowers), 'Seguidores'],
      [(STATE.diff >= 0 ? '+' : '') + fmt(STATE.diff), 'Diferença'],
      [STATE.ratio.toFixed(2) + 'x', 'Taxa de retorno']
    ];

    const colW = usableWidth / 2;
    const rowH = 15;
    const gap = 3;

    statCards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const bx = margin + col * (colW + gap) - (col ? gap : 0);
      const by = y + row * (rowH + gap);

      pdf.setDrawColor(150, 47, 191);
      pdf.setLineWidth(0.6);
      pdf.line(bx, by, bx + colW - gap, by);

      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(13);
      setColor('setTextColor', PDF_COLORS.purple);
      pdf.text(c[0], bx + (colW - gap) / 2, by + 7, { align: 'center' });

      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(7);
      setColor('setTextColor', PDF_COLORS.muted);
      pdf.text(c[1], bx + (colW - gap) / 2, by + 11, { align: 'center' });
    });

    y += Math.ceil(statCards.length / 2) * (rowH + gap) + 4;

    // GRÁFICO ROSCA
    ensureSpace(48);
    const chartR = 18;
    drawDonutChart(pdf, pageWidth / 2, y + chartR, chartR,
      [STATE.totalFollowers, STATE.totalFollowing],
      [PDF_COLORS.purple, PDF_COLORS.orange]);
    y += chartR * 2 + 5;

    // Legenda
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    setColor('setTextColor', PDF_COLORS.purple);
    pdf.text('●', pageWidth / 2 - 24, y);
    setColor('setTextColor', PDF_COLORS.ink);
    pdf.text('Seguidores: ' + fmt(STATE.totalFollowers), pageWidth / 2 - 20, y);
    setColor('setTextColor', PDF_COLORS.orange);
    pdf.text('●', pageWidth / 2 + 4, y);
    setColor('setTextColor', PDF_COLORS.ink);
    pdf.text('Seguindo: ' + fmt(STATE.totalFollowing), pageWidth / 2 + 8, y);
    y += 8;

    // GRÁFICO BARRAS (atividade)
    const activityLabels = ['Não seguem de volta', 'Deletadas', 'Ativas', 'Deixou de seguir', 'Sugestões removidas'];
    const activityValues = [
      STATE.notFollowingBack.length,
      STATE.deletedCount,
      STATE.notFollowingBack.length - STATE.deletedCount,
      STATE.unfollowedCount,
      STATE.removedSuggCount
    ];
    const activityColors = [[214, 41, 118], [108, 108, 118], [15, 169, 104], [250, 126, 30], [79, 91, 213]];
    const maxVal = Math.max.apply(null, activityValues.concat([1]));
    const barLabelW = 26;
    const barMaxW = usableWidth - barLabelW;
    const barH = 5;
    const barGap = 3;

    ensureSpace(activityLabels.length * (barH + barGap) + 6);
    activityLabels.forEach((label, i) => {
      pdf.setFontSize(6.5);
      pdf.setFont(undefined, 'normal');
      setColor('setTextColor', PDF_COLORS.ink);
      const labelLines = pdf.splitTextToSize(label, barLabelW - 2);
      pdf.text(labelLines[0], margin, y + barH / 2 + 1.3);

      const barW = Math.max(0.8, (activityValues[i] / maxVal) * barMaxW);
      pdf.setFillColor(activityColors[i][0], activityColors[i][1], activityColors[i][2]);
      pdf.rect(margin + barLabelW, y, barW, barH, 'F');

      pdf.setFontSize(6.5);
      setColor('setTextColor', PDF_COLORS.muted);
      pdf.text(String(activityValues[i]), margin + barLabelW + barW + 1.5, y + barH / 2 + 1.3);
      y += barH + barGap;
    });
    y += 6;

    // INSIGHTS
    extractInsightData().forEach(data => {
      y = drawInsightCard(pdf, data, margin, usableWidth, ensureSpace, pageHeight, margin);
    });
    y += 3;

    // PRIVACIDADE
    ensureSpace(10);
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(11);
    setColor('setTextColor', PDF_COLORS.purple);
    pdf.text('Privacidade e listas especiais', margin, y);
    y += 7;

    const privacyStatCards = document.querySelectorAll('#privacyContent .stats-grid .stat-card');
    Array.prototype.forEach.call(privacyStatCards, (c, i) => {
      if (i % 2 === 0) ensureSpace(rowH + gap);
      const col = i % 2;
      const bx = margin + col * (colW + gap) - (col ? gap : 0);

      pdf.setDrawColor(150, 47, 191);
      pdf.setLineWidth(0.5);
      pdf.line(bx, y, bx + colW - gap, y);

      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(11);
      setColor('setTextColor', PDF_COLORS.purple);
      pdf.text(c.querySelector('.num').textContent, bx + (colW - gap) / 2, y + 6, { align: 'center' });

      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(6.5);
      setColor('setTextColor', PDF_COLORS.muted);
      pdf.text(c.querySelector('.lbl').textContent, bx + (colW - gap) / 2, y + 9.5, { align: 'center' });

      if (col === 1) y += rowH;
    });
    if (privacyStatCards.length % 2 === 1) y += rowH;
    y += 5;

    // Listas de privacidade (bloqueados, etc)
    const privacyContentEl = document.getElementById('privacyContent');
    const privacyChildren = privacyContentEl ? Array.prototype.slice.call(privacyContentEl.children) : [];

    for (let pi = 0; pi < privacyChildren.length; pi++) {
      const pel = privacyChildren[pi];
      if (pel.tagName === 'H3' && privacyChildren[pi + 1] && privacyChildren[pi + 1].classList.contains('profiles-grid')) {
        ensureSpace(9);
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(8.5);
        setColor('setTextColor', PDF_COLORS.ink);
        pdf.text(pel.textContent, margin, y);
        y += 5;

        const names = Array.prototype.map.call(
          privacyChildren[pi + 1].querySelectorAll('.uname'),
          n => n.textContent
        );

        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(7);
        setColor('setTextColor', PDF_COLORS.ink);
        names.forEach(name => {
          ensureSpace(4.2);
          pdf.text('• ' + name, margin + 2, y);
          y += 4.2;
        });
        y += 3;
        pi++;
      }
    }

    // PLANO DE AÇÃO
    ensureSpace(10);
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(11);
    setColor('setTextColor', PDF_COLORS.purple);
    pdf.text('Plano de ação', margin, y);
    y += 7;

    extractRecoData().forEach(data => {
      y = drawRecoCard(pdf, data, margin, usableWidth, ensureSpace, pageHeight, margin);
    });

    // LISTA COMPLETA (opcional)
    if (includeList) {
      pdf.addPage();
      y = margin;

      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(10);
      setColor('setTextColor', PDF_COLORS.purple);
      y = drawWrappedText(pdf, 'Perfis que você segue e não te seguem de volta (' +
        STATE.notFollowingBack.length + ')', margin, y, usableWidth, 4.5);
      y += 3;

      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(7);

      const colCount = 2;
      const listColW = usableWidth / colCount;
      const lineH = 4.2;
      let col = 0;
      let startY = y;

      STATE.notFollowingBack.forEach(p => {
        if (y + lineH > pageHeight - margin) {
          col++;
          y = startY;
          if (col >= colCount) {
            pdf.addPage();
            y = margin;
            startY = y;
            col = 0;
          }
        }

        const lx = margin + col * listColW;
        setColor('setTextColor', isDeleted(p) ? PDF_COLORS.red : PDF_COLORS.ink);
        pdf.text(p.username + (isDeleted(p) ? ' (deletada)' : ''), lx, y, { maxWidth: listColW - 3 });
        y += lineH;
      });
    }

    pdf.save(includeList ? 'engaija_relatorio_completo.pdf' : 'engaija_relatorio.pdf');

  } catch (err) {
    document.getElementById('errorBox').style.display = 'block';
    document.getElementById('errorBox').textContent = 'Não consegui gerar o PDF (' + err.message + '). Tenta de novo ou usa a exportação CSV.';
  } finally {
    menuBtn.textContent = originalText;
    menuBtn.disabled = false;
  }
}

// ====================================================================
// EXPORTAÇÃO CSV
// ====================================================================
/**
 * Exporta lista de perfis em CSV
 */
function exportCsv() {
  const rows = [['username', 'link_perfil', 'status']];
  STATE.notFollowingBack.forEach(p => {
    rows.push([
      p.username,
      p.href,
      isDeleted(p) ? 'deletada' : 'ativa'
    ]);
  });

  const csvContent = rows.map(r => r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'engaija_lista_nao_seguem_de_volta.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
