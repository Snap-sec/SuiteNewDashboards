import { z } from 'zod';

export const blacklistRuleSchema = z.object({
  name: z
    .string()
    .min(1, 'Rule name is required')
    .max(100, 'Rule name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9 :._-]+$/, 'Rule name contains invalid characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must be less than 255 characters'),
  conditions: z.any(),
});
