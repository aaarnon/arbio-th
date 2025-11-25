import { z } from 'zod';

/**
 * Validation schema for creating/editing a case
 */
export const caseSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  description: z.string().min(10, 'This field is required'),
  team: z.enum(['PROPERTY_MANAGEMENT_DE', 'PROPERTY_MANAGEMENT_AT', 'GUEST_COMM', 'GUEST_EXPERIENCE', 'FINOPS'], { message: 'This field is required' }),
  search: z.string().min(1, 'This field is required'),
  propertyId: z.string().optional(),
  reservationId: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

/**
 * Inferred TypeScript type from the schema
 */
export type CaseFormData = z.infer<typeof caseSchema>;

