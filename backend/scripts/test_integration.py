"""Testes de integração local — backend, Supabase e env."""
import os
import sys
from pathlib import Path

import httpx
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
load_dotenv(ROOT.parent / "frontend" / ".env.local")

API_URL = os.getenv("API_URL", "http://127.0.0.1:8000").rstrip("/")
if API_URL == "http://localhost:8000":
    API_URL = "http://127.0.0.1:8000"
API_KEY = os.getenv("API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON = os.getenv("SUPABASE_ANON_KEY", "")


def main() -> int:
    ok, fail, warn = [], [], []

    required_fe = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
    required_be = ["DATABASE_URL", "SUPABASE_URL", "SUPABASE_ANON_KEY", "API_KEY"]
    for k in required_fe:
        (ok if os.getenv(k) else fail).append(f"front:{k}")
    for k in required_be:
        (ok if os.getenv(k) else fail).append(f"back:{k}")

    if SUPABASE_URL.endswith("/rest/v1"):
        fail.append("SUPABASE_URL tem /rest/v1 (errado)")

    try:
        with httpx.Client(timeout=10.0) as c:
            r = c.get(f"{API_URL}/health")
            if r.status_code == 200 and r.json().get("status") == "ok":
                ok.append("backend /health")
            else:
                fail.append(f"backend /health ({r.status_code})")

            if API_KEY:
                h = {"X-API-Key": API_KEY}
                for path in ("/empresas/", "/categorias/", "/projetos/"):
                    r = c.get(f"{API_URL}{path}", headers=h)
                    if r.status_code == 200:
                        ok.append(f"API {path} ({len(r.json())} itens)")
                    else:
                        fail.append(f"API {path} ({r.status_code})")

            if SUPABASE_URL and SUPABASE_ANON:
                r = c.get(
                    f"{SUPABASE_URL}/auth/v1/health",
                    headers={"apikey": SUPABASE_ANON},
                )
                if r.status_code == 200:
                    ok.append("supabase auth health")
                else:
                    fail.append(f"supabase auth ({r.status_code})")

            try:
                r = c.get("http://127.0.0.1:3000/login", follow_redirects=False)
                if r.status_code in (200, 307, 308):
                    ok.append(f"frontend /login ({r.status_code})")
                else:
                    warn.append(f"frontend /login ({r.status_code})")
            except httpx.HTTPError:
                warn.append("frontend /login (não rodando na :3000)")
    except httpx.HTTPError as exc:
        fail.append(f"conexão: {exc}")

    print("\n=== Testes integração ===\n")
    for x in ok:
        print(f"  OK   {x}")
    for x in warn:
        print(f"  AVISO {x}")
    for x in fail:
        print(f"  ERRO {x}")

    if fail:
        print(f"\nResultado: FALHOU ({len(fail)} erro(s))")
        return 1
    print(f"\nResultado: OK ({len(warn)} aviso(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
