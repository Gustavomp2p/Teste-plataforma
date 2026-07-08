import Link from "next/link";
import { redirect, unstable_rethrow } from "next/navigation";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil, sincronizarPerfil, ApiError } from "@/lib/api-server";

export const dynamic = "force-dynamic";

async function carregarPerfil() {
  try {
    return await buscarPerfil();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      await sincronizarPerfil();
      return await buscarPerfil();
    }
    throw err;
  }
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-slate-600">
          Sessao expirada.{" "}
          <Link href="/login?redirect=/dashboard/projetos" className="font-semibold text-brand-600">
            Entrar novamente
          </Link>
        </p>
      </div>
    );
  }

  try {
    const perfil = await carregarPerfil();
    if (perfil.is_empresa) redirect("/empresa");
    if (!perfil.is_admin) redirect(perfil.painel_url);

    return (
      <div className="flex min-h-screen bg-slate-50">
        <DashboardNav userEmail={perfil.email} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    );
  } catch (err) {
    unstable_rethrow(err);
    // Fail-closed: qualquer falha ao carregar o perfil retira o acesso ao painel admin.
    redirect("/conta");
  }
}
