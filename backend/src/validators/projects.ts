import { z } from "zod";

export const create_project_schema = z.object({
  builder_id: z.number().int(),
  name: z.string().min(1),
  location: z.string().min(1),
  price_range: z.string().optional(),
  price_min_inr: z.number().int().nonnegative().optional(),
  price_max_inr: z.number().int().nonnegative().optional(),
  status: z
    .enum(["Ongoing", "Ready to Move", "Completed", "Paused"])
    .optional(),
});

export const list_projects_query_schema = z.object({
  location: z.string().optional(),
  builder_name: z.string().optional(),
  status: z
    .enum(["Ongoing", "Ready to Move", "Completed", "Paused"])
    .optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
  sort_by: z.enum(["price_min", "established_year"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional().default("asc"),
});
