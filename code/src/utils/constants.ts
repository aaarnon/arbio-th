import type { Status, DomainType } from '@/types';

/**
 * Status badge styling configuration - Linear-inspired minimalist
 * Maps status values to grey-only Tailwind CSS classes
 */
export const STATUS_STYLES: Record<Status, string> = {
  TODO: 'bg-white text-neutral-400 border border-neutral-200 font-normal',
  IN_PROGRESS: 'bg-neutral-100 text-neutral-500 border-0 font-normal',
  DONE: 'bg-neutral-50 text-neutral-600 border-0 font-normal',
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

