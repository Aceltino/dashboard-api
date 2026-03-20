import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { logMessage } from "../../shared/utils/logger";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

logMessage(
  "src/infrastructure/database/prisma.ts",
  "Prisma client initialized",
);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
