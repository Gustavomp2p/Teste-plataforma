import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiErrorState } from "@/components/dashboard/api-error";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjetoQualificacaoForm } from "@/components/dashboard/projeto-qualificacao-form";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ApiError, buscarProjeto } from "@/lib/api-server";
import type { StatusProjeto } from "@/lib/api";
import { NIVEL_LABEL } from "@/lib/status";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Projeto #${id}` };
}

export default async function ProjetoDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const projetoId = Number(id);
  if (!Number.isInteger(projetoId)) notFound();

  try {
    const projeto = await buscarProjeto(projetoId);
    const emp = projeto.empresa;

    return (
      <>
        <PageHeader
          title={projeto.titulo}
          description={projeto.tipo_problema ?? "Detalhe da demanda e qualificação interna."}
        />
        <div className="space-y-8 p-6 sm:p-8">
          <Link href="/dashboard/projetos" className="text-sm font-semibold text-brand-600 hover:text-brand-500">
            ← Voltar para projetos
          </Link>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">Demanda</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-slate-400">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={(projeto.status as StatusProjeto) || "novo"} />
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Descrição</dt>
                  <dd className="text-slate-700">{projeto.descricao}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Urgência</dt>
                  <dd className="text-slate-700">
                    {projeto.urgencia ? NIVEL_LABEL[projeto.urgencia] ?? projeto.urgencia : "—"}
                  </dd>
                </div>
                {projeto.tecnologias && (
                  <div>
                    <dt className="text-slate-400">Tecnologias</dt>
                    <dd className="text-slate-700">{projeto.tecnologias}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">Empresa</h2>
              {emp ? (
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Nome</dt>
                    <dd className="font-medium text-slate-800">{emp.nome}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Responsável</dt>
                    <dd className="text-slate-700">{emp.responsavel_nome ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Cidade / Segmento</dt>
                    <dd className="text-slate-700">
                      {[emp.cidade, emp.segmento].filter(Boolean).join(" · ") || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Contato</dt>
                    <dd className="text-slate-700">
                      {emp.email}
                      {emp.telefone ? ` · ${emp.telefone}` : ""}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Empresa não encontrada.</p>
              )}
            </section>
          </div>

          <ProjetoQualificacaoForm projeto={projeto} />
        </div>
      </>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    const message = err instanceof ApiError ? err.message : "Erro ao carregar projeto.";
    return (
      <>
        <PageHeader title="Projeto" />
        <div className="p-6 sm:p-8">
          <ApiErrorState message={message} />
        </div>
      </>
    );
  }
}
