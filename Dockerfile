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
COPY prisma ./prisma
COPY src ./src

# Prisma client generation and TypeScript build
RUN pnpm prisma generate
RUN pnpm build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile --prod

COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
