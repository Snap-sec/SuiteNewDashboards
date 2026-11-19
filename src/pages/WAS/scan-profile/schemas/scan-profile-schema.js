import { z } from "zod";

export const scanProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Profile name is required")
    .max(20, "Profile name must be less than 20 characters")
    .regex(/^[a-zA-Z0-9 ]+$/, "Profile name must only contain alphanumeric characters"),
  overrideHost: z
    .union([
      z.string().url("Invalid URL format"),
      z.literal("")
    ])
    .optional(),
  customHeaders: z.array(
    z.object({
      key: z
        .string()
        .regex(/^[a-zA-Z-]+$/, "Header name must only contain alphabets and hyphens"),
      value: z.string().min(1, "Header value is required")
    })
  ).optional(),
  ratelimitingConfig: z.object({
    requests_per_second: z
      .number({ invalid_type_error: "Rate limit must be a number" })
      .min(0, "Rate limit cannot be negative")
  })
});
