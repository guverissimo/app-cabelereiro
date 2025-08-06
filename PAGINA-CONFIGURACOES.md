# Página de Configurações de Cores

Esta página permite gerenciar completamente as paletas de cores do sistema, incluindo criação, edição e personalização de temas.

## Funcionalidades

### 1. Visualização de Paletas
- **Paletas Padrão**: Mostra todas as paletas pré-definidas (Padrão, Roxo, Verde, Rosa, Laranja)
- **Paletas Personalizadas**: Exibe paletas criadas pelo usuário
- **Preview Visual**: Cada paleta mostra um preview das cores principais
- **Indicadores**: Diferencia paletas padrão de personalizadas

### 2. Editor de Paletas
- **Interface Completa**: Editor modal com todas as opções de cores
- **Tabs Separados**: Edição independente para tema claro e escuro
- **12 Cores Personalizáveis**:
  - Primária, Secundária, Destaque
  - Fundo, Superfície, Borda
  - Texto, Texto Secundário
  - Sucesso, Aviso, Erro
- **Preview em Tempo Real**: Visualização instantânea das mudanças
- **Validação**: Nome obrigatório para salvar

### 3. Gerenciamento de Paletas
- **Criar Nova**: Botão para criar paletas do zero
- **Editar**: Modificar paletas existentes
- **Excluir**: Remover paletas personalizadas (com confirmação)
- **Aplicar**: Testar paletas diretamente no sistema

### 4. Importação/Exportação
- **Exportar**: Salvar todas as paletas em arquivo JSON
- **Importar**: Carregar paletas de arquivo JSON
- **Compatibilidade**: Formato padrão para compartilhamento

## Como Usar

### Acessar a Página
1. No sidebar, clique em "Configurações"
2. Ou acesse diretamente: `/configuracoes`

### Criar Nova Paleta
1. Clique em "Nova Paleta"
2. Digite um nome para a paleta
3. Configure as cores para tema claro e escuro
4. Use o preview para ver o resultado
5. Clique em "Salvar"

### Editar Paleta Existente
1. Clique no ícone de edição (lápis) na paleta desejada
2. Modifique as cores conforme necessário
3. Use as tabs para alternar entre tema claro/escuro
4. Clique em "Salvar" para aplicar as mudanças

### Aplicar Paleta
1. Clique no ícone de olho (👁️) na paleta desejada
2. A paleta será aplicada imediatamente ao sistema
3. As mudanças são salvas automaticamente

### Excluir Paleta
1. Clique no ícone de lixeira (🗑️) na paleta personalizada
2. Confirme a exclusão
3. A paleta será removida permanentemente

### Exportar Paletas
1. Clique em "Exportar"
2. Um arquivo `paletas-cores.json` será baixado
3. O arquivo contém todas as paletas (padrão + personalizadas)

### Importar Paletas
1. Clique em "Importar"
2. Selecione um arquivo JSON válido
3. Apenas paletas personalizadas serão importadas
4. Paletas padrão não serão sobrescritas

## Estrutura do Arquivo JSON

```json
{
  "nomeDaPaleta": {
    "light": {
      "primary": "#3b82f6",
      "secondary": "#64748b",
      "accent": "#f59e0b",
      "background": "#ffffff",
      "surface": "#f8fafc",
      "text": "#1e293b",
      "textSecondary": "#64748b",
      "border": "#e2e8f0",
      "success": "#10b981",
      "warning": "#f59e0b",
      "error": "#ef4444"
    },
    "dark": {
      "primary": "#60a5fa",
      "secondary": "#94a3b8",
      "accent": "#fbbf24",
      "background": "#0f172a",
      "surface": "#1e293b",
      "text": "#f1f5f9",
      "textSecondary": "#94a3b8",
      "border": "#334155",
      "success": "#34d399",
      "warning": "#fbbf24",
      "error": "#f87171"
    }
  }
}
```

## Persistência

- **Paletas Personalizadas**: Salvas no localStorage
- **Configuração Atual**: Mantida entre sessões
- **Backup**: Exportação para arquivo JSON
- **Restauração**: Importação de arquivos JSON

## Compatibilidade

- **Navegadores**: Todos os navegadores modernos
- **Formatos**: JSON padrão
- **Tamanho**: Sem limite para número de paletas
- **Performance**: Carregamento otimizado

## Dicas de Uso

### Criação de Paletas
1. **Comece com uma base**: Use uma paleta existente como ponto de partida
2. **Mantenha contraste**: Garanta legibilidade entre texto e fundo
3. **Teste ambos os temas**: Configure tanto claro quanto escuro
4. **Use o preview**: Visualize o resultado antes de salvar

### Organização
1. **Nomes descritivos**: Use nomes que identifiquem a paleta
2. **Categorize**: Agrupe paletas por estilo ou uso
3. **Backup regular**: Exporte suas paletas periodicamente
4. **Compartilhe**: Use a exportação para compartilhar com outros usuários

### Troubleshooting

#### Paleta não aparece
- Verifique se o nome foi salvo corretamente
- Recarregue a página
- Verifique o console para erros

#### Cores não aplicam
- Confirme se clicou em "Salvar"
- Verifique se o ThemeProvider está ativo
- Teste aplicando a paleta diretamente

#### Importação falha
- Verifique se o arquivo é JSON válido
- Confirme a estrutura do arquivo
- Tente importar uma paleta por vez

#### Performance lenta
- Reduza o número de paletas personalizadas
- Limpe paletas não utilizadas
- Use o localStorage para backup 