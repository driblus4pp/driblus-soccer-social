-- Corrigir funções com search_path para melhor segurança
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE
SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'nome', 'Usuário'), 'cliente');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE OR REPLACE FUNCTION notify_new_agendamento()
RETURNS trigger AS $$
BEGIN
  -- Notificar gestor sobre novo agendamento
  INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id)
  SELECT 
    q.gestor_id,
    'novo_agendamento',
    'Novo Agendamento',
    'Você recebeu um novo agendamento para ' || q.nome || ' no dia ' || NEW.data,
    NEW.id
  FROM quadras q WHERE q.id = NEW.quadra_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id)
    VALUES (
      NEW.cliente_id,
      CASE 
        WHEN NEW.status = 'aprovado' THEN 'agendamento_aprovado'
        ELSE 'reagendamento_sugerido'
      END,
      CASE 
        WHEN NEW.status = 'aprovado' THEN 'Agendamento Aprovado!'
        ELSE 'Sugestão de Reagendamento'
      END,
      CASE 
        WHEN NEW.status = 'aprovado' THEN 'Seu agendamento foi aprovado.'
        ELSE 'O gestor sugeriu uma nova data. Confira os detalhes.'
      END,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;