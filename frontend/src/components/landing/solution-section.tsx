const services = [
  { title: "Captar", description: "Demandas reais de empresas" },
  { title: "Organizar", description: "Oportunidades qualificadas" },
  { title: "Estruturar", description: "Projetos tecnológicos" },
  { title: "Alimentar", description: "Futuras turmas do programa" },
  { title: "Gerar", description: "Experiência prática e portfólio" },
];

export function SolutionSection() {
  return (
    <section id="solucao" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          O que vamos construir
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Uma plataforma completa de captação e estruturação
        </h2>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((item, index) => (
            <li
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm"
            >
              <span className="text-xs font-bold text-brand-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
