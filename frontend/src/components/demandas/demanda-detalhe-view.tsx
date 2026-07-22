import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { StatusProjeto } from "@/lib/api";
import { NIVEL_LABEL } from "@/lib/status";

type EmpresaInfo = {
  nome?: string | null;
  cidade?: string | null;
  segmento?: string | null;
  email?: string | null;
  telefone?: string | null;
  responsavel_nome?: string | null;
};

type CategoriaInfo = {
  nome?: string | null;
};

export type DemandaDetalheViewProps = {
  titulo: string;
  descricao: string;
  status: StatusProjeto | string;
  tipo_problema?: string | null;
  urgencia?: string | null;
  complexidade?: string | null;
  tecnologias?: string | null;
  briefing_contexto?: string | null;
  briefing_objetivo?: string | null;
  briefing_escopo?: string | null;
  briefing_requisitos?: string | null;
  briefing_resultado?: string | null;
  empresa?: EmpresaInfo | null;
  categoria?: CategoriaInfo | null;
  backHref: string;
  backLabel: string;
  /** Se true, mostra e-mail/telefone/responsável da empresa. */
  mostrarContatoEmpresa?: boolean;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className="mt-1 text-slate-700">{children}</dd>
    </div>
  );
}

export function DemandaDetalheView({
  titulo,
  descricao,
  status,
  tipo_problema,
  urgencia,
  complexidade,
  tecnologias,
  briefing_contexto,
  briefing_objetivo,
  briefing_escopo,
  briefing_requisitos,
  briefing_resultado,
  empresa,
  categoria,
  backHref,
  backLabel,
  mostrarContatoEmpresa = false,
}: DemandaDetalheViewProps) {
  const briefing = [
    { label: "Contexto", value: briefing_contexto },
    { label: "Objetivo", value: briefing_objetivo },
    { label: "Escopo", value: briefing_escopo },
    { label: "Requisitos", value: briefing_requisitos },
    { label: "Resultado esperado", value: briefing_resultado },
  ].filter((b) => b.value);

  return (
    <div className="space-y-6">
      <Link href={backHref} className="text-sm font-semibold text-brand-600 hover:text-brand-500">
        ← {backLabel}
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
          <StatusBadge status={(status as StatusProjeto) || "novo"} />
        </div>
        {tipo_problema && <p className="mt-1 text-sm text-slate-500">{tipo_problema}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Demanda</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Field label="Descrição">{descricao}</Field>
            <Field label="Categoria">{categoria?.nome}</Field>
            <Field label="Urgência">
              {urgencia ? NIVEL_LABEL[urgencia] ?? urgencia : null}
            </Field>
            <Field label="Complexidade">
              {complexidade ? NIVEL_LABEL[complexidade] ?? complexidade : null}
            </Field>
            <Field label="Tecnologias">{tecnologias}</Field>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Empresa</h2>
          {empresa ? (
            <dl className="mt-4 space-y-3 text-sm">
              <Field label="Nome">
                <span className="font-medium text-slate-800">{empresa.nome}</span>
              </Field>
              <Field label="Cidade / Segmento">
                {[empresa.cidade, empresa.segmento].filter(Boolean).join(" · ") || null}
              </Field>
              {mostrarContatoEmpresa && (
                <>
                  <Field label="Responsável">{empresa.responsavel_nome}</Field>
                  <Field label="Contato">
                    {[empresa.email, empresa.telefone].filter(Boolean).join(" · ") || null}
                  </Field>
                </>
              )}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Empresa não informada.</p>
          )}
        </section>
      </div>

      {briefing.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Briefing</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {briefing.map((b) => (
              <Field key={b.label} label={b.label}>
                {b.value}
              </Field>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
