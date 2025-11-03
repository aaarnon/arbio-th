import type { Status } from './enums';

/**
 * Task interface with recursive structure for hierarchy
 * Supports unlimited nesting via the subtasks property
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  
  /** Task title/summary */
  title: string;
  
  /** Detailed task description */
  description?: string;
  
  /** Current status of the task */
  status: Status;
  
  /** Domain/category of the task */
  domain?: Domain;
  
  /** User assigned to this task */
  assignedTo?: string;
  
  /** Nested subtasks - enables recursive hierarchy */
  subtasks?: Task[];
  
  /** Timestamp when task was created */
  createdAt: string;
  
  /** Timestamp when task was last updated */
  updatedAt: string;
}

