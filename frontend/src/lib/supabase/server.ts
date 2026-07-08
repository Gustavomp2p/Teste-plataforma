import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import { getSupabaseEnv } from "@/lib/env";

/**
 * cache() garante que, dentro de UMA MESMA requisição (SSR), todas as
 * chamadas a createClient() reutilizem a MESMA instância do client Supabase.
 * Sem isso, cada chamada (ex: getAuthUser() e getAccessToken() na mesma
 * página) cria um client novo e independente. Se dois clients tentam
 * validar/renovar a mesma sessão ao mesmo tempo, um deles pode falhar com
 * "Invalid Refresh Token: Already Used" e derrubar a sessão inteira —
 * causando logout ao simplesmente atualizar a página (F5).
 */
export const createClient = cache(async () => {
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
});

/**
 * Também memoizado por requisição: garante que a validação de sessão
 * (getClaims, com fallback para getUser) só rode UMA VEZ por requisição,
 * não importa quantas vezes getAuthUser()/getAccessToken() sejam chamados.
 * Tenta getClaims (validação local, sem round-trip) e, se falhar por
 * qualquer motivo, cai para getUser — só retorna claims null quando
 * realmente não há sessão, evitando deslogar por falha transitória.
 */
const getValidatedSession = cache(async () => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getClaims();
    if (!error && data?.claims) return { claims: data.claims, supabase };
  } catch {
    /* fallback abaixo */
  }
  return { claims: null as Record<string, unknown> | null, supabase };
});

/**
 * Retorna o access token a partir da sessão já validada nesta requisição
 * (getValidatedSession acima). Evita chamadas concorrentes de getSession()/
 * getUser() que disparariam refresh duplicado do mesmo refresh token.
 */
export async function getAccessToken(): Promise<string | null> {
  const { claims, supabase } = await getValidatedSession();
  if (!claims) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Sessao Supabase validada. Tenta getClaims (validação local, sem round-trip)
 * e, se falhar, cai para getUser (feito dentro de getValidatedSession). Só
 * retorna null quando realmente não há sessão — evita deslogar o usuário por
 * falha transitória. Reaproveitada dentro da mesma requisição via cache().
 */
export async function getAuthUser() {
  const { claims, supabase } = await getValidatedSession();
  if (claims) return claims;

  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}