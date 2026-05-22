import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Empresas" };

export default function EmpresasPage() {
  return (
    <>
      <PageHeader
        title="Empresas"
        description="Organizações que cadastraram demandas na plataforma."
      />
      <div className="p-6 sm:p-8">
        <EmptyState
          title="Nenhuma empresa cadastrada"
          description="Formulário de cadastro na landing será conectado à API do backend."
        />
      </div>
    </>
  );
}
