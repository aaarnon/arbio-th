import type { Reservation } from '@/types/reservation';
import { mockProperties } from '@/data/mockProperties';
import { format } from 'date-fns';

interface GuestReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  guestName: string;
  onSelectReservation: (reservation: Reservation) => void;
}

export function GuestReservationsModal({
  isOpen,
  onClose,
  reservations,
  guestName,
  onSelectReservation,
}: GuestReservationsModalProps) {
  if (!isOpen) return null;

  // Sort reservations: current first, then by check-in date descending
  const sortedReservations = [...reservations].sort((a, b) => {
    const aCheckIn = new Date(a.checkIn);
    const bCheckIn = new Date(b.checkIn);
    const aCheckOut = new Date(a.checkOut);
    const bCheckOut = new Date(b.checkOut);
    const now = new Date();

    const aIsCurrent = aCheckIn <= now && aCheckOut >= now;
    const bIsCurrent = bCheckIn <= now && bCheckOut >= now;

    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    return bCheckIn.getTime() - aCheckIn.getTime();
  });

  const getReservationStatus = (reservation: Reservation) => {
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const now = new Date();

    if (checkIn <= now && checkOut >= now) {
      return { label: 'Current', color: 'bg-blue-100 text-blue-700' };
    } else if (checkOut < now) {
      return { label: 'Past', color: 'bg-neutral-200 text-neutral-600' };
    } else {
      return { label: 'Upcoming', color: 'bg-green-100 text-green-700' };
    }
  };

  const getPropertyInfo = (propertyId: string) => {
    return mockProperties.find(p => p.id === propertyId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-300/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden p-6">
        {/* Header */}
        <div className="px-0 pt-2 pb-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Navigate To</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Searching by {guestName}
          </p>
        </div>

        {/* Reservations List */}
        <div className="overflow-y-auto max-h-[calc(80vh-136px)] -mx-6">
          {sortedReservations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-neutral-500 text-sm">No reservations found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {sortedReservations.map((reservation) => {
                const status = getReservationStatus(reservation);
                const property = getPropertyInfo(reservation.propertyId);
                const checkIn = new Date(reservation.checkIn);
                const checkOut = new Date(reservation.checkOut);

                return (
                  <button
                    key={reservation.id}
                    onClick={() => onSelectReservation(reservation)}
                    className="w-full px-6 py-4 hover:bg-neutral-50 transition-colors flex items-center gap-4 group"
                  >
                    {/* Property Image Placeholder */}
                    <div className="w-10 h-10 rounded-lg bg-neutral-200 flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    </div>

                    {/* Reservation Info */}
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="font-medium text-neutral-900 text-sm truncate mb-1">
                        {reservation.id}
                      </h3>
                      <p className="text-xs text-neutral-600">
                        {format(checkIn, 'MMM dd')} - {format(checkOut, 'MMM dd')}
                      </p>
                    </div>

                    {/* Status Tag and Arrow - Aligned */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

