import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { caseSchema, type CaseFormData } from '../schemas';
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
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface CreateCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Create Case Modal Component
 * Modal dialog with form to create a new case
 */
export function CreateCaseModal({ open, onOpenChange }: CreateCaseModalProps) {
  const { dispatch } = useCaseContext();
  const { notifyCaseCreated } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: '',
      description: '',
      team: undefined,
      propertyId: '',
      reservationId: '',
    },
  });

  // Create searchable options for properties and reservations
  const propertyOptions = useMemo(() => 
    mockProperties.map((property) => ({
        value: property.id,
      label: property.id,
    })),
    []
  );

  const reservationOptions = useMemo(() =>
    mockReservations.map((reservation) => ({
      value: reservation.id,
      label: `${reservation.guestName} - ${reservation.id}`,
    })),
    []
  );

  const onSubmit = async (data: CaseFormData) => {
    setIsSubmitting(true);

    try {
      // Generate case ID (TK-####)
      const caseId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create case object
      const newCase = {
        id: caseId,
        title: data.title,
        description: data.description,
        status: 'TODO' as const,
        team: data.team,
        propertyId: data.propertyId || undefined,
        reservationId: data.reservationId || undefined,
        createdBy: 'user-1', // Mock logged-in user (Sarah Chen)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [],
      };

      // Dispatch action to add case
      dispatch({ type: 'ADD_CASE', payload: newCase });

      // Generate notification
      notifyCaseCreated(caseId, data.title);

      // Show success toast
      toast.success('Case created successfully', {
        description: `Case ${caseId} has been created`,
      });

      // Reset form and close modal
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create case', {
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
          <DialogTitle className="text-xl font-normal text-neutral-900">CREATE NEW CASE</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600">
            Create a new support case to track and manage customer issues
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
            {/* Property and Reservation - Top */}
            <div className="grid grid-cols-2 gap-4">
              {/* Property */}
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={propertyOptions}
                        placeholder="Search property..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reservation */}
              <FormField
                control={form.control}
                name="reservationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reservation</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={reservationOptions}
                        placeholder="Search reservation..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the issue..."
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
                {isSubmitting ? 'Creating...' : 'Create Case'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

