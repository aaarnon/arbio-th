import { formatDistanceToNow } from 'date-fns';
import type { Attachment } from '@/types';
import { mockUsers } from '@/data/mockUsers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AttachmentItemProps {
  attachment: Attachment;
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get file icon based on file type
 */
function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) {
    return (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    );
  }
  if (fileType === 'application/pdf') {
    return (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  }
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

/**
 * Attachment Item Component
 * Displays a single attachment with download button
 */
export function AttachmentItem({ attachment }: AttachmentItemProps) {
  const uploader = mockUsers.find((u) => u.id === attachment.uploadedBy);
  const timeAgo = formatDistanceToNow(new Date(attachment.uploadedAt), { addSuffix: true });

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* File Icon */}
          <div className="flex-shrink-0 text-indigo-500">
            {getFileIcon(attachment.fileType)}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {attachment.fileName}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(attachment.fileSize)} · Uploaded {timeAgo}
            </p>
            <p className="text-xs text-gray-500">
              by {uploader?.name || 'Unknown User'}
            </p>
          </div>

          {/* Download Button */}
          <Button
            size="sm"
            className="flex-shrink-0"
            onClick={() => {
              // In a real app, this would download the file
              window.open(attachment.url, '_blank');
            }}
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

