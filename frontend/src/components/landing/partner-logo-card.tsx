"use client";

import Image from "next/image";

type PartnerLogoCardProps = {
  src: string;
  alt: string;
  label: string;
};

export function PartnerLogoCard({ src, alt, label }: PartnerLogoCardProps) {
  return (
    <li className="partner-tile group">
      <div className="partner-tile__visual" tabIndex={0} role="img" aria-label={alt}>
        <Image
          src={src}
          alt=""
          width={260}
          height={72}
          className="partner-tile__img"
          aria-hidden
        />
        <span className="partner-tile__shine" aria-hidden />
      </div>
      <p className="partner-tile__label">{label}</p>
    </li>
  );
}
