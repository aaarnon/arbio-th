import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { caseSchema, type CaseFormData } from '@/features/cases/schemas';
import { mockProperties } from '@/data/mockProperties';
import { mockReservations } from '@/data/mockReservations';
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
import { SearchableSelect } from '@/components/ui/searchable-select';
import { FileUpload } from '@/components/ui/file-upload';
import { TaskReviewStep } from './TaskReviewStep';
import { aiTaskGenerator, convertToTasks, type GeneratedTask } from '@/services/aiTaskGenerator';
import { ThinkingLoader } from '@/components/ui/thinking-loader';
import { Sparkles, ArrowLeft, Check, X } from 'lucide-react';

interface CreateCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Create Case Modal Component
 * Modal dialog for creating a new case
 */
export function CreateCaseModal({ open, onOpenChange }: CreateCaseModalProps) {
  const { dispatch } = useCaseContext();
  const { notifyCaseCreated } = useNotifications();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [formData, setFormData] = useState<CaseFormData | null>(null);

  const form = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: '',
      description: '',
      team: undefined,
      search: '',
      propertyId: '',
      reservationId: '',
      attachments: [],
    },
  });

  // Create combined searchable options for properties and reservations
  const searchOptions = useMemo(() => {
    const propertyOpts = mockProperties.map((property) => {
      return {
        value: `property:${property.id}`,
        label: property.id,
        type: 'property' as const,
        id: property.id,
      };
    });

    const reservationOpts = mockReservations.map((reservation) => ({
      value: `reservation:${reservation.id}`,
      label: `${reservation.guestName} - ${reservation.id}`,
      type: 'reservation' as const,
      id: reservation.id,
    }));

    return [...propertyOpts, ...reservationOpts];
  }, []);

  const onSubmitStep1 = async (data: CaseFormData) => {
    setIsSubmitting(true);
    setIsGenerating(true);
    setFormData(data);
    setCurrentStep(2); // Move to step 2 immediately to show loading state

    try {
      // Generate AI tasks based on description
      const tasks = await aiTaskGenerator.generateTasks(
        data.description,
        data.title,
        data.team
      );
      
      setGeneratedTasks(tasks);
    } catch (error) {
      toast.error('Failed to generate tasks', {
        description: 'Please try again',
      });
      setCurrentStep(1); // Go back to step 1 on error
    } finally {
      setIsSubmitting(false);
      setIsGenerating(false);
    }
  };

  const handleTaskAcceptanceChange = (taskPath: number[], accepted: boolean) => {
    setGeneratedTasks(prevTasks => {
      const newTasks = [...prevTasks];
      
      // Navigate to the task using the path
      let current: GeneratedTask[] | undefined = newTasks;
      let task: GeneratedTask | undefined;
      
      for (let i = 0; i < taskPath.length; i++) {
        const index = taskPath[i];
        if (i === taskPath.length - 1) {
          // Last index - this is the task to modify
          task = current[index];
          task.accepted = accepted;
        } else {
          // Navigate deeper
          task = current[index];
          current = task.subtasks;
        }
      }
      
      return newTasks;
    });
  };

  const handleAcceptAll = () => {
    setGeneratedTasks(prevTasks => {
      // If all are already accepted, reset to neutral. Otherwise, accept all.
      const shouldReset = areAllTasksAccepted(prevTasks);
      
      const toggleAcceptAll = (tasks: GeneratedTask[]): GeneratedTask[] => {
        return tasks.map(task => ({
          ...task,
          accepted: shouldReset ? undefined : true,
          subtasks: task.subtasks ? toggleAcceptAll(task.subtasks) : undefined
        }));
      };
      return toggleAcceptAll(prevTasks);
    });
  };

  const handleResetAll = () => {
    setGeneratedTasks(prevTasks => {
      const resetAllTasks = (tasks: GeneratedTask[]): GeneratedTask[] => {
        return tasks.map(task => ({
          ...task,
          accepted: undefined,
          subtasks: task.subtasks ? resetAllTasks(task.subtasks) : undefined
        }));
      };
      return resetAllTasks(prevTasks);
    });
  };

  const handleRejectAll = () => {
    setGeneratedTasks(prevTasks => {
      // If all are already rejected, reset to neutral. Otherwise, reject all.
      const shouldReset = areAllTasksRejected(prevTasks);
      
      const toggleRejectAll = (tasks: GeneratedTask[]): GeneratedTask[] => {
        return tasks.map(task => ({
          ...task,
          accepted: shouldReset ? undefined : false,
          subtasks: task.subtasks ? toggleRejectAll(task.subtasks) : undefined
        }));
      };
      return toggleRejectAll(prevTasks);
    });
  };

  // Check if all tasks are explicitly accepted
  const areAllTasksAccepted = (tasks: GeneratedTask[]): boolean => {
    return tasks.every(task => {
      const taskAccepted = task.accepted === true;
      const subtasksAccepted = task.subtasks ? areAllTasksAccepted(task.subtasks) : true;
      return taskAccepted && subtasksAccepted;
    });
  };

  // Check if all tasks are explicitly rejected
  const areAllTasksRejected = (tasks: GeneratedTask[]): boolean => {
    return tasks.every(task => {
      const taskRejected = task.accepted === false;
      const subtasksRejected = task.subtasks ? areAllTasksRejected(task.subtasks) : true;
      return taskRejected && subtasksRejected;
    });
  };

  // Check if all tasks have been decided (either accepted or rejected)
  const areAllTasksDecided = (tasks: GeneratedTask[]): boolean => {
    return tasks.every(task => {
      const taskDecided = task.accepted !== undefined;
      const subtasksDecided = task.subtasks ? areAllTasksDecided(task.subtasks) : true;
      return taskDecided && subtasksDecided;
    });
  };

  // Check if at least one task is accepted
  const hasAcceptedTasks = (tasks: GeneratedTask[]): boolean => {
    return tasks.some(task => {
      if (task.accepted === true) return true;
      if (task.subtasks) return hasAcceptedTasks(task.subtasks);
      return false;
    });
  };

  const allAccepted = generatedTasks.length > 0 && areAllTasksAccepted(generatedTasks);
  const allRejected = generatedTasks.length > 0 && areAllTasksRejected(generatedTasks);
  const allDecided = areAllTasksDecided(generatedTasks);
  const someAccepted = hasAcceptedTasks(generatedTasks);

  const handleCreateCase = async () => {
    if (!formData) return;
    
    // Check if all tasks have been decided
    if (!allDecided) {
      toast.error('Please review all tasks', {
        description: 'You must accept or reject each task before creating the case',
      });
      return;
    }

    // Check if at least one task is accepted
    if (!someAccepted) {
      toast.error('No tasks accepted', {
        description: 'You must accept at least one task to create the case',
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Parse search value to extract propertyId or reservationId
      let propertyId: string | undefined;
      let reservationId: string | undefined;
      
      if (formData.search.startsWith('property:')) {
        propertyId = formData.search.replace('property:', '');
      } else if (formData.search.startsWith('reservation:')) {
        reservationId = formData.search.replace('reservation:', '');
      }

      // Generate case ID (TK-####)
      const caseId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

      // Convert explicitly accepted tasks to actual Task objects with IDs
      const tasks = convertToTasks(
        generatedTasks.filter(t => t.accepted === true), 
        caseId, 
        false
      );

      // Create case object
      const newCase = {
        id: caseId,
        title: formData.title,
        description: formData.description,
        status: 'TODO' as const,
        team: formData.team,
        propertyId,
        reservationId,
        createdBy: 'user-1', // Mock logged-in user (Sarah Chen)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks,
      };

      // Dispatch action to add case
      dispatch({ type: 'ADD_CASE', payload: newCase });

      // Generate notification
      notifyCaseCreated(caseId, formData.title);

      // Show success toast
      toast.success('Case created successfully', {
        description: `Case ${caseId} has been created with ${tasks.length} tasks`,
      });

      // Reset state and close modal
      onOpenChange(false);
      setCurrentStep(1);
      setGeneratedTasks([]);
      setFormData(null);
      form.reset();

      // Navigate to the new case
      navigate(`/cases/${caseId}`);
    } catch (error) {
      toast.error('Failed to create case', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setGeneratedTasks([]);
    setIsGenerating(false);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    // Reset state when modal is closed
    if (!open) {
      setCurrentStep(1);
      setGeneratedTasks([]);
      setFormData(null);
      setIsGenerating(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col bg-neutral-50">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 ? 'Create New Case' : 'Review AI-Generated Tasks'}
          </DialogTitle>
          {currentStep === 1 && (
            <DialogDescription>
              Create a new support case to track and manage customer issues
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {currentStep === 1 ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitStep1)} className="space-y-3 bg-white rounded-lg p-4">
            {/* Search Field */}
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property or Reservation Details *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={searchOptions}
                      placeholder="Search by Property (SKU, Address) or Reservation (ID, Guest Name)"
                    />
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
                  <FormDescription>
                    Provide a detailed description of the issue. AI will use this information to generate tasks automatically.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the issue..."
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
                    <Input placeholder="Brief description of the issue" {...field} />
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
                    Delegate to the team responsible for completing this case.
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
            </form>
          </Form>
          ) : isGenerating ? (
            <ThinkingLoader 
              title="AI Agents Processing"
              description="Analyzing your case and generating intelligent task recommendations..."
            />
          ) : (
            <>
              {/* AI Task Suggestions Banner */}
              <div className="bg-neutral-200 border border-neutral-300 rounded-lg p-4 mb-4 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">AI Task Suggestions</h3>
                  <p className="text-sm text-neutral-700 mt-0.5">Review and select which tasks to include with this case</p>
                </div>
              </div>
              
              <TaskReviewStep 
                tasks={generatedTasks}
                onTaskAcceptanceChange={handleTaskAcceptanceChange}
                onAcceptAll={handleAcceptAll}
                onRejectAll={handleRejectAll}
                allAccepted={allAccepted}
                allRejected={allRejected}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>

        {/* Footer Actions */}
        {currentStep === 1 ? (
          <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-neutral-100">
            <Button 
              onClick={form.handleSubmit(onSubmitStep1)} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating Tasks...' : 'Step 1: Generate Tasks →'}
            </Button>
          </div>
        ) : !isGenerating ? (
          <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-neutral-100">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleCreateCase}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Case...' : 'Step 2: Create Case'}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
