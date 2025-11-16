# CLAUDE.md - AI Assistant Guide for Arbio Ticketing Hub

**Last Updated:** 2025-11-16
**Project:** Arbio Ticketing Hub (Frontend MVP)
**Status:** Active Development

---

## 🎯 Project Overview

**Arbio Ticketing Hub** is a property management ticketing system designed to centralize operational issue tracking across Property, Reservation, and Finance domains. This is a **frontend-only MVP** using mock data to validate workflows before backend investment.

### Key Facts

- **Type:** Single-Page React Application (SPA)
- **Purpose:** Validate 3-level hierarchical case management (Case → Task → Subtask with infinite nesting)
- **Target Users:** Property Managers, Guest Communications teams
- **Platform:** Desktop-only (1280px+ width)
- **Data:** Mock data only - no backend/API

### Technology Stack

```
Framework:     React 19.1.1 + TypeScript 5.9.3
Build Tool:    Vite 7.1.7
Routing:       React Router DOM 7.9.5
Styling:       Tailwind CSS 3.4 + shadcn/ui
State:         React Context + useReducer
Forms:         React Hook Form 7.66 + Zod 4.1.12
Testing:       Vitest 4.0.6 + React Testing Library
```

---

## 📁 Repository Structure

```
/home/user/arbio-th/
├── code/                          # Main application directory
│   ├── src/
│   │   ├── features/              # Feature-based modules (Epic-aligned)
│   │   │   ├── cases/             # Case list, creation, filtering
│   │   │   ├── case-detail/       # Case detail page
│   │   │   ├── tasks/             # Hierarchical task management
│   │   │   ├── comments/          # Comment system
│   │   │   ├── notifications/     # Notification system
│   │   │   └── attachments/       # File attachment display
│   │   │
│   │   ├── components/            # Shared components
│   │   │   ├── layout/            # Layout, Navbar, Sidebar, ErrorBoundary
│   │   │   ├── shared/            # StatusBadge, DomainBadge, EmptyState, etc.
│   │   │   └── ui/                # shadcn/ui primitives (14 components)
│   │   │
│   │   ├── store/                 # Global state management
│   │   │   ├── CaseContext.tsx    # React Context provider
│   │   │   ├── caseReducer.ts     # State reducer with immutable updates
│   │   │   └── types.ts           # Action and state types
│   │   │
│   │   ├── types/                 # TypeScript definitions
│   │   │   ├── index.ts           # Central export
│   │   │   ├── enums.ts           # Status, DomainType, TeamType
│   │   │   ├── case.ts, task.ts, comment.ts, etc.
│   │   │   └── ...
│   │   │
│   │   ├── data/                  # Mock data sources
│   │   │   ├── mockCases.ts
│   │   │   ├── mockUsers.ts
│   │   │   ├── mockProperties.ts
│   │   │   └── mockNotifications.ts
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   ├── hooks/                 # Shared custom hooks
│   │   ├── pages/                 # Page components
│   │   ├── App.tsx                # Root with routes
│   │   └── main.tsx               # Entry point
│   │
│   ├── dist/                      # Production build output
│   ├── package.json               # Dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Custom design system
│   └── tsconfig.json              # TypeScript config
│
├── docs/                          # Project documentation
│   ├── PRD.md                     # Product Requirements Document
│   ├── architecture.md            # Complete technical architecture
│   ├── epics.md                   # Epic breakdown
│   ├── implementation-plan.md     # Implementation strategy
│   └── ux-design-specification.md # UX/UI specifications
│
├── bmad/                          # BMAD workflow system (AI-assisted dev)
├── .claude/                       # Claude AI configuration
├── DEPLOYMENT.md                  # Deployment guide
└── vercel.json                    # Vercel deployment config
```

---

## 🏗️ Architecture Overview

### Feature-Based Organization

This project uses **feature-based architecture** (not type-based). Components, hooks, types, and schemas are colocated by feature, aligned with Epic structure from PRD.

**Benefits:**
- Easier vertical slicing during development
- Code grouped by business domain
- Matches Epic organization in PRD

### State Management Pattern

```typescript
// Context + Reducer pattern (no external state library)

Provider: CaseContext wraps entire app in main.tsx
Consumer: Components use useCaseContext() hook
Updates: Dispatch actions to reducer
Flow: Component → Dispatch → Reducer → New State → Re-render
```

**Key Files:**
- `/code/src/store/CaseContext.tsx` - Context provider and custom hook
- `/code/src/store/caseReducer.ts` - Reducer with helper functions for recursive task updates
- `/code/src/store/types.ts` - Action and state type definitions

### Recursive Component Pattern

Tasks support **infinite nesting** via recursive component rendering:

```typescript
// TaskItem renders itself recursively for nested subtasks
interface TaskItemProps {
  task: Task;
  depth: number;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

// Key features:
// - Visual indentation based on depth (20px per level)
// - Expand/collapse functionality
// - Status validation prevents parent completion with incomplete children
```

**Implementation:** `/code/src/features/tasks/components/TaskItem.tsx`

---

## 🔑 Key Concepts & Patterns

### 1. Import Aliases

**Always use `@/` for imports:**

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';
import { useCaseContext } from '@/store/CaseContext';
import type { Case, Task } from '@/types';

// ❌ Wrong
import { Button } from '../../../components/ui/button';
```

**Configuration:** Path alias `@` → `/src/` configured in both `vite.config.ts` and `tsconfig.json`

### 2. Type Organization

**All types exported from `/code/src/types/index.ts`:**

```typescript
// Central export point for all types
export type { Case } from './case';
export type { Task } from './task';
export type { Status, DomainType, TeamType } from './enums';
// ... etc
```

**Usage:**
```typescript
import type { Case, Task, Status } from '@/types';
```

### 3. Status Validation

**Important Rule:** Parent tasks/cases CANNOT be marked as "Done" until all children are complete.

**Implementation:**
- Hook: `/code/src/features/tasks/hooks/useStatusValidation.ts`
- Provides helper to get incomplete subtasks
- Used throughout task components

### 4. Form Pattern

**All forms use React Hook Form + Zod:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

// Use in component
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});
```

**Examples:** `/code/src/features/cases/schemas.ts`, `/code/src/features/tasks/schemas.ts`

### 5. Date Handling

**Storage:** Always use ISO 8601 strings

```typescript
const createdAt = new Date().toISOString();
// "2024-11-02T15:30:00.000Z"
```

**Display:** Use date-fns for formatting

```typescript
import { format } from 'date-fns';

const displayDate = format(new Date(createdAt), 'MMM d, yyyy');
// "Nov 2, 2024"
```

---

## 💻 Development Workflow

### Getting Started

```bash
# Navigate to code directory
cd /home/user/arbio-th/code

# Install dependencies
npm install

# Run development server
npm run dev
# Server runs at http://localhost:5173

# Run tests
npm run test

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Branch Strategy

- **Main branch:** Empty (tracked but project is in `claude/` branch)
- **Development branch:** `claude/claude-md-mi0xggexlpqejcne-01MvHJqHSChqykJH9oBjSQUa`
- **All work should be committed to the claude/* branch**

### Git Operations

**Committing Changes:**

```bash
# Always work in the claude/* branch
git add .
git commit -m "feat: description of changes"
git push -u origin claude/claude-md-mi0xggexlpqejcne-01MvHJqHSChqykJH9oBjSQUa
```

**Commit Conventions:**
- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `docs:` Documentation updates
- `style:` Code style changes
- `test:` Test additions/updates

---

## 🎨 Design System

### Minimalist Aesthetic (Linear-inspired)

```javascript
// Custom grey palette
neutral: {
  50: '#fafafa',   // page background
  100: '#f5f5f5',  // subtle hover
  200: '#e5e5e5',  // borders
  300: '#d4d4d4',  // disabled
  400: '#a3a3a3',  // metadata text
  500: '#737373',  // tertiary text
  600: '#525252',  // secondary text
  700: '#262626',  // button hover
  800: '#171717',  // primary text/buttons
  900: '#0a0a0a',  // deep black
}
```

**Design Principles:**
- Flat design (no shadows)
- Subtle border radius (4px, 8px)
- 900px max content width
- WCAG 2.1 Level AA compliant

### Status Badge Colors (MANDATORY)

```typescript
const STATUS_STYLES = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-50 text-gray-400 line-through',
} as const;
```

### Domain Badge Colors (MANDATORY)

```typescript
const DOMAIN_STYLES = {
  PROPERTY: 'bg-blue-100 text-blue-700',
  RESERVATION: 'bg-purple-100 text-purple-700',
  FINANCE: 'bg-green-100 text-green-700',
} as const;
```

---

## 📋 Naming Conventions

### Files and Folders

```
Components:     PascalCase.tsx        → CaseList.tsx, TaskItem.tsx
Hooks:          useCamelCase.ts       → useCaseFilters.ts, useTaskActions.ts
Types:          camelCase.ts          → case.ts, task.ts
Tests:          CoLocated.test.tsx    → CaseList.test.tsx
Utils:          camelCase.ts          → date.ts, validation.ts
```

### Variables and Functions

```typescript
// Components: PascalCase
export function CaseList() {}

// Functions: camelCase
function handleStatusChange() {}

// Constants: UPPER_SNAKE_CASE
const MAX_NESTING_DEPTH = 10;

// Event handlers: handle + EventName
onClick={handleClick}
onSubmit={handleSubmit}

// Boolean variables: is/has/should prefix
const isLoading = false;
const hasSubtasks = true;
```

---

## 🧩 Component Structure (MANDATORY)

**All components must follow this order:**

```typescript
// 1. Imports (grouped)
import React from 'react';                          // React
import { useNavigate } from 'react-router-dom';     // Third-party
import { Button } from '@/components/ui/button';    // UI components
import { useCaseContext } from '@/store/CaseContext'; // Local
import type { Case } from '@/types/case';           // Types

// 2. Types/Interfaces
interface CaseListProps {
  filter?: string;
}

// 3. Component
export function CaseList({ filter }: CaseListProps) {
  // 3a. Hooks
  const navigate = useNavigate();
  const { state, dispatch } = useCaseContext();

  // 3b. State
  const [isLoading, setIsLoading] = useState(false);

  // 3c. Derived state
  const filteredCases = useMemo(() =>
    state.cases.filter(c => !filter || c.status === filter),
    [state.cases, filter]
  );

  // 3d. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 3e. Event handlers
  const handleCaseClick = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  // 3f. Render
  return <div>{/* JSX */}</div>;
}
```

---

## 🔄 State Management

### Context State Shape

```typescript
interface CaseState {
  cases: Case[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

type CaseAction =
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'UPDATE_CASE'; payload: { caseId: string; updates: Partial<Case> } }
  | { type: 'DELETE_CASE'; payload: string }
  | { type: 'ADD_TASK'; payload: { caseId: string; task: Task } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { caseId: string; taskId: string; status: Status } }
  | { type: 'UPDATE_TASK'; payload: { caseId: string; taskId: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { caseId: string; taskId: string } }
  | { type: 'ADD_COMMENT'; payload: { caseId: string; comment: Comment } }
  | { type: 'ADD_ATTACHMENT'; payload: { caseId: string; attachment: Attachment } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };
```

### Using Context in Components

```typescript
import { useCaseContext } from '@/store/CaseContext';

function MyComponent() {
  const { state, dispatch } = useCaseContext();

  // Dispatch actions
  dispatch({
    type: 'UPDATE_CASE',
    payload: {
      caseId: 'TK-1234',
      updates: { status: 'DONE' }
    }
  });

  // Access state
  const cases = state.cases;
}
```

### Reducer Helper Functions

The reducer uses helper functions for recursive operations on task trees:

```typescript
// Update task recursively in tree
function updateTaskInTree(
  tasks: Task[],
  taskId: string,
  updater: (task: Task) => Task
): Task[]

// Delete task recursively in tree
function deleteTaskInTree(tasks: Task[], taskId: string): Task[]
```

**Implementation:** `/code/src/store/caseReducer.ts`

---

## 🎯 Key Implementation Patterns

### 1. Recursive Task Rendering

```typescript
// TaskItem component renders itself recursively
export function TaskItem({ task, depth }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const indentStyle = { paddingLeft: `${depth * 20}px` };
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div style={indentStyle}>
      {/* Task header */}
      <div className="task-header">
        {hasSubtasks && (
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <span>{task.title}</span>
        <StatusBadge status={task.status} />
      </div>

      {/* Recursive rendering */}
      {isExpanded && hasSubtasks && (
        <div>
          {task.subtasks!.map(subtask => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              depth={depth + 1}  // Increment depth
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Status Validation

```typescript
// Prevent marking parent done with incomplete children
function canMarkAsDone(task: Task): boolean {
  if (!task.subtasks || task.subtasks.length === 0) {
    return true;
  }

  return task.subtasks.every(subtask =>
    subtask.status === 'DONE' || subtask.status === 'CANCELLED'
  );
}

// Get incomplete subtasks
function getIncompleteSubtasks(task: Task): Task[] {
  if (!task.subtasks) return [];

  return task.subtasks.filter(subtask =>
    subtask.status !== 'DONE' && subtask.status !== 'CANCELLED'
  );
}
```

### 3. Toast Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('Case created successfully');

// Error
toast.error('Cannot mark as Done. Complete all subtasks first.');

// Info
toast.info('Changes saved');
```

### 4. Optimistic UI Updates

```typescript
// State updates happen immediately
try {
  dispatch({ type: 'UPDATE_TASK_STATUS', payload: { ... } });
  toast.success('Task status updated');
} catch (error) {
  toast.error('Failed to update task status');
  console.error('[TaskStore] Update error:', error);
}
```

---

## 🧪 Testing

### Testing Infrastructure

- **Framework:** Vitest (Vite-native, fast)
- **Component Testing:** React Testing Library
- **DOM Matchers:** @testing-library/jest-dom
- **User Interaction:** @testing-library/user-event

**Note:** Testing infrastructure is set up, but no test files are currently written.

### Test Scripts

```bash
npm run test              # Run tests
npm run test:coverage     # Run with coverage
```

---

## 🚀 Deployment

### Current Setup

- **Build output:** `/code/dist/`
- **Bundle size:** ~590 KB (~173 KB gzipped)
- **Platform:** Static hosting (Vercel, Netlify, GitHub Pages, AWS S3)

### Quick Deploy (Vercel)

```bash
cd /home/user/arbio-th/code
vercel
```

**Vercel Config:** `/home/user/arbio-th/vercel.json`

```json
{
  "buildCommand": "cd code && npm install && npm run build",
  "outputDirectory": "code/dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**See:** `/home/user/arbio-th/DEPLOYMENT.md` for complete deployment guide.

---

## 📚 Important Files Reference

### Essential Files to Know

| File | Purpose |
|------|---------|
| `/code/src/store/caseReducer.ts` | All state update logic |
| `/code/src/store/CaseContext.tsx` | Global state provider |
| `/code/src/types/index.ts` | All type exports |
| `/docs/architecture.md` | Complete architecture decisions |
| `/docs/PRD.md` | Product requirements |
| `/code/src/features/tasks/components/TaskItem.tsx` | Recursive task rendering |
| `/code/src/data/mockCases.ts` | Mock data source |

### shadcn/ui Components Available

Located in `/code/src/components/ui/`:

- `button.tsx`
- `dialog.tsx`
- `input.tsx`
- `form.tsx`
- `dropdown-menu.tsx`
- `badge.tsx`
- `card.tsx`
- `checkbox.tsx`
- `label.tsx`
- `select.tsx`
- `switch.tsx`
- `textarea.tsx`
- `searchable-select.tsx` (custom)
- `toast.tsx` / `toaster.tsx`

---

## 🚨 Common Pitfalls & How to Avoid

### ❌ DON'T: Use relative imports

```typescript
// ❌ Wrong
import { Button } from '../../../components/ui/button';

// ✅ Correct
import { Button } from '@/components/ui/button';
```

### ❌ DON'T: Mark parent tasks done with incomplete children

```typescript
// ❌ Wrong - Will violate business rules
dispatch({
  type: 'UPDATE_TASK_STATUS',
  payload: { taskId: parentId, status: 'DONE' }
});

// ✅ Correct - Check validation first
if (canMarkAsDone(task)) {
  dispatch({ type: 'UPDATE_TASK_STATUS', ... });
} else {
  toast.error('Complete all subtasks first');
}
```

### ❌ DON'T: Mutate state directly

```typescript
// ❌ Wrong
state.cases[0].status = 'DONE';

// ✅ Correct - Always dispatch actions
dispatch({
  type: 'UPDATE_CASE',
  payload: { caseId: case.id, updates: { status: 'DONE' } }
});
```

### ❌ DON'T: Use optional chaining in types

```typescript
// ❌ Wrong
interface Task {
  parentId: string | null;
}

// ✅ Correct
interface Task {
  parentId?: string;
}
```

---

## 🔍 Finding Code

### By Feature

| Feature | Location |
|---------|----------|
| Case List | `/code/src/features/cases/` |
| Case Detail | `/code/src/features/case-detail/` |
| Task Management | `/code/src/features/tasks/` |
| Comments | `/code/src/features/comments/` |
| Notifications | `/code/src/features/notifications/` |
| Attachments | `/code/src/features/attachments/` |

### By Function

| Need | Location |
|------|----------|
| Global State | `/code/src/store/CaseContext.tsx` |
| State Updates | `/code/src/store/caseReducer.ts` |
| Type Definitions | `/code/src/types/` |
| Mock Data | `/code/src/data/` |
| UI Components | `/code/src/components/ui/` |
| Shared Components | `/code/src/components/shared/` |
| Utility Functions | `/code/src/utils/` |

---

## 📖 Additional Resources

### Documentation

- **PRD:** `/docs/PRD.md` - Product requirements and user journeys
- **Architecture:** `/docs/architecture.md` - Complete technical architecture with ADRs
- **Epics:** `/docs/epics.md` - Epic breakdown with stories
- **UX Design:** `/docs/ux-design-specification.md` - UX/UI specifications

### External Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 🤖 AI Assistant Guidelines

### When Working on This Project

1. **Always use `@/` imports** - Never use relative paths
2. **Check architecture.md first** - Understand patterns before coding
3. **Follow naming conventions** - PascalCase for components, camelCase for functions
4. **Respect the feature-based structure** - Don't reorganize into type-based
5. **Use mock data** - No backend/API calls
6. **Test on desktop only** - No mobile responsive requirements
7. **Follow state management pattern** - Always dispatch actions to reducer
8. **Validate status changes** - Check parent/child completion rules
9. **Use TypeScript strictly** - No `any` types
10. **Keep components pure** - Effects in useEffect, handlers separate

### Before Making Changes

- [ ] Read relevant sections in `architecture.md`
- [ ] Check if similar patterns exist in the codebase
- [ ] Understand the Epic/Story context from PRD
- [ ] Verify type definitions in `/code/src/types/`
- [ ] Check if shadcn/ui component already exists

### When Adding Features

- [ ] Place in appropriate feature directory
- [ ] Create types in feature `types.ts` file
- [ ] Add Zod schema in feature `schemas.ts` if forms involved
- [ ] Use existing patterns (forms, state updates, validation)
- [ ] Update mock data if needed
- [ ] Follow component structure pattern
- [ ] Use proper naming conventions

### When Debugging

1. Check reducer actions in `/code/src/store/caseReducer.ts`
2. Verify state shape in `/code/src/store/types.ts`
3. Check component is using `useCaseContext()` correctly
4. Verify imports use `@/` alias
5. Check browser console for errors
6. Verify mock data structure in `/code/src/data/`

---

## 📝 Quick Reference

### Common Commands

```bash
# Development
cd /home/user/arbio-th/code && npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint

# Deploy
vercel
```

### Common Patterns

```typescript
// Get context
const { state, dispatch } = useCaseContext();

// Dispatch action
dispatch({ type: 'UPDATE_CASE', payload: { ... } });

// Show toast
toast.success('Action completed');

// Format date
format(new Date(dateString), 'MMM d, yyyy');

// Validate form
const form = useForm({ resolver: zodResolver(schema) });
```

### File Locations

```
State:        /code/src/store/caseReducer.ts
Types:        /code/src/types/index.ts
Mock Data:    /code/src/data/mockCases.ts
Architecture: /docs/architecture.md
PRD:          /docs/PRD.md
```

---

**Remember:** This is a frontend-only MVP with mock data. Focus on validating workflows and patterns, not backend integration or complex data management.

---

*Generated for AI assistants working on Arbio Ticketing Hub*
*Last Updated: 2025-11-16*
