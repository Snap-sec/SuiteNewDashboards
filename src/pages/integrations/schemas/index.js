import * as z from 'zod';

export const gcpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serviceAccountKey: z.string().min(1, 'Service Account Key is required').refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Must be a valid JSON string' }),
  projectId: z.string().min(1, 'Project ID is required'),
});

export const gcpEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serviceAccountKey: z.string().optional().refine((val) => {
    if (!val || !val.trim()) return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Must be a valid JSON string' }),
  projectId: z.string().min(1, 'Project ID is required'),
});

export const awsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accessKeyId: z.string().min(1, 'AWS Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS Secret Access Key is required'),
  region: z.string().optional(),
});

export const awsEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accessKeyId: z.string().min(1, 'AWS Access Key ID is required'),
  secretAccessKey: z.string().optional(),
  region: z.string().optional(),
});

export const azureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ApplicationID: z.string().min(1, 'Application ID is required'),
  KeyValue: z.string().min(1, 'Key Value is required'),
  DirectoryID: z.string().min(1, 'Directory ID is required'),
  SubscriptionID: z.string().min(1, 'Subscription ID is required'),
});

export const azureEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ApplicationID: z.string().min(1, 'Application ID is required'),
  KeyValue: z.string().optional(),
  DirectoryID: z.string().min(1, 'Directory ID is required'),
  SubscriptionID: z.string().min(1, 'Subscription ID is required'),
});

export const oracleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tenancyId: z.string().min(1, 'Tenancy ID is required'),
  compartmentId: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  keyFingerprint: z.string().min(1, 'Key Fingerprint is required'),
  keyValue: z.string().min(1, 'Key Value (Private Key) is required'),
  region: z.string().optional(),
});

export const oracleEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tenancyId: z.string().min(1, 'Tenancy ID is required'),
  compartmentId: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  keyFingerprint: z.string().min(1, 'Key Fingerprint is required'),
  keyValue: z.string().optional(),
  region: z.string().optional(),
});

export const githubSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  base_url: z.string().min(1, 'Base URL is required'),
  pat: z.string().min(1, 'Personal Access Token (PAT) is required'),
});

export const githubEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  base_url: z.string().min(1, 'Base URL is required'),
  pat: z.string().optional(),
});

export const gitlabSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  base_url: z.string().min(1, 'Base URL is required'),
  pat: z.string().min(1, 'Personal Access Token (PAT) is required'),
});

export const gitlabEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  base_url: z.string().min(1, 'Base URL is required'),
  pat: z.string().optional(),
});
