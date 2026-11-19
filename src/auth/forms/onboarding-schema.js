import { z } from 'zod';

export const getOnboardingSchema = () => {
  return z.object({
    name: z.string().trim().min(1, { message: 'Company name is required.' }),
    website: z
      .string()
      .trim()
      .min(1, { message: 'Company website is required.' })
      .refine(
        (val) => {
          try {
            const urlToTest = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
            new URL(urlToTest);
            return /^((https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?)$/i.test(val) || z.string().url().safeParse(val).success;
          } catch {
            return false;
          }
        },
        { message: 'Please enter a valid website URL.' }
      ),
  });
};

export const onboardingSchema = getOnboardingSchema();
