import { FlowSection } from "@/components/landing/flow-section";
import { Hero } from "@/components/landing/hero";
import { MidCtaSection } from "@/components/landing/mid-cta-section";
import { PartnersSection } from "@/components/landing/partners-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <PartnersSection />
        <FlowSection />
        <SolutionSection />
        <MidCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
