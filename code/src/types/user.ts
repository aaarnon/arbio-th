/**
 * User interface
 * Represents a system user (staff member)
 */
export interface User {
  /** Unique user identifier */
  id: string;
  
  /** User's full name */
  name: string;
  
  /** User's email address */
  email: string;
  
  /** User's role/title */
  role: string;
  
  /** User's avatar URL */
  avatar?: string;
}

