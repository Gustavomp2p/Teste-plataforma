"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { mapAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "recover";
type TipoConta = "usuario" | "empresa";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const authError = searchParams.get("error");

  const [mode, setMode] = useState<Mode>("login");
  const [tipoConta, setTipoConta] = useState<TipoConta>("usuario");
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    authError === "auth_callback" ? "Falha ao entrar com Google. Tente novamente." : null,
  );
  const [success, setSuccess] = useState<string | null>(null);

  function callbackUrl() {
    return `${window.location.origin}/auth/callback`;
  }

  function painelPadrao(): string {
    if (redirect) return redirect;
    return tipoConta === "empresa" ? "/empresa" : "/conta";
  }

  async function syncAndRedirect() {
    const fallback = painelPadrao();
    try {
      const res = await fetch("/api/auth/sync", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      const dest = res.ok && data.painel_url ? data.painel_url : fallback;
      router.push(dest);
    } catch {
      router.push(fallback);
    }
    router.refresh();
  }

  async function handleGoogle() {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const next = redirect || "/";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${callbackUrl()}?next=${encodeURIComponent(next)}`,
        queryParams: { access_type: "online" },
        scopes: "email profile",
      },
    });
    if (error) {
      setMessage(mapAuthError(error.message));
      setLoading(false);
    }
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSuccess(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${callbackUrl()}?next=${encodeURIComponent("/conta/nova-senha")}`,
    });
    if (error) {
      setMessage(mapAuthError(error.message));
    } else {
      setSuccess("Enviamos um link para redefinir sua senha. Confira sua caixa de entrada.");
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSuccess(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      setMessage("Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_* no .env.local.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signup") {
      if (tipoConta === "empresa" && !cnpj.trim()) {
        setMessage("Informe o CNPJ da empresa.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setMessage("As senhas nao coincidem.");
        setLoading(false);
        return;
      }

      const metadata: Record<string, string> = { nome, tipo_conta: tipoConta };
      if (tipoConta === "empresa") metadata.cnpj = cnpj.trim();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${callbackUrl()}?next=${encodeURIComponent(painelPadrao())}`,
        },
      });
      if (error) {
        setMessage(mapAuthError(error.message));
        setLoading(false);
        return;
      }
      if (data.session) {
        await syncAndRedirect();
        return;
      }
      setSuccess("Conta criada! Confira seu e-mail se a confirmacao estiver ativa.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(mapAuthError(error.message));
      setLoading(false);
      return;
    }
    await syncAndRedirect();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-lg font-bold text-brand-700">
            {SITE.name}
          </Link>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "recover" ? "Recuperar senha" : "Entre ou crie sua conta"}
          </p>
        </div>

        {mode !== "recover" && (mode === "login" || tipoConta === "usuario") && (
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogle}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>
        )}

        {mode !== "recover" && (mode === "login" || tipoConta === "usuario") && (
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">ou com e-mail</span>
            </div>
          </div>
        )}

        {mode !== "recover" && (
          <div className="mb-4 flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Criar conta
            </button>
          </div>
        )}

        {mode === "recover" ? (
          <form onSubmit={handleRecover} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            {message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
            {success && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Aguarde..." : "Enviar link de recuperacao"}
            </Button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full text-center text-sm text-brand-600 hover:text-brand-500"
            >
              Voltar ao login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tipo de conta</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTipoConta("usuario");
                        setCnpj("");
                      }}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                        tipoConta === "usuario"
                          ? "border-brand-500 bg-brand-50 text-brand-800"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      Usuario
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoConta("empresa")}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                        tipoConta === "empresa"
                          ? "border-brand-500 bg-brand-50 text-brand-800"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      Empresa
                    </button>
                  </div>
                </div>
                {tipoConta === "empresa" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">CNPJ</label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder="00.000.000/0000-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Vincula automaticamente se ja houver demanda com este CNPJ.
                    </p>
                  </div>
                )}
              </>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Confirmar senha</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {mode === "login" && (
              <button
                type="button"
                onClick={() => {
                  setMode("recover");
                  setMessage(null);
                  setSuccess(null);
                }}
                className="text-sm text-brand-600 hover:text-brand-500"
              >
                Esqueci minha senha
              </button>
            )}

            {message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
            {success && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Padrao: <strong>usuario</strong>. Empresa informa CNPJ no cadastro. Admin e definido pela equipe.
        </p>
      </div>
    </div>
  );
}
