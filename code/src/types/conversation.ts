/**
 * Conversation Message interface
 * Represents a single message in a conversation thread
 */
export interface ConversationMessage {
  /** Unique message identifier */
  id: string;
  
  /** Sender name */
  senderName: string;
  
  /** Sender role (guest or staff) */
  senderRole: 'guest' | 'staff';
  
  /** Message content */
  content: string;
  
  /** Message timestamp */
  timestamp: string;
  
  /** Optional tag/category */
  tag?: string;
  
  /** Whether message is marked as done */
  isDone?: boolean;
  
  /** Who marked it as done */
  doneBy?: string;
  
  /** When it was marked as done */
  doneAt?: string;
}

/**
 * Conversation Thread interface
 * Represents a conversation with multiple messages
 */
export interface ConversationThread {
  /** Unique thread identifier */
  id: string;
  
  /** Related reservation ID */
  reservationId: string;
  
  /** Messages in this thread */
  messages: ConversationMessage[];
  
  /** Thread creation date */
  createdAt: string;
  
  /** Thread last update date */
  updatedAt: string;
}









