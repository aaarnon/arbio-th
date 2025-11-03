import type { Task, Status } from '@/types';
import { TaskItem } from './TaskItem';
import { CreateTaskForm } from './CreateTaskForm';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HierarchicalTaskListProps {
  tasks: Task[];
  caseId: string;
  onStatusChange?: (taskId: string, newStatus: Status) => void;
}

/**
 * Hierarchical Task List Component
 * Displays a tree structure of tasks and subtasks
 */
export function HierarchicalTaskList({ tasks, caseId, onStatusChange }: HierarchicalTaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No tasks yet"
            message="Tasks will be added to track the work needed to resolve this case."
            icon={
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            }
          />
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <p className="mt-1 text-sm text-gray-600">
              {doneTasks} of {totalTasks} tasks completed ({completionPercentage}%)
              {inProgressTasks > 0 && ` · ${inProgressTasks} in progress`}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div role="tree" className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              depth={0}
              caseId={caseId}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
        
        {/* Add Task Form */}
        <div className="mt-4">
          <CreateTaskForm caseId={caseId} />
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

