import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-800">
          {SITE.program}
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Ponte entre{" "}
          <span className="text-brand-600">empresas</span> e{" "}
          <span className="text-brand-600">talentos em TIC</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {SITE.fullName}. Capture demandas reais, estruture projetos
          tecnológicos e gere experiência prática para as turmas do programa.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="#cadastro">Sou empresa — cadastrar demanda</ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary">
            Acessar painel
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
