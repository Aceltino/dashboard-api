import { describe, it, expect, vi } from 'vitest';
import { DashboardController } from '../infrastructure/http/controllers/dashboard.controller';

vi.mock('../application/use-cases/get-dashboard-data.use-case', () => {
  class GetDashboardDataUseCase {
    execute = vi.fn(async () => ({
      type: 'pie',
      data: [
        { label: 'Software', value: 1500.5 },
        { label: 'Hardware', value: 300.0 },
      ],
    }));
  }

  return { GetDashboardDataUseCase };
});

describe('DashboardController', () => {
  it('should return 400 when query params are invalid', async () => {
    const controller = new DashboardController();
    const req = { query: {} } as any;
    const status = vi.fn(() => ({ json: vi.fn() }));
    const res = { status } as any;

    await expect(controller.handle(req, res)).rejects.toThrow();
  });

  it('should return 200 and pie chart data for valid input', async () => {
    const controller = new DashboardController();
    const req = { query: { type: 'pie', from: '2026-01-01', to: '2026-01-31' } } as any;

    let jsonResponse: any;
    const res = {
      status: vi.fn((code: number) => ({
        json: (payload: any) => {
          jsonResponse = payload;
          return payload;
        },
      })),
    } as any;

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonResponse).toMatchObject({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        type: 'pie',
        period: { from: '2026-01-01', to: '2026-01-31' },
        data: expect.any(Array),
      },
    });
  });
});
