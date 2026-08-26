import { ButtonLink } from "@/components/ui/button";
import { FLOW_STEPS } from "@/lib/landing-content";

export function FlowSection() {
  return (
    <section id="fluxo" className="bg-slate-50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Como funciona
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Do desafio à solução em 4 passos
        </h2>
        <div className="mt-3 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-slate-600">
            Fluxo simples, começando no passo 1 — do cadastro ao acompanhamento.
          </p>
          <ButtonLink href="/tutorial" className="shrink-0">
            Acessar
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </ButtonLink>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Tutorial completo de utilização da plataforma, passo a passo.
        </p>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW_STEPS.map((step, index) => (
            <li
              key={step.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {index < FLOW_STEPS.length - 1 && (
                <span
                  className="pointer-events-none absolute right-[-0.75rem] top-10 hidden h-px w-6 bg-brand-200 lg:block"
                  aria-hidden
                />
              )}
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
