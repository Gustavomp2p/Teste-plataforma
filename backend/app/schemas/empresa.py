from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional

from app.cnpj import CNPJ_FORMATADO_TAMANHO, cnpj_valido, formatar_cnpj

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

    @field_validator("cnpj")
    @classmethod
    def validar_cnpj(cls, valor: str) -> str:
        # Normaliza antes de gravar: a coluna e VARCHAR(18) e um CNPJ solto
        # (com mascara, espacos ou digitos a mais) estourava o limite no banco.
        if not cnpj_valido(valor):
            raise ValueError("CNPJ deve conter 14 digitos.")
        formatado = formatar_cnpj(valor)
        if len(formatado) > CNPJ_FORMATADO_TAMANHO:
            raise ValueError("CNPJ invalido.")
        return formatado

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
