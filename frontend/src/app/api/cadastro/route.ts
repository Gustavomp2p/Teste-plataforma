import { NextResponse } from "next/server";
import { ApiError, criarEmpresa, criarProjeto } from "@/lib/api";
import type { Nivel } from "@/lib/api";

type CadastroPayload = {
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  responsavel_nome?: string;
  cidade?: string;
  segmento?: string;
  aceita_contato?: boolean | string;
  titulo?: string;
  tipo_problema?: string;
  descricao?: string;
  tecnologias?: string;
  urgencia?: string;
  categoria_slug?: string;
};

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

function bool(valor: unknown): boolean {
  if (typeof valor === "boolean") return valor;
  if (valor === "false" || valor === "0") return false;
  return true;
}

const URGENCIAS = new Set(["baixa", "media", "alta"]);

export async function POST(req: Request) {
  let payload: CadastroPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: "Requisição inválida." }, { status: 400 });
  }

  const nome = texto(payload.nome);
  const cnpj = texto(payload.cnpj);
  const email = texto(payload.email);
  const telefone = texto(payload.telefone);
  const responsavel_nome = texto(payload.responsavel_nome);
  const cidade = texto(payload.cidade);
  const segmento = texto(payload.segmento);
  const tipo_problema = texto(payload.tipo_problema);
  const titulo = texto(payload.titulo) || tipo_problema || "Demanda empresarial";
  const descricao = texto(payload.descricao);
  const tecnologias = texto(payload.tecnologias);
  const urgenciaRaw = texto(payload.urgencia);
  const urgencia = URGENCIAS.has(urgenciaRaw) ? (urgenciaRaw as Nivel) : null;

  const faltando: string[] = [];
  if (!nome) faltando.push("nome da empresa");
  if (!cnpj) faltando.push("CNPJ");
  if (!email) faltando.push("e-mail");
  if (!responsavel_nome) faltando.push("nome do responsável");
  if (!cidade) faltando.push("cidade");
  if (!segmento) faltando.push("segmento");
  if (!tipo_problema) faltando.push("tipo de problema");
  if (!descricao) faltando.push("descrição da necessidade");

  if (faltando.length > 0) {
    return NextResponse.json(
      { message: `Preencha: ${faltando.join(", ")}.` },
      { status: 400 },
    );
  }

  try {
    const empresa = await criarEmpresa({
      nome,
      cnpj,
      email,
      telefone: telefone || null,
      responsavel_nome,
      cidade,
      segmento,
      aceita_contato: bool(payload.aceita_contato),
      descricao: descricao || null,
    });

    const projeto = await criarProjeto({
      titulo,
      descricao,
      tecnologias: tecnologias || null,
      tipo_problema,
      urgencia,
      empresa_id: empresa.id,
    });

    return NextResponse.json(
      {
        message:
          "Demanda registrada com sucesso! Nossa equipe entrará em contato para qualificar a oportunidade.",
        empresa_id: empresa.id,
        projeto_id: projeto.id,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Erro inesperado ao cadastrar a demanda." }, { status: 500 });
  }
}
