import Link from "next/link";
import { ApiErrorState } from "@/components/dashboard/api-error";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjetoFilters } from "@/components/dashboard/projeto-filters";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { StatusSelect } from "@/components/dashboard/status-select";
import { ApiError, listarEmpresas, listarProjetos } from "@/lib/api-server";
import type { StatusProjeto } from "@/lib/api";
import { NIVEL_LABEL } from "@/lib/status";

export const metadata = { title: "Projetos" };
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    status?: string;
    cidade?: string;
    segmento?: string;
    complexidade?: string;
  }>;
};

export default async function ProjetosPage({ searchParams }: PageProps) {
  const params = await searchParams;

  let projetos;
  let empresaNome: Map<number, string>;
  try {
    const [lista, empresas] = await Promise.all([
      listarProjetos({
        status: params.status,
        cidade: params.cidade,
        segmento: params.segmento,
        complexidade: params.complexidade,
      }),
      listarEmpresas(),
    ]);
    projetos = lista;
    empresaNome = new Map(empresas.map((e) => [e.id, e.nome]));
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Erro inesperado ao carregar dados.";
    return (
      <>
        <PageHeader title="Projetos" description="Demandas qualificadas e em gestão." />
        <div className="p-6 sm:p-8">
          <ApiErrorState message={message} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Projetos"
        description="Demandas captadas, com filtros por status, cidade, segmento e complexidade."
      />
      <div className="p-6 sm:p-8">
        <ProjetoFilters
          status={params.status}
          cidade={params.cidade}
          segmento={params.segmento}
          complexidade={params.complexidade}
        />
        {projetos.length === 0 ? (
          <EmptyState
            title="Nenhum projeto encontrado"
            description="Ajuste os filtros ou aguarde novos cadastros pela landing."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Título</th>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Urgência</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projetos.map((projeto) => (
                  <tr key={projeto.id} className="align-top">
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/projetos/${projeto.id}`}
                        className="font-medium text-brand-600 hover:text-brand-500"
                      >
                        {projeto.titulo}
                      </Link>
                      <p className="mt-0.5 max-w-md text-xs text-slate-500">{projeto.tipo_problema}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {empresaNome.get(projeto.empresa_id) ?? `#${projeto.empresa_id}`}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {projeto.urgencia ? NIVEL_LABEL[projeto.urgencia] ?? projeto.urgencia : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusSelect
                        projetoId={projeto.id}
                        status={(projeto.status as StatusProjeto) || "novo"}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/projetos/${projeto.id}`}
                        className="text-xs font-semibold text-slate-500 hover:text-brand-600"
                      >
                        Detalhes →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
