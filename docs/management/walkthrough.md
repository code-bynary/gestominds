# Projeto Gestor Minds - beta 0 (Inicialização)

Concluí a inicialização técnica do projeto seguindo a arquitetura multi-tenant solicitada.

## O que foi feito:

### 1. Backend Foundation
- Estrutura **Node.js + Express + TypeScript** configurada.
- **Prisma ORM** inicializado com o schema multi-tenant:
  - Modelos de `Tenant`, `User`, `Account`, `Category`, `Transaction`, etc.
  - Toda entidade possui `tenantId` para isolamento de dados.
- Configuração de scripts para desenvolvimento (`npm run dev`) e banco de dados.

### 2. Frontend Moderno
- **React + Vite + TailwindCSS** configurados.
- Criado um **Design System** inicial com cores personalizadas (Primary Azure).
- Implementado um **Layout Mestre** com sidebar responsiva, suporte a Dark Mode (base) e scrollbar customizada.
- **Dashboard de Exemplo**: Criei uma tela inicial demonstrativa com widgets financeiros para validar a estética "premium".

## Estrutura do Projeto
```text
gestor-minds/
├── backend/            # API REST (Express + Prisma)
│   ├── prisma/         # Schema e Migrations
│   └── src/            # Código fonte TS
└── frontend/           # Web App (React + Vite)
    └── src/            # Componentes e UI
```

### 3. Módulo de Autenticação (JWT + Multi-tenant) - COMPLETO
- **Backend**:
  - `AuthRepository`: Criação de usuário e tenant vinculado em uma transação.
  - `AuthService`: Hashing de senha (bcrypt) e geração de tokens JWT.
  - `AuthMiddleware`: Proteção de rotas e injeção do contexto de tenant.
  - `RefreshController`: Lógica de renovação de tokens (Refresh Token) implementada.
- **Frontend**:
  - `AuthContext`: Gerenciamento de estado de login global integrado com Axios e LocalStorage.
  - `api.ts`: Serviço de API com interceptor de tokens configurado.
  - `LoginPage` & `SignupPage`: Interfaces premium conectadas à API real.
  - `PrivateRoutes`: Proteção robusta das rotas internas.

### 4. Gestão de Contas Bancárias (CRUD) - COMPLETO
- **Backend**:
  - `AccountRepository`: Implementação de isolamento rigoroso por `tenantId`.
  - Endpoints de listagem, criação e exclusão protegidos por JWT.
- **Frontend**:
  - `AccountsPage`: Interface moderna para visualização de contas.
  - Modal de criação de conta com seleção de tipo (Corrente, Poupança, etc.).
  - Integração visual com o layout mestre e sidebar.

### 5. Categorias Hierárquicas - COMPLETO
- **Backend**:
  - `CategoryRepository`: Suporte a árvore de categorias (com `parentId`).
  - Endpoints para criar categorias e subcategorias de Receita ou Despesa.
- **Frontend**:
  - `CategoriesPage`: Interface intuitiva que separa Receitas de Despesas.
  - Suporte a subcategorias infinitas (exibição recursiva).
  - Modal dinâmico para criação rápida.

### 6. Lançamentos (Transações) - COMPLETO
- **Backend**:
  - `TransactionRepository`: Registro detalhado de movimentos financeiros.
  - Controle de status (Pendente / Confirmado).
  - Listagem com filtros por data.
- **Frontend**:
  - `TransactionsPage`: Tabela detalhada com indicadores de cor (Verde/Vermelho).
  - Formulário unificado para Receitas e Despesas.
  - Integração com Contas e Categorias reais.

### 7. Gestão de Pessoas (Clientes & Fornecedores) - COMPLETO
- **Backend**:
  - `PersonRepository`: Cadastro de pessoas com isolamento por tenant.
  - Endpoints para criar, listar e editar contatos.
- **Frontend**:
  - `PeoplePage`: Galeria de cartões para visualização rápida de contatos.
  - **Integração**: Transações agora podem ser vinculadas a uma pessoa da lista.
  - Navegação lateral ativada.

### 8. Transferências entre Contas - COMPLETO
- **Backend**:
  - `TransferRepository`: Implementação de transações atômicas para garantir que o dinheiro saia de uma conta e entre na outra simultaneamente.
  - Vínculo entre lançamentos (`linkedTransactionId`).
- **Frontend**:
  - `TransferModal`: Interface dedicada para movimentação entre contas.
  - Identificação visual de transferências na lista de lançamentos (ícone ⇄).
- **Infraestrutura**:
  - Migração para **SQLite** para facilitar o desenvolvimento local sem dependências externas.
  - Configuração de `.env` automatizada para o ambiente de dev.

### 9. Dashboard Funcional - COMPLETO
- **Cálculos em Tempo Real**: O backend agora agrega todos os lançamentos confirmados para exibir o saldo real do patrimônio.
- **KPIs Dinâmicos**: Cards de Receita Mensal, Despesa Mensal e Saldo Total atualizados instantaneamente.
- **Visualização de Dados**: Integração com a biblioteca `Recharts` para exibir o fluxo de caixa dos últimos 6 meses.
- **Gráficos**: Inclui gráfico de área para tendências e gráfico de barras para comparativo mensal.

### 10. Relatórios e Exportação - COMPLETO
- **Exportação Excel**: Geração de planilhas `.xlsx` detalhadas com todos os lançamentos, categorias e contas usando `exceljs`.
- **Exportação PDF**: Geração de documentos `.pdf` formatados para impressão usando `pdfmake`.
- **Interface de Download**: Botões de exportação integrados diretamente na barra de ferramentas da tela de Lançamentos.
- **Filtros Automatizados**: A exportação respeita o contexto multi-tenant do usuário logado.

### 11. Centros de Custo (Projetos/Departamentos) - COMPLETO
- **Gestão de Centros de Custo**: Tela dedicada para cadastrar projetos, departamentos ou unidades de negócio.
- **Isolamento de Tenant**: Cada empresa/usuário gerencia seus próprios centros de custo de forma independente.
- **Integração com Lançamentos**: Agora é possível vincular uma despesa ou receita a um centro de custo específico.
- **Organização Financeira**: Facilita a análise de quais projetos estão gerando mais custo ou receita.

## Repositório Live
- **Git** atualizado: `https://github.com/code-bynary/gestominds`

## Próximos Passos
1. Iniciar o **CRUD de Contas Bancárias** (Backend + Frontend).
2. Criar o seletor de Unidade/Empresa (Tenant Switcher) no Dashboard.
3. Configurar o formulário de Lançamentos Rápidos.

---
*Para rodar o front:* `cd frontend && npm run dev`
*Para rodar o back:* `cd backend && npm run dev` (requer env de banco configurada)
