import { Suspense } from "react";
import { EmpresaCtaButton } from "@/components/landing/empresa-cta";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil } from "@/lib/api-server";

async function MidCtaInner() {
  try {
    const user = await getAuthUser();
    if (user) {
      const perfil = await buscarPerfil();
      // Admin não cadastra desafio — a faixa inteira some.
      if (perfil.is_admin) return null;
    }
  } catch {
    /* visitante / erro de perfil: mostra a faixa */
  }

  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl bg-brand-600 px-8 py-10 text-white sm:flex-row sm:items-center sm:px-10">
        <div className="flex items-start gap-4">
          <span
            className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:flex"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M8 4h8a2 2 0 0 1 2 2v14l-6-3-6 3V6a2 2 0 0 1 2-2Z" />
              <path d="M10 9h4M10 13h4" />
            </svg>
          </span>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Tem um desafio para resolver?
            </h2>
            <p className="mt-2 max-w-xl text-brand-100">
              Cadastre agora e encontre as melhores soluções para o seu negócio.
            </p>
          </div>
        </div>
        <EmpresaCtaButton context="mid" className="shrink-0" />
      </div>
    </section>
  );
}

export function MidCtaSection() {
  return (
    <Suspense fallback={null}>
      <MidCtaInner />
    </Suspense>
  );
}
