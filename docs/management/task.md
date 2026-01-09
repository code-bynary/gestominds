# Tasks

- [x] Initial Push to GitHub [x]

### 3. Repositório Live
- **Git** inicializado e primeiro push realizado com sucesso para: `https://github.com/code-bynary/gestominds`
- `.gitignore` configurado para manter o repositório limpo.

## Próximos Passos
- [x] Project Initialization [x]
    - [x] Backend setup (Node.js, Express, Prisma)
    - [x] Frontend setup (React, Vite, TailwindCSS)
- [x] Database Schema Design [x]
    - [x] Create Prisma schema with multi-tenancy (tenant_id)
    - [x] Define core models: User, Tenant, Account, Category, Transaction
- [x] Authentication System [x]
    - [x] Implement User Registration (Signup)
    - [x] Implement User Login (Sign-in)
    - [x] JWT + Refresh Token logic
    - [x] Backend Auth Middleware
    - [x] Frontend Auth Context & Private Routes
- [x] Core Features (Phase 1) [x]
    - [x] Accounts management (Backend & Frontend)
        - [x] Backend CRUD implementation
        - [x] Frontend UI (listing and form)
    - [x] Categories management (hierarchical) [x]
        - [x] Backend CRUD with hierarchy support
        - [x] Frontend management UI
    - [x] Transactions (Manual entries, transfers) [x]
        - [x] Backend CRUD with persistence and status (Pending/Confirmed)
        - [x] Frontend transaction listing
        - [x] Quick transaction creation form
    - [x] People management (Clients & Suppliers) [x]
        - [x] Backend CRUD for People
        - [x] Frontend management UI
    - [x] Transfers (Between own accounts) [x]
        - [x] Backend logic for dual transactions
        - [x] Frontend transfer modal
    - [ ] Balance calculation logic
- [ ] Initial UI Implementation [ ]
    - [ ] Basic Layout and Navigation
    - [ ] Account and Category listings
    - [ ] Dashboard shell
