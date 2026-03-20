import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(value: string): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!isoDateRegex.test(trimmed)) return false;
  const parsed = Date.parse(trimmed);
  return !Number.isNaN(parsed);
}

export function formatIsoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const dashboardParamsSchema = z
  .object({
    type: z.enum(["pie", "line", "bar"]),
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.from && !isValidIsoDate(data.from)) {
      ctx.addIssue({
        path: ["from"],
        code: z.ZodIssueCode.custom,
        message: "from must be a valid ISO-8601 date (YYYY-MM-DD)",
      });
    }

    if (data.to && !isValidIsoDate(data.to)) {
      ctx.addIssue({
        path: ["to"],
        code: z.ZodIssueCode.custom,
        message: "to must be a valid ISO-8601 date (YYYY-MM-DD)",
      });
    }
  });

export type DashboardParams = z.infer<typeof dashboardParamsSchema>;
