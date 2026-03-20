import { prisma } from "../database/prisma";
import {
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
}
