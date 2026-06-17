"""Verifica se o schema Supabase está alinhado com as migrations BFD."""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]

EXPECTED = {
    "categorias": {
        "id", "nome", "slug", "descricao", "ativo", "criado_em",
    },
    "empresas": {
        "id", "nome", "cnpj", "email", "telefone", "descricao", "criado_em",
        "responsavel_nome", "cidade", "segmento", "aceita_contato",
    },
    "projetos": {
        "id", "titulo", "descricao", "tecnologias", "status", "empresa_id", "criado_em",
        "tipo_problema", "urgencia", "categoria_id", "complexidade", "prioridade",
        "observacoes_internas", "briefing_contexto", "briefing_objetivo", "briefing_escopo",
        "briefing_requisitos", "briefing_resultado", "atualizado_em",
    },
    "usuarios_admin": {
        "id", "nome", "email", "ativo", "criado_em", "auth_user_id", "papel",
    },
    "admin_categorias": {
        "usuario_admin_id", "categoria_id",
    },
}

SEED_CATEGORIAS = {"automacao", "sistema_web", "app_mobile", "dados_ia", "outro"}


def main() -> int:
    load_dotenv(ROOT / ".env")
    url = os.getenv("DATABASE_URL", "")
    if not url or "SUA_SENHA" in url:
        print("ERRO: Configure DATABASE_URL em backend/.env")
        return 1

    try:
        import psycopg2
    except ImportError:
        print("ERRO: pip install psycopg2-binary")
        return 1

    errors: list[str] = []
    warnings: list[str] = []
    ok: list[str] = []

    try:
        conn = psycopg2.connect(url)
        with conn.cursor() as cur:
            for table, cols in EXPECTED.items():
                cur.execute(
                    """
                    SELECT column_name FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = %s
                    """,
                    (table,),
                )
                found = {row[0] for row in cur.fetchall()}
                if not found:
                    errors.append(f"Tabela ausente: {table}")
                    continue
                missing = cols - found
                extra = found - cols
                if missing:
                    errors.append(f"{table}: colunas faltando → {', '.join(sorted(missing))}")
                else:
                    ok.append(f"Tabela {table}: colunas OK")
                if extra:
                    warnings.append(f"{table}: colunas extras → {', '.join(sorted(extra))}")

            cur.execute("SELECT slug FROM categorias WHERE ativo = true")
            slugs = {row[0] for row in cur.fetchall()}
            if not SEED_CATEGORIAS.issubset(slugs):
                errors.append(
                    f"Categorias seed incompletas. Faltam: {', '.join(sorted(SEED_CATEGORIAS - slugs))}"
                )
            else:
                ok.append(f"Categorias seed: {len(slugs)} ativas")

            cur.execute(
                """
                SELECT relrowsecurity FROM pg_class c
                JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname = 'public' AND c.relname IN ('categorias', 'usuarios_admin', 'admin_categorias')
                """
            )
            rls = {row[0] for row in cur.fetchall()}
            if False in rls:
                warnings.append("RLS desabilitado em alguma tabela sensível (recomendado habilitar)")

            cur.execute("SELECT COUNT(*) FROM usuarios_admin WHERE ativo = true AND auth_user_id IS NOT NULL")
            admins = cur.fetchone()[0]
            if admins == 0:
                warnings.append(
                    "Nenhum admin vinculado ao Supabase Auth (auth_user_id). "
                    "Crie o usuário no Auth e rode scripts/seed_admin.py"
                )
            else:
                ok.append(f"Admins ativos com auth: {admins}")

            cur.execute(
                """
                SELECT column_name, data_type FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'projetos' AND column_name = 'status'
                """
            )
            row = cur.fetchone()
            if row and row[1] not in ("character varying", "text"):
                warnings.append(f"projetos.status ainda é {row[1]} (esperado varchar)")

        conn.close()
    except Exception as exc:
        print(f"ERRO de conexão/consulta: {exc}")
        return 1

    print("\n=== Verificação schema BFD ===\n")
    for line in ok:
        print(f"  OK  {line}")
    for line in warnings:
        print(f"  AVISO  {line}")
    for line in errors:
        print(f"  ERRO  {line}")

    if errors:
        print(f"\nResultado: FALHOU ({len(errors)} erro(s))")
        return 1
    print(f"\nResultado: OK ({len(warnings)} aviso(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
