import { redirect } from "next/navigation";
import { CtaSection } from "@/components/landing/cta-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil, ApiError } from "@/lib/api-server";

export const metadata = {
  title: "Cadastrar desafio | Plataforma BFD",
  description: "Cadastre a demanda tecnológica da sua empresa no programa Bolsa Futuro Digital.",
};

export const dynamic = "force-dynamic";

export default async function CadastroPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?mode=signup&redirect=/cadastro");
  }

  try {
    const perfil = await buscarPerfil();
    if (perfil.is_admin) redirect("/dashboard");
    if (!perfil.is_empresa) redirect("/conta/demandas");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login?mode=signup&redirect=/cadastro");
    }
    // Se o perfil ainda não sincronizou, deixa a empresa tentar o formulário.
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-slate-50">
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
