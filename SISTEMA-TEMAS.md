# Sistema de Temas - Salão de Beleza

Este documento explica como usar o sistema de temas implementado no sistema do salão de beleza.

## Funcionalidades

### 1. Tema Claro/Escuro
- Alternância automática entre tema claro e escuro
- Persistência da escolha no localStorage
- Transições suaves entre os temas

### 2. Personalização de Cores
- Editor visual de cores para cada elemento do tema
- 12 cores personalizáveis:
  - **Primária**: Cor principal do sistema
  - **Secundária**: Cor secundária
  - **Destaque**: Cor de destaque/accent
  - **Fundo**: Cor de fundo principal
  - **Superfície**: Cor de fundo de cards/containers
  - **Texto**: Cor do texto principal
  - **Texto Secundário**: Cor do texto secundário
  - **Borda**: Cor das bordas
  - **Sucesso**: Cor para mensagens de sucesso
  - **Aviso**: Cor para mensagens de aviso
  - **Erro**: Cor para mensagens de erro

### 3. Paletas Pré-definidas
- **Padrão**: Azul (#3b82f6)
- **Roxo**: Roxo (#8b5cf6)
- **Verde**: Verde (#10b981)
- **Rosa**: Rosa (#ec4899)
- **Laranja**: Laranja (#f97316)

## Como Usar

### Alternar Tema
1. No sidebar, clique no ícone de lua/sol para alternar entre tema claro e escuro

### Personalizar Cores
1. No sidebar, clique no ícone de paleta (🎨)
2. Use os color pickers para alterar as cores
3. Clique em "Salvar" para aplicar as mudanças
4. Clique em "Cancelar" para descartar as mudanças
5. Clique no ícone de reset (🔄) para restaurar as cores padrão

### Selecionar Paleta
1. No sidebar, clique no botão "Paleta"
2. Escolha uma das paletas pré-definidas
3. As cores serão aplicadas automaticamente

## Arquivos de Configuração

### `src/config/theme.ts`
Arquivo principal de configuração de cores. Aqui você pode:

- Modificar as cores padrão dos temas claro e escuro
- Adicionar novas paletas de cores
- Criar variações de cores

```typescript
// Exemplo de como adicionar uma nova paleta
export const colorPalettes = {
  // ... paletas existentes
  novaPaleta: {
    light: {
      ...lightThemeColors,
      primary: '#sua-cor-aqui',
      accent: '#sua-cor-aqui'
    },
    dark: {
      ...darkThemeColors,
      primary: '#sua-cor-aqui',
      accent: '#sua-cor-aqui'
    }
  }
}
```

### `src/app/globals.css`
Arquivo de estilos globais que define:
- Variáveis CSS para as cores
- Estilos base para elementos
- Transições suaves

## Estrutura dos Arquivos

```
src/
├── contexts/
│   └── ThemeContext.tsx          # Contexto do tema
├── components/
│   ├── ThemeToggle.tsx           # Botão de alternar tema
│   ├── ThemeCustomizer.tsx       # Editor de cores
│   └── ThemePaletteSelector.tsx  # Seletor de paletas
├── config/
│   └── theme.ts                  # Configuração de cores
└── app/
    └── globals.css               # Estilos globais
```

## Variáveis CSS Disponíveis

O sistema cria as seguintes variáveis CSS que podem ser usadas em qualquer componente:

```css
--color-primary
--color-secondary
--color-accent
--color-background
--color-surface
--color-text
--color-textSecondary
--color-border
--color-success
--color-warning
--color-error
```

### Exemplo de Uso

```css
.meu-componente {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.meu-botao {
  background-color: var(--color-primary);
  color: white;
}
```

## Classes CSS Úteis

O sistema também fornece classes CSS pré-definidas:

- `.btn-primary`: Botão com cor primária
- `.btn-secondary`: Botão com cor secundária
- `.card`: Container com fundo de superfície
- `.modal`: Modal com tema aplicado
- `.tooltip`: Tooltip com tema aplicado

## Persistência

Todas as configurações são salvas automaticamente no localStorage:
- `theme`: Tema atual (light/dark)
- `themeColors`: Cores personalizadas
- `themePalette`: Paleta selecionada

## Compatibilidade

O sistema é compatível com:
- Todos os navegadores modernos
- Tailwind CSS
- React/Next.js
- TypeScript

## Troubleshooting

### Cores não estão sendo aplicadas
1. Verifique se o ThemeProvider está envolvendo sua aplicação
2. Confirme se as variáveis CSS estão sendo definidas no :root
3. Verifique o console para erros de JavaScript

### Tema não está persistindo
1. Verifique se o localStorage está habilitado
2. Confirme se não há erros no console
3. Teste em modo privado/incógnito

### Performance
- As transições são otimizadas para 60fps
- As cores são aplicadas via CSS custom properties para melhor performance
- O sistema usa React.memo onde apropriado para evitar re-renders desnecessários 