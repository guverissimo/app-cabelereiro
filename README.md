# Sistema de Salão de Beleza

Sistema completo de agendamento, gestão de estoque e fluxo de caixa para salão de beleza desenvolvido com Next.js, TypeScript, Tailwind CSS e PostgreSQL.

## 🚀 Funcionalidades

### 📅 Agendamentos
- Formulário para novo agendamento com verificação de disponibilidade
- Listagem de agendamentos por data e status
- Filtros por colaborador, status e data
- Atualização de status (agendado, concluído, cancelado)
- Verificação automática de conflitos de horário
- Sugestões de horários alternativos

### 🕐 Agenda
- Visualização da agenda dos colaboradores
- Horários ocupados e livres claramente identificados
- Navegação por data
- Detalhes dos agendamentos (cliente, serviço, duração)

### ✂️ Serviços
- Cadastro de tipos de serviços
- Definição de duração média para cada serviço
- Preços configuráveis
- Descrições detalhadas
- Gestão completa (adicionar, editar, excluir)

### 📦 Estoque
- Lista de produtos com quantidade e preço
- Adição e remoção de produtos
- Atualização de quantidade e valor
- Alertas para estoque baixo
- Cálculo automático do valor total em estoque

### 💸 Fluxo de Caixa
- Listagem de entradas e saídas
- Filtros por data e categoria
- Adicionar nova entrada ou saída
- Resumo de saldo atual

### 👥 Colaboradores
- Gestão completa de colaboradores
- Cadastro com nome, função e email
- Edição e exclusão de registros

### 📊 Dashboard
- Total de clientes atendidos
- Faturamento total
- Gráfico de faturamento por colaborador
- Gráfico de clientes atendidos por colaborador
- Valor total em estoque
- Resumo do fluxo de caixa

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: PostgreSQL com Prisma ORM
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Data**: date-fns

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd cabelereiro
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o PostgreSQL

#### 3.1 Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cabelereiro"
```

#### 3.2 Execute as migrações
```bash
npx prisma migrate dev
```

#### 3.3 Gere o cliente Prisma
```bash
npx prisma generate
```

### 4. Execute a aplicação

```bash
npm run dev
```

O sistema estará disponível em: http://localhost:3000

## 📱 Como usar o sistema

### Dashboard (Página inicial)
- Visualize estatísticas gerais
- Gráficos de faturamento por colaborador
- Resumo do fluxo de caixa

### Agendamentos
- Clique em "Novo Agendamento" para criar
- Use filtros para encontrar agendamentos
- Atualize status: agendado → concluído/cancelado

### Estoque
- Adicione produtos com quantidade e preço
- Monitore produtos com estoque baixo
- Edite ou remova produtos

### Fluxo de Caixa
- Registre entradas e saídas
- Categorize as transações
- Acompanhe o saldo

### Colaboradores
- Cadastre sua equipe
- Gerencie funções e contatos

## 🎯 Funcionalidades principais

- **Agendamentos**: Sistema completo de marcação de horários
- **Estoque**: Controle de produtos com alertas de estoque baixo
- **Fluxo de Caixa**: Gestão financeira completa
- **Colaboradores**: Gestão da equipe
- **Dashboard**: Visão geral do negócio

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── api/               # Endpoints da API
│   ├── appointments/      # Página de agendamentos
│   ├── cashflow/         # Página de fluxo de caixa
│   ├── collaborators/    # Página de colaboradores
│   ├── inventory/        # Página de estoque
│   ├── services/         # Página de serviços
│   └── schedule/         # Página de agenda
├── components/            # Componentes reutilizáveis
├── contexts/             # Contextos React
├── lib/                  # Utilitários e configurações
│   ├── api/             # Funções de API
│   └── prisma.ts        # Cliente Prisma
└── types/               # Definições de tipos
```

## 🔧 Desenvolvimento

### Comandos úteis

```bash
# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Linting
npm run lint

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio
```

## 📄 Licença

Este projeto está sob a licença MIT.
