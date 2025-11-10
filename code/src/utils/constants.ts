import type { Status, DomainType } from '@/types';

/**
 * Status badge styling configuration - Linear-inspired minimalist
 * Maps status values to grey-only Tailwind CSS classes
 */
export const STATUS_STYLES: Record<Status, string> = {
  TODO: 'bg-white text-neutral-400 border border-neutral-200 font-normal',
  IN_PROGRESS: 'bg-neutral-100 text-neutral-500 border-0 font-normal',
  BLOCKED: 'bg-red-50 text-red-600 border border-red-200 font-normal',
  IN_REVIEW: 'bg-blue-50 text-blue-600 border border-blue-200 font-normal',
  DONE: 'bg-neutral-50 text-neutral-600 border-0 font-normal',
  FAILED: 'bg-red-100 text-red-700 border-0 font-normal',
  DUPLICATE: 'bg-neutral-100 text-neutral-400 border-0 font-normal',
  REJECTED: 'bg-red-50 text-red-500 border-0 font-normal',
  CANCELLED: 'bg-white text-neutral-300 border-0 font-normal line-through',
};

/**
 * Domain badge styling configuration - Subtle grey variations
 * Maps domain types to minimal Tailwind CSS classes
 */
export const DOMAIN_STYLES: Record<DomainType, string> = {
  PROPERTY: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
  RESERVATION: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
  FINANCE: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
};

/**
 * Maximum nesting depth for task hierarchy
 * Prevents infinite recursion in UI rendering
 */
export const MAX_NESTING_DEPTH = 10;

/**
 * Format team type to display name
 */
export const formatTeam = (team?: string) => {
  if (!team) return 'No Team';
  
  // Special mapping for team names to preserve exact formatting
  const teamMapping: Record<string, string> = {
    'PROPERTY_MANAGEMENT_DE': 'Property Management - DE',
    'PROPERTY_MANAGEMENT_AT': 'Property Management - AT',
    'GUEST_COMM_DE': 'Guest Comm - DE',
    'GUEST_COMM_AT': 'Guest Comm - AT',
    'GUEST_EXPERIENCE': 'Guest Experience',
    'FINOPS': 'FinOps',
  };
  
  return teamMapping[team] || team;
};

