-- Auth Supabase — perfis admin, papéis e escopo por categoria
-- Projeto: eexyhqvpgbdkzjtfraaw
-- Execute após 001_schema_bfd.sql

BEGIN;

-- Remove senha local (auth via Supabase Auth)
ALTER TABLE usuarios_admin DROP COLUMN IF EXISTS senha_hash;

ALTER TABLE usuarios_admin ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
ALTER TABLE usuarios_admin ADD COLUMN IF NOT EXISTS papel VARCHAR(30) NOT NULL DEFAULT 'analista';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_admin_auth_user_id_fkey'
    ) THEN
        ALTER TABLE usuarios_admin
            ADD CONSTRAINT usuarios_admin_auth_user_id_fkey
            FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Papéis: super_admin (tudo) | coordenador (todos projetos) | analista (por categoria)
COMMENT ON COLUMN usuarios_admin.papel IS 'super_admin | coordenador | analista';

CREATE TABLE IF NOT EXISTS admin_categorias (
    usuario_admin_id INTEGER NOT NULL REFERENCES usuarios_admin(id) ON DELETE CASCADE,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_admin_id, categoria_id)
);

ALTER TABLE admin_categorias ENABLE ROW LEVEL SECURITY;

-- Exemplo: vincular primeiro admin (substitua o UUID pelo auth.users.id do Supabase)
-- INSERT INTO usuarios_admin (nome, email, auth_user_id, papel, ativo)
-- VALUES ('Admin BFD', 'admin@exemplo.com', '00000000-0000-0000-0000-000000000000', 'super_admin', true)
-- ON CONFLICT (email) DO UPDATE SET auth_user_id = EXCLUDED.auth_user_id, papel = EXCLUDED.papel;

COMMIT;
