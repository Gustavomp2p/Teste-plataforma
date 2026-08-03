import Link from "next/link";
import type { ReactNode } from "react";
import { SOLUTIONS } from "@/lib/landing-content";

const ICONS: Record<string, ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  automacao: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  "inteligencia-artificial": (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V18H9v-3.8A6 6 0 0 1 12 3Z" />
      <path d="M9 21h6M10 18h4" />
    </svg>
  ),
  talentos: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M13 14.5c1.7.3 3.5 1.3 4.5 3.5" />
    </svg>
  ),
  impacto: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19V9l8-5 8 5v10" />
      <path d="M9 19v-6h6v6" />
    </svg>
  ),
};

export function SolutionSection() {
  return (
    <section id="solucao" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Soluções
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl">
          Áreas de atuação
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Exemplos de desafios que podem virar soluções reais — cards clicáveis com mais detalhes.
        </p>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/solucoes/${item.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100">
                  {ICONS[item.slug]}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-500">{item.description}</p>
                <span className="mt-4 text-sm font-semibold text-brand-600 group-hover:text-brand-500">
                  Ver detalhes →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
