import { useState } from 'react';
import type { GeneratedTask } from '@/services/aiTaskGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, ChevronDown, ChevronRight } from 'lucide-react';

interface TaskReviewStepProps {
  tasks: GeneratedTask[];
  onTaskAcceptanceChange: (taskPath: number[], accepted: boolean) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  allAccepted: boolean;
  allRejected: boolean;
  isSubmitting: boolean;
}

/**
 * Task Review Step Component
 * Displays AI-generated tasks with Accept/Reject actions
 * Shows tasks numbered as "Task 1", "Subtask 1.1", etc.
 */
export function TaskReviewStep({ 
  tasks, 
  onTaskAcceptanceChange, 
  onAcceptAll, 
  onRejectAll, 
  allAccepted, 
  allRejected, 
  isSubmitting 
}: TaskReviewStepProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-neutral-500">
          No tasks generated. Please go back and try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Accept/Reject All Buttons - Moved to top */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={onAcceptAll}
          disabled={isSubmitting}
          className={`
            h-7 px-2.5 text-xs
            ${allAccepted 
              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
              : 'bg-white hover:bg-neutral-50'
            }
          `}
        >
          <Check className="h-3 w-3 mr-1.5" />
          Accept All
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRejectAll}
          disabled={isSubmitting}
          className={`
            h-7 px-2.5 text-xs
            ${allRejected 
              ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
              : 'bg-white hover:bg-neutral-50'
            }
          `}
        >
          <X className="h-3 w-3 mr-1.5" />
          Reject All
        </Button>
      </div>

      {tasks.map((task, index) => (
        <div key={index} className="bg-white rounded-lg p-2">
          <TaskReviewItem
            task={task}
            taskNumber={index + 1}
            path={[index]}
            onAcceptanceChange={onTaskAcceptanceChange}
          />
        </div>
      ))}
    </div>
  );
}

interface TaskReviewItemProps {
  task: GeneratedTask;
  taskNumber: number;
  path: number[];
  onAcceptanceChange: (taskPath: number[], accepted: boolean) => void;
  parentNumber?: string;
}

/**
 * Individual task item in the review list
 * Supports recursive rendering for subtasks
 */
function TaskReviewItem({
  task,
  taskNumber,
  path,
  onAcceptanceChange,
  parentNumber,
}: TaskReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  
  // Generate display number: "Task 1" or "Subtask 1.1"
  const displayNumber = parentNumber 
    ? `Subtask ${parentNumber}.${taskNumber}`
    : `Task ${taskNumber}`;
  
  const numberForSubtasks = parentNumber 
    ? `${parentNumber}.${taskNumber}`
    : `${taskNumber}`;

  const handleAccept = () => {
    onAcceptanceChange(path, true);
  };

  const handleReject = () => {
    onAcceptanceChange(path, false);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      {/* Title Row: Chevron + Task Number + Title + Buttons */}
      <div className="flex items-start gap-2 py-1">
        {/* Expand/Collapse Button - aligned to top of section */}
        {hasSubtasks ? (
          <button
            onClick={handleToggleExpand}
            className="flex-shrink-0 p-1 hover:bg-neutral-100 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-neutral-500" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <span className={`
          text-xs font-medium flex-shrink-0 transition-colors
          ${task.accepted === true ? 'text-neutral-500' : task.accepted === false ? 'text-neutral-300 line-through' : 'text-neutral-400'}
        `}>
          {displayNumber}
        </span>

        <div className="flex-1 min-w-0">
          <p className={`
            text-xs font-medium leading-tight transition-colors
            ${task.accepted === true ? 'text-neutral-900' : task.accepted === false ? 'text-neutral-400 line-through' : 'text-neutral-700'}
          `}>
            {task.title}
          </p>

          {/* Team Badge directly under title */}
          {task.team && (
            <div className="mt-1">
              <span className={`
                inline-block px-2 py-0.5 text-xs rounded-md transition-colors
                ${task.accepted === true ? 'bg-neutral-100 text-neutral-600' : task.accepted === false ? 'bg-neutral-50 text-neutral-400 line-through' : 'bg-neutral-100 text-neutral-500'}
              `}>
                {formatTeamName(task.team)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAccept}
            className={`
              h-7 px-2.5 text-xs transition-colors
              ${task.accepted === true
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
              }
            `}
          >
            <Check className="h-3 w-3 mr-1" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleReject}
            className={`
              h-7 px-2.5 text-xs transition-colors
              ${task.accepted === false
                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
              }
            `}
          >
            <X className="h-3 w-3 mr-1" />
            Reject
          </Button>
        </div>
      </div>

      {/* Description Row */}
      <div className="ml-9 pl-2">
        {task.description && (
          <p className={`
            text-xs mt-0.5 leading-tight transition-colors
            ${task.accepted === true ? 'text-neutral-500' : task.accepted === false ? 'text-neutral-300 line-through' : 'text-neutral-500'}
          `}>
            {task.description}
          </p>
        )}
      </div>

      {/* Recursive Subtasks */}
      {hasSubtasks && isExpanded && (
        <div className="ml-9 mt-0.5 space-y-0.5">
          {task.subtasks!.map((subtask, index) => (
            <TaskReviewItem
              key={index}
              task={subtask}
              taskNumber={index + 1}
              path={[...path, index]}
              onAcceptanceChange={onAcceptanceChange}
              parentNumber={numberForSubtasks}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Format team name for display
 * Examples: 
 * - PROPERTY_MANAGEMENT_DE -> Property Management - DE
 * - GUEST_COMM_AT -> Guest Comm - AT
 */
function formatTeamName(team: string): string {
  const parts = team.split('_');
  
  // Check if last part is a 2-letter country code
  const lastPart = parts[parts.length - 1];
  const isCountryCode = lastPart.length === 2 && lastPart === lastPart.toUpperCase();
  
  if (isCountryCode && parts.length > 1) {
    // Format main part and add dash before country code
    const mainParts = parts.slice(0, -1);
    const formattedMain = mainParts
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
    return `${formattedMain} - ${lastPart}`;
  }
  
  // Default formatting for teams without country code
  return parts
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

