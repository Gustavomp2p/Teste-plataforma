import { AUDIENCE_ICONS, type AudienceIconKey } from "@/components/landing/audience-icons";
import { AUDIENCE } from "@/lib/landing-content";

export function AudienceSection() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          07 · Quem pode participar
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl">
          Empresas de diferentes segmentos
        </h2>
        <p className="mt-4 max-w-2xl text-slate-600">
          Comércio, indústria, serviços e pequenos negócios com desafios
          operacionais reais podem enviar demandas para o programa.
        </p>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {AUDIENCE.map((segment) => {
            const Icon = AUDIENCE_ICONS[segment.icon as AudienceIconKey];
            return (
              <li
                key={segment.label}
                className="audience-card group flex flex-col items-center rounded-xl border border-slate-200 bg-white px-3 py-6 text-center shadow-sm"
              >
                <span className="audience-card__icon" aria-hidden>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-3 text-sm font-semibold leading-snug text-slate-800">
                  {segment.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
