"""Teste do fluxo de demandas da empresa (SQLite em memoria, sem rede).

Cobre a regressao que motivou o fluxo: demanda criada pela empresa precisa
aparecer no painel dela, e so dela.

Uso:  python scripts/test_demandas_empresa.py
"""
import os
import sys
import tempfile
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

# Precisa vir antes de importar app.database (o engine e criado no import).
_DB = Path(tempfile.mkdtemp()) / "teste.db"
os.environ["DATABASE_URL"] = f"sqlite:///{_DB.as_posix()}"
os.environ.setdefault("SUPABASE_URL", "https://exemplo.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "chave-de-teste")

from fastapi.testclient import TestClient  # noqa: E402

from app import main  # noqa: E402
from app.deps import admin as deps  # noqa: E402

# UUIDs com letras: o SQLite converte um UUID so-digitos em numero.
CONTAS = {
    "tok-acme": {
        "id": uuid.UUID("aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee"),
        "email": "contato@acme.com",
        "email_confirmed_at": "2026-01-01T00:00:00Z",
        "user_metadata": {"nome": "Acme Ltda", "tipo_conta": "empresa", "cnpj": "11.222.333/0001-81"},
    },
    "tok-outra": {
        "id": uuid.UUID("ffffffff-cccc-4ddd-8eee-aaaaaaaaaaaa"),
        "email": "dono@outra.com",
        "email_confirmed_at": "2026-01-01T00:00:00Z",
        "user_metadata": {"nome": "Outra SA", "tipo_conta": "empresa", "cnpj": "44555666000177"},
    },
}

deps._verify_supabase_jwt = lambda token: CONTAS[token]  # type: ignore[assignment]

client = TestClient(main.app)
falhas: list[str] = []


def checar(descricao: str, condicao: bool, detalhe: str = "") -> None:
    print(f"  [{'ok ' if condicao else 'FALHA'}] {descricao}{f' -> {detalhe}' if detalhe else ''}")
    if not condicao:
        falhas.append(descricao)


def auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def main_test() -> int:
    print("Fluxo de demandas da empresa\n")

    r = client.get("/empresa/me", headers=auth("tok-acme"))
    corpo = r.json()
    checar("conta empresa nova ja nasce vinculada", corpo.get("vinculada") is True, str(r.status_code))
    checar("CNPJ gravado normalizado", corpo["empresa"]["cnpj"] == "11.222.333/0001-81", corpo["empresa"]["cnpj"])

    r = client.post(
        "/empresa/me/demandas",
        headers=auth("tok-acme"),
        json={
            "tipo_problema": "Automacao de processos",
            "descricao": "Automatizar a conferencia de notas fiscais.",
            "urgencia": "alta",
            "cidade": "Florianopolis",
            "segmento": "Servicos",
        },
    )
    checar("empresa cria demanda", r.status_code == 201, str(r.status_code))
    demanda = r.json()
    demanda_id = demanda["id"]
    checar("demanda nasce com status novo", demanda["status"] == "novo", demanda["status"])
    checar("titulo cai no tipo de problema quando vazio", demanda["titulo"] == "Automacao de processos")

    r = client.get("/empresa/me/projetos", headers=auth("tok-acme"))
    checar("demanda aparece no painel da empresa", len(r.json()) == 1, f"{len(r.json())} demanda(s)")

    r = client.get("/empresa/me", headers=auth("tok-acme"))
    empresa = r.json()["empresa"]
    checar("cadastro atualizado pelo formulario", empresa["cidade"] == "Florianopolis", str(empresa["cidade"]))

    r = client.get("/empresa/me/projetos", headers=auth("tok-outra"))
    checar("outra empresa nao ve a demanda", len(r.json()) == 0, f"{len(r.json())} demanda(s)")

    r = client.patch(f"/empresa/me/projetos/{demanda_id}/cancelar", headers=auth("tok-outra"))
    checar("outra empresa nao cancela a demanda", r.status_code == 404, str(r.status_code))

    r = client.patch(f"/empresa/me/projetos/{demanda_id}/cancelar", headers=auth("tok-acme"))
    checar("dona cancela a demanda", r.status_code == 200, str(r.status_code))
    checar("status vira cancelado", r.json().get("status") == "cancelado", str(r.json().get("status")))

    r = client.patch(f"/empresa/me/projetos/{demanda_id}/cancelar", headers=auth("tok-acme"))
    checar("cancelar duas vezes devolve 409", r.status_code == 409, str(r.status_code))

    print()
    if falhas:
        print(f"{len(falhas)} verificacao(oes) falharam:")
        for f in falhas:
            print(f"  - {f}")
        return 1
    print("Todas as verificacoes passaram.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main_test())
