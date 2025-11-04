import { z } from 'zod';

/**
 * Validation schema for creating/editing a case
 */
export const caseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  domain: z.enum(['PROPERTY', 'RESERVATION', 'FINANCE']),
  team: z.enum(['PROPERTY_MANAGEMENT', 'GUEST_COMM', 'GUEST_EXPERIENCE', 'FINOPS']).optional(),
  propertyId: z.string().optional(),
  reservationId: z.string().optional(),
  assignedTo: z.string().optional(),
}).refine(
  (data) => data.propertyId || data.reservationId,
  {
    message: 'Either Property or Reservation must be selected',
    path: ['propertyId'],
  }
);

/**
 * Inferred TypeScript type from the schema
 */
export type CaseFormData = z.infer<typeof caseSchema>;

