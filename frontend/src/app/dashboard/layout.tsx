import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { createClient } from "@/lib/supabase/server";
import { buscarPerfil, ApiError } from "@/lib/api-server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login?redirect=/dashboard");

  try {
    const perfil = await buscarPerfil();
    if (!perfil.is_admin) redirect("/conta");

    return (
      <div className="flex min-h-screen bg-slate-50">
        <DashboardNav userEmail={perfil.email} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) redirect("/conta");
    redirect("/login?redirect=/dashboard");
  }
}
