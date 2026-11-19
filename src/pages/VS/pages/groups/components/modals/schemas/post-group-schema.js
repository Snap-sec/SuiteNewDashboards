import { z } from "zod";

export const postGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be less than 20 characters")
    .regex(/^[a-zA-Z0-9 ]+$/, "Name must only contain alphanumeric characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(35, "Description must be less than 35 characters"),
});
