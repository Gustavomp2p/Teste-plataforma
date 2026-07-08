import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import { getSupabaseEnv } from "@/lib/env";

/**
 * cache() garante que, dentro de UMA MESMA requisição (SSR), todas as
 * chamadas a createClient() reutilizem a MESMA instância do client Supabase.
 * Sem isso, cada chamada cria um client novo e independente; se dois tentam
 * renovar a mesma sessão ao mesmo tempo, um falha com "Invalid Refresh Token:
 * Already Used" e derruba a sessão — causando logout ao atualizar/navegar.
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
 * Valida a sessão UMA vez por requisição (memoizada). Usa getUser, que é
 * compatível com qualquer configuração de chave do Supabase (getClaims exige
 * chaves de assinatura assimétricas e falhava quando não estão ativas).
 */
const getValidatedSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, supabase };
});

export async function getAccessToken(): Promise<string | null> {
  const { user, supabase } = await getValidatedSession();
  if (!user) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/** Sessao Supabase valida (getUser — compativel com qualquer tipo de chave). */
export async function getAuthUser() {
  const { user } = await getValidatedSession();
  return user;
}
