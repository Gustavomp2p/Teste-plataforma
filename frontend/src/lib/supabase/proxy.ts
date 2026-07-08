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

  // getClaims valida o JWT localmente (via JWKS) em vez de chamar
  // getUser(), que sempre bate no servidor de Auth. Isso evita a corrida
  // de refresh token quando várias requisições/rotas tentam renovar a
  // sessão ao mesmo tempo (erro "Invalid Refresh Token: Already Used"),
  // que era a causa provável do logout ao trocar de página.
  const { data, error } = await supabase.auth.getClaims();
  const user = !error && data?.claims ? data.claims : null;
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

  if (isProtected && !user) {
    return redirectTo("/login", (u) => u.searchParams.set("redirect", pathname));
  }

  if (user && pathname === "/login") {
    const dest = request.nextUrl.searchParams.get("redirect") || "/conta";
    return redirectTo(dest, (u) => u.searchParams.delete("redirect"));
  }

  return supabaseResponse;
}
