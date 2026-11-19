import { z } from 'zod';

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Please provide a department name.')
    .max(20, 'Department name cannot exceed 20 characters.'),
  description: z
    .string()
    .min(1, 'Please enter a description.')
    .max(40, 'Description cannot exceed 450 characters.'),
  departmentLead: z
    .any()
    .optional(), // Keep it optional or as needed
});
