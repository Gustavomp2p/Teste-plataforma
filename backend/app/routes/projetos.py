from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app.deps.admin import AdminContext, aplicar_escopo_categorias, get_current_admin
from app.models.projeto import Projeto, StatusProjeto
from app.models.empresa import Empresa
from app.schemas.projeto import (
    ProjetoCreate,
    ProjetoResponse,
    ProjetoDetalheResponse,
    ProjetoUpdate,
)

router = APIRouter()

STATUS_VALIDOS = {s.value for s in StatusProjeto}


def _garantir_acesso_projeto(projeto: Projeto, admin: AdminContext) -> None:
    if admin.escopo_total:
        return
    if projeto.categoria_id not in admin.categoria_ids:
        raise HTTPException(status_code=403, detail="Sem permissão para este projeto.")

@router.post("/", response_model=ProjetoResponse, status_code=201)
def cadastrar_projeto(projeto: ProjetoCreate, db: Session = Depends(get_db)):
    empresa = db.query(Empresa).filter(Empresa.id == projeto.empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada.")

    dados = projeto.model_dump()
    if dados.get("urgencia"):
        dados["urgencia"] = dados["urgencia"].value

    novo_projeto = Projeto(**dados)
    db.add(novo_projeto)
    db.commit()
    db.refresh(novo_projeto)
    return novo_projeto

@router.get("/", response_model=List[ProjetoResponse])
def listar_projetos(
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
    status: Optional[str] = Query(None),
    cidade: Optional[str] = Query(None),
    segmento: Optional[str] = Query(None),
    complexidade: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
):
    query = db.query(Projeto).join(Empresa)

    if status:
        query = query.filter(Projeto.status == status)
    if cidade:
        query = query.filter(Empresa.cidade.ilike(f"%{cidade}%"))
    if segmento:
        query = query.filter(Empresa.segmento.ilike(f"%{segmento}%"))
    if complexidade:
        query = query.filter(Projeto.complexidade == complexidade)

    query = aplicar_escopo_categorias(query, admin, Projeto)

    return (
        query.order_by(Projeto.criado_em.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

@router.get("/{projeto_id}", response_model=ProjetoDetalheResponse)
def buscar_projeto(
    projeto_id: int,
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
):
    projeto = (
        db.query(Projeto)
        .options(joinedload(Projeto.empresa), joinedload(Projeto.categoria))
        .filter(Projeto.id == projeto_id)
        .first()
    )
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado.")
    _garantir_acesso_projeto(projeto, admin)
    return projeto

@router.patch("/{projeto_id}", response_model=ProjetoResponse)
def atualizar_projeto(
    projeto_id: int,
    dados: ProjetoUpdate,
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
):
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado.")
    _garantir_acesso_projeto(projeto, admin)

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        if valor is not None and hasattr(valor, "value"):
            valor = valor.value
        setattr(projeto, campo, valor)

    db.commit()
    db.refresh(projeto)
    return projeto

@router.patch("/{projeto_id}/status")
def atualizar_status(
    projeto_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
):
    if status not in STATUS_VALIDOS:
        raise HTTPException(
            status_code=400,
            detail=f"Status inválido. Use: {', '.join(sorted(STATUS_VALIDOS))}.",
        )
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado.")
    _garantir_acesso_projeto(projeto, admin)
    projeto.status = status
    db.commit()
    db.refresh(projeto)
    return projeto
