from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EmpresaCreate(BaseModel):
    nome: str
    cnpj: str
    email: EmailStr
    telefone: Optional[str] = None
    descricao: Optional[str] = None

class EmpresaResponse(BaseModel):
    id: int
    nome: str
    cnpj: str
    email: str
    telefone: Optional[str]
    descricao: Optional[str]
    criado_em: datetime

    class Config:
        from_attributes = True
