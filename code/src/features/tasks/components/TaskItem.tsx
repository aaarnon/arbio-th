import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Task, Status } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatusDropdown } from '@/components/shared/StatusDropdown';
import { useStatusValidation } from '@/features/tasks/hooks/useStatusValidation';
import { mockUsers } from '@/data/mockUsers';
import { MAX_NESTING_DEPTH } from '@/utils/constants';

interface TaskItemProps {
  task: Task;
  depth: number;
  caseId: string;
  onStatusChange?: (taskId: string, newStatus: Status) => void;
  onAssignedToChange?: (taskId: string, newUserId: string) => void;
  onAddTask?: () => void;
}

/**
 * Task Item Component
 * Recursively renders tasks with their subtasks
 * Supports expand/collapse for tasks with subtasks
 */
export function TaskItem({ task, depth, caseId, onStatusChange, onAssignedToChange, onAddTask }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<'status' | 'assignee' | null>(null);
  const { isStatusDisabled, getIncompleteSubtasks } = useStatusValidation();
  const navigate = useNavigate();
  const { taskId: currentTaskId } = useParams();
  
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const indent = depth * 24; // 24px per nesting level
  const isDoneDisabled = isStatusDisabled(task, 'DONE');
  const incompleteSubtasks = getIncompleteSubtasks(task);

  // Prevent infinite recursion
  if (depth > MAX_NESTING_DEPTH) {
    return (
      <div className="text-sm text-red-600">
        Maximum nesting depth exceeded
      </div>
    );
  }

  // Find assigned user
  const assignedUser = task.assignedTo 
    ? mockUsers.find(u => u.id === task.assignedTo)
    : null;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTaskClick = () => {
    // Navigate to task detail page for any task/subtask (unless we're already viewing this task)
    if (currentTaskId !== task.id) {
      navigate(`/cases/${caseId}/tasks/${task.id}`);
    }
  };

  return (
    <div 
      className=""
      style={{ marginLeft: `${indent}px` }}
      role="treeitem"
      aria-expanded={hasSubtasks ? isExpanded : undefined}
      aria-level={depth + 1}
    >
      {/* Task Row */}
      <div className="group flex items-center gap-3 h-12 px-3 hover:bg-neutral-50 rounded-subtle mb-2 transition-colors">
        {/* Expand/Collapse Button or Em-dash indicator */}
        {hasSubtasks ? (
          <button
            onClick={handleToggleExpand}
            className="h-5 w-5 p-0 hover:bg-neutral-100 rounded flex items-center justify-center"
            aria-label={isExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
          >
            <svg
              className={`h-3 w-3 transition-transform text-neutral-500 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <div className="h-5 w-5 flex items-center justify-center">
            <span className="text-neutral-300 text-sm">—</span>
          </div>
        )}

        {/* Task ID */}
        <span className="text-xs font-mono text-neutral-400 min-w-[60px]">
          {task.id}
        </span>

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          {currentTaskId !== task.id ? (
            <button
              onClick={handleTaskClick}
              className="text-sm font-normal text-neutral-800 truncate hover:text-neutral-900 hover:underline text-left w-full"
            >
              {task.title}
            </button>
          ) : (
            <p className="text-sm font-normal text-neutral-800 truncate">
              {task.title}
            </p>
          )}
        </div>

        {/* Status Badge with Dropdown */}
        <StatusDropdown
          currentStatus={task.status}
          onStatusChange={(newStatus) => onStatusChange?.(task.id, newStatus as Status)}
          disabled={isDoneDisabled}
          disabledMessage={
            isDoneDisabled && incompleteSubtasks.length > 0
              ? `Complete ${incompleteSubtasks.length} subtask${incompleteSubtasks.length > 1 ? 's' : ''} first`
              : undefined
          }
          open={openDropdown === 'status'}
          onOpenChange={(isOpen) => setOpenDropdown(isOpen ? 'status' : null)}
          trigger={
            <button className="focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded">
              <StatusBadge status={task.status} className="text-xs cursor-pointer hover:opacity-80" />
            </button>
          }
        />

        {/* Assigned User with Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'assignee' ? null : 'assignee');
            }}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition-colors px-2 py-1 rounded hover:bg-neutral-100"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden sm:inline">
              {assignedUser ? assignedUser.name.split(' ')[0] : 'Not assigned'}
            </span>
          </button>

          {/* Assignee Dropdown */}
          {openDropdown === 'assignee' && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
              <button
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssignedToChange?.(task.id, '');
                  setOpenDropdown(null);
                }}
              >
                <span className="text-neutral-500">Not assigned</span>
                {!task.assignedTo && (
                  <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssignedToChange?.(task.id, user.id);
                    setOpenDropdown(null);
                  }}
                >
                  <span className="text-neutral-900">{user.name}</span>
                  {task.assignedTo === user.id && (
                    <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recursive Subtasks */}
      {hasSubtasks && isExpanded && (
        <div className="ml-4" role="group">
          {task.subtasks!.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              depth={depth + 1}
              caseId={caseId}
              onStatusChange={onStatusChange}
              onAssignedToChange={onAssignedToChange}
              onAddTask={onAddTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

