import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { taskSchema, type TaskFormData } from '../schemas';
import { mockUsers } from '@/data/mockUsers';
import type { Task } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
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

interface CreateSubtaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  parentTask: Task;
}

/**
 * Create Subtask Modal Component
 * Modal dialog with form to create a new subtask under a parent task
 */
export function CreateSubtaskModal({
  open,
  onOpenChange,
  caseId,
  parentTask,
}: CreateSubtaskModalProps) {
  const { dispatch } = useCaseContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      team: undefined,
      assignedTo: undefined,
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
        team: data.team ? (data.team as any) : undefined,
        assignedTo: data.assignedTo || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update the parent task to add this subtask
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
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create subtask', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-neutral-900">
            CREATE SUBTASK
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-600">
            Create a new subtask under {parentTask.id}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the subtask..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormDescription>
                    Title is auto-generated from the description.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Brief description of the subtask" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team */}
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormDescription>
                    Delegate to the team responsible for completing this case.
                  </FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PROPERTY_MANAGEMENT">Property Management</SelectItem>
                      <SelectItem value="GUEST_COMM">Guest Comm</SelectItem>
                      <SelectItem value="GUEST_EXPERIENCE">Guest Experience</SelectItem>
                      <SelectItem value="FINOPS">FinOps</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Assign To (optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.role}
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
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Subtask'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

