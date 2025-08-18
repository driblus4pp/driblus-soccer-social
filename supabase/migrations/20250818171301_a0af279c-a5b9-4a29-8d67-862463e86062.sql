-- Corrigir função de signup para evitar erros
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Função corrigida com tratamento de erro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'),
    CASE 
      WHEN NEW.email = 'admin@driblus.com' THEN 'admin'::user_role
      ELSE 'cliente'::user_role
    END,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro mas não quebra o signup
  RAISE LOG 'Erro ao criar profile: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();