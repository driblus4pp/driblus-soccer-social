-- Fix RLS policies and add missing constraints for security

-- 1. Fix notificacoes table - Remove the overly permissive policy
DROP POLICY IF EXISTS "Sistema pode criar notificações" ON public.notificacoes;

-- Add stricter policies for notifications
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
-- These columns should not be nullable since RLS depends on them
ALTER TABLE public.notificacoes 
ALTER COLUMN usuario_id SET NOT NULL;

ALTER TABLE public.avaliacoes 
ALTER COLUMN cliente_id SET NOT NULL;

ALTER TABLE public.agendamentos 
ALTER COLUMN cliente_id SET NOT NULL;

-- 3. Add constraints to prevent spam and abuse
-- Limit notifications per user per day
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

CREATE TRIGGER limit_notifications_trigger
  BEFORE INSERT ON public.notificacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_notification_limit();

-- 4. Add rate limiting for bookings
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

CREATE TRIGGER limit_bookings_trigger
  BEFORE INSERT ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_limit();