"""Vincula um usuário do Supabase Auth a um perfil admin no painel."""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    parser = argparse.ArgumentParser(description="Cria ou atualiza perfil admin BFD")
    parser.add_argument("--email", required=True)
    parser.add_argument("--nome", required=True)
    parser.add_argument("--auth-user-id", required=True, help="UUID de auth.users (Supabase Dashboard → Auth → Users)")
    parser.add_argument(
        "--papel",
        choices=["super_admin", "coordenador", "analista"],
        default="super_admin",
    )
    parser.add_argument(
        "--categorias",
        help="Slugs de categorias para analista (ex: automacao,sistema_web)",
        default="",
    )
    args = parser.parse_args()

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

    slugs = [s.strip() for s in args.categorias.split(",") if s.strip()]

    try:
        conn = psycopg2.connect(url)
        conn.autocommit = False
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO usuarios_admin (nome, email, auth_user_id, papel, ativo)
                VALUES (%s, %s, %s::uuid, %s, true)
                ON CONFLICT (email) DO UPDATE SET
                    nome = EXCLUDED.nome,
                    auth_user_id = EXCLUDED.auth_user_id,
                    papel = EXCLUDED.papel,
                    ativo = true
                RETURNING id
                """,
                (args.nome, args.email, args.auth_user_id, args.papel),
            )
            admin_id = cur.fetchone()[0]

            if args.papel == "analista" and slugs:
                cur.execute("DELETE FROM admin_categorias WHERE usuario_admin_id = %s", (admin_id,))
                for slug in slugs:
                    cur.execute(
                        """
                        INSERT INTO admin_categorias (usuario_admin_id, categoria_id)
                        SELECT %s, id FROM categorias WHERE slug = %s
                        ON CONFLICT DO NOTHING
                        """,
                        (admin_id, slug),
                    )

        conn.commit()
        conn.close()
        print(f"OK — admin {args.email} ({args.papel}) vinculado.")
        return 0
    except Exception as exc:
        print(f"ERRO: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
