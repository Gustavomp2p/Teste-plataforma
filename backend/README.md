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

Edite o `.env` com a URL de conexão do Supabase (Session Pooler):
```env
DATABASE_URL=postgresql://postgres.SEU_PROJECT_REF:SUA_SENHA@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
```

> A URL pode ser encontrada em: Supabase → Project Settings → Database → Connection string (Session Pooler)

### 5. Rode a API
```bash
uvicorn app.main:app --reload
```

---

## Documentação interativa

Com a API rodando, acesse:
- Swagger UI: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

---

## Endpoints disponíveis

### Empresas
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /empresas/ | Cadastrar empresa |
| GET | /empresas/ | Listar todas |
| GET | /empresas/{id} | Buscar por ID |
| DELETE | /empresas/{id} | Deletar empresa |

### Projetos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /projetos/ | Cadastrar projeto |
| GET | /projetos/ | Listar todos |
| GET | /projetos/{id} | Buscar por ID |
| PATCH | /projetos/{id}/status | Atualizar status |

---

## Estrutura do projeto

```
backend/
├── app/
│   ├── main.py          # Ponto de entrada da API
│   ├── database.py      # Conexão com Supabase
│   ├── models/          # Tabelas do banco (SQLAlchemy)
│   │   ├── empresa.py
│   │   └── projeto.py
│   ├── schemas/         # Validação de dados (Pydantic)
│   │   ├── empresa.py
│   │   └── projeto.py
│   └── routes/          # Endpoints da API
│       ├── empresas.py
│       └── projetos.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```