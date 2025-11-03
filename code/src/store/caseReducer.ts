import type { CaseState, CaseAction } from './types';
import type { Task } from '@/types';

/**
 * Helper function to update a task by ID recursively in the task tree
 */
function updateTaskInTree(
  tasks: Task[],
  taskId: string,
  updater: (task: Task) => Task
): Task[] {
  return tasks.map((task) => {
    if (task.id === taskId) {
      return updater(task);
    }
    if (task.subtasks && task.subtasks.length > 0) {
      return {
        ...task,
        subtasks: updateTaskInTree(task.subtasks, taskId, updater),
      };
    }
    return task;
  });
}

/**
 * Helper function to delete a task by ID recursively in the task tree
 */
function deleteTaskInTree(tasks: Task[], taskId: string): Task[] {
  return tasks
    .filter((task) => task.id !== taskId)
    .map((task) => {
      if (task.subtasks && task.subtasks.length > 0) {
        return {
          ...task,
          subtasks: deleteTaskInTree(task.subtasks, taskId),
        };
      }
      return task;
    });
}

/**
 * Case reducer - handles all case-related state updates
 * All updates are immutable and include timestamp updates
 */
export function caseReducer(state: CaseState, action: CaseAction): CaseState {
  switch (action.type) {
    case 'ADD_CASE':
      return {
        ...state,
        cases: [...state.cases, action.payload],
      };

    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                ...action.payload.updates,
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };

    case 'DELETE_CASE':
      return {
        ...state,
        cases: state.cases.filter((c) => c.id !== action.payload),
      };

    case 'ADD_TASK':
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                tasks: [...(c.tasks || []), action.payload.task],
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };

    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                tasks: updateTaskInTree(c.tasks || [], action.payload.taskId, (task) => ({
                  ...task,
                  status: action.payload.status,
                  updatedAt: new Date().toISOString(),
                })),
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                tasks: updateTaskInTree(c.tasks || [], action.payload.taskId, (task) => ({
                  ...task,
                  ...action.payload.updates,
                  updatedAt: new Date().toISOString(),
                })),
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                tasks: deleteTaskInTree(c.tasks || [], action.payload.taskId),
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                comments: [...(c.comments || []), action.payload.comment],
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };

    case 'ADD_ATTACHMENT':
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                attachments: [...(c.attachments || []), action.payload.attachment],
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

