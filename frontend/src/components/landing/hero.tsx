import { ButtonLink } from "@/components/ui/button";
import { HeroDashboardPreview } from "@/components/landing/hero-dashboard-preview";
import { PartnersStrip } from "@/components/landing/partners-strip";
import { HERO_FEATURES, LANDING_IMAGES } from "@/lib/landing-content";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-200/30 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {SITE.program}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Transformamos desafios operacionais em{" "}
            <span className="text-brand-600">soluções tecnológicas reais</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            {SITE.fullName}. Estruturamos oportunidades entre empresas de Santa
            Catarina e talentos em TIC do {SITE.program}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="#cadastro">Cadastrar desafio da empresa</ButtonLink>
            <ButtonLink href="#solucao" variant="secondary">
              Ver exemplos de soluções
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {HERO_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                  aria-hidden
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative w-full transition-transform duration-500 hover:scale-[1.02]">
          <HeroDashboardPreview />
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl border-t border-slate-200 pt-10">
        <PartnersStrip />
      </div>
    </section>
  );
}
