import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex flex-col leading-tight transition-opacity hover:opacity-90"
        >
          <span className="text-sm font-bold tracking-tight text-brand-700">
            {SITE.name}
          </span>
          <span className="hidden text-xs text-slate-500 sm:block">
            Bolsa Futuro Digital
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ButtonLink href="/dashboard" variant="ghost" className="hidden px-3 sm:inline-flex">
            Entrar
          </ButtonLink>
          <ButtonLink href="#cadastro" className="px-3 text-xs sm:px-5 sm:text-sm">
            Cadastrar desafio
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
