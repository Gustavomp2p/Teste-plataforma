"use client";

import Image from "next/image";

type PartnerLogoCardProps = {
  src: string;
  alt: string;
  label: string;
  /** PNGs com transparência precisam de unoptimized para o Next não aplicar fundo preto. */
  unoptimized?: boolean;
};

export function PartnerLogoCard({ src, alt, label, unoptimized }: PartnerLogoCardProps) {
  return (
    <li className="partner-tile group">
      <div className="partner-tile__visual" tabIndex={0} role="img" aria-label={alt}>
        <Image
          src={src}
          alt=""
          width={260}
          height={72}
          unoptimized={unoptimized}
          className="partner-tile__img"
          aria-hidden
        />
        <span className="partner-tile__shine" aria-hidden />
      </div>
      <p className="partner-tile__label">{label}</p>
    </li>
  );
}
