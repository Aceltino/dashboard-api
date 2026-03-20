import { describe, it, expect, vi } from "vitest";
import { DashboardController } from "../infrastructure/http/controllers/dashboard.controller";

vi.mock("../application/use-cases/get-dashboard-data.use-case", () => {
  class GetDashboardDataUseCase {
    execute = vi.fn(async () => ({
      type: "pie",
      data: [
        { label: "Software", value: 1500.5 },
        { label: "Hardware", value: 300.0 },
      ],
    }));
  }

  return { GetDashboardDataUseCase };
});

describe("DashboardController", () => {
  it("should return 400 when query params are invalid", async () => {
    const controller = new DashboardController();
    const req = { query: {} } as unknown as { query: Record<string, string> };
    const status = vi.fn(() => ({ json: vi.fn() }));
    const res = { status } as unknown as {
      status(code: number): { json(body: unknown): unknown };
    };

    await expect(controller.handle(req, res)).rejects.toThrow();
  });

  it("should return 200 and pie chart data for valid input", async () => {
    const controller = new DashboardController();
    const req = {
      query: { type: "pie", from: "2026-01-01", to: "2026-01-31" },
    } as unknown as { query: { type: string; from: string; to: string } };

    let jsonResponse: unknown;
    const res = {
      status: vi.fn((_code: number) => ({
        json: (payload: unknown) => {
          jsonResponse = payload;
          return payload;
        },
      })),
    } as unknown as { status(_code: number): { json(body: unknown): unknown } };

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonResponse).toMatchObject({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        type: "pie",
        period: { from: "2026-01-01", to: "2026-01-31" },
        data: expect.any(Array),
        totalAmount: expect.any(Number),
      },
    });
  });

  it("should return 400 for invalid date format", async () => {
    const controller = new DashboardController();
    const req = {
      query: { type: "pie", from: "2026-01-01", to: "2026-01" },
    } as unknown as { query: { type: string; from: string; to: string } };
    const status = vi.fn(() => ({ json: vi.fn() }));
    const res = { status } as unknown as {
      status(_code: number): { json(body: unknown): unknown };
    };

    await expect(controller.handle(req, res)).rejects.toThrow();
    expect(status).not.toHaveBeenCalledWith(200);
  });

  it("should apply default date range when from/to are omitted", async () => {
    const controller = new DashboardController();
    const req = { query: { type: "pie" } } as unknown as {
      query: { type: string };
    };

    let jsonResponse: unknown;
    const res = {
      status: vi.fn((_code: number) => ({
        json: (payload: unknown) => {
          jsonResponse = payload;
          return payload;
        },
      })),
    } as unknown as { status(_code: number): { json(body: unknown): unknown } };

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonResponse.data.period.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(jsonResponse.data.period.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should swap from/to when from is after to", async () => {
    const controller = new DashboardController();
    const req = {
      query: { type: "pie", from: "2026-02-01", to: "2026-01-01" },
    } as unknown as { query: { type: string; from: string; to: string } };

    let jsonResponse: unknown;
    const res = {
      status: vi.fn((_code: number) => ({
        json: (payload: unknown) => {
          jsonResponse = payload;
          return payload;
        },
      })),
    } as unknown as { status(_code: number): { json(body: unknown): unknown } };

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonResponse.data.period.from).toBe("2026-01-01");
    expect(jsonResponse.data.period.to).toBe("2026-02-01");
  });
});
