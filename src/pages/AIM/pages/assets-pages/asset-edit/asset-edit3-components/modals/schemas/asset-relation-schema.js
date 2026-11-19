import { z } from 'zod';

export const assetRelationSchema = z.object({
  relationName: z.string().min(1, 'Relation name is required'),
  relationType: z.enum(['child', 'parent'], {
    errorMap: () => ({ message: 'Relation type is required' }),
  }),
  assetValue: z.string().min(1, 'Please select an asset'),
});
