import { NextResponse } from "next/server";
import { ApiError, atualizarProjeto } from "@/lib/api-server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const projetoId = Number(id);
  if (!Number.isInteger(projetoId) || projetoId <= 0) {
    return NextResponse.json({ message: "ID inválido." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Requisição inválida." }, { status: 400 });
  }

  try {
    const projeto = await atualizarProjeto(projetoId, body as Parameters<typeof atualizarProjeto>[1]);
    return NextResponse.json(projeto);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Erro inesperado." }, { status: 500 });
  }
}
