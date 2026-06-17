import Link from "next/link";
import { ApiErrorState } from "@/components/dashboard/api-error";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ApiError, listarEmpresas, listarProjetos } from "@/lib/api-server";
import type { StatusProjeto } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const [empresas, projetos] = await Promise.all([listarEmpresas(), listarProjetos()]);

    const novos = projetos.filter((p) => p.status === "novo" || p.status === "aberto").length;
    const emAnalise = projetos.filter(
      (p) => p.status === "em_analise" || p.status === "em_andamento" || p.status === "em_contato",
    ).length;
    const estruturados = projetos.filter(
      (p) => p.status === "estruturado" || p.status === "aprovado_turma" || p.status === "concluido",
    ).length;
    const recentes = [...projetos]
      .sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime())
      .slice(0, 5);

    return (
      <>
        <PageHeader
          title="Visão geral"
          description="Indicadores do programa — empresas, demandas e projetos em gestão."
        />
        <div className="flex-1 space-y-8 p-6 sm:p-8">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Demandas novas" value={novos} />
            <StatCard label="Em qualificação" value={emAnalise} />
            <StatCard label="Estruturados / aprovados" value={estruturados} />
            <StatCard label="Empresas" value={empresas.length} />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Projetos recentes</h2>
            {recentes.length === 0 ? (
              <EmptyState
                title="Nenhum projeto ainda"
                description="As demandas cadastradas na landing aparecerão aqui."
              />
            ) : (
              <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {recentes.map((projeto) => (
                  <li key={projeto.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/projetos/${projeto.id}`}
                        className="truncate font-medium text-brand-600 hover:text-brand-500"
                      >
                        {projeto.titulo}
                      </Link>
                      <p className="truncate text-sm text-slate-500">{projeto.tipo_problema}</p>
                    </div>
                    <StatusBadge status={(projeto.status as StatusProjeto) || "novo"} />
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <Link
                href="/dashboard/projetos"
                className="text-sm font-semibold text-brand-600 hover:text-brand-500"
              >
                Ver todos os projetos →
              </Link>
            </div>
          </section>
        </div>
      </>
    );
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Erro inesperado ao carregar dados.";
    return (
      <>
        <PageHeader title="Visão geral" />
        <div className="p-6 sm:p-8">
          <ApiErrorState message={message} />
        </div>
      </>
    );
  }
}
