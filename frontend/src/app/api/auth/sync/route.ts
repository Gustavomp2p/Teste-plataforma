import { NextResponse } from "next/server";
import { sincronizarPerfil } from "@/lib/api-server";

export async function POST() {
  try {
    const perfil = await sincronizarPerfil();
    return NextResponse.json(perfil);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao sincronizar perfil.";
    return NextResponse.json({ message }, { status: 401 });
  }
}
