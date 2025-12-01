import type { Note } from '@/types/note';

/**
 * Mock notes data for development and testing
 * Notes associated with reservations
 */
export const mockNotes: Note[] = [
  {
    id: 'note-1',
    reservationId: 'DE_KOB_008_LohrStay_008',
    author: 'user-1',
    text: 'Example: Guest Comm team can write any note here',
    createdAt: '2025-11-30T10:00:00Z',
  },
];

