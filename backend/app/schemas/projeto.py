from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.projeto import StatusProjeto

class ProjetoCreate(BaseModel):
    titulo: str
    descricao: str
    tecnologias: Optional[str] = None
    empresa_id: int

class ProjetoResponse(BaseModel):
    id: int
    titulo: str
    descricao: str
    tecnologias: Optional[str]
    status: StatusProjeto
    empresa_id: int
    criado_em: datetime

    class Config:
        from_attributes = True
