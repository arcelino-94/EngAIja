/**
 * ENGAIJA — Integration Guide
 * Como integrar firebase-auth.js e save-analysis.js com app.js
 */

// ====================================================================
// MODIFICAÇÕES NECESSÁRIAS EM app.js
// ====================================================================

// IMPORTANTE: Essas modificações permitem que os novos arquivos
// funcionem junto com o código existente

// ====================================================================
// 1. ADICIONAR CHAMADA DE INICIALIZAÇÃO
// ====================================================================

// No FINAL de app.js, adicione:
/*
// Inicializar feature de salvar análises (após dashboard carregar)
if (typeof initSaveAnalysisFeature === 'function') {
  document.addEventListener('DOMContentLoaded', function() {
    // Aguarda 500ms para garantir que DOM tá pronto
    setTimeout(initSaveAnalysisFeature, 500);
  });
}
*/

// ====================================================================
// 2. INTEGRAÇÃO COM buildDashboard()
// ====================================================================

// Localizar a função buildDashboard() em app.js
// Adicionar ao FINAL dela:

/*
// Após renderizar dashboard, mostrar botão de salvar
if (typeof addSaveButtonToDashboard === 'function') {
  setTimeout(addSaveButtonToDashboard, 300);
}

// Mostrar seção de análises salvas
if (typeof loadSavedAnalyses === 'function' && currentUser) {
  setTimeout(loadSavedAnalyses, 300);
}
*/

// ====================================================================
// 3. ORDEM DE CARREGAMENTO (IMPORTANTE!)
// ====================================================================

// index.html deve carregar os scripts NESTA ORDEM:
/*
<script src="firebase-auth.js"></script>    <!-- PRIMEIRO: Firebase config -->
<script src="save-analysis.js"></script>    <!-- SEGUNDO: Interface de salvar -->
<script src="app.js"></script>              <!-- TERCEIRO: Lógica principal -->
*/

// Razão: Firebase precisa estar pronto antes de salvar análises
// Save-analysis precisa estar pronto antes de app.js chamar suas funções

// ====================================================================
// 4. VARIÁVEL GLOBAL STATE
// ====================================================================

// app.js TEM uma variável global STATE que guarda:
const STATE = {
  totalFollowing: 0,
  totalFollowers: 0,
  diff: 0,
  ratio: 0,
  notFollowingBack: [],
  deletedCount: 0,
  blocked: {},
  restricted: {},
  closeFriends: {},
  // ... mais dados
};

// firebase-auth.js LÊ STATE para salvar análise
// Então app.js DEVE popular STATE antes de chamar saveAnalysis()

// ====================================================================
// 5. FUNÇÃO fmt() PRECISA EXISTIR
// ====================================================================

// firebase-auth.js usa fmt() para formatar números
// Verificar se existe em app.js:

function fmt(num) {
  // Se não existir, adicione esta função em app.js
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// ====================================================================
// 6. INTEGRAÇÃO COM MODAL DE SALVAR
// ====================================================================

// Quando processing termina, executar:

// ANTES (sem Firebase):
/*
loadDashboard(); // Só mostra dashboard
*/

// DEPOIS (com Firebase):
/*
loadDashboard(); // Mostra dashboard

// Se usuário tá logado, oferece salvar
if (currentUser) {
  setTimeout(() => {
    openSaveAnalysisModal(); // Abre modal de salvar
  }, 1000);
} else {
  alert('Faça login para salvar suas análises!');
}
*/

// ====================================================================
// 7. FUNÇÕES GLOBAIS QUE app.js PODE USAR
// ====================================================================

// firebase-auth.js expõe:
window.loginWithGoogle          // Função de login
window.logout                   // Função de logout
window.saveAnalysis             // Salva no Firestore
window.loadSavedAnalyses        // Carrega análises do usuário
window.loadAnalysisById         // Carrega análise específica
window.deleteAnalysis           // Deleta análise

// save-analysis.js expõe:
window.openSaveAnalysisModal    // Abre modal
window.executeSaveAnalysis      // Executa salvamento
window.initSaveAnalysisFeature  // Inicializa tudo

// ====================================================================
// 8. EXEMPLO DE FLUXO COMPLETO
// ====================================================================

/*
1. Página carrega
   → firebase-auth.js executa
   → Habilita autenticação

2. Usuário não tá logado
   → Mostra botão "Login com Google"

3. Usuário clica "Login com Google"
   → Chama window.loginWithGoogle()
   → Abre popup Google
   → Usuário faz login
   → updateAuthUI() mostra botão de logout

4. Usuário upload ZIP
   → app.js processa
   → buildDashboard() executa

5. Dashboard mostra
   → Novo botão "💾 Salvar Esta Análise"
   → Seção "Minhas Análises Salvas" aparece

6. Usuário clica "Salvar"
   → openSaveAnalysisModal() abre
   → Modal pede nome
   → Clica "Salvar"

7. executeSaveAnalysis() chama
   → Extrai dados de STATE
   → Chama saveAnalysis()
   → saveAnalysis() manda pra Firebase

8. Firestore salva
   → Análise aparece em "Minhas Análises"

9. Próxima vez que abre site
   → updateAuthUI() verifica se tá logado
   → Se sim, loadSavedAnalyses() carrega análises antigas
   → Pode clicar e ver análise salva
*/

// ====================================================================
// 9. VARIÁVEIS GLOBAIS QUE CONECTAM TUDO
// ====================================================================

// firebase-auth.js cria:
let currentUser = null;  // User logado (ou null)

// app.js cria:
const STATE = { /* ... */ };  // Dados da análise

// Ambos acessam:
window.currentUser   // Estado de autenticação
STATE               // Dados da análise

// ====================================================================
// 10. CHECKLIST DE INTEGRAÇÃO
// ====================================================================

/*
✅ firebase-auth.js está antes de save-analysis.js em index.html
✅ save-analysis.js está antes de app.js em index.html
✅ app.js tem variável global STATE populada
✅ app.js tem função fmt() definida
✅ buildDashboard() em app.js chama addSaveButtonToDashboard()
✅ Firebase config está corrigida em firebase-auth.js
✅ Firestore está criado e regras estão corretas
✅ Google Auth está ativado
✅ Botão de login aparece na página
✅ Testes:
  - Login com Google funciona
  - Upload ZIP funciona
  - Dashboard renderiza
  - Botão "Salvar" aparece
  - Modal de salvar abre
  - Análise salva no Firestore
  - Análise aparece em "Minhas Análises"
  - Clicando em análise antiga carrega dados
*/

// ====================================================================
// 11. DEBUGGING
// ====================================================================

// Se algo não funciona, abra Console (F12) e teste:

console.log(currentUser);           // Vê usuário logado
console.log(STATE);                 // Vê dados de análise
console.log(firebase.auth());       // Vê Firebase Auth
console.log(firebase.firestore());  // Vê Firestore

// Teste funções:
loginWithGoogle();              // Abre login
logout();                        // Faz logout
saveAnalysis('Test', STATE);    // Tenta salvar
loadSavedAnalyses();            // Carrega análises

// Veja Network tab:
// - POST /v1/projects/{project}/documents
//   = Firestore salvando dados

// Veja Application → IndexedDB:
// - firebase deve ter dados em cache

// ====================================================================
// 12. POSSÍVEIS ERROS E SOLUÇÕES
// ====================================================================

// Erro: "Cannot read property 'uid' of null"
// Causa: Tentou salvar sem estar logado
// Solução: Verificar if (currentUser) antes de salvar

// Erro: "firebase is not defined"
// Causa: firebase-auth.js não carregou
// Solução: Verificar <script> tags em index.html

// Erro: "saveAnalysis is not a function"
// Causa: save-analysis.js não executou
// Solução: Verificar ordem dos scripts

// Erro: "State is not defined"
// Causa: app.js não executou antes de save-analysis.js chamar
// Solução: Verificar ordem dos scripts

// ====================================================================

console.log('✅ Integration guide loaded. Check console for more info.');
