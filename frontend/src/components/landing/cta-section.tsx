import { ButtonLink } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section
      id="cadastro"
      className="mx-4 mb-20 rounded-3xl bg-brand-700 px-6 py-16 text-center text-white sm:mx-6 sm:px-12"
    >
      <h2 className="text-2xl font-bold sm:text-3xl">
        Pronto para cadastrar sua demanda?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-brand-100">
        Em breve o formulário estará integrado à API. Por enquanto, use o painel
        para validar fluxos e layout com o squad.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <ButtonLink
          href="/dashboard"
          className="!bg-white !text-brand-800 hover:!bg-brand-50"
        >
          Ir para o painel
        </ButtonLink>
        <ButtonLink href="/" variant="ghost" className="!text-white hover:!bg-brand-600">
          Voltar ao início
        </ButtonLink>
      </div>
    </section>
  );
}
