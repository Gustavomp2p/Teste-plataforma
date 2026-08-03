import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";
import { getAuthUser } from "@/lib/supabase/server";
import { buscarPerfil } from "@/lib/api-server";

export type EmpresaCtaContext = "header" | "hero" | "mid" | "detail" | "footer";

type CtaTarget = {
  href: string;
  label: string;
  show: boolean;
};

/**
 * Regras de CTA de desafio/conta:
 * - visitante → Criar conta (signup), depois poderá cadastrar desafio
 * - empresa logada → Cadastrar desafio (/cadastro)
 * - admin → não cadastra desafio (vai ao dashboard)
 * - usuário comum → não cadastra desafio (vê demandas)
 */
export async function resolveEmpresaCta(context: EmpresaCtaContext): Promise<CtaTarget> {
  const user = await getAuthUser();

  if (!user) {
    return {
      href: "/login?mode=signup&redirect=/cadastro",
      label: context === "mid" || context === "detail" ? "Criar conta →" : "Criar conta",
      show: true,
    };
  }

  try {
    const perfil = await buscarPerfil();

    if (perfil.is_admin) {
      if (context === "footer") {
        return { href: "/dashboard", label: "Painel admin", show: false };
      }
      return {
        href: "/dashboard",
        label: context === "header" ? "Painel admin" : "Abrir painel →",
        show: true,
      };
    }

    if (perfil.is_empresa) {
      return {
        href: "/cadastro",
        label:
          context === "mid" || context === "detail"
            ? "Cadastrar desafio →"
            : "Cadastrar desafio",
        show: true,
      };
    }

    // Usuário comum: não cadastra desafio (fluxo de candidatura é de outro time).
    if (context === "footer") {
      return { href: "/conta/demandas", label: "Ver demandas", show: false };
    }
    return {
      href: "/conta/demandas",
      label: context === "header" ? "Ver demandas" : "Ver demandas →",
      show: true,
    };
  } catch {
    return {
      href: "/login?mode=signup&redirect=/cadastro",
      label: "Criar conta",
      show: true,
    };
  }
}

type ButtonProps = {
  context: EmpresaCtaContext;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

async function EmpresaCtaButtonInner({ context, className = "", variant = "primary" }: ButtonProps) {
  const cta = await resolveEmpresaCta(context);
  if (!cta.show) return null;

  const forced =
    context === "mid"
      ? `${className} !border-0 !bg-white !text-brand-700 hover:!bg-brand-50`.trim()
      : className;

  return (
    <ButtonLink
      href={cta.href}
      variant={context === "mid" ? "secondary" : variant}
      className={forced}
    >
      {cta.label}
    </ButtonLink>
  );
}

export function EmpresaCtaButton(props: ButtonProps) {
  const fallbackHref = "/login?mode=signup&redirect=/cadastro";
  const fallbackLabel =
    props.context === "mid" || props.context === "detail" ? "Criar conta →" : "Criar conta";

  return (
    <Suspense
      fallback={
        <ButtonLink
          href={fallbackHref}
          variant={props.context === "mid" ? "secondary" : props.variant ?? "primary"}
          className={
            props.context === "mid"
              ? `${props.className ?? ""} !border-0 !bg-white !text-brand-700`.trim()
              : props.className
          }
        >
          {fallbackLabel}
        </ButtonLink>
      }
    >
      <EmpresaCtaButtonInner {...props} />
    </Suspense>
  );
}

export function EmpresaCtaTextLink({
  className = "hover:text-white",
}: {
  className?: string;
}) {
  return (
    <Suspense
      fallback={
        <Link href="/login?mode=signup&redirect=/cadastro" className={className}>
          Criar conta
        </Link>
      }
    >
      <EmpresaCtaTextLinkInner className={className} />
    </Suspense>
  );
}

async function EmpresaCtaTextLinkInner({ className }: { className: string }) {
  const cta = await resolveEmpresaCta("footer");
  if (!cta.show) return null;
  return (
    <Link href={cta.href} className={className}>
      {cta.label.replace(" →", "")}
    </Link>
  );
}
