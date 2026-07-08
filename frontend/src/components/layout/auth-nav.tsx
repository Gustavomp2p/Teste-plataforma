import Link from "next/link";
import { Suspense } from "react";
import { getAuthUser } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button";

// O estado de login do header depende SOMENTE do Supabase (rapido e confiavel).
// Nao chamamos o backend aqui: se o backend estiver lento/fora (cold start no
// Render), o usuario logado nao pode aparecer como "Entrar".
async function AuthNavContent() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <ButtonLink href="/login" variant="ghost" className="hidden px-3 sm:inline-flex">
        Entrar
      </ButtonLink>
    );
  }

  const tipo = (user.user_metadata?.tipo_conta as string | undefined)?.toLowerCase();
  const painelUrl = tipo === "empresa" ? "/empresa" : "/conta";
  const nome =
    (user.user_metadata?.nome as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Conta";

  return (
    <>
      <Link
        href={painelUrl}
        className="hidden text-sm font-medium text-brand-700 hover:text-brand-600 sm:inline"
      >
        Ola, {nome}
      </Link>
      <Link href="/auth/signout" className="hidden text-xs text-slate-500 hover:text-brand-600 sm:inline">
        Sair
      </Link>
    </>
  );
}

export function AuthNav() {
  return (
    <Suspense
      fallback={
        <ButtonLink href="/login" variant="ghost" className="hidden px-3 sm:inline-flex">
          Entrar
        </ButtonLink>
      }
    >
      <AuthNavContent />
    </Suspense>
  );
}
