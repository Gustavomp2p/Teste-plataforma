import Link from "next/link";
import { ApiErrorState } from "@/components/dashboard/api-error";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusSelect } from "@/components/dashboard/status-select";
import { ApiError, listarEmpresas, listarProjetos } from "@/lib/api-server";
import type { StatusProjeto } from "@/lib/api";
import { NIVEL_LABEL } from "@/lib/status";

export const metadata = { title: "Demandas" };
export const dynamic = "force-dynamic";

export default async function DemandasPage() {
  let demandas;
  let empresaMap: Map<number, { nome: string; cidade: string | null; segmento: string | null }>;
  try {
    const [projetos, empresas] = await Promise.all([listarProjetos(), listarEmpresas()]);
    demandas = projetos.filter((p) => p.status === "novo" || p.status === "aberto");
    empresaMap = new Map(
      empresas.map((e) => [e.id, { nome: e.nome, cidade: e.cidade, segmento: e.segmento }]),
    );
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Erro inesperado ao carregar dados.";
    return (
      <>
        <PageHeader title="Demandas" description="Fila de qualificação de novas oportunidades." />
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
        description="Novas oportunidades enviadas pelas empresas — início do fluxo de qualificação."
      />
      <div className="p-6 sm:p-8">
        {demandas.length === 0 ? (
          <EmptyState
            title="Fila de demandas vazia"
            description="Demandas com status “Novo” aparecem aqui. Altere para “Em análise” ao iniciar a qualificação."
          />
        ) : (
          <ul className="space-y-4">
            {demandas.map((demanda) => {
              const emp = empresaMap.get(demanda.empresa_id);
              return (
                <li key={demanda.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/projetos/${demanda.id}`}
                        className="font-semibold text-brand-600 hover:text-brand-500"
                      >
                        {demanda.titulo}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {emp?.nome ?? `Empresa #${demanda.empresa_id}`}
                        {emp?.cidade ? ` · ${emp.cidade}` : ""}
                        {emp?.segmento ? ` · ${emp.segmento}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">{demanda.descricao}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Urgência:{" "}
                        {demanda.urgencia ? NIVEL_LABEL[demanda.urgencia] ?? demanda.urgencia : "—"}
                      </p>
                    </div>
                    <StatusSelect
                      projetoId={demanda.id}
                      status={(demanda.status as StatusProjeto) || "novo"}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
