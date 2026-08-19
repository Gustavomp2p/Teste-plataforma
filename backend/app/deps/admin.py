import os
from dataclasses import dataclass
from typing import Optional
from uuid import UUID

import httpx
from fastapi import Depends, Header, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.supabase_config import get_supabase_url
from app.cnpj import cnpj_digitos, cnpj_valido, formatar_cnpj
from app.database import get_db
from app.models.usuario_admin import PAPEIS_ADMIN, PapelAdmin, UsuarioAdmin
from app.models.empresa import Empresa
from app.security import require_api_key_legacy


@dataclass
class UserContext:
    id: int
    nome: str
    email: str
    papel: str
    auth_user_id: Optional[UUID]
    empresa_id: Optional[int]
    categoria_ids: list[int]

    @property
    def is_admin(self) -> bool:
        return self.papel in PAPEIS_ADMIN

    @property
    def is_empresa(self) -> bool:
        return self.papel == PapelAdmin.EMPRESA

    @property
    def escopo_total(self) -> bool:
        return self.papel in (PapelAdmin.SUPER, PapelAdmin.COORDENADOR)

    @property
    def painel_url(self) -> str:
        if self.is_admin:
            return "/dashboard"
        if self.is_empresa:
            return "/empresa"
        return "/conta"


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


def _papel_from_auth(auth_user: dict) -> str:
    meta = auth_user.get("user_metadata") or {}
    tipo = (meta.get("tipo_conta") or "").lower()
    if tipo == "empresa":
        return PapelAdmin.EMPRESA
    return PapelAdmin.USUARIO


def _cnpj_from_auth(auth_user: dict) -> str | None:
    meta = auth_user.get("user_metadata") or {}
    cnpj = meta.get("cnpj")
    return cnpj if isinstance(cnpj, str) and cnpj.strip() else None


def _buscar_empresa(db: Session, email: str, cnpj: str | None = None) -> Optional[Empresa]:
    """Empresa ja cadastrada para este CNPJ ou e-mail."""
    digits = cnpj_digitos(cnpj)
    if digits:
        # Caminho rapido: o CNPJ e gravado normalizado (00.000.000/0000-00).
        empresa = db.query(Empresa).filter(Empresa.cnpj == formatar_cnpj(cnpj)).first()
        if empresa:
            return empresa
        # Legado: linhas gravadas antes da normalizacao podem ter outra mascara.
        for candidata in db.query(Empresa).all():
            if cnpj_digitos(candidata.cnpj) == digits:
                return candidata

    return db.query(Empresa).filter(Empresa.email == email).first()


def _vincular_ou_criar_empresa(db: Session, auth_user: dict, nome: str, email: str) -> Optional[int]:
    """Resolve a empresa da conta, criando o cadastro quando ainda nao existe.

    Sem isso a conta empresa ficava sem ``empresa_id`` ate alguem enviar uma
    demanda pelo formulario publico — e as demandas criadas depois caiam em
    outra empresa, sumindo do painel.
    """
    cnpj = _cnpj_from_auth(auth_user)

    empresa = _buscar_empresa(db, email, cnpj)
    if empresa:
        return empresa.id

    # Sem CNPJ valido nao da para criar (coluna NOT NULL/UNIQUE): a conta fica
    # sem vinculo e o painel mostra o aviso de empresa nao vinculada.
    if not cnpj_valido(cnpj):
        return None

    empresa = Empresa(nome=nome or email.split("@")[0], cnpj=formatar_cnpj(cnpj), email=email)
    db.add(empresa)
    try:
        db.commit()
    except IntegrityError:
        # Corrida entre duas requisicoes da mesma conta: relê o que ficou gravado.
        db.rollback()
        existente = _buscar_empresa(db, email, cnpj)
        return existente.id if existente else None
    db.refresh(empresa)
    return empresa.id


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
        if perfil.papel == PapelAdmin.EMPRESA and not perfil.empresa_id:
            empresa_id = _vincular_ou_criar_empresa(db, auth_user, perfil.nome, email)
            if empresa_id:
                perfil.empresa_id = empresa_id
                db.commit()
                db.refresh(perfil)
        return perfil

    papel = _papel_from_auth(auth_user)
    nome = _nome_from_auth(auth_user)
    empresa_id = (
        _vincular_ou_criar_empresa(db, auth_user, nome, email)
        if papel == PapelAdmin.EMPRESA
        else None
    )

    perfil = UsuarioAdmin(
        nome=nome,
        email=email,
        auth_user_id=auth_id,
        papel=papel,
        empresa_id=empresa_id,
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
        empresa_id=perfil.empresa_id,
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
        empresa_id=None,
        categoria_ids=[],
    )


def get_current_empresa(
    user: UserContext = Depends(get_current_user),
) -> UserContext:
    if not user.is_empresa:
        raise HTTPException(status_code=403, detail="Acesso restrito a contas empresa.")
    return user


def aplicar_escopo_categorias(query, admin: UserContext, projeto_model):
    if admin.escopo_total:
        return query
    if not admin.categoria_ids:
        return query.filter(projeto_model.id == -1)
    return query.filter(projeto_model.categoria_id.in_(admin.categoria_ids))
