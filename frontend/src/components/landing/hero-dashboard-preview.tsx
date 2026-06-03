export function HeroDashboardPreview() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs font-medium text-slate-500">Painel · BFD</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {[
          { label: "Projetos", value: "128" },
          { label: "Empresas", value: "86" },
          { label: "Demandas", value: "42" },
          { label: "Em andamento", value: "19" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 px-4 py-4">
        <p className="text-xs font-semibold text-slate-700">Projetos por status</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 rounded-full border-[6px] border-brand-500 border-r-brand-200 border-b-emerald-400 border-l-amber-400" />
          <ul className="space-y-1 text-[10px] text-slate-600">
            <li className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Em estruturação
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Em desenvolvimento
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Aguardando empresa
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
