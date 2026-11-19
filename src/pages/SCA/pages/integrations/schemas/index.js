import * as z from 'zod';

export const githubSchema = z.object({
  name: z.string().optional(),
  organization: z.string().min(1, 'GitHub Organization / Account is required'),
  token: z.string().min(1, 'Personal Access Token (PAT) is required'),
});
