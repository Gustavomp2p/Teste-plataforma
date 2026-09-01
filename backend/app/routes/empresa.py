from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import func

from app.database import get_db
from app.deps.admin import UserContext, get_current_empresa
from app.models.empresa import Empresa
from app.models.projeto import MOTIVOS_CANCELAMENTO, Projeto, StatusProjeto
from app.schemas.empresa import EmpresaResponse
from app.schemas.projeto import (
    CancelamentoEmpresaRequest,
    DemandaEmpresaCreate,
    ProjetoDetalheResponse,
    ProjetoResponse,
)

router = APIRouter()

# Status em que a empresa ainda pode cancelar sozinha. Depois de aprovada para
# uma squad ha alunos trabalhando na demanda, entao o cancelamento passa a ser
# conversado com a equipe BFD.
STATUS_CANCELAVEIS = {
    StatusProjeto.novo.value,
    StatusProjeto.em_analise.value,
    StatusProjeto.em_contato.value,
    StatusProjeto.reprovado.value,
}


def _empresa_id_da_conta(user: UserContext, db: Session) -> int | None:
    if user.empresa_id:
        return user.empresa_id
    empresa = db.query(Empresa).filter(Empresa.email == user.email).first()
    return empresa.id if empresa else None


def _sem_observacoes(projeto: Projeto) -> ProjetoResponse:
    """Resposta da demanda sem o campo interno da equipe BFD."""
    return ProjetoResponse.model_validate(projeto).model_copy(
        update={"observacoes_internas": None}
    )


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
            "mensagem": "Nenhuma empresa cadastrada com este e-mail. Informe o CNPJ no cadastro da conta.",
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
    return [_sem_observacoes(p) for p in projetos]


@router.post("/me/demandas", response_model=ProjetoResponse, status_code=201)
def criar_demanda_empresa(
    dados: DemandaEmpresaCreate,
    user: UserContext = Depends(get_current_empresa),
    db: Session = Depends(get_db),
):
    """Cria uma demanda ja vinculada a empresa da sessao.

    O ``empresa_id`` vem da conta autenticada, nunca do corpo da requisicao —
    era por isso que demandas novas apareciam sob outra empresa e sumiam do
    painel.
    """
    empresa_id = _empresa_id_da_conta(user, db)
    if not empresa_id:
        raise HTTPException(
            status_code=400,
            detail="Conta sem empresa vinculada. Informe um CNPJ valido no cadastro da conta.",
        )

    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa nao encontrada.")

    # Campos de contato enviados no formulario mantem o cadastro atualizado.
    for campo in ("responsavel_nome", "telefone", "cidade", "segmento", "aceita_contato"):
        valor = getattr(dados, campo)
        if valor is not None and valor != "":
            setattr(empresa, campo, valor)

    projeto = Projeto(
        titulo=(dados.titulo or "").strip() or dados.tipo_problema,
        descricao=dados.descricao,
        tecnologias=dados.tecnologias or None,
        tipo_problema=dados.tipo_problema,
        urgencia=dados.urgencia.value if dados.urgencia else None,
        categoria_id=dados.categoria_id,
        empresa_id=empresa_id,
        status=StatusProjeto.novo.value,
    )
    db.add(projeto)
    db.commit()
    db.refresh(projeto)
    return _sem_observacoes(projeto)


@router.get("/me/projetos/{projeto_id}", response_model=ProjetoDetalheResponse)
def buscar_projeto_empresa(
    projeto_id: int,
    user: UserContext = Depends(get_current_empresa),
    db: Session = Depends(get_db),
):
    """Detalhe de uma demanda pertencente a empresa autenticada.

    Oculta observacoes internas (campo exclusivo da equipe BFD).
    """
    empresa_id = _empresa_id_da_conta(user, db)
    if not empresa_id:
        raise HTTPException(status_code=404, detail="Empresa nao vinculada a esta conta.")

    projeto = (
        db.query(Projeto)
        .options(joinedload(Projeto.empresa), joinedload(Projeto.categoria))
        .filter(Projeto.id == projeto_id, Projeto.empresa_id == empresa_id)
        .first()
    )
    if not projeto:
        raise HTTPException(status_code=404, detail="Demanda nao encontrada.")

    detalhe = ProjetoDetalheResponse.model_validate(projeto)
    return detalhe.model_copy(update={"observacoes_internas": None})


@router.patch("/me/projetos/{projeto_id}/cancelar", response_model=ProjetoResponse)
def cancelar_demanda_empresa(
    projeto_id: int,
    dados: CancelamentoEmpresaRequest,
    user: UserContext = Depends(get_current_empresa),
    db: Session = Depends(get_db),
):
    """Cancela uma demanda da propria empresa, registrando o motivo.

    O motivo e obrigatorio e precisa estar em MOTIVOS_CANCELAMENTO; a
    observacao e livre e opcional.
    """
    motivo = (dados.motivo or "").strip()
    if not motivo:
        raise HTTPException(status_code=400, detail="Selecione o motivo do cancelamento.")
    if motivo not in MOTIVOS_CANCELAMENTO:
        raise HTTPException(status_code=400, detail="Motivo de cancelamento inválido.")

    observacao = (dados.observacao or "").strip() or None

    empresa_id = _empresa_id_da_conta(user, db)
    if not empresa_id:
        raise HTTPException(status_code=404, detail="Empresa nao vinculada a esta conta.")

    projeto = (
        db.query(Projeto)
        .filter(Projeto.id == projeto_id, Projeto.empresa_id == empresa_id)
        .first()
    )
    if not projeto:
        raise HTTPException(status_code=404, detail="Demanda nao encontrada.")

    if projeto.status == StatusProjeto.cancelado.value:
        raise HTTPException(status_code=409, detail="Esta demanda ja foi cancelada.")

    if projeto.status not in STATUS_CANCELAVEIS:
        raise HTTPException(
            status_code=409,
            detail="Demanda ja aprovada para uma squad. Fale com a equipe BFD para cancelar.",
        )

    projeto.status = StatusProjeto.cancelado.value
    projeto.cancelamento_motivo = motivo
    projeto.cancelamento_observacao = observacao
    projeto.cancelado_em = func.now()
    db.commit()
    db.refresh(projeto)
    return _sem_observacoes(projeto)
