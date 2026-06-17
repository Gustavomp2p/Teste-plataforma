"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { SEGMENTOS, TIPOS_PROBLEMA } from "@/lib/status";

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
      responsavel_nome: String(data.get("responsavel_nome") ?? ""),
      telefone: String(data.get("telefone") ?? ""),
      email: String(data.get("email") ?? ""),
      cidade: String(data.get("cidade") ?? ""),
      segmento: String(data.get("segmento") ?? ""),
      tipo_problema: String(data.get("tipo_problema") ?? ""),
      descricao: String(data.get("descricao") ?? ""),
      tecnologias: String(data.get("tecnologias") ?? ""),
      urgencia: String(data.get("urgencia") ?? ""),
      aceita_contato: data.get("aceita_contato") === "on",
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
      if (!res.ok) throw new Error(result.message ?? "Não foi possível enviar o cadastro.");
      setFeedback({
        type: "success",
        message: result.message ?? "Demanda cadastrada com sucesso!",
      });
      form.reset();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Não foi possível enviar o cadastro.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="cadastro" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Cadastro de demanda
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Conte qual desafio sua empresa gostaria de resolver
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Preencha o formulário abaixo. Sua demanda será qualificada pela equipe do
          programa Bolsa Futuro Digital.
        </p>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nome da empresa</span>
            <input name="nome" required className={inputClass} placeholder="Sua empresa" disabled={enviando} />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">CNPJ</span>
            <input name="cnpj" required className={inputClass} placeholder="00.000.000/0000-00" disabled={enviando} />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nome do responsável</span>
            <input name="responsavel_nome" required className={inputClass} placeholder="Nome completo" disabled={enviando} />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">WhatsApp</span>
            <input name="telefone" type="tel" className={inputClass} placeholder="(00) 00000-0000" disabled={enviando} />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">E-mail</span>
            <input name="email" type="email" required className={inputClass} placeholder="contato@empresa.com" disabled={enviando} />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Cidade</span>
            <input name="cidade" required className={inputClass} placeholder="Ex.: Florianópolis" disabled={enviando} />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Segmento</span>
            <select name="segmento" required className={inputClass} defaultValue="" disabled={enviando}>
              <option value="" disabled>Selecione o segmento</option>
              {SEGMENTOS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Tipo de problema</span>
            <select name="tipo_problema" required className={inputClass} defaultValue="" disabled={enviando}>
              <option value="" disabled>Selecione o tipo</option>
              {TIPOS_PROBLEMA.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Descrição da necessidade</span>
            <textarea
              name="descricao"
              required
              rows={4}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="Descreva o desafio operacional..."
              disabled={enviando}
            />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Tecnologias de interesse <span className="font-normal text-slate-400">(opcional)</span>
            </span>
            <input name="tecnologias" className={inputClass} placeholder="Ex.: Web, App, IA" disabled={enviando} />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nível de urgência</span>
            <select name="urgencia" className={inputClass} defaultValue="" disabled={enviando}>
              <option value="">Selecione (opcional)</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </label>
          <label className="flex items-start gap-2 sm:col-span-2">
            <input type="checkbox" name="aceita_contato" defaultChecked className="mt-1" disabled={enviando} />
            <span className="text-sm text-slate-600">
              Aceito ser contatado pela equipe do programa para dar continuidade à demanda.
            </span>
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
              {enviando ? "Enviando..." : "Cadastrar minha demanda"}
            </Button>
            <ButtonLink href="/dashboard" variant="secondary" className="justify-center">
              Acessar painel
            </ButtonLink>
          </div>
        </form>
      </div>
    </section>
  );
}
