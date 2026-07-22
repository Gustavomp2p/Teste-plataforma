from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.projeto import StatusProjeto, Nivel

class CategoriaResponse(BaseModel):
    id: int
    nome: str
    slug: str
    descricao: Optional[str]

    class Config:
        from_attributes = True

class ProjetoCreate(BaseModel):
    titulo: str
    descricao: str
    tecnologias: Optional[str] = None
    tipo_problema: Optional[str] = None
    urgencia: Optional[Nivel] = None
    categoria_id: Optional[int] = None
    empresa_id: int

class ProjetoUpdate(BaseModel):
    status: Optional[StatusProjeto] = None
    complexidade: Optional[Nivel] = None
    prioridade: Optional[Nivel] = None
    observacoes_internas: Optional[str] = None
    briefing_contexto: Optional[str] = None
    briefing_objetivo: Optional[str] = None
    briefing_escopo: Optional[str] = None
    briefing_requisitos: Optional[str] = None
    briefing_resultado: Optional[str] = None
    categoria_id: Optional[int] = None

class ProjetoResponse(BaseModel):
    id: int
    titulo: str
    descricao: str
    tecnologias: Optional[str]
    tipo_problema: Optional[str]
    urgencia: Optional[str]
    status: str
    complexidade: Optional[str]
    prioridade: Optional[str]
    observacoes_internas: Optional[str]
    briefing_contexto: Optional[str]
    briefing_objetivo: Optional[str]
    briefing_escopo: Optional[str]
    briefing_requisitos: Optional[str]
    briefing_resultado: Optional[str]
    categoria_id: Optional[int]
    empresa_id: int
    criado_em: datetime
    atualizado_em: Optional[datetime]

    class Config:
        from_attributes = True

class ProjetoDetalheResponse(ProjetoResponse):
    empresa: Optional["EmpresaResumo"] = None
    categoria: Optional[CategoriaResponse] = None

class EmpresaResumo(BaseModel):
    id: int
    nome: str
    email: str
    telefone: Optional[str]
    responsavel_nome: Optional[str]
    cidade: Optional[str]
    segmento: Optional[str]

    class Config:
        from_attributes = True


class EmpresaResumoPublico(BaseModel):
    """Dados públicos da empresa (sem e-mail/telefone) para catálogo de usuários."""

    id: int
    nome: str
    cidade: Optional[str]
    segmento: Optional[str]

    class Config:
        from_attributes = True


class DemandaPublicaResponse(BaseModel):
    """Demanda sanitizada para usuários autenticados (sem campos internos)."""

    id: int
    titulo: str
    descricao: str
    tecnologias: Optional[str]
    tipo_problema: Optional[str]
    urgencia: Optional[str]
    status: str
    complexidade: Optional[str]
    briefing_contexto: Optional[str]
    briefing_objetivo: Optional[str]
    briefing_escopo: Optional[str]
    briefing_requisitos: Optional[str]
    briefing_resultado: Optional[str]
    categoria_id: Optional[int]
    empresa_id: int
    criado_em: datetime
    atualizado_em: Optional[datetime]

    class Config:
        from_attributes = True


class DemandaPublicaDetalheResponse(DemandaPublicaResponse):
    empresa: Optional[EmpresaResumoPublico] = None
    categoria: Optional[CategoriaResponse] = None


ProjetoDetalheResponse.model_rebuild()
DemandaPublicaDetalheResponse.model_rebuild()
