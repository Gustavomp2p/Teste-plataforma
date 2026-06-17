# Frontend

Aplicação **Next.js** da Plataforma de Captação e Estruturação de Projetos Tecnológicos (Bolsa Futuro Digital).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Estrutura

```
src/
  app/              # Rotas (landing + dashboard)
  components/       # UI, layout, landing, dashboard
  lib/              # Constantes e utilitários
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page pública (formulário integrado à API) |
| `/dashboard` | Visão geral do painel (stats reais) |
| `/dashboard/projetos` | Lista de projetos + atualização de status |
| `/dashboard/empresas` | Empresas cadastradas |
| `/dashboard/demandas` | Fila de qualificação (projetos abertos) |
| `/api/cadastro` | Route Handler: cria empresa + projeto (usado pela landing) |
| `/api/projetos/[id]/status` | Route Handler: atualiza status do projeto |

## Integração com o backend

O frontend conversa com a API FastAPI por meio de Server Components e Route
Handlers (`src/lib/api.ts`). `API_URL` e `API_KEY` **só são usadas no servidor** —
nunca vão para o navegador. As rotas do painel enviam o header `X-API-Key`; o
cadastro público da landing não usa chave.

```bash
cp .env.local.example .env.local   # define API_URL e API_KEY
```

> `API_KEY` precisa ser **igual** à do backend (`backend/.env`).

> O backend precisa liberar o CORS para `http://localhost:3000`
> (já configurado em `backend/app/main.py`).

## Como rodar

### Pré-requisitos

- Node.js
- Git
- Backend FastAPI rodando (veja `../backend/README.md`)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run lint` — ESLint

## Sprint 1

- [x] Estrutura Next.js
- [x] Landing alinhada ao kickoff
- [x] Shell do dashboard
- [x] Formulário de demanda integrado à API
- [x] Integração com backend (landing + dashboard)

## Branch

Trabalhar em `develop` (ou `feature/*` → PR para `develop`). Não commitar direto na `main`.

