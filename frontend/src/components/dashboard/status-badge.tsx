import type { StatusProjeto } from "@/lib/api";
import { STATUS_BADGE, STATUS_LABEL } from "@/lib/status";

export function StatusBadge({ status }: { status: StatusProjeto }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
