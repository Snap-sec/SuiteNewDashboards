import { z } from 'zod';

export const vendorSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Service vendor name is required.' })
    .max(30, { message: 'Name must be 30 characters or less.' })
    .regex(/^[a-zA-Z\s]*$/, { message: 'Name can only contain alphabets and spaces.' }),
  description: z
    .string()
    .max(500, { message: 'Description must be 500 characters or less.' })
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .max(20, { message: 'Phone number must be 20 characters or less.' })
    .regex(/^\d+$/, { message: 'Phone number must be in number format.' })
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, { message: 'Address must be 200 characters or less.' })
    .optional()
    .or(z.literal('')),
  logo_url: z
    .string()
    .min(1, { message: 'Logo URL is required.' })
    .url({ message: 'Please enter a valid URL (e.g. https://example.com/logo.png).' })
    .refine((val) => {
      if (!val) return false;
      // Basic image extension check
      return /\.(?:png|jpg|jpeg|gif|svg|webp)(?:\?.*)?$/i.test(val) || /^(https?:\/\/)/i.test(val);
    }, {
      message: 'Please provide a direct link to an image file.'
    }),
});
