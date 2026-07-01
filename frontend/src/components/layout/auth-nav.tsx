import Link from "next/link";
import { Suspense } from "react";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil } from "@/lib/api-server";
import { ButtonLink } from "@/components/ui/button";

async function AuthNavContent() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <ButtonLink href="/login" variant="ghost" className="hidden px-3 sm:inline-flex">
        Entrar
      </ButtonLink>
    );
  }

  let painelUrl = "/conta";
  let nome = user.email?.split("@")[0] ?? "Conta";

  try {
    const perfil = await buscarPerfil();
    painelUrl = perfil.painel_url;
    nome = perfil.nome;
  } catch {
    const tipo = (user.user_metadata?.tipo_conta as string | undefined)?.toLowerCase();
    if (tipo === "empresa") painelUrl = "/empresa";
    const metaNome = user.user_metadata?.nome as string | undefined;
    if (metaNome) nome = metaNome;
  }

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
