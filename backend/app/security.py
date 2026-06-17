import os
import secrets
from fastapi import Header, HTTPException


def require_api_key_legacy(x_api_key: str | None = Header(default=None, alias="X-API-Key")):
    """Valida X-API-Key (modo legado / integrações server-side)."""
    expected = os.getenv("API_KEY")
    if not expected:
        raise HTTPException(status_code=500, detail="API_KEY não configurada no servidor.")
    if not x_api_key or not secrets.compare_digest(x_api_key, expected):
        raise HTTPException(status_code=401, detail="Chave de API inválida ou ausente.")


def require_api_key(x_api_key: str | None = Header(default=None, alias="X-API-Key")):
    """Alias legado — prefira get_current_admin nas rotas do painel."""
    require_api_key_legacy(x_api_key)
