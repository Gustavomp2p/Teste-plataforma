import type { StatusProjeto } from "@/lib/api";

export const STATUS_LABEL: Record<StatusProjeto, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

export const STATUS_BADGE: Record<StatusProjeto, string> = {
  aberto: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  em_andamento: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  concluido: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};

export const STATUS_OPTIONS: StatusProjeto[] = [
  "aberto",
  "em_andamento",
  "concluido",
];
