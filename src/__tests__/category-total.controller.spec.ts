import { describe, expect, it, vi } from "vitest";
import { CategoryTotalController } from "../infrastructure/http/controllers/category-total.controller";
import { Request, Response } from "express";

vi.mock("../application/use-cases/get-category-total.use-case", () => {
  return {
    GetCategoryTotalUseCase: class {
      execute = vi.fn().mockResolvedValue({
        category: "Software",
        totalAmount: 123.45,
      });
    },
  };
});

describe("CategoryTotalController", () => {
  const createMockRes = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
  };

  it("should return 200 with category total for a valid category", async () => {
    const controller = new CategoryTotalController();
    const req = { params: { category: "Software" } } as unknown as Request;
    const res = createMockRes();

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          category: "Software",
          totalAmount: 123.45,
        }),
      }),
    );
  });

  it("should throw validation error when category is blank", async () => {
    const controller = new CategoryTotalController();
    const req = { params: { category: " " } } as unknown as Request;
    const res = createMockRes();

    await expect(controller.handle(req, res)).rejects.toThrow();
  });
});
