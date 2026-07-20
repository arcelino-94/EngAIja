/**
 * ENGAIJA — Data Parser & ZIP Handler
 * Responsável por ler e processar arquivos .zip do Instagram
 */

// ====================================================================
// CONFIGURAÇÃO — Mapeamento dos arquivos esperados
// ====================================================================
/**
 * Mapping entre nomes internos e nomes de arquivo do ZIP
 * Estrutura: { nomeInterno: 'nomeNoZip.json' }
 */
const TARGETS = {
  // Conexões principais
  following: 'following.json',
  followers: 'followers_1.json',
  // Privacidade
  blocked: 'blocked_profiles.json',
  restricted: 'restricted_profiles.json',
  closeFriends: 'close_friends.json',
  hideStoryFrom: 'hide_story_from.json',
  pendingIncoming: 'pending_follow_requests.json',
  requestsSent: 'recent_follow_requests.json',
  recentlyUnfollowed: 'recently_unfollowed_profiles.json',
  removedSuggestions: 'removed_suggestions.json',
  favorited: 'profiles_you_ve_favorited.json',
  // Atividade
  likedPosts: 'liked_posts.json',
  savedPosts: 'saved_posts.json',
  profilePhotos: 'profile_photos.json',
  stories: 'stories.json',
  reposts: 'reposts.json',
  // Interações
  secretConversations: 'secret_conversations.json',
  emojiReactions: 'emoji_story_reactions.json',
  storyLikes: 'story_likes.json',
  polls: 'polls.json',
  hype: 'hype.json',
  // Perfil
  profileInfo: 'instagram_profile_information.json',
  personalInfo: 'personal_information.json',
  signupDetails: 'signup_details.json',
  loginActivity: 'login_activity.json'
};

// ====================================================================
// EXTRAÇÃO — Converte um item JSON em objeto de perfil
// ====================================================================
/**
 * Extrai informações de perfil de um item JSON (2 formatos possíveis)
 * @param {object} item - Item do JSON do Instagram
 * @returns {object|null} { username, href, timestamp } ou null
 */
function extractProfile(item) {
  // Formato 1: string_list_data com title
  if (item.string_list_data && item.string_list_data.length) {
    const e = item.string_list_data[0];
    const username = item.title || e.value || null;
    if (!username) return null;
    return {
      username: username,
      href: 'https://www.instagram.com/' + username.replace(/^@/, '') + '/',
      timestamp: e.timestamp || 0
    };
  }
  // Formato 2: label_values (raro)
  if (item.label_values && item.label_values.length) {
    let username = null;
    for (let i = 0; i < item.label_values.length; i++) {
      const lv = item.label_values[i];
      const label = (lv.label || '').toLowerCase();
      if (label.indexOf('usu') !== -1) {
        username = lv.value;
        break;
      }
    }
    if (!username) return null;
    return {
      username: username,
      href: 'https://www.instagram.com/' + username.replace(/^@/, '') + '/',
      timestamp: item.timestamp || 0
    };
  }
  return null;
}

/**
 * Extrai array de items de um JSON parseado (suporta múltiplos formatos)
 * @param {*} parsed - Objeto JSON parseado
 * @returns {array} Array de items
 */
function itemsFromJson(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
    for (const k in parsed) {
      if (Array.isArray(parsed[k])) return parsed[k];
    }
  }
  return [];
}

/**
 * Converte array de items em mapa (indexado por username)
 * @param {array} rawList - Array de items brutos
 * @returns {object} Mapa { username: profile, ... }
 */
function toMap(rawList) {
  const map = {};
  for (let i = 0; i < rawList.length; i++) {
    const p = extractProfile(rawList[i]);
    if (p) map[p.username.toLowerCase()] = p;
  }
  return map;
}

// ====================================================================
// PROCESSAMENTO — Agrupa e analisa dados
// ====================================================================
/**
 * Calcula quem você segue mas não segue você de volta
 * @param {object} raw - Dados brutos do ZIP { following, followers, ... }
 * @returns {object} Dados processados para renderização
 */
function processRawData(raw) {
  // Converte arrays brutos em mapas indexados por username
  const following = toMap(raw.following || []);
  const followers = toMap(raw.followers || []);
  const blocked = toMap(raw.blocked || []);
  const restricted = toMap(raw.restricted || []);
  const closeFriends = toMap(raw.closeFriends || []);
  const hideStory = toMap(raw.hideStoryFrom || []);
  const pendingIn = toMap(raw.pendingIncoming || []);
  const requestsSent = toMap(raw.requestsSent || []);
  const unfollowed = toMap(raw.recentlyUnfollowed || []);
  const removedSugg = toMap(raw.removedSuggestions || []);
  const favorited = toMap(raw.favorited || []);

  // Calcula diferenças
  const followingKeys = Object.keys(following);
  const followersKeys = Object.keys(followers);
  const followersSet = {};
  followersKeys.forEach(k => followersSet[k] = true);

  const notFollowingBack = [];
  followingKeys.forEach(k => {
    if (!followersSet[k]) notFollowingBack.push(following[k]);
  });
  notFollowingBack.sort((a, b) => a.username.localeCompare(b.username));

  // Conta deletadas
  const deletedCount = notFollowingBack.filter(isDeleted).length;
  const totalFollowing = followingKeys.length;
  const totalFollowers = followersKeys.length;
  const diff = totalFollowers - totalFollowing;
  const ratio = totalFollowing ? totalFollowers / totalFollowing : 0;

  return {
    following, followers, blocked, restricted, closeFriends, hideStory,
    pendingIn, requestsSent, unfollowed, removedSugg, favorited,
    followersSet, notFollowingBack, deletedCount,
    totalFollowing, totalFollowers, diff, ratio,
    unfollowedCount: Object.keys(unfollowed).length,
    removedSuggCount: Object.keys(removedSugg).length
  };
}

// ====================================================================
// GERADOR DE DADOS FICTÍCIOS — Para modo demonstração
// ====================================================================
/**
 * Gera um username fictício baseado em índice
 * @param {number} i - Índice
 * @returns {string} Username falso
 */
function buildFakeUsername(i) {
  const nomes = [
    'perfil_exemplo', 'conta_fake', 'usuario_teste', 'demo_criador',
    'exemplo_conta', 'fake_perfil', 'conta_simulada', 'usuario_demo',
    'perfil_teste', 'exemplo_fake'
  ];
  return nomes[i % nomes.length] + '_' + (100 + i);
}

/**
 * Cria um item fake no formato do Instagram
 * @param {number} i - Índice
 * @returns {object} Item formatado como string_list_data
 */
function fakeStringListItem(i) {
  return {
    title: buildFakeUsername(i),
    string_list_data: [{
      value: buildFakeUsername(i),
      href: 'exemplo://perfil-fake/' + i,
      timestamp: 1700000000 + i * 1000
    }]
  };
}

/**
 * Gera dataset completo e fictício para demonstração
 * Mantém estrutura idêntica aos dados reais
 * @returns {object} Dados brutos fake
 */
function generateFakeRaw() {
  // ~843 seguindo
  const following = [];
  for (let i = 0; i < 843; i++) following.push(fakeStringListItem(i));

  // ~1.050 seguidores (636 dos 843 + 414 extras que ele não segue)
  const followers = [];
  for (let j = 0; j < 1050; j++) {
    if (j < 636) followers.push(fakeStringListItem(j));
    else followers.push(fakeStringListItem(900 + j));
  }

  // Marca algumas contas como deletadas
  for (let k = 636; k < 644; k++) {
    following[k].title = '__deleted__' + buildFakeUsername(k);
    following[k].string_list_data[0].value = following[k].title;
  }

  const blocked = [fakeStringListItem(9001), fakeStringListItem(9002)];
  const restricted = [fakeStringListItem(9010)];
  const closeFriends = [fakeStringListItem(9020), fakeStringListItem(9021), fakeStringListItem(9022)];
  const hideStoryFrom = [fakeStringListItem(9030)];
  const pendingIncoming = [fakeStringListItem(9040)];
  const requestsSent = [fakeStringListItem(9050), fakeStringListItem(9051)];
  const recentlyUnfollowed = [fakeStringListItem(9060), fakeStringListItem(9061), fakeStringListItem(9062)];
  const removedSuggestions = [fakeStringListItem(9070)];
  const favorited = [fakeStringListItem(9080)];

  // Atividade fictícia
  const likedPosts = new Array(127).fill(null).map((_, i) => ({ value: 'post_' + i }));
  const savedPosts = new Array(45).fill(null).map((_, i) => ({ value: 'saved_' + i }));
  const stories = new Array(18).fill(null).map((_, i) => ({ value: 'story_' + i }));
  const profilePhotos = [{ value: 'profile_photo_1' }];
  const reposts = new Array(7).fill(null).map((_, i) => ({ value: 'repost_' + i }));

  // Interações fictícias
  const emojiReactions = new Array(89).fill(null).map((_, i) => ({ value: 'emoji_' + i }));
  const storyLikes = new Array(56).fill(null).map((_, i) => ({ value: 'like_' + i }));
  const polls = [{ value: 'poll_1' }, { value: 'poll_2' }];
  const hype = [{ value: 'hype_1' }];
  const secretConversations = new Array(3).fill(null).map((_, i) => ({ value: 'chat_' + i }));

  return {
    following, followers, blocked, restricted, closeFriends, hideStoryFrom,
    pendingIncoming, requestsSent, recentlyUnfollowed, removedSuggestions, favorited,
    likedPosts, savedPosts, stories, profilePhotos, reposts,
    emojiReactions, storyLikes, polls, hype, secretConversations
  };
}

// Exporta funções para uso global
window.TARGETS = TARGETS;
window.processRawData = processRawData;
window.generateFakeRaw = generateFakeRaw;
