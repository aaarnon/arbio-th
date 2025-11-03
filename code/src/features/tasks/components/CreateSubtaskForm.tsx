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
    <div className="ml-8 mb-4 rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">Add Subtask</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Title *</FormLabel>
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
                <FormLabel className="text-xs">Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Subtask description..."
                    rows={2}
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
                <FormLabel className="text-xs">Assign To (Optional)</FormLabel>
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
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => {
                form.reset();
                onCancel?.();
              }}
              disabled={isSubmitting}
              size="sm"
              className="border border-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? 'Creating...' : 'Create Subtask'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


