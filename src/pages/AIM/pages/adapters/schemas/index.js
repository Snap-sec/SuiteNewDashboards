import * as z from 'zod';

export const crtSchema = z.object({
  domain: z.string().min(1, { message: "Domain is required" }),
});

export const hackertargetSchema = z.object({
  domain: z.string().min(1, { message: "Domain is required" }),
});

export const githubSchema = z.object({
  accessToken: z.string().min(1, { message: "Access Token is required" }),
});

export const gitlabSchema = z.object({
  accessToken: z.string().min(1, { message: "Access Token is required" }),
  gitlabUrl: z.string().optional(),
});

export const slackSchema = z.object({
  accessToken: z.string().min(1, { message: "Access Token is required" }),
});

export const swaggerSchema = z.object({
  swaggerUrl: z.string().min(1, { message: "Swagger URL is required" }),
});

export const gsheetSchema = z.object({
  sheetUrl: z.string().min(1, { message: "Google Sheet URL is required" }),
});

export const cloudflareSchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
  orgWebsite: z.string().min(1, { message: "Organization Website is required" }),
});

export const censysSchema = z.object({
  domain: z.string().min(1, { message: "Domain is required" }),
  apiId: z.string().min(1, { message: "API ID is required" }),
  apiSecret: z.string().min(1, { message: "API Secret is required" }),
});

export const postmanSchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
});

export const hostingerSchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
});

export const ociSchema = z.object({
  tenancyId: z.string().min(1, { message: "Tenancy ID is required" }),
  userId: z.string().min(1, { message: "User ID is required" }),
  fingerprint: z.string().min(1, { message: "Fingerprint is required" }),
  privateKey: z.string().min(1, { message: "Private Key is required" }),
  region: z.string().min(1, { message: "Region is required" }),
});

export const googleSchema = z.object({
  serviceAccountKey: z
    .string()
    .min(1, { message: "Service Account Key is required" })
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return !!parsed.client_email && !!parsed.private_key;
      } catch {
        return false;
      }
    }, { message: "Must be a valid service account JSON with client_email and private_key" }),
  adminEmail: z.string().email({ message: "A valid admin email is required" }),
  customerId: z.string().optional(),
});

export const csvSchema = z.object({
  file: z.any().refine((files) => files?.length > 0, "File is required"),
});

export const manualSchema = z.object({
  file: z.any().refine((files) => files?.length > 0, "File is required"),
});

