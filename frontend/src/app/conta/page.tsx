import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buscarPerfil, ApiError } from "@/lib/api-server";
import { PAPEL_LABEL, type PapelUsuario } from "@/lib/auth";
import { SITE } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  try {
    const perfil = await buscarPerfil();
    if (perfil.is_empresa) redirect("/empresa");

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-bold text-brand-700">
              {SITE.name}
            </Link>
            <Link href="/auth/signout" className="text-sm text-slate-500 hover:text-brand-600">
              Sair
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="text-2xl font-bold text-slate-900">Olá, {perfil.nome}</h1>
          <p className="mt-1 text-slate-500">Sua área na plataforma BFD</p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">E-mail</dt>
                <dd className="font-medium text-slate-900">{perfil.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Nível de acesso</dt>
                <dd className="font-medium text-slate-900">
                  {PAPEL_LABEL[perfil.papel as PapelUsuario] ?? perfil.papel}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-900">Cadastrar demanda</h2>
              <p className="mt-2 text-sm text-slate-500">
                Envie uma nova demanda tecnológica para o programa.
              </p>
              <ButtonLink href="/#cadastro" variant="primary" className="mt-4">
                Ir para cadastro
              </ButtonLink>
            </div>

            {perfil.is_admin ? (
              <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
                <h2 className="font-semibold text-brand-900">Painel administrativo</h2>
                <p className="mt-2 text-sm text-brand-800/80">
                  Gerencie projetos, empresas e qualificacoes.
                </p>
                <ButtonLink href="/dashboard" variant="primary" className="mt-4">
                  Abrir painel admin
                </ButtonLink>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-semibold text-slate-900">Acompanhar demandas</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Use o mesmo e-mail do cadastro para que sua demanda seja vinculada à sua conta.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  } catch (err) {
    const msg = err instanceof ApiError ? err.message : "Erro ao carregar perfil.";
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{msg}</p>
          <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-brand-600">
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }
}
