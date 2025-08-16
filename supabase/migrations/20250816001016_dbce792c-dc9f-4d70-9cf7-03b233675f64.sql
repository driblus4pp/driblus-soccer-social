-- Alterar tabela quick_matches para aceitar IDs mock
-- Primeiro, remover as políticas RLS existentes
DROP POLICY IF EXISTS "Users can view their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can create their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can update their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can delete their own quick matches" ON public.quick_matches;

-- Alterar o tipo da coluna user_id de UUID para TEXT
ALTER TABLE public.quick_matches ALTER COLUMN user_id TYPE TEXT;

-- Criar novas políticas RLS para IDs mock
CREATE POLICY "Users can view their own quick matches" 
ON public.quick_matches 
FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'user-1');

CREATE POLICY "Users can create their own quick matches" 
ON public.quick_matches 
FOR INSERT 
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'user-1');

CREATE POLICY "Users can update their own quick matches" 
ON public.quick_matches 
FOR UPDATE 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'user-1');

CREATE POLICY "Users can delete their own quick matches" 
ON public.quick_matches 
FOR DELETE 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'user-1');