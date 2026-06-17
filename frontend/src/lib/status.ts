import type { StatusProjeto } from "@/lib/api";

export const STATUS_LABEL: Record<StatusProjeto, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  em_contato: "Em contato",
  aprovado_turma: "Aprovado para turma",
  reprovado: "Reprovado",
  estruturado: "Estruturado",
};

export const STATUS_BADGE: Record<StatusProjeto, string> = {
  novo: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  em_analise: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  em_contato: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  aprovado_turma: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  reprovado: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  estruturado: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
};

export const STATUS_OPTIONS: StatusProjeto[] = [
  "novo",
  "em_analise",
  "em_contato",
  "aprovado_turma",
  "reprovado",
  "estruturado",
];

export const NIVEL_LABEL: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export const SEGMENTOS = [
  "Comércio",
  "Indústria",
  "Serviços",
  "Tecnologia",
  "Saúde",
  "Educação",
  "Outro",
] as const;

export const TIPOS_PROBLEMA = [
  "Automação de processos",
  "Sistema / portal web",
  "Aplicativo mobile",
  "Integração de sistemas",
  "Dados e relatórios",
  "Outro",
] as const;
