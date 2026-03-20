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

## � Endpoints disponíveis

### GET /healthz

- resposta: `200`
- corpo: `{ "success": true, "message": "OK" }`

### GET /dashboard

Query params:
- `type` (required): `pie | line | bar`
- `from` (required): `YYYY-MM-DD`
- `to` (required): `YYYY-MM-DD`

Exemplo:

```http
GET /dashboard?type=pie&from=2026-01-01&to=2026-01-31
```

Formato de resposta 200:

```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": {
    "type": "pie",
    "period": {
      "from": "2026-01-01",
      "to": "2026-01-31"
    },
    "data": [
      { "label": "Software", "value": 100.0 },
      { "label": "Hardware", "value": 200.0 }
    ]
  }
}
```

Erros:
- 400: validação inválida (`validation_error`)
- 500: erro interno (`internal_error`)

### GET /api-docs

- URL de interface Swagger UI para documentação interativa.

## 🧪 Testes

Executar:

```bash
pnpm test
```

Testes implementados:
- `src/__tests__/dashboard.controller.spec.ts` (unit)
- `src/__tests__/dashboard.integration.spec.ts` (integração, DB isolado via mock)

## ✅ Estado atual

- validação com Zod: `src/shared/validators/dashboard.validator.ts`
- middleware de erro com retorno padronizado: `src/shared/middlewares/errorMiddleware.ts`
- modelo de resposta padrão: `src/shared/http/ApiResponse.ts`
- endpoint de saúde de serviço: `GET /healthz`
- documentaçãoOpenAPI: `GET /api-docs`
- `AppError` customizado de negócios
- integração via supertest + mocks

---

## 📦 Scripts (package.json)

- `dev`: `ts-node-dev --respawn --transpile-only src/main.ts`
- `build`: `tsc`
- `start`: `node dist/main.js`
- `test`: `vitest run --globals --environment node`
- `lint`: `eslint . --ext .ts --fix`
- `docker:up`: `docker-compose up -d`
- `docker:down`: `docker-compose down`

## 📄 Licença

ISC

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

## � Deploy e CI/CD

1. Configure as variáveis de ambiente locais a partir de `.env.example`.
2. Certifique-se de não subir `.env` ao GitHub (já está em `.gitignore`).
3. Pipeline configurado em `.github/workflows/ci.yml`:
   - lint
   - test
   - prisma generate
   - build
   - (opcional) docker build/push se `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` estiverem definidas

### GitHub repository

```bash
# inicializar repositório local (se ainda não estiver)
git init
git add .
git commit -m "chore: inicial commit"

# conectar ao remote GitHub
git remote add origin git@github.com:<seu-usuario>/dashboard-api.git

# criar a branch principal e subir
git branch -M main
git push -u origin main
```

### Como criar release sem segredos no código

- Evite hardcode de credenciais no código fonte.
- use `.env` local ou secrets do GitHub Actions.
- mantenha `DATABASE_URL` só em runtime (env var), nunca com valor real em código.

### Docker em produção

- `docker-compose up -d` roda MySQL + Adminer + API.
- `docker-compose down` abaixo.
- `Dockerfile` faz build multi-stage e executa `node dist/main.js`.

## �📄 Licença

ISC
