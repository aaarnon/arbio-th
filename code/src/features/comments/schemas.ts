import { z } from 'zod';

/**
 * Comment form validation schema
 */
export const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment too long'),
  alsoSendToMainCase: z.boolean().default(false),
});

export type CommentFormData = z.infer<typeof commentSchema>;

