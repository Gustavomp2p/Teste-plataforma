"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { mapAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const authError = searchParams.get("error");

  const [mode, setMode] = useState<Mode>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    authError === "auth_callback" ? "Falha ao entrar com Google/Facebook. Tente novamente." : null,
  );
  const [success, setSuccess] = useState<string | null>(null);

  function callbackUrl() {
    return `${window.location.origin}/auth/callback`;
  }

  async function syncAndRedirect() {
    const res = await fetch("/api/auth/sync", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    const dest = redirect || data.painel_url || "/conta";
    router.push(dest);
    router.refresh();
  }

  async function handleOAuth(provider: "google" | "facebook") {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${callbackUrl()}?next=${encodeURIComponent(redirect || "/conta")}`,
      },
    });
    if (error) {
      setMessage(mapAuthError(error.message));
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSuccess(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      setMessage("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_* no .env.local.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome },
          emailRedirectTo: `${callbackUrl()}?next=${encodeURIComponent(redirect || "/conta")}`,
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
      setSuccess("Conta criada! Confira seu e-mail se a confirmação estiver ativa.");
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
          <p className="mt-2 text-sm text-slate-500">Entre ou crie sua conta</p>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuth("google")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <span className="text-base">G</span>
            Continuar com Google
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuth("facebook")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#166FE5] disabled:opacity-50"
          >
            <span className="text-base font-bold">f</span>
            Continuar com Facebook
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">ou com e-mail</span>
          </div>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
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

          {message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
          {success && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Novos cadastros entram como <strong>usuário</strong>. Administradores têm acesso ao painel de gestão.
        </p>
      </div>
    </div>
  );
}
