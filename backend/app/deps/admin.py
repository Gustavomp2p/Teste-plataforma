import os
from dataclasses import dataclass
from typing import Optional
from uuid import UUID

import httpx
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.auth.supabase_config import get_supabase_url
from app.database import get_db
from app.models.usuario_admin import PAPEIS_ADMIN, PapelAdmin, UsuarioAdmin
from app.security import require_api_key_legacy


@dataclass
class UserContext:
    id: int
    nome: str
    email: str
    papel: str
    auth_user_id: Optional[UUID]
    categoria_ids: list[int]

    @property
    def is_admin(self) -> bool:
        return self.papel in PAPEIS_ADMIN

    @property
    def escopo_total(self) -> bool:
        return self.papel in (PapelAdmin.SUPER, PapelAdmin.COORDENADOR)


AdminContext = UserContext


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


def _nome_from_auth(auth_user: dict) -> str:
    meta = auth_user.get("user_metadata") or {}
    return (
        meta.get("nome")
        or meta.get("full_name")
        or meta.get("name")
        or (auth_user.get("email") or "Usuário").split("@")[0]
    )


def _ensure_profile(db: Session, auth_user: dict) -> UsuarioAdmin:
    auth_id = auth_user.get("id")
    email = auth_user.get("email")
    if not auth_id or not email:
        raise HTTPException(status_code=401, detail="Token sem e-mail ou identificador.")

    perfil = (
        db.query(UsuarioAdmin)
        .filter(UsuarioAdmin.auth_user_id == auth_id)
        .first()
    )
    if perfil:
        if not perfil.ativo:
            raise HTTPException(status_code=403, detail="Conta desativada.")
        return perfil

    perfil = UsuarioAdmin(
        nome=_nome_from_auth(auth_user),
        email=email,
        auth_user_id=auth_id,
        papel=PapelAdmin.USUARIO,
        ativo=True,
    )
    db.add(perfil)
    db.commit()
    db.refresh(perfil)
    return perfil


def _to_context(perfil: UsuarioAdmin) -> UserContext:
    return UserContext(
        id=perfil.id,
        nome=perfil.nome,
        email=perfil.email,
        papel=perfil.papel,
        auth_user_id=perfil.auth_user_id,
        categoria_ids=perfil.categoria_ids_permitidos(),
    )


def _user_from_token(db: Session, token: str) -> UserContext:
    auth_user = _verify_supabase_jwt(token)
    perfil = _ensure_profile(db, auth_user)
    return _to_context(perfil)


def get_current_user(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
) -> UserContext:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Autenticação necessária.")
    token = authorization.split(" ", 1)[1].strip()
    return _user_from_token(db, token)


def get_current_admin(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> AdminContext:
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        user = _user_from_token(db, token)
        if not user.is_admin:
            raise HTTPException(status_code=403, detail="Acesso restrito a administradores.")
        return user

    require_api_key_legacy(x_api_key)
    return AdminContext(
        id=0,
        nome="API Key",
        email="",
        papel="super_admin",
        auth_user_id=None,
        categoria_ids=[],
    )


def aplicar_escopo_categorias(query, admin: UserContext, projeto_model):
    if admin.escopo_total:
        return query
    if not admin.categoria_ids:
        return query.filter(projeto_model.id == -1)
    return query.filter(projeto_model.categoria_id.in_(admin.categoria_ids))
