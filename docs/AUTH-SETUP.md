# Auth Supabase — cadastro público e níveis de acesso

## Papéis

| Papel | Acesso |
|-------|--------|
| `usuario` | Padrão no cadastro; painel em `/conta` |
| `analista` | Admin; projetos das categorias vinculadas |
| `coordenador` | Admin; todos os projetos e empresas |
| `super_admin` | Acesso total + gestão de admins |

Categorias padrão: Automação, Sistema web, App mobile, Dados e IA, Outro.

## 1. Supabase Dashboard

### E-mail

1. **Authentication → Providers → Email** — habilite
2. Em desenvolvimento, pode desmarcar **Confirm email** para testar mais rápido

### Google e Facebook

1. **Authentication → Providers → Google** — habilite e configure Client ID / Secret (Google Cloud Console)
2. **Authentication → Providers → Facebook** — habilite e configure App ID / Secret (Meta for Developers)
3. Em ambos, use a mesma **Redirect URL** do Supabase (exibida na tela do provider)

### URLs

**Authentication → URL Configuration**:

- Site URL: `http://localhost:3000` (ou URL de produção)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://SEU-DOMINIO.vercel.app/auth/callback` (produção)

### API

**Settings → API** — copie URL e **Publishable key** para `.env` / `.env.local`

## 2. Migrations

```bash
cd backend
python scripts/apply_migration.py   # 001 se ainda não aplicou
# Cole e execute no SQL Editor do Supabase:
#   migrations/002_auth_supabase.sql
#   migrations/003_usuario_role.sql
python scripts/verify_schema.py
```

## 3. Primeiro administrador

Usuários comuns se cadastram em `/login` (e-mail, Google ou Facebook) e entram em `/conta`.

Para promover alguém a admin:

1. A pessoa cria conta em `/login` (ou você cria em **Authentication → Users**)
2. Copie o **User UID** (UUID)
3. Vincule ou atualize o perfil:

```bash
python scripts/seed_admin.py \
  --email admin@seudominio.com \
  --nome "Admin BFD" \
  --auth-user-id SEU-UUID-AQUI \
  --papel super_admin
```

Analista por categoria:

```bash
python scripts/seed_admin.py \
  --email analista@exemplo.com \
  --nome "Analista Web" \
  --auth-user-id UUID \
  --papel analista \
  --categorias sistema_web,automacao
```

## 4. Variáveis de ambiente

**backend/.env**

```env
SUPABASE_URL=https://eexyhqvpgbdkzjtfraaw.supabase.co
SUPABASE_ANON_KEY=sua_publishable_key
```

> **Importante:** `SUPABASE_URL` é a URL **base** do projeto. **Não** use `/rest/v1` no final.

**frontend/.env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=https://eexyhqvpgbdkzjtfraaw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key
NEXT_PUBLIC_ALLOW_SIGNUP=true
```

`NEXT_PUBLIC_ALLOW_SIGNUP=false` desliga apenas o cadastro por e-mail na UI (OAuth continua se habilitado no Supabase).

Deploy: ver `docs/DEPLOY.md` (Vercel + Render).

## 5. Fluxo

1. Qualquer pessoa acessa `/login` → entra ou cria conta (e-mail, Google ou Facebook)
2. Após login, o frontend chama `/api/auth/sync` e o backend cria/atualiza o perfil com papel `usuario`
3. Usuários comuns vão para `/conta`; admins para `/dashboard`
4. `/dashboard/*` exige papel admin; usuários comuns são redirecionados para `/conta`
5. Frontend envia JWT ao FastAPI (`Authorization: Bearer`); backend valida com Supabase
