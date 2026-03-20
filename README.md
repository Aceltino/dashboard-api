# 📊 Dashboard API (Senior Test Case)

API RESTful dinâmica para dashboards, desenvolvida com **Node.js 20**, **TypeScript 5**, **Prisma ORM** e **MySQL 8**.

## 🚀 Como Executar (Quick Start)

A maneira mais rápida e segura de rodar o projeto é via **Docker**, que já configura o banco de dados e a rede automaticamente.

### 1. Configuração do Ambiente
```bash
# Clone o repositório
git clone <seu-repo-url>
cd dashboard-api

# Configure as variáveis de ambiente (Já otimizadas para Docker)
cp .env.example .env
```

### 2. Subir Containers
```bash
docker compose up --build -d
```

### 3. Popular o Banco de Dados (Seed)
**Importante:** Devido à arquitetura Clean e build do TypeScript, o comando de seed deve ser executado apontando para os arquivos compilados:
```bash
docker exec -it dashboard_api_app pnpm seed
```

---

## 🏗️ Arquitetura e Decisões Técnicas

O projeto segue os princípios de **Clean Architecture** e **SOLID**:
- **Domain:** Entidades de negócio e interfaces de repositórios.
- **Application:** Casos de uso (Use Cases) que contêm a lógica de agregação do dashboard.
- **Infrastructure:** Implementações de banco de dados (Prisma/MariaDB Adapter), rotas e controllers.
- **Resiliência:** Implementada lógica de "Auto-Swap" para datas invertidas (se `from > to`).
- **Linguagem Única:** Todo o código, logs e documentação seguem o padrão **English-only**.



## 🛠️ Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `pnpm dev` | Executa em modo desenvolvimento com `ts-node-dev`. |
| `pnpm build` | Compila o TypeScript para a pasta `/dist`. |
| `pnpm start` | Inicia o servidor usando os arquivos compilados (`dist/src/main.js`). |
| `pnpm seed` | Popula o banco com transações de teste (via `dist/prisma/seed.js`). |
| `pnpm test` | Executa a suíte de testes unitários e integração com **Vitest**. |

---

## 📡 Endpoints Principais

### `GET /api/dashboard`
Retorna dados agregados filtrados por período e tipo de visualização.

**Query Parameters:**
- `type`: `pie` | `line` | `bar`
- `from`: Data de início (Ex: `2024-01-01`)
- `to`: Data de fim (Ex: `2026-12-31`)

**Exemplo de Chamada:**
`GET http://localhost:3000/api/dashboard?type=pie&from=2024-01-01&to=2026-12-31`

### `GET /api-docs`
Interface **Swagger UI** completa para exploração da API e schemas de dados.

---

## 🧪 Qualidade de Código (Testes)

Os testes foram desenhados para cobrir falhas comuns de lógica e integração:
- **Unitários:** Validação de formato de datas e cálculo de agregação.
- **Integração:** Validação do fluxo completo `Request -> Controller -> Use Case -> DB Mock`.

Para rodar os testes dentro do ambiente isolado do Docker:
```bash
docker exec -it dashboard_api_app pnpm test
```

---

## 📝 Notas de Implementação (Docker)
- O projeto utiliza **Multi-stage Build** no `Dockerfile` para garantir uma imagem final leve e segura.
- Foi utilizado o `@prisma/adapter-mariadb` para compatibilidade total com o Driver Nativo dentro de containers Linux Alpine.
- Os logs da aplicação seguem o formato: `[TIMESTAMP] [FILE:LINE] MESSAGE`.

---