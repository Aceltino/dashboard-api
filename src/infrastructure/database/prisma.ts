import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada em .env');
}

// O segredo: Trocar 'mysql://' por 'mariadb://' apenas para o driver nativo
const connectionString = process.env.DATABASE_URL.replace('mysql://', 'mariadb://');

// 1. Cria o pool de conexões usando a string corrigida
const pool = mariadb.createPool(connectionString);

// 2. Cria o adaptador oficial
const adapter = new PrismaMariaDb(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;