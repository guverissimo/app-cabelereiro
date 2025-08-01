# 🔍 Debug da Agenda - Guia de Verificação

## Problema Identificado
Os dados não aparecem na agenda. Vamos verificar passo a passo.

## 📋 Passos para Verificar

### 1. Verificar Dados no Supabase
Execute no SQL Editor do Supabase:

```sql
-- Verificar se existem colaboradores
SELECT * FROM collaborators;

-- Verificar se existem serviços
SELECT * FROM services;

-- Verificar agendamentos existentes
SELECT 
  a.*,
  s.name as service_name,
  c.name as collaborator_name
FROM appointments a
LEFT JOIN services s ON a.service_id = s.id
LEFT JOIN collaborators c ON a.collaborator_id = c.id
ORDER BY a.datetime;
```

### 2. Inserir Dados de Teste
Se não houver agendamentos, execute:

```sql
-- Inserir agendamentos de teste para hoje
INSERT INTO appointments (client_name, service_id, price, collaborator_id, datetime, duration_minutes, status) 
SELECT 
  'Cliente Teste 1',
  s.id,
  s.price,
  c.id,
  NOW() + INTERVAL '2 hours',
  s.duration_minutes,
  'agendado'
FROM services s, collaborators c 
WHERE s.name = 'Corte Feminino' AND c.name = 'Bruna Souza'
LIMIT 1;
```

### 3. Verificar no Console do Navegador
1. Abra o sistema no navegador
2. Vá para a página "Agenda"
3. Abra o Console do navegador (F12)
4. Selecione um colaborador e uma data
5. Verifique os logs no console:
   - "Buscando agendamentos para:"
   - "Agendamentos encontrados:"
   - "Slots carregados:"

### 4. Possíveis Problemas

#### A. Dados não existem
- Verifique se há colaboradores cadastrados
- Verifique se há serviços cadastrados
- Verifique se há agendamentos com status 'agendado'

#### B. Problema de data
- Os agendamentos podem estar em datas diferentes
- Verifique se está selecionando a data correta na agenda

#### C. Problema de colaborador
- Verifique se está selecionando o colaborador correto
- Verifique se o colaborador tem agendamentos

#### D. Problema de status
- Verifique se os agendamentos têm status 'agendado'
- Agendamentos com status 'concluído' ou 'cancelado' não aparecem

## 🔧 Correções Implementadas

1. **Logs de Debug**: Adicionados logs para verificar se os dados estão sendo carregados
2. **Tipos Corrigidos**: Corrigido o tipo TimeSlot para incluir relacionamentos
3. **Verificação de Erros**: Adicionada verificação de erros na query

## 📝 Como Testar

1. Execute o script SQL acima no Supabase
2. Acesse a agenda no sistema
3. Selecione um colaborador que tenha agendamentos
4. Selecione a data de hoje
5. Verifique os logs no console do navegador
6. Os agendamentos devem aparecer na agenda

## 🚨 Se ainda não funcionar

1. Verifique se as variáveis de ambiente estão corretas
2. Verifique se o Supabase está acessível
3. Verifique se há erros no console do navegador
4. Verifique se os dados foram inseridos corretamente no banco

## 📞 Próximos Passos

Se o problema persistir, forneça:
1. Screenshot dos logs do console
2. Resultado das queries SQL acima
3. Screenshot da página da agenda 