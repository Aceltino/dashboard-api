import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../server";
import { prisma } from "../infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

// Tipagem correta para o mock sem usar any solto
const mockTransactions: Array<
  Prisma.TransactionGetPayload<Record<string, never>>
> = [
  {
    id: 1,
    category: "Software",
    amount: new Prisma.Decimal(100),
    status: "completed",
    createdAt: new Date("2026-01-10T00:00:00.000Z"),
    updatedAt: new Date("2026-01-10T00:00:00.000Z"),
  },
  {
    id: 2,
    category: "Hardware",
    amount: new Prisma.Decimal(200),
    status: "completed",
    createdAt: new Date("2026-01-15T00:00:00.000Z"),
    updatedAt: new Date("2026-01-15T00:00:00.000Z"),
  },
];

describe("Integration: /healthz and /dashboard", () => {
  beforeEach(() => {
    vi.spyOn(prisma.transaction, "findMany").mockResolvedValue(
      mockTransactions as any,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 on /healthz", async () => {
    const response = await request(app).get("/healthz");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, message: "OK" });
  });

  it("should return 200 on /dashboard with valid params", async () => {
    const response = await request(app)
      .get("/dashboard")
      .query({ type: "pie", from: "2026-01-01", to: "2026-01-31" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          type: "pie",
          data: expect.any(Array),
        }),
      }),
    );
  });

  it("should return 400 on /dashboard with invalid params", async () => {
    const response = await request(app)
      .get("/dashboard")
      .query({ type: "invalid", from: "2026-01-01", to: "2026-01-31" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({ success: false }));
  });

  it("should return 400 on /dashboard with invalid date format", async () => {
    const response = await request(app)
      .get("/dashboard")
      .query({ type: "pie", from: "2026-01-01", to: "2026-01" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({ success: false }));
  });
});
