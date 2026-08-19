import { NextResponse } from "next/server";
import { ApiError, cancelarDemandaEmpresa } from "@/lib/api-server";
import { getAuthUser } from "@/lib/supabase/server";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Sessão expirada." }, { status: 401 });
  }

  const { id } = await params;
  const demandaId = Number(id);
  if (!Number.isInteger(demandaId) || demandaId <= 0) {
    return NextResponse.json({ message: "ID inválido." }, { status: 400 });
  }

  try {
    // A posse da demanda é validada no backend contra a empresa da sessão.
    const projeto = await cancelarDemandaEmpresa(demandaId);
    return NextResponse.json(projeto);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Erro inesperado ao cancelar a demanda." }, { status: 500 });
  }
}
