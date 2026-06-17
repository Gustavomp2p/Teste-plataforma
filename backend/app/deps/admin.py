import os
from dataclasses import dataclass
from typing import Optional
from uuid import UUID

import httpx
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.auth.supabase_config import get_supabase_url
from app.database import get_db
from app.models.usuario_admin import UsuarioAdmin
from app.security import require_api_key_legacy


@dataclass
class AdminContext:
    id: int
    nome: str
    email: str
    papel: str
    auth_user_id: Optional[UUID]
    categoria_ids: list[int]

    @property
    def escopo_total(self) -> bool:
        return self.papel in ("super_admin", "coordenador")


def _verify_supabase_jwt(token: str) -> dict:
    supabase_url = get_supabase_url()
    anon_key = os.getenv("SUPABASE_ANON_KEY", "")
    if not supabase_url or not anon_key:
        raise HTTPException(
            status_code=500,
            detail="SUPABASE_URL e SUPABASE_ANON_KEY devem estar configurados no backend.",
        )

    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(
                f"{supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": anon_key,
                },
            )
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Não foi possível validar o token com o Supabase.")

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada.")

    data = res.json()
    require_confirm = os.getenv("AUTH_REQUIRE_EMAIL_CONFIRM", "true").lower() in ("1", "true", "yes")
    if require_confirm and not data.get("email_confirmed_at"):
        raise HTTPException(status_code=403, detail="Confirme seu e-mail antes de acessar o painel.")
    return data


def _admin_from_user(db: Session, auth_user: dict) -> AdminContext:
    auth_id = auth_user.get("id")
    if not auth_id:
        raise HTTPException(status_code=401, detail="Token sem identificador de usuário.")

    admin = (
        db.query(UsuarioAdmin)
        .filter(UsuarioAdmin.auth_user_id == auth_id, UsuarioAdmin.ativo == True)
        .first()
    )
    if not admin:
        raise HTTPException(
            status_code=403,
            detail="Usuário autenticado, mas sem perfil de administrador no painel.",
        )

    return AdminContext(
        id=admin.id,
        nome=admin.nome,
        email=admin.email,
        papel=admin.papel,
        auth_user_id=admin.auth_user_id,
        categoria_ids=admin.categoria_ids_permitidos(),
    )


def get_current_admin(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> AdminContext:
    """Aceita JWT Supabase (preferido) ou X-API-Key legado (super_admin implícito)."""
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        user = _verify_supabase_jwt(token)
        return _admin_from_user(db, user)

    require_api_key_legacy(x_api_key)
    return AdminContext(
        id=0,
        nome="API Key",
        email="",
        papel="super_admin",
        auth_user_id=None,
        categoria_ids=[],
    )


def aplicar_escopo_categorias(query, admin: AdminContext, projeto_model):
    if admin.escopo_total:
        return query
    if not admin.categoria_ids:
        return query.filter(projeto_model.id == -1)
    return query.filter(projeto_model.categoria_id.in_(admin.categoria_ids))
