-- Papel padrão: usuario (cadastro público). Admins promovidos manualmente ou via seed.
ALTER TABLE usuarios_admin ALTER COLUMN papel SET DEFAULT 'usuario';

COMMENT ON COLUMN usuarios_admin.papel IS 'usuario | analista | coordenador | super_admin';
