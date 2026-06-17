from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cnpj = Column(String(18), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    telefone = Column(String(20))
    responsavel_nome = Column(String(150))
    cidade = Column(String(100))
    segmento = Column(String(100))
    aceita_contato = Column(Boolean, default=True)
    descricao = Column(Text)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    projetos = relationship("Projeto", back_populates="empresa")
