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

## Repositório Live
- **Git** atualizado: `https://github.com/code-bynary/gestominds`

## Próximos Passos
1. Iniciar o **CRUD de Contas Bancárias** (Backend + Frontend).
2. Criar o seletor de Unidade/Empresa (Tenant Switcher) no Dashboard.
3. Configurar o formulário de Lançamentos Rápidos.

---
*Para rodar o front:* `cd frontend && npm run dev`
*Para rodar o back:* `cd backend && npm run dev` (requer env de banco configurada)
