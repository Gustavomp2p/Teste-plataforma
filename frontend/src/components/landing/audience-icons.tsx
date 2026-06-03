type IconProps = { className?: string };

export function IconComercio({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l2.5-4h13L21 9M9 13h6" />
    </svg>
  );
}

export function IconIndustria({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10l4-2v12M10 20V6l4-2v16M16 20V12l4-1v9" />
      <path strokeLinecap="round" d="M8 10h1M14 6h1M18 14h1" />
    </svg>
  );
}

export function IconRestaurantes({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v8M5 3v3M11 3v3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11v10M16 3c1.5 0 3 1.5 3 4v4c0 2-1 3-3 3h-1v10" />
    </svg>
  );
}

export function IconServicos({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 16.8l.9-5.4L4.2 7.6l5.4-.8L12 2z" />
      <circle cx="12" cy="18" r="2" />
    </svg>
  );
}

export function IconStartups({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.5 4.5H18l-3.7 2.7 1.4 4.5L12 12.8 8.3 14.7l1.4-4.5L6 7.5h4.5L12 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14M8 17h8" />
    </svg>
  );
}

export function IconPequenosNegocios({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16v10H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10V7a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3" />
      <path strokeLinecap="round" d="M12 14v4M9 14h6" />
    </svg>
  );
}

export const AUDIENCE_ICONS = {
  comercio: IconComercio,
  industria: IconIndustria,
  restaurantes: IconRestaurantes,
  servicos: IconServicos,
  startups: IconStartups,
  pequenos_negocios: IconPequenosNegocios,
} as const;

export type AudienceIconKey = keyof typeof AUDIENCE_ICONS;
