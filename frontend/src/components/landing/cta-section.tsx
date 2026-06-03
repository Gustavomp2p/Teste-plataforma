"use client";

import { ButtonLink } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-brand-500/30";

export function CtaSection() {
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
          O formulário será integrado à API em breve. Use os campos abaixo para
          validar o layout com o squad.
        </p>

        <form
          className="mt-8 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Nome da empresa
            </span>
            <input type="text" className={inputClass} placeholder="Sua empresa" />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Responsável
            </span>
            <input type="text" className={inputClass} placeholder="Nome completo" />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              WhatsApp
            </span>
            <input type="tel" className={inputClass} placeholder="(00) 00000-0000" />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </span>
            <input type="email" className={inputClass} placeholder="contato@empresa.com" />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Segmento
            </span>
            <select className={inputClass} defaultValue="">
              <option value="" disabled>
                Selecione o segmento
              </option>
              <option>Comércio</option>
              <option>Indústria</option>
              <option>Serviços</option>
              <option>Tecnologia</option>
              <option>Outro</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Qual problema deseja resolver?
            </span>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="Descreva o desafio operacional..."
              rows={4}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Nível de urgência
            </span>
            <select className={inputClass} defaultValue="">
              <option value="" disabled>
                Selecione a urgência
              </option>
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
            </select>
          </label>
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <ButtonLink href="/dashboard" className="justify-center">
              Quero cadastrar meu desafio
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary" className="justify-center">
              Acessar painel
            </ButtonLink>
          </div>
        </form>
      </div>
    </section>
  );
}
