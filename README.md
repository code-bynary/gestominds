# Gestor Minds - Versão beta 0

🚀 **PROMPT PARA ANTIGRAVITY — PLATAFORMA FINANCEIRA MINDS - PF + MEI (WEB + API + FUTURO MOBILE)**

## CONTEXTO GERAL
Você é um arquiteto de software sênior responsável por projetar e gerar a base de uma plataforma financeira moderna, escalável e preparada para SaaS, destinada a:
- Pessoa Física (PF)
- MEI / Pessoa Jurídica (PJ)

O sistema deve substituir planilhas financeiras e oferecer controle real de saldos bancários, relatórios confiáveis, dashboards e automações financeiras.
A aplicação deve ser API-first, permitindo no futuro integração com aplicativo mobile (React Native ou Flutter).

## OBJETIVOS DO SISTEMA
- Permitir controle financeiro completo de PF e PJ em um único sistema.
- Manter módulos separados, mas com integração entre eles (ex: pró-labore, distribuição de lucros).
- Garantir que saldos bancários sejam sempre derivados das movimentações, nunca digitados manualmente.
- Ser multi-tenant desde a base, permitindo escalar para SaaS futuramente.
- Ter interface moderna, responsiva e personalizável.

## ARQUITETURA OBRIGATÓRIA
### BACKEND
- Node.js
- Express
- Prisma ORM
- Banco: PostgreSQL (preferencial) ou MySQL
- Autenticação JWT + Refresh Token
- API REST documentada com Swagger
- Estrutura modular por domínio

### FRONTEND WEB
- React + Vite
- TailwindCSS
- Tema claro/escuro
- Layout responsivo (desktop e mobile web)
- Componentes reutilizáveis
- Dashboards com gráficos (Recharts ou Chart.js)

### MOBILE (FUTURO)
- API preparada para consumo por app
- Sem dependência de sessão (apenas tokens)

## MULTI-TENANCY E SEGURANÇA
- Todas as tabelas devem conter tenant_id
- Usuário pode possuir: Perfil PF e Uma ou mais empresas PJ
- Toda query deve ser filtrada por tenant
- Proteção contra acesso cruzado de dados
- Hash forte de senha (bcrypt ou argon2)

## MÓDULOS DO SISTEMA
(Veja o prompt completo para detalhes de cadastros, financeiro, conciliação e relatórios para PJ e PF)

## PRIORIDADE DE IMPLEMENTAÇÃO
- **FASE 1 — BASE**: Auth, Multi-tenant, Contas, Categorias, Lançamentos, Saldos.
- **FASE 2 — PJ**: Clientes / Fornecedores, Pagar / Receber, DRE, Dashboard PJ.
- **FASE 3 — PF**: Módulo PF, Integração PF ↔ PJ, Investimentos.
- **FASE 4 — AUTOMAÇÃO**: Recorrências, Conciliação bancária, Relatórios avançados.
