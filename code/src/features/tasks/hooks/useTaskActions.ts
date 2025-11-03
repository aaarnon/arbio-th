import { toast } from 'sonner';
import { useCaseContext } from '@/store/CaseContext';
import { useStatusValidation } from './useStatusValidation';
import type { Task } from '@/types';

/**
 * Custom hook for task actions
 * Provides functions to update task status and other properties
 */
export function useTaskActions(caseId: string) {
  const { state, dispatch } = useCaseContext();
  const { validateStatusChange } = useStatusValidation();

  /**
   * Find a task by ID recursively
   */
  const findTask = (tasks: Task[], taskId: string): Task | null => {
    for (const task of tasks) {
      if (task.id === taskId) return task;
      if (task.subtasks) {
        const found = findTask(task.subtasks, taskId);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * Update a task's status with validation
   */
  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    try {
      // Find the case and task
      const caseData = state.cases.find((c) => c.id === caseId);
      if (!caseData) {
        toast.error('Case not found');
        return;
      }

      const task = findTask(caseData.tasks || [], taskId);
      if (!task) {
        toast.error('Task not found');
        return;
      }

      // Validate the status change
      const validation = validateStatusChange(task, newStatus);
      if (!validation.valid) {
        toast.error('Cannot change status', {
          description: validation.message,
        });
        return;
      }

      // Perform the update
      dispatch({
        type: 'UPDATE_TASK_STATUS',
        payload: {
          caseId,
          taskId,
          status: newStatus,
        },
      });

      toast.success('Task status updated', {
        description: `Task ${taskId} is now ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      toast.error('Failed to update task status', {
        description: 'Please try again',
      });
    }
  };

  /**
   * Update a task with partial updates
   */
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    try {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          caseId,
          taskId,
          updates,
        },
      });

      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task', {
        description: 'Please try again',
      });
    }
  };

  /**
   * Delete a task
   */
  const deleteTask = (taskId: string) => {
    try {
      dispatch({
        type: 'DELETE_TASK',
        payload: {
          caseId,
          taskId,
        },
      });

      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task', {
        description: 'Please try again',
      });
    }
  };

  return {
    updateTaskStatus,
    updateTask,
    deleteTask,
  };
}

