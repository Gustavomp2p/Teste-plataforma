import { WE_DO, WE_DONT } from "@/lib/landing-content";

export function TransparencySection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          06 · Transparência
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          O que fazemos — e o que não fazemos
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8">
            <h3 className="text-lg font-semibold text-emerald-900">O que fazemos</h3>
            <ul className="mt-6 space-y-3">
              {WE_DO.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <span className="font-bold text-success" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-8">
            <h3 className="text-lg font-semibold text-red-900">O que não fazemos</h3>
            <ul className="mt-6 space-y-3">
              {WE_DONT.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <span className="font-bold text-danger" aria-hidden>
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
