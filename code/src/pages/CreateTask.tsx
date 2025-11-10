import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { taskSchema, type TaskFormData } from '@/features/tasks/schemas';
import { mockUsers } from '@/data/mockUsers';
import type { Task } from '@/types';
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

/**
 * Create Task Page Component
 * Full page form to create a new task or subtask
 */
export function CreateTask() {
  const { caseId, taskId } = useParams<{ caseId: string; taskId?: string }>();
  const { state, dispatch } = useCaseContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentTask, setParentTask] = useState<Task | null>(null);
  const [caseData, setCaseData] = useState<any>(null);

  // Check if we're creating a subtask
  const isSubtask = !!taskId;

  useEffect(() => {
    // Find the case
    const foundCase = state.cases.find((c) => c.id === caseId);
    setCaseData(foundCase);

    if (isSubtask && foundCase) {
      // Find the parent task recursively
      const findTask = (tasks: Task[]): Task | null => {
        for (const task of tasks) {
          if (task.id === taskId) return task;
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
  }, [caseId, taskId, isSubtask, state.cases]);

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

      // Navigate back to the case
      navigate(`/cases/${caseId}`);
    } catch (error) {
      toast.error(isSubtask ? 'Failed to create subtask' : 'Failed to create task', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!caseData) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  if (isSubtask && !parentTask) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="text-neutral-600">Parent task not found</p>
        <Button className="mt-4" onClick={() => navigate(`/cases/${caseId}`)}>
          Back to Case
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-normal text-neutral-900 mb-1">
          {isSubtask ? 'CREATE NEW SUBTASK' : 'CREATE NEW TASK'}
        </h1>
        <p className="text-sm text-neutral-600">
          {isSubtask
            ? `Add a new subtask under ${parentTask?.id} - ${parentTask?.title}`
            : `Add a new task to case ${caseId} - ${caseData?.title}`}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectItem value="GUEST_COMM_DE">Guest Comm - DE</SelectItem>
                      <SelectItem value="GUEST_COMM_AT">Guest Comm - AT</SelectItem>
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
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
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
      </div>
    </div>
  );
}

