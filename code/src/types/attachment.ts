/**
 * Attachment interface
 * Represents a file attached to a case
 */
export interface Attachment {
  /** Unique attachment identifier */
  id: string;
  
  /** ID of the case this attachment belongs to (optional when nested in Case) */
  caseId?: string;
  
  /** Original file name */
  fileName: string;
  
  /** MIME type of the file */
  fileType: string;
  
  /** File size in bytes */
  fileSize: number;
  
  /** ID of the user who uploaded the file */
  uploadedBy: string;
  
  /** Timestamp when file was uploaded */
  uploadedAt: string;
  
  /** URL to access the file */
  url: string;
}

