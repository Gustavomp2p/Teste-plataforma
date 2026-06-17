# Auth Supabase — painel administrativo

## Papéis

| Papel | Acesso |
|-------|--------|
| `super_admin` | Tudo + gestão de admins |
| `coordenador` | Todos os projetos e empresas |
| `analista` | Apenas projetos das categorias vinculadas |

Categorias padrão: Automação, Sistema web, App mobile, Dados e IA, Outro.

## 1. Supabase Dashboard

1. **Authentication → Providers → Email** — habilite e marque **Confirm email**
2. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (ou produção)
   - Redirect URLs: `http://localhost:3000/auth/callback`
3. **Settings → API** — copie URL e **Publishable key** para `.env` / `.env.local`

## 2. Migrations

```bash
cd backend
python scripts/apply_migration.py   # 001 se ainda não aplicou
# Cole e execute migrations/002_auth_supabase.sql no SQL Editor
python scripts/verify_schema.py
```

## 3. Primeiro administrador

1. Crie o usuário em **Authentication → Users → Add user** (ou cadastre em `/login`)
2. Copie o **User UID** (UUID)
3. Vincule o perfil:

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

**frontend/.env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=https://eexyhqvpgbdkzjtfraaw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key
API_URL=http://localhost:8000
```

## 5. Fluxo

1. Usuário acessa `/login` → entra ou cria conta
2. E-mail de confirmação (signup)
3. Proxy protege `/dashboard/*`
4. Frontend envia JWT ao FastAPI (`Authorization: Bearer`)
5. Backend valida com Supabase e aplica escopo por categoria
