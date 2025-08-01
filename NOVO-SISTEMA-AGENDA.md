# 🎯 Novo Sistema de Agenda - Guia Completo

## ✅ **O que foi implementado**

### 1. **Tabela de Horários de Trabalho** (`schedules`)
- Define os horários de trabalho de cada colaborador por dia da semana
- Permite configurar horários diferentes para cada dia
- Exemplo: Bruna trabalha Segunda a Sexta das 8h às 18h, Sábado das 8h às 16h

### 2. **Agenda Inteligente**
- Mostra apenas os horários de trabalho dos colaboradores
- Exibe horários livres e ocupados claramente
- **Clique em qualquer horário livre para criar um agendamento**

### 3. **Funcionalidade de Criação Rápida**
- Clique em um horário livre na agenda
- Formulário aparece automaticamente com o horário pré-selecionado
- Preencha cliente, serviço e confirme
- Agendamento é criado instantaneamente

## 🚀 **Como usar**

### **Passo 1: Configurar Horários de Trabalho**
Execute no Supabase SQL Editor:

```sql
-- Verificar horários existentes
SELECT 
  s.*,
  c.name as collaborator_name
FROM schedules s
JOIN collaborators c ON s.collaborator_id = c.id
ORDER BY c.name, s.day_of_week;

-- Inserir horários se necessário
INSERT INTO schedules (collaborator_id, day_of_week, start_time, end_time) VALUES
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 1, '08:00', '18:00'), -- Segunda
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 2, '08:00', '18:00'), -- Terça
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 3, '08:00', '18:00'), -- Quarta
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 4, '08:00', '18:00'), -- Quinta
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 5, '08:00', '18:00'), -- Sexta
  ((SELECT id FROM collaborators WHERE name = 'Bruna Souza'), 6, '08:00', '16:00'); -- Sábado
```

### **Passo 2: Acessar a Agenda**
1. Vá para a página "Agenda" no menu lateral
2. Selecione um colaborador
3. Selecione uma data
4. A agenda mostrará os horários de trabalho do colaborador

### **Passo 3: Criar Agendamento**
1. **Clique em qualquer horário livre** (linha verde)
2. O formulário aparecerá com o horário pré-selecionado
3. Preencha:
   - Nome do cliente
   - Serviço (preço e duração serão preenchidos automaticamente)
4. Clique em "Criar Agendamento"
5. O agendamento será criado e a agenda será atualizada

## 🎨 **Interface Visual**

### **Cores e Status**
- 🟢 **Verde**: Horário livre (clique para agendar)
- 🔴 **Vermelho**: Horário ocupado
- ➕ **Ícone +**: Indica que pode criar agendamento

### **Informações Exibidas**
- Horário (início - fim)
- Status (Livre/Ocupado)
- Cliente (se ocupado)
- Serviço (se ocupado)
- Duração (se ocupado)
- Ação (Criar agendamento para horários livres)

## 🔧 **Vantagens do Novo Sistema**

### **1. Mais Intuitivo**
- Não precisa navegar entre páginas
- Criação de agendamento em um clique
- Visualização clara dos horários disponíveis

### **2. Mais Eficiente**
- Baseado em horários reais de trabalho
- Não mostra horários fora do expediente
- Verificação automática de disponibilidade

### **3. Mais Organizado**
- Tabela específica para horários de trabalho
- Separação clara entre horários livres e ocupados
- Interface responsiva e moderna

## 📋 **Estrutura do Banco**

### **Tabela `schedules`**
```sql
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collaborator_id UUID REFERENCES collaborators(id),
  day_of_week INTEGER NOT NULL, -- 0=Domingo, 1=Segunda, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Relacionamentos**
- `schedules.collaborator_id` → `collaborators.id`
- `appointments.collaborator_id` → `collaborators.id`
- `appointments.service_id` → `services.id`

## 🎯 **Fluxo de Trabalho**

1. **Configurar horários** de trabalho dos colaboradores
2. **Cadastrar serviços** com duração e preço
3. **Acessar agenda** e selecionar colaborador/data
4. **Clicar em horário livre** para criar agendamento
5. **Preencher dados** do cliente e serviço
6. **Confirmar** e agendamento é criado automaticamente

## 🚨 **Troubleshooting**

### **Problema: Agenda vazia**
- Verifique se há horários configurados na tabela `schedules`
- Verifique se o colaborador tem horários para o dia selecionado

### **Problema: Não consegue criar agendamento**
- Verifique se o horário está marcado como "Livre"
- Verifique se há serviços cadastrados
- Verifique se as variáveis de ambiente estão corretas

### **Problema: Horários não aparecem**
- Execute as queries SQL para inserir horários de trabalho
- Verifique se a data selecionada tem horários configurados

## 🎉 **Resultado Final**

O sistema agora oferece:
- ✅ Agenda baseada em horários reais de trabalho
- ✅ Criação de agendamento com um clique
- ✅ Visualização clara de disponibilidade
- ✅ Interface intuitiva e moderna
- ✅ Controle completo de horários e serviços

**Agora é muito mais fácil e rápido agendar clientes!** 🚀 