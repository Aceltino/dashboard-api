import { PrismaClient } from '@prisma/client';

// Garantir que temos apenas uma instância do Prisma Client
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], 
});