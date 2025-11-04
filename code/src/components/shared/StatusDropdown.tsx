import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StatusOption {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
  trigger: React.ReactNode;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'TODO', label: 'To Do', icon: '⭕', color: 'text-neutral-600' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: '🔵', color: 'text-blue-500' },
  { value: 'DONE', label: 'Done', icon: '✓', color: 'text-green-500' },
  { value: 'CANCELLED', label: 'Canceled', icon: '✕', color: 'text-neutral-500' },
];

/**
 * Shared Status Dropdown Component
 * Consistent status selection across tasks and case headers
 */
export function StatusDropdown({
  currentStatus,
  onStatusChange,
  disabled = false,
  disabledMessage,
  trigger,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white w-56">
        {STATUS_OPTIONS.map((option, index) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              if (!disabled || option.value !== 'DONE') {
                onStatusChange(option.value);
                setIsOpen(false);
              }
            }}
            disabled={disabled && option.value === 'DONE'}
            className={`flex items-center justify-between py-2.5 ${
              disabled && option.value === 'DONE' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={option.color}>{option.icon}</span>
              <span className="text-neutral-900">{option.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {currentStatus === option.value && (
                <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className="text-neutral-400 text-xs font-medium">{index + 1}</span>
            </div>
          </DropdownMenuItem>
        ))}
        {disabled && disabledMessage && (
          <div className="px-3 py-2 text-xs text-neutral-500 border-t border-neutral-100 mt-1">
            {disabledMessage}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

