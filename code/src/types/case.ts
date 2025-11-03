import type { Status, DomainType } from './enums';
import type { Task } from './task';
import type { Comment } from './comment';
import type { Attachment } from './attachment';

/**
 * Main Case interface
 * Represents a support/work case with hierarchical tasks
 */
export interface Case {
  /** Unique case identifier (e.g., TK-2847) */
  id: string;
  
  /** Case title/summary */
  title: string;
  
  /** Detailed case description */
  description: string;
  
  /** Current status of the case */
  status: Status;
  
  /** Business domain this case belongs to */
  domain: DomainType;
  
  /** Linked property ID (optional) */
  propertyId?: string;
  
  /** Linked reservation ID (optional) */
  reservationId?: string;
  
  /** User assigned to this case */
  assignedTo?: string;
  
  /** Hierarchical task list */
  tasks: Task[];
  
  /** Case comments */
  comments?: Comment[];
  
  /** File attachments */
  attachments?: Attachment[];
  
  /** Timestamp when case was created */
  createdAt: string;
  
  /** Timestamp when case was last updated */
  updatedAt: string;
}

