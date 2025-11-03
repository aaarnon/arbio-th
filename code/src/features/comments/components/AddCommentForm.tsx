import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { commentSchema, type CommentFormData } from '../schemas';
import { mockUsers } from '@/data/mockUsers';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AddCommentFormProps {
  caseId: string;
}

/**
 * Add Comment Form Component
 * Form to add a new comment to a case
 */
export function AddCommentForm({ caseId }: AddCommentFormProps) {
  const { dispatch } = useCaseContext();
  const { notifyCommentAdded } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);

    try {
      // Generate comment ID
      const commentId = `comment-${Date.now()}`;

      // Create new comment (using user-1 as default author for now)
      const newComment = {
        id: commentId,
        author: 'user-1', // TODO: Use actual logged-in user
        text: data.text,
        createdAt: new Date().toISOString(),
      };

      // Dispatch ADD_COMMENT action
      dispatch({
        type: 'ADD_COMMENT',
        payload: {
          caseId,
          comment: newComment,
        },
      });

      // Generate notification
      const author = mockUsers.find((u) => u.id === newComment.author);
      notifyCommentAdded(caseId, author?.name || 'A team member');

      toast.success('Comment added successfully');

      // Reset form
      form.reset();
    } catch (error) {
      toast.error('Failed to add comment', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add a comment... (Use @ to mention users)"
                  rows={4}
                  className="resize-none border-neutral-200 focus:border-neutral-400 text-sm bg-neutral-50 focus:bg-white transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="default"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

