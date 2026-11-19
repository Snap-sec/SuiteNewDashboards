import { z } from 'zod';

export const teamSchema = z.object({
  name: z
    .string()
    .min(1, 'Please provide a team name.')
    .max(40, 'Team name cannot exceed 40 characters.'),
  description: z
    .string()
    .min(1, 'Please enter a description.')
    .max(60, 'Description cannot exceed 60 characters.'),
  teamLeads: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        value: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
      }),
    )
    .min(1, 'Please select at least one team lead.'),
  selectedMembers: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        value: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
      }),
    )
    .optional()
    .default([]),
});
