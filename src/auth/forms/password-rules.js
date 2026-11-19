import { z } from 'zod';

export const PASSWORD_REQUIREMENTS = [
  {
    id: 'length',
    label: 'At least 8 characters',
    validator: (pwd) => Boolean(pwd && pwd.length >= 8),
  },
  {
    id: 'cases',
    label: 'One uppercase & one lowercase letter',
    validator: (pwd) => Boolean(pwd && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd)),
  },
  {
    id: 'numberSymbol',
    label: 'One number & one symbol',
    validator: (pwd) => Boolean(pwd && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)),
  },
  {
    id: 'notEmail',
    label: 'Not your email address',
    validator: (pwd, email) => {
      if (!email || !pwd) return true;
      return pwd.toLowerCase() !== email.toLowerCase();
    },
  },
];

export const isPasswordStrong = (password = '', email = '') => {
  return PASSWORD_REQUIREMENTS.every((req) => req.validator(password, email));
};

export const basePasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol');

export const getPasswordSchema = (getEmail) => {
  return basePasswordSchema.refine(
    (val) => {
      const email = typeof getEmail === 'function' ? getEmail() : getEmail;
      return !email || !val || val.toLowerCase() !== email.toLowerCase();
    },
    {
      message: 'Password cannot be your email address',
    }
  );
};
