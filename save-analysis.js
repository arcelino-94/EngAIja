/**
 * ENGAIJA — Analysis Save Integration
 * Adiciona funcionalidade de SALVAR ANÁLISE ao dashboard
 * 
 * Integra com:
 * - firebase-auth.js (salva no Firestore)
 * - app.js (renderiza dashboard)
 */

// ====================================================================
// ADICIONAR BOTÃO SALVAR ANÁLISE
// ====================================================================
/**
 * Injetar no HTML, após o processamento de análise
 * Adiciona UI para nomear e salvar análise
 * 
 * Função chamada depois que buildDashboard() termina
 */
function addSaveAnalysisUI() {
  // Cria HTML do modal de salvar
  const saveModalHTML = `
    <div id="saveAnalysisModal" class="pay-modal">
      <div class="pay-box">
        <div class="pay-header">
          <span>Salvar Esta Análise</span>
          <button class="pay-close" onclick="document.getElementById('saveAnalysisModal').classList.remove('open')">✕</button>
        </div>
        
        <div style="background: #faf5ff; padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
          <div style="font-size: 0.9rem; color: #6c3fa3; font-weight: 700;">
            ✅ Análise Carregada com Sucesso
          </div>
          <div style="font-size: 0.8rem; color: #6c6c76; margin-top: 8px;">
            Você pode salvar para acompanhar ao longo do tempo
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #1c1c1f; margin-bottom: 6px;">
              Nome da Análise
            </label>
            <input 
              type="text" 
              id="analysisTitle"
              placeholder="Ex: Análise de Julho 2026"
              style="width: 100%; padding: 12px; border: 1px solid #e6d5f5; border-radius: 8px; font-size: 0.9rem;"
            >
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.8rem; color: #6c6c76;">
            <div>
              <strong>Seguindo:</strong> <span id="modalFollowing">-</span>
            </div>
            <div>
              <strong>Seguidores:</strong> <span id="modalFollowers">-</span>
            </div>
            <div>
              <strong>Diferença:</strong> <span id="modalDiff">-</span>
            </div>
            <div>
              <strong>Não Seguem:</strong> <span id="modalNotBack">-</span>
            </div>
          </div>
          
          <button 
            onclick="executeSaveAnalysis()"
            style="
              width: 100%;
              padding: 12px;
              background: linear-gradient(135deg, #4f5bd5, #962fbf);
              color: white;
              border: none;
              border-radius: 10px;
              font-weight: 700;
              cursor: pointer;
              font-size: 0.9rem;
              margin-top: 10px;
            "
          >
            💾 Salvar Análise
          </button>
          
          <button 
            onclick="document.getElementById('saveAnalysisModal').classList.remove('open')"
            style="
              width: 100%;
              padding: 12px;
              background: #f5f2f8;
              color: #962fbf;
              border: 1px solid #e6d5f5;
              border-radius: 10px;
              font-weight: 700;
              cursor: pointer;
              font-size: 0.9rem;
            "
          >
            ❌ Depois
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Injeta modal no HTML
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = saveModalHTML;
  document.body.appendChild(modalContainer);
}

/**
 * Abre modal de salvar análise
 * Preenche com dados da análise atual
 */
function openSaveAnalysisModal() {
  // Verifica se usuário tá logado
  if (!currentUser) {
    alert("Faça login para salvar análises!");
    loginWithGoogle();
    return;
  }
  
  // Preenche dados do modal
  document.getElementById('modalFollowing').textContent = fmt(STATE.totalFollowing);
  document.getElementById('modalFollowers').textContent = fmt(STATE.totalFollowers);
  document.getElementById('modalDiff').textContent = (STATE.diff >= 0 ? '+' : '') + fmt(STATE.diff);
  document.getElementById('modalNotBack').textContent = fmt(STATE.notFollowingBack.length);
  
  // Gera título automático com data
  const hoje = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('analysisTitle').value = `Análise de ${hoje}`;
  
  // Abre modal
  document.getElementById('saveAnalysisModal').classList.add('open');
}

/**
 * Executa o salvamento da análise
 * Chamado quando clica em "Salvar Análise"
 */
async function executeSaveAnalysis() {
  const titulo = document.getElementById('analysisTitle').value.trim();
  
  if (!titulo) {
    alert("Digite um nome para a análise");
    return;
  }
  
  // Prepara dados para salvar
  const analysisToSave = {
    totalFollowing: STATE.totalFollowing,
    totalFollowers: STATE.totalFollowers,
    diff: STATE.diff,
    ratio: STATE.ratio,
    notFollowingBack: STATE.notFollowingBack,
    deletedCount: STATE.deletedCount,
    blocked: STATE.blocked || {},
    restricted: STATE.restricted || {},
    closeFriends: STATE.closeFriends || {},
    unfollowedCount: STATE.unfollowedCount,
    removedSuggCount: STATE.removedSuggCount
  };
  
  // Chama função do firebase-auth.js
  await saveAnalysis(titulo, analysisToSave);
  
  // Fecha modal
  document.getElementById('saveAnalysisModal').classList.remove('open');
}

// ====================================================================
// ADICIONAR SEÇÃO "MINHAS ANÁLISES" À TELA INICIAL
// ====================================================================
/**
 * Injetar no HTML da tela de upload
 * Mostra as análises salvas do usuário
 */
function addSavedAnalysesSection() {
  const sectionHTML = `
    <div id="savedAnalysesSection" style="display: none; margin-top: 30px;">
      <h3 style="color: #962fbf; font-size: 1.1rem; margin-bottom: 15px;">
        📊 Minhas Análises Salvas
      </h3>
      
      <div id="analysesListContainer" style="
        background: #fbf4fd;
        border: 1px solid #e6d5f5;
        border-radius: 12px;
        padding: 20px;
        min-height: 100px;
      ">
        <p style="text-align: center; color: #6c6c76;">Carregando análises...</p>
      </div>
    </div>
  `;
  
  const uploadScreen = document.getElementById('uploadScreen');
  if (uploadScreen) {
    uploadScreen.insertAdjacentHTML('beforeend', sectionHTML);
  }
}

// ====================================================================
// ADICIONAR BOTÃO SALVAR AO DASHBOARD
// ====================================================================
/**
 * Adiciona botão "Salvar Análise" ao panel-overview
 * Permite salvar qualquer análise visualizada
 */
function addSaveButtonToDashboard() {
  const overviewPanel = document.getElementById('panel-overview');
  
  if (!overviewPanel) return;
  
  // Cria botão
  const saveBtn = document.createElement('button');
  saveBtn.innerHTML = '💾 Salvar Esta Análise';
  saveBtn.style.cssText = `
    width: 100%;
    padding: 12px;
    margin-top: 20px;
    background: linear-gradient(135deg, #4f5bd5, #962fbf);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    font-size: 0.9rem;
    transition: filter 0.2s;
  `;
  
  saveBtn.addEventListener('mouseover', function() {
    this.style.filter = 'brightness(1.05)';
  });
  
  saveBtn.addEventListener('mouseout', function() {
    this.style.filter = 'brightness(1)';
  });
  
  saveBtn.addEventListener('click', openSaveAnalysisModal);
  
  // Adiciona ao panel
  overviewPanel.appendChild(saveBtn);
}

// ====================================================================
// INICIALIZAÇÃO
// ====================================================================
/**
 * Chamada no arquivo app.js após loadDashboard()
 * Prepara toda a UI de salvar análises
 */
function initSaveAnalysisFeature() {
  addSaveAnalysisUI();
  addSavedAnalysesSection();
  addSaveButtonToDashboard();
}

// Exporta pra uso global
window.openSaveAnalysisModal = openSaveAnalysisModal;
window.executeSaveAnalysis = executeSaveAnalysis;
window.initSaveAnalysisFeature = initSaveAnalysisFeature;
