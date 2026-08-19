# Modelo de dados — Plataforma BFD

Alinhado ao plano de trabalho (Épicos 3.3, 6.2, 8.2 e 8.3).

## Entidades

```text
empresas ─────┬──── projetos ───── categorias
              │
usuarios_admin (painel — login futuro)
```

### empresas
| Campo | Tipo | Origem |
|-------|------|--------|
| nome, cnpj, email | obrigatórios | Formulário |
| telefone | opcional | WhatsApp |
| responsavel_nome | opcional | Formulário |
| cidade, segmento | opcional | Formulário |
| aceita_contato | boolean | Formulário |
| descricao | opcional | Descrição da demanda |

### projetos
| Campo | Tipo | Origem |
|-------|------|--------|
| titulo, descricao | obrigatórios | Formulário |
| tipo_problema, urgencia | captação | Formulário |
| status | workflow | Painel |
| complexidade, prioridade | qualificação | Painel |
| observacoes_internas | texto | Painel |
| briefing_* | texto | Painel (template Épico 8.4) |
| categoria_id | FK | Categorias |

### Status do projeto
`novo` → `em_analise` → `em_contato` → `aprovado_squad` / `reprovado` → `estruturado`

`cancelado`: encerrado pela própria empresa (só antes de `aprovado_squad`).

A coluna `status` é `VARCHAR(30)` sem CHECK, então o novo valor não exige migration.

### categorias (seed)
Automação, Sistema web, App mobile, Dados e IA, Outro.

## Aplicar no Supabase

1. Abra [SQL Editor](https://supabase.com/dashboard/project/eexyhqvpgbdkzjtfraaw/sql/new)
2. Cole e execute `backend/migrations/001_schema_bfd.sql`
