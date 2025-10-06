import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateManagerRequest {
  email: string;
  password: string;
  nome: string;
  telefone?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, password, nome, telefone }: CreateManagerRequest = await req.json();

    // Criar usuário no auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nome,
        telefone
      }
    });

    if (authError) {
      throw authError;
    }

    const userId = authData.user.id;

    // Criar perfil
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        nome,
        telefone,
        role: 'gestor'
      });

    if (profileError) {
      throw profileError;
    }

    // Adicionar role em user_roles
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'gestor'
      });

    if (roleError) {
      throw roleError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: 'Gestor criado com sucesso' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error creating manager:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao criar gestor' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
