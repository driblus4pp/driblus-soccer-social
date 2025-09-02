-- Fix critical security issue: Restrict notification creation to prevent spam
-- Only authenticated users should be able to create notifications for themselves
-- System/admin users should be able to create notifications for others

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Sistema pode criar notificações" ON notificacoes;

-- Create new secure policies for notification creation
CREATE POLICY "Users can create notifications for themselves" 
ON notificacoes 
FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Admins can create notifications for any user" 
ON notificacoes 
FOR INSERT 
WITH CHECK (get_current_user_role() = 'admin');

-- Create policy for system triggers to create notifications
-- This allows database triggers to create notifications
CREATE POLICY "System can create notifications via triggers" 
ON notificacoes 
FOR INSERT 
WITH CHECK (
  -- Allow if the current user has admin role or if called from a trigger
  get_current_user_role() = 'admin' OR 
  current_setting('role', true) = 'postgres'
);