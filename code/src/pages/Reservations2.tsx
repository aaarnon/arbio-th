import { useState } from 'react';

export function Reservations2() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="w-full max-w-2xl mx-auto px-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2">Reservations 2</h1>
          <p className="text-sm text-neutral-600">
            Search for reservations by guest name or reservation ID
          </p>
        </div>

        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guest Name or Reservation ID"
            className="w-full pl-12 pr-4 py-4 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
          />
        </div>
      </div>
    </div>
  );
}


