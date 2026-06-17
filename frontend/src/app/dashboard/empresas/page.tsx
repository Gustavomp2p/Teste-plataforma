import { ApiErrorState } from "@/components/dashboard/api-error";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ApiError, listarEmpresas } from "@/lib/api";

export const metadata = { title: "Empresas" };
export const dynamic = "force-dynamic";

export default async function EmpresasPage() {
  let empresas;
  try {
    empresas = await listarEmpresas();
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Erro inesperado ao carregar dados.";
    return (
      <>
        <PageHeader
          title="Empresas"
          description="Organizações que cadastraram demandas na plataforma."
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
        title="Empresas"
        description="Organizações que cadastraram demandas na plataforma."
      />
      <div className="p-6 sm:p-8">
        {empresas.length === 0 ? (
          <EmptyState
            title="Nenhuma empresa cadastrada"
            description="O formulário da landing cadastra empresas diretamente na API. Assim que houver registros, eles aparecerão aqui."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">CNPJ</th>
                  <th className="px-5 py-3 font-medium">Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {empresas.map((empresa) => (
                  <tr key={empresa.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{empresa.nome}</p>
                      {empresa.descricao && (
                        <p className="mt-0.5 max-w-md text-xs text-slate-500">
                          {empresa.descricao}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{empresa.cnpj}</td>
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
