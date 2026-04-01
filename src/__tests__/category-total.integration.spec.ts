import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../server";
import { prisma } from "../infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

describe("Integration: GET /dashboard/category-total/:category", () => {
  beforeEach(() => {
    vi.spyOn(prisma, "$executeRawUnsafe").mockResolvedValue(undefined as any);
    vi.spyOn(prisma, "$queryRawUnsafe").mockResolvedValue([
      { total: new Prisma.Decimal(1234.56) },
    ] as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return category total successfully", async () => {
    const response = await request(app).get(
      "/dashboard/category-total/Software",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          category: "Software",
          totalAmount: 1234.56,
        }),
      }),
    );
  });

  it("should return 400 when category is blank", async () => {
    const response = await request(app).get("/dashboard/category-total/%20");

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({ success: false }));
  });
});
