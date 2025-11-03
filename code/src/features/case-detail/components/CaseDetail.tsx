import { useParams, useNavigate } from 'react-router-dom';
import { useCaseContext } from '@/store/CaseContext';
import { CaseHeader } from './CaseHeader';
import { CaseDescription } from './CaseDescription';
import { HierarchicalTaskList } from '@/features/tasks/components/HierarchicalTaskList';
import { useTaskActions } from '@/features/tasks/hooks/useTaskActions';
import { CommentList } from '@/features/comments/components/CommentList';
import { AddCommentForm } from '@/features/comments/components/AddCommentForm';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { Button } from '@/components/ui/button';

/**
 * Case Detail Component
 * Main component for displaying full case details
 */
export function CaseDetail() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { state } = useCaseContext();

  // Find the case by ID
  const caseData = state.cases.find((c) => c.id === caseId);
  
  // Get task actions for this case
  const { updateTaskStatus } = useTaskActions(caseId || '');

  // Handle case not found
  if (!caseData) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <svg
          className="mb-4 h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Case not found</h2>
        <p className="mb-6 text-gray-600">
          The case you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/')}>
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Cases
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button className="hover:bg-gray-100" size="sm" onClick={() => navigate('/')}>
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Cases
      </Button>

      {/* Case Header */}
      <CaseHeader case={caseData} />

      {/* Case Description */}
      <CaseDescription case={caseData} />

      {/* Hierarchical Task List */}
      <HierarchicalTaskList 
        tasks={caseData.tasks || []}
        caseId={caseData.id}
        onStatusChange={updateTaskStatus}
      />

      {/* Comments Section */}
      <div className="space-y-4">
        <AddCommentForm caseId={caseData.id} />
        <CommentList comments={caseData.comments || []} />
      </div>

      {/* Attachments Section */}
      <AttachmentList attachments={caseData.attachments || []} />
    </div>
  );
}

