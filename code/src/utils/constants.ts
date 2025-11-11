import type { Status, DomainType } from '@/types';

/**
 * OPTION 1: Subtle Color Palette - Linear-inspired with cool, muted colors
 * Semantic colors with low saturation for modern, sophisticated look
 */
export const STATUS_STYLES_COLORED: Record<Status, string> = {
  TODO: 'bg-stone-100 text-stone-600 border border-stone-100/50 font-normal',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border border-blue-100/50 font-normal',
  BLOCKED: 'bg-red-50 text-red-700 border border-red-100/50 font-normal',
  IN_REVIEW: 'bg-amber-50 text-amber-700 border border-amber-100/50 font-normal',
  DONE: 'bg-emerald-50/30 text-emerald-600/70 border border-emerald-100/50 font-normal',
  FAILED: 'bg-red-100 text-red-700 border border-red-100/50 font-normal',
  DUPLICATE: 'bg-neutral-100 text-neutral-400 border border-neutral-100/50 font-normal',
  REJECTED: 'bg-red-50 text-red-600 border border-red-100/50 font-normal',
  CANCELLED: 'bg-neutral-50 text-neutral-300 border border-neutral-100/50 font-normal line-through',
};

/**
 * OPTION 2: Monochrome with Differentiation - Pure grey-scale with varying weights
 * Uses opacity and darkness to create hierarchy while staying minimal
 */
export const STATUS_STYLES_MONOCHROME: Record<Status, string> = {
  TODO: 'bg-neutral-100 text-neutral-500 border border-neutral-200 font-normal',
  IN_PROGRESS: 'bg-neutral-800 text-white border-0 font-normal',
  BLOCKED: 'bg-neutral-900 text-white border-0 font-medium',
  IN_REVIEW: 'bg-neutral-200 text-neutral-600 border border-neutral-300 font-normal',
  DONE: 'bg-neutral-50 text-neutral-400 border border-neutral-100 font-normal',
  FAILED: 'bg-neutral-700 text-white border-0 font-normal',
  DUPLICATE: 'bg-white text-neutral-400 border border-neutral-200 font-normal',
  REJECTED: 'bg-neutral-600 text-white border-0 font-normal',
  CANCELLED: 'bg-white text-neutral-300 border border-neutral-200 font-normal line-through',
};

/**
 * Active status style configuration
 * Change this to toggle between color schemes
 * Set to 'colored' or 'monochrome' to switch styles globally
 */
export const ACTIVE_STATUS_THEME: 'colored' | 'monochrome' = 'colored';

/**
 * Current status badge styling configuration
 */
export const STATUS_STYLES: Record<Status, string> = 
  ACTIVE_STATUS_THEME === 'colored' ? STATUS_STYLES_COLORED : STATUS_STYLES_MONOCHROME;

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

