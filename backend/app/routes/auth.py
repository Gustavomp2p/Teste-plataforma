from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps.admin import UserContext, get_current_user
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
        "escopo_total": user.escopo_total,
        "categorias": categorias,
        "painel_url": "/dashboard" if user.is_admin else "/conta",
    }


@router.post("/sync-profile")
def sincronizar_perfil(user: UserContext = Depends(get_current_user)):
    """Garante perfil após cadastro ou OAuth (idempotente)."""
    return {
        "ok": True,
        "papel": user.papel,
        "is_admin": user.is_admin,
        "painel_url": "/dashboard" if user.is_admin else "/conta",
    }
