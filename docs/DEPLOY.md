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

1. [vercel.com](https://vercel.com) → **Add New Project** → importe o repo do GitHub
2. **Root Directory:** `frontend`
3. Framework: Next.js (detectado automaticamente)
4. **Environment Variables:**

| Variável | Valor |
|----------|-------|
| `API_URL` | URL do backend no Render (ex: `https://plataforma-bfd-api.onrender.com`) |
| `API_KEY` | Mesma do backend |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eexyhqvpgbdkzjtfraaw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key do Supabase |
| `NEXT_PUBLIC_ALLOW_SIGNUP` | `false` (recomendado) |

5. Deploy

### Supabase — URLs de produção

**Authentication → URL Configuration:**

- **Site URL:** `https://SEU-APP.vercel.app`
- **Redirect URLs:** `https://SEU-APP.vercel.app/auth/callback`

---

## 2. Render (backend)

1. [render.com](https://render.com) → **New +** → **Blueprint** (ou Web Service)
2. Conecte o repo; use o arquivo `render.yaml` na raiz
3. Preencha secrets no painel:

| Variável | Exemplo |
|----------|---------|
| `DATABASE_URL` | Connection string Session Pooler do Supabase |
| `API_KEY` | Chave longa (igual ao frontend) |
| `CORS_ORIGINS` | `https://SEU-APP.vercel.app` |
| `SUPABASE_URL` | `https://eexyhqvpgbdkzjtfraaw.supabase.co` (**sem** `/rest/v1`) |
| `SUPABASE_ANON_KEY` | Publishable key |

4. Após deploy, copie a URL pública para `API_URL` na Vercel

---

## 3. Login / e-mails (erro de limite)

O Supabase gratuito envia **~2 e-mails/hora**. Para evitar `email rate limit exceeded`:

1. Mantenha `NEXT_PUBLIC_ALLOW_SIGNUP=false` — crie usuários em **Supabase → Authentication → Users**
2. Vincule com `python scripts/seed_admin.py`
3. Ou configure **SMTP customizado** em Authentication → SMTP
4. Em dev: desative **Confirm email** temporariamente e use `AUTH_REQUIRE_EMAIL_CONFIRM=false` no backend

---

## Checklist pós-deploy

- [ ] `SUPABASE_URL` no Render **sem** `/rest/v1`
- [ ] `CORS_ORIGINS` com URL da Vercel
- [ ] Redirect URL no Supabase apontando para `/auth/callback`
- [ ] Migration `002_auth_supabase.sql` aplicada
- [ ] Pelo menos um admin em `usuarios_admin` com `auth_user_id`
