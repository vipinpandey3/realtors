import { z } from "zod";

export const create_builder_schema = z.object({
  name: z.string().min(1),
  hq_location: z.string().optional(),
  established_year: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
});
