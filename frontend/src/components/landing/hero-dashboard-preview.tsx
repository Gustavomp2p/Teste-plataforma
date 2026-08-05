import { DASHBOARD_STATUS, HERO_STATS } from "@/lib/landing-content";

function DonutChart() {
  const total = DASHBOARD_STATUS.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <svg viewBox="0 0 104 104" className="h-28 w-28 shrink-0" aria-hidden>
        <circle cx="52" cy="52" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        {DASHBOARD_STATUS.map((item) => {
          const length = (item.value / total) * circumference;
          const dash = `${length} ${circumference - length}`;
          const el = (
            <circle
              key={item.label}
              cx="52"
              cy="52"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 52 52)"
            />
          );
          offset += length;
          return el;
        })}
        <circle cx="52" cy="52" r="26" fill="white" />
      </svg>
      <ul className="w-full space-y-2 text-sm text-slate-600">
        {DASHBOARD_STATUS.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1">{item.label}</span>
            <span className="font-bold tabular-nums text-slate-900">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const STAT_ACCENTS = [
  "from-brand-50 to-white text-brand-700 ring-brand-100",
  "from-amber-50 to-white text-amber-700 ring-amber-100",
  "from-emerald-50 to-white text-emerald-700 ring-emerald-100",
  "from-violet-50 to-white text-violet-700 ring-violet-100",
] as const;

export function HeroDashboardPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-brand-900 to-brand-800 shadow-2xl shadow-brand-900/20">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
          Painel BFD
        </p>
        <p className="mt-1 text-base font-medium text-white/90">Visão geral do programa</p>
      </div>

      {/* Números principais — grandes e no topo */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:gap-4 sm:p-6">
        {HERO_STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={`rounded-2xl bg-gradient-to-br p-4 ring-1 sm:p-5 ${STAT_ACCENTS[index % STAT_ACCENTS.length]}`}
          >
            <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-xs font-medium leading-snug text-slate-600 sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-5 mb-5 rounded-2xl bg-white p-5 shadow-lg shadow-black/10 sm:mx-6 sm:mb-6 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Status dos projetos
        </p>
        <div className="mt-4">
          <DonutChart />
        </div>
      </div>
    </div>
  );
}
