"""Normalização e validação de CNPJ.

O banco guarda o CNPJ formatado (``VARCHAR(18)`` — ``00.000.000/0000-00``),
então toda entrada passa por aqui antes de chegar ao modelo. Comparações
sempre usam :func:`cnpj_digitos`, nunca a string formatada.
"""

CNPJ_TAMANHO = 14
CNPJ_FORMATADO_TAMANHO = 18


def cnpj_digitos(valor: str | None) -> str:
    """Devolve apenas os dígitos do CNPJ (string vazia quando não há valor)."""
    if not valor:
        return ""
    return "".join(c for c in valor if c.isdigit())


def cnpj_valido(valor: str | None) -> bool:
    """CNPJ tem 14 dígitos e não pode ser uma repetição do mesmo dígito."""
    digitos = cnpj_digitos(valor)
    if len(digitos) != CNPJ_TAMANHO:
        return False
    return len(set(digitos)) > 1


def formatar_cnpj(valor: str | None) -> str:
    """Formata como ``00.000.000/0000-00``; devolve o original se não der."""
    d = cnpj_digitos(valor)
    if len(d) != CNPJ_TAMANHO:
        return (valor or "").strip()
    return f"{d[:2]}.{d[2:5]}.{d[5:8]}/{d[8:12]}-{d[12:]}"
