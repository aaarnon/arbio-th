import type { Case } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CaseDescriptionProps {
  case: Case;
}

/**
 * Case Description Component
 * Displays the case description with edit capability
 */
export function CaseDescription({ case: caseData }: CaseDescriptionProps) {
  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider">Description</h2>
          <Button variant="ghost" size="sm">
            <svg 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-700 whitespace-pre-wrap font-normal leading-relaxed">{caseData.description}</p>
      </CardContent>
    </Card>
  );
}

