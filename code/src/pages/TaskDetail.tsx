import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCaseContext } from '@/store/CaseContext';
import { CaseSidebar } from '@/features/case-detail/components/CaseSidebar';
import { TaskItem } from '@/features/tasks/components/TaskItem';
import { CreateSubtaskModal } from '@/features/tasks/components/CreateSubtaskModal';
import { useTaskActions } from '@/features/tasks/hooks/useTaskActions';
import { AddCommentForm } from '@/features/comments/components/AddCommentForm';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { StatusDropdown } from '@/components/shared/StatusDropdown';
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
  const [openDropdown, setOpenDropdown] = useState<'status' | 'team' | 'domain' | 'assignedTo' | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Find the case
  const caseData = state.cases.find((c) => c.id === caseId);

  // Get task actions for this case
  const { updateTaskStatus, updateTask } = useTaskActions(caseId || '');

  // Helper function to format text
  const formatText = (text: string) => {
    const teamMapping: Record<string, string> = {
      'PROPERTY_MANAGEMENT': 'Property Management',
      'GUEST_COMM': 'Guest Comm',
      'GUEST_EXPERIENCE': 'Guest Experience',
      'FINOPS': 'FinOps',
    };
    
    if (teamMapping[text]) {
      return teamMapping[text];
    }
    
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Helper function to get assigned user name
  const getAssignedUserName = (userId?: string) => {
    if (!userId) return 'Unassigned';
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

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
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(task.description || '');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Sync description with task prop
  useEffect(() => {
    setDescriptionValue(task.description || '');
  }, [task.description]);

  // Focus description textarea when editing starts
  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
      descriptionRef.current.style.height = 'auto';
      descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
    }
  }, [isEditingDescription]);

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        caseId: caseId || '',
        taskId: task.id,
        updates: { title: newTitle },
      },
    });
    toast.success('Title updated');
  };

  // Handle status/team/domain changes
  const handleStatusChange = (newStatus: string) => {
    updateTaskStatus(task.id, newStatus as any);
  };

  const handleTeamChange = (newTeam: string) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        caseId: caseId || '',
        taskId: task.id,
        updates: { team: newTeam as any },
      },
    });
    toast.success('Team updated');
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

  const handleAssignedToChange = (newUserId: string) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        caseId: caseId || '',
        taskId: task.id,
        updates: { assignedTo: newUserId },
      },
    });
    toast.success('Assignment updated');
  };

  // Handle subtask assignee change
  const handleTaskAssignedToChange = (taskId: string, newUserId: string) => {
    updateTask(taskId, { assignedTo: newUserId });
  };

  // Handle description save
  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (descriptionValue.trim() !== (task.description || '')) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          caseId: caseId || '',
          taskId: task.id,
          updates: { description: descriptionValue.trim() },
        },
      });
      toast.success('Description updated');
    } else {
      setDescriptionValue(task.description || '');
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDescriptionValue(task.description || '');
      setIsEditingDescription(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  // Generate breadcrumbs for task hierarchy
  // For TK-2848.3.1 -> [TK-2848, TK-2848.3, TK-2848.3.1]
  const generateTaskBreadcrumbs = (): Array<{ label: string; to?: string }> => {
    const breadcrumbs: Array<{ label: string; to?: string }> = [
      { label: 'Ticketing Hub', to: '/' },
      { label: caseData.id, to: `/cases/${caseId}` },
    ];

    // Parse task ID to get hierarchy
    // e.g., TK-2848.3.1.1 -> [TK-2848.3, TK-2848.3.1, TK-2848.3.1.1]
    const taskIdParts = task.id.split('.');
    const caseIdPart = taskIdParts[0]; // e.g., TK-2848
    
    // Build parent task IDs
    for (let i = 1; i < taskIdParts.length; i++) {
      const parentTaskId = [caseIdPart, ...taskIdParts.slice(1, i + 1)].join('.');
      
      // Don't link the current task (last item)
      if (i === taskIdParts.length - 1) {
        breadcrumbs.push({ label: parentTaskId });
      } else {
        breadcrumbs.push({ 
          label: parentTaskId, 
          to: `/cases/${caseId}/tasks/${parentTaskId}` 
        });
      }
    }

    return breadcrumbs;
  };

  // Determine parent (case or parent task)
  const getParentInfo = (): { name: string; link: string; id: string } | null => {
    const taskIdParts = task.id.split('.');
    
    // If task is TK-2847.1, parent is case TK-2847
    if (taskIdParts.length === 2) {
      return {
        id: caseData.id,
        name: caseData.title,
        link: `/cases/${caseId}`,
      };
    }
    
    // If task is TK-2847.1.1 or deeper, parent is the task one level up
    if (taskIdParts.length > 2) {
      const parentTaskId = taskIdParts.slice(0, -1).join('.');
      const parentTask = findTask(caseData.tasks || [], parentTaskId);
      
      if (parentTask) {
        return {
          id: parentTask.id,
          name: parentTask.title,
          link: `/cases/${caseId}/tasks/${parentTaskId}`,
        };
      }
    }
    
    return null;
  };

  const parentInfo = getParentInfo();

  return (
    <>
      {/* Main Content - With right margin for sidebar */}
      <div className="mr-96 space-y-8">
        {/* Task Header */}
        <div>
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-neutral-600">
            {generateTaskBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-neutral-900 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-neutral-900 font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Title - Inline Editable */}
          <h1
            onClick={() => handleTitleChange && setIsEditingTitle(true)}
            className="mb-2 text-3xl font-normal text-neutral-900 cursor-text hover:bg-neutral-50 rounded px-2 -mx-2 transition-colors"
          >
            {task.title}
          </h1>

          {/* Parent Link - positioned after title, before status */}
          {parentInfo && (
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
              </svg>
              <button
                onClick={() => navigate(parentInfo.link)}
                className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Linked to{' '}
                <span className="text-neutral-900 font-medium">{parentInfo.id}</span>
                {' '}
                {parentInfo.name}
              </button>
            </div>
          )}

          {/* Status Row */}
          <div className="mb-3 flex items-center">
            <div className="w-24 text-sm text-neutral-600">Status</div>
            <StatusDropdown
              currentStatus={task.status}
              onStatusChange={(newStatus) => handleStatusChange(newStatus)}
              open={openDropdown === 'status'}
              onOpenChange={(isOpen) => setOpenDropdown(isOpen ? 'status' : null)}
              trigger={
                <button className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900">
                  {formatText(task.status)}
                  <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              }
            />
          </div>

          {/* Properties Row */}
          <div className="flex items-center">
            <div className="w-24 text-sm text-neutral-600">Properties</div>
            <div className="flex items-center gap-6">
              {/* Team */}
              {(task.team || caseData.team) && (
                <div className="relative">
                  <button 
                    className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
                    onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
                  >
                    <span className="font-normal text-neutral-400">Team:</span>
                    <span className="ml-1">{formatText(task.team || caseData.team)}</span>
                  </button>
                </div>
              )}

              {/* Domain */}
              {(task.domain || caseData.domain) && (
                <div className="relative">
                  <button 
                    className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
                    onClick={() => setOpenDropdown(openDropdown === 'domain' ? null : 'domain')}
                  >
                    <span className="font-normal text-neutral-400">Domain:</span>
                    <span className="ml-1">{formatText(task.domain || caseData.domain)}</span>
                  </button>
                </div>
              )}

              {/* Assigned To */}
              {(task.assignedTo || caseData.assignedTo) && (
                <div className="relative">
                  <button 
                    className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
                    onClick={() => setOpenDropdown(openDropdown === 'assignedTo' ? null : 'assignedTo')}
                  >
                    <span className="font-normal text-neutral-400">Assigned To:</span>
                    <span className="ml-1">{getAssignedUserName(task.assignedTo || caseData.assignedTo)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Description - Inline Editable */}
        <Card>
          <CardHeader className="pb-6">
            <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">
              DESCRIPTION
            </h2>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditingDescription ? (
              <textarea
                ref={descriptionRef}
                value={descriptionValue}
                onChange={handleDescriptionChange}
                onBlur={handleDescriptionBlur}
                onKeyDown={handleDescriptionKeyDown}
                className="w-full text-sm text-neutral-700 font-normal leading-relaxed bg-transparent border-none outline-none focus:outline-none resize-none"
                placeholder="Enter description..."
                rows={3}
              />
            ) : (
              <p
                onClick={() => setIsEditingDescription(true)}
                className="text-sm text-neutral-700 whitespace-pre-wrap font-normal leading-relaxed cursor-text hover:bg-neutral-50 rounded p-2 -m-2 transition-colors"
              >
                {task.description || 'Click to add description...'}
              </p>
            )}
          </CardContent>
        </Card>

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
                    onAssignedToChange={handleTaskAssignedToChange}
                  />
                ))}
              </div>
            )}
            
            {/* Add Subtask Button */}
            <Button
              variant="ghost"
              onClick={() => setIsCreateSubtaskModalOpen(true)}
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
          </CardContent>
        </Card>

        {/* Attachments Section (from parent case) */}
        <AttachmentList attachments={caseData.attachments || []} />

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
      </div>

      {/* Fixed Right Sidebar */}
      <div className="fixed top-16 right-0 bottom-0 w-96">
        <CaseSidebar case={caseData} />
      </div>

      {/* Create Subtask Modal */}
      <CreateSubtaskModal
        open={isCreateSubtaskModalOpen}
        onOpenChange={setIsCreateSubtaskModalOpen}
        caseId={caseId || ''}
        parentTask={task}
      />
    </>
  );
}

