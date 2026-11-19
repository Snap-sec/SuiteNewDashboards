import * as z from 'zod';

export const businessUnitSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s]+$/, 'Name must be alphanumeric'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Description must contain only alphanumeric characters, spaces, hyphens, and underscores'),
  owner: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }, { required_error: 'Owner is required' }),
  logo: z.string().url('Invalid Logo URL. Please provide a full URL (e.g., https://example.com/logo.png)').min(1, 'Logo URL is required'),
});
