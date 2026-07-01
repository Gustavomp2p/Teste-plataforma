# Auth Supabase — cadastro publico e niveis de acesso

## Papeis (3 niveis para o usuario)

| Nivel | Papel no banco | Painel |
|-------|----------------|--------|
| Usuario | `usuario` | `/conta` |
| Empresa | `empresa` | `/empresa` |
| Admin | `super_admin`, `coordenador`, `analista` | `/dashboard` |

Cadastro **Empresa**: em `/login` → Criar conta → tipo **Empresa**. O sistema vincula automaticamente se o e-mail ja existir em `empresas`.

## 1. Supabase Dashboard

### E-mail

1. **Authentication → Providers → Email** — habilite
2. **Authentication → Email Templates** — confira template de recuperacao de senha
3. Em desenvolvimento, pode desmarcar **Confirm email** para testar mais rapido

### Google (login social)

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth Client ID (Web)
2. **Authorized redirect URI**: copie de **Supabase → Authentication → Providers → Google**
3. **Supabase → Authentication → Providers → Google** — habilite, cole Client ID e Secret
4. Salve

### URLs

**Authentication → URL Configuration**:

- Site URL: URL do front (ex. `https://frontend-peach-two-24.vercel.app`)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://SEU-DOMINIO.vercel.app/auth/callback`

## 2. Migrations

Execute no SQL Editor do Supabase (na ordem):

- `migrations/002_auth_supabase.sql`
- `migrations/003_usuario_role.sql`
- `migrations/004_empresa_role.sql`

## 3. Promover papeis

**Admin:**

```bash
python scripts/seed_admin.py \
  --email admin@seudominio.com \
  --nome "Admin BFD" \
  --auth-user-id SEU-UUID \
  --papel super_admin
```

**Empresa** (apos criar conta no login):

```bash
python scripts/seed_admin.py \
  --email empresa@exemplo.com \
  --nome "Empresa XYZ" \
  --auth-user-id UUID \
  --papel empresa
```

## 4. Variaveis de ambiente

Ver `docs/DEPLOY.md` para Vercel (front) e Render (back).

## 5. Fluxo

1. `/login` — e-mail, Google ou recuperar senha
2. Apos login → `/api/auth/sync` cria perfil com papel `usuario` ou `empresa`
3. Sessao persiste em cookie — ao voltar ao site, header mostra **Ola, {nome}**
4. JWT enviado ao FastAPI no Render (`Authorization: Bearer`)
