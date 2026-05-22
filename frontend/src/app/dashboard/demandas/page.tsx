import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Demandas" };

export default function DemandasPage() {
  return (
    <>
      <PageHeader
        title="Demandas"
        description="Necessidades enviadas pelas empresas — fila de qualificação."
      />
      <div className="p-6 sm:p-8">
        <EmptyState
          title="Fila de demandas vazia"
          description="Fluxo previsto: empresa cadastra → plataforma qualifica → vira projeto."
        />
      </div>
    </>
  );
}
