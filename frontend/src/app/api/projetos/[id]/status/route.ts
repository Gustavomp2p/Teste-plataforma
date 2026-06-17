import { NextResponse } from "next/server";
import { ApiError, atualizarStatusProjeto, type StatusProjeto } from "@/lib/api";
import { STATUS_OPTIONS } from "@/lib/status";

/** Atualiza o status de um projeto (usado pelo painel/dashboard). */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const projetoId = Number(id);

  if (!Number.isInteger(projetoId) || projetoId <= 0) {
    return NextResponse.json({ message: "ID inválido." }, { status: 400 });
  }

  let status: unknown;
  try {
    ({ status } = await req.json());
  } catch {
    return NextResponse.json({ message: "Requisição inválida." }, { status: 400 });
  }

  if (!STATUS_OPTIONS.includes(status as StatusProjeto)) {
    return NextResponse.json(
      { message: "Status inválido. Use: aberto, em_andamento ou concluido." },
      { status: 400 },
    );
  }

  try {
    const projeto = await atualizarStatusProjeto(projetoId, status as StatusProjeto);
    return NextResponse.json(projeto);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { message: "Erro inesperado ao atualizar o status." },
      { status: 500 },
    );
  }
}
