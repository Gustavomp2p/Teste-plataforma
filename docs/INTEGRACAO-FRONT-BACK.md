# Integração Frontend ↔ Backend — Plataforma BFD

Documento para alinhar o time (front + back). Versão resumida para copiar no WhatsApp/Discord está no final.

---

## Visão geral

```text
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Navegador      │  HTTP   │  Next.js        │  HTTP   │  FastAPI        │
│  (usuário)      │ ──────► │  (frontend)     │ ──────► │  (backend)      │
│  localhost:3000 │         │  localhost:3000 │         │  localhost:8000 │
└─────────────────┘         └─────────────────┘         └────────┬────────┘
                                                                   │
                                                                   ▼
                                                          ┌─────────────────┐
                                                          │  PostgreSQL     │
                                                          │  (Supabase)     │
                                                          └─────────────────┘
```

O **navegador não fala direto com o banco**. Tudo passa pela API FastAPI.

---

## Duas “portas” na API

| Tipo | Quem usa | Autenticação | Exemplos |
|------|----------|--------------|----------|
| **Público** | Landing (formulário da empresa) | Nenhuma | `POST /empresas/`, `POST /projetos/` |
| **Painel** | Dashboard interno | Header `X-API-Key` | `GET /empresas/`, `PATCH /projetos/{id}/status` |

A chave (`API_KEY`) fica **só no servidor** do Next.js (`.env.local`), nunca em `NEXT_PUBLIC_*`.

---

## Fluxo 1 — Empresa cadastra desafio (landing)

1. Usuário preenche o formulário em `/` (seção cadastro).
2. Front envia **POST** `http://localhost:8000/empresas/` com JSON:
   - `nome`, `cnpj`, `email`, `telefone?`, `descricao?`
3. API responde `{ "id": 1, "message": "..." }`.
4. Front envia **POST** `http://localhost:8000/projetos/` com:
   - `titulo`, `descricao`, `tecnologias?`, `empresa_id` (id do passo 3)
5. API confirma cadastro do projeto.

**Recomendação de implementação no Next.js:** criar rotas em `app/api/...` que repassam para o FastAPI — assim a URL do backend não precisa ficar exposta e dá para tratar erros em português.

---

## Fluxo 2 — Painel (dashboard)

1. Páginas em `/dashboard/*` (server-side ou Route Handler).
2. Servidor Next lê `process.env.API_URL` e `process.env.API_KEY`.
3. Chamadas com header:
   ```http
   X-API-Key: <mesma chave do .env do backend>
   ```
4. Exemplos:
   - Listar empresas: `GET /empresas/?skip=0&limit=50`
   - Listar projetos: `GET /projetos/?empresa_id=1`
   - Mudar status: `PATCH /projetos/1/status` body `{ "status": "em_andamento" }`

Status válidos: `aberto`, `em_andamento`, `concluido`.

---

## Variáveis de ambiente

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://...
API_KEY=chave_longa_aleatoria_min_32_chars
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000
```

### Frontend (`frontend/.env.local`) — quando integrar

```env
API_URL=http://localhost:8000
API_KEY=mesma_chave_do_backend
```

---

## CORS

O backend só aceita requisições do front se a origem estiver em `CORS_ORIGINS`. Em dev: `http://localhost:3000`. Em produção: URL real do site (ex.: Vercel).

---

## Contrato de dados (resumo)

**Empresa (POST público)**

```json
{
  "nome": "string",
  "cnpj": "somente números ou formatado — API normaliza",
  "email": "email@valido.com",
  "telefone": "opcional",
  "descricao": "opcional"
}
```

**Projeto (POST público)**

```json
{
  "titulo": "string",
  "descricao": "string",
  "tecnologias": "opcional",
  "empresa_id": 1
}
```

---

## Ordem sugerida de trabalho em dupla

1. Back sobe API local + Supabase (`uvicorn app.main:app --reload`).
2. Front testa `GET http://localhost:8000/health`.
3. Front implementa `POST` do formulário (empresa → projeto).
4. Front implementa listagens do dashboard com `X-API-Key`.
5. Deploy: back (Render/Railway) + front (Vercel), ajustar `CORS_ORIGINS` e `API_URL`.

---

## Mensagem curta para enviar ao amigo (back-end)

> **Integração BFD — resumo**
>
> O Next (porta 3000) consome sua API FastAPI (porta 8000). Supabase fica só no back.
>
> **Público (sem chave):** landing faz `POST /empresas/` depois `POST /projetos/` com o `empresa_id` retornado.
>
> **Painel (com chave):** dashboard usa `GET /empresas/`, `GET /projetos/`, `PATCH /projetos/{id}/status` com header `X-API-Key` — a chave fica no `.env` do Next no servidor, não no browser.
>
> **CORS:** incluir a URL do front em `CORS_ORIGINS`.
>
> **Próximo passo:** você mantém API + banco; eu ligo o formulário e o dashboard nas rotas `app/api` do Next. Documentação completa: `docs/INTEGRACAO-FRONT-BACK.md`.

---

## Referências no repositório

- API: `backend/README.md`
- Segurança: `backend/SECURITY.md`
- Front: `frontend/README.md`
