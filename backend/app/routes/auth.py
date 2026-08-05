from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps.admin import UserContext, _verify_supabase_jwt, get_current_user
from app.models.usuario_admin import UsuarioAdmin

router = APIRouter()


@router.get("/me")
def perfil_usuario(user: UserContext = Depends(get_current_user), db: Session = Depends(get_db)):
    categorias = []
    if user.is_admin and not user.escopo_total:
        row = db.query(UsuarioAdmin).filter(UsuarioAdmin.id == user.id).first()
        if row:
            categorias = [{"id": c.id, "nome": c.nome, "slug": c.slug} for c in row.categorias]

    return {
        "id": user.id,
        "nome": user.nome,
        "email": user.email,
        "papel": user.papel,
        "is_admin": user.is_admin,
        "is_empresa": user.is_empresa,
        "empresa_id": user.empresa_id,
        "escopo_total": user.escopo_total,
        "categorias": categorias,
        "painel_url": user.painel_url,
    }


@router.get("/has-account")
def possui_conta(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
):
    """Verifica se já existe perfil local (sem auto-criar).

    Usado no login com Google: só permite continuar se a pessoa
    já tiver criado conta (usuário ou empresa) antes.
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Autenticação necessária.")

    token = authorization.split(" ", 1)[1].strip()
    auth_user = _verify_supabase_jwt(token)
    auth_id = auth_user.get("id")
    email = (auth_user.get("email") or "").strip().lower()

    perfil = None
    if auth_id:
        perfil = (
            db.query(UsuarioAdmin)
            .filter(UsuarioAdmin.auth_user_id == auth_id)
            .first()
        )
    if not perfil and email:
        perfil = (
            db.query(UsuarioAdmin)
            .filter(UsuarioAdmin.email.ilike(email))
            .first()
        )
        # Primeiro login Google após cadastro por e-mail: vincula o auth_user_id.
        if perfil and auth_id and not perfil.auth_user_id:
            perfil.auth_user_id = auth_id
            db.commit()
            db.refresh(perfil)

    if not perfil or not perfil.ativo:
        return {"exists": False}

    return {"exists": True, "papel": perfil.papel}


@router.post("/sync-profile")
def sincronizar_perfil(user: UserContext = Depends(get_current_user)):
    """Garante perfil após cadastro ou OAuth (idempotente)."""
    return {
        "ok": True,
        "papel": user.papel,
        "is_admin": user.is_admin,
        "is_empresa": user.is_empresa,
        "painel_url": user.painel_url,
    }
