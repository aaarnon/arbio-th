import { formatDate } from '@/utils/date';
import { mockReservations } from '@/data/mockReservations';
import { mockDeals } from '@/data/mockDeals';
import type { Listing } from '@/data/mockListings';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ListingSidebarProps {
  listing: Listing;
}

/**
 * Listing Sidebar Component - Linear-inspired context panel
 * Displays listing information and reservation details
 */
export function ListingSidebar({ listing }: ListingSidebarProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // WiFi credentials
  const wifiUsername = 'gigacube-32A9';
  const wifiPassword = '5mA227yY845g';

  // Handle copying WiFi credentials
  const handleCopyWifi = async () => {
    const wifiCredentials = `Username: ${wifiUsername}\nPassword: ${wifiPassword}`;
    try {
      await navigator.clipboard.writeText(wifiCredentials);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Find reservations for this listing by SKU (matching propertyId)
  const allReservations = mockReservations.filter(
    (r) => r.propertyId === listing.sku
  );

  // Get current date
  const now = new Date();

  // Find current reservation (guest is currently in-house)
  const currentReservation = allReservations.find((r) => {
    const checkIn = new Date(r.checkIn);
    const checkOut = new Date(r.checkOut);
    return checkIn <= now && checkOut >= now && r.status === 'IN_HOUSE';
  });

  // Find next reservation (future check-in, closest to now)
  const nextReservation = allReservations
    .filter((r) => {
      const checkIn = new Date(r.checkIn);
      return checkIn > now && (r.status === 'CONFIRMED' || r.status === 'IN_HOUSE');
    })
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())[0];

  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Find the corresponding deal based on the dealSku
  const relatedDeal = mockDeals.find(deal => deal.sku === listing.dealSku);

  return (
    <aside className="h-full overflow-y-auto bg-white border-l border-neutral-200">
      {/* Basic Information */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          Basic Information
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Listing ID</dt>
            <dd className="text-xs text-neutral-900 font-medium">{listing.id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Unit SKU</dt>
            <dd className="text-xs text-neutral-900 font-medium">{listing.sku}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Name</dt>
            <dd className="text-xs text-neutral-900">{listing.name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Address</dt>
            <dd className="text-xs text-neutral-900 text-right">{listing.address}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Deal SKU</dt>
            <dd className="text-xs text-neutral-900 font-medium">
              {relatedDeal ? (
                <button
                  onClick={() => navigate(`/deals/${relatedDeal.id}`)}
                  className="text-xs text-neutral-900 font-medium underline hover:text-neutral-600 transition-colors"
                >
                  {listing.dealSku}
                </button>
              ) : (
                <span className="text-xs text-neutral-900 font-medium">
                  {listing.dealSku}
                </span>
              )}
            </dd>
          </div>
        </div>
      </section>

      {/* WiFi Details */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">
            WIFI
          </h3>
          <button
            onClick={handleCopyWifi}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
            title="Copy WiFi credentials"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Username</dt>
            <dd className="text-xs text-neutral-900 font-medium font-mono">{wifiUsername}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Password</dt>
            <dd className="text-xs text-neutral-900 font-medium font-mono">{wifiPassword}</dd>
          </div>
        </div>
      </section>

      {/* Current Reservation */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          Current Reservation
        </h3>
        {currentReservation ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Reservation ID</dt>
              <dd>
                <button
                  className="text-xs text-neutral-900 underline hover:text-neutral-600 transition-colors"
                  onClick={() => navigate(`/reservations?id=${currentReservation.id}`)}
                >
                  {currentReservation.id}
                </button>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Guest Name</dt>
              <dd className="text-xs text-neutral-900">{currentReservation.guestName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Check-in</dt>
              <dd className="text-xs text-neutral-900">
                {formatDate(currentReservation.checkIn)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Check-out</dt>
              <dd className="text-xs text-neutral-900">
                {formatDate(currentReservation.checkOut)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Total Nights</dt>
              <dd className="text-xs text-neutral-900">
                {calculateNights(currentReservation.checkIn, currentReservation.checkOut)} nights
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Number of Guests</dt>
              <dd className="text-xs text-neutral-900">
                {currentReservation.numberOfGuests || 'N/A'}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Booking Value</dt>
              <dd className="text-xs text-neutral-900 font-medium">
                ${currentReservation.totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Status</dt>
              <dd className="text-xs text-neutral-900 font-medium">
                {currentReservation.status.replace('_', ' ')}
              </dd>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-400 italic">No current reservation</div>
        )}
      </section>

      {/* Next Reservation */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          Next Reservation
        </h3>
        {nextReservation ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Reservation ID</dt>
              <dd>
                <button
                  className="text-xs text-neutral-900 underline hover:text-neutral-600 transition-colors"
                  onClick={() => navigate(`/reservations?id=${nextReservation.id}`)}
                >
                  {nextReservation.id}
                </button>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Guest Name</dt>
              <dd className="text-xs text-neutral-900">{nextReservation.guestName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Check-in</dt>
              <dd className="text-xs text-neutral-900">
                {formatDate(nextReservation.checkIn)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Check-out</dt>
              <dd className="text-xs text-neutral-900">
                {formatDate(nextReservation.checkOut)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Total Nights</dt>
              <dd className="text-xs text-neutral-900">
                {calculateNights(nextReservation.checkIn, nextReservation.checkOut)} nights
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Number of Guests</dt>
              <dd className="text-xs text-neutral-900">
                {nextReservation.numberOfGuests || 'N/A'}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Booking Value</dt>
              <dd className="text-xs text-neutral-900 font-medium">
                ${nextReservation.totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-neutral-500">Status</dt>
              <dd className="text-xs text-neutral-900 font-medium">
                {nextReservation.status.replace('_', ' ')}
              </dd>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-400 italic">No upcoming reservation</div>
        )}
      </section>
    </aside>
  );
}

