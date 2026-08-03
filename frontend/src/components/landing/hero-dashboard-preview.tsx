import { DASHBOARD_KPIS, DASHBOARD_STATUS, HERO_STATS } from "@/lib/landing-content";

function DonutChart() {
  const total = DASHBOARD_STATUS.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 96 96" className="h-24 w-24 shrink-0" aria-hidden>
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        {DASHBOARD_STATUS.map((item) => {
          const length = (item.value / total) * circumference;
          const dash = `${length} ${circumference - length}`;
          const el = (
            <circle
              key={item.label}
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="12"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 48 48)"
            />
          );
          offset += length;
          return el;
        })}
        <circle cx="48" cy="48" r="24" fill="white" />
      </svg>
      <ul className="space-y-1.5 text-xs text-slate-600">
        {DASHBOARD_STATUS.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1">{item.label}</span>
            <span className="font-semibold text-slate-800">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroDashboardPreview() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-800 via-brand-900 to-brand-800 shadow-xl shadow-slate-300/40">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">
            Painel BFD
          </p>
          <p className="mt-1 text-sm text-white/80">Visão geral do programa</p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-5">
          {DASHBOARD_KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-sm"
            >
              <p className="text-2xl font-bold tabular-nums text-white">{kpi.value}</p>
              <p className="mt-1 text-[11px] leading-snug text-white/70">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="mx-5 mb-5 rounded-xl bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status dos projetos
          </p>
          <div className="mt-3">
            <DonutChart />
          </div>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {HERO_STATS.map((stat) => (
          <li
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xl font-bold tabular-nums text-brand-700">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
