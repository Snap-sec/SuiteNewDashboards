import { z } from "zod";

export const folderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(20, "Folder name must be less than 20 characters"),
  parentFolderId: z.string().optional().nullable(),
});
