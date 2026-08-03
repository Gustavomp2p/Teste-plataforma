import { ButtonLink } from "@/components/ui/button";
import { HeroDashboardPreview } from "@/components/landing/hero-dashboard-preview";
import { HERO } from "@/lib/landing-content";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
      <div
        className="pointer-events-none absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {HERO.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            {HERO.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/cadastro">Cadastrar desafio</ButtonLink>
            <ButtonLink href="#solucao" variant="secondary">
              Conhecer soluções
            </ButtonLink>
          </div>
        </div>

        <div className="relative w-full">
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}
