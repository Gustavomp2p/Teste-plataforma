import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
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
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
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
    const dest = request.nextUrl.searchParams.get("redirect") || "/";
    return redirectTo(dest, (u) => u.searchParams.delete("redirect"));
  }

  return supabaseResponse;
}
