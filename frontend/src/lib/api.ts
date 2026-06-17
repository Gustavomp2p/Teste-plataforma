/**
 * Cliente de acesso à API FastAPI do backend.
 *
 * Estas funções rodam apenas no servidor (Server Components e Route Handlers),
 * por isso a URL do backend fica em `process.env.API_URL` e nunca é exposta ao
 * navegador.
 */

export type StatusProjeto = "aberto" | "em_andamento" | "concluido";

export type Empresa = {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string | null;
  descricao: string | null;
  criado_em: string;
};

export type Projeto = {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string | null;
  status: StatusProjeto;
  empresa_id: number;
  criado_em: string;
};

export type EmpresaInput = {
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string | null;
  descricao?: string | null;
};

export type ProjetoInput = {
  titulo: string;
  descricao: string;
  tecnologias?: string | null;
  empresa_id: number;
};

const API_URL = process.env.API_URL ?? "http://localhost:8000";
const API_KEY = process.env.API_KEY;

/** Erro de API com a mensagem (em português, quando possível) vinda do backend. */
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
  /** Por padrão não usa cache para refletir os dados mais recentes do banco. */
  cache?: RequestCache;
  searchParams?: Record<string, string>;
  /** Quando true, envia o header X-API-Key (rotas do painel). */
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, cache = "no-store", searchParams, auth = false } = options;

  const url = new URL(path, API_URL);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) {
    if (!API_KEY) {
      throw new ApiError(
        "API_KEY não configurada no frontend (defina em .env.local).",
        500,
      );
    }
    headers["X-API-Key"] = API_KEY;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      cache,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o backend está rodando.",
      503,
    );
  }

  if (!res.ok) {
    let detail = `Erro ${res.status} ao acessar a API.`;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") {
        detail = data.detail;
      } else if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
        detail = data.detail[0].msg;
      }
    } catch {
      // resposta sem corpo JSON — mantém a mensagem padrão
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Empresas
// ---------------------------------------------------------------------------

export function listarEmpresas() {
  return request<Empresa[]>("/empresas/", { auth: true });
}

export function buscarEmpresa(id: number) {
  return request<Empresa>(`/empresas/${id}`, { auth: true });
}

export function criarEmpresa(data: EmpresaInput) {
  return request<Empresa>("/empresas/", { method: "POST", body: data });
}

// ---------------------------------------------------------------------------
// Projetos
// ---------------------------------------------------------------------------

export function listarProjetos() {
  return request<Projeto[]>("/projetos/", { auth: true });
}

export function buscarProjeto(id: number) {
  return request<Projeto>(`/projetos/${id}`, { auth: true });
}

export function criarProjeto(data: ProjetoInput) {
  return request<Projeto>("/projetos/", { method: "POST", body: data });
}

export function atualizarStatusProjeto(id: number, status: StatusProjeto) {
  // O backend recebe o status como query param em PATCH /projetos/{id}/status.
  return request<Projeto>(`/projetos/${id}/status`, {
    method: "PATCH",
    searchParams: { status },
    auth: true,
  });
}
