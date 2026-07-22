# ✅ CHECKLIST — Colocar EngAIja com Firebase no Ar

Siga **EXATAMENTE** nesta ordem. Não pule passos.

---

## 🟦 FASE 1: PREPARAR ARQUIVOS LOCAIS (10 min)

### 1.1 Baixe os Arquivos
- [ ] `index-updated.html` → Renomear pra `index.html`
- [ ] `style.css` → Já está pronto
- [ ] `app.js` → Já está pronto
- [ ] `firebase-auth.js` → NOVO arquivo
- [ ] `save-analysis.js` → NOVO arquivo

### 1.2 Organizar Repositório Local
```bash
cd seu-repositorio
rm index.html  # Remove o velho
mv index-updated.html index.html  # Renomeia

# Resultado esperado:
ls
# index.html
# style.css
# app.js
# firebase-auth.js (NOVO)
# save-analysis.js (NOVO)
# README.md
# SETUP.md
# FIREBASE-SETUP.md
# INTEGRATION.md
```

### 1.3 Verificar Integridade
- [ ] Todos os 5 arquivos (HTML, CSS, JS, firebase-auth, save-analysis) estão na raiz
- [ ] Nenhuma subpasta (sem `css/`, `js/`, etc)
- [ ] Cada arquivo tem conteúdo (não vazios)

---

## 🟦 FASE 2: FIREBASE SETUP (15 min)

### 2.1 Criar Projeto Firebase
- [ ] Ir em https://console.firebase.google.com
- [ ] Click em "Add Project"
- [ ] Nome: `engaija-app`
- [ ] Aguardar criação

### 2.2 Ativar Google Auth
- [ ] Firebase Console → Authentication
- [ ] Click em "Get Started"
- [ ] Click em "Google"
- [ ] Toggle pra "ON"
- [ ] Click "Save"

### 2.3 Criar Firestore
- [ ] Firebase Console → Firestore Database
- [ ] Click em "Create Database"
- [ ] Selecione país
- [ ] Modo: "Start in test mode"
- [ ] Click "Create"

### 2.4 Configurar Regras Firestore
- [ ] Firestore → Rules tab
- [ ] Copiar regras (de FIREBASE-SETUP.md seção 6.2)
- [ ] Click "Publish"

### 2.5 Pegar Credenciais
- [ ] Firebase Console → Project Settings (engrenagem ⚙️)
- [ ] Descer até "Your web app"
- [ ] Copiar TODA a `firebaseConfig`

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "engaija-app.firebaseapp.com",
  projectId: "engaija-app",
  storageBucket: "engaija-app.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456:web:abcdef..."
};
```

### 2.6 Colar Config no Código
- [ ] Abrir `firebase-auth.js` no editor
- [ ] Procurar por `const firebaseConfig = {`
- [ ] Substituir TODO o bloco `firebaseConfig` pela sua config
- [ ] Salvar arquivo

---

## 🟦 FASE 3: ATUALIZAR index.html (5 min)

### 3.1 Verificar Scripts
Abrir `index.html` e procurar perto do final:

```html
<!-- Deve estar ASSIM -->
<script src="firebase-auth.js"></script>
<script src="save-analysis.js"></script>
<script src="app.js"></script>
```

- [ ] `firebase-auth.js` ANTES de `save-analysis.js`
- [ ] `save-analysis.js` ANTES de `app.js`
- [ ] Todos com `src=` correto (sem `js/`, sem `../`)

### 3.2 Verificar Firebase SDK
Procurar por:
```html
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
```

- [ ] Estão lá?
- [ ] Se não, adicione (cópia do index-updated.html)

---

## 🟦 FASE 4: GIT & DEPLOY (10 min)

### 4.1 Fazer Commit
```bash
git status  # Vê o que mudou

git add .  # Adiciona tudo

git commit -m "feat: add Firebase auth and save analysis"

git push origin main
```

- [ ] Push enviado com sucesso

### 4.2 Vercel Redeploia
- [ ] Ir em https://vercel.com/dashboard
- [ ] Procure seu projeto
- [ ] Espere build terminar (~30 segundos)
- [ ] Status deve ser "Ready"

### 4.3 Testar Site
- [ ] Abrir seu site (https://seu-projeto.vercel.app)
- [ ] Página carrega sem erros?
- [ ] Abrir Console (F12) — tem erros em vermelho?

---

## 🟦 FASE 5: TESTAR FUNCIONALIDADES (10 min)

### 5.1 Testar Login
- [ ] Click em "🔑 Login com Google"
- [ ] Popup Google abre?
- [ ] Escolhe sua conta Google
- [ ] Volta pro site logado?
- [ ] Mostra seu nome e email?

**Se não funcionar:**
- Abrir Console (F12)
- Ler erro vermelho
- Procurar em FIREBASE-SETUP.md → "Problemas Comuns"

### 5.2 Testar Upload
- [ ] Click em "Escolher arquivo .zip"
- [ ] Selecionar ZIP do Instagram
- [ ] Upload processa?
- [ ] Dashboard renderiza?
- [ ] Gráficos aparecem?

### 5.3 Testar Salvar Análise
- [ ] Procurar botão "💾 Salvar Esta Análise"
- [ ] Clicar nele
- [ ] Modal abre?
- [ ] Preencher nome (ex: "Análise de Julho")
- [ ] Clicker "Salvar Análise"
- [ ] Alert "✅ Análise salva com sucesso"?

**Se não funcionar:**
- Verificar se tá logado
- Verificar Console (F12) por erros

### 5.4 Testar Carregar Análise Salva
- [ ] Scrollar pra cima
- [ ] Procurar "📊 Minhas Análises Salvas"
- [ ] Vê a análise que salvou?
- [ ] Clicar nela
- [ ] Dashboard carrega os dados salvos?

**Se não funcionar:**
- Verificar Firestore Console
- Procurar por collection `usuarios` → seu UID → `analises`

### 5.5 Testar Logout
- [ ] Clicker em "🚪 Logout"
- [ ] Página recarrega?
- [ ] Botão de logout desaparece?
- [ ] Botão de login volta?

---

## 🟦 FASE 6: VERIFICAR FIRESTORE (5 min)

### 6.1 Abrir Firestore Console
- [ ] Firebase Console → Firestore Database
- [ ] Click em "Collection" tab
- [ ] Procurar por `usuarios`

### 6.2 Ver Seus Dados
```
usuarios/
  └── {seu-uid}/
      ├── nome: "Seu Nome"
      ├── email: "seu-email@gmail.com"
      └── analises/
          └── {doc-id}/
              ├── titulo: "Análise de Julho"
              ├── data: 2026-07-20
              ├── totalSeguindo: 1193
              └── ...
```

- [ ] Documento `usuarios/{seu-uid}` existe?
- [ ] Tem collection `analises`?
- [ ] Tem documento com sua análise?

---

## 🟦 FASE 7: TESTES FINAIS (5 min)

### 7.1 Testar em Diferentes Cenários
- [ ] Logout completo
- [ ] Fechar abas/janela
- [ ] Abrir site de novo
- [ ] Fazer login novamente
- [ ] "Minhas Análises" mostra análise de antes?

### 7.2 Testar Mobile
- [ ] Abrir site no celular
- [ ] Login funciona?
- [ ] Upload funciona?
- [ ] Interface fica responsiva?

### 7.3 Testar Exportar
- [ ] Click em "⬇ Exportar dados"
- [ ] Click em "📄 Relatório (PDF)"
- [ ] Arquivo baixa?
- [ ] PDF abre?

---

## ✅ SUCESSO!

Se chegou aqui e tudo funcionou:

```
✅ Login com Google funciona
✅ Análises salvam no Firestore
✅ Análises carregam quando volta
✅ Logout funciona
✅ PDF exporta
✅ Site tá online no Vercel
```

**Parabéns! 🎉**

---

## 🆘 PRESO EM ALGO?

### Checklist de Debug
1. Abra Console (F12 → Console)
2. Copie o erro vermelho EXATAMENTE
3. Procure em:
   - FIREBASE-SETUP.md → "Problemas Comuns"
   - INTEGRATION.md → "Possíveis Erros"
   - README.md → "Troubleshooting"

### Se Ainda Não Achar
1. Tire screenshot do erro
2. Verifique:
   - Todos os arquivos estão na raiz? (sem subpastas)
   - Firebase config tá certo? (copiei inteiro?)
   - Google Auth tá "ON" no Firebase?
   - Firestore foi criado?
   - Regras do Firestore foram publicadas?

### Próximo Passo
- Releia FIREBASE-SETUP.md seção 6 (Regras)
- Releia INTEGRATION.md seção 12 (Erros)

---

## 📝 Anotações Pessoais

Espaço pra você anotar:

```
Firebase Project ID: __________________
Firebase API Key: __________________
Seu UID no Firebase: __________________
URL do seu site: __________________
```

---

**Boa sorte! Qualquer dúvida, releia os 3 docs em ordem:**
1. FIREBASE-SETUP.md
2. INTEGRATION.md
3. README.md

🚀
