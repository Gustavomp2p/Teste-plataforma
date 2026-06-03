import { PartnerLogoCard } from "@/components/landing/partner-logo-card";
import { LANDING_IMAGES } from "@/lib/landing-content";

const partners = [
  {
    src: LANDING_IMAGES.parceiroMcti,
    alt: "Ministério da Ciência, Tecnologia e Inovação — Governo Federal",
    label: "MCTI · Governo Federal",
  },
  {
    src: LANDING_IMAGES.parceiroHardware,
    alt: "Instituto Hardware BR",
    label: "Instituto Hardware BR",
  },
];

type PartnersStripProps = {
  title?: string;
  className?: string;
};

export function PartnersStrip({
  title = "Parceiros institucionais",
  className = "",
}: PartnersStripProps) {
  return (
    <div className={className}>
      <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <ul className="partner-tile-grid">
        {partners.map((partner) => (
          <PartnerLogoCard
            key={partner.alt}
            src={partner.src}
            alt={partner.alt}
            label={partner.label}
          />
        ))}
      </ul>
    </div>
  );
}
