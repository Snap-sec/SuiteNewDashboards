import { z } from 'zod';
import { getPasswordSchema } from './password-rules';

// Schema for requesting a password reset email
export const getResetRequestSchema = () => {
  return z.object({
    email: z
      .string()
      .email({ message: 'Please enter a valid email address.' })
      .min(1, { message: 'Email is required.' }),
  });
};

// Schema for setting a new password
export const getNewPasswordSchema = (getEmail) => {
  return z
    .object({
      password: getPasswordSchema(getEmail),
      confirmPassword: z
        .string()
        .min(1, { message: 'Please confirm your password.' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
};
