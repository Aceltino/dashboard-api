import { AppError } from "../../shared/errors/AppError";
import { DashboardRepository } from "../ports/dashboard.repository";
import { logMessage } from "../../shared/utils/logger";

export type ChartType = "pie" | "line" | "bar";

export interface DashboardFilter {
  type: ChartType;
  startDate: string;
  endDate: string;
}

export interface DashboardChartEntry {
  label: string;
  value: number;
}

export interface DashboardLineEntry {
  date: string;
  value: number;
}

export interface DashboardResult {
  type: ChartType;
  data: DashboardChartEntry[] | DashboardLineEntry[];
  totalAmount: number;
}

export class GetDashboardDataUseCase {
  constructor(private repository: DashboardRepository) {}

  async execute(filter: DashboardFilter): Promise<DashboardResult> {
    logMessage(
      "src/application/use-cases/get-dashboard-data.use-case.ts",
      `execute called filter=${JSON.stringify(filter)}`,
    );
    const start = new Date(`${filter.startDate}T00:00:00.000Z`);
    const end = new Date(`${filter.endDate}T23:59:59.999Z`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new AppError(
        "Invalid date range passed to use case",
        400,
        "validation_error",
        {
          details: { startDate: filter.startDate, endDate: filter.endDate },
        },
      );
    }

    let safeItems: Array<{
      id: number;
      category: string;
      amount: number;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }> = [];
    try {
      safeItems = await this.repository.findTransactions(start, end);
    } catch (err) {
      throw new AppError("Database connection timeout", 503, "db_unavailable", {
        originalError: err,
      });
    }

    if (!Array.isArray(safeItems)) {
      safeItems = [];
    }

    if (safeItems.length === 0) {
      return { type: filter.type, data: [], totalAmount: 0 };
    }

    if (filter.type === "line") {
      const grouped = safeItems.reduce<Record<string, number>>((acc, item) => {
        const dateKey = item.createdAt.toISOString().split("T")[0];
        const amount = Number(item.amount ?? 0);
        acc[dateKey] = (acc[dateKey] ?? 0) + amount;
        return acc;
      }, {});

      const data = Object.keys(grouped)
        .sort()
        .map((date) => ({ date, value: Number(grouped[date].toFixed(2)) }));

      const totalAmount = Object.values(grouped).reduce(
        (sum, value) => sum + value,
        0,
      );
      return {
        type: "line",
        data,
        totalAmount: Number(totalAmount.toFixed(2)),
      };
    }

    const groupedByCategory = safeItems.reduce<Record<string, number>>(
      (acc, item) => {
        const category = item.category ?? "undefined";
        const amount = Number(item.amount ?? 0);
        acc[category] = (acc[category] ?? 0) + amount;
        return acc;
      },
      {},
    );

    const data = Object.entries(groupedByCategory).map(([label, value]) => ({
      label,
      value: Number(value.toFixed(2)),
    }));

    const totalAmount = Object.values(groupedByCategory).reduce(
      (sum, value) => sum + value,
      0,
    );
    return {
      type: filter.type,
      data,
      totalAmount: Number(totalAmount.toFixed(2)),
    };
  }
}
