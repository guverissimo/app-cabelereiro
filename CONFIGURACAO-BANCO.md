# Configuração do Sistema de Autenticação

## Pré-requisitos

1. **PostgreSQL instalado e rodando**
2. **Banco de dados criado**
3. **Variável de ambiente DATABASE_URL configurada**

## Passos para Configuração

### 1. Configurar Banco de Dados

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### 2. Executar Migrações

```bash
npx prisma migrate dev
```

### 3. Gerar Cliente Prisma

```bash
npx prisma generate
```

### 4. Criar Usuários Iniciais

Acesse `http://localhost:3000/setup` e clique em "Criar Usuários" para criar os usuários iniciais do sistema.

### 5. Fazer Login

Acesse `http://localhost:3000/login` e use uma das credenciais criadas:

## Usuários Criados

### Proprietário (Acesso Completo)
- **Email:** owner@salon.com
- **Senha:** 123456
- **Permissões:** Todas as funcionalidades do sistema

### Administrador (Gerenciamento)
- **Email:** admin@salon.com
- **Senha:** 123456
- **Permissões:** Gerenciamento de colaboradores, serviços, agendamentos, inventário

### Colaborador (Acesso Básico)
- **Email:** collaborator@salon.com
- **Senha:** 123456
- **Permissões:** Visualizar dados próprios e gerenciar agendamentos

## Estrutura de Autenticação

### APIs Criadas

1. **`/api/users`** - Autenticação de usuários
   - `POST` - Login
   - `GET` - Listar usuários (para administradores)

2. **`/api/users/seed`** - Criar usuários iniciais
   - `POST` - Criar usuários padrão

### Context de Autenticação

O `AuthContext` gerencia:
- Estado do usuário logado
- Função de login/logout
- Verificação de permissões
- Verificação de roles

### Sistema de Permissões

O sistema usa um sistema de permissões granulares:

- `VIEW_OWN_DATA` - Ver dados próprios
- `VIEW_ALL_DATA` - Ver todos os dados
- `MANAGE_COLLABORATORS` - Gerenciar colaboradores
- `MANAGE_SERVICES` - Gerenciar serviços
- `MANAGE_APPOINTMENTS` - Gerenciar agendamentos
- `MANAGE_INVENTORY` - Gerenciar inventário
- `VIEW_REPORTS` - Ver relatórios
- `MANAGE_FINANCIAL` - Gerenciar finanças
- `MANAGE_SUBSCRIPTIONS` - Gerenciar assinaturas
- `MANAGE_GIFT_CARDS` - Gerenciar cartões-presente

## Segurança

- Senhas são hasheadas com bcrypt
- Tokens de sessão são armazenados no localStorage
- Validação de permissões em todas as operações
- Proteção contra acesso não autorizado

## Troubleshooting

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme se a DATABASE_URL está correta
- Teste a conexão com `npx prisma db push`

### Erro de Migração
- Delete a pasta `prisma/migrations` se necessário
- Execute `npx prisma migrate reset`
- Execute `npx prisma migrate dev`

### Usuários não criados
- Verifique se o banco está acessível
- Confirme se as migrações foram executadas
- Acesse `/setup` para criar usuários manualmente

## Próximos Passos

1. Implementar refresh tokens
2. Adicionar recuperação de senha
3. Implementar auditoria de login
4. Adicionar autenticação de dois fatores
5. Implementar rate limiting
6. Adicionar logs de segurança
