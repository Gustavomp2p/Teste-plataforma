from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class StatusProjeto(str, enum.Enum):
    novo = "novo"
    em_analise = "em_analise"
    em_contato = "em_contato"
    aprovado_turma = "aprovado_turma"
    reprovado = "reprovado"
    estruturado = "estruturado"

class Nivel(str, enum.Enum):
    baixa = "baixa"
    media = "media"
    alta = "alta"

class Projeto(Base):
    __tablename__ = "projetos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    descricao = Column(Text, nullable=False)
    tecnologias = Column(String(300))
    tipo_problema = Column(String(150))
    urgencia = Column(String(20))
    status = Column(String(30), default=StatusProjeto.novo.value)
    complexidade = Column(String(20))
    prioridade = Column(String(20))
    observacoes_internas = Column(Text)
    briefing_contexto = Column(Text)
    briefing_objetivo = Column(Text)
    briefing_escopo = Column(Text)
    briefing_requisitos = Column(Text)
    briefing_resultado = Column(Text)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    empresa = relationship("Empresa", back_populates="projetos")
    categoria = relationship("Categoria")
