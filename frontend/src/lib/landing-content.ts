export const HERO = {
  eyebrow: "Conectando desafios a soluções reais",
  title: "Transformamos desafios em soluções inovadoras",
  description:
    "A Plataforma BFD conecta empresas, talentos em TIC e tecnologias aplicadas para estruturar e desenvolver soluções com acompanhamento do programa.",
} as const;

export const HERO_STATS = [
  { value: "128", label: "Desafios cadastrados" },
  { value: "56", label: "Soluções entregues" },
  { value: "42", label: "Empresas conectadas" },
  { value: "210", label: "Talentos envolvidos" },
] as const;

export const DASHBOARD_KPIS = [
  { value: "20", label: "Projetos ativos" },
  { value: "15", label: "Empresas cadastradas" },
  { value: "8", label: "Demandas abertas" },
] as const;

export const DASHBOARD_STATUS = [
  { label: "Concluído", value: 35, color: "#10b981" },
  { label: "Em andamento", value: 40, color: "#2563eb" },
  { label: "Planejamento", value: 15, color: "#f59e0b" },
  { label: "Pausado", value: 10, color: "#94a3b8" },
] as const;

export const FLOW_STEPS = [
  {
    step: "1",
    title: "Cadastre sua empresa",
    description: "Crie sua conta e vincule os dados da organização na plataforma.",
  },
  {
    step: "2",
    title: "Descreva o desafio",
    description: "Envie o problema real, o contexto e o resultado esperado.",
  },
  {
    step: "3",
    title: "Receba propostas",
    description: "A equipe analisa, qualifica e estrutura caminhos de solução.",
  },
  {
    step: "4",
    title: "Acompanhe o andamento",
    description: "Monitore status, entregas e evolução do projeto na plataforma.",
  },
] as const;

export const SOLUTIONS = [
  {
    slug: "dashboard",
    title: "Dashboard",
    description: "Indicadores e visão gerencial em tempo real para decisões rápidas.",
  },
  {
    slug: "automacao",
    title: "Automação",
    description: "Rotinas repetitivas executadas com menos esforço e mais consistência.",
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligência Artificial",
    description: "IA aplicada a problemas concretos do dia a dia da operação.",
  },
  {
    slug: "talentos",
    title: "Talentos",
    description: "Conexão com profissionais em formação em TIC, com mentoria.",
  },
  {
    slug: "impacto",
    title: "Impacto",
    description: "Entregas orientadas a resultado operacional mensurável.",
  },
] as const;

export const SOLUTION_DETAILS: Record<
  string,
  { title: string; summary: string; points: string[] }
> = {
  dashboard: {
    title: "Dashboard",
    summary:
      "Painéis com indicadores claros para acompanhar demandas, status e resultados do programa.",
    points: [
      "Visão consolidada de projetos e empresas",
      "Status alinhados e fáceis de ler",
      "Apoio à gestão e à priorização",
    ],
  },
  automacao: {
    title: "Automação",
    summary:
      "Soluções que reduzem retrabalho e substituem processos manuais por fluxos digitais.",
    points: [
      "Menos tarefas repetitivas",
      "Padronização de etapas",
      "Ganho de tempo operacional",
    ],
  },
  "inteligencia-artificial": {
    title: "Inteligência Artificial",
    summary:
      "Uso prático de IA para apoiar análise, classificação e apoio à decisão em contextos reais.",
    points: [
      "Aplicação em problemas concretos",
      "Escopo realista e supervisionado",
      "Foco em utilidade para o negócio",
    ],
  },
  talentos: {
    title: "Talentos",
    summary:
      "Conexão entre desafios empresariais e talentos em formação, com acompanhamento do núcleo gestor.",
    points: [
      "Formação prática em TIC",
      "Mentoria e supervisão",
      "Ponte direta com o mercado",
    ],
  },
  impacto: {
    title: "Impacto",
    summary:
      "Projetos pensados para gerar resultado mensurável — não só protótipos teóricos.",
    points: [
      "Escopo alinhado ao problema",
      "Entregas acompanhadas",
      "Evolução tecnológica aplicável",
    ],
  },
};

export const LANDING_IMAGES = {
  logo: "/landing/logo-bfd.png",
  logoMark: "/landing/logo-bfd-mark.png",
  logoHeader: "/landing/logo-bfd-header.png",
  logoBolsa: "/landing/logo-bfd-bolsa.png",
  logoHero: "/landing/logo-bfd-hero.png",
  logoFooter: "/landing/logo-bfd-footer.png",
  parceiroMcti: "/landing/parceiro-mcti.png",
  parceiroHardware: "/landing/parceiro-hardware-br.png",
  parceiroHardwareDark: "/landing/parceiro-hardware-br-dark.png",
} as const;

/** Conteúdo legado (seções fora da home 2.0 — mantido para não quebrar imports). */
export const PROBLEMS = [
  { title: "Retrabalho", description: "Tarefas repetidas que consomem tempo e aumentam erros.", icon: "retrabalho" },
  { title: "Planilhas", description: "Dados espalhados em planilhas difíceis de manter e auditar.", icon: "planilhas" },
  { title: "Processos manuais", description: "Fluxos dependentes de pessoas em cada etapa do dia a dia.", icon: "processos" },
  { title: "Desorganização", description: "Falta de visão única sobre demandas, prazos e prioridades.", icon: "desorganizacao" },
  { title: "Gargalos", description: "Pontos críticos que travam a operação e a entrega.", icon: "gargalos" },
] as const;

export const BENEFITS = [
  { title: "Acesso à inovação", description: "Tecnologia aplicada sem investimento pesado em equipe interna." },
  { title: "Desenvolvimento supervisionado", description: "Projetos conduzidos com acompanhamento do núcleo gestor." },
  { title: "Baixo custo", description: "Modelo colaborativo entre empresa, programa e talentos." },
  { title: "Conexão com talentos", description: "Ponte direta com profissionais em formação em TIC." },
  { title: "Evolução tecnológica", description: "Processos que evoluem com soluções reais, não só teoria." },
  { title: "Foco em resultados", description: "Entregas orientadas a impacto operacional mensurável." },
] as const;

export const WE_DO = [
  "Estruturamos seu desafio em projeto tecnológico",
  "Conectamos empresas a talentos em formação",
  "Priorizamos soluções aplicáveis e de escopo realista",
  "Acompanhamos o desenvolvimento com supervisão",
] as const;

export const WE_DONT = [
  "Sistemas gigantes e complexos fora do escopo do programa",
  "Projetos sem problema real de negócio",
  "Desenvolvimento sem validação com a empresa",
  "Promessas sem estruturação prévia de entregas",
] as const;

export const AUDIENCE = [
  { label: "Comércio", icon: "comercio" },
  { label: "Indústria", icon: "industria" },
  { label: "Restaurantes", icon: "restaurantes" },
  { label: "Serviços", icon: "servicos" },
  { label: "Startups", icon: "startups" },
  { label: "Pequenos negócios", icon: "pequenos_negocios" },
] as const;

export const ECOSYSTEM = [
  { label: "Empresas", detail: "Desafios reais" },
  { label: "Tecnologia", detail: "Soluções aplicadas" },
  { label: "Talentos", detail: "Formação prática" },
  { label: "Impacto", detail: "Resultados concretos" },
] as const;
