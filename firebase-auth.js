/**
 * ENGAIJA — Firebase Configuration & Authentication
 * Gerencia login com Google e conexão com Firestore
 * 
 * Dependências:
 * - Firebase SDK (carregado via CDN no index.html)
 * - Google Sign-In
 */

// ====================================================================
// CONFIGURAÇÃO FIREBASE
// ====================================================================
/**
 * Configuração do seu projeto Firebase
 * IMPORTANTE: Substitua pelos valores do seu projeto!
 * Como pegar: Firebase Console → Project Settings → Web App Config
 */
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

/**
 * Referências globais do Firebase
 * - auth: Autenticação (login/logout)
 * - db: Firestore (banco de dados)
 * - currentUser: Usuário logado atualmente
 */
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;

// ====================================================================
// LISTENERS DE AUTENTICAÇÃO
// ====================================================================
/**
 * Monitora mudanças no estado de autenticação
 * Quando usuário faz login/logout, essa função é chamada
 * 
 * @param {User} user - Objeto do usuário (ou null se deslogou)
 */
auth.onAuthStateChanged(async function(user) {
  if (user) {
    // Usuário fez LOGIN ✅
    currentUser = user;
    console.log("✅ Logado como:", user.displayName, user.email);
    
    // Mostra interface de usuário logado
    updateAuthUI(true, user);
    
    // Se tava na tela de upload, mostra dashboard com análises salvas
    if (document.getElementById('uploadScreen').style.display !== 'none') {
      loadSavedAnalyses();
    }
  } else {
    // Usuário fez LOGOUT ❌
    currentUser = null;
    console.log("❌ Deslogado");
    
    // Volta pra tela de login
    updateAuthUI(false, null);
  }
});

// ====================================================================
// UI DE AUTENTICAÇÃO
// ====================================================================
/**
 * Atualiza interface baseado no estado de login
 * 
 * @param {boolean} isLoggedIn - true se logado, false se não
 * @param {User} user - Dados do usuário (ou null)
 */
function updateAuthUI(isLoggedIn, user) {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  
  if (isLoggedIn) {
    // Mostra botão de logout e info do usuário
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (userInfo) userInfo.style.display = 'block';
    if (userName) userName.textContent = user.displayName || 'Usuário';
    if (userEmail) userEmail.textContent = user.email;
    
    // Mostra seção de "Minhas Análises"
    const savedAnalysesSection = document.getElementById('savedAnalysesSection');
    if (savedAnalysesSection) savedAnalysesSection.style.display = 'block';
  } else {
    // Mostra botão de login
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
    
    // Esconde seção de "Minhas Análises"
    const savedAnalysesSection = document.getElementById('savedAnalysesSection');
    if (savedAnalysesSection) savedAnalysesSection.style.display = 'none';
  }
}

// ====================================================================
// FUNÇÕES DE LOGIN/LOGOUT
// ====================================================================
/**
 * Faz login com Google
 * Abre popup do Google pra usuário escolher conta
 */
async function loginWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Abre janela de login do Google
    const result = await auth.signInWithPopup(provider);
    
    console.log("✅ Login bem-sucedido:", result.user.email);
    
    // Cria documento do usuário no Firestore (se não existir)
    await createUserDocument(result.user);
    
  } catch (error) {
    console.error("❌ Erro no login:", error.message);
    alert("Erro ao fazer login: " + error.message);
  }
}

/**
 * Faz logout
 * Remove usuário atual da sessão
 */
async function logout() {
  try {
    await auth.signOut();
    console.log("✅ Logout bem-sucedido");
  } catch (error) {
    console.error("❌ Erro no logout:", error.message);
  }
}

// ====================================================================
// GERENCIAMENTO DE USUÁRIOS
// ====================================================================
/**
 * Cria documento do usuário no Firestore
 * Guarda informações básicas do usuário logado
 * 
 * @param {User} user - Usuário do Firebase Auth
 */
async function createUserDocument(user) {
  try {
    const userRef = db.collection('usuarios').doc(user.uid);
    const userDoc = await userRef.get();
    
    // Se usuário já existe, não cria de novo
    if (userDoc.exists) {
      console.log("ℹ️ Usuário já existe no banco");
      return;
    }
    
    // Cria documento novo com info do usuário
    await userRef.set({
      uid: user.uid,
      nome: user.displayName || 'Usuário',
      email: user.email,
      fotoPerfil: user.photoURL || '',
      dataCriacao: new Date(),
      ultimoLogin: new Date()
    });
    
    console.log("✅ Documento de usuário criado");
    
  } catch (error) {
    console.error("❌ Erro ao criar documento do usuário:", error);
  }
}

/**
 * Atualiza último login do usuário
 * Chamado toda vez que faz login
 */
async function updateLastLogin(user) {
  try {
    await db.collection('usuarios').doc(user.uid).update({
      ultimoLogin: new Date()
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar último login:", error);
  }
}

// ====================================================================
// SALVAR ANÁLISE
// ====================================================================
/**
 * Salva uma análise no Firestore
 * Guarda APENAS os resultados (números, insights), não o JSON
 * 
 * @param {string} titulo - Nome da análise (ex: "Análise de Julho")
 * @param {object} analise - Dados processados (STATE)
 */
async function saveAnalysis(titulo, analise) {
  if (!currentUser) {
    alert("Você precisa fazer login para salvar análises");
    return;
  }
  
  try {
    // Extrai APENAS o que interessa (sem dados brutos do ZIP)
    const analysisData = {
      titulo: titulo,
      data: new Date(),
      
      // Números principais
      totalSeguindo: analise.totalFollowing,
      totalSeguidores: analise.totalFollowers,
      diferenca: analise.diff,
      taxa: analise.ratio,
      
      // Análise de não-seguidores
      naoSeguemVolta: analise.notFollowingBack.length,
      deletadas: analise.deletedCount,
      
      // Privacidade
      bloqueados: Object.keys(analise.blocked).length,
      restringidos: Object.keys(analise.restricted).length,
      melhoresAmigos: Object.keys(analise.closeFriends).length,
      
      // Atividade
      postsUltimos: analise.unfollowedCount,
      
      // Insights (texto)
      insights: {
        textoDiferenca: analise.diff >= 0 
          ? `Você tem ${fmt(analise.diff)} mais seguidores`
          : `Você segue ${fmt(-analise.diff)} pessoas a mais`,
        textoTaxa: `Taxa de retorno: ${analise.ratio.toFixed(2)}x`,
        naoSeguemBackTexto: `${fmt(analise.notFollowingBack.length)} não te seguem de volta`
      }
    };
    
    // Salva no Firestore (coleção do usuário)
    const docRef = await db
      .collection('usuarios')
      .doc(currentUser.uid)
      .collection('analises')
      .add(analysisData);
    
    console.log("✅ Análise salva com ID:", docRef.id);
    alert("✅ Análise salva com sucesso!");
    
    // Recarrega lista de análises
    loadSavedAnalyses();
    
    return docRef.id;
    
  } catch (error) {
    console.error("❌ Erro ao salvar análise:", error);
    alert("Erro ao salvar: " + error.message);
  }
}

// ====================================================================
// CARREGAR ANÁLISES SALVAS
// ====================================================================
/**
 * Carrega todas as análises do usuário do Firestore
 * Mostra lista de análises anteriores
 */
async function loadSavedAnalyses() {
  if (!currentUser) return;
  
  try {
    // Busca todas as análises do usuário
    const snapshot = await db
      .collection('usuarios')
      .doc(currentUser.uid)
      .collection('analises')
      .orderBy('data', 'desc')
      .get();
    
    const analisesList = document.getElementById('analysesListContainer');
    
    if (snapshot.empty) {
      analisesList.innerHTML = '<p style="color: #6c6c76; text-align: center;">Nenhuma análise salva ainda</p>';
      return;
    }
    
    // Renderiza lista de análises
    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const dataFormatada = new Date(data.data.toDate()).toLocaleDateString('pt-BR');
      
      html += `
        <div style="
          background: #fbf4fd; 
          border: 1px solid #e6d5f5; 
          border-radius: 10px; 
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
        "
        onmouseover="this.style.background='#f7f2fb'"
        onmouseout="this.style.background='#fbf4fd'"
        onclick="loadAnalysisById('${doc.id}')">
          <div style="font-weight: 700; color: #962fbf;">${data.titulo}</div>
          <div style="font-size: 0.85rem; color: #6c6c76; margin-top: 5px;">
            📅 ${dataFormatada} • 
            👥 ${fmt(data.totalSeguindo)} seguindo • 
            📊 ${fmt(data.naoSeguemVolta)} não seguem de volta
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    analisesList.innerHTML = html;
    
  } catch (error) {
    console.error("❌ Erro ao carregar análises:", error);
  }
}

/**
 * Carrega uma análise específica pelo ID
 * Mostra os dados salvos como se fosse uma análise nova
 * 
 * @param {string} analysisId - ID do documento no Firestore
 */
async function loadAnalysisById(analysisId) {
  if (!currentUser) return;
  
  try {
    const doc = await db
      .collection('usuarios')
      .doc(currentUser.uid)
      .collection('analises')
      .doc(analysisId)
      .get();
    
    if (!doc.exists) {
      alert("Análise não encontrada");
      return;
    }
    
    const data = doc.data();
    
    // Reconstrói STATE com dados salvos
    STATE.totalFollowing = data.totalSeguindo;
    STATE.totalFollowers = data.totalSeguidores;
    STATE.diff = data.diferenca;
    STATE.ratio = data.taxa;
    STATE.notFollowingBack = new Array(data.naoSeguemVolta);
    STATE.deletedCount = data.deletadas;
    STATE.analysisDate = new Date(data.data.toDate());
    
    // Renderiza dashboard
    document.getElementById('uploadScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    renderStats({
      totalFollowing: data.totalSeguindo,
      totalFollowers: data.totalSeguidores,
      diff: data.diferenca,
      ratio: data.taxa,
      notBack: data.naoSeguemVolta,
      deleted: data.deletadas
    });
    
    console.log("✅ Análise carregada:", data.titulo);
    
  } catch (error) {
    console.error("❌ Erro ao carregar análise:", error);
  }
}

/**
 * Deleta uma análise
 * Não pode ser desfeita!
 * 
 * @param {string} analysisId - ID do documento
 */
async function deleteAnalysis(analysisId) {
  if (!currentUser) return;
  
  if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) {
    return;
  }
  
  try {
    await db
      .collection('usuarios')
      .doc(currentUser.uid)
      .collection('analises')
      .doc(analysisId)
      .delete();
    
    console.log("✅ Análise deletada");
    alert("✅ Análise deletada");
    
    loadSavedAnalyses();
    
  } catch (error) {
    console.error("❌ Erro ao deletar:", error);
    alert("Erro: " + error.message);
  }
}

// Exporta funções globalmente
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;
window.saveAnalysis = saveAnalysis;
window.loadSavedAnalyses = loadSavedAnalyses;
window.loadAnalysisById = loadAnalysisById;
window.deleteAnalysis = deleteAnalysis;
