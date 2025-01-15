-- Adiciona a coluna user_id na tabela stories
ALTER TABLE stories
ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id);

-- Atualiza os registros existentes (se houver) usando o user_id dos children
UPDATE stories
SET user_id = children.user_id
FROM children
WHERE stories.child_id = children.id;

-- Adiciona uma foreign key constraint
ALTER TABLE stories
ADD CONSTRAINT fk_stories_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Remove políticas existentes (se houver)
DROP POLICY IF EXISTS "Usuários podem ver suas próprias histórias" ON stories;
DROP POLICY IF EXISTS "Usuários podem criar histórias" ON stories;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias histórias" ON stories;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias histórias" ON stories;

-- Cria novas políticas de segurança
CREATE POLICY "Usuários podem ver suas próprias histórias"
ON stories FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar histórias"
ON stories FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias histórias"
ON stories FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias histórias"
ON stories FOR DELETE
USING (auth.uid() = user_id);

-- Habilita RLS (Row Level Security) se ainda não estiver habilitado
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
