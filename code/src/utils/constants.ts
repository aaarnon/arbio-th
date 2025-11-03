import type { Status, DomainType } from '@/types';

/**
 * Status badge styling configuration
 * Maps status values to Tailwind CSS classes for badge colors
 */
export const STATUS_STYLES: Record<Status, string> = {
  TODO: 'bg-gray-100 text-gray-800 border-gray-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
  DONE: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

/**
 * Domain badge styling configuration
 * Maps domain types to Tailwind CSS classes for badge colors
 */
export const DOMAIN_STYLES: Record<DomainType, string> = {
  PROPERTY: 'bg-purple-100 text-purple-800 border-purple-300',
  RESERVATION: 'bg-orange-100 text-orange-800 border-orange-300',
  FINANCE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

/**
 * Maximum nesting depth for task hierarchy
 * Prevents infinite recursion in UI rendering
 */
export const MAX_NESTING_DEPTH = 10;

