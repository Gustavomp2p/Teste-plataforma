import Image from "next/image";
import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { LANDING_IMAGES } from "@/lib/landing-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-brand-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex rounded-md bg-white/5 p-2">
              <Image
                src={LANDING_IMAGES.logoBolsa}
                alt="Bolsa Futuro Digital"
                width={120}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {SITE.fullName}. Conectando empresas, talentos e soluções tecnológicas.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Navegação</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Para empresas</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/cadastro" className="hover:text-white">
                  Cadastrar desafio
                </Link>
              </li>
              <li>
                <Link href="/#solucao" className="hover:text-white">
                  Conhecer soluções
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Contato</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href="mailto:contato@bfd.sc.gov.br" className="hover:text-white">
                  contato@bfd.sc.gov.br
                </a>
              </li>
              <li>
                <a
                  href={SITE.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Fale conosco
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-600 px-3 py-1 text-xs hover:border-white hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-600 px-3 py-1 text-xs hover:border-white hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
