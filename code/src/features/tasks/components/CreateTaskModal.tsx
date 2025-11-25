import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { taskSchema, type TaskFormData } from '@/features/tasks/schemas';
import { mockUsers } from '@/data/mockUsers';
import type { Task, Case } from '@/types';
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
  SelectSeparator,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/file-upload';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  parentTaskId?: string; // If provided, creates a subtask
}

/**
 * Create Task Modal Component
 * Modal dialog for creating a new task or subtask
 */
export function CreateTaskModal({ open, onOpenChange, caseId, parentTaskId }: CreateTaskModalProps) {
  const { state, dispatch } = useCaseContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentTask, setParentTask] = useState<Task | null>(null);
  const [caseData, setCaseData] = useState<Case | null>(null);

  // Check if we're creating a subtask
  const isSubtask = !!parentTaskId;

  useEffect(() => {
    if (!open) return;

    // Find the case
    const foundCase = state.cases.find((c) => c.id === caseId);
    setCaseData(foundCase || null);

    if (isSubtask && foundCase) {
      // Find the parent task recursively
      const findTask = (tasks: Task[]): Task | null => {
        for (const task of tasks) {
          if (task.id === parentTaskId) return task;
          if (task.subtasks) {
            const found = findTask(task.subtasks);
            if (found) return found;
          }
        }
        return null;
      };

      const found = findTask(foundCase.tasks || []);
      setParentTask(found);
    }
  }, [caseId, parentTaskId, isSubtask, state.cases, open]);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: undefined,
      attachments: [],
      sendToBreezeway: false,
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);

    try {
      if (!caseData) {
        toast.error('Case not found');
        return;
      }

      if (isSubtask) {
        // Creating a subtask
        if (!parentTask) {
          toast.error('Parent task not found');
          return;
        }

        // Generate subtask ID
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
            caseId: caseId!,
            taskId: parentTask.id,
            updates: updatedParent,
          },
        });

        toast.success('Subtask created successfully', {
          description: `Subtask ${newSubtaskId} has been added`,
        });
      } else {
        // Creating a top-level task
        // Generate task ID
        const taskCount = caseData.tasks?.length || 0;
        const newTaskId = `${caseId}.${taskCount + 1}`;

        // Create new task
        const newTask: Task = {
          id: newTaskId,
          title: data.title,
          description: data.description || undefined,
          status: 'TODO',
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
            caseId: caseId!,
            task: newTask,
          },
        });

        toast.success('Task created successfully', {
          description: `Task ${newTaskId} has been added`,
        });
      }

      // Close modal and reset form
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(isSubtask ? 'Failed to create subtask' : 'Failed to create task', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isSubtask ? 'Create New Subtask' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {isSubtask
              ? `Add a new subtask under ${parentTask?.id} - ${parentTask?.title}`
              : `Add a new task to case ${caseId} - ${caseData?.title}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                      rows={3}
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
                    <Input placeholder="Brief description of the task" {...field} />
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
                  <FormLabel>Team *</FormLabel>
                  <FormDescription>
                    Assign to the team responsible for completing this task.
                  </FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PROPERTY_MANAGEMENT_DE">Property Management - DE</SelectItem>
                      <SelectItem value="PROPERTY_MANAGEMENT_AT">Property Management - AT</SelectItem>
                      <SelectSeparator />
                      <SelectItem value="GUEST_COMM">Guest Comm</SelectItem>
                      <SelectSeparator />
                      <SelectItem value="GUEST_EXPERIENCE">Guest Experience</SelectItem>
                      <SelectSeparator />
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
                  <FormLabel>Assigned To</FormLabel>
                  <FormDescription>
                    Optional: Assign this task to a team member.
                  </FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            {/* Attachment */}
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment (optional)</FormLabel>
                  <FormControl>
                    <FileUpload
                      multiple
                      onFilesChange={(files) => field.onChange(files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-neutral-100">
              {/* Breezeway Toggle */}
              <FormField
                control={form.control}
                name="sendToBreezeway"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-sm text-neutral-700">
                      {field.value ? 'Send to Breezeway' : 'Do not send to Breezeway'}
                    </span>
                  </div>
                )}
              />

              {/* Create Button */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isSubtask
                    ? 'Creating Subtask...'
                    : 'Creating Task...'
                  : isSubtask
                    ? 'Create Subtask'
                    : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
