import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { LANDING_IMAGES } from "@/lib/landing-content";
import { PartnerLogoCard } from "@/components/landing/partner-logo-card";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-brand-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
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
                  <a href={link.href} className="hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Para empresas</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#cadastro" className="hover:text-white">
                  Cadastrar desafio
                </a>
              </li>
              <li>
                <a href="#solucao" className="hover:text-white">
                  Exemplos de soluções
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  Painel administrativo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Institucional</h3>
            <p className="mt-4 text-sm text-slate-400">{SITE.org}</p>
            <p className="mt-2 text-sm">
              <a href="mailto:contato@bfd.sc.gov.br" className="hover:text-white">
                contato@bfd.sc.gov.br
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 pt-10">
          <ul className="partner-tile-grid">
            <PartnerLogoCard
              src={LANDING_IMAGES.parceiroMcti}
              alt="Ministério da Ciência, Tecnologia e Inovação"
              label="MCTI · Governo Federal"
            />
            <PartnerLogoCard
              src={LANDING_IMAGES.parceiroHardwareDark}
              alt="Instituto Hardware BR"
              label="Instituto Hardware BR"
              unoptimized
            />
          </ul>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
