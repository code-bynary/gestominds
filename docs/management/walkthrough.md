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

## Próximos Passos
1. Implementar o sistema de Autenticação (JWT + Refresh Token).
2. Criar os endpoints básicos de CRUD para Contas e Categorias.
3. Conectar o Frontend com a API real.

---
*Para rodar o front:* `cd frontend && npm run dev`
*Para rodar o back:* `cd backend && npm run dev` (requer env de banco configurada)
