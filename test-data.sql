-- Script para inserir dados de teste para a agenda

-- Primeiro, vamos verificar se existem colaboradores
SELECT * FROM collaborators;

-- Vamos verificar se existem serviços
SELECT * FROM services;

-- Vamos verificar se existem agendamentos
SELECT 
  a.*,
  s.name as service_name,
  c.name as collaborator_name
FROM appointments a
LEFT JOIN services s ON a.service_id = s.id
LEFT JOIN collaborators c ON a.collaborator_id = c.id
ORDER BY a.datetime;

-- Inserir agendamentos de teste para hoje
INSERT INTO appointments (client_name, service_id, price, collaborator_id, datetime, duration_minutes, status) 
SELECT 
  'Cliente Teste 1',
  s.id,
  s.price,
  c.id,
  NOW() + INTERVAL '2 hours', -- 2 horas a partir de agora
  s.duration_minutes,
  'agendado'
FROM services s, collaborators c 
WHERE s.name = 'Corte Feminino' AND c.name = 'Bruna Souza'
LIMIT 1;

INSERT INTO appointments (client_name, service_id, price, collaborator_id, datetime, duration_minutes, status) 
SELECT 
  'Cliente Teste 2',
  s.id,
  s.price,
  c.id,
  NOW() + INTERVAL '4 hours', -- 4 horas a partir de agora
  s.duration_minutes,
  'agendado'
FROM services s, collaborators c 
WHERE s.name = 'Barba' AND c.name = 'Carlos Lima'
LIMIT 1;

-- Verificar os agendamentos inseridos
SELECT 
  a.*,
  s.name as service_name,
  c.name as collaborator_name
FROM appointments a
LEFT JOIN services s ON a.service_id = s.id
LEFT JOIN collaborators c ON a.collaborator_id = c.id
WHERE a.datetime >= NOW()
ORDER BY a.datetime; 