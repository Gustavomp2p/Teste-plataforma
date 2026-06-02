from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import empresas, projetos

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plataforma de Captacao de Projetos Tecnologicos",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(empresas.router, prefix="/empresas", tags=["Empresas"])
app.include_router(projetos.router, prefix="/projetos", tags=["Projetos"])

@app.get("/")
def root():
    return {"status": "API rodando!", "docs": "/docs"}
