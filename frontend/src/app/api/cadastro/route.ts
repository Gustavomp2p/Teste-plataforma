import { NextResponse } from "next/server";
import { ApiError, criarEmpresa, criarProjeto } from "@/lib/api";

/**
 * Endpoint público usado pelo formulário da landing.
 *
 * Recebe os dados da empresa + do desafio, cria a empresa no backend e, em
 * seguida, o projeto vinculado. Mantém a URL do backend no servidor e devolve
 * mensagens de erro em português.
 */

type CadastroPayload = {
  // empresa
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  // projeto
  titulo?: string;
  descricao?: string;
  tecnologias?: string;
};

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export async function POST(req: Request) {
  let payload: CadastroPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Requisição inválida." },
      { status: 400 },
    );
  }

  const nome = texto(payload.nome);
  const cnpj = texto(payload.cnpj);
  const email = texto(payload.email);
  const telefone = texto(payload.telefone);
  const titulo = texto(payload.titulo);
  const descricao = texto(payload.descricao);
  const tecnologias = texto(payload.tecnologias);

  const faltando: string[] = [];
  if (!nome) faltando.push("nome da empresa");
  if (!cnpj) faltando.push("CNPJ");
  if (!email) faltando.push("e-mail");
  if (!titulo) faltando.push("título do desafio");
  if (!descricao) faltando.push("descrição do desafio");

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
      descricao: descricao || null,
    });

    const projeto = await criarProjeto({
      titulo,
      descricao,
      tecnologias: tecnologias || null,
      empresa_id: empresa.id,
    });

    return NextResponse.json(
      {
        message: "Desafio cadastrado com sucesso! Em breve entraremos em contato.",
        empresa_id: empresa.id,
        projeto_id: projeto.id,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { message: "Erro inesperado ao cadastrar o desafio." },
      { status: 500 },
    );
  }
}
