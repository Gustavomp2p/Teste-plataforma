import { AudienceSection } from "@/components/landing/audience-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FlowSection } from "@/components/landing/flow-section";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { TransparencySection } from "@/components/landing/transparency-section";
import { VisionSection } from "@/components/landing/vision-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <FlowSection />
        <BenefitsSection />
        <TransparencySection />
        <AudienceSection />
        <CtaSection />
        <VisionSection />
      </main>
      <SiteFooter />
    </>
  );
}
