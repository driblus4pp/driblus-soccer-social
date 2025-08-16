-- Desabilitar RLS temporariamente
ALTER TABLE public.quick_matches DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas RLS
DROP POLICY IF EXISTS "Users can view their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can create their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can update their own quick matches" ON public.quick_matches;
DROP POLICY IF EXISTS "Users can delete their own quick matches" ON public.quick_matches;

-- Remover a foreign key constraint
ALTER TABLE public.quick_matches DROP CONSTRAINT IF EXISTS quick_matches_user_id_fkey;

-- Alterar o tipo da coluna user_id de UUID para TEXT
ALTER TABLE public.quick_matches ALTER COLUMN user_id TYPE TEXT;

-- Reabilitar RLS
ALTER TABLE public.quick_matches ENABLE ROW LEVEL SECURITY;

-- Criar novas políticas RLS simples para desenvolvimento
CREATE POLICY "Allow all operations for development" 
ON public.quick_matches 
FOR ALL 
USING (true) 
WITH CHECK (true);