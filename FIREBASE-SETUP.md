# 🔥 Setup Firebase - Login Google + Salvar Análises

## O Que Você Vai Fazer

1. **Criar projeto Firebase** (grátis)
2. **Habilitar autenticação Google**
3. **Habilitar Firestore** (banco de dados)
4. **Pegar credenciais** e colocar no código
5. **Testar login**

---

## 🚀 Passo 1: Criar Projeto Firebase

### 1.1 Ir pra Firebase Console
- Acesse: https://console.firebase.google.com
- Clique em **"Add project"** (ou "Criar projeto")

### 1.2 Nomear o Projeto
```
Nome: engaija-app
Selecione seu país
Clique em "Create project"
```

### 1.3 Aguardar
Firebase vai criar o projeto (leva ~2 minutos)

---

## 🔑 Passo 2: Pegar Credenciais do Projeto

### 2.1 Ir em Project Settings
1. Na página inicial do Firebase
2. Clique na engrenagem ⚙️ → **Project Settings**

### 2.2 Copiar Config
Procure por **"Your web app"** ou **"Web"**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 2.3 Copie TUDO isso

---

## 📋 Passo 3: Colar Config no Código

### 3.1 Abra `firebase-auth.js`

Procure por:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxx",
  // ... resto
};
```

### 3.2 Substitua pelos dados do Firebase
Cole a config que copiou no lugar da que tá lá

**Antes:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com",
  // ...
};
```

**Depois:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...seu-verdadeiro-api-key...",
  authDomain: "engaija-app.firebaseapp.com",
  projectId: "engaija-app",
  // ...
};
```

---

## 🔓 Passo 4: Habilitar Autenticação Google

### 4.1 Ir em Authentication
1. No Firebase Console
2. Clique em **"Authentication"** (ou "Autenticação")
3. Clique em **"Get Started"**

### 4.2 Ativar Google
1. Na lista de provedores, procure por **Google**
2. Clique nele
3. Ative o toggle (mude pra "ON")
4. Clique em **"Save"**

### 4.3 Pronto!
Google authentication tá ativo

---

## 💾 Passo 5: Habilitar Firestore

### 5.1 Ir em Firestore
1. No Firebase Console
2. Clique em **"Firestore Database"** (ou "Banco de Dados")

### 5.2 Criar Database
1. Clique em **"Create Database"**
2. Selecione seu país
3. Modo: **"Start in test mode"** (pra começar)
4. Clique em **"Create"**

### 5.3 Esperar
Firestore vai criar (leva ~30 segundos)

---

## 🔒 Passo 6: Configurar Segurança (Importante!)

### 6.1 Ir em Regras
1. No Firestore
2. Clique na aba **"Rules"**

### 6.2 Copiar Regras Seguras
Substitua tudo que tá lá por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários: só leem/escrevem a si mesmo
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Análises: só o dono pode acessar
      match /analises/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

### 6.3 Publicar Regras
Clique em **"Publish"**

---

## 📁 Passo 7: Estrutura de Arquivos

Você vai ter esses 5 arquivos na raiz:

```
index.html           ← HTML (RENOMEAR de index-updated.html)
style.css            ← Estilos (mesma coisa)
app.js               ← JavaScript original (mesma coisa)
firebase-auth.js     ← NOVO: Login + Firestore
save-analysis.js     ← NOVO: Salvar análises
```

---

## ✅ Passo 8: Testar

### 8.1 Fazer Deploy
```bash
git add .
git commit -m "feat: add Firebase auth and save analysis"
git push
```

### 8.2 Abrir seu Site
```
https://seu-projeto.vercel.app
```

### 8.3 Clicar em "Login com Google"
- Escolher conta Google
- Deve redirecionar pro site logado

### 8.4 Fazer Upload de um ZIP
- Processar análise
- Ver botão "💾 Salvar Esta Análise"
- Clicar e salvar

### 8.5 Verificar no Firebase
1. Ir em Firestore Console
2. Procurar por `usuarios` → seu UID
3. Deve ter collection `analises` com dados

---

## 🐛 Problemas Comuns

### ❌ "Firebase is not defined"
**Causa:** Firebase SDK não carregou
**Solução:** Verificar se os `<script>` do Firebase tão no `index.html`

### ❌ "Auth provider Google is not registered"
**Causa:** Google não foi ativado
**Solução:** Ir em Authentication → Ativar Google

### ❌ Usuário loga mas não salva
**Causa:** Firestore não tá habilitado
**Solução:** Ir em Firestore → "Create Database"

### ❌ "Permission denied" ao salvar
**Causa:** Regras do Firestore erradas
**Solução:** Verificar se as Rules tão corretas (seção 6.2)

---

## 📊 O Que Acontece Quando Salva

Quando você clica "Salvar Análise", isso é salvo no Firestore:

```javascript
{
  titulo: "Análise de Julho 2026",
  data: 2026-07-20,
  totalSeguindo: 1193,
  totalSeguidores: 6,
  diferenca: -1187,
  taxa: 0.00503,
  naoSeguemVolta: 1187,
  deletadas: 0,
  bloqueados: 0,
  restringidos: 0,
  // ... mais dados
}
```

**Importante:** O arquivo ZIP nunca é salvo, só os números/resultados!

---

## 🎯 Próximos Passos

1. ✅ Fazer login
2. ✅ Processar análise
3. ✅ Salvar análise
4. ✅ Ver em "Minhas Análises Salvas"
5. ✅ Clicar pra carregar análise antiga
6. ✅ Exportar PDF/CSV

---

## 📞 Se Travar em Algo

1. Verifique o Console (F12 → Console)
2. Leia a mensagem de erro
3. Procure na seção "Problemas Comuns" acima
4. Se não achar, avise qual é o erro exato

**Boa sorte!** 🚀
