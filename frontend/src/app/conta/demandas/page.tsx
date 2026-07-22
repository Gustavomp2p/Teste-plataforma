import Link from "next/link";
import { redirect, unstable_rethrow } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil, listarDemandasDisponiveis, ApiError } from "@/lib/api-server";
import { SITE } from "@/lib/constants";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { StatusProjeto } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ContaDemandasPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login?redirect=/conta/demandas");

  try {
    const perfil = await buscarPerfil();
    if (perfil.is_empresa) redirect("/empresa");

    const demandas = await listarDemandasDisponiveis();

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-bold text-brand-700">
              {SITE.name}
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/conta" className="text-sm text-slate-500 hover:text-brand-600">
                Minha conta
              </Link>
              <Link
                href="/auth/signout"
                prefetch={false}
                className="text-sm text-slate-500 hover:text-brand-600"
              >
                Sair
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-bold text-slate-900">Demandas disponíveis</h1>
          <p className="mt-1 text-slate-500">
            Projetos aprovados pela equipe BFD para acompanhamento na plataforma.
          </p>

          {demandas.length === 0 ? (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-600">
                Nenhuma demanda disponível no momento. Volte em breve.
              </p>
            </div>
          ) : (
            <ul className="mt-8 space-y-3">
              {demandas.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/conta/demandas/${d.id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-medium text-slate-900">{d.titulo}</h2>
                      <StatusBadge status={d.status as StatusProjeto} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{d.descricao}</p>
                    {d.tipo_problema && (
                      <p className="mt-2 text-xs text-slate-400">{d.tipo_problema}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    );
  } catch (err) {
    unstable_rethrow(err);
    const msg = err instanceof ApiError ? err.message : "Erro ao carregar demandas.";
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{msg}</p>
          <Link href="/conta" className="mt-4 inline-block text-sm font-semibold text-brand-600">
            Voltar à conta
          </Link>
        </div>
      </div>
    );
  }
}
