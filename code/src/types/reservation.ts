/**
 * Reservation interface
 * Represents a guest booking/reservation
 */
export interface Reservation {
  /** Unique reservation identifier */
  id: string;
  
  /** Guest's full name */
  guestName: string;
  
  /** Guest's email address */
  guestEmail: string;
  
  /** Guest's phone number */
  guestPhone?: string;
  
  /** Associated property ID */
  propertyId: string;
  
  /** Check-in date (ISO string) */
  checkIn: string;
  
  /** Check-out date (ISO string) */
  checkOut: string;
  
  /** Number of nights */
  nights?: number;
  
  /** Number of guests */
  numberOfGuests?: number;
  
  /** Total reservation value */
  totalValue: number;
  
  /** Reservation status */
  status: 'CONFIRMED' | 'IN_HOUSE' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
}

