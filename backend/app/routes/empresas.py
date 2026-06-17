from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.deps.admin import AdminContext, get_current_admin
from app.models.empresa import Empresa
from app.models.projeto import Projeto
from app.schemas.empresa import EmpresaCreate, EmpresaResponse

router = APIRouter()

@router.post("/", response_model=EmpresaResponse, status_code=201)
def cadastrar_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    # Verifica se CNPJ ou email já existem
    existente = db.query(Empresa).filter(
        (Empresa.cnpj == empresa.cnpj) | (Empresa.email == empresa.email)
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="CNPJ ou e-mail já cadastrado.")

    nova_empresa = Empresa(**empresa.model_dump())
    db.add(nova_empresa)
    db.commit()
    db.refresh(nova_empresa)
    return nova_empresa

@router.get("/", response_model=List[EmpresaResponse])
def listar_empresas(
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
):
    query = db.query(Empresa)
    if not admin.escopo_total:
        if not admin.categoria_ids:
            return []
        query = (
            query.join(Projeto, Projeto.empresa_id == Empresa.id)
            .filter(Projeto.categoria_id.in_(admin.categoria_ids))
            .distinct()
        )
    return query.all()

@router.get("/{empresa_id}", response_model=EmpresaResponse)
def buscar_empresa(
    empresa_id: int,
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada.")
    return empresa

@router.delete("/{empresa_id}", status_code=204)
def deletar_empresa(
    empresa_id: int,
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
):
    if not admin.escopo_total:
        raise HTTPException(status_code=403, detail="Apenas coordenadores podem excluir empresas.")
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada.")
    db.delete(empresa)
    db.commit()
