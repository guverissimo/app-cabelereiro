# Sistema de Salão de Beleza

Sistema completo de agendamento, gestão de estoque e fluxo de caixa para salão de beleza desenvolvido com Next.js, TypeScript, Tailwind CSS e Supabase.

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
- **Backend**: Supabase (PostgreSQL)
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Data**: date-fns

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

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

### 3. Configure o Supabase

#### 3.1 Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL e a chave anônima do projeto

#### 3.2 Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

#### 3.3 Crie as tabelas no Supabase

Execute os seguintes comandos SQL no Editor SQL do Supabase:

```sql
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
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
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
```

#### 3.4 Insira dados de exemplo (opcional)

```sql
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
  ('Alisante', 15, 120.00);

-- Inserir agendamentos de exemplo
INSERT INTO appointments (client_name, service, price, collaborator_id, datetime, status) VALUES
  ('Maria Silva', 'Corte Feminino', 45.00, (SELECT id FROM collaborators WHERE name = 'Bruna Souza'), NOW() + INTERVAL '1 day', 'agendado'),
  ('João Santos', 'Barba', 25.00, (SELECT id FROM collaborators WHERE name = 'Carlos Lima'), NOW() + INTERVAL '2 days', 'agendado'),
  ('Ana Costa', 'Manicure', 35.00, (SELECT id FROM collaborators WHERE name = 'Carlos Lima'), NOW() - INTERVAL '1 day', 'concluído');

-- Inserir transações de exemplo
INSERT INTO cashflow (type, description, amount, date, category) VALUES
  ('entrada', 'Pagamento - Corte Feminino', 45.00, NOW() - INTERVAL '1 day', 'Serviços'),
  ('entrada', 'Pagamento - Manicure', 35.00, NOW() - INTERVAL '1 day', 'Serviços'),
  ('saída', 'Compra de produtos', 500.00, NOW() - INTERVAL '3 days', 'Fornecedores'),
  ('saída', 'Conta de luz', 150.00, NOW() - INTERVAL '5 days', 'Despesas');
```

### 4. Execute o projeto
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 📱 Uso do Sistema

### Dashboard
- Visualize estatísticas gerais do salão
- Acompanhe faturamento e clientes atendidos
- Veja gráficos de performance por colaborador

### Agendamentos
- Clique em "Novo Agendamento" para criar um novo
- Use os filtros para encontrar agendamentos específicos
- Atualize o status dos agendamentos conforme necessário

### Estoque
- Adicione novos produtos com quantidade e preço
- Monitore produtos com estoque baixo
- Edite ou remova produtos conforme necessário

### Fluxo de Caixa
- Registre entradas e saídas de dinheiro
- Categorize as transações
- Acompanhe o saldo atual

### Colaboradores
- Cadastre novos colaboradores
- Gerencie funções e informações de contato
- Edite ou remova colaboradores

## 🚀 Deploy na Vercel

### 1. Conecte o repositório
1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório

### 2. Configure as variáveis de ambiente
Na Vercel, adicione as mesmas variáveis de ambiente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Deploy
A Vercel fará o deploy automaticamente a cada push para o repositório.

## 🔧 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── appointments/       # Página de agendamentos
│   ├── inventory/         # Página de estoque
│   ├── cashflow/          # Página de fluxo de caixa
│   ├── collaborators/     # Página de colaboradores
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard
├── components/            # Componentes reutilizáveis
│   └── Sidebar.tsx        # Navegação lateral
└── lib/                   # Configurações e utilitários
    └── supabase.ts        # Configuração do Supabase
```

## 🎨 Personalização

O sistema usa Tailwind CSS para estilização. Você pode personalizar:

- Cores: Edite as classes do Tailwind nos componentes
- Layout: Modifique o `Sidebar.tsx` para alterar a navegação
- Funcionalidades: Adicione novos campos nas tabelas do Supabase

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as tabelas foram criadas corretamente no Supabase
2. Confirme se as variáveis de ambiente estão configuradas
3. Verifique o console do navegador para erros

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
