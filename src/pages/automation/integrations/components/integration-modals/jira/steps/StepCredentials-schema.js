import * as z from 'zod';

export const credentialsSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  apiToken: z
    .string()
    .min(1, 'API Token is required'),

  domain: z
    .string()
    .min(1, 'Domain is required')
    .url('Must be a valid URL — e.g. https://yourcompany.atlassian.net'),
});
