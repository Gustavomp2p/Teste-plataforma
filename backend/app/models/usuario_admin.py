from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.models.admin_categoria import admin_categorias


class PapelAdmin:
    SUPER = "super_admin"
    COORDENADOR = "coordenador"
    ANALISTA = "analista"


class UsuarioAdmin(Base):
    __tablename__ = "usuarios_admin"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    auth_user_id = Column(UUID(as_uuid=True), unique=True, nullable=True)
    papel = Column(String(30), default=PapelAdmin.ANALISTA, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    categorias = relationship("Categoria", secondary=admin_categorias, lazy="joined")

    def pode_ver_todos_projetos(self) -> bool:
        return self.papel in (PapelAdmin.SUPER, PapelAdmin.COORDENADOR)

    def categoria_ids_permitidos(self) -> list[int]:
        if self.pode_ver_todos_projetos():
            return []
        return [c.id for c in self.categorias]
