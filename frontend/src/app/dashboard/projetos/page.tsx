import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Projetos" };

export default function ProjetosPage() {
  return (
    <>
      <PageHeader
        title="Projetos"
        description="Projetos tecnológicos estruturados a partir das demandas."
      />
      <div className="p-6 sm:p-8">
        <EmptyState
          title="Lista de projetos"
          description="Placeholder da Sprint 1. Alinhar com o backend os campos: título, empresa, status, turma."
        />
      </div>
    </>
  );
}
