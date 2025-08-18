-- Drop existing structure to start fresh
DROP TABLE IF EXISTS avaliacoes CASCADE;
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS horarios_disponiveis CASCADE;
DROP TABLE IF EXISTS quadras CASCADE;
DROP TABLE IF EXISTS quick_matches CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS agendamento_status CASCADE;
DROP TYPE IF EXISTS notificacao_tipo CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.notify_new_agendamento();
DROP FUNCTION IF EXISTS public.notify_status_change();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Remove from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS notificacoes;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS agendamentos;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS quadras;

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para roles
CREATE TYPE user_role AS ENUM ('admin', 'gestor', 'cliente');
CREATE TYPE agendamento_status AS ENUM ('pendente', 'aprovado', 'rejeitado', 'reagendado');
CREATE TYPE notificacao_tipo AS ENUM ('novo_agendamento', 'agendamento_aprovado', 'reagendamento_sugerido', 'lembrete_avaliacao');

-- Tabela de perfis (complementa auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  role user_role DEFAULT 'cliente',
  cidade TEXT,
  bairro TEXT,
  foto_perfil TEXT,
  -- Campos específicos para clientes
  preferencias_esportivas TEXT[] DEFAULT '{}',
  altura INTEGER, -- em centímetros
  peso DECIMAL(5,2), -- em kg
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela quadras
CREATE TABLE quadras (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  modalidade TEXT NOT NULL, -- futebol, basquete, vôlei, tênis, etc.
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  bairro TEXT NOT NULL,
  imagens TEXT[] DEFAULT '{}',
  servicos TEXT[] DEFAULT '{}',
  gestor_id UUID REFERENCES profiles(id),
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela horários disponíveis
CREATE TABLE horarios_disponiveis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quadra_id UUID REFERENCES quadras(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela agendamentos
CREATE TABLE agendamentos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cliente_id UUID REFERENCES profiles(id),
  quadra_id UUID REFERENCES quadras(id),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  status agendamento_status DEFAULT 'pendente',
  observacoes TEXT,
  observacoes_gestor TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela notificações
CREATE TABLE notificacoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id UUID REFERENCES profiles(id),
  tipo notificacao_tipo NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  agendamento_id UUID REFERENCES agendamentos(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela avaliações
CREATE TABLE avaliacoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cliente_id UUID REFERENCES profiles(id),
  quadra_id UUID REFERENCES quadras(id),
  agendamento_id UUID REFERENCES agendamentos(id) UNIQUE,
  estrelas INTEGER NOT NULL CHECK (estrelas >= 1 AND estrelas <= 5),
  comentario TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_quadras_gestor ON quadras(gestor_id);
CREATE INDEX idx_quadras_cidade_bairro ON quadras(cidade, bairro);
CREATE INDEX idx_quadras_modalidade ON quadras(modalidade);
CREATE INDEX idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_quadra ON agendamentos(quadra_id);
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id, lida);
CREATE INDEX idx_avaliacoes_quadra ON avaliacoes(quadra_id);
CREATE INDEX idx_avaliacoes_cliente ON avaliacoes(cliente_id);

-- Ativar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_disponiveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para obter role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver próprio perfil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins podem ver todos os perfis" ON profiles FOR ALL USING (
  get_current_user_role() = 'admin'
);
CREATE POLICY "Perfis públicos são visíveis" ON profiles FOR SELECT USING (true);

-- Políticas para quadras
CREATE POLICY "Todos podem ver quadras ativas" ON quadras FOR SELECT USING (ativa = true);
CREATE POLICY "Gestores podem gerenciar suas quadras" ON quadras FOR ALL USING (
  gestor_id = auth.uid() OR get_current_user_role() = 'admin'
);

-- Políticas para horários
CREATE POLICY "Todos podem ver horários de quadras ativas" ON horarios_disponiveis FOR SELECT USING (
  EXISTS (SELECT 1 FROM quadras WHERE id = quadra_id AND ativa = true)
);
CREATE POLICY "Gestores podem gerenciar horários de suas quadras" ON horarios_disponiveis FOR ALL USING (
  EXISTS (SELECT 1 FROM quadras WHERE id = quadra_id AND gestor_id = auth.uid()) OR
  get_current_user_role() = 'admin'
);

-- Políticas para agendamentos
CREATE POLICY "Usuários podem ver próprios agendamentos" ON agendamentos FOR SELECT USING (
  cliente_id = auth.uid() OR
  EXISTS (SELECT 1 FROM quadras WHERE id = quadra_id AND gestor_id = auth.uid()) OR
  get_current_user_role() = 'admin'
);
CREATE POLICY "Clientes podem criar agendamentos" ON agendamentos FOR INSERT WITH CHECK (cliente_id = auth.uid());
CREATE POLICY "Gestores podem atualizar agendamentos de suas quadras" ON agendamentos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM quadras WHERE id = quadra_id AND gestor_id = auth.uid()) OR
  get_current_user_role() = 'admin'
);

-- Políticas para notificações
CREATE POLICY "Usuários podem ver próprias notificações" ON notificacoes FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY "Sistema pode criar notificações" ON notificacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem marcar próprias notificações como lidas" ON notificacoes FOR UPDATE USING (usuario_id = auth.uid());

-- Políticas para avaliações
CREATE POLICY "Todos podem ver avaliações" ON avaliacoes FOR SELECT USING (true);
CREATE POLICY "Clientes podem criar avaliações de seus agendamentos" ON avaliacoes FOR INSERT WITH CHECK (
  cliente_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM agendamentos 
    WHERE id = agendamento_id 
    AND cliente_id = auth.uid() 
    AND status = 'aprovado'
    AND data <= CURRENT_DATE - INTERVAL '1 day'
    AND data >= CURRENT_DATE - INTERVAL '7 days'
  )
);
CREATE POLICY "Clientes podem atualizar próprias avaliações" ON avaliacoes FOR UPDATE USING (cliente_id = auth.uid());

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'nome', 'Usuário'), 
    CASE 
      WHEN new.email = 'admin@driblus.com' THEN 'admin'
      ELSE 'cliente'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para criar notificações automaticamente
CREATE OR REPLACE FUNCTION notify_new_agendamento()
RETURNS trigger AS $$
BEGIN
  -- Notificar gestor sobre novo agendamento
  INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id)
  SELECT 
    q.gestor_id,
    'novo_agendamento',
    'Novo Agendamento Recebido',
    'Você recebeu um novo agendamento para ' || q.nome || ' no dia ' || TO_CHAR(NEW.data, 'DD/MM/YYYY') || ' às ' || NEW.hora_inicio,
    NEW.id
  FROM quadras q WHERE q.id = NEW.quadra_id AND q.gestor_id IS NOT NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_agendamento_created
  AFTER INSERT ON agendamentos
  FOR EACH ROW EXECUTE PROCEDURE notify_new_agendamento();

-- Função para notificar mudança de status
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
        WHEN NEW.status = 'rejeitado' THEN 'Agendamento Rejeitado'
        ELSE 'Sugestão de Reagendamento'
      END,
      CASE 
        WHEN NEW.status = 'aprovado' THEN 'Seu agendamento foi aprovado! Compareça no horário marcado.'
        WHEN NEW.status = 'rejeitado' THEN 'Infelizmente seu agendamento foi rejeitado. Tente outro horário.'
        ELSE 'O gestor sugeriu uma nova data. Confira os detalhes: ' || COALESCE(NEW.observacoes_gestor, '')
      END,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_agendamento_status_changed
  AFTER UPDATE ON agendamentos
  FOR EACH ROW EXECUTE PROCEDURE notify_status_change();

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quadras_updated_at
  BEFORE UPDATE ON quadras  
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ativar real-time nas tabelas necessárias
ALTER PUBLICATION supabase_realtime ADD TABLE notificacoes;
ALTER PUBLICATION supabase_realtime ADD TABLE agendamentos;
ALTER PUBLICATION supabase_realtime ADD TABLE quadras;