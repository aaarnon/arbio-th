#!/bin/bash
# Fix all type imports in one go
files=(
  "src/features/cases/components/CaseFilters.tsx"
  "src/features/cases/components/CaseListItem.tsx"
  "src/features/cases/components/CreateCaseModal.tsx"
  "src/features/cases/hooks/useCaseFilters.ts"
  "src/store/CaseContext.tsx"
  "src/store/caseReducer.ts"
  "src/store/types.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' 's/import { \(Case\|Status\|DomainType\|Task\|Comment\|Attachment\|CaseState\|CaseAction\|ReactNode\|CaseFormData\) }/import type { \1 }/g' "$file"
    sed -i '' 's/import { \([^}]*\), \(Case\|Status\|DomainType\|Task\|Comment\|Attachment\|CaseState\|CaseAction\|ReactNode\|CaseFormData\) }/import { \1 }, type { \2 }/g' "$file"
  fi
done
