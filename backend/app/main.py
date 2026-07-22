import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import empresas, projetos, categorias, auth, empresa, demandas

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plataforma de Captacao de Projetos Tecnologicos",
    version="1.0.0"
)

# Origens liberadas no CORS — configuráveis via env (separadas por vírgula).
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
allow_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(empresa.router, prefix="/empresa", tags=["Empresa"])
app.include_router(empresas.router, prefix="/empresas", tags=["Empresas"])
app.include_router(projetos.router, prefix="/projetos", tags=["Projetos"])
app.include_router(demandas.router, prefix="/demandas", tags=["Demandas"])
app.include_router(categorias.router, prefix="/categorias", tags=["Categorias"])

@app.get("/")
def root():
    return {"status": "API rodando!", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
