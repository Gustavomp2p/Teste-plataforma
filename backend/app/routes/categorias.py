from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.deps.admin import AdminContext, get_current_admin
from app.models.categoria import Categoria
from app.schemas.projeto import CategoriaResponse

router = APIRouter()

@router.get("/", response_model=List[CategoriaResponse])
def listar_categorias(
    db: Session = Depends(get_db),
    admin: AdminContext = Depends(get_current_admin),
):
    query = db.query(Categoria).filter(Categoria.ativo == True)
    if not admin.escopo_total and admin.categoria_ids:
        query = query.filter(Categoria.id.in_(admin.categoria_ids))
    return query.order_by(Categoria.nome).all()
