import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Visão geral"
        description="Resumo da plataforma — dados reais após integração com a API."
      />
      <div className="flex-1 space-y-8 p-6 sm:p-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Demandas" value={0} hint="Aguardando backend" />
          <StatCard label="Projetos ativos" value={0} />
          <StatCard label="Empresas" value={0} />
          <StatCard label="Turmas" value={0} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Projetos recentes
          </h2>
          <EmptyState
            title="Nenhum projeto ainda"
            description="Quando o backend estiver pronto, os projetos qualificados aparecerão aqui para acompanhamento do squad."
          />
        </section>
      </div>
    </>
  );
}
