import { ApiErrorState } from "@/components/dashboard/api-error";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusSelect } from "@/components/dashboard/status-select";
import { ApiError, listarEmpresas, listarProjetos } from "@/lib/api";

export const metadata = { title: "Projetos" };
export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
  let projetos;
  let empresaNome: Map<number, string>;
  try {
    const [listaProjetos, empresas] = await Promise.all([
      listarProjetos(),
      listarEmpresas(),
    ]);
    projetos = listaProjetos;
    empresaNome = new Map(empresas.map((e) => [e.id, e.nome]));
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Erro inesperado ao carregar dados.";
    return (
      <>
        <PageHeader
          title="Projetos"
          description="Projetos tecnológicos estruturados a partir das demandas."
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
        title="Projetos"
        description="Projetos tecnológicos estruturados a partir das demandas."
      />
      <div className="p-6 sm:p-8">
        {projetos.length === 0 ? (
          <EmptyState
            title="Nenhum projeto cadastrado"
            description="Quando uma empresa cadastrar um desafio na landing, o projeto aparecerá aqui."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Título</th>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Tecnologias</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projetos.map((projeto) => (
                  <tr key={projeto.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{projeto.titulo}</p>
                      <p className="mt-0.5 max-w-md text-xs text-slate-500">
                        {projeto.descricao}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {empresaNome.get(projeto.empresa_id) ??
                        `#${projeto.empresa_id}`}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {projeto.tecnologias || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusSelect
                        projetoId={projeto.id}
                        status={projeto.status}
                      />
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
