import type { StatusProjeto } from "@/lib/api";
import { STATUS_BADGE, STATUS_LABEL } from "@/lib/status";

const LEGACY_LABEL: Record<string, string> = {
  aberto: "Novo",
  em_andamento: "Em análise",
  concluido: "Estruturado",
};

export function StatusBadge({ status }: { status: StatusProjeto | string }) {
  const label =
    STATUS_LABEL[status as StatusProjeto] ?? LEGACY_LABEL[status] ?? status;
  const badge =
    STATUS_BADGE[status as StatusProjeto] ??
    "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}
    >
      {label}
    </span>
  );
}
