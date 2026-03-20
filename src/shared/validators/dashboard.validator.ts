import { z } from 'zod';

export const dashboardParamsSchema = z.object({
  type: z.enum(['pie', 'line', 'bar']),
  from: z.string()/* .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'from must be a valid ISO-8601 date',
  }) */.date(),
  to: z.string()/* .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'to must be a valid ISO-8601 date',
  }) */.date(),
});

export type DashboardParams = z.infer<typeof dashboardParamsSchema>;
