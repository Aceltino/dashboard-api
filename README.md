# Dashboard API

API RESTful dinâmica para dashboards, desenvolvida com Node.js, TypeScript, Prisma ORM e MySQL.

## 🧩 Visão Geral

Este projeto implementa uma API capaz de consultar transações e fornecer respostas adaptáveis para diferentes tipos de gráficos, além de registrar auditoria básica.

- Node.js + TypeScript
- Express como servidor HTTP
- Prisma ORM com MySQL
- Modelo de dados em `prisma/schema.prisma`
- Tratamento centralizado de erros em `src/shared/middlewares/errorMiddleware.ts`
- Arquitetura modular (infraestrutura, domínio e casos de uso)

## 🗂️ Modelos (prisma/schema.prisma)

### Transaction (transactions)
- `id: Int` (PK, auto incremental)
- `category: String`
- `amount: Decimal(10,2)`
- `status: String`
- `createdAt: DateTime` (default now)
- `updatedAt: DateTime` (auto update)
- índice: `@@index([createdAt])`

### AuditLog (audit_logs)
- `id: Int` (PK, auto incremental)
- `entityId: Int`
- `action: String`
- `oldValue: String?` (`Text`)
- `newValue: String?` (`Text`)
- `createdAt: DateTime` (default now)

## 🔧 Requisitos

- Node.js >= 20
- pnpm
- MySQL
- Docker (opcional)

## ⚙️ Configuração

Copie `.env.example` (ou crie `.env`):

```dotenv
DATABASE_URL="mysql://root:root@localhost:3306/dashboard_db"
PORT=3000
```

Instale dependências:

```bash
pnpm install
```

Execute migrations e gere cliente prisma:

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
```

## ▶️ Execução

```bash
pnpm dev
```

Build:

```bash
pnpm build
pnpm start
```

Docker:

```bash
pnpm docker:up
pnpm docker:down
```

## 📌 Endpoints previstas do desafio

A API deve oferecer rota dinâmica para relatório de dashboard com filtro de data e tipo de gráfico.

### GET /dashboard

Query params:
- `type` (required): `pie | line | bar`
- `startDate` (required): `YYYY-MM-DD`
- `endDate` (required): `YYYY-MM-DD`

Exemplo:

```http
GET /dashboard?type=pie&startDate=2026-01-01&endDate=2026-02-01
```

Formato sugerido:

- pie: `{ data:[{ label, value }] }`
- line: `{ data:[{ date, value }] }`
- bar: `{ data:[{ label, value }] }`

Resposta 200:

```json
{
  "type": "pie",
  "data": [
    { "label": "Software", "value": 1234.56 },
    { "label": "Hardware", "value": 789.01 }
  ]
}
```

Erros:
- 400: validação de query inválida
- 404: dados não encontrados (opcional)
- 500: erro interno

## 🧪 Testes (a implementar)

Rodar:

```bash
pnpm test
```

Cobertura esperada:
- unidade: mapeamento e conversão de dados
- integração: rota `/dashboard` + edge-cases

## ✅ Pronto para entrega GitHub

1. Implementar rota `dashboard` em `src/infrastructure/http/routes` e controller.
2. Adicionar validação com Zod em `src/shared/validators`.
3. Montar use-case para filtro de datas + agregação em `src/application/use-cases`.
4. Escrever testes com `vitest`/`jest` + `supertest`.
5. Adicionar `npx prisma migrate deploy` no CI.
6. Atualizar `README` com exemplos e execução.

---

## 📦 Scripts (package.json)

- `dev`: `ts-node-dev --respawn --transpile-only src/main.ts`
- `build`: `tsc`
- `start`: `node dist/main.js`
- `lint`: `eslint src/**/*.ts --fix`
- `docker:up`: `docker-compose up -d`
- `docker:down`: `docker-compose down`

## 📄 Licença

ISC
