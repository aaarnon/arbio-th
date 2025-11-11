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
import { Switch } from '@/components/ui/switch';

/**
 * Create Case Page Component
 * Full page form to create a new case
 */
export function CreateCase() {
  const { dispatch } = useCaseContext();
  const { notifyCaseCreated } = useNotifications();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      sendToBreezeway: false,
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

  const onSubmit = async (data: CaseFormData) => {
    setIsSubmitting(true);

    try {
      // Parse search value to extract propertyId or reservationId
      let propertyId: string | undefined;
      let reservationId: string | undefined;
      
      if (data.search.startsWith('property:')) {
        propertyId = data.search.replace('property:', '');
      } else if (data.search.startsWith('reservation:')) {
        reservationId = data.search.replace('reservation:', '');
      }

      // Generate case ID (TK-####)
      const caseId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create case object
      const newCase = {
        id: caseId,
        title: data.title,
        description: data.description,
        status: 'TODO' as const,
        team: data.team,
        propertyId,
        reservationId,
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

  return (
    <div className="mx-auto max-w-3xl">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-normal text-neutral-900 mb-1">CREATE NEW CASE</h1>
        <p className="text-sm text-neutral-600">
          Create a new support case to track and manage customer issues
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Search Field */}
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search *</FormLabel>
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
                {isSubmitting ? 'Creating...' : 'Create Case'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

