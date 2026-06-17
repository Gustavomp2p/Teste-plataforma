import { ApiErrorState } from "@/components/dashboard/api-error";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusSelect } from "@/components/dashboard/status-select";
import { ApiError, listarEmpresas, listarProjetos } from "@/lib/api";

export const metadata = { title: "Demandas" };
export const dynamic = "force-dynamic";

export default async function DemandasPage() {
  let demandas;
  let empresaNome: Map<number, string>;
  try {
    const [projetos, empresas] = await Promise.all([
      listarProjetos(),
      listarEmpresas(),
    ]);
    demandas = projetos.filter((p) => p.status === "aberto");
    empresaNome = new Map(empresas.map((e) => [e.id, e.nome]));
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Erro inesperado ao carregar dados.";
    return (
      <>
        <PageHeader
          title="Demandas"
          description="Necessidades enviadas pelas empresas — fila de qualificação."
        />
        <div className="p-6 sm:p-8">
          <ApiErrorState message={message} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Demandas"
        description="Necessidades enviadas pelas empresas — fila de qualificação."
      />
      <div className="p-6 sm:p-8">
        {demandas.length === 0 ? (
          <EmptyState
            title="Fila de demandas vazia"
            description="Demandas com status “aberto” aparecem aqui. Ao iniciar a qualificação, mude o status para “Em andamento”."
          />
        ) : (
          <ul className="space-y-4">
            {demandas.map((demanda) => (
              <li
                key={demanda.id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{demanda.titulo}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {empresaNome.get(demanda.empresa_id) ??
                        `Empresa #${demanda.empresa_id}`}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{demanda.descricao}</p>
                    {demanda.tecnologias && (
                      <p className="mt-2 text-xs text-slate-500">
                        Tecnologias: {demanda.tecnologias}
                      </p>
                    )}
                  </div>
                  <StatusSelect projetoId={demanda.id} status={demanda.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
