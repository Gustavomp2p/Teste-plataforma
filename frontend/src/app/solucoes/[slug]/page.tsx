import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { EmpresaCtaButton } from "@/components/landing/empresa-cta";
import { SOLUTION_DETAILS, SOLUTIONS } from "@/lib/landing-content";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const detail = SOLUTION_DETAILS[slug];
  if (!detail) return { title: "Solução" };
  return { title: `${detail.title} | Plataforma BFD` };
}

export default async function SolucaoDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const detail = SOLUTION_DETAILS[slug];
  if (!detail) notFound();

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Link href="/#solucao" className="text-sm font-semibold text-brand-600 hover:text-brand-500">
            ← Voltar para soluções
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-brand-600">
            Soluções
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{detail.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{detail.summary}</p>
          <ul className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {detail.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-0.5 text-brand-600" aria-hidden>
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <EmpresaCtaButton context="detail" />
            <ButtonLink href="/#fluxo" variant="secondary">
              Como funciona
            </ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
