import { SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold text-slate-800">{SITE.fullName}</p>
        <p className="mt-1 text-sm text-slate-500">
          {SITE.program} · {SITE.org}
        </p>
        <p className="mt-6 text-xs text-slate-400">
          Sprint 1 — estrutura inicial do frontend. Integração com API em breve.
        </p>
      </div>
    </footer>
  );
}
