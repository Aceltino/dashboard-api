import { Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { ApiResponse } from "../../../shared/http/ApiResponse";
import { GetDashboardDataUseCase } from "../../../application/use-cases/get-dashboard-data.use-case";
import { PrismaDashboardRepository } from "../../repositories/prisma-dashboard.repository";
import {
  dashboardParamsSchema,
  formatIsoDate,
  isValidIsoDate,
} from "../../../shared/validators/dashboard.validator";
import { logMessage } from "../../../shared/utils/logger";

export class DashboardController {
  private useCase: GetDashboardDataUseCase;

  constructor(private repository = new PrismaDashboardRepository()) {
    this.useCase = new GetDashboardDataUseCase(this.repository);
  }

  async handle(req: Request, res: Response) {
    logMessage(
      "src/infrastructure/http/controllers/dashboard.controller.ts",
      `handle called with query=${JSON.stringify(req.query)}`,
    );
    const parseResult = dashboardParamsSchema.safeParse(req.query);

    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      logMessage(
        "src/infrastructure/http/controllers/dashboard.controller.ts",
        `validation failed: ${JSON.stringify(issues)}`,
      );
      throw new AppError("Invalid query parameters", 400, "validation_error", {
        issues,
      });
    }

    const { type, from, to } = parseResult.data;

    const now = new Date();
    const defaultTo = formatIsoDate(now);
    const defaultFrom = formatIsoDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    );

    const rawFrom = from || defaultFrom;
    const rawTo = to || defaultTo;

    if (!isValidIsoDate(rawFrom) || !isValidIsoDate(rawTo)) {
      throw new AppError(
        "Invalid date format (YYYY-MM-DD expected)",
        400,
        "validation_error",
      );
    }

    let startDate = rawFrom;
    let endDate = rawTo;

    if (new Date(startDate) > new Date(endDate)) {
      [startDate, endDate] = [endDate, startDate];
    }

    const dashboardData = await this.useCase.execute({
      type,
      startDate,
      endDate,
    });

    const hasData =
      Array.isArray(dashboardData.data) && dashboardData.data.length > 0;
    const responseMessage = hasData
      ? "Dashboard data fetched successfully"
      : "No dashboard data found for the selected period";

    const totalAmount =
      typeof dashboardData.totalAmount === "number"
        ? dashboardData.totalAmount
        : (dashboardData.data || []).reduce(
            (sum, item: { value: number }) => sum + Number(item.value || 0),
            0,
          );

    return res.status(200).json(
      ApiResponse.success(
        {
          type,
          period: { from: startDate, to: endDate },
          data: dashboardData.data,
          totalAmount: Number(totalAmount.toFixed(2)),
        },
        responseMessage,
      ),
    );
  }
}
