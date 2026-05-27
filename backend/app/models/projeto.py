from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class StatusProjeto(str, enum.Enum):
    aberto = "aberto"
    em_andamento = "em_andamento"
    concluido = "concluido"

class Projeto(Base):
    __tablename__ = "projetos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    descricao = Column(Text, nullable=False)
    tecnologias = Column(String(300))  # ex: "Python, React, PostgreSQL"
    status = Column(Enum(StatusProjeto), default=StatusProjeto.aberto)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    empresa = relationship("Empresa", backref="projetos")
