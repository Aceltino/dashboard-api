import { Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { ApiResponse } from "../../../shared/http/ApiResponse";
import { GetCategoryTotalUseCase } from "../../../application/use-cases/get-category-total.use-case";
import { PrismaDashboardRepository } from "../../repositories/prisma-dashboard.repository";
import { categoryParamSchema } from "../../../shared/validators/dashboard.validator";
import { logMessage } from "../../../shared/utils/logger";

export class CategoryTotalController {
  private useCase: GetCategoryTotalUseCase;

  constructor(private repository = new PrismaDashboardRepository()) {
    this.useCase = new GetCategoryTotalUseCase(this.repository);
  }

  async handle(req: Request, res: Response) {
    logMessage(
      "src/infrastructure/http/controllers/category-total.controller.ts",
      `handle called with params=${JSON.stringify(req.params)}`,
    );

    const parseResult = categoryParamSchema.safeParse(req.params);

    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      logMessage(
        "src/infrastructure/http/controllers/category-total.controller.ts",
        `validation failed: ${JSON.stringify(issues)}`,
      );

      throw new AppError(
        "Invalid category parameter",
        400,
        "validation_error",
        {
          issues,
        },
      );
    }

    const result = await this.useCase.execute(parseResult.data.category);

    return res
      .status(200)
      .json(ApiResponse.success(result, "Category total fetched successfully"));
  }
}
