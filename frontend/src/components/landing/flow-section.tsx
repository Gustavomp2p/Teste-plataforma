const steps = [
  {
    phase: "Entrada",
    title: "Empresa cadastra a necessidade",
    description: "Formulário de demanda com contexto do problema real.",
  },
  {
    phase: "Processamento",
    title: "Plataforma organiza e qualifica",
    description: "Triagem, estruturação e priorização do projeto.",
  },
  {
    phase: "Resultado",
    title: "Projetos para as turmas",
    description: "Demandas prontas para alunos desenvolverem com mentoria.",
  },
];

export function FlowSection() {
  return (
    <section id="fluxo" className="bg-slate-50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Visão do produto
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Como a plataforma funciona
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.phase} className="relative">
              {index < steps.length - 1 && (
                <span
                  className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-brand-200 md:block"
                  aria-hidden
                />
              )}
              <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <span className="rounded-md bg-brand-100 px-2 py-1 text-xs font-bold uppercase text-brand-800">
                  {step.phase}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
