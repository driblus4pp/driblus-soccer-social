-- Fix RLS policies and add missing constraints for security (corrected)

-- 1. First drop all existing policies for notifications to avoid conflicts
DROP POLICY IF EXISTS "Users can create notifications for themselves" ON public.notificacoes;
DROP POLICY IF EXISTS "Admins can create notifications for any user" ON public.notificacoes;
DROP POLICY IF EXISTS "System can create notifications via triggers" ON public.notificacoes;
DROP POLICY IF EXISTS "Sistema pode criar notificações via triggers" ON public.notificacoes;

-- Create secure notification policies
CREATE POLICY "Users can create notifications for themselves" 
ON public.notificacoes 
FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Admins can create notifications for any user" 
ON public.notificacoes 
FOR INSERT 
WITH CHECK (get_current_user_role() = 'admin');

-- Add DELETE policies for all tables that were missing them
CREATE POLICY "Users can delete their own notifications" 
ON public.notificacoes 
FOR DELETE 
USING (usuario_id = auth.uid());

CREATE POLICY "Admins can delete any notification" 
ON public.notificacoes 
FOR DELETE 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Clients can delete their own evaluations" 
ON public.avaliacoes 
FOR DELETE 
USING (cliente_id = auth.uid());

CREATE POLICY "Admins can delete any evaluation" 
ON public.avaliacoes 
FOR DELETE 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Clients can delete their own bookings" 
ON public.agendamentos 
FOR DELETE 
USING (cliente_id = auth.uid());

CREATE POLICY "Court managers can delete bookings for their courts" 
ON public.agendamentos 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM quadras 
  WHERE quadras.id = agendamentos.quadra_id 
  AND quadras.gestor_id = auth.uid()
));

-- 2. Fix nullable user_id columns that should be NOT NULL for security
-- Add default values to prevent constraint violations
UPDATE public.notificacoes SET usuario_id = '00000000-0000-0000-0000-000000000000' WHERE usuario_id IS NULL;
UPDATE public.avaliacoes SET cliente_id = '00000000-0000-0000-0000-000000000000' WHERE cliente_id IS NULL;  
UPDATE public.agendamentos SET cliente_id = '00000000-0000-0000-0000-000000000000' WHERE cliente_id IS NULL;

-- Now make them NOT NULL
ALTER TABLE public.notificacoes 
ALTER COLUMN usuario_id SET NOT NULL;

ALTER TABLE public.avaliacoes 
ALTER COLUMN cliente_id SET NOT NULL;

ALTER TABLE public.agendamentos 
ALTER COLUMN cliente_id SET NOT NULL;

-- 3. Add rate limiting functions
CREATE OR REPLACE FUNCTION public.check_notification_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already has more than 50 notifications in the last 24 hours
  IF (
    SELECT COUNT(*) 
    FROM public.notificacoes 
    WHERE usuario_id = NEW.usuario_id 
    AND created_at > (NOW() - INTERVAL '24 hours')
  ) >= 50 THEN
    RAISE EXCEPTION 'Too many notifications created in 24 hours';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS limit_notifications_trigger ON public.notificacoes;
CREATE TRIGGER limit_notifications_trigger
  BEFORE INSERT ON public.notificacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_notification_limit();

CREATE OR REPLACE FUNCTION public.check_booking_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already has more than 10 bookings in the last hour
  IF (
    SELECT COUNT(*) 
    FROM public.agendamentos 
    WHERE cliente_id = NEW.cliente_id 
    AND created_at > (NOW() - INTERVAL '1 hour')
  ) >= 10 THEN
    RAISE EXCEPTION 'Too many booking attempts in 1 hour';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS limit_bookings_trigger ON public.agendamentos;
CREATE TRIGGER limit_bookings_trigger
  BEFORE INSERT ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_limit();