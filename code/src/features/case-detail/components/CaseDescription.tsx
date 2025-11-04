import { useState, useRef, useEffect } from 'react';
import { useCaseContext } from '@/store/CaseContext';
import { toast } from 'sonner';
import type { Case } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CaseDescriptionProps {
  case: Case;
}

/**
 * Case Description Component - Inline Editable
 * Click to edit, auto-saves on blur
 */
export function CaseDescription({ case: caseData }: CaseDescriptionProps) {
  const { dispatch } = useCaseContext();
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(caseData.description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync descriptionValue with prop when it changes
  useEffect(() => {
    setDescriptionValue(caseData.description);
  }, [caseData.description]);

  // Focus and resize textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  // Handle save on blur
  const handleBlur = () => {
    setIsEditing(false);
    if (descriptionValue.trim() !== caseData.description) {
      dispatch({
        type: 'UPDATE_CASE',
        payload: {
          caseId: caseData.id,
          updates: { description: descriptionValue.trim() },
        },
      });
      toast.success('Description updated');
    } else {
      setDescriptionValue(caseData.description); // Reset if unchanged
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDescriptionValue(caseData.description);
      setIsEditing(false);
    }
    // Allow Enter for new lines (don't save on Enter)
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionValue(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <Card>
      <CardHeader className="pb-6">
        <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">Description</h2>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={descriptionValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-neutral-700 font-normal leading-relaxed bg-transparent border-none outline-none focus:outline-none resize-none"
            placeholder="Enter description..."
            rows={3}
          />
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="text-sm text-neutral-700 whitespace-pre-wrap font-normal leading-relaxed cursor-text hover:bg-neutral-50 rounded p-2 -m-2 transition-colors"
          >
            {caseData.description || 'Click to add description...'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

