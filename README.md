# EngAIja — Dashboard de Análise Instagram com Firebase

**A IA que revela o que seus dados escondem** 🚀

Analise sua audiência no Instagram usando apenas seu arquivo oficial + Login com Google + Salve suas análises.

---

## 📋 O Que É

- **Upload de ZIP**: Suba o arquivo do Instagram (obtém automaticamente)
- **Análise Local**: Tudo roda no seu navegador (sem enviar dados)
- **Login Google**: Faça login com sua conta Google
- **Salvar Análises**: Guarde histórico de análises no Firestore
- **PDF/CSV**: Exporte relatórios completos
- **7 Abas**: Visão geral, privacidade, atividade, interações, perfil, plano de ação

---

## 📁 Estrutura de Arquivos

```
seu-repositorio/
├── index-updated.html          ← Renomear para: index.html
├── style.css                   ← CSS (29 KB)
├── app.js                       ← JavaScript original (74 KB)
├── firebase-auth.js             ← NOVO: Login + Firestore (13 KB)
├── save-analysis.js             ← NOVO: Salvar análises (8 KB)
├── FIREBASE-SETUP.md            ← Guia Firebase
├── SETUP.md                     ← Guia Vercel
└── README.md                    ← Este arquivo
```

---

## 🚀 Como Começar (Rápido)

### Pré-requisitos
- ✅ Conta GitHub
- ✅ Vercel conectado ao GitHub
- ✅ Conta Google (pra Firebase e login)

### Passo 1: Setup Firebase (5 min)
1. Siga **FIREBASE-SETUP.md** até a seção 6.3
2. Copie credenciais Firebase
3. Cole em `firebase-auth.js` (linha ~14)

### Passo 2: Renomear HTML
```bash
# No seu repositório local
mv index-updated.html index.html
git add .
git commit -m "feat: add Firebase"
git push
```

### Passo 3: Aguardar Deploy
- Vercel redeploia automaticamente (~30s)
- Abra seu site

### Passo 4: Testar
1. Clique em "🔑 Login com Google"
2. Escolha sua conta Google
3. Upload um ZIP
4. Veja botão "💾 Salvar Esta Análise"
5. Salve a análise
6. Recarregue a página
7. Veja em "📊 Minhas Análises Salvas"

---

## 🔑 Login e Autenticação

### Como Funciona

1. **Usuário clica "Login com Google"**
   - Abre popup do Google
   - Autentica com sua conta
   - Firebase gera token de sessão

2. **Sessão Mantida**
   - Mesmo ao recarregar a página, você continua logado
   - Sua sessão dura até fazer logout

3. **Dados Salvos**
   - Cada análise é vinculada ao seu UID (ID único)
   - Ninguém consegue ver as análises de outro usuário

---

## 💾 Como Salvar Análises

### Processo Completo

```
1. Faz Login
   ↓
2. Upload ZIP do Instagram
   ↓
3. Processa análise (gráficos, números)
   ↓
4. Clica em "💾 Salvar Esta Análise"
   ↓
5. Nomeia (ex: "Análise de Julho 2026")
   ↓
6. Salva no Firestore
   ↓
7. Aparece em "Minhas Análises Salvas"
```

### O Que É Salvo

**NÃO** é salvo:
- ❌ O arquivo ZIP inteiro
- ❌ Dados brutos do Instagram
- ❌ Senhas ou tokens

**É salvo:**
- ✅ Números (seguindo, seguidores, diferença)
- ✅ Taxa de retorno
- ✅ Quem não segue de volta
- ✅ Contas deletadas/bloqueadas
- ✅ Data da análise

Exemplo:
```json
{
  "titulo": "Análise de Julho 2026",
  "data": "2026-07-20",
  "totalSeguindo": 1193,
  "totalSeguidores": 6,
  "diferenca": -1187,
  "naoSeguemVolta": 1187,
  "deletadas": 45
}
```

---

## 📊 Banco de Dados (Firestore)

### Estrutura

```
usuarios/
  └── {userId}/                     ← Seu ID único
      ├── nome: "João Silva"
      ├── email: "joao@gmail.com"
      ├── fotoPerfil: "https://..."
      └── analises/                 ← Sua coleção de análises
          ├── {docId1}/
          │   ├── titulo: "Análise 1"
          │   ├── data: 2026-07-20
          │   └── ...
          ├── {docId2}/
          │   ├── titulo: "Análise 2"
          │   └── ...
          └── ...
```

### Segurança

Firestore tem regras que garantem:
- Você só acessa seus próprios dados
- Outros usuários não conseguem ver suas análises
- Dados são criptografados em trânsito

---

## 🔐 Privacidade

### Garantias

✅ **Seu arquivo ZIP nunca sai do seu navegador**
- Upload é processado 100% localmente
- Nada é enviado pra nossos servidores

✅ **Senhas nunca são solicitadas**
- Usamos autenticação Google (OAuth)
- Você nunca nos dá sua senha

✅ **Dados de análise são privados**
- Firestore tem regras de segurança
- Você só vê suas análises

---

## 🐛 Troubleshooting

### Problema: "Firebase is not defined"

**Causa:** Arquivos de script tão carregando em ordem errada

**Solução:**
1. Verifique `index.html` (linha ~33-35)
2. Ordem deve ser:
   ```html
   <script src="firebase-auth.js"></script>
   <script src="save-analysis.js"></script>
   <script src="app.js"></script>
   ```

### Problema: Login não funciona

**Causa:** Firebase config errada ou Google não ativado

**Solução:**
1. Verifique `firebase-auth.js` linha ~14 (está a config certa?)
2. Verifique Firebase Console → Authentication → Google está "ON"?

### Problema: Salvar análise não funciona

**Causa:** Firestore não criado ou regras erradas

**Solução:**
1. Verifique Firestore → "Create Database" feito?
2. Verifique Rules → estão corretas? (FIREBASE-SETUP.md seção 6.2)

### Problema: Site fica em branco ao carregar

**Causa:** Erro no JavaScript

**Solução:**
1. Abra F12 → Console
2. Veja a mensagem de erro
3. Procure em "Troubleshooting" acima

---

## 📈 Funcionalidades

### Visão Geral
- 📊 Gráfico de seguindo vs seguidores
- 📊 Gráfico de atividade
- 💡 Insights automáticos
- 📅 Data da análise

### Não Seguem de Volta
- 🔍 Procurar por username
- 🔗 Filtros (todos, deletadas, ativas)
- 📄 Paginação (15 por página)
- 💾 Lista completa em CSV

### Privacidade
- 🚫 Bloqueados
- ⛔ Restringidos
- 💚 Melhores amigos
- 🙈 Ocultos de story

### Atividade
- ❤️ Posts curtidos
- 📌 Posts salvos
- 📸 Histórias vistas
- 🔄 Repostagens

### Interações
- 😍 Reações em stories
- ❤️ Curtidas em stories
- 🗳️ Votos em enquetes
- 💬 Mensagens secretas

### Perfil
- 📋 Informações da conta
- 📍 Dados pessoais
- 🔐 Histórico de login
- 📝 Data de inscrição

### Plano de Ação
- 📋 Checklist de ações recomendadas
- 🎯 Estratégias de engajamento
- 💡 Dicas e insights

---

## 🎨 Customização

### Mudar Cores
Em `style.css`, procure por:
```css
--ig1: #4f5bd5;
--ig2: #962fbf;
--ig3: #d62976;
--ig4: #fa7e1e;
--ig5: #feda75;
```

### Mudar Textos
Em `index.html`, procure por `data-i18n` (tem tradução PT/EN pronta)

### Adicionar Mais Dados
Em `firebase-auth.js`, função `saveAnalysis()`:
```javascript
// Adicione aqui
analysisData.meuCampo = valor;
```

---

## 🚀 Deploy

### GitHub
```bash
git add .
git commit -m "feat: Firebase auth and save analysis"
git push origin main
```

### Vercel
- Conecta automaticamente ao GitHub
- Redeploia a cada push (~30s)
- URL: `https://seu-projeto.vercel.app`

### Custom Domain
- Vercel → Settings → Domains
- Adicione seu domínio customizado

---

## 📞 Suporte

### Antes de Contatar
1. ✅ Verifique Console (F12)
2. ✅ Leia "Troubleshooting" acima
3. ✅ Verifique FIREBASE-SETUP.md
4. ✅ Verifique SETUP.md

### Info Útil ao Relatar Bug
```
- Erro exato do Console
- Screenshot da tela
- Qual aba estava usando
- Se é no desktop ou mobile
```

---

## 📜 Licença

Código aberto para uso pessoal e comercial.

---

## 🎯 Roadmap

### ✅ Pronto Agora
- Login com Google
- Salvar análises
- Visualizar análises antigas
- Exportar PDF/CSV

### 🔜 Em Desenvolvimento
- Deletar análises
- Editar título de análises
- Comparar 2 análises
- Gráficos de progresso ao longo do tempo
- Compartilhar análises (link público)
- Premium features

---

## 💡 Tips

1. **Obtenha o arquivo oficial**
   - Vai em: https://accountscenter.instagram.com/info_and_permissions/dyi/
   - Selecione "Conexões" (mais rápido)

2. **Faça login ANTES de processar**
   - Isso permite salvar a análise depois

3. **Nomeie suas análises**
   - Facilita procurar depois

4. **Exporte regularmente**
   - Mantenha cópia localmente também

---

## 🤝 Contribuir

Se quer melhorar:
1. Faça fork do repositório
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Commit: `git commit -m "Add: sua feature"`
4. Push: `git push origin feature/sua-feature`
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para entender melhor sua rede social**

v2.0.0 — Com Firebase Auth & Save Analysis

---

## 📚 Leia Também

- [FIREBASE-SETUP.md](FIREBASE-SETUP.md) — Como configurar Firebase
- [SETUP.md](SETUP.md) — Como fazer deploy no Vercel
