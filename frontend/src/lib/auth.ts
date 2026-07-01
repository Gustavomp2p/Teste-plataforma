export type PapelUsuario =
  | "usuario"
  | "empresa"
  | "analista"
  | "coordenador"
  | "super_admin";

export type PerfilUsuario = {
  id: number;
  nome: string;
  email: string;
  papel: PapelUsuario;
  is_admin: boolean;
  is_empresa: boolean;
  empresa_id: number | null;
  escopo_total: boolean;
  painel_url: string;
  categorias: { id: number; nome: string; slug: string }[];
};

export const PAPEL_LABEL: Record<string, string> = {
  usuario: "Usuário",
  empresa: "Empresa",
  analista: "Administrador",
  coordenador: "Administrador",
  super_admin: "Administrador",
};

export function painelParaPapel(perfil: Pick<PerfilUsuario, "painel_url">): string {
  return perfil.painel_url;
}
