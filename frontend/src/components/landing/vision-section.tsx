import Image from "next/image";
import { ECOSYSTEM, LANDING_IMAGES } from "@/lib/landing-content";

export function VisionSection() {
  return (
    <section
      id="visao"
      className="relative overflow-hidden bg-brand-900 px-4 py-20 text-white sm:px-6"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-800/80 via-brand-900 to-slate-950"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
          08 · Nossa visão
        </p>
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Construindo um ecossistema de inovação aplicada
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-100">
              Unimos desafios reais do mercado, formação prática em TIC e
              supervisão institucional para gerar impacto mensurável nas empresas
              e no desenvolvimento dos talentos.
            </p>
            <Image
              src={LANDING_IMAGES.parceiroHardwareDark}
              alt="Instituto Hardware BR"
              width={277}
              height={190}
              unoptimized
              className="mt-8 h-14 w-auto object-contain opacity-90"
            />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {ECOSYSTEM.map((item, index) => (
              <li
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <span className="text-xs font-bold text-brand-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-semibold">{item.label}</h3>
                <p className="mt-1 text-sm text-brand-100">{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-brand-100">
          <span>Empresas (desafios reais)</span>
          <span aria-hidden>→</span>
          <span>Tecnologia (soluções aplicadas)</span>
          <span aria-hidden>→</span>
          <span>Talentos (formação prática)</span>
          <span aria-hidden>→</span>
          <span className="font-semibold text-white">Impacto (resultados concretos)</span>
        </div>
      </div>
    </section>
  );
}
