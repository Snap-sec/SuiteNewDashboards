import * as z from 'zod';

export const qualysSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  apiUrl: z
    .string()
    .min(1, 'API URL is required')
    .url('Invalid URL format (e.g., https://qualysapi.qualys.com)'),
  adapterName: z.string(),
});

export const qualysWasSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  apiUrl: z
    .string()
    .min(1, 'API URL is required')
    .url('Invalid URL format (e.g., https://qualysapi.qualys.com)'),
  adapterName: z.string(),
});

export const checkmarxSchema = z.object({
  apiUrl: z.string().min(1, 'API URL is required').url('Invalid API URL'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  name: z.string().default('checkmarx'),
  adapterName: z.string().default('checkmarx'),
});

export const csvSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gsheetUrl: z.string().min(1, 'Google Sheet URL is required').url('Invalid URL'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  reportTemplate: z.string().min(1, 'Report Template is required'),
  adapterName: z.string().default('gsheet'),
});

export const gitlabSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accessToken: z.string().min(1, 'Access Token is required'),
  gitlabUrl: z.string().optional().or(z.literal('')).refine(val => {
    if (!val) return true;
    return z.string().url().safeParse(val).success;
  }, { message: 'Invalid GitLab URL' }),
  projectIds: z.string().optional(),
  issueLabels: z.string().optional(),
  fetchNotes: z.boolean().default(false),
  projectScope: z.string().default('membership'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('gitlab'),
});

export const semgrepSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  deploymentSlug: z.string().min(1, 'Deployment Slug is required'),
  accessToken: z.string().min(1, 'Access Token is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('semgrep'),
});

export const nucleiSchema = z.object({
  name: z.string().min(1, 'Integration Name is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('nuclei'),
});

export const trivySchema = z.object({
  name: z.string().min(1, 'Integration Name is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('trivy'),
});

export const dependencyCheckSchema = z.object({
  name: z.string().min(1, 'Integration Name is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('dependency-check'),
});

export const npmAuditSchema = z.object({
  name: z.string().min(1, 'Integration Name is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('npm-audit'),
});

export const trufflehogSchema = z.object({
  name: z.string().min(1, 'Integration Name is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('trufflehog'),
});

export const csvAdapterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  reportTemplate: z.string().min(1, 'Report Template is required'),
  adapterName: z.string().default('csv'),
});

export const tenableSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accessKey: z.string().min(1, 'Access Key is required'),
  accessSecret: z.string().min(1, 'Access Secret is required'),
  apiUrl: z.string().min(1, 'API URL is required').url('Invalid API URL'),
  assessmentId: z.string().min(1, 'Assessment is required'),
  adapterName: z.string().default('tenable'),
});


