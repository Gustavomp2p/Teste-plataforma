"use client";

import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";

type Variant = "logo" | "partner" | "partner-dark" | "float";

const variantClass: Record<Variant, string> = {
  logo: "brand-image--logo",
  partner: "brand-image--partner",
  "partner-dark": "brand-image--partner-dark",
  float: "brand-image--float",
};

type BrandImageProps = ImageProps & {
  variant?: Variant;
  caption?: ReactNode;
};

export function BrandImage({
  variant = "partner",
  caption,
  className = "",
  alt,
  ...props
}: BrandImageProps) {
  return (
    <figure
      className={`brand-image ${variantClass[variant]} ${className}`.trim()}
      tabIndex={caption ? 0 : undefined}
    >
      <div className="brand-image__frame">
        <Image alt={alt} className="brand-image__img" {...props} />
      </div>
      {caption ? <figcaption className="brand-image__caption">{caption}</figcaption> : null}
    </figure>
  );
}
