"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV, SITE } from "@/lib/constants";

const icons: Record<string, string> = {
  grid: "▦",
  folder: "◫",
  building: "⌂",
  inbox: "◎",
};

export function DashboardNav({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <Link href="/" className="text-sm font-bold text-brand-700">
          {SITE.name}
        </Link>
        <p className="mt-1 text-xs text-slate-500">Painel administrativo</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {DASHBOARD_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base opacity-70" aria-hidden>
                {icons[item.icon]}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        {userEmail ? (
          <p className="truncate text-xs text-slate-500" title={userEmail}>
            {userEmail}
          </p>
        ) : null}
        <Link
          href="/conta"
          className="mt-2 block text-xs font-medium text-slate-500 hover:text-brand-600"
        >
          Minha conta
        </Link>
        <Link
          href="/auth/signout"
          className="mt-1 inline-block text-xs font-medium text-brand-600 hover:text-brand-500"
        >
          Sair
        </Link>
      </div>
    </aside>
  );
}
