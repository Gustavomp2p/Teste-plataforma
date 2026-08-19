/** Espelha backend/app/cnpj.py — o banco guarda o CNPJ formatado (VARCHAR(18)). */

export const CNPJ_DIGITOS = 14;
export const CNPJ_TAMANHO_FORMATADO = 18;

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Aplica a máscara 00.000.000/0000-00 e descarta dígitos excedentes. */
export function mascararCnpj(valor: string): string {
  const d = apenasDigitos(valor).slice(0, CNPJ_DIGITOS);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export function cnpjValido(valor: string): boolean {
  const d = apenasDigitos(valor);
  // 14 dígitos e não pode ser o mesmo dígito repetido (00.000.000/0000-00).
  return d.length === CNPJ_DIGITOS && new Set(d).size > 1;
}
