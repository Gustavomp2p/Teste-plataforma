from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.projeto import Projeto
from app.models.empresa import Empresa
from app.schemas.projeto import ProjetoCreate, ProjetoResponse
from app.security import require_api_key

router = APIRouter()

@router.post("/", response_model=ProjetoResponse, status_code=201)
def cadastrar_projeto(projeto: ProjetoCreate, db: Session = Depends(get_db)):
    # Verifica se a empresa existe
    empresa = db.query(Empresa).filter(Empresa.id == projeto.empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada.")

    novo_projeto = Projeto(**projeto.model_dump())
    db.add(novo_projeto)
    db.commit()
    db.refresh(novo_projeto)
    return novo_projeto

@router.get("/", response_model=List[ProjetoResponse], dependencies=[Depends(require_api_key)])
def listar_projetos(db: Session = Depends(get_db)):
    return db.query(Projeto).all()

@router.get("/{projeto_id}", response_model=ProjetoResponse, dependencies=[Depends(require_api_key)])
def buscar_projeto(projeto_id: int, db: Session = Depends(get_db)):
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado.")
    return projeto

@router.patch("/{projeto_id}/status", dependencies=[Depends(require_api_key)])
def atualizar_status(projeto_id: int, status: str, db: Session = Depends(get_db)):
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado.")
    projeto.status = status
    db.commit()
    db.refresh(projeto)
    return projeto
