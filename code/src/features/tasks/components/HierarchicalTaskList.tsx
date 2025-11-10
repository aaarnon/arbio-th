import { useNavigate } from 'react-router-dom';
import type { Task, Status } from '@/types';
import { TaskItem } from './TaskItem';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HierarchicalTaskListProps {
  tasks: Task[];
  caseId: string;
  onStatusChange?: (taskId: string, newStatus: Status) => void;
  onAssignedToChange?: (taskId: string, newUserId: string) => void;
}

/**
 * Hierarchical Task List Component
 * Displays a tree structure of tasks and subtasks
 */
export function HierarchicalTaskList({ tasks, caseId, onStatusChange, onAssignedToChange }: HierarchicalTaskListProps) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-6">
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">Tasks</h2>
        </CardHeader>
        <CardContent>
          {/* Action Buttons */}
          <Button
            variant="ghost"
            onClick={() => navigate(`/cases/${caseId}/tasks/new`)}
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
            Add task
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate task statistics
  const totalTasks = countAllTasks(tasks);
  const doneTasks = countTasksByStatus(tasks, 'DONE');
  const inProgressTasks = countTasksByStatus(tasks, 'IN_PROGRESS');
  const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-2">Tasks</h2>
            <p className="text-sm text-neutral-500 font-normal">
              {doneTasks} of {totalTasks} tasks completed ({completionPercentage}%)
              {inProgressTasks > 0 && ` · ${inProgressTasks} in progress`}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neutral-600 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-sm font-normal text-neutral-600">{completionPercentage}%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div role="tree" className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              depth={0}
              caseId={caseId}
              onStatusChange={onStatusChange}
              onAssignedToChange={onAssignedToChange}
              onAddTask={() => navigate(`/cases/${caseId}/tasks/new`)}
            />
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cases/${caseId}/tasks/new`)}
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
            Add task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to count all tasks recursively
 */
function countAllTasks(tasks: Task[]): number {
  return tasks.reduce((count, task) => {
    const subtaskCount = task.subtasks ? countAllTasks(task.subtasks) : 0;
    return count + 1 + subtaskCount;
  }, 0);
}

/**
 * Helper function to count tasks by status recursively
 */
function countTasksByStatus(tasks: Task[], status: Task['status']): number {
  return tasks.reduce((count, task) => {
    const isMatch = task.status === status ? 1 : 0;
    const subtaskCount = task.subtasks ? countTasksByStatus(task.subtasks, status) : 0;
    return count + isMatch + subtaskCount;
  }, 0);
}

