import type { Task } from '@/types';

/**
 * Check if a task can be marked as DONE
 * A task can only be marked as DONE if all its subtasks are either DONE or CANCELLED
 * 
 * @param task - The task to validate
 * @returns true if the task can be marked as DONE, false otherwise
 * 
 * @example
 * const task = { subtasks: [{ status: 'DONE' }, { status: 'TODO' }] };
 * canMarkTaskAsDone(task); // false
 * 
 * @example
 * const task = { subtasks: [{ status: 'DONE' }, { status: 'CANCELLED' }] };
 * canMarkTaskAsDone(task); // true
 */
export function canMarkTaskAsDone(task: Task): boolean {
  // If task has no subtasks, it can be marked as done
  if (!task.subtasks || task.subtasks.length === 0) {
    return true;
  }
  
  // Check if all subtasks are DONE or CANCELLED
  return task.subtasks.every(
    (subtask) => subtask.status === 'DONE' || subtask.status === 'CANCELLED'
  );
}

