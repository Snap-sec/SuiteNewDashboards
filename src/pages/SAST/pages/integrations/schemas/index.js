import * as z from 'zod';

export const githubSchema = z.object({
  name: z.string().min(1, 'Integration Name is required'),
  organization: z.string().min(1, 'GitHub Organization / User is required'),
  token: z.string().min(1, 'Personal Access Token (PAT) is required'),
});
