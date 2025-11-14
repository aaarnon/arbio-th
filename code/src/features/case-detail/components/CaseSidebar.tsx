import type { Case } from '@/types';
import { formatDate } from '@/utils/date';
import { mockProperties } from '@/data/mockProperties';
import { mockReservations } from '@/data/mockReservations';
import { mockUsers } from '@/data/mockUsers';

interface CaseSidebarProps {
  case: Case;
}

/**
 * Case Sidebar Component - Linear-inspired context panel
 * Displays ticket information, property context, and reservation details
 */
export function CaseSidebar({ case: caseData }: CaseSidebarProps) {
  // Find related property and reservation (mock data for now)
  const property = mockProperties[0];
  const reservation = mockReservations[0];
  
  // Find creator user
  const creator = caseData.createdBy 
    ? mockUsers.find(u => u.id === caseData.createdBy)
    : null;
  
  // Format property status for display
  const formatPropertyStatus = (status: string) => {
    if (status === 'ACTIVE') return 'Occupied';
    if (status === 'MAINTENANCE') return 'Maintenance';
    return status;
  };

  return (
    <aside className="h-full overflow-y-auto bg-white border-l border-neutral-200">
      {/* Ticket Information */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          Ticket Information
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Ticket ID</dt>
            <dd className="text-xs text-neutral-900 font-medium">{caseData.id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Creator</dt>
            <dd className="text-xs text-neutral-900">{creator ? creator.name : 'Unknown'}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Date created</dt>
            <dd className="text-xs text-neutral-900">{formatDate(caseData.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Last update</dt>
            <dd className="text-xs text-neutral-900">{formatDate(caseData.updatedAt)}</dd>
          </div>
        </div>
      </section>

      {/* Property Context */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          Property Context
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500 flex-shrink-0">Unit</dt>
            <dd className="min-w-0 flex-1 text-right">
              <a 
                href="#" 
                className="text-xs text-neutral-900 underline hover:text-neutral-600 transition-colors whitespace-nowrap inline-block ml-auto"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navigate to property management system
                  console.log('Navigate to property:', property.id);
                }}
              >
                {property.id}
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Status</dt>
            <dd className="text-xs text-neutral-900">{formatPropertyStatus(property.status)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Property Type</dt>
            <dd className="text-xs text-neutral-900">{property.multiUnit ? 'Multi-Unit' : 'Single-Unit'}</dd>
          </div>
          {property.handbookUrl && (
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Property Handbook</dt>
              <dd>
                <a 
                  href={property.handbookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-900 underline hover:text-neutral-600 transition-colors"
                >
                  View Handbook
                </a>
              </dd>
            </div>
          )}
        </div>
      </section>

      {/* Reservation Context */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          Reservation Context
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Reservation ID</dt>
            <dd>
              <a 
                href="#" 
                className="text-xs text-neutral-900 underline hover:text-neutral-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navigate to reservation system
                  console.log('Navigate to reservation:', reservation.id);
                }}
              >
                {reservation.id}
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Guest Name</dt>
            <dd className="text-xs text-neutral-900">{reservation.guestName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Check-in</dt>
            <dd className="text-xs text-neutral-900">
              {formatDate(reservation.checkIn)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Check-out</dt>
            <dd className="text-xs text-neutral-900">
              {formatDate(reservation.checkOut)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Total Nights</dt>
            <dd className="text-xs text-neutral-900">6 nights</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Booking Value</dt>
            <dd className="text-xs text-neutral-900 font-medium">
              ${reservation.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </dd>
          </div>
        </div>
      </section>

      {/* External Tools */}
      <section className="px-8 py-8">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          External Tools
        </h3>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-1 hover:bg-neutral-50 -mx-2 px-2 rounded-md transition-colors cursor-pointer">
          <div>
              <div className="text-xs text-neutral-900 font-medium">Conduit</div>
              <div className="text-xs text-neutral-500">Updated on Today at 6:41 AM</div>
          </div>
          <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          </div>
          <div className="flex items-center justify-between py-1 hover:bg-neutral-50 -mx-2 px-2 rounded-md transition-colors cursor-pointer">
            <div>
              <div className="text-xs text-neutral-900 font-medium">Breezeway</div>
              <div className="text-xs text-neutral-500">Created at Today at 6:41 AM</div>
            </div>
            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </section>
    </aside>
  );
}

