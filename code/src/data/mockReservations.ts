import type { Reservation } from '@/types/reservation';

/**
 * Mock reservation data for development and testing
 * Represents guest bookings linked to properties
 */
export const mockReservations: Reservation[] = [
  // Sarah Chen reservations - Priority: IN_HOUSE
  {
    id: 'rsv-4d7a2b9e3f1c',
    propertyId: 'DE_BER_001_Darius_01_068_02_01_A001', // LST-001: Luxury Beachfront Villa - Miami
    guestName: 'Sarah Chen',
    guestEmail: 'sarah.chen@email.com',
    guestPhone: '+1 (555) 789-1234',
    checkIn: '2025-11-30T15:00:00Z',
    checkOut: '2027-12-02T11:00:00Z',
    numberOfGuests: 2,
    totalValue: 640.00,
    status: 'IN_HOUSE',
    paidStatus: 'Paid',
  },
  {
    id: 'rsv-9375c9f22eba',
    propertyId: 'DE_BER_001_Darius_01_068_02_01_A001', // LST-001: Luxury Beachfront Villa - Miami
    guestName: 'John Smith',
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1 (555) 123-4567',
    checkIn: '2025-11-15T15:00:00Z',
    checkOut: '2025-11-22T11:00:00Z',
    numberOfGuests: 4,
    totalValue: 1840.00,
    status: 'CONFIRMED',
    paidStatus: 'Pending',
  },
  {
    id: 'rsv-2a8d4f7b3c1e',
    propertyId: 'DE_BER_001_Darius_01_068_02_01_A001', // LST-001: Luxury Beachfront Villa - Miami
    guestName: 'Maria Garcia',
    guestEmail: 'maria.garcia@email.com',
    guestPhone: '+1 (555) 987-6543',
    checkIn: '2025-11-28T15:00:00Z',
    checkOut: '2025-11-29T11:00:00Z',
    numberOfGuests: 2,
    totalValue: 3200.00,
    status: 'CHECKED_OUT',
    paidStatus: 'Paid',
  },
  {
    id: 'rsv-6b5e9d3a7c2f',
    propertyId: 'DE_BER_002_Nicola_01_056_01_01_A001', // LST-002: Modern Downtown Apartment
    guestName: 'David Lee',
    guestEmail: 'david.lee@email.com',
    guestPhone: '+1 (555) 246-8135',
    checkIn: '2025-12-10T15:00:00Z',
    checkOut: '2025-12-17T11:00:00Z',
    numberOfGuests: 3,
    totalValue: 2800.00,
    status: 'CONFIRMED',
    paidStatus: 'Not Paid',
  },
  // Sarah Chen reservations - Other
  {
    id: 'rsv-1f8c4e6a9b2d',
    propertyId: 'DE_BER_003_Constantin_01_038_01_01_A001',
    guestName: 'Sarah Chen',
    guestEmail: 'sarah.chen@email.com',
    guestPhone: '+1 (555) 789-1234',
    checkIn: '2025-11-02T15:00:00Z',
    checkOut: '2025-11-04T11:00:00Z',
    numberOfGuests: 2,
    totalValue: 480.00,
    status: 'CHECKED_OUT',
    paidStatus: 'Paid',
  },
  {
    id: 'rsv-8e3b5c1f7a9d',
    propertyId: 'DE_BER_087_Darius_04_312_01_05_C302',
    guestName: 'Sarah Chen',
    guestEmail: 'sarah.chen@email.com',
    guestPhone: '+1 (555) 789-1234',
    checkIn: '2025-09-15T15:00:00Z',
    checkOut: '2025-09-18T11:00:00Z',
    numberOfGuests: 1,
    totalValue: 390.00,
    status: 'CHECKED_OUT',
    paidStatus: 'Pending',
  },
];

