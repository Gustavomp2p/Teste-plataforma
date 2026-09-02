"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MOTIVOS_CANCELAMENTO } from "@/lib/status";

type Props = {
  demandaId: number;
  titulo: string;
  /** Gatilho em "x" no canto do card da listagem; senão, botão com rótulo. */
  compacto?: boolean;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-brand-500/30 disabled:opacity-60";

export function CancelarDemandaButton({ demandaId, titulo, compacto = false }: Props) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [observacao, setObservacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const tituloId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Esc fecha a caixa; o body trava para o fundo não rolar junto.
  useEffect(() => {
    if (!aberto) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") fechar();
    }
    document.addEventListener("keydown", onKey);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAnterior;
    };
  }, [aberto]);

  function abrir() {
    setMotivo("");
    setObservacao("");
    setErro(null);
    setAberto(true);
  }

  function fechar() {
    if (enviando) return;
    setAberto(false);
  }

  async function confirmar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando) return;
    if (!motivo) {
      setErro("Selecione o motivo do cancelamento.");
      return;
    }

    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch(`/api/empresa/demandas/${demandaId}/cancelar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo, observacao }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? "Não foi possível cancelar a demanda.");
      setAberto(false);
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível cancelar a demanda.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      {compacto ? (
        <button
          type="button"
          onClick={abrir}
          aria-label={`Cancelar a demanda ${titulo}`}
          title="Cancelar demanda"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={abrir}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            Cancelar demanda
          </Button>
        </div>
      )}

      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={fechar}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={tituloId} className="text-lg font-bold text-slate-900">
                  Cancelar demanda
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  &ldquo;{titulo}&rdquo; — a equipe BFD deixa de qualificá-la. Esta ação não
                  pode ser desfeita.
                </p>
              </div>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                disabled={enviando}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={confirmar}>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Motivo do cancelamento
                </span>
                <select
                  value={motivo}
                  onChange={(event) => setMotivo(event.target.value)}
                  required
                  disabled={enviando}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Selecione o motivo
                  </option>
                  {MOTIVOS_CANCELAMENTO.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Observação <span className="font-normal text-slate-400">(opcional)</span>
                </span>
                <textarea
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  disabled={enviando}
                  placeholder="Conte para a equipe o que motivou o cancelamento."
                  className={`${inputClass} min-h-[96px] resize-y`}
                />
              </label>

              {erro && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {erro}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={fechar} disabled={enviando}>
                  Voltar
                </Button>
                <Button type="submit" variant="danger" disabled={enviando}>
                  {enviando ? "Cancelando..." : "Confirmar cancelamento"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
