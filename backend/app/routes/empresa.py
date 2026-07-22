from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps.admin import UserContext, get_current_empresa
from app.models.empresa import Empresa
from app.models.projeto import Projeto
from app.schemas.empresa import EmpresaResponse
from app.schemas.projeto import ProjetoDetalheResponse, ProjetoResponse

router = APIRouter()


def _empresa_id_da_conta(user: UserContext, db: Session) -> int | None:
    if user.empresa_id:
        return user.empresa_id
    empresa = db.query(Empresa).filter(Empresa.email == user.email).first()
    return empresa.id if empresa else None


@router.get("/me")
def perfil_empresa(
    user: UserContext = Depends(get_current_empresa),
    db: Session = Depends(get_db),
):
    empresa = None
    if user.empresa_id:
        empresa = db.query(Empresa).filter(Empresa.id == user.empresa_id).first()
    if not empresa:
        empresa = db.query(Empresa).filter(Empresa.email == user.email).first()
    if not empresa:
        return {
            "vinculada": False,
            "mensagem": "Nenhuma empresa cadastrada com este e-mail. Envie uma demanda na landing.",
            "empresa": None,
        }
    return {"vinculada": True, "empresa": EmpresaResponse.model_validate(empresa)}


@router.get("/me/projetos", response_model=list[ProjetoResponse])
def listar_projetos_empresa(
    user: UserContext = Depends(get_current_empresa),
    db: Session = Depends(get_db),
):
    empresa_id = _empresa_id_da_conta(user, db)
    if not empresa_id:
        return []

    projetos = (
        db.query(Projeto)
        .filter(Projeto.empresa_id == empresa_id)
        .order_by(Projeto.criado_em.desc())
        .all()
    )
    return [
        ProjetoResponse.model_validate(p).model_copy(update={"observacoes_internas": None})
        for p in projetos
    ]


@router.get("/me/projetos/{projeto_id}", response_model=ProjetoDetalheResponse)
def buscar_projeto_empresa(
    projeto_id: int,
    user: UserContext = Depends(get_current_empresa),
    db: Session = Depends(get_db),
):
    """Detalhe de uma demanda pertencente à empresa autenticada.

    Oculta observações internas (campo exclusivo da equipe BFD).
    """
    empresa_id = _empresa_id_da_conta(user, db)
    if not empresa_id:
        raise HTTPException(status_code=404, detail="Empresa não vinculada a esta conta.")

    projeto = (
        db.query(Projeto)
        .options(joinedload(Projeto.empresa), joinedload(Projeto.categoria))
        .filter(Projeto.id == projeto_id, Projeto.empresa_id == empresa_id)
        .first()
    )
    if not projeto:
        raise HTTPException(status_code=404, detail="Demanda não encontrada.")

    detalhe = ProjetoDetalheResponse.model_validate(projeto)
    return detalhe.model_copy(update={"observacoes_internas": None})
