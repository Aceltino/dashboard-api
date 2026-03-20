import { Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { GetDashboardDataUseCase } from '../../../application/use-cases/get-dashboard-data.use-case';

const dashboardSchema = z.object({
  type: z.enum(['pie', 'line', 'bar']),
  from: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'from must be a valid ISO-8601 date',
  }),
  to: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'to must be a valid ISO-8601 date',
  }),
});

export class DashboardController {
  private useCase = new GetDashboardDataUseCase();

  async handle(req: Request, res: Response) {
    const parseResult = dashboardSchema.safeParse(req.query);

    if (!parseResult.success) {
      throw new AppError(
        `Invalid query parameters: ${parseResult.error.issues.map((issue) => issue.message).join(', ')}`,
        400
      );
    }

    const { type, from, to } = parseResult.data;

    const startDate = new Date(from);
    const endDate = new Date(to);

    if (startDate > endDate) {
      throw new AppError('from date must be earlier or equal to to date', 400);
    }

    const dashboardData = await this.useCase.execute({ type, startDate: from, endDate: to });

    return res.status(200).json({
      success: true,
      type,
      period: { from, to },
      data: dashboardData.data,
    });
  }
}
