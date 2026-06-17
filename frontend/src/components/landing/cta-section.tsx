"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-brand-500/30 disabled:opacity-60";

type Feedback = { type: "success" | "error"; message: string } | null;

export function CtaSection() {
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      nome: String(data.get("nome") ?? ""),
      cnpj: String(data.get("cnpj") ?? ""),
      email: String(data.get("email") ?? ""),
      telefone: String(data.get("telefone") ?? ""),
      titulo: String(data.get("titulo") ?? ""),
      tecnologias: String(data.get("tecnologias") ?? ""),
      descricao: String(data.get("descricao") ?? ""),
    };

    setEnviando(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.message ?? "Não foi possível enviar o cadastro.");
      }
      setFeedback({
        type: "success",
        message: result.message ?? "Desafio cadastrado com sucesso!",
      });
      form.reset();
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error ? err.message : "Não foi possível enviar o cadastro.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="cadastro" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Cadastro de desafio
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Conte qual desafio sua empresa gostaria de resolver
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Preencha os dados abaixo. Sua empresa e o desafio serão registrados na
          plataforma para qualificação pelo squad.
        </p>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Nome da empresa
            </span>
            <input
              name="nome"
              type="text"
              required
              className={inputClass}
              placeholder="Sua empresa"
              disabled={enviando}
            />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              CNPJ
            </span>
            <input
              name="cnpj"
              type="text"
              required
              className={inputClass}
              placeholder="00.000.000/0000-00"
              disabled={enviando}
            />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              WhatsApp
            </span>
            <input
              name="telefone"
              type="tel"
              className={inputClass}
              placeholder="(00) 00000-0000"
              disabled={enviando}
            />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </span>
            <input
              name="email"
              type="email"
              required
              className={inputClass}
              placeholder="contato@empresa.com"
              disabled={enviando}
            />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Título do desafio
            </span>
            <input
              name="titulo"
              type="text"
              required
              className={inputClass}
              placeholder="Ex.: Automatizar controle de estoque"
              disabled={enviando}
            />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Tecnologias de interesse{" "}
              <span className="font-normal text-slate-400">(opcional)</span>
            </span>
            <input
              name="tecnologias"
              type="text"
              className={inputClass}
              placeholder="Ex.: Web, App, IA"
              disabled={enviando}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Qual problema deseja resolver?
            </span>
            <textarea
              name="descricao"
              required
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="Descreva o desafio operacional..."
              rows={4}
              disabled={enviando}
            />
          </label>

          {feedback && (
            <p
              role="status"
              className={`sm:col-span-2 rounded-lg border px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <Button type="submit" className="justify-center" disabled={enviando}>
              {enviando ? "Enviando..." : "Quero cadastrar meu desafio"}
            </Button>
            <ButtonLink
              href="/dashboard"
              variant="secondary"
              className="justify-center"
            >
              Acessar painel
            </ButtonLink>
          </div>
        </form>
      </div>
    </section>
  );
}
