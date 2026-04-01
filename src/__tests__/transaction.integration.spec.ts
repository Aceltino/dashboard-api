import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../server";
import { prisma } from "../infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

describe("Integration: POST /transactions", () => {
  beforeEach(() => {
    vi.spyOn(prisma.transaction, "create").mockResolvedValue({
      id: 1,
      category: "Software",
      amount: new Prisma.Decimal(123.45),
      status: "completed",
      createdAt: new Date("2026-04-01T12:00:00.000Z"),
      updatedAt: new Date("2026-04-01T12:00:00.000Z"),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a transaction successfully", async () => {
    const response = await request(app)
      .post("/transactions")
      .send({ category: "Software", amount: 123.45, status: "completed" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          category: "Software",
          amount: 123.45,
          status: "completed",
        }),
      }),
    );
  });

  it("should return 400 when payload validation fails", async () => {
    const response = await request(app)
      .post("/transactions")
      .send({ category: "", amount: -10, status: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({ success: false }));
  });
});
