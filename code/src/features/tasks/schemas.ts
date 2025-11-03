import { z } from 'zod';

/**
 * Validation schema for creating a task
 */
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
});

/**
 * Validation schema for editing a task - includes status
 */
export const editTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
});

/**
 * Inferred TypeScript types from the schemas
 */
export type TaskFormData = z.infer<typeof taskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;


