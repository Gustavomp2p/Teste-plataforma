import { DashboardNav } from "@/components/layout/dashboard-nav";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = (data?.claims?.email as string | undefined) ?? "";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav userEmail={email} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
