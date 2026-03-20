# Use Node.js LTS for builds
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency definitions and install dependencies
COPY package.json pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# Copy source code and Prisma schema
COPY tsconfig.json .
COPY swagger.json .
COPY prisma ./prisma
COPY src ./src

# Prisma client generation and TypeScript build
RUN pnpm prisma generate
RUN pnpm build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

# Ativa corepack para ter pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia apenas o necessário do build anterior
COPY --from=base /app/package.json /app/pnpm-lock.yaml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/swagger.json ./swagger.json
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

# Variáveis de ambiente
ENV NODE_ENV=production
EXPOSE 3000

# Use o node direto para evitar overhead de pnpm em prod
CMD sh -c "npx prisma migrate deploy && node dist/src/main.js"