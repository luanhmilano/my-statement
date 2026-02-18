# My Statement - Financial Dashboard App

Um dashboard financeiro robusto e escalável, desenvolvido com foco em arquitetura limpa, separação de responsabilidades e alta cobertura de testes.
Atualmente, o projeto contempla o Front-End completo (com API externa), com um roadmap definido para evolução Full-Stack.

## 🎯 O Desafio e o Objetivo
Este projeto nasceu como um Desafio Front-End, mas foi abordado com a mentalidade de um sistema de produção real. O objetivo principal foi implementar uma arquitetura sustentável no ecossistema React, fugindo do acoplamento comum entre lógica de negócio e interface (UI).

## 🏗️ Decisões Arquiteturais

Para garantir a manutenção e testabilidade a longo prazo, implementei uma variação do padrão **MVC (Model-View-Controller)** adaptado para o React:

* **Controllers (`DashboardController.tsx`):** Responsáveis exclusivamente pela lógica de negócio, chamadas à API, gestão de estado global (Context/Auth) e formatação de dados.
* **Views (`DashboardView.tsx`):** Componentes de apresentação pura (Dumb Components). Recebem dados e callbacks via props, sem conhecimento da origem dos dados, tornando-os altamente reutilizáveis e fáceis de testar.
* **Services:** Camada isolada para comunicação externa (Axios), facilitando a troca de fornecedores de dados ou mock de requisições.

## 🧪 Estratégia de Testes

A qualidade foi garantida desde o início utilizando **Vitest, React Testing Library e Jest DOM**. 
A separação MVC permitiu uma estratégia de testes muito mais eficiente:
* **Views:** Testadas de forma isolada através da injeção de props fictícias (simulando loading states, sucesso e erro), garantindo que a renderização ocorre perfeitamente sem precisar mockar requisições HTTP complexas.
* **Controllers:** Testados simulando as respostas dos serviços externos para garantir que o processamento e a entrega de dados para a View ocorrem sem falhas.

## 🛠️ Tecnologias Utilizadas
* **Front-End:** React, TypeScript, CSS Modules
* **Formulários & Validação:** React Hook Form + Zod
* **Testes:** Vitest, React Testing Library
* **Build Tool:** Vite

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

## 🗺️ Roadmap: Rumo ao Full-Stack (Em Breve)
Para demonstrar o domínio do ciclo de vida completo do software, a próxima iteração deste projeto incluirá um backend próprio, com a seguinte stack:
* **API:** Node.js com Express
* **Banco de Dados:** PostgreSQL (gerenciado via Prisma ORM) para garantir a consistência transacional (ACID) dos *statements*.
* **Segurança:** Autenticação real com JWT.

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
