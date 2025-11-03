import { useParams, useNavigate } from 'react-router-dom';
import { useCaseContext } from '@/store/CaseContext';
import { CaseHeader } from './CaseHeader';
import { CaseDescription } from './CaseDescription';
import { CaseSidebar } from './CaseSidebar';
import { HierarchicalTaskList } from '@/features/tasks/components/HierarchicalTaskList';
import { useTaskActions } from '@/features/tasks/hooks/useTaskActions';
import { AddCommentForm } from '@/features/comments/components/AddCommentForm';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/data/mockUsers';

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
    <>
      {/* Main Content - With right margin for sidebar */}
      <div className="mr-96 space-y-8">
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

        {/* Comments Section - Unified */}
        <div className="bg-white rounded-card p-8 space-y-6">
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">Comments</h2>
          
          {/* Existing Comments */}
          {caseData.comments && caseData.comments.length > 0 && (
            <div className="divide-y divide-neutral-100">
              {caseData.comments.map((comment) => {
                const author = mockUsers.find((u) => u.id === comment.author);
                const timeAgo = comment.createdAt;
                
                return (
                  <div key={comment.id} className="py-6 first:pt-0">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium text-sm">
                          {author?.name.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-sm font-medium text-neutral-900">
                            {author?.name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {new Date(timeAgo).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap font-normal leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Add Comment Form */}
          <div className="pt-4">
            <AddCommentForm caseId={caseData.id} />
          </div>
        </div>

        {/* Attachments Section */}
        <AttachmentList attachments={caseData.attachments || []} />
      </div>

      {/* Right Sidebar - Fixed, Full-Height, Edge-to-Edge */}
      <div className="fixed top-16 right-0 bottom-0 w-96">
        <CaseSidebar case={caseData} />
      </div>
    </>
  );
}

