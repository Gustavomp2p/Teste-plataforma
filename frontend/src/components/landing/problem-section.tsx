import { PROBLEM_ICONS, type ProblemIconKey } from "@/components/landing/problem-icons";
import { PROBLEMS } from "@/lib/landing-content";

export function ProblemSection() {
  return (
    <section id="problema" className="bg-brand-900 px-4 py-20 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
          02 · Problema
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
          Sua empresa ainda depende de processos manuais, planilhas ou retrabalho?
        </h2>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PROBLEMS.map((item) => {
            const Icon = PROBLEM_ICONS[item.icon as ProblemIconKey];
            return (
              <li
                key={item.title}
                className="problem-card group flex flex-col rounded-2xl border border-slate-700 bg-slate-800/60 p-5"
              >
                <span className="problem-card__icon" aria-hidden>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
