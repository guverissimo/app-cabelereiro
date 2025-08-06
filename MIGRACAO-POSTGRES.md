# Migração para PostgreSQL - Sistema de Salão de Beleza

## Resumo das Mudanças

A aplicação foi completamente migrada do Supabase para PostgreSQL usando Prisma como ORM. Todas as operações de banco de dados agora são feitas através de APIs REST criadas no diretório `/api`.

## Mudanças Principais

### 1. Endpoints API Criados

#### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `PUT /api/clients/[id]` - Atualizar cliente
- `DELETE /api/clients/[id]` - Deletar cliente

#### Colaboradores
- `GET /api/collaborators` - Listar colaboradores
- `POST /api/collaborators` - Criar colaborador
- `PUT /api/collaborators/[id]` - Atualizar colaborador
- `DELETE /api/collaborators/[id]` - Deletar colaborador

#### Serviços
- `GET /api/services` - Listar serviços
- `POST /api/services` - Criar serviço
- `PUT /api/services/[id]` - Atualizar serviço
- `DELETE /api/services/[id]` - Deletar serviço

#### Inventário
- `GET /api/inventory` - Listar produtos
- `POST /api/inventory` - Criar produto
- `PUT /api/inventory/[id]` - Atualizar produto
- `DELETE /api/inventory/[id]` - Deletar produto

#### Fluxo de Caixa
- `GET /api/cashflow` - Listar transações (com filtros)
- `POST /api/cashflow` - Criar transação
- `PUT /api/cashflow/[id]` - Atualizar transação
- `DELETE /api/cashflow/[id]` - Deletar transação

#### Agendamentos
- `GET /api/appointments` - Listar agendamentos (com filtros)
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/[id]` - Atualizar agendamento
- `DELETE /api/appointments/[id]` - Deletar agendamento

#### Agenda
- `GET /api/schedule` - Listar horários (com filtros)
- `POST /api/schedule` - Criar horário

### 2. Funções de API Criadas

#### `/lib/api/clients.ts`
- `getClients()` - Buscar todos os clientes
- `createClient(data)` - Criar novo cliente
- `updateClient(id, data)` - Atualizar cliente
- `deleteClient(id)` - Deletar cliente

#### `/lib/api/collaborators.ts`
- `getCollaborators()` - Buscar todos os colaboradores
- `createCollaborator(data)` - Criar novo colaborador
- `updateCollaborator(id, data)` - Atualizar colaborador
- `deleteCollaborator(id)` - Deletar colaborador

#### `/lib/api/services.ts`
- `getServices()` - Buscar todos os serviços
- `createService(data)` - Criar novo serviço
- `updateService(id, data)` - Atualizar serviço
- `deleteService(id)` - Deletar serviço

#### `/lib/api/inventory.ts`
- `getInventory()` - Buscar todos os produtos
- `createInventory(data)` - Criar novo produto
- `updateInventory(id, data)` - Atualizar produto
- `deleteInventory(id)` - Deletar produto

#### `/lib/api/cashflow.ts`
- `getCashflow(filters?)` - Buscar transações com filtros opcionais
- `createCashflow(data)` - Criar nova transação
- `updateCashflow(id, data)` - Atualizar transação
- `deleteCashflow(id)` - Deletar transação

#### `/lib/api/appointments.ts`
- `getAppointments(filters?)` - Buscar agendamentos com filtros opcionais
- `createAppointment(data)` - Criar novo agendamento
- `updateAppointment(id, data)` - Atualizar agendamento
- `deleteAppointment(id)` - Deletar agendamento

#### `/lib/api/schedule.ts`
- `getSchedule(filters?)` - Buscar horários com filtros opcionais
- `createSchedule(data)` - Criar novo horário

### 3. Páginas Atualizadas

Todas as páginas foram atualizadas para usar as novas APIs:

- **Dashboard** (`/app/page.tsx`) - Usa APIs para buscar estatísticas
- **Agendamentos** (`/app/appointments/page.tsx`) - Usa APIs de agendamentos
- **Serviços** (`/app/services/page.tsx`) - Usa APIs de serviços
- **Inventário** (`/app/inventory/page.tsx`) - Usa APIs de inventário
- **Fluxo de Caixa** (`/app/cashflow/page.tsx`) - Usa APIs de fluxo de caixa
- **Colaboradores** (`/app/collaborators/page.tsx`) - Usa APIs de colaboradores
- **Agenda** (`/app/schedule/page.tsx`) - Usa APIs de agenda

### 4. Schema do Prisma Atualizado

O schema do Prisma foi atualizado com:
- Tipos corretos para datas (`DateTime`)
- Campos opcionais onde apropriado
- Relacionamentos entre tabelas
- Enums para status e tipos

### 5. Arquivos Removidos

- `src/lib/supabase.ts` - Removido completamente
- Todas as referências ao Supabase nas páginas

## Como Usar

### 1. Configuração do Banco de Dados

Certifique-se de que o PostgreSQL está configurado e acessível através da variável de ambiente `DATABASE_URL`.

### 2. Executar Migrações

```bash
npx prisma migrate dev
```

### 3. Gerar Cliente Prisma

```bash
npx prisma generate
```

### 4. Executar a Aplicação

```bash
npm run dev
```

## Benefícios da Migração

1. **Controle Total**: Acesso direto ao banco PostgreSQL
2. **Performance**: Queries otimizadas com Prisma
3. **Type Safety**: Tipagem completa com TypeScript
4. **Flexibilidade**: APIs REST customizadas
5. **Escalabilidade**: Arquitetura mais robusta
6. **Manutenibilidade**: Código mais organizado e modular

## Estrutura de Dados

### Tabelas Principais

- **User** - Usuários do sistema
- **Collaborator** - Colaboradores do salão
- **Service** - Serviços oferecidos
- **Schedule** - Horários de trabalho
- **Appointment** - Agendamentos
- **Inventory** - Produtos em estoque
- **Cashflow** - Transações financeiras
- **Client** - Clientes

### Relacionamentos

- `Appointment` → `Service` (service_id)
- `Appointment` → `Collaborator` (collaborator_id)
- `Schedule` → `Collaborator` (collaborator_id)
- `Cashflow` → `Appointment` (appointment_id) - opcional

## Próximos Passos

1. Implementar autenticação e autorização
2. Adicionar validações mais robustas
3. Implementar cache para melhorar performance
4. Adicionar testes automatizados
5. Implementar logs de auditoria
6. Adicionar backup automático do banco 