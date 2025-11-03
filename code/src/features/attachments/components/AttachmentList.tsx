import type { Attachment } from '@/types';
import { AttachmentItem } from './AttachmentItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttachmentListProps {
  attachments: Attachment[];
}

/**
 * Attachment List Component
 * Displays all attachments for a case in a grid
 */
export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No attachments yet"
            message="Attachments uploaded to this case will appear here"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Attachments ({attachments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attachments.map((attachment) => (
            <AttachmentItem key={attachment.id} attachment={attachment} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

