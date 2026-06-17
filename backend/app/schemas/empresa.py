from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EmpresaCreate(BaseModel):
    nome: str
    cnpj: str
    email: EmailStr
    telefone: Optional[str] = None
    responsavel_nome: Optional[str] = None
    cidade: Optional[str] = None
    segmento: Optional[str] = None
    aceita_contato: bool = True
    descricao: Optional[str] = None

class EmpresaResponse(BaseModel):
    id: int
    nome: str
    cnpj: str
    email: str
    telefone: Optional[str]
    responsavel_nome: Optional[str]
    cidade: Optional[str]
    segmento: Optional[str]
    aceita_contato: bool
    descricao: Optional[str]
    criado_em: datetime

    class Config:
        from_attributes = True
