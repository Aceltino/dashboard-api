import { AppError } from "../../shared/errors/AppError";
import { DashboardRepository } from "../ports/dashboard.repository";
import { logMessage } from "../../shared/utils/logger";

export interface CategoryTotalResult {
  category: string;
  totalAmount: number;
}

export class GetCategoryTotalUseCase {
  constructor(private repository: DashboardRepository) {}

  async execute(category: string): Promise<CategoryTotalResult> {
    logMessage(
      "src/application/use-cases/get-category-total.use-case.ts",
      `execute called with category=${category}`,
    );

    const normalizedCategory = category?.trim();

    if (!normalizedCategory) {
      throw new AppError("Category is required", 400, "validation_error");
    }

    try {
      const totalAmount =
        await this.repository.getCategoryTotal(normalizedCategory);
      return {
        category: normalizedCategory,
        totalAmount: Number(totalAmount.toFixed(2)),
      };
    } catch (error) {
      throw new AppError(
        "Unable to calculate category total",
        500,
        "db_error",
        { originalError: error },
      );
    }
  }
}
