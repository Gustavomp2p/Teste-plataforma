type IconProps = { className?: string };

export function IconRetrabalho({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 9a8 8 0 0 0-14.5-2M4 15a8 8 0 0 0 14.5 2" />
    </svg>
  );
}

export function IconPlanilhas({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M3 9h18M3 14h18M9 4v16M15 4v16" />
    </svg>
  );
}

export function IconProcessosManuais({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8M8 12h8M8 18h5" />
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 18l3 3" />
    </svg>
  );
}

export function IconDesorganizacao({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h6M4 12h10M4 17h8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7l4-2M18 12l4-1M17 17l5 1" opacity="0.55" />
    </svg>
  );
}

export function IconGargalos({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4 6 2M16 4l2-2" opacity="0.5" />
    </svg>
  );
}

export const PROBLEM_ICONS = {
  retrabalho: IconRetrabalho,
  planilhas: IconPlanilhas,
  processos: IconProcessosManuais,
  desorganizacao: IconDesorganizacao,
  gargalos: IconGargalos,
} as const;

export type ProblemIconKey = keyof typeof PROBLEM_ICONS;
