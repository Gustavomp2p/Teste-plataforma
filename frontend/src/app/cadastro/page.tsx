import { CtaSection } from "@/components/landing/cta-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata = {
  title: "Cadastrar desafio | Plataforma BFD",
  description: "Cadastre a demanda tecnológica da sua empresa no programa Bolsa Futuro Digital.",
};

export default function CadastroPage() {
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
