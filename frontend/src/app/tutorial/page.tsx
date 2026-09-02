import { ButtonLink } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TUTORIAL, TUTORIAL_PDF, TUTORIAL_SECOES } from "@/lib/tutorial-content";

export const metadata = {
  title: "Guia rápido | Plataforma BFD",
  description: TUTORIAL.descricao,
};

export default function TutorialPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-slate-50">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Guia rápido
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              {TUTORIAL.titulo}
            </h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
              {TUTORIAL.descricao}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={TUTORIAL_PDF} target="_blank" rel="noopener noreferrer">
                Abrir o PDF em nova aba
              </ButtonLink>
              <a
                href={TUTORIAL_PDF}
                download
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                Baixar o guia
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-bold text-slate-900">O que você encontra no documento</h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TUTORIAL_SECOES.map((secao) => (
                <li
                  key={secao.numero}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {secao.numero}
                  </span>
                  <h3 className="mt-3 font-semibold text-slate-900">{secao.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{secao.resumo}</p>
                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {secao.topicos.map((topico) => (
                      <li key={topico} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-400" aria-hidden />
                        {topico}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-bold text-slate-900">Documento na íntegra</h2>
            <p className="mt-2 text-sm text-slate-600">
              Se a visualização não carregar no seu navegador, use os botões acima para abrir
              ou baixar o PDF.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <object
                data={TUTORIAL_PDF}
                type="application/pdf"
                className="h-[80vh] min-h-[480px] w-full"
                aria-label={TUTORIAL.titulo}
              >
                <div className="p-8 text-sm text-slate-600">
                  Seu navegador não consegue exibir PDFs incorporados.{" "}
                  <a
                    href={TUTORIAL_PDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Abrir o tutorial em nova aba
                  </a>
                  .
                </div>
              </object>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
