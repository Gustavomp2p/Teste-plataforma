-- Migration BFD — alinhada ao plano de trabalho (Épico 6.2 / 8.3)
-- Execute no Supabase: SQL Editor → New query → Run
-- Projeto: eexyhqvpgbdkzjtfraaw

BEGIN;

-- ---------------------------------------------------------------------------
-- Categorias de projeto
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categorias (nome, slug, descricao) VALUES
    ('Automação de processos', 'automacao', 'Fluxos, integrações e tarefas repetitivas'),
    ('Sistema web', 'sistema_web', 'Portais, painéis e aplicações web'),
    ('Aplicativo mobile', 'app_mobile', 'Apps para Android/iOS'),
    ('Dados e IA', 'dados_ia', 'Análise de dados, dashboards e IA aplicada'),
    ('Outro', 'outro', 'Demandas que não se encaixam nas categorias acima')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Empresas — campos do formulário de captação (Épico 5.3)
-- ---------------------------------------------------------------------------
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS responsavel_nome VARCHAR(150);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS segmento VARCHAR(100);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS aceita_contato BOOLEAN NOT NULL DEFAULT TRUE;

-- ---------------------------------------------------------------------------
-- Projetos — qualificação, briefing e novos status (Épicos 8.2 / 8.3)
-- ---------------------------------------------------------------------------
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS tipo_problema VARCHAR(150);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS urgencia VARCHAR(20);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS complexidade VARCHAR(20);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS prioridade VARCHAR(20);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS observacoes_internas TEXT;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS briefing_contexto TEXT;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS briefing_objetivo TEXT;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS briefing_escopo TEXT;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS briefing_requisitos TEXT;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS briefing_resultado TEXT;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMPTZ DEFAULT NOW();

-- Converte status de ENUM legado para VARCHAR (se ainda for enum)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projetos'
          AND column_name = 'status'
          AND udt_name = 'statusprojeto'
    ) THEN
        ALTER TABLE projetos ALTER COLUMN status TYPE VARCHAR(30) USING status::text;
        DROP TYPE IF EXISTS statusprojeto;
    END IF;
END $$;

-- Garante coluna status como texto
ALTER TABLE projetos ALTER COLUMN status TYPE VARCHAR(30);
ALTER TABLE projetos ALTER COLUMN status SET DEFAULT 'novo';

UPDATE projetos SET status = CASE status
    WHEN 'aberto' THEN 'novo'
    WHEN 'em_andamento' THEN 'em_analise'
    WHEN 'concluido' THEN 'estruturado'
    ELSE COALESCE(status, 'novo')
END;

-- ---------------------------------------------------------------------------
-- Usuários administradores (Épico 6.5 — estrutura inicial)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS recomendado no Supabase (acesso via API FastAPI, não PostgREST público)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_admin ENABLE ROW LEVEL SECURITY;

COMMIT;
