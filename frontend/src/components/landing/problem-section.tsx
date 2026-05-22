const problems = [
  {
    title: "Empresas sem acesso fácil",
    description:
      "Problemas reais de inovação ficam dispersos, sem um canal estruturado para virar projeto.",
  },
  {
    title: "Alunos sem prática relevante",
    description:
      "Potencial enorme, mas pouca ponte com demandas reais do mercado e portfólio.",
  },
  {
    title: "Demandas dispersas",
    description:
      "Falta uma estrutura organizada para transformar necessidades em projetos tecnológicos.",
  },
];

export function ProblemSection() {
  return (
    <section id="problema" className="bg-slate-900 px-4 py-20 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
          Cenário atual
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          O que falta hoje é uma ponte estruturada entre os dois lados
        </h2>
        <blockquote className="mt-6 border-l-4 border-brand-400 pl-4 text-lg text-slate-300">
          Empresas com problemas reais e alunos com potencial enorme — o que
          falta é organização para transformar isso em projetos.
        </blockquote>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {problems.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6"
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
