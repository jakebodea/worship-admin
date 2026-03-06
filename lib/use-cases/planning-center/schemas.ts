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

const optionalText = z.string().trim().optional();
const optionalNullableId = z.string().trim().min(1).nullish();

export const planItemsQuerySchema = z.object({
  service_type_id: requiredId,
  plan_id: requiredId,
});

export const createPlanItemBodySchema = z.object({
  service_type_id: requiredId,
  plan_id: requiredId,
  title: optionalText,
  item_type: z.enum(["song", "header", "item"]).optional(),
  service_position: z.enum(["pre", "during", "post"]).optional(),
  length: z.number().int().nonnegative().nullable().optional(),
  description: optionalText,
  html_details: optionalText,
  song_id: optionalNullableId,
  arrangement_id: optionalNullableId,
  key_id: optionalNullableId,
  selected_layout_id: optionalNullableId,
  custom_arrangement_sequence: z.array(z.string().trim().min(1)).optional(),
});

export const updatePlanItemBodySchema = z.object({
  service_type_id: requiredId,
  plan_id: requiredId,
  title: optionalText,
  service_position: z.enum(["pre", "during", "post"]).optional(),
  length: z.number().int().nonnegative().nullable().optional(),
  description: optionalText,
  html_details: optionalText,
  song_id: optionalNullableId,
  arrangement_id: optionalNullableId,
  key_id: optionalNullableId,
  selected_layout_id: optionalNullableId,
  custom_arrangement_sequence: z.array(z.string().trim().min(1)).optional(),
});

export const deletePlanItemBodySchema = z.object({
  service_type_id: requiredId,
  plan_id: requiredId,
});

export const reorderPlanItemsBodySchema = z.object({
  service_type_id: requiredId,
  plan_id: requiredId,
  sequence: z.array(requiredId).min(1),
});

export const songSearchQuerySchema = z.object({
  service_type_id: requiredId,
  q: z.string().trim().min(1),
});

export const songOptionsQuerySchema = z.object({
  service_type_id: requiredId,
});
