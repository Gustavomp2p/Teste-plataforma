import Link from "next/link";

const inputClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline focus:outline-2 focus:outline-brand-500/30";

type ProjetoFiltersProps = {
  status?: string;
  cidade?: string;
  segmento?: string;
  complexidade?: string;
};

export function ProjetoFilters({ status, cidade, segmento, complexidade }: ProjetoFiltersProps) {
  return (
    <form className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4" method="get">
      <select name="status" defaultValue={status ?? ""} className={inputClass}>
        <option value="">Todos os status</option>
        <option value="novo">Novo</option>
        <option value="em_analise">Em análise</option>
        <option value="em_contato">Em contato</option>
        <option value="aprovado_turma">Aprovado para turma</option>
        <option value="reprovado">Reprovado</option>
        <option value="estruturado">Estruturado</option>
      </select>
      <input
        name="cidade"
        defaultValue={cidade ?? ""}
        placeholder="Cidade"
        className={inputClass}
      />
      <input
        name="segmento"
        defaultValue={segmento ?? ""}
        placeholder="Segmento"
        className={inputClass}
      />
      <select name="complexidade" defaultValue={complexidade ?? ""} className={inputClass}>
        <option value="">Complexidade</option>
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>
      <button
        type="submit"
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
      >
        Filtrar
      </button>
      <Link
        href="/dashboard/projetos"
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Limpar
      </Link>
    </form>
  );
}
