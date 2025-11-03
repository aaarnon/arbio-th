import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

/**
 * Empty State Component - Linear-inspired minimalist
 * Displays when no data is available with optional action button
 */
export function EmptyState({ 
  title = 'No data found',
  message, 
  action,
  icon 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card bg-white p-24 text-center">
      {icon && (
        <div className="mb-6 text-neutral-300">
          {icon}
        </div>
      )}
      {!icon && (
        <svg
          className="mb-6 h-16 w-16 text-neutral-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <h3 className="mb-2 text-base font-medium text-neutral-800">{title}</h3>
      <p className="mb-8 max-w-sm text-sm text-neutral-500">{message}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

