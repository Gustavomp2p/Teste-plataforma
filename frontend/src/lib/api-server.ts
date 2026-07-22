import { getAccessToken } from "@/lib/supabase/server";
import {
  ApiError,
  listarCategorias as listarCategoriasBase,
  listarEmpresas as listarEmpresasBase,
  listarProjetos as listarProjetosBase,
  buscarProjeto as buscarProjetoBase,
  buscarPerfil as buscarPerfilBase,
  sincronizarPerfil as sincronizarPerfilBase,
  atualizarProjeto as atualizarProjetoBase,
  atualizarStatusProjeto as atualizarStatusProjetoBase,
  listarProjetosEmpresa as listarProjetosEmpresaBase,
  buscarProjetoEmpresa as buscarProjetoEmpresaBase,
  listarDemandasDisponiveis as listarDemandasDisponiveisBase,
  buscarDemandaDisponivel as buscarDemandaDisponivelBase,
  buscarEmpresaVinculada as buscarEmpresaVinculadaBase,
  type ProjetoFiltros,
  type DemandaFiltros,
  type ProjetoUpdateInput,
  type StatusProjeto,
} from "@/lib/api";

async function token() {
  return getAccessToken();
}

export async function listarEmpresas() {
  return listarEmpresasBase(await token());
}

export async function listarCategorias() {
  return listarCategoriasBase(await token());
}

export async function listarProjetos(filtros: ProjetoFiltros = {}) {
  return listarProjetosBase(filtros, await token());
}

export async function buscarProjeto(id: number) {
  return buscarProjetoBase(id, await token());
}

export async function atualizarProjeto(id: number, data: ProjetoUpdateInput) {
  return atualizarProjetoBase(id, data, await token());
}

export async function atualizarStatusProjeto(id: number, status: StatusProjeto) {
  return atualizarStatusProjetoBase(id, status, await token());
}

export async function buscarPerfil() {
  return buscarPerfilBase(await token());
}

export async function sincronizarPerfil() {
  return sincronizarPerfilBase(await token());
}

export async function listarProjetosEmpresa() {
  return listarProjetosEmpresaBase(await token());
}

export async function buscarProjetoEmpresa(id: number) {
  return buscarProjetoEmpresaBase(id, await token());
}

export async function listarDemandasDisponiveis(filtros: DemandaFiltros = {}) {
  return listarDemandasDisponiveisBase(filtros, await token());
}

export async function buscarDemandaDisponivel(id: number) {
  return buscarDemandaDisponivelBase(id, await token());
}

export async function buscarEmpresaVinculada() {
  return buscarEmpresaVinculadaBase(await token());
}

export { ApiError };
export type { StatusProjeto } from "@/lib/api";
