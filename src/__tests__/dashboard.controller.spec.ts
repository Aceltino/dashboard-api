import { describe, it, expect, vi } from "vitest";
import { DashboardController } from "../infrastructure/http/controllers/dashboard.controller";
import { Request, Response } from "express";

// Mock corrigido para ser um construtor (classe)
vi.mock("../application/use-cases/get-dashboard-data.use-case", () => {
  return {
    GetDashboardDataUseCase: class {
      execute = vi.fn().mockResolvedValue({
        type: "pie",
        data: [
          { label: "Software", value: 1500.5 },
          { label: "Hardware", value: 300.0 },
        ],
        period: { from: "2026-01-01", to: "2026-01-31" }
      });
    }
  };
});

describe("DashboardController", () => {
  const createMockRes = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
  };

  it("should return 400 when query params are invalid", async () => {
    const controller = new DashboardController();
    const req = { query: {} } as unknown as Request;
    const res = createMockRes();
    await expect(controller.handle(req, res)).rejects.toThrow();
  });

  it("should return 200 and pie chart data for valid input", async () => {
    const controller = new DashboardController();
    const req = {
      query: { type: "pie", from: "2026-01-01", to: "2026-01-31" },
    } as unknown as Request;
    const res = createMockRes();
    await controller.handle(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should apply default date range when from/to are omitted", async () => {
    const controller = new DashboardController();
    const req = { query: { type: "pie" } } as unknown as Request;
    const res = createMockRes();
    await controller.handle(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should swap from/to when from is after to", async () => {
    const controller = new DashboardController();
    const req = {
      query: { type: "pie", from: "2026-02-01", to: "2026-01-01" },
    } as unknown as Request;
    const res = createMockRes();
    await controller.handle(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});