import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server Component — proxy renova a sessão */
        }
      },
    },
  });
}

/**
 * Retorna o access token validando via getClaims (verificação local do JWT,
 * sem round-trip ao servidor de auth). Evita o problema de "Invalid Refresh
 * Token: Already Used" que ocorre quando múltiplas chamadas concorrentes
 * (proxy + server components + route handlers) tentam usar getSession()/
 * getUser() e disparam refresh simultâneo do mesmo refresh token.
 */
export async function getAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  // getClaims não retorna o access_token bruto, então buscamos a sessão
  // já validada (sem forçar novo refresh, pois getClaims acima já garantiu
  // que a sessão é válida/atualizada nesta requisição).
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Sessao Supabase valida. Tenta getClaims (validacao local, sem round-trip) e,
 * se falhar por qualquer motivo, cai para getUser. So retorna null quando
 * realmente nao ha sessao — evita deslogar o usuario por falha transitoria.
 */
export async function getAuthUser() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getClaims();
    if (!error && data?.claims) return data.claims;
  } catch {
    /* fallback para getUser */
  }
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
