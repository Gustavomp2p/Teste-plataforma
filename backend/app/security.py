import os
import secrets
from fastapi import Header, HTTPException

def require_api_key(x_api_key: str | None = Header(default=None, alias="X-API-Key")):
    """Dependency que protege as rotas do painel.

    Exige o header `X-API-Key` igual à variável de ambiente `API_KEY`.
    As rotas públicas (cadastro pela landing) não usam esta dependency.
    """
    expected = os.getenv("API_KEY")
    if not expected:
        raise HTTPException(
            status_code=500,
            detail="API_KEY não configurada no servidor.",
        )
    if not x_api_key or not secrets.compare_digest(x_api_key, expected):
        raise HTTPException(
            status_code=401,
            detail="Chave de API inválida ou ausente.",
        )
