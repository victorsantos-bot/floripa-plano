# Floripa Mais Aprendizagem — Sistema de Acompanhamento

## Pré-requisitos
- Node.js 18+ instalado ([nodejs.org](https://nodejs.org))
- Conta no Supabase ([supabase.com](https://supabase.com)) — gratuita
- Conta no Netlify ([netlify.com](https://netlify.com)) — gratuita

---

## Passo 1: Configurar o Supabase

1. Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard)
   - Nome: `floripa-mais-aprendizagem`
   - Região: **South America (São Paulo)**
   - Defina uma senha para o banco

2. Vá em **SQL Editor** e cole o conteúdo do arquivo `supabase/schema.sql`. Execute.

3. Vá em **Authentication > Users > Add user > Create new user**
   - Email: `admin@educacao.pmf.sc.gov.br` (ou o email do admin)
   - Senha: defina uma senha forte
   - Marque ✅ **Auto Confirm User**

4. Anote as credenciais em **Settings > API**:
   - `Project URL`
   - `anon public` key

---

## Passo 2: Configurar o projeto local

```bash
# Clone ou copie este diretório
cd floripa-plano

# Instale dependências
npm install

# Crie o arquivo .env
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Passo 3: Testar localmente

```bash
npm run dev
```

Acesse `http://localhost:5173`. O sistema deve carregar com os dados do Supabase.

---

## Passo 4: Deploy no Netlify

### Opção A — Via GitHub (recomendado)

1. Suba o projeto no GitHub (sem o `.env`!)
2. No Netlify, clique em **Add new site > Import from Git**
3. Selecione o repositório
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Em **Site settings > Environment variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Faça re-deploy

### Opção B — Via CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## Estrutura do Projeto

```
floripa-plano/
├── package.json          # Dependências
├── vite.config.js        # Config do Vite
├── netlify.toml          # Config do Netlify
├── .env.example          # Template de variáveis
├── index.html            # HTML de entrada
├── public/
│   └── Plano_Estrategico...pdf  # PDF do documento
├── src/
│   ├── main.jsx          # Entry point React
│   ├── index.css         # CSS global
│   ├── supabaseClient.js # Cliente Supabase
│   └── App.jsx           # Aplicação completa
└── supabase/
    └── schema.sql        # Schema do banco
```

---

## Perfis de Acesso

| | Visualizador | Admin |
|---|---|---|
| Ver tudo | ✅ | ✅ |
| Filtrar e navegar | ✅ | ✅ |
| Editar marcos | ❌ | ✅ |
| Incluir novos marcos | ❌ | ✅ |
| Inserir resultados | ❌ | ✅ |

---

## Custo: R$ 0/mês
Supabase Free + Netlify Free atendem o volume necessário.
