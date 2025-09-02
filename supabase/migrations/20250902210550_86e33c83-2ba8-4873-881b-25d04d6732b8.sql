-- Fix function search path security issues

-- Update check_notification_limit function with proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update check_booking_limit function with proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;