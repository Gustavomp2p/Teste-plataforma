-- Renomeia status aprovado_turma -> aprovado_squad
UPDATE projetos
SET status = 'aprovado_squad'
WHERE status = 'aprovado_turma';
