import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { caseSchema, type CaseFormData } from '../schemas';
import { mockProperties } from '@/data/mockProperties';
import { mockReservations } from '@/data/mockReservations';
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
      domain: undefined,
      propertyId: '',
      reservationId: '',
      assignedTo: '',
    },
  });

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
        domain: data.domain,
        propertyId: data.propertyId || undefined,
        reservationId: data.reservationId || undefined,
        assignedTo: data.assignedTo || undefined,
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
          <DialogTitle>Create New Case</DialogTitle>
          <DialogDescription>
            Create a new support case to track and manage customer issues
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the issue" {...field} />
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
                      placeholder="Detailed description of the issue..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Domain */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain *</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              {/* Property */}
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockProperties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.unitId} - {property.address.split(',')[0]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reservation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockReservations.map((reservation) => (
                          <SelectItem key={reservation.id} value={reservation.id}>
                            {reservation.guestName} - {reservation.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="border border-gray-300"
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

