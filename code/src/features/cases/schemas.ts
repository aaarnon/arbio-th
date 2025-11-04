import { z } from 'zod';

/**
 * Validation schema for creating/editing a case
 */
export const caseSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  description: z.string().min(10, 'This field is required'),
  team: z.enum(['PROPERTY_MANAGEMENT', 'GUEST_COMM', 'GUEST_EXPERIENCE', 'FINOPS'], {
    errorMap: () => ({ message: 'This field is required' })
  }),
  propertyId: z.string().optional(),
  reservationId: z.string().optional(),
}).superRefine((data, ctx) => {
  // At least one of propertyId or reservationId must be filled
  if (!data.propertyId && !data.reservationId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'This field is required',
      path: ['propertyId'],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'This field is required',
      path: ['reservationId'],
    });
  }
});

/**
 * Inferred TypeScript type from the schema
 */
export type CaseFormData = z.infer<typeof caseSchema>;

