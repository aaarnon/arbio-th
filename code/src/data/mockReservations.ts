import type { Reservation } from '@/types';

/**
 * Mock reservation data for development and testing
 * Represents guest bookings linked to properties
 */
export const mockReservations: Reservation[] = [
  {
    id: 'rsv-644f5e4aac88',
    propertyId: 'prop-1',
    guestName: 'Sarah Martinez',
    guestEmail: 'sarah.martinez@email.com',
    guestPhone: '+1 (555) 123-4567',
    checkIn: '2025-10-06T15:00:00Z',
    checkOut: '2025-10-12T11:00:00Z',
    numberOfGuests: 4,
    totalValue: 1840.00,
    status: 'CONFIRMED',
  },
  {
    id: 'res-2',
    propertyId: 'prop-2',
    guestName: 'Maria Garcia',
    guestEmail: 'maria.garcia@email.com',
    guestPhone: '+1 (555) 987-6543',
    checkIn: '2025-11-05T15:00:00Z',
    checkOut: '2025-11-12T11:00:00Z',
    numberOfGuests: 2,
    totalValue: 3200.00,
    status: 'IN_HOUSE',
  },
  {
    id: 'res-3',
    propertyId: 'prop-1',
    guestName: 'David Lee',
    guestEmail: 'david.lee@email.com',
    guestPhone: '+1 (555) 246-8135',
    checkIn: '2025-11-20T15:00:00Z',
    checkOut: '2025-11-27T11:00:00Z',
    numberOfGuests: 3,
    totalValue: 2800.00,
    status: 'CONFIRMED',
  },
];

