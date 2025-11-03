/**
 * Property interface
 * Represents a rental property unit
 */
export interface Property {
  /** Unique property identifier */
  id: string;
  
  /** Property unit identifier/number */
  unitId: string;
  
  /** Full property address */
  address: string;
  
  /** Property status */
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  
  /** Last maintenance date */
  lastMaintenance?: string;
  
  /** Number of bedrooms */
  bedrooms?: number;
  
  /** Number of bathrooms */
  bathrooms?: number;
}

