import { useState } from 'react';
import type { Attachment } from '@/types';
import { AttachmentItem } from './AttachmentItem';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';

interface AttachmentListProps {
  attachments: Attachment[];
}

/**
 * Attachment List Component - Linear-inspired minimal design
 * Displays all attachments for a case in a compact list
 */
export function AttachmentList({ attachments }: AttachmentListProps) {
  const [localAttachments, setLocalAttachments] = useState(attachments);

  const handleRemove = (attachmentId: string) => {
    // In a real app, this would call an API
    setLocalAttachments(prev => prev.filter(a => a.id !== attachmentId));
    toast.success('Attachment removed');
  };

  const handleAddAttachment = () => {
    // In a real app, this would open a file picker
    toast.info('File upload coming soon');
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">
          ATTACHMENTS {localAttachments.length > 0 && `(${localAttachments.length})`}
        </h2>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Attachment List */}
        <div className="space-y-1">
          {localAttachments.map((attachment) => (
            <AttachmentItem 
              key={attachment.id} 
              attachment={attachment}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Add Attachment Button */}
        <button
          onClick={handleAddAttachment}
          className="flex items-center gap-2 py-2 px-3 text-sm text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-md transition-colors w-full mt-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add attachment
        </button>
      </CardContent>
    </Card>
  );
}

