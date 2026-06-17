"""Aplica backend/migrations/001_schema_bfd.sql usando DATABASE_URL do .env"""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
MIGRATION = ROOT / "migrations" / "001_schema_bfd.sql"


def main() -> int:
    load_dotenv(ROOT / ".env")
    url = os.getenv("DATABASE_URL", "")
    if not url or "SUA_SENHA" in url:
        print("ERRO: Configure DATABASE_URL em backend/.env com a senha real do Supabase.")
        print("  Supabase → Project Settings → Database → Connection string")
        return 1

    if not MIGRATION.exists():
        print(f"ERRO: Migration não encontrada: {MIGRATION}")
        return 1

    sql = MIGRATION.read_text(encoding="utf-8")

    try:
        import psycopg2
    except ImportError:
        print("ERRO: pip install psycopg2-binary")
        return 1

    print(f"Aplicando {MIGRATION.name}...")
    try:
        conn = psycopg2.connect(url)
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.close()
        print("OK — migration aplicada com sucesso.")
        return 0
    except Exception as exc:
        print(f"ERRO ao conectar/aplicar: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
