# Supabase — MCP e migration

## Diagnóstico (logs do Cursor nesta máquina)

1. **Token OAuth expirado/inválido**  
   Log: `No such refresh token found` → estado `needsAuth`

2. **Configuração duplicada** (corrigido)  
   Havia **plugin Supabase** + `.cursor/mcp.json` no projeto, os dois como `supabase`.  
   Removemos o `.cursor/mcp.json` do projeto para ficar só o **plugin**.

3. **Processo MCP do Cursor** (Windows)  
   Às vezes: `timed out waiting for ipcReady` — bug conhecido do Cursor; o plugin HTTP ainda chega em `needsAuth`.

## Corrigir o MCP (1 clique seu — obrigatório)

1. **Settings → MCP → supabase**
2. Clique em **Logout**
3. `Ctrl+Shift+P` → **Developer: Reload Window**
4. Volte em **MCP → supabase** e clique em **Connect** / **Login**
5. Faça login no navegador com a conta do projeto `eexyhqvpgbdkzjtfraaw`
6. Status deve ficar **verde**
7. Abra um **chat novo** e peça: *aplica a migration*

## Aplicar migration sem MCP (alternativa)

1. Edite `backend/.env` — troque `SUA_SENHA` pela senha real do banco
2. Rode:
   ```bash
   cd backend
   venv\Scripts\activate
   python scripts\apply_migration.py
   ```
3. Ou cole o SQL manualmente:  
   https://supabase.com/dashboard/project/eexyhqvpgbdkzjtfraaw/sql/new
