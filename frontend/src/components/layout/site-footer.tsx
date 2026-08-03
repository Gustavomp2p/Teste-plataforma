import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-brand-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-bold text-white">Bolsa Futuro Digital</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {SITE.fullName}. {SITE.program}.
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
                <Link href="/login?mode=signup" className="hover:text-white">
                  Criar conta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
