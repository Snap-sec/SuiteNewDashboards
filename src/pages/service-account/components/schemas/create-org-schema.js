import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Invalid website URL"),
  logo: z.string().url("Invalid logo URL").or(z.literal("")),
  invitees: z.array(
    z.object({
      email: z.string().email("Invalid email").or(z.literal("")),
      role: z.string().default("Manager"),
    })
  ).default([]),
});
