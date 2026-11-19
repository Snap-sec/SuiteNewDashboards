import { z } from "zod";

export const createAssessmentSchema = z.object({
  name: z
    .string()
    .min(1, "Assessment name is required")
    .max(35, "Assessment name must be less than 35 characters"),
  category: z
    .string()
    .min(1, "Category is required"),
  departmentIds: z
    .array(z.any())
    .default([]),
});
