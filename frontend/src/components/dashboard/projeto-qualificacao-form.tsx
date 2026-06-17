"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjetoDetalhe, StatusProjeto, Nivel } from "@/lib/api";
import { NIVEL_LABEL } from "@/lib/status";
import { StatusSelect } from "@/components/dashboard/status-select";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline focus:outline-2 focus:outline-brand-500/30";

type Props = { projeto: ProjetoDetalhe };

export function ProjetoQualificacaoForm({ projeto }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(false);
    const data = new FormData(e.currentTarget);
    const body = {
      complexidade: String(data.get("complexidade") || "") || null,
      prioridade: String(data.get("prioridade") || "") || null,
      observacoes_internas: String(data.get("observacoes_internas") || "") || null,
      briefing_contexto: String(data.get("briefing_contexto") || "") || null,
      briefing_objetivo: String(data.get("briefing_objetivo") || "") || null,
      briefing_escopo: String(data.get("briefing_escopo") || "") || null,
      briefing_requisitos: String(data.get("briefing_requisitos") || "") || null,
      briefing_resultado: String(data.get("briefing_resultado") || "") || null,
    };

    try {
      const res = await fetch(`/api/projetos/${projeto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message ?? "Erro ao salvar.");
      }
      setOk(true);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</p>
          <div className="mt-2">
            <StatusSelect
              projetoId={projeto.id}
              status={(projeto.status as StatusProjeto) || "novo"}
            />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Cadastrado em {new Date(projeto.criado_em).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Qualificação interna</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Complexidade</span>
            <select name="complexidade" defaultValue={projeto.complexidade ?? ""} className={inputClass}>
              <option value="">—</option>
              {(["baixa", "media", "alta"] as Nivel[]).map((n) => (
                <option key={n} value={n}>{NIVEL_LABEL[n]}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Prioridade</span>
            <select name="prioridade" defaultValue={projeto.prioridade ?? ""} className={inputClass}>
              <option value="">—</option>
              {(["baixa", "media", "alta"] as Nivel[]).map((n) => (
                <option key={n} value={n}>{NIVEL_LABEL[n]}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">Observações internas</span>
          <textarea
            name="observacoes_internas"
            rows={3}
            defaultValue={projeto.observacoes_internas ?? ""}
            className={`${inputClass} resize-y`}
          />
        </label>

        <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Briefing</h3>
        {(
          [
            ["briefing_contexto", "Contexto"],
            ["briefing_objetivo", "Objetivo do projeto"],
            ["briefing_escopo", "Escopo inicial"],
            ["briefing_requisitos", "Requisitos mínimos"],
            ["briefing_resultado", "Resultado esperado"],
          ] as const
        ).map(([name, label]) => (
          <label key={name}>
            <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
            <textarea
              name={name}
              rows={2}
              defaultValue={(projeto[name] as string | null) ?? ""}
              className={`${inputClass} resize-y`}
            />
          </label>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {ok && <p className="text-sm text-emerald-600">Salvo com sucesso.</p>}

        <button
          type="submit"
          disabled={saving || pending}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar qualificação"}
        </button>
      </form>
    </div>
  );
}
