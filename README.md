# My Statement - Desafio Front-End

Uma aplicação web moderna para gerenciamento financeiro pessoal construída com React, TypeScript e Vite. Faz uso de uma API básica para as funcionalidades e geração do extrato.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Roteamento**: React Router DOM 7
- **Formulários**: React Hook Form com validação Zod
- **Ícones**: React Icons (Lucide)
- **Notificações**: React Toastify
- **CSS**: CSS Modules com design responsivo
- **Testes**: Vitest com Testing Library
- **Linting**: ESLint com TypeScript
- **Formatação**: Prettier

## 📋 Funcionalidades

### ✅ Autenticação

- Login seguro com validação
- Cadastro de novos usuários
- Gerenciamento de sessão com tokens
- Proteção de rotas privadas

### ✅ Dashboard Principal

- Visão geral financeira
- Cards de resumo (Saldo, Receitas, Despesas)
- Interface responsiva para mobile e desktop
- Navegação lateral com menu hambúrguer (Profile Icon)

### ✅ Extrato Bancário

- Listagem paginada de transações
- Filtros por tipo (Depósito, Saque, Transferência)
- Formatação automática de valores e datas
- Indicadores visuais para receitas e despesas

### ✅ Perfil do Usuário

- Edição de dados pessoais
- Configurações de preferências
- Configurações de segurança

## 🏗️ Arquitetura do Projeto

```
src/
├── auth/                 # Contexto e hooks de autenticação
├── components/           # Componentes reutilizáveis
├── pages/               # Páginas da aplicação
│   ├── login/           # Página de login
│   ├── register/        # Página de cadastro
│   └── dashboard/       # Dashboard principal
│       ├── components/  # Componentes específicos do dashboard
│       ├── controllers/ # Controladores com lógica de negócio
│       ├── views/       # Views com apresentação
│       ├── styles/      # Estilos CSS Modules
│       └── utils/       # Utilitários e helpers
├── services/            # Integração com APIs
├── utils/               # Utilitários globais
└── routes.tsx           # Configuração de rotas
```

## 🔧 Configuração do Ambiente

### Pré-requisitos

- Node.js 22.12.0 (recomendado usar nvm)
- npm ou yarn

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://api.exemplo.com
VITE_AUTH_URL=https://api.exemplo.com/auth
VITE_USERS_URL=https://api.exemplo.com/users
```

## 🚀 Como Executar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/luanhmilano/my-statement.git

# Entre na pasta do projeto
cd my-statement

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Execute o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### Build para Produção

```bash
# Gere o build otimizado
npm run build

# Preview do build
npm run preview
```

## 🧪 Testes

```bash
# Execute todos os testes
npm run test

# Testes com interface visual
npm run test:ui

# Gere relatório de cobertura
npm run test:coverage
```

### Cobertura de Testes

O projeto possui cobertura abrangente incluindo:

- Testes unitários para componentes
- Testes de integração para controllers
- Testes de utilitários e helpers
- Mocks para APIs e dependências externas

## 📱 Design Responsivo

A aplicação foi desenvolvida com design mobile-first:

- **Desktop**: Layout com sidebar fixa
- **Tablet**: Layout adaptativo com menu colapsável
- **Mobile**: Menu hambúrguer com overlay

### Breakpoints

- Mobile: `≤ 768px`
- Tablet: `769px - 1024px`
- Desktop: `≥ 1025px`

## 🎨 Padrões de Código

### Linting e Formatação

```bash
# Verificar código
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Formatar código
npm run format

# Verificar formatação
npm run format:check
```

### Convenções

- **Componentes**: PascalCase
- **Arquivos**: kebab-case
- **CSS Modules**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

## 🔒 Segurança

- Tokens JWT para autenticação
- Proteção de rotas sensíveis
- Validação client-side com Zod
- Sanitização de dados de entrada
- Headers de segurança configurados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
