import { z } from 'zod';

export const agentSchema = z
  .object({
    name: z
      .string({ required_error: 'Agent name is required' })
      .trim()
      .min(1, 'Agent name is required')
      .min(3, 'Agent name must be at least 3 characters')
      .max(100, 'Agent name must not exceed 100 characters'),
    description: z
      .string()
      .trim()
      .max(500, 'Description must not exceed 500 characters')
      .optional()
      .default(''),
  })
  .strict();

export const createAgentSchema = agentSchema;
export const editAgentSchema = agentSchema;
