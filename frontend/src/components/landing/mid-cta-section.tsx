import { ButtonLink } from "@/components/ui/button";

export function MidCtaSection() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl bg-brand-600 px-8 py-10 text-white sm:flex-row sm:items-center sm:px-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Tem um desafio para resolver?
          </h2>
          <p className="mt-2 max-w-xl text-brand-100">
            Cadastre a demanda da sua empresa e acompanhe a estruturação na Plataforma BFD.
          </p>
        </div>
        <ButtonLink
          href="/cadastro"
          className="shrink-0 bg-white text-brand-700 hover:bg-brand-50"
        >
          Cadastrar desafio →
        </ButtonLink>
      </div>
    </section>
  );
}
