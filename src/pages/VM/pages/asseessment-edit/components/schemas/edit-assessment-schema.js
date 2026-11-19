import { z } from "zod";

export const editAssessmentSchema = z.object({
  title: z
    .string()
    .min(1, "Assessment name is required")
    .max(35, "Assessment name must be less than 35 characters"),
  date: z.any().optional(),
  category: z.string().min(1, "Category is required"),
  scopeString: z.string().optional().nullable(),
  defaultTicketOwner: z.any().optional().nullable(),
  departmentId: z.array(z.any()).default([]),
  businessUnitIds: z.array(z.any()).default([]),
  vendorId: z.string().optional().nullable(),
  vulnSource: z.string().optional().nullable(),
});
