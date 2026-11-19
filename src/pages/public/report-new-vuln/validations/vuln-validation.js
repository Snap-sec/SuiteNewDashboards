import { z } from "zod";

export const vulnerabilitySchema = z.object({
  // id: z.string().length(24, "ID must be a 24-character hex string").optional(),
  title: z.string().min(5, "Title cannot be less than 5 characters"),
  fullMarkdownReport: z.string().min(1, "Full Markdown Report is required"),
  cwe: z.string().startsWith("CWE-", "CWE must start with 'CWE-'"),
  affectedAssets: z.array(
    z.object({
      assetName: z.string().min(1, "Asset name is required"),
      type: z.string().min(1, "Type is required"),
      value: z.string().min(1, "Value is required"),
      vulnerableLocation: z.string().min(1, "Vulnerable location is required")
    })
  ).min(1, "At least one affected asset is required"),
  cvssScore: z.number().min(0, "CVSS score must be at least 0"),
  cvssRating: z.string().min(1, "CVSS rating is required"),
  cvssString: z.string().min(1, "CVSS string is required")
});
