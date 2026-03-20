import { Request, Response } from 'express';
import { AppError } from '../../../shared/errors/AppError';
import { ApiResponse } from '../../../shared/http/ApiResponse';
import { GetDashboardDataUseCase } from '../../../application/use-cases/get-dashboard-data.use-case';
import { dashboardParamsSchema } from '../../../shared/validators/dashboard.validator';

export class DashboardController {
  private useCase = new GetDashboardDataUseCase();

  async handle(req: Request, res: Response) {
    const parseResult = dashboardParamsSchema.safeParse(req.query);

    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
      throw new AppError('Invalid query parameters', 400, 'validation_error', { issues });
    }

    const { type, from, to } = parseResult.data;
    const startDate = new Date(from);
    const endDate = new Date(to);

    if (startDate > endDate) {
      throw new AppError('from date must be earlier or equal to to date', 400, 'validation_error', {
        details: { from, to },
      });
    }

    const dashboardData = await this.useCase.execute({ type, startDate: from, endDate: to });

    return res.status(200).json(
      ApiResponse.success(
        {
          type,
          period: { from, to },
          data: dashboardData.data,
        },
        'Dashboard data fetched successfully'
      )
    );
  }
}

