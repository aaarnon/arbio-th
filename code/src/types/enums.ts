/**
 * Status enum for cases and tasks
 * Represents the current state of a case or task
 */
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

/**
 * Domain type enum for case categorization
 * Determines which area of the business the case belongs to
 */
export type DomainType = 'PROPERTY' | 'RESERVATION' | 'FINANCE';

