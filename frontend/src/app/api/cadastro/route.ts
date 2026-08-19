import { NextResponse } from "next/server";
import { ApiError, criarDemandaEmpresa } from "@/lib/api-server";
import { getAuthUser } from "@/lib/supabase/server";
import type { Nivel } from "@/lib/api";

type CadastroPayload = {
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
  // Nome, CNPJ e e-mail saem da conta da empresa — o formulario nao os coleta
  // mais, senao cada envio criava uma empresa nova e a demanda sumia do painel.
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "Entre com a conta da sua empresa para cadastrar uma demanda." },
      { status: 401 },
    );
  }

  let payload: CadastroPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: "Requisição inválida." }, { status: 400 });
  }

  const telefone = texto(payload.telefone);
  const responsavel_nome = texto(payload.responsavel_nome);
  const cidade = texto(payload.cidade);
  const segmento = texto(payload.segmento);
  const tipo_problema = texto(payload.tipo_problema);
  const titulo = texto(payload.titulo) || tipo_problema;
  const descricao = texto(payload.descricao);
  const tecnologias = texto(payload.tecnologias);
  const urgenciaRaw = texto(payload.urgencia);
  const urgencia = URGENCIAS.has(urgenciaRaw) ? (urgenciaRaw as Nivel) : null;

  const faltando: string[] = [];
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
    const projeto = await criarDemandaEmpresa({
      titulo,
      tipo_problema,
      descricao,
      tecnologias: tecnologias || null,
      urgencia,
      responsavel_nome,
      telefone: telefone || null,
      cidade,
      segmento,
      aceita_contato: bool(payload.aceita_contato),
    });

    return NextResponse.json(
      {
        message:
          "Demanda registrada com sucesso! Nossa equipe entrará em contato para qualificar a oportunidade.",
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
