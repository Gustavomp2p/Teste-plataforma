# Deploy — Vercel (frontend) + Render (backend)

## Visão geral

| Serviço | Plataforma | Pasta |
|---------|------------|-------|
| Next.js (landing + painel) | **Vercel** | `frontend/` |
| FastAPI | **Render** | `backend/` |
| Banco + Auth | **Supabase** | já configurado |

Integração com **GitHub**: conecte o repositório `conectaecapacita/plataforma-projetos-bfd` em cada plataforma.

---

## 1. Vercel (frontend)

1. [vercel.com](https://vercel.com) → importe o repo `conectaecapacita/plataforma-projetos-bfd`
2. **Root Directory:** `frontend`
3. **Environment Variables:**

| Variável | Valor |
|----------|-------|
| `API_URL` | URL do backend no Render (ex: `https://plataforma-bfd-api.onrender.com`) — **sem barra no final** |
| `API_KEY` | Mesma do backend (somente ASCII, sem espacos) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eexyhqvpgbdkzjtfraaw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key do Supabase |
| `NEXT_PUBLIC_ALLOW_SIGNUP` | `true` |

4. Deploy → **Redeploy** apos alterar variaveis

### Supabase — URLs de producao

- **Site URL:** `https://SEU-APP.vercel.app`
- **Redirect URLs:** `https://SEU-APP.vercel.app/auth/callback`

## 2. Render (backend)

1. [render.com](https://render.com) → **Blueprint** ou Web Service
2. **Root Directory:** `backend` (obrigatorio — senao falha `requirements.txt`)
3. Secrets:

| Variável | Exemplo |
|----------|---------|
| `DATABASE_URL` | Connection string Session Pooler do Supabase |
| `API_KEY` | Igual ao Vercel |
| `CORS_ORIGINS` | `https://SEU-APP.vercel.app` |
| `SUPABASE_URL` | `https://eexyhqvpgbdkzjtfraaw.supabase.co` (**sem** `/rest/v1`) |
| `SUPABASE_ANON_KEY` | Publishable key |
| `PYTHON_VERSION` | `3.11.9` |

4. Apos deploy, copie a URL publica para `API_URL` na Vercel e faca **Redeploy**

---

## 3. Login / e-mails (erro de limite)

O Supabase gratuito limita e-mails quando usa o SMTP padrao. Solucao: **`docs/SMTP-SETUP.md`** (Resend recomendado).

Alternativas em dev:

1. Desative **Confirm email** no Supabase
2. `AUTH_REQUIRE_EMAIL_CONFIRM=false` no Render
3. Crie usuarios em **Authentication → Users** (sem enviar e-mail)

---

## 4. Checklist pos-deploy

- [ ] `SUPABASE_URL` no Render **sem** `/rest/v1`
- [ ] `CORS_ORIGINS` com URL da Vercel
- [ ] Redirect URL no Supabase apontando para `/auth/callback`
- [ ] Migration `002_auth_supabase.sql` aplicada
- [ ] Pelo menos um admin em `usuarios_admin` com `auth_user_id`
