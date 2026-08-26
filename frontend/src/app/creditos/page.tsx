import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE } from "@/lib/constants";
import { EQUIPE, REPOSITORIO } from "@/lib/creditos";

export const metadata = {
  title: "Créditos | Plataforma BFD",
  description:
    "Equipe responsável pelo desenvolvimento da Plataforma BFD — função, contato e GitHub de cada integrante.",
};

function Iniciais({ nome }: { nome: string }) {
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
      aria-hidden
    >
      {iniciais}
    </span>
  );
}

export default function CreditosPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-slate-50">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Créditos
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Quem construiu a {SITE.name}
            </h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
              Equipe responsável pelo desenvolvimento da plataforma no programa{" "}
              {SITE.program}.
            </p>

            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {EQUIPE.map((pessoa) => (
                <li
                  key={pessoa.nome}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <Iniciais nome={pessoa.nome} />
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-900">{pessoa.nome}</h2>
                      <p className="mt-0.5 text-sm font-medium text-brand-700">
                        {pessoa.funcao}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                    <div>
                      <dt className="text-slate-500">E-mail</dt>
                      <dd className="mt-0.5 break-all">
                        {pessoa.email ? (
                          <a
                            href={`mailto:${pessoa.email}`}
                            className="font-medium text-slate-900 hover:text-brand-600"
                          >
                            {pessoa.email}
                          </a>
                        ) : (
                          <span className="text-slate-400">Não informado</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">GitHub</dt>
                      <dd className="mt-0.5 break-all">
                        {pessoa.github ? (
                          <a
                            href={`https://github.com/${pessoa.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-900 hover:text-brand-600"
                          >
                            @{pessoa.github}
                          </a>
                        ) : (
                          <span className="text-slate-400">Não informado</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Código-fonte do projeto:{" "}
              <a
                href={REPOSITORIO}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-600 hover:underline"
              >
                conectaecapacita/plataforma-projetos-bfd
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
