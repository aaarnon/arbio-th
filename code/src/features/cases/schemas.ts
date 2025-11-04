import { z } from 'zod';

/**
 * Validation schema for creating/editing a case
 */
export const caseSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  description: z.string().min(10, 'This field is required'),
  domain: z.enum(['PROPERTY', 'RESERVATION', 'FINANCE'], {
    errorMap: () => ({ message: 'This field is required' })
  }),
  team: z.enum(['PROPERTY_MANAGEMENT', 'GUEST_COMM', 'GUEST_EXPERIENCE', 'FINOPS'], {
    errorMap: () => ({ message: 'This field is required' })
  }),
  propertyId: z.string().optional(),
  reservationId: z.string().optional(),
  assignedTo: z.string().optional(),
}).refine(
  (data) => data.propertyId || data.reservationId,
  {
    message: 'This field is required',
    path: ['propertyId'],
  }
);

/**
 * Inferred TypeScript type from the schema
 */
export type CaseFormData = z.infer<typeof caseSchema>;

