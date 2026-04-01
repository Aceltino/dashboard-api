import { z } from "zod";

const amountPreprocess = z.preprocess((value) => {
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
}, z.number().positive("amount must be greater than 0"));

const statusSchema = z.enum(["pending", "completed", "failed", "cancelled"]);

export const transactionBodySchema = z
  .object({
    category: z.string().trim().min(1, "category is required"),
    amount: amountPreprocess,
    status: statusSchema,
  })
  .strict();

export type TransactionBody = z.infer<typeof transactionBodySchema>;
