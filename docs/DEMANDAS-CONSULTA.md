# Consulta de demandas — usuários e empresas

## Objetivo

Permitir que:

1. **Usuários** (`papel = usuario`) consultem demandas **disponíveis** na plataforma e vejam o detalhe.
2. **Empresas** (`papel = empresa`) consultem e abram o detalhe das **próprias** demandas.

Admins continuam usando `/dashboard/projetos` e `/dashboard/demandas` (gestão interna).

---

## Rotas do frontend

| Perfil | Lista | Detalhe |
|--------|-------|---------|
| Usuário | `/conta/demandas` | `/conta/demandas/[id]` |
| Empresa | `/empresa` (já existia) | `/empresa/demandas/[id]` |
| Admin | `/dashboard/projetos` | `/dashboard/projetos/[id]` |

Permissões de página:

- `/conta/demandas*`: exige sessão; se `is_empresa`, redireciona para `/empresa`.
- `/empresa/demandas/[id]`: exige sessão e `is_empresa`; outros papéis vão para `painel_url`.

---

## Endpoints do backend

| Método | Rota | Quem | Comportamento |
|--------|------|------|---------------|
| GET | `/demandas/` | usuário ou admin autenticado | Lista status `aprovado_squad` e `estruturado`. Empresa recebe **403**. |
| GET | `/demandas/{id}` | usuário ou admin autenticado | Detalhe sanitizado (sem `observacoes_internas`, sem e-mail/telefone da empresa). Se status não liberado → **404**. |
| GET | `/empresa/me/projetos` | empresa | Lista só demandas da empresa (já existia). |
| GET | `/empresa/me/projetos/{id}` | empresa | Detalhe da demanda **própria**; `observacoes_internas` sempre `null` na resposta. |
| POST | `/empresa/me/demandas` | empresa | Cria demanda já vinculada à empresa da sessão. Não aceita `empresa_id` no corpo. |
| PATCH | `/empresa/me/projetos/{id}/cancelar` | empresa | Cancela demanda própria (status → `cancelado`). |

Schemas novos: `DemandaPublicaResponse`, `DemandaPublicaDetalheResponse`, `EmpresaResumoPublico` em `backend/app/schemas/projeto.py`.

---

## Regra de “disponível”

Não existe flag `publico` no banco. A regra adotada:

- **Disponível para usuário:** `status IN (aprovado_squad, estruturado)`
- **Não listado:** `novo`, `em_analise`, `em_contato`, `reprovado` (ainda internos ou encerrados)

Se a regra de negócio mudar (ex.: só `aprovado_squad`), ajustar `STATUS_DISPONIVEIS` em `backend/app/routes/demandas.py`.

---

## Testes realizados

### Backend (import / rotas)

```bash
cd backend
python -c "from app.main import app; print([r.path for r in app.routes if 'demanda' in r.path or 'empresa' in r.path])"
```

Esperado: `/demandas/`, `/demandas/{demanda_id}`, `/empresa/me/projetos/{projeto_id}`.

### Manual sugerido

1. Login como **usuário** → `/conta` → “Ver demandas” → lista → abrir um item.
2. Login como **empresa** → `/empresa` → clicar numa demanda → detalhe com contato.
3. Empresa acessando `/conta/demandas` → redireciona para `/empresa`.
4. Usuário acessando `/empresa/demandas/1` → redireciona para `/conta`.
5. Usuário pedindo demanda com status `novo` via API → 404.
6. Conferir que resposta de `/demandas/{id}` **não** traz `observacoes_internas` nem e-mail da empresa.

### Deploy

- **Frontend (Vercel):** rotas novas sobem com o push da `develop`.
- **Backend (Render):** precisa redeploy para expor `/demandas*` e `GET /empresa/me/projetos/{id}`. Sem isso, as páginas novas falham ao chamar a API.

---

## Inconsistências encontradas

1. **“Demanda” vs “projeto”:** no banco e na API admin o recurso é `projetos`. No UX usuário/empresa usamos “demanda”. São a mesma entidade.
2. **`/dashboard/demandas` ≠ catálogo público:** a fila admin lista só status `novo` (inbox). O catálogo de usuário lista `aprovado_squad` / `estruturado`. Nomes parecidos, públicos diferentes.
3. **Sem flag de publicação:** disponibilidade depende só do status. Não há fluxo explícito “publicar no catálogo”.
4. **Card “Cadastrar demanda” em `/conta`:** usuários comuns veem CTA para `/#cadastro`, mas o cadastro de demanda na landing cria **empresa + projeto**. Papel `usuario` tipicamente não deveria cadastrar demanda de empresa — possível confusão de produto.
5. **Lista da empresa e observações internas:** `GET /empresa/me/projetos` agora zera `observacoes_internas` na resposta (mesmo schema `ProjetoResponse`). O ideal a médio prazo é um schema dedicado sem o campo.
6. **Catálogo pode ficar vazio em produção** até a equipe mover demandas para `aprovado_squad` / `estruturado`.
7. **Backend e frontend desacoplados no deploy:** se só o front subir, `/conta/demandas` quebra até o Render atualizar.

---

## Cadastro e cancelamento pela empresa

O formulário de demanda (`/cadastro`) é exclusivo de contas empresa e **não
coleta mais nome da empresa, CNPJ nem e-mail** — esses dados vêm da conta
autenticada. Antes o formulário chamava `POST /empresas/` a cada envio, o que
criava uma empresa nova (ou falhava com "CNPJ ou e-mail já cadastrado") e fazia
a demanda cair sob outra empresa, sumindo do painel.

O vínculo da conta com a empresa é resolvido em
`_vincular_ou_criar_empresa` (`backend/app/deps/admin.py`): procura por CNPJ,
depois por e-mail, e **cria o cadastro** quando nenhum existe. Contas empresa
sem CNPJ válido ficam sem vínculo e o painel exibe o aviso correspondente.

### Cancelamento

A empresa cancela a própria demanda enquanto ela ainda não foi aprovada para uma
squad — `STATUS_CANCELAVEIS` em `backend/app/routes/empresa.py`:

`novo`, `em_analise`, `em_contato`, `reprovado`

Em `aprovado_squad` e `estruturado` há alunos trabalhando na demanda, então o
cancelamento passa a ser conversado com a equipe BFD (**409** com mensagem
orientando o contato). Cancelar duas vezes também devolve **409**.

O botão aparece no painel (`/empresa`) e no detalhe (`/empresa/demandas/[id]`),
controlado por `empresaPodeCancelar` em `frontend/src/lib/status.ts`.

### Teste

```bash
cd backend && python scripts/test_demandas_empresa.py
```

Sobe a API em SQLite temporário com o Supabase mockado e verifica o fluxo
completo, incluindo o isolamento entre empresas.
