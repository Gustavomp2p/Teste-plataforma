import { FLOW_STEPS } from "@/lib/landing-content";

export function FlowSection() {
  return (
    <section id="fluxo" className="bg-slate-50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          04 · Como funciona
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Do desafio à solução em quatro etapas
        </h2>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW_STEPS.map((step) => (
            <li
              key={step.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {step.step}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
