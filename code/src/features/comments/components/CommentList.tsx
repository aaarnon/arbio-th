import type { Comment } from '@/types';
import { CommentItem } from './CommentItem';
import { EmptyState } from '@/components/shared/EmptyState';

interface CommentListProps {
  comments: Comment[];
}

/**
 * Comment List Component - Linear-inspired unified section
 * Displays all comments for a case with clean separation
 */
export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="bg-white rounded-card p-8">
      {/* Header */}
      <h2 className="text-xl font-medium text-neutral-900 mb-6">Comments</h2>
      
      {/* Comments */}
      {comments.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="No comments yet"
            message="Be the first to add a comment"
          />
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

