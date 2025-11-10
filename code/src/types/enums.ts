/**
 * Status enum for cases and tasks
 * Represents the current state of a case or task
 */
export type Status = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE' | 'FAILED' | 'DUPLICATE' | 'REJECTED' | 'CANCELLED';

/**
 * Domain type enum for case categorization
 * Determines which area of the business the case belongs to
 */
export type DomainType = 'PROPERTY' | 'RESERVATION' | 'FINANCE';

/**
 * Team type enum for case assignment
 * Determines which team is responsible for the case
 */
export type TeamType = 
  | 'PROPERTY_MANAGEMENT_DE' 
  | 'PROPERTY_MANAGEMENT_AT' 
  | 'GUEST_COMM_DE' 
  | 'GUEST_COMM_AT' 
  | 'GUEST_EXPERIENCE' 
  | 'FINOPS';

