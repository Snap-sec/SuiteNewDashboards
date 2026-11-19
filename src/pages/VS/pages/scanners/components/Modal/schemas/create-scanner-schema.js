import { z } from "zod";

export const createScannerSchema = z.object({
  name: z
    .string()
    .min(1, "Scanner name is required")
    .max(20, "Scanner name must be less than 20 characters")
    .regex(/^[a-zA-Z0-9 ]+$/, "Scanner name must only contain alphanumeric characters"),
  ip: z
    .string()
    .min(1, "Scanner URL is required")
    .url("Invalid URL format (e.g., https://example.com)"),
});
