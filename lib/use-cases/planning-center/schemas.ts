import { z } from "zod";

const requiredId = z.string().trim().min(1);

export const plansQuerySchema = z.object({
  service_type_id: requiredId,
});

export const serviceTypeQuerySchema = z.object({
  service_type_id: requiredId,
});

export const peopleQuerySchema = z.object({
  service_type_id: requiredId,
  position_id: requiredId,
  team_id: z.string().trim().min(1).optional(),
  plan_id: z.string().trim().min(1).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export const personIdParamsSchema = z.object({
  id: requiredId,
});

export const scheduleHistoryQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).default(90),
});
