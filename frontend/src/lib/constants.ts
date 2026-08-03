export const SITE = {
  name: "Plataforma BFD",
  fullName: "Plataforma de Captação e Estruturação de Projetos Tecnológicos",
  program: "Bolsa Futuro Digital · Residência em TIC",
  org: "Núcleo Gestor SC",
  contactUrl: "https://hardware.org.br/fale-conosco/",
} as const;

/** Links públicos do header/footer da landing. Contato é externo. */
export const NAV_LINKS = [
  { href: "/", label: "Início", external: false },
  { href: "/#fluxo", label: "Como funciona", external: false },
  { href: "/#solucao", label: "Soluções que geram impacto", external: false },
  { href: SITE.contactUrl, label: "Contato", external: true },
] as const;

/** Visível apenas para admin autenticado. */
export const NAV_DASHBOARD = { href: "/dashboard", label: "Dashboard" } as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Visão geral", icon: "grid" },
  { href: "/dashboard/projetos", label: "Projetos", icon: "folder" },
  { href: "/dashboard/empresas", label: "Empresas", icon: "building" },
  { href: "/dashboard/demandas", label: "Demandas", icon: "inbox" },
] as const;
