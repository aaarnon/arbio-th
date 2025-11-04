import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCaseContext } from '@/store/CaseContext';
import { CaseSidebar } from '@/features/case-detail/components/CaseSidebar';
import { TaskItem } from '@/features/tasks/components/TaskItem';
import { CreateSubtaskForm } from '@/features/tasks/components/CreateSubtaskForm';
import { useTaskActions } from '@/features/tasks/hooks/useTaskActions';
import { AddCommentForm } from '@/features/comments/components/AddCommentForm';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { EntityHeader } from '@/components/shared/EntityHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { mockUsers } from '@/data/mockUsers';
import { toast } from 'sonner';
import type { Task } from '@/types';

/**
 * Task Detail Page
 * Displays a parent task with its subtasks, description, comments, and attachments
 * Similar layout to CaseDetail but focused on a specific task
 */
export function TaskDetail() {
  const { caseId, taskId } = useParams<{ caseId: string; taskId: string }>();
  const { state, dispatch } = useCaseContext();
  const navigate = useNavigate();

  // Find the case
  const caseData = state.cases.find((c) => c.id === caseId);

  // Get task actions for this case
  const { updateTaskStatus } = useTaskActions(caseId || '');

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-neutral-800 mb-2">Case not found</h1>
          <p className="text-neutral-500 mb-4">The case you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Cases</Button>
        </div>
      </div>
    );
  }

  // Find the task (search all tasks and subtasks recursively)
  const findTask = (tasks: Task[] = [], id: string): Task | null => {
    for (const task of tasks) {
      if (task.id === id) return task;
      if (task.subtasks) {
        const found = findTask(task.subtasks, id);
        if (found) return found;
      }
    }
    return null;
  };

  const task = findTask(caseData.tasks || [], taskId || '');

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-neutral-800 mb-2">Task not found</h1>
          <p className="text-neutral-500 mb-4">The task you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`/cases/${caseId}`)}>Back to Case</Button>
        </div>
      </div>
    );
  }

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Handle status/domain changes
  const handleStatusChange = (newStatus: string) => {
    updateTaskStatus(task.id, newStatus as any);
  };

  const handleDomainChange = (newDomain: string) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        caseId: caseId || '',
        taskId: task.id,
        updates: { domain: newDomain as any },
      },
    });
    toast.success('Domain updated');
  };

  return (
    <>
      {/* Main Content - With right margin for sidebar */}
      <div className="mr-96 space-y-8">
        {/* Task Header */}
        <EntityHeader
          breadcrumbs={[
            { label: 'Ticketing Hub', to: '/' },
            { label: caseData.id, to: `/cases/${caseId}` },
            { label: task.id },
          ]}
          title={task.title}
          status={task.status}
          domain={task.domain || caseData.domain}
          onStatusChange={handleStatusChange}
          onDomainChange={handleDomainChange}
        />

        {/* Task Description */}
        {task.description && (
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">
                DESCRIPTION
              </h2>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap font-normal leading-relaxed">
                {task.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Subtasks Section */}
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">
              SUBTASKS
            </h2>
          </CardHeader>
          <CardContent className="pt-0">
            {hasSubtasks && (
              <div className="space-y-2 mb-6">
                {task.subtasks!.map((subtask) => (
                  <TaskItem
                    key={subtask.id}
                    task={subtask}
                    depth={0}
                    caseId={caseId || ''}
                    onStatusChange={updateTaskStatus}
                  />
                ))}
              </div>
            )}
            
            {/* Add Subtask Button/Form */}
            {isAddingSubtask ? (
              <CreateSubtaskForm 
                caseId={caseId || ''} 
                parentTask={task}
                onSuccess={() => setIsAddingSubtask(false)}
                onCancel={() => setIsAddingSubtask(false)}
              />
            ) : (
              <Button
                variant="ghost"
                onClick={() => setIsAddingSubtask(true)}
                className="w-full justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add subtask
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Comments Section - Unified (from parent case) */}
        <div className="bg-white rounded-card p-8 space-y-6">
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">COMMENTS</h2>
          
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

        {/* Attachments Section (from parent case) */}
        <AttachmentList attachments={caseData.attachments || []} />
      </div>

      {/* Fixed Right Sidebar */}
      <div className="fixed top-16 right-0 bottom-0 w-96">
        <CaseSidebar case={caseData} />
      </div>
    </>
  );
}

