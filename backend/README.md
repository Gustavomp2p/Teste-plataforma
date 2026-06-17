# Backend - Plataforma de Captação de Projetos Tecnológicos

API desenvolvida com **FastAPI** + **PostgreSQL (Supabase)** | Residência em TIC - Bolsa Futuro Digital

---

## Pré-requisitos

- Python 3.11+
- Conta no [Supabase](https://supabase.com) com um projeto criado

---

## Como rodar o projeto

### 1. Clone o repositório e entre na pasta
```bash
cd backend
```

### 2. Crie e ative o ambiente virtual
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o `.env` com a URL de conexão do Supabase (Session Pooler) e a chave do painel:
```env
DATABASE_URL=postgresql://postgres.SEU_PROJECT_REF:SUA_SENHA@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
API_KEY=chave_longa_aleatoria_min_32_chars
CORS_ORIGINS=http://localhost:3000
```

> A URL pode ser encontrada em: Supabase → Project Settings → Database → Connection string (Session Pooler)
> `API_KEY` deve ser a mesma configurada no frontend (`frontend/.env.local`).

### 5. Rode a API
```bash
uvicorn app.main:app --reload
```

### 6. Aplique o schema no Supabase (obrigatório após atualização do modelo)

**Opção A — Script (sem MCP Cursor):**

Com `DATABASE_URL` configurado no `.env` (senha real, não placeholder):

```bash
python scripts/apply_migration.py
```

**Opção B — SQL Editor manual:**

No [SQL Editor do projeto](https://supabase.com/dashboard/project/eexyhqvpgbdkzjtfraaw/sql/new), execute o arquivo `migrations/001_schema_bfd.sql`.

Detalhes do modelo: `docs/MODELO-DADOS.md` · Troubleshooting MCP: `docs/SUPABASE-SETUP.md`

---

## Documentação interativa

Com a API rodando, acesse:
- Swagger UI: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

---

## Autenticação

As rotas do **painel** exigem o header `X-API-Key` igual ao `API_KEY` do `.env`.
As rotas **públicas** (cadastro pela landing) não exigem chave.

```http
X-API-Key: <mesma chave do .env>
```

## Endpoints disponíveis

### Empresas
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | /empresas/ | Público | Cadastrar empresa |
| GET | /empresas/ | Painel (X-API-Key) | Listar todas |
| GET | /empresas/{id} | Painel (X-API-Key) | Buscar por ID |
| DELETE | /empresas/{id} | Painel (X-API-Key) | Deletar empresa |

### Projetos
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | /projetos/ | Público | Cadastrar projeto |
| GET | /projetos/ | Painel (X-API-Key) | Listar (filtros: status, cidade, segmento, complexidade) |
| GET | /projetos/{id} | Painel (X-API-Key) | Detalhe com empresa e categoria |
| PATCH | /projetos/{id} | Painel (X-API-Key) | Qualificação e briefing |
| PATCH | /projetos/{id}/status | Painel (X-API-Key) | Atualizar status |

### Categorias
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | /categorias/ | Painel (X-API-Key) | Listar categorias |

### Saúde
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /health | Healthcheck |

---

## Estrutura do projeto

```
backend/
├── app/
│   ├── main.py          # Ponto de entrada da API
│   ├── database.py      # Conexão com Supabase
│   ├── security.py      # Autenticação por X-API-Key (painel)
│   ├── models/          # Tabelas do banco (SQLAlchemy)
│   │   ├── empresa.py
│   │   └── projeto.py
│   ├── schemas/         # Validação de dados (Pydantic)
│   │   ├── empresa.py
│   │   └── projeto.py
│   └── routes/          # Endpoints da API
│       ├── empresas.py
│       └── projetos.py
├── migrations/          # SQL do schema (001_schema_bfd.sql)
├── scripts/
│   └── apply_migration.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```