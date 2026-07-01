import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sincronizarPerfil } from "@/lib/api-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/conta";
  if (!next.startsWith("/")) next = "/conta";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      try {
        const perfil = await sincronizarPerfil();
        next = perfil.painel_url || next;
      } catch {
        /* perfil será criado no próximo acesso autenticado */
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
