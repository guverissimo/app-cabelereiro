-- =====================================================
-- CONFIGURAÇÃO DO BANCO DE DADOS - SISTEMA SALÃO DE BELEZA
-- =====================================================

-- Tabela de colaboradores
CREATE TABLE collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendas (horários de trabalho dos colaboradores)
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collaborator_id UUID REFERENCES collaborators(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Domingo, 1 = Segunda, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos (atualizada)
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  service_id UUID REFERENCES services(id),
  price DECIMAL(10,2) NOT NULL,
  collaborator_id UUID REFERENCES collaborators(id),
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT CHECK (status IN ('agendado', 'concluído', 'cancelado')) DEFAULT 'agendado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de estoque
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fluxo de caixa
CREATE TABLE cashflow (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('entrada', 'saída')) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT NOT NULL,
  appointment_id UUID REFERENCES appointments(id)
);

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir colaboradores de exemplo
INSERT INTO collaborators (name, role, email) VALUES
  ('Bruna Souza', 'Cabeleireira', 'bruna@salon.com'),
  ('Carlos Lima', 'Manicure', 'carlos@salon.com'),
  ('Juliana Freitas', 'Esteticista', 'juliana@salon.com');

-- Inserir produtos de exemplo
INSERT INTO inventory (product_name, quantity, unit_price) VALUES
  ('Shampoo Profissional', 50, 25.90),
  ('Condicionador', 45, 28.50),
  ('Máscara Capilar', 30, 35.00),
  ('Tintura', 20, 45.00),
  ('Alisante', 15, 120.00),
  ('Escova de Cabelo', 25, 15.00),
  ('Secador Profissional', 8, 180.00),
  ('Chapinha', 12, 95.00);

-- Inserir serviços de exemplo
INSERT INTO services (name, duration_minutes, price, description) VALUES
  ('Corte Feminino', 30, 45.00, 'Corte feminino com lavagem e finalização'),
  ('Corte Masculino', 25, 30.00, 'Corte masculino com acabamento'),
  ('Barba', 20, 25.00, 'Barba com toalha quente e finalização'),
  ('Sobrancelha', 15, 20.00, 'Design de sobrancelha com pinça'),
  ('Manicure', 45, 35.00, 'Manicure completa com esmalte'),
  ('Pedicure', 45, 35.00, 'Pedicure completa com esmalte'),
  ('Limpeza de Pele', 60, 80.00, 'Limpeza de pele profunda'),
  ('Hidratação', 45, 60.00, 'Hidratação capilar profunda'),
  ('Coloração', 90, 120.00, 'Coloração completa'),
  ('Escova', 30, 40.00, 'Escova progressiva ou definitiva');

-- Inserir horários de trabalho dos colaboradores
INSERT INTO schedules (collaborator_id, day_of_week, start_time, end_time) VALUES
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 1, '08:00', '18:00'), -- Segunda
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 2, '08:00', '18:00'), -- Terça
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 3, '08:00', '18:00'), -- Quarta
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 4, '08:00', '18:00'), -- Quinta
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 5, '08:00', '18:00'), -- Sexta
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 6, '08:00', '16:00'), -- Sábado
  
  ((SELECT id FROM collaborators WHERE name = 'Carlos Lima'), 1, '09:00', '17:00'), -- Segunda
  ((SELECT id FROM collaborators WHERE name = 'Carlos Lima'), 2, '09:00', '17:00'), -- Terça
  ((SELECT id FROM collaborators WHERE name = 'Carlos Lima'), 3, '09:00', '17:00'), -- Quarta
  ((SELECT id FROM collaborators WHERE name = 'Carlos Lima'), 4, '09:00', '17:00'), -- Quinta
  ((SELECT id FROM collaborators WHERE name = 'Carlos Lima'), 5, '09:00', '17:00'), -- Sexta
  
  ((SELECT id FROM collaborators WHERE name = 'Juliana Freitas'), 1, '10:00', '18:00'), -- Segunda
  ((SELECT id FROM collaborators WHERE name = 'Juliana Freitas'), 2, '10:00', '18:00'), -- Terça
  ((SELECT id FROM collaborators WHERE name = 'Juliana Freitas'), 3, '10:00', '18:00'), -- Quarta
  ((SELECT id FROM collaborators WHERE name = 'Juliana Freitas'), 4, '10:00', '18:00'), -- Quinta
  ((SELECT id FROM collaborators WHERE name = 'Juliana Freitas'), 5, '10:00', '18:00'); -- Sexta

-- Inserir agendamentos de exemplo (atualizados)
INSERT INTO appointments (client_name, service_id, price, collaborator_id, datetime, duration_minutes, status) VALUES
  ('Maria Silva', (SELECT id FROM services WHERE name = 'Corte Feminino'), 45.00, (SELECT id FROM collaborators WHERE name = 'Bruna Souza'), NOW() + INTERVAL '1 day', 30, 'agendado'),
  ('João Santos', (SELECT id FROM services WHERE name = 'Barba'), 25.00, (SELECT id FROM collaborators WHERE name = 'Carlos Lima'), NOW() + INTERVAL '2 days', 20, 'agendado'),
  ('Ana Costa', (SELECT id FROM services WHERE name = 'Manicure'), 35.00, (SELECT id FROM collaborators WHERE name = 'Carlos Lima'), NOW() - INTERVAL '1 day', 45, 'concluído'),
  ('Pedro Oliveira', (SELECT id FROM services WHERE name = 'Corte Masculino'), 30.00, (SELECT id FROM collaborators WHERE name = 'Bruna Souza'), NOW() - INTERVAL '2 days', 25, 'concluído'),
  ('Carla Mendes', (SELECT id FROM services WHERE name = 'Limpeza de Pele'), 80.00, (SELECT id FROM collaborators WHERE name = 'Juliana Freitas'), NOW() + INTERVAL '3 days', 60, 'agendado'),
  ('Roberto Alves', (SELECT id FROM services WHERE name = 'Hidratação'), 60.00, (SELECT id FROM collaborators WHERE name = 'Bruna Souza'), NOW() - INTERVAL '3 days', 45, 'concluído');

-- Inserir transações de exemplo
INSERT INTO cashflow (type, description, amount, date, category) VALUES
  ('entrada', 'Pagamento - Corte Feminino', 45.00, NOW() - INTERVAL '1 day', 'Serviços'),
  ('entrada', 'Pagamento - Manicure', 35.00, NOW() - INTERVAL '1 day', 'Serviços'),
  ('entrada', 'Pagamento - Corte Masculino', 30.00, NOW() - INTERVAL '2 days', 'Serviços'),
  ('entrada', 'Pagamento - Hidratação', 60.00, NOW() - INTERVAL '3 days', 'Serviços'),
  ('saída', 'Compra de produtos', 500.00, NOW() - INTERVAL '3 days', 'Fornecedores'),
  ('saída', 'Conta de luz', 150.00, NOW() - INTERVAL '5 days', 'Despesas'),
  ('saída', 'Aluguel', 800.00, NOW() - INTERVAL '7 days', 'Despesas'),
  ('entrada', 'Pagamento adiantado', 100.00, NOW() - INTERVAL '10 days', 'Adiantamentos');

-- =====================================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- =====================================================

-- Índices para agendamentos
CREATE INDEX idx_appointments_datetime ON appointments(datetime);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_collaborator ON appointments(collaborator_id);

-- Índices para estoque
CREATE INDEX idx_inventory_product_name ON inventory(product_name);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);

-- Índices para fluxo de caixa
CREATE INDEX idx_cashflow_date ON cashflow(date);
CREATE INDEX idx_cashflow_type ON cashflow(type);
CREATE INDEX idx_cashflow_category ON cashflow(category);

-- Índices para colaboradores
CREATE INDEX idx_collaborators_name ON collaborators(name);
CREATE INDEX idx_collaborators_role ON collaborators(role);

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashflow ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas as operações (para desenvolvimento)
-- Em produção, você deve configurar políticas mais restritivas

CREATE POLICY "Permitir todas as operações em collaborators" ON collaborators
  FOR ALL USING (true);

CREATE POLICY "Permitir todas as operações em appointments" ON appointments
  FOR ALL USING (true);

CREATE POLICY "Permitir todas as operações em inventory" ON inventory
  FOR ALL USING (true);

CREATE POLICY "Permitir todas as operações em cashflow" ON cashflow
  FOR ALL USING (true);

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para calcular valor total em estoque
CREATE OR REPLACE FUNCTION get_total_inventory_value()
RETURNS DECIMAL AS $$
BEGIN
  RETURN COALESCE(SUM(quantity * unit_price), 0)
  FROM inventory;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas de agendamentos
CREATE OR REPLACE FUNCTION get_appointment_stats()
RETURNS TABLE(
  total_appointments BIGINT,
  completed_appointments BIGINT,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE status = 'concluído') as completed_appointments,
    COALESCE(SUM(price) FILTER (WHERE status = 'concluído'), 0) as total_revenue
  FROM appointments;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

/*
Este script configura completamente o banco de dados para o sistema de salão de beleza.

Para usar:
1. Execute este script no Editor SQL do Supabase
2. Configure as variáveis de ambiente no seu projeto Next.js
3. Execute o projeto com 'npm run dev'

Os dados de exemplo permitem testar todas as funcionalidades do sistema imediatamente.
*/ 