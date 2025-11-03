import type { Property } from '@/types';

/**
 * Mock property data for development and testing
 * Represents rental properties managed by the system
 */
export const mockProperties: Property[] = [
  {
    id: 'DE_BER_003_Constantin_01_038_01_01_A001',
    unitId: 'A-101',
    address: '123 Ocean View Drive, Miami Beach, FL 33139',
    status: 'ACTIVE',
    bedrooms: 2,
    bathrooms: 2,
    lastMaintenance: '2025-09-28T14:30:00Z',
  },
  {
    id: 'prop-2',
    unitId: 'B-205',
    address: '456 Sunset Boulevard, Los Angeles, CA 90028',
    status: 'ACTIVE',
    bedrooms: 3,
    bathrooms: 2.5,
    lastMaintenance: '2025-10-28T09:15:00Z',
  },
  {
    id: 'prop-3',
    unitId: 'C-302',
    address: '789 Park Avenue, New York, NY 10021',
    status: 'MAINTENANCE',
    bedrooms: 1,
    bathrooms: 1,
    lastMaintenance: '2025-11-01T11:00:00Z',
  },
];

