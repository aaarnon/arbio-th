import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/types';
import { mockUsers } from '@/data/mockUsers';
import { Card, CardContent } from '@/components/ui/card';

interface CommentItemProps {
  comment: Comment;
}

/**
 * Comment Item Component
 * Displays a single comment with author info and timestamp
 */
export function CommentItem({ comment }: CommentItemProps) {
  const author = mockUsers.find((u) => u.id === comment.author);
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              {author?.name.charAt(0) || '?'}
            </div>
            
            {/* Author Info */}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {author?.name || 'Unknown User'}
              </p>
              <p className="text-xs text-gray-500">
                {author?.role || 'Team Member'}
              </p>
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-xs text-gray-500" title={comment.createdAt}>
            {timeAgo}
          </span>
        </div>

        {/* Comment Text */}
        <p className="text-sm text-gray-700 whitespace-pre-wrap ml-10">
          {comment.text}
        </p>
      </CardContent>
    </Card>
  );
}

