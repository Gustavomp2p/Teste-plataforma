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
| `/` | Landing page pública |
| `/dashboard` | Visão geral do painel |
| `/dashboard/projetos` | Projetos (placeholder) |
| `/dashboard/empresas` | Empresas (placeholder) |
| `/dashboard/demandas` | Demandas (placeholder) |

## Como rodar

### Pré-requisitos

- Node.js
- Git

```bash
cd frontend
npm install
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
- [ ] Formulário de demanda (aguarda API)
- [ ] Integração com backend

## Branch

Trabalhar em `develop` (ou `feature/*` → PR para `develop`). Não commitar direto na `main`.

