-- Fix security warnings by adding search_path to functions
CREATE OR REPLACE FUNCTION notify_new_agendamento()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public AS $$
BEGIN
  INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id)
  SELECT q.gestor_id, 'novo_agendamento', 'Novo Agendamento Recebido', 'Você recebeu um novo agendamento para ' || q.nome || ' no dia ' || TO_CHAR(NEW.data, 'DD/MM/YYYY') || ' às ' || NEW.hora_inicio, NEW.id
  FROM quadras q WHERE q.id = NEW.quadra_id AND q.gestor_id IS NOT NULL;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id)
    VALUES (NEW.cliente_id, CASE WHEN NEW.status = 'aprovado' THEN 'agendamento_aprovado' ELSE 'reagendamento_sugerido' END, CASE WHEN NEW.status = 'aprovado' THEN 'Agendamento Aprovado!' WHEN NEW.status = 'rejeitado' THEN 'Agendamento Rejeitado' ELSE 'Sugestão de Reagendamento' END, CASE WHEN NEW.status = 'aprovado' THEN 'Seu agendamento foi aprovado! Compareça no horário marcado.' WHEN NEW.status = 'rejeitado' THEN 'Infelizmente seu agendamento foi rejeitado. Tente outro horário.' ELSE 'O gestor sugeriu uma nova data. Confira os detalhes: ' || COALESCE(NEW.observacoes_gestor, '') END, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'nome', 'Usuário'), CASE WHEN new.email = 'admin@driblus.com' THEN 'admin' ELSE 'cliente' END);
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;