import { z } from "zod";

export const createEnvironmentSchema = z.object({
  name: z
    .string()
    .min(1, "Environment name is required")
    .max(20, "Environment name must be less than 20 characters")
    .regex(/^[a-zA-Z0-9 ]+$/, "Environment name must only contain alphanumeric characters"),
});
