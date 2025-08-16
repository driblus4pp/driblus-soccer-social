-- Fix security issues: add search_path to functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.clean_old_quick_matches()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.quick_matches 
  WHERE created_at < (now() - interval '2 months');
END;
$$;

CREATE OR REPLACE FUNCTION public.limit_quick_matches_per_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Delete oldest matches if user already has 3 or more
  DELETE FROM public.quick_matches 
  WHERE user_id = NEW.user_id 
  AND id NOT IN (
    SELECT id FROM public.quick_matches 
    WHERE user_id = NEW.user_id 
    ORDER BY created_at DESC 
    LIMIT 2
  );
  
  RETURN NEW;
END;
$$;