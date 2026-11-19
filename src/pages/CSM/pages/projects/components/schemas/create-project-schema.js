import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be at most 20 characters")
    .regex(/^[a-zA-Z0-9\s]+$/, "Name must be alphanumeric"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(70, "Description must be at most 70 characters"),
});
