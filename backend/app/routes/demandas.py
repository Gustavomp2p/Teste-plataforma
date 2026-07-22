"""Catálogo de demandas disponíveis para usuários autenticados da plataforma."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps.admin import UserContext, get_current_user
from app.models.empresa import Empresa
from app.models.projeto import Projeto, StatusProjeto
from app.schemas.projeto import DemandaPublicaDetalheResponse, DemandaPublicaResponse

router = APIRouter()

# Status liberados no catálogo público (pós-aprovação pela equipe BFD).
STATUS_DISPONIVEIS = {
    StatusProjeto.aprovado_turma.value,
    StatusProjeto.estruturado.value,
}


@router.get("/", response_model=List[DemandaPublicaResponse])
def listar_demandas_disponiveis(
    db: Session = Depends(get_db),
    user: UserContext = Depends(get_current_user),
    cidade: Optional[str] = Query(None),
    segmento: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """Lista demandas disponíveis para usuários e admins.

    Contas empresa devem usar GET /empresa/me/projetos (suas próprias demandas).
    """
    if user.is_empresa:
        raise HTTPException(
            status_code=403,
            detail="Contas empresa devem consultar as próprias demandas em /empresa/me/projetos.",
        )

    query = (
        db.query(Projeto)
        .join(Empresa)
        .filter(Projeto.status.in_(STATUS_DISPONIVEIS))
    )
    if cidade:
        query = query.filter(Empresa.cidade.ilike(f"%{cidade}%"))
    if segmento:
        query = query.filter(Empresa.segmento.ilike(f"%{segmento}%"))

    return (
        query.order_by(Projeto.atualizado_em.desc().nullslast(), Projeto.criado_em.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{demanda_id}", response_model=DemandaPublicaDetalheResponse)
def buscar_demanda_disponivel(
    demanda_id: int,
    db: Session = Depends(get_db),
    user: UserContext = Depends(get_current_user),
):
    """Detalhe sanitizado de uma demanda disponível (sem observações internas)."""
    if user.is_empresa:
        raise HTTPException(
            status_code=403,
            detail="Contas empresa devem consultar as próprias demandas em /empresa/me/projetos.",
        )

    projeto = (
        db.query(Projeto)
        .options(joinedload(Projeto.empresa), joinedload(Projeto.categoria))
        .filter(Projeto.id == demanda_id)
        .first()
    )
    if not projeto:
        raise HTTPException(status_code=404, detail="Demanda não encontrada.")
    if projeto.status not in STATUS_DISPONIVEIS:
        raise HTTPException(
            status_code=404,
            detail="Demanda não disponível para consulta neste momento.",
        )
    return projeto
