import { z } from 'zod';
import { basePasswordSchema } from './password-rules';

export const getSignupSchema = () => {
  return z
    .object({
      email: z
        .string()
        .email({ message: 'Please enter a valid email address.' })
        .min(1, { message: 'Email is required.' }),
      password: basePasswordSchema,
      confirmPassword: z
        .string()
        .min(1, { message: 'Please confirm your password.' }),
      firstName: z.string().min(1, { message: 'First name is required.' }),
      lastName: z.string().min(1, { message: 'Last name is required.' }),
      terms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms and conditions.',
      }),
      account_type: z.string(),
    })
    .refine(
      (data) =>
        !data.email ||
        !data.password ||
        data.password.toLowerCase() !== data.email.toLowerCase(),
      {
        message: 'Password cannot be your email address',
        path: ['password'],
      }
    )
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
};
