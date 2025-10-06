-- Fase 1: Sistema de Roles Seguro (usando enum existente user_role)

-- Criar tabela user_roles separada
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar função has_role com SECURITY DEFINER para evitar recursão RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Migrar dados existentes de profiles.role para user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Atualizar políticas RLS para usar has_role()

-- Quadras
DROP POLICY IF EXISTS "Gestores podem gerenciar suas quadras" ON public.quadras;
CREATE POLICY "Gestores podem gerenciar suas quadras"
ON public.quadras
FOR ALL
TO authenticated
USING (
  gestor_id = auth.uid() OR 
  public.has_role(auth.uid(), 'admin'::user_role)
);

-- Agendamentos
DROP POLICY IF EXISTS "Gestores podem atualizar agendamentos de suas quadras" ON public.agendamentos;
CREATE POLICY "Gestores podem atualizar agendamentos de suas quadras"
ON public.agendamentos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quadras 
    WHERE quadras.id = agendamentos.quadra_id 
    AND quadras.gestor_id = auth.uid()
  ) OR 
  public.has_role(auth.uid(), 'admin'::user_role)
);

DROP POLICY IF EXISTS "Usuários podem ver próprios agendamentos" ON public.agendamentos;
CREATE POLICY "Usuários podem ver próprios agendamentos"
ON public.agendamentos
FOR SELECT
TO authenticated
USING (
  cliente_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM quadras 
    WHERE quadras.id = agendamentos.quadra_id 
    AND quadras.gestor_id = auth.uid()
  ) OR
  public.has_role(auth.uid(), 'admin'::user_role)
);

-- Horários disponíveis
DROP POLICY IF EXISTS "Gestores podem gerenciar horários de suas quadras" ON public.horarios_disponiveis;
CREATE POLICY "Gestores podem gerenciar horários de suas quadras"
ON public.horarios_disponiveis
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quadras 
    WHERE quadras.id = horarios_disponiveis.quadra_id 
    AND quadras.gestor_id = auth.uid()
  ) OR
  public.has_role(auth.uid(), 'admin'::user_role)
);

-- Profiles - Admin pode ver todos
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
CREATE POLICY "Admins podem ver todos os perfis"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::user_role));

-- Avaliações - Admin pode deletar
DROP POLICY IF EXISTS "Admins can delete any evaluation" ON public.avaliacoes;
CREATE POLICY "Admins can delete any evaluation"
ON public.avaliacoes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::user_role));

-- Notificações - Admin pode criar e deletar
DROP POLICY IF EXISTS "Admins can create notifications for any user" ON public.notificacoes;
CREATE POLICY "Admins can create notifications for any user"
ON public.notificacoes
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::user_role));

DROP POLICY IF EXISTS "Admins can delete any notification" ON public.notificacoes;
CREATE POLICY "Admins can delete any notification"
ON public.notificacoes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::user_role));

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::user_role));

-- Atualizar função get_current_user_role para usar user_roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Atualizar trigger handle_new_user para adicionar role em user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar profile
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
  
  -- Adicionar role em user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.email = 'admin@driblus.com' THEN 'admin'::user_role
      ELSE 'cliente'::user_role
    END
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Erro ao criar profile/role: %', SQLERRM;
  RETURN NEW;
END;
$$;