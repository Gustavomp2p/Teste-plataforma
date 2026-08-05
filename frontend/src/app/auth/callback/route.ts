import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sincronizarPerfil, verificarContaExistente } from "@/lib/api-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Google só entra se já existir conta local (cadastro prévio usuario/empresa).
      try {
        const conta = await verificarContaExistente();
        if (!conta.exists) {
          await supabase.auth.signOut();
          return NextResponse.redirect(
            `${origin}/login?mode=signup&error=google_needs_account`,
          );
        }
      } catch {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/login?mode=signup&error=google_needs_account`,
        );
      }

      try {
        const perfil = await sincronizarPerfil();
        next = perfil.painel_url || next;
      } catch {
        /* perfil será carregado no próximo acesso autenticado */
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
