import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma";
import {
  CreateTransactionInput,
  DashboardRepository,
  TransactionEntity,
} from "../../application/ports/dashboard.repository";
import { logMessage } from "../../shared/utils/logger";

export class PrismaDashboardRepository implements DashboardRepository {
  async findTransactions(start: Date, end: Date): Promise<TransactionEntity[]> {
    logMessage(
      "src/infrastructure/repositories/prisma-dashboard.repository.ts",
      `findTransactions from ${start.toISOString()} to ${end.toISOString()}`,
    );
    const rows = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return rows.map((row) => ({
      id: row.id,
      category: row.category,
      amount: Number(row.amount),
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  async createTransaction(
    data: CreateTransactionInput,
  ): Promise<TransactionEntity> {
    logMessage(
      "src/infrastructure/repositories/prisma-dashboard.repository.ts",
      `createTransaction called with data=${JSON.stringify(data)}`,
    );

    const row = await prisma.transaction.create({
      data: {
        category: data.category,
        amount: new Prisma.Decimal(data.amount),
        status: data.status,
      },
    });

    return {
      id: row.id,
      category: row.category,
      amount: Number(row.amount),
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async getCategoryTotal(category: string): Promise<number> {
    logMessage(
      "src/infrastructure/repositories/prisma-dashboard.repository.ts",
      `getCategoryTotal called with category=${category}`,
    );

    const rows = await prisma.$queryRawUnsafe<Array<{ total: number | null }>>(
      `SELECT IFNULL(SUM(amount), 0) AS total FROM transactions WHERE category = ?`,
      category,
    );

    const result = Array.isArray(rows) ? rows[0] : rows;
    const total = result?.total;

    return total !== null && total !== undefined ? Number(total) : 0;
  }
}
