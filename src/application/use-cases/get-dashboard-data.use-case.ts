import { prisma } from "../../infrastructure/database/prisma";
import { AppError } from "../../shared/errors/AppError";

export type ChartType = 'pie' | 'line' | 'bar';

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
}

export class GetDashboardDataUseCase {
  async execute(filter: DashboardFilter): Promise<DashboardResult> {
    let items;
    try {
      items = await prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: new Date(filter.startDate),
            lte: new Date(filter.endDate),
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (err) {
      throw new AppError('Database connection timeout', 503, 'db_unavailable', {
        originalError: err,
      });
    }

    if (filter.type === 'line') {
      const grouped = items.reduce<Record<string, number>>((acc, item) => {
        const dateKey = item.createdAt.toISOString().split('T')[0];
        const amount = Number(item.amount);
        acc[dateKey] = (acc[dateKey] ?? 0) + amount;
        return acc;
      }, {});

      const data = Object.keys(grouped)
        .sort()
        .map((date) => ({ date, value: Number(grouped[date].toFixed(2)) }));

      return { type: 'line', data };
    }

    const groupedByCategory = items.reduce<Record<string, number>>((acc, item) => {
      const amount = Number(item.amount);
      acc[item.category] = (acc[item.category] ?? 0) + amount;
      return acc;
    }, {});

    const data = Object.entries(groupedByCategory).map(([label, value]) => ({
      label,
      value: Number(value.toFixed(2)),
    }));

    return { type: filter.type, data };
  }
}
