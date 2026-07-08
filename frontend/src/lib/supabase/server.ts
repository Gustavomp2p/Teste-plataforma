import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import { getSupabaseEnv } from "@/lib/env";

/**
 * Formato normalizado do usuário autenticado, igual não importa se veio de
 * getClaims() (JWT local) ou de getUser() (fallback via rede). Isso evita
 * erros de tipagem em quem consome getAuthUser() (ex: auth-nav.tsx), já que
 * ambos os retornos originais têm shapes diferentes no TypeScript.
 */
export type AuthUser = {
  id: string;
  email?: string;
  user_metadata: Record<string, unknown>;
};

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
 * qualquer motivo, cai para getUser — só retorna claims/user null quando
 * realmente não há sessão, evitando deslogar por falha transitória.
 * O resultado já vem normalizado no formato AuthUser.
 */
const getValidatedSession = cache(async (): Promise<{
  user: AuthUser | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
}> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getClaims();
    if (!error && data?.claims) {
      const claims = data.claims as Record<string, unknown>;
      return {
        user: {
          id: String(claims.sub ?? ""),
          email: typeof claims.email === "string" ? claims.email : undefined,
          user_metadata: (claims.user_metadata as Record<string, unknown>) ?? {},
        },
        supabase,
      };
    }
  } catch {
    /* fallback abaixo */
  }

  const { data } = await supabase.auth.getUser();
  if (!data.user) return { user: null, supabase };

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata ?? {},
    },
    supabase,
  };
});

/**
 * Retorna o access token a partir da sessão já validada nesta requisição
 * (getValidatedSession acima). Evita chamadas concorrentes de getSession()/
 * getUser() que disparariam refresh duplicado do mesmo refresh token.
 */
export async function getAccessToken(): Promise<string | null> {
  const { user, supabase } = await getValidatedSession();
  if (!user) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Usuário autenticado, normalizado (ver tipo AuthUser). Reaproveitado dentro
 * da mesma requisição via cache().
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { user } = await getValidatedSession();
  return user;
}