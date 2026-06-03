import { BENEFITS } from "@/lib/landing-content";

export function BenefitsSection() {
  return (
    <section id="beneficios" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          05 · Benefícios
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Por que participar?
        </h2>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
                aria-hidden
              >
                ✓
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
