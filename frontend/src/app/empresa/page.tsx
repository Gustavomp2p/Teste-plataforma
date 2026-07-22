import Link from "next/link";
import { redirect, unstable_rethrow } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import {
  buscarPerfil,
  buscarEmpresaVinculada,
  listarProjetosEmpresa,
  ApiError,
} from "@/lib/api-server";
import { PAPEL_LABEL } from "@/lib/auth";
import { SITE } from "@/lib/constants";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ButtonLink } from "@/components/ui/button";
import type { StatusProjeto } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EmpresaPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login?redirect=/empresa");

  try {
    const perfil = await buscarPerfil();
    if (!perfil.is_empresa) redirect(perfil.painel_url);

    const vinculo = await buscarEmpresaVinculada();
    const projetos = await listarProjetosEmpresa();

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-bold text-brand-700">
              {SITE.name}
            </Link>
            <Link href="/auth/signout" prefetch={false} className="text-sm text-slate-500 hover:text-brand-600">
              Sair
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-bold text-slate-900">Painel da empresa</h1>
          <p className="mt-1 text-slate-500">Ola, {perfil.nome}</p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">E-mail</dt>
                <dd className="font-medium text-slate-900">{perfil.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Nivel de acesso</dt>
                <dd className="font-medium text-slate-900">
                  {PAPEL_LABEL[perfil.papel] ?? perfil.papel}
                </dd>
              </div>
            </dl>
          </div>

          {vinculo.vinculada && vinculo.empresa ? (
            <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-6">
              <h2 className="font-semibold text-brand-900">{vinculo.empresa.nome}</h2>
              <p className="mt-1 text-sm text-brand-800/80">
                CNPJ {vinculo.empresa.cnpj} · {vinculo.empresa.cidade ?? "Cidade nao informada"}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
              {vinculo.mensagem ??
                "Cadastre uma demanda com o mesmo e-mail para vincular sua empresa."}
              <div className="mt-4">
                <ButtonLink href="/#cadastro" variant="primary">
                  Cadastrar demanda
                </ButtonLink>
              </div>
            </div>
          )}

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Suas demandas</h2>
              <ButtonLink href="/#cadastro" variant="primary">
                Nova demanda
              </ButtonLink>
            </div>
            {projetos.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Nenhuma demanda encontrada para esta conta.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {projetos.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/empresa/demandas/${p.id}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-medium text-slate-900">{p.titulo}</h3>
                        <StatusBadge status={p.status as StatusProjeto} />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.descricao}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    );
  } catch (err) {
    unstable_rethrow(err);
    const msg = err instanceof ApiError ? err.message : "Erro ao carregar painel da empresa.";
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
