"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  demandaId: number;
  titulo: string;
  /** Botao compacto para a listagem do painel. */
  compacto?: boolean;
};

export function CancelarDemandaButton({ demandaId, titulo, compacto = false }: Props) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function cancelar() {
    if (enviando) return;
    const ok = window.confirm(
      `Cancelar a demanda "${titulo}"? A equipe BFD deixa de qualificá-la. Esta ação não pode ser desfeita.`,
    );
    if (!ok) return;

    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch(`/api/empresa/demandas/${demandaId}/cancelar`, { method: "PATCH" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? "Não foi possível cancelar a demanda.");
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível cancelar a demanda.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={compacto ? "" : "mt-6"}>
      <Button
        type="button"
        variant="secondary"
        onClick={cancelar}
        disabled={enviando}
        className={
          compacto
            ? "border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
            : "border-red-200 text-red-700 hover:bg-red-50"
        }
      >
        {enviando ? "Cancelando..." : "Cancelar demanda"}
      </Button>
      {erro && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}
