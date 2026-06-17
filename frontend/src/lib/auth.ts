export type PapelUsuario =
  | "usuario"
  | "analista"
  | "coordenador"
  | "super_admin";

export type PerfilUsuario = {
  id: number;
  nome: string;
  email: string;
  papel: PapelUsuario;
  is_admin: boolean;
  escopo_total: boolean;
  painel_url: string;
  categorias: { id: number; nome: string; slug: string }[];
};

export const PAPEL_LABEL: Record<PapelUsuario, string> = {
  usuario: "Usuário",
  analista: "Analista",
  coordenador: "Coordenador",
  super_admin: "Administrador",
};

export function painelParaPapel(isAdmin: boolean): string {
  return isAdmin ? "/dashboard" : "/conta";
}
