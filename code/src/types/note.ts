/**
 * Note interface
 * Represents a note on a reservation
 */
export interface Note {
  /** Unique note identifier */
  id: string;
  
  /** ID of the reservation this note belongs to */
  reservationId: string;
  
  /** ID of the user who wrote the note */
  author: string;
  
  /** Note text content */
  text: string;
  
  /** Timestamp when note was created */
  createdAt: string;
}









