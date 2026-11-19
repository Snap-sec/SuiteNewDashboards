import * as z from 'zod';

export const updateDashboardSchema = z.object({
  name: z
    .string()
    .min(1, 'Dashboard name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  assessmentIds: z.array(z.union([z.string(), z.object({ id: z.string(), label: z.string() })])).min(1, 'At least one project must be selected'),
  isPrivate: z.boolean().default(true),
});
