"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { StatusProjeto } from "@/lib/api";
import { STATUS_LABEL, STATUS_OPTIONS } from "@/lib/status";

export function StatusSelect({
  projetoId,
  status,
}: {
  projetoId: number;
  status: StatusProjeto;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const novoStatus = event.target.value as StatusProjeto;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/projetos/${projetoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Erro ao atualizar status.");
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving || pending}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-500 focus:outline focus:outline-2 focus:outline-brand-500/30 disabled:opacity-60"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {STATUS_LABEL[opt]}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
