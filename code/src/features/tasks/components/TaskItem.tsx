import { useState } from 'react';
import type { Task, Status } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStatusValidation } from '@/features/tasks/hooks/useStatusValidation';
import { CreateSubtaskForm } from './CreateSubtaskForm';
import { EditTaskForm } from './EditTaskForm';
import { mockUsers } from '@/data/mockUsers';
import { MAX_NESTING_DEPTH } from '@/utils/constants';

interface TaskItemProps {
  task: Task;
  depth: number;
  caseId: string;
  onStatusChange?: (taskId: string, newStatus: Status) => void;
}

/**
 * Task Item Component
 * Recursively renders tasks with their subtasks
 * Supports expand/collapse for tasks with subtasks
 */
export function TaskItem({ task, depth, caseId, onStatusChange }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isStatusDisabled, getIncompleteSubtasks } = useStatusValidation();
  
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

  return (
    <div 
      className="border-l-2 border-gray-200"
      style={{ marginLeft: `${indent}px` }}
      role="treeitem"
      aria-expanded={hasSubtasks ? isExpanded : undefined}
      aria-level={depth + 1}
    >
      {/* Task Row */}
      <div className="group flex items-center gap-3 rounded-lg bg-white p-3 hover:bg-gray-50 border border-gray-200 mb-2">
        {/* Expand/Collapse Button */}
        {hasSubtasks ? (
          <Button
            onClick={handleToggleExpand}
            className="h-6 w-6 p-0 hover:bg-gray-200"
            aria-label={isExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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
          </Button>
        ) : (
          <div className="h-6 w-6" /> // Spacer for alignment
        )}

        {/* Task ID */}
        <span className="text-xs font-mono text-gray-500 min-w-[60px]">
          {task.id}
        </span>

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-600 truncate mt-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Status Badge with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
              <StatusBadge status={task.status} className="text-xs cursor-pointer hover:opacity-80" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange?.(task.id, 'TODO')}>
              <span className="text-gray-600">● To Do</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(task.id, 'IN_PROGRESS')}>
              <span className="text-blue-600">● In Progress</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => !isDoneDisabled && onStatusChange?.(task.id, 'DONE')}
              disabled={isDoneDisabled}
              className={isDoneDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <span className="text-green-600">● Done</span>
              {isDoneDisabled && incompleteSubtasks.length > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  ({incompleteSubtasks.length} subtask{incompleteSubtasks.length > 1 ? 's' : ''})
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(task.id, 'CANCELLED')}>
              <span className="text-red-600">● Cancelled</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Assigned User */}
        {assignedUser && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden sm:inline">{assignedUser.name.split(' ')[0]}</span>
          </div>
        )}

        {/* Subtask Count Indicator */}
        {hasSubtasks && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>{task.subtasks!.length}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add Subtask Button */}
          <Button
            className="h-6 w-6 p-0 hover:bg-gray-200"
            onClick={() => {
              setIsAddingSubtask(true);
              setIsExpanded(true);
            }}
            aria-label="Add subtask"
            title="Add subtask"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Button>
          
          {/* Edit Button */}
          <Button
            className="h-6 w-6 p-0 hover:bg-gray-200"
            onClick={() => {
              setIsEditing(true);
              setIsExpanded(true);
            }}
            aria-label="Edit task"
            title="Edit task"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Edit Task Form */}
      {isEditing && (
        <div className="mt-2">
          <EditTaskForm
            caseId={caseId}
            task={task}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}

      {/* Add Subtask Form */}
      {isAddingSubtask && !isEditing && (
        <div className="mt-2">
          <CreateSubtaskForm
            caseId={caseId}
            parentTask={task}
            onSuccess={() => setIsAddingSubtask(false)}
            onCancel={() => setIsAddingSubtask(false)}
          />
        </div>
      )}

      {/* Recursive Subtasks */}
      {hasSubtasks && isExpanded && !isEditing && (
        <div className="ml-4" role="group">
          {task.subtasks!.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              depth={depth + 1}
              caseId={caseId}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

