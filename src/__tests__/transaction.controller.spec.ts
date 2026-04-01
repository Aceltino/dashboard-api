import { describe, it, expect, vi } from "vitest";
import { TransactionController } from "../infrastructure/http/controllers/transaction.controller";
import { Request, Response } from "express";

vi.mock("../application/use-cases/create-transaction.use-case", () => {
  return {
    CreateTransactionUseCase: class {
      execute = vi.fn().mockResolvedValue({
        id: 1,
        category: "Software",
        amount: 100,
        status: "completed",
        createdAt: new Date("2026-04-01T12:00:00.000Z"),
        updatedAt: new Date("2026-04-01T12:00:00.000Z"),
      });
    },
  };
});

describe("TransactionController", () => {
  const createMockRes = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
  };

  it("should return 400 when payload is invalid", async () => {
    const controller = new TransactionController();
    const req = {
      body: { category: "", amount: -10, status: "" },
    } as unknown as Request;
    const res = createMockRes();

    await expect(controller.handle(req, res)).rejects.toThrow();
  });

  it("should create transaction when payload is valid", async () => {
    const controller = new TransactionController();
    const req = {
      body: { category: "Software", amount: 100, status: "completed" },
    } as unknown as Request;
    const res = createMockRes();

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          category: "Software",
          amount: 100,
          status: "completed",
        }),
      }),
    );
  });
});
