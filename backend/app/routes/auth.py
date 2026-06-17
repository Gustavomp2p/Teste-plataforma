from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps.admin import AdminContext, get_current_admin
from app.models.usuario_admin import UsuarioAdmin

router = APIRouter()


@router.get("/me")
def perfil_admin(admin: AdminContext = Depends(get_current_admin), db: Session = Depends(get_db)):
    categorias = []
    if not admin.escopo_total:
        row = db.query(UsuarioAdmin).filter(UsuarioAdmin.id == admin.id).first()
        if row:
            categorias = [{"id": c.id, "nome": c.nome, "slug": c.slug} for c in row.categorias]

    return {
        "id": admin.id,
        "nome": admin.nome,
        "email": admin.email,
        "papel": admin.papel,
        "escopo_total": admin.escopo_total,
        "categorias": categorias,
    }
