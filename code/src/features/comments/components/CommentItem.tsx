import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/types';
import { mockUsers } from '@/data/mockUsers';

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
    <div className="py-6">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium text-sm">
            {author?.name.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Author and Timestamp */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-sm font-medium text-neutral-900">
              {author?.name || 'Unknown User'}
            </span>
            <span className="text-xs text-neutral-400" title={comment.createdAt}>
              {timeAgo}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-sm text-neutral-700 whitespace-pre-wrap font-normal leading-relaxed">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}

