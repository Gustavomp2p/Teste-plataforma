import { ApiErrorState } from "@/components/dashboard/api-error";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ApiError, listarEmpresas } from "@/lib/api-server";

export const metadata = { title: "Empresas" };
export const dynamic = "force-dynamic";

export default async function EmpresasPage() {
  let empresas;
  try {
    empresas = await listarEmpresas();
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Erro inesperado ao carregar dados.";
    return (
      <>
        <PageHeader title="Empresas" description="Organizações que cadastraram demandas." />
        <div className="p-6 sm:p-8">
          <ApiErrorState message={message} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Organizações que cadastraram demandas na plataforma."
      />
      <div className="p-6 sm:p-8">
        {empresas.length === 0 ? (
          <EmptyState
            title="Nenhuma empresa cadastrada"
            description="O formulário da landing cadastra empresas diretamente na API."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Responsável</th>
                  <th className="px-5 py-3 font-medium">Cidade</th>
                  <th className="px-5 py-3 font-medium">Segmento</th>
                  <th className="px-5 py-3 font-medium">Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {empresas.map((empresa) => (
                  <tr key={empresa.id}>
                    <td className="px-5 py-4 font-medium text-slate-900">{empresa.nome}</td>
                    <td className="px-5 py-4 text-slate-600">{empresa.responsavel_nome ?? "—"}</td>
                    <td className="px-5 py-4 text-slate-600">{empresa.cidade ?? "—"}</td>
                    <td className="px-5 py-4 text-slate-600">{empresa.segmento ?? "—"}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{empresa.email}</p>
                      {empresa.telefone && (
                        <p className="text-xs text-slate-400">{empresa.telefone}</p>
                      )}
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
