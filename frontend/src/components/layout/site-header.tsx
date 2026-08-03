import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { NAV_DASHBOARD, NAV_LINKS } from "@/lib/constants";
import { LANDING_IMAGES } from "@/lib/landing-content";
import { AuthNav } from "@/components/layout/auth-nav";
import { EmpresaCtaButton } from "@/components/landing/empresa-cta";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil } from "@/lib/api-server";

function NavLinkItem({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external: boolean;
}) {
  const className =
    "text-sm font-medium text-slate-600 transition-colors hover:text-brand-700";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

async function HeaderNav() {
  let showDashboard = false;
  try {
    const user = await getAuthUser();
    if (user) {
      const perfil = await buscarPerfil();
      showDashboard = perfil.is_admin;
    }
  } catch {
    showDashboard = false;
  }

  const publicLinks = NAV_LINKS.filter((l) => l.label !== "Contato");
  const contact = NAV_LINKS.find((l) => l.label === "Contato");

  return (
    <nav className="hidden items-center gap-5 lg:flex">
      {publicLinks.map((link) => (
        <NavLinkItem key={link.href} href={link.href} label={link.label} external={link.external} />
      ))}
      {showDashboard && (
        <NavLinkItem href={NAV_DASHBOARD.href} label={NAV_DASHBOARD.label} external={false} />
      )}
      {contact && (
        <NavLinkItem href={contact.href} label={contact.label} external={contact.external} />
      )}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
          <Image
            src={LANDING_IMAGES.logoBolsa}
            alt="Bolsa Futuro Digital"
            width={200}
            height={72}
            className="h-14 w-auto object-contain sm:h-16"
            priority
          />
        </Link>

        <Suspense fallback={<nav className="hidden h-5 w-64 lg:block" aria-hidden />}>
          <HeaderNav />
        </Suspense>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <AuthNav />
          <EmpresaCtaButton context="header" className="px-3 text-xs sm:px-5 sm:text-sm" />
        </div>
      </div>
    </header>
  );
}
