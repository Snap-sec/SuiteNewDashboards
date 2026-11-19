import { z } from "zod";

export const createDashboardSchema = z.object({
  name: z
    .string()
    .min(1, "Dashboard name is required")
    .max(100, "Dashboard name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9 ]+$/, "Dashboard name must only contain alphanumeric characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  assessmentIds: z
    .array(z.union([z.string(), z.object({ id: z.string(), label: z.string() })]))
    .min(1, "At least one project must be selected"),
  isPrivate: z.boolean().default(true),
});
