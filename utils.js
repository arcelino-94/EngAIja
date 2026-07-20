/**
 * ENGAIJA — Utils & Helpers
 * Funções utilitárias compartilhadas entre módulos
 */

// ====================================================================
// TRADUÇÃO (I18N) — Suporte multilíngue
// ====================================================================
/**
 * Dicionário de tradução centralizado
 * Estrutura: { idioma: { chave: valor } }
 */
const I18N = {
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

let currentLang = 'pt';

/**
 * Aplica o idioma selecionado a todos os elementos data-i18n
 * @param {string} lang - Código do idioma ('pt' ou 'en')
 */
function applyLanguage(lang) {
  currentLang = lang;
  const dict = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
}

// ====================================================================
// FORMATAÇAO E CONVERSAO
// ====================================================================
/**
 * Formata número para notação local (pt-BR: 1.234,56)
 * @param {number} n - Número a formatar
 * @returns {string} Número formatado
 */
function fmt(n) {
  return n.toLocaleString('pt-BR');
}

/**
 * Escapa caracteres HTML especiais
 * @param {string} s - String a escapar
 * @returns {string} String escapada
 */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Escapa valores para CSV
 * @param {*} val - Valor a escapar
 * @returns {string} Valor escapado para CSV
 */
function csvEscape(val) {
  val = String(val);
  if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

// ====================================================================
// VALIDAÇÃO
// ====================================================================
/**
 * Verifica se um perfil foi deletado
 * @param {object} p - Objeto do perfil
 * @returns {boolean} true se deletado
 */
function isDeleted(p) {
  return /__deleted__/i.test(p.username) || /^instagramuser$/i.test(p.username);
}

/**
 * Gera atributos HTML corretos para links de perfil
 * @param {object} p - Objeto do perfil
 * @returns {string} String com atributos href onclick etc
 */
function chipHrefAttrs(p) {
  if (SIM_MODE) {
    return 'href="javascript:void(0)" onclick="return false;"';
  }
  const safeHref = p.href.replace(/"/g, '&quot;');
  return 'href="' + safeHref + '" target="_blank" rel="noopener"';
}

// ====================================================================
// DOM QUERIES
// ====================================================================
/**
 * Seleciona elemento por ID com fallback seguro
 * @param {string} id - ID do elemento
 * @returns {HTMLElement|null} Elemento ou null
 */
function getById(id) {
  return document.getElementById(id) || null;
}

/**
 * Conta quantos requests não foram aceitos
 * @param {object} requestsSent - Mapa de requests
 * @param {object} followersSet - Set de seguidores
 * @returns {number} Quantidade
 */
function countNotAccepted(requestsSent, followersSet) {
  let n = 0;
  for (const k in requestsSent) {
    if (!followersSet[k]) n++;
  }
  return n;
}

// Exporta funções globalmente
window.applyLanguage = applyLanguage;
window.fmt = fmt;
window.escapeHtml = escapeHtml;
window.csvEscape = csvEscape;
window.isDeleted = isDeleted;
window.chipHrefAttrs = chipHrefAttrs;
window.getById = getById;
window.countNotAccepted = countNotAccepted;
