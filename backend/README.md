# Backend - Plataforma de Captação de Projetos Tecnológicos

API desenvolvida com **FastAPI** + **MySQL** | Residência em TIC - Bolsa Futuro Digital

---

## Pré-requisitos

- Python 3.11+
- MySQL instalado e rodando

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
cp .env.example .env
# Edite o .env com suas credenciais do MySQL
```

### 5. Crie o banco de dados no MySQL
```sql
CREATE DATABASE plataforma_tic;
```

### 6. Rode a API
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
│   ├── database.py      # Conexão com MySQL
│   ├── config.py        # Variáveis de ambiente
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
