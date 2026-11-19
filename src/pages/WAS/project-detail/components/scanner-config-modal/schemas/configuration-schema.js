import { z } from "zod";

export const configurationSchema = z.object({
  targetUrl: z
    .string()
    .min(1, "Target URL is required")
    .url("Invalid URL format (e.g., https://example.com)"),
  inScopeUrls: z.array(
    z.string().refine((val) => val === "" || /^https?:\/\//.test(val), {
      message: "Invalid URL format (e.g., https://example.com)",
    })
  ).optional(),
  exclusionPatterns: z.array(z.string()).optional(),
  scanProfile: z.string().nullable().optional(),
});
