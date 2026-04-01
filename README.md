# 📊 Dashboard API (Senior Test Case)

API RESTful para dashboard construída com Node.js 20, TypeScript 5, Prisma ORM e MySQL 8.

## 🚀 Inicialização

### 1. Clonar o repositório
```bash
git clone git@github.com:Aceltino/dashboard-api.git
cd dashboard-api
```

### 2. Instalar dependências
```bash
pnpm install
```

### 3. Escolher branch

Branches principais disponíveis:
- `main`: branch estável e principal.
- `feature/triggers-procedures`: branch de desenvolvimento com atualizações em triggers/procedures e ajustes de banco.

Use:
```bash
git checkout main
# ou
git checkout feature/triggers-procedures
```

Se a branch não existir localmente:
```bash
git fetch origin
git checkout -b feature/triggers-procedures origin/feature/triggers-procedures
```

### 4. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
Edite `.env` para apontar seu banco de dados MySQL:
- `DATABASE_URL` = `mysql://user:password@host:port/database`
- `PORT` = `3000`
- `NODE_ENV` = `development`

### 5. Gerar Prisma e migrar
```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

### 6. Executar com Docker
```bash
docker compose up --build -d
```

### 7. Popular o banco de dados
```bash
docker exec -it dashboard_api_app pnpm seed
```

> Alternativa local sem Docker:
> ```bash
> pnpm dev
> ```

---

## 🏗️ Arquitetura

Seguindo Clean Architecture e princípios SOLID:
- **Domain:** entidades de negócio e interfaces de repositório.
- **Application:** casos de uso para lógica de dashboard.
- **Infrastructure:** adaptação Prisma, rotas e controladores.
- **Shared:** validação, erros e middleware.

---

## 🛠️ Scripts disponíveis

| Comando | Descrição |
| :--- | :--- |
| `pnpm dev` | Inicia em modo de desenvolvimento com `ts-node-dev`. |
| `pnpm build` | Compila TypeScript para `dist`. |
| `pnpm start` | Executa a aplicação compilada (`dist/src/main.js`). |
| `pnpm seed` | Insere dados iniciais no banco (`dist/prisma/seed.js`). |
| `pnpm test` | Executa os testes com Vitest. |
| `pnpm lint` | Executa ESLint e corrige automaticamente. |
| `pnpm migrate:dev` | Cria uma migração de desenvolvimento. |
| `pnpm migrate:deploy` | Aplica migrações em produção. |
| `pnpm generate` | Gera o cliente Prisma. |
| `pnpm docker:up` | Sobe a stack Docker. |
| `pnpm docker:down` | Para a stack Docker. |

---

## 📡 Endpoints

### GET /dashboard
Retorna dados agregados de transações para gráficos.

Query parameters:
- `type`: `pie` | `line` | `bar` (obrigatório)
- `from`: `YYYY-MM-DD` (opcional; padrão = 30 dias atrás)
- `to`: `YYYY-MM-DD` (opcional; padrão = hoje)

### GET /healthz
Verifica se o serviço está saudável.

### GET /api-docs
Swagger UI com documentação da API.

---

## 🧩 Modelo de dados

Modelo Prisma em `prisma/schema.prisma`:
- `Transaction` (id, category, amount, status, createdAt, updatedAt)

---

## 🧪 Testes

- Testes unitários de controlador em `src/__tests__/dashboard.controller.spec.ts`.
- Testes de integração em `src/__tests__/dashboard.integration.spec.ts`.
- Usa `supertest` + `Vitest`.

---

## ✅ Observações

- O tratamento de erros usa `AppError` e `errorMiddleware`.
- A lógica principal está nos use cases e regras de negócio.
- A configuração de banco pode ser feita localmente ou via Docker.
