from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

admin_categorias = Table(
    "admin_categorias",
    Base.metadata,
    Column("usuario_admin_id", Integer, ForeignKey("usuarios_admin.id", ondelete="CASCADE"), primary_key=True),
    Column("categoria_id", Integer, ForeignKey("categorias.id", ondelete="CASCADE"), primary_key=True),
)
