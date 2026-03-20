# 📊 Dashboard API (Senior Test Case)

A dynamic RESTful dashboard API built with Node.js 20, TypeScript 5, Prisma ORM, and MySQL 8.

## 🚀 Quick Start

The fastest way to run the project is via Docker (includes DB setup and networking).

### 1. Environment setup
```bash
# Clone repo
git clone <git@github.com:Aceltino/dashboard-api.git>
cd dashboard-api

# Copy example environment
touch .env
cp .env.example .env
```

### 2. Start containers
```bash
docker compose up --build -d
```

### 3. Seed database
```bash
docker exec -it dashboard_api_app pnpm seed
```

---

## 🏗️ Architecture and Design

The project follows Clean Architecture and SOLID principles:
- **Domain:** business entities and repository interfaces.
- **Application:** use cases containing dashboard aggregation logic.
- **Infrastructure:** database adapter (Prisma), routes & controllers.
- **Resilience:** auto-swap for date range (if `from > to`).
- **Single language:** code, logs, and docs in English.

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start in dev mode with `ts-node-dev`. |
| `pnpm build` | Compile TypeScript to `/dist`. |
| `pnpm start` | Run compiled app (`dist/src/main.js`). |
| `pnpm seed` | Populate DB (`dist/prisma/seed.js`). |
| `pnpm test` | Run tests with Vitest. |
| `pnpm lint` | Run ESLint and auto-fix. |

---

## 📡 Endpoints

### GET /dashboard
Return aggregated transactions for UI graphs.

Query parameters:
- `type`: `pie` | `line` | `bar` (required)
- `from`: `YYYY-MM-DD` (optional; default = 30 days ago)
- `to`: `YYYY-MM-DD` (optional; default = today)

### GET /healthz
Health check.

### GET /api-docs
Swagger UI docs.

---

## 🧩 Data model

Prisma model in `prisma/schema.prisma`:
- `Transaction` (id, category, amount, status, createdAt, updatedAt)

---

## 🧪 Testing

- Controller unit tests in `src/__tests__/dashboard.controller.spec.ts`.
- Integration tests in `src/__tests__/dashboard.integration.spec.ts`.
- Uses `supertest` + `Vitest`.

---

## ✅ Notes

- No DB triggers/procedures are implemented.
- Core logic is inside use case and business rules (controller orchestrates + validation).
- Error handling via custom `AppError` and `errorMiddleware`.
