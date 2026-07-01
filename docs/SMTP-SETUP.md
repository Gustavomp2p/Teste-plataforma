# SMTP customizado — Supabase + Resend (recomendado)

O e-mail padrao do Supabase no plano gratuito tem limite baixo (~2-30 e-mails/hora).  
Com **SMTP proprio** (Resend ou Brevo) voce contorna esse limite para:

- Confirmacao de cadastro
- Recuperacao de senha
- Links magicos

---

## Opcao 1: Resend (recomendado)

### Passo 1 — Criar conta

1. Acesse [resend.com](https://resend.com) e crie conta gratuita
2. No painel, va em **Domains** → **Add Domain**
3. Adicione seu dominio (ex. `seudominio.com.br`) ou use o dominio de teste `onboarding@resend.dev` apenas para desenvolvimento

### Passo 2 — Verificar dominio (producao)

No DNS do seu dominio, adicione os registros que o Resend mostrar (SPF, DKIM).  
Sem dominio verificado, e-mails podem ir para spam.

Para testes rapidos, o Resend permite enviar de `onboarding@resend.dev` para o **seu proprio e-mail** cadastrado.

### Passo 3 — Gerar API Key SMTP

1. Resend → **API Keys** → **Create API Key**
2. Copie a chave (comeca com `re_...`)

Credenciais SMTP do Resend:

| Campo | Valor |
|-------|-------|
| Host | `smtp.resend.com` |
| Porta | `465` (SSL) ou `587` (TLS) |
| Usuario | `resend` |
| Senha | sua API Key (`re_...`) |
| Remetente | `noreply@seudominio.com` ou `onboarding@resend.dev` (teste) |

### Passo 4 — Configurar no Supabase

1. [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto
2. **Project Settings** → **Authentication** → **SMTP Settings**
3. Ative **Enable Custom SMTP**
4. Preencha:

| Campo Supabase | Valor |
|----------------|-------|
| Sender email | `noreply@seudominio.com` |
| Sender name | `Plataforma BFD` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | `re_SUA_API_KEY` |

5. Salve e clique em **Send test email**

### Passo 5 — Templates de e-mail

**Authentication → Email Templates** — revise:

- **Confirm signup** — link aponta para `/auth/callback`
- **Reset password** — link aponta para `/auth/callback?next=/conta/nova-senha`

Em **Authentication → URL Configuration**, confira:

- Site URL: URL do front (Vercel)
- Redirect URLs: `https://SEU-DOMINIO/auth/callback`

---

## Opcao 2: Brevo (alternativa gratuita)

1. Crie conta em [brevo.com](https://www.brevo.com)
2. **SMTP & API** → **SMTP** → copie Host, Porta, Login e Senha SMTP
3. No Supabase, mesma tela **SMTP Settings**, cole os dados do Brevo
4. Remetente: e-mail verificado no Brevo

| Campo | Valor tipico Brevo |
|-------|-------------------|
| Host | `smtp-relay.brevo.com` |
| Porta | `587` |
| Username | seu e-mail Brevo |
| Password | chave SMTP (nao a API key REST) |

---

## Apos configurar

1. Teste cadastro em `/login` → Criar conta
2. Teste **Esqueci minha senha**
3. Se ainda aparecer `email rate limit`, confirme que **Custom SMTP** esta ativo (nao o padrao Supabase)

## Desenvolvimento local (sem SMTP)

Para testar sem esperar e-mail:

1. Supabase → **Authentication → Providers → Email** → desmarque **Confirm email**
2. Backend: `AUTH_REQUIRE_EMAIL_CONFIRM=false` no Render `.env`

Nao use isso em producao.
