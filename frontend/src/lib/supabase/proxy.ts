import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { url: supabaseUrl, key: supabaseKey } = getSupabaseEnv();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Valida a sessao com getUser (compativel com qualquer configuracao de chave
  // do Supabase). Protecao contra corrida de refresh fica por conta do fail-open
  // abaixo + prefetch desligado na navegacao do dashboard.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Existe cookie de sessao do Supabase? (sb-<ref>-auth-token[.n])
  const hasSessionCookie = request.cookies
    .getAll()
    .some((c) => /^sb-.*-auth-token/.test(c.name));

  const pathname = request.nextUrl.pathname;

  // Redireciona preservando os cookies renovados da sessao (evita perder o login).
  const redirectTo = (path: string, mutate?: (u: URL) => void) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    mutate?.(url);
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
    return res;
  };

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/conta") ||
    pathname.startsWith("/empresa");

  // So manda para o login quando NAO ha sessao validada E NAO ha cookie de sessao.
  // Se a validacao falhou (rate limit / erro transitorio) mas o cookie existe,
  // deixa passar: a pagina revalida e nao deslogamos o usuario indevidamente.
  if (isProtected && !user && !hasSessionCookie) {
    return redirectTo("/login", (u) => u.searchParams.set("redirect", pathname));
  }

  if (user && pathname === "/login") {
    const dest = request.nextUrl.searchParams.get("redirect") || "/conta";
    return redirectTo(dest, (u) => u.searchParams.delete("redirect"));
  }

  return supabaseResponse;
}
