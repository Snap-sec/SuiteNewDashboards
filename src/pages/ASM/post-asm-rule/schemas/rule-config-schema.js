import { z } from 'zod';

export const ruleConfigSchema = z.object({
  name: z
    .string()
    .min(1, 'Rule name is required')
    .max(60, 'Rule name must be 60 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
});

