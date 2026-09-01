import { NextResponse } from "next/server";
import { ApiError, cancelarDemandaEmpresa } from "@/lib/api-server";
import { getAuthUser } from "@/lib/supabase/server";
import { MOTIVOS_CANCELAMENTO } from "@/lib/status";

type CancelamentoPayload = {
  motivo?: string;
  observacao?: string;
};

export async function PATCH(
  req: Request,
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

  let payload: CancelamentoPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: "Requisição inválida." }, { status: 400 });
  }

  const motivo = typeof payload.motivo === "string" ? payload.motivo.trim() : "";
  if (!motivo) {
    return NextResponse.json(
      { message: "Selecione o motivo do cancelamento." },
      { status: 400 },
    );
  }
  if (!(MOTIVOS_CANCELAMENTO as readonly string[]).includes(motivo)) {
    return NextResponse.json(
      { message: "Motivo de cancelamento inválido." },
      { status: 400 },
    );
  }

  const observacao =
    typeof payload.observacao === "string" ? payload.observacao.trim() : "";

  try {
    // A posse da demanda é validada no backend contra a empresa da sessão.
    const projeto = await cancelarDemandaEmpresa(demandaId, {
      motivo,
      observacao: observacao || null,
    });
    return NextResponse.json(projeto);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Erro inesperado ao cancelar a demanda." }, { status: 500 });
  }
}
