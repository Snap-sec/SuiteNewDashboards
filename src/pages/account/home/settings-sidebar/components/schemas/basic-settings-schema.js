import { z } from 'zod';

const noConsecutiveSpaces = (val) => !val || !/\s{2,}/.test(val);
const consecutiveSpacesMsg = 'Consecutive spaces are not allowed.';

export const basicSettingsSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required.')
    .max(10, 'First name cannot exceed 10 characters.')
    .regex(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, 'First name should only contain alphabets and single spaces.')
    .refine(noConsecutiveSpaces, { message: consecutiveSpacesMsg }),
  lastName: z
    .string()
    .min(1, 'Last name is required.')
    .max(10, 'Last name cannot exceed 10 characters.')
    .regex(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, 'Last name should only contain alphabets and single spaces.')
    .refine(noConsecutiveSpaces, { message: consecutiveSpacesMsg }),
  company: z
    .string()
    .regex(/^(?:[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*)?$/, 'Company name should only contain alphabets, numbers, and single spaces.')
    .refine(noConsecutiveSpaces, { message: consecutiveSpacesMsg })
    .optional(),
  birthDate: z.union([z.string(), z.date()]).optional(),
  companyLogoUrl: z.string().optional(),
});
