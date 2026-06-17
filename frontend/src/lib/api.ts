/**
 * Cliente de acesso à API FastAPI do backend (server-side only).
 */

export type StatusProjeto =
  | "novo"
  | "em_analise"
  | "em_contato"
  | "aprovado_turma"
  | "reprovado"
  | "estruturado";

export type Nivel = "baixa" | "media" | "alta";

export type Empresa = {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string | null;
  responsavel_nome: string | null;
  cidade: string | null;
  segmento: string | null;
  aceita_contato: boolean;
  descricao: string | null;
  criado_em: string;
};

export type Categoria = {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
};

export type Projeto = {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string | null;
  tipo_problema: string | null;
  urgencia: Nivel | string | null;
  status: StatusProjeto | string;
  complexidade: Nivel | string | null;
  prioridade: Nivel | string | null;
  observacoes_internas: string | null;
  briefing_contexto: string | null;
  briefing_objetivo: string | null;
  briefing_escopo: string | null;
  briefing_requisitos: string | null;
  briefing_resultado: string | null;
  categoria_id: number | null;
  empresa_id: number;
  criado_em: string;
  atualizado_em: string | null;
};

export type ProjetoDetalhe = Projeto & {
  empresa?: Pick<
    Empresa,
    "id" | "nome" | "email" | "telefone" | "responsavel_nome" | "cidade" | "segmento"
  >;
  categoria?: Categoria | null;
};

export type EmpresaInput = {
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string | null;
  responsavel_nome?: string | null;
  cidade?: string | null;
  segmento?: string | null;
  aceita_contato?: boolean;
  descricao?: string | null;
};

export type ProjetoInput = {
  titulo: string;
  descricao: string;
  tecnologias?: string | null;
  tipo_problema?: string | null;
  urgencia?: Nivel | null;
  categoria_id?: number | null;
  empresa_id: number;
};

export type ProjetoUpdateInput = {
  status?: StatusProjeto;
  complexidade?: Nivel | null;
  prioridade?: Nivel | null;
  observacoes_internas?: string | null;
  briefing_contexto?: string | null;
  briefing_objetivo?: string | null;
  briefing_escopo?: string | null;
  briefing_requisitos?: string | null;
  briefing_resultado?: string | null;
  categoria_id?: number | null;
};

export type ProjetoFiltros = {
  status?: string;
  cidade?: string;
  segmento?: string;
  complexidade?: string;
  skip?: number;
  limit?: number;
};

const API_URL = process.env.API_URL ?? "http://localhost:8000";
const API_KEY = process.env.API_KEY;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  cache?: RequestCache;
  searchParams?: Record<string, string>;
  auth?: boolean;
  accessToken?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, cache = "no-store", searchParams, auth = false, accessToken } = options;

  const url = new URL(path, API_URL);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) {
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else if (API_KEY) {
      headers["X-API-Key"] = API_KEY;
    } else {
      throw new ApiError("Sessão expirada ou API_KEY não configurada.", 401);
    }
  }

  let res: Response;
  try {
    res = await fetch(url, { method, cache, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Não foi possível conectar à API. Verifique se o backend está rodando.", 503);
  }

  if (!res.ok) {
    let detail = `Erro ${res.status} ao acessar a API.`;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") detail = data.detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function listarEmpresas(accessToken?: string | null) {
  return request<Empresa[]>("/empresas/", { auth: true, accessToken });
}

export function criarEmpresa(data: EmpresaInput) {
  return request<Empresa>("/empresas/", { method: "POST", body: data });
}

export function listarCategorias(accessToken?: string | null) {
  return request<Categoria[]>("/categorias/", { auth: true, accessToken });
}

export function listarProjetos(filtros: ProjetoFiltros = {}, accessToken?: string | null) {
  const searchParams: Record<string, string> = {};
  if (filtros.status) searchParams.status = filtros.status;
  if (filtros.cidade) searchParams.cidade = filtros.cidade;
  if (filtros.segmento) searchParams.segmento = filtros.segmento;
  if (filtros.complexidade) searchParams.complexidade = filtros.complexidade;
  if (filtros.skip != null) searchParams.skip = String(filtros.skip);
  if (filtros.limit != null) searchParams.limit = String(filtros.limit);
  return request<Projeto[]>("/projetos/", { auth: true, searchParams, accessToken });
}

export function buscarProjeto(id: number, accessToken?: string | null) {
  return request<ProjetoDetalhe>(`/projetos/${id}`, { auth: true, accessToken });
}

export function criarProjeto(data: ProjetoInput) {
  return request<Projeto>("/projetos/", { method: "POST", body: data });
}

export function atualizarStatusProjeto(id: number, status: StatusProjeto, accessToken?: string | null) {
  return request<Projeto>(`/projetos/${id}/status`, {
    method: "PATCH",
    searchParams: { status },
    auth: true,
    accessToken,
  });
}

export function atualizarProjeto(id: number, data: ProjetoUpdateInput, accessToken?: string | null) {
  return request<Projeto>(`/projetos/${id}`, { method: "PATCH", body: data, auth: true, accessToken });
}
