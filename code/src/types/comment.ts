/**
 * Comment interface
 * Represents a comment on a case
 */
export interface Comment {
  /** Unique comment identifier */
  id: string;
  
  /** ID of the case this comment belongs to (optional when nested in Case) */
  caseId?: string;
  
  /** ID of the user who wrote the comment */
  author: string;
  
  /** Comment text content */
  text: string;
  
  /** Timestamp when comment was created */
  createdAt: string;
}

