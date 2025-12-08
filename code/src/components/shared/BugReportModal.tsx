import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';

interface BugReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Bug Report Modal Component
 * Modal dialog for reporting bugs and issues
 */
export function BugReportModal({ open, onOpenChange }: BugReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: '',
    attachments: [] as File[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success toast
      toast.success('Bug report submitted', {
        description: 'Thank you for helping us improve the application',
      });

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        severity: '',
        attachments: [],
      });
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to submit bug report', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    // Reset form when modal is closed
    if (!open) {
      setFormData({
        title: '',
        description: '',
        severity: '',
        attachments: [],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Help us improve by reporting bugs and issues you encounter
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 px-1">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Brief description of the bug"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the bug in detail. Include:&#10;&#10;Steps to Reproduce:&#10;1. Go to the Reservations page&#10;2. Click on 'Create New Booking'&#10;3. Select a date and click 'Save'&#10;4. Notice the error message appears&#10;&#10;Expected Behavior:&#10;The booking should be saved successfully and appear in the list&#10;&#10;Actual Behavior:&#10;An error message 'Failed to save booking' appears and nothing is saved"
              rows={10}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="severity">
              Severity <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData({ ...formData, severity: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor issue, workaround available</SelectItem>
                <SelectItem value="medium">Medium - Affects functionality but not critical</SelectItem>
                <SelectItem value="high">High - Major functionality broken</SelectItem>
                <SelectItem value="critical">Critical - Application unusable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Screenshots or Files (optional)</Label>
            <FileUpload
              multiple
              onFilesChange={(files) => setFormData({ ...formData, attachments: files })}
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.description || !formData.severity}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

