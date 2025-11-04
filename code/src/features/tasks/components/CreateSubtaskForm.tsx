import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { taskSchema, type TaskFormData } from '../schemas';
import { mockUsers } from '@/data/mockUsers';
import type { Task } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CreateSubtaskFormProps {
  caseId: string;
  parentTask: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Create Subtask Form Component
 * Inline form to add a subtask to an existing task
 */
export function CreateSubtaskForm({ 
  caseId, 
  parentTask, 
  onSuccess, 
  onCancel 
}: CreateSubtaskFormProps) {
  const { dispatch } = useCaseContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);

    try {
      // Generate subtask ID (parentId.N where N is next number)
      const subtaskCount = parentTask.subtasks?.length || 0;
      const newSubtaskId = `${parentTask.id}.${subtaskCount + 1}`;

      // Create new subtask
      const newSubtask: Task = {
        id: newSubtaskId,
        title: data.title,
        description: data.description || undefined,
        status: 'TODO',
        assignedTo: data.assignedTo || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // We need to update the parent task to add this subtask
      // First, get updated parent with new subtask
      const updatedParent = {
        ...parentTask,
        subtasks: [...(parentTask.subtasks || []), newSubtask],
        updatedAt: new Date().toISOString(),
      };

      // Dispatch update for the parent task
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          caseId,
          taskId: parentTask.id,
          updates: updatedParent,
        },
      });

      toast.success('Subtask created successfully', {
        description: `Subtask ${newSubtaskId} has been added`,
      });

      // Reset and close
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create subtask', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ml-8 mb-4 rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <h4 className="mb-4 text-xs font-medium text-neutral-900 uppercase tracking-wider">Add Subtask</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Subtask title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Subtask description..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assigned To */}
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
                onCancel?.();
              }}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? 'Creating...' : 'Add Subtask'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


