-- Create profile for existing user to fix login issue
INSERT INTO public.profiles (id, nome, role, telefone, cidade, bairro)
VALUES (
  'edbfab21-d9a8-4fdb-aa74-69dedb58ce0e',
  'janderson almeida',
  'cliente',
  '85986471833',
  NULL,
  NULL
) ON CONFLICT (id) DO NOTHING;