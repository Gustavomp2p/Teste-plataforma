from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps.admin import UserContext, get_current_empresa
from app.models.empresa import Empresa
from app.models.projeto import Projeto
from app.schemas.empresa import EmpresaResponse
from app.schemas.projeto import ProjetoResponse

router = APIRouter()


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
    empresa_id = user.empresa_id
    if not empresa_id:
        empresa = db.query(Empresa).filter(Empresa.email == user.email).first()
        if not empresa:
            return []
        empresa_id = empresa.id

    return (
        db.query(Projeto)
        .filter(Projeto.empresa_id == empresa_id)
        .order_by(Projeto.criado_em.desc())
        .all()
    )
