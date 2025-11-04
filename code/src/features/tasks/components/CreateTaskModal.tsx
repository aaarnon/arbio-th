import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { taskSchema, type TaskFormData } from '../schemas';
import { mockUsers } from '@/data/mockUsers';
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

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
}

/**
 * Create Task Modal Component
 * Modal dialog with form to create a new task for a case
 */
export function CreateTaskModal({ open, onOpenChange, caseId }: CreateTaskModalProps) {
  const { state, dispatch } = useCaseContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      domain: undefined,
      team: undefined,
      assignedTo: '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);

    try {
      // Find the case to get current task count
      const caseData = state.cases.find((c) => c.id === caseId);
      if (!caseData) {
        toast.error('Case not found');
        return;
      }

      // Generate task ID (caseId.N where N is next number)
      const taskCount = caseData.tasks?.length || 0;
      const newTaskId = `${caseId}.${taskCount + 1}`;

      // Create new task
      const newTask = {
        id: newTaskId,
        title: data.title,
        description: data.description || undefined,
        status: 'TODO' as const,
        domain: data.domain ? (data.domain as any) : undefined,
        team: data.team ? (data.team as any) : undefined,
        assignedTo: data.assignedTo || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: [],
      };

      // Dispatch action
      dispatch({
        type: 'ADD_TASK',
        payload: {
          caseId,
          task: newTask,
        },
      });

      toast.success('Task created successfully', {
        description: `Task ${newTaskId} has been added`,
      });

      // Reset form and close modal
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create task', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-neutral-900">CREATE NEW TASK</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600">
            Add a new task to track work for this case
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the task" {...field} />
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
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the task..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Domain */}
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PROPERTY">Property</SelectItem>
                        <SelectItem value="RESERVATION">Reservation</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>

            {/* Assign To */}
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
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

