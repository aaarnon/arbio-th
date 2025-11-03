import type { Task, Status } from '@/types';
import { canMarkTaskAsDone } from '@/utils/validation';

interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Custom hook for task status validation
 * Provides validation rules for status changes
 */
export function useStatusValidation() {
  /**
   * Check if a task can be marked as DONE
   * Returns validation result with error message if invalid
   */
  const canMarkAsDone = (task: Task): ValidationResult => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return { valid: true };
    }

    const allSubtasksComplete = canMarkTaskAsDone(task);
    
    if (!allSubtasksComplete) {
      const pendingSubtasks = task.subtasks.filter(
        (st) => st.status !== 'DONE' && st.status !== 'CANCELLED'
      );
      
      return {
        valid: false,
        message: `Cannot mark task as DONE. ${pendingSubtasks.length} subtask${pendingSubtasks.length > 1 ? 's' : ''} still incomplete.`,
      };
    }

    return { valid: true };
  };

  /**
   * Validate a status change for a task
   * Returns validation result with error message if invalid
   */
  const validateStatusChange = (task: Task, newStatus: Status): ValidationResult => {
    // If changing to DONE, check subtasks
    if (newStatus === 'DONE') {
      return canMarkAsDone(task);
    }

    // If changing from DONE to something else and has subtasks that are DONE,
    // warn but allow (this reopens work)
    // At this point, TypeScript knows newStatus is not 'DONE', so we don't need to check it
    if (task.status === 'DONE') {
      if (task.subtasks && task.subtasks.some((st) => st.status === 'DONE')) {
        // This is allowed but we could add a warning in the future
        return { valid: true };
      }
    }

    // All other status changes are valid
    return { valid: true };
  };

  /**
   * Get a list of invalid subtasks (not DONE or CANCELLED)
   */
  const getIncompleteSubtasks = (task: Task): Task[] => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return [];
    }

    return task.subtasks.filter(
      (st) => st.status !== 'DONE' && st.status !== 'CANCELLED'
    );
  };

  /**
   * Check if a specific status option should be disabled
   */
  const isStatusDisabled = (task: Task, status: Status): boolean => {
    if (status === 'DONE') {
      const result = canMarkAsDone(task);
      return !result.valid;
    }
    return false;
  };

  return {
    canMarkAsDone,
    validateStatusChange,
    getIncompleteSubtasks,
    isStatusDisabled,
  };
}


