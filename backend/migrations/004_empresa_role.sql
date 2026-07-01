-- Papel empresa + vínculo opcional com cadastro de empresas
ALTER TABLE usuarios_admin ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE SET NULL;

COMMENT ON COLUMN usuarios_admin.papel IS 'usuario | empresa | analista | coordenador | super_admin';
COMMENT ON COLUMN usuarios_admin.empresa_id IS 'Empresa vinculada quando papel = empresa';
