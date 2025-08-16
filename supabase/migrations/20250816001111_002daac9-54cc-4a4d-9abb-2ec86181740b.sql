-- Primeiro remover a foreign key constraint
ALTER TABLE public.quick_matches DROP CONSTRAINT IF EXISTS quick_matches_user_id_fkey;

-- Alterar o tipo da coluna user_id de UUID para TEXT
ALTER TABLE public.quick_matches ALTER COLUMN user_id TYPE TEXT;

-- Remover as políticas RLS existentes
DROP POLICY IF EXISTS "Users can view their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can create their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can update their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can delete their own quick matches" ON public.quick_matches;

-- Criar novas políticas RLS mais simples para IDs mock
CREATE POLICY "Users can view their own quick matches" 
ON public.quick_matches 
FOR SELECT 
USING (true); -- Permitir acesso para desenvolvimento

CREATE POLICY "Users can create their own quick matches" 
ON public.quick_matches 
FOR INSERT 
WITH CHECK (true); -- Permitir criação para desenvolvimento

CREATE POLICY "Users can update their own quick matches" 
ON public.quick_matches 
FOR UPDATE 
USING (true); -- Permitir atualização para desenvolvimento

CREATE POLICY "Users can delete their own quick matches" 
ON public.quick_matches 
FOR DELETE 
USING (true); -- Permitir deleção para desenvolvimento