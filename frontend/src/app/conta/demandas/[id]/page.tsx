import Link from "next/link";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil, buscarDemandaDisponivel, ApiError } from "@/lib/api-server";
import { SITE } from "@/lib/constants";
import { DemandaDetalheView } from "@/components/demandas/demanda-detalhe-view";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Demanda #${id}` };
}

export default async function ContaDemandaDetalhePage({ params }: PageProps) {
  const user = await getAuthUser();
  if (!user) redirect("/login?redirect=/conta/demandas");

  const { id } = await params;
  const demandaId = Number(id);
  if (!Number.isInteger(demandaId)) notFound();

  try {
    const perfil = await buscarPerfil();
    if (perfil.is_empresa) redirect("/empresa");

    const demanda = await buscarDemandaDisponivel(demandaId);

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-bold text-brand-700">
              {SITE.name}
            </Link>
            <Link
              href="/auth/signout"
              prefetch={false}
              className="text-sm text-slate-500 hover:text-brand-600"
            >
              Sair
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-10">
          <DemandaDetalheView
            {...demanda}
            backHref="/conta/demandas"
            backLabel="Voltar para demandas"
            mostrarContatoEmpresa={false}
          />
        </main>
      </div>
    );
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof ApiError && err.status === 404) notFound();
    const msg = err instanceof ApiError ? err.message : "Erro ao carregar demanda.";
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{msg}</p>
          <Link
            href="/conta/demandas"
            className="mt-4 inline-block text-sm font-semibold text-brand-600"
          >
            Voltar para demandas
          </Link>
        </div>
      </div>
    );
  }
}
