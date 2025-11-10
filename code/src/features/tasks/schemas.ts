import { z } from 'zod';

/**
 * Validation schema for creating a task
 */
export const taskSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  description: z.string().optional(),
  team: z.enum(['PROPERTY_MANAGEMENT_DE', 'PROPERTY_MANAGEMENT_AT', 'GUEST_COMM_DE', 'GUEST_COMM_AT', 'GUEST_EXPERIENCE', 'FINOPS'], { message: 'This field is required' }),
  assignedTo: z.string().optional(),
  attachments: z.array(z.any()).optional(),
  sendToBreezeway: z.boolean().default(false),
});

/**
 * Validation schema for editing a task - includes status
 */
export const editTaskSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE', 'FAILED', 'DUPLICATE', 'REJECTED', 'CANCELLED']),
});

/**
 * Inferred TypeScript types from the schemas
 */
export type TaskFormData = z.infer<typeof taskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;


