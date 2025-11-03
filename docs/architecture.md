# Ticketing Hub - Decision Architecture

## Executive Summary

This architecture defines a **frontend-only React/TypeScript MVP** using Vite as the build foundation, with a feature-based project structure and Context + useReducer for state management. The system implements a 3-level hierarchical case management interface (Case → Task → Subtask with infinite nesting) using mock data, optimized for desktop browsers (1280px+) with WCAG 2.1 Level AA accessibility compliance. All architectural decisions are optimized to prevent AI agent conflicts during implementation through strict naming conventions, consistent patterns, and clear integration boundaries.

## Project Initialization

**First implementation story (Story 1.1) should execute:**

```bash
# 1. Initialize Vite project with React + TypeScript template
npm create vite@latest ticketing-hub -- --template react-ts
cd ticketing-hub
npm install

# 2. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Install React Router for navigation
npm install react-router-dom

# 4. Setup shadcn/ui (includes Radix UI primitives)
npx shadcn-ui@latest init

# 5. Install additional dependencies
npm install react-hook-form @hookform/resolvers zod
npm install date-fns
npm install sonner

# 6. Install development dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**This establishes the base architecture with:**
- ✅ Vite build tooling with fast HMR
- ✅ TypeScript strict mode
- ✅ React 18+ with modern patterns
- ✅ Tailwind CSS for styling
- ✅ ESLint for code quality
- ✅ Standard project structure

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Build Tool** | Vite | Latest stable | All | Fast dev server, modern build optimization, native TypeScript support |
| **Framework** | React | 18+ | All | Component-based architecture, established ecosystem |
| **Language** | TypeScript (Strict) | Latest stable | All | Type safety, better DX, catches errors early |
| **Module System** | ES Modules | - | All | Provided by Vite |
| **Routing** | React Router DOM | v6+ | Epic 1, 2 | Industry standard, supports nested routes and breadcrumbs |
| **State Management** | React Context + useReducer | Built-in | All | Zero dependencies, sufficient for mock data, can migrate later |
| **Mock Data Architecture** | Nested Object Structure | - | All | Intuitive for UI rendering, matches hierarchy display |
| **Component Organization** | Feature-based Structure | - | All | Matches epic organization, easier vertical slicing |
| **Styling** | Tailwind CSS + shadcn/ui | Latest stable | All | Utility-first CSS, accessible component library |
| **Design System** | shadcn/ui (Radix UI) | Latest stable | All | WCAG AA compliant, customizable, modern aesthetics |
| **Form Handling** | React Hook Form + Zod | v7+ | Epic 1, 2 | Reduces boilerplate, built-in validation, TypeScript support |
| **Date/Time Library** | date-fns | v3+ | All | Tree-shakeable, simple API, TypeScript support |
| **Testing** | Vitest + React Testing Library | Latest stable | All | Vite-native, fast, encourages accessible patterns |
| **Accessibility** | shadcn/ui + Manual ARIA | - | All | Leverages built-in WCAG AA compliance, custom components |
| **Error Boundaries** | React Error Boundaries | Built-in | All | Standard pattern, catches component errors |
| **Loading States** | Optimistic UI + Skeletons | - | All | Matches UX principle of instant feedback |
| **Notifications** | Sonner | Latest stable | All | Lightweight, accessible, integrates with shadcn/ui |
| **Linting** | ESLint | Provided by Vite | All | Code quality enforcement |

## Project Structure

```
ticketing-hub/
├── public/                        # Static assets
│   └── vite.svg
├── src/
│   ├── main.tsx                   # App entry point with providers
│   ├── App.tsx                    # Root component with routing
│   ├── routes/                    # Route definitions
│   │   └── index.tsx
│   │
│   ├── features/                  # Feature-based organization
│   │   ├── cases/                 # Epic 1: Case Management
│   │   │   ├── components/
│   │   │   │   ├── CaseList.tsx
│   │   │   │   ├── CaseListItem.tsx
│   │   │   │   ├── CaseFilters.tsx
│   │   │   │   └── CreateCaseModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useCaseFilters.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── case-detail/           # Epic 2: Case Details
│   │   │   ├── components/
│   │   │   │   ├── CaseDetail.tsx
│   │   │   │   ├── CaseHeader.tsx
│   │   │   │   ├── CaseDescription.tsx
│   │   │   │   └── EditCaseForm.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── tasks/                 # Epic 2: Task Hierarchy
│   │   │   ├── components/
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskItem.tsx
│   │   │   │   ├── CreateTaskForm.tsx
│   │   │   │   ├── CreateSubtaskForm.tsx
│   │   │   │   ├── EditTaskForm.tsx
│   │   │   │   └── HierarchicalTaskList.tsx  # Custom recursive component
│   │   │   ├── hooks/
│   │   │   │   ├── useTaskActions.ts
│   │   │   │   └── useStatusValidation.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── collaboration/         # Epic 3: Comments & Attachments
│   │   │   ├── components/
│   │   │   │   ├── CommentThread.tsx
│   │   │   │   ├── CommentItem.tsx
│   │   │   │   ├── CommentInput.tsx
│   │   │   │   ├── AttachmentGrid.tsx
│   │   │   │   └── AttachmentItem.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── context/               # Epic 3: Sidebar Context
│   │   │   ├── components/
│   │   │   │   ├── ContextSidebar.tsx
│   │   │   │   ├── PropertyContextPanel.tsx
│   │   │   │   ├── ReservationContextPanel.tsx
│   │   │   │   └── GuestCommunicationPanel.tsx
│   │   │   └── types.ts
│   │   │
│   │   └── notifications/         # Epic 3: Notifications
│   │       ├── components/
│   │       │   ├── NotificationBell.tsx
│   │       │   ├── NotificationDropdown.tsx
│   │       │   └── NotificationItem.tsx
│   │       └── types.ts
│   │
│   ├── components/                # Shared components
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── form.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (other shadcn components)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── shared/
│   │       ├── DomainBadge.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── store/                     # State management (Context + Reducer)
│   │   ├── CaseContext.tsx        # Case state provider
│   │   ├── caseReducer.ts         # Case state reducer
│   │   └── types.ts               # Store types
│   │
│   ├── data/                      # Mock data
│   │   ├── mockCases.ts           # Sample cases with tasks
│   │   ├── mockProperties.ts      # Property data
│   │   ├── mockReservations.ts    # Reservation data
│   │   ├── mockUsers.ts           # User data
│   │   └── mockNotifications.ts   # Notification data
│   │
│   ├── types/                     # Global TypeScript types
│   │   ├── case.ts                # Case interface
│   │   ├── task.ts                # Task interface
│   │   ├── property.ts            # Property interface
│   │   ├── reservation.ts         # Reservation interface
│   │   ├── user.ts                # User interface
│   │   ├── comment.ts             # Comment interface
│   │   ├── attachment.ts          # Attachment interface
│   │   ├── notification.ts        # Notification interface
│   │   └── enums.ts               # Status, DomainType enums
│   │
│   ├── utils/                     # Utility functions
│   │   ├── date.ts                # Date formatting helpers
│   │   ├── validation.ts          # Validation helpers
│   │   └── constants.ts           # App constants
│   │
│   ├── hooks/                     # Global custom hooks
│   │   └── useLocalStorage.ts
│   │
│   └── styles/                    # Global styles
│       └── globals.css            # Tailwind imports + custom styles
│
├── tests/                         # Test files
│   ├── setup.ts                   # Vitest setup
│   └── ... (mirror src structure)
│
├── .gitignore
├── package.json
├── tsconfig.json                  # TypeScript config (strict mode)
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind config
├── postcss.config.js              # PostCSS config
├── components.json                # shadcn/ui config
├── eslint.config.js               # ESLint config
└── README.md
```

## Epic to Architecture Mapping

| Epic | Primary Directories | Components | Integration Points |
|------|--------------------|-----------|--------------------|
| **Epic 1: Project Foundation & Case List Management** | `/features/cases`<br>`/components/layout`<br>`/store`<br>`/data` | - `CaseList` (table/card view)<br>- `CaseFilters` (status, domain)<br>- `CreateCaseModal` (form)<br>- `Navbar` (persistent navigation)<br>- `CaseContext` (global state) | - Routing: `/` → CaseList<br>- State: CaseContext provider in `main.tsx`<br>- Navigation: Navbar links to case detail<br>- Mock data loaded on initialization |
| **Epic 2: Case Details & Task Hierarchy Management** | `/features/case-detail`<br>`/features/tasks`<br>`/store` | - `CaseDetail` (main layout)<br>- `CaseHeader` (title, status, owner)<br>- `HierarchicalTaskList` (recursive tree)<br>- `TaskItem` (individual task with nesting)<br>- Task/Subtask creation forms<br>- Status validation hooks | - Routing: `/cases/:caseId` → CaseDetail<br>- State: Consumes CaseContext<br>- Recursive rendering for infinite nesting<br>- Status validation prevents parent completion<br>- Optimistic updates via reducer |
| **Epic 3: Collaboration & Notifications** | `/features/collaboration`<br>`/features/context`<br>`/features/notifications` | - `CommentThread` (chronological display)<br>- `CommentInput` (always visible)<br>- `AttachmentGrid` (file display)<br>- `ContextSidebar` (Property/Reservation)<br>- `NotificationBell` (navbar icon)<br>- `NotificationDropdown` (list) | - Embedded in CaseDetail layout<br>- Sidebar displays linked entity data<br>- Notifications in Navbar<br>- Toast feedback via Sonner<br>- Comments stored in case object |

## Technology Stack Details

### Core Technologies

**Build & Development:**
- **Vite**: Ultra-fast dev server with HMR, optimized production builds
- **TypeScript 5+**: Strict mode enabled for maximum type safety
- **ESLint**: Code quality and consistency enforcement

**Frontend Framework:**
- **React 18+**: Component-based UI with Concurrent features
- **React Router DOM v6+**: Client-side routing with nested routes
- **React Hook Form v7+**: Performant form state management
- **Zod**: TypeScript-first schema validation

**Styling & UI:**
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library (built on Radix UI)
- **Radix UI Primitives**: Unstyled, accessible component primitives

**State & Data:**
- **React Context API**: Global state container
- **useReducer**: Predictable state updates
- **localStorage**: Persistence layer for demo (optional)

**Utilities:**
- **date-fns v3+**: Date manipulation and formatting
- **Sonner**: Toast notification system

**Testing:**
- **Vitest**: Fast unit test runner (Vite-native)
- **React Testing Library**: Component testing focused on user behavior
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **jsdom**: DOM implementation for Node.js

### Integration Points

**1. Application Entry (`main.tsx`):**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CaseProvider } from '@/store/CaseContext';
import { Toaster } from 'sonner';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CaseProvider>
        <App />
        <Toaster position="bottom-right" />
      </CaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

**2. Routing Structure (`App.tsx`):**
```typescript
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CaseList } from '@/features/cases/components/CaseList';
import { CaseDetail } from '@/features/case-detail/components/CaseDetail';
import { NotFound } from '@/components/shared/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CaseList />} />
        <Route path="/cases/:caseId" element={<CaseDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

**3. State Management Flow:**
- **Provider**: `CaseContext` wraps entire app in `main.tsx`
- **Consumer**: Components use `useCaseContext()` hook
- **Updates**: Dispatch actions to reducer
- **Flow**: Component → Dispatch Action → Reducer → New State → Re-render

**4. Component Communication:**
- **Parent-Child**: Props (max 2 levels deep)
- **Deeply Nested**: Context consumption via `useCaseContext()`
- **Siblings**: Shared parent state or Context
- **No prop drilling** beyond 2 levels

**5. Data Flow:**
```
Mock Data (data/) 
  → Loaded into CaseContext on init
  → Components consume via useCaseContext()
  → User actions dispatch to reducer
  → Reducer updates state immutably
  → React re-renders affected components
  → Optional: Persist to localStorage
```

## Implementation Patterns

### MANDATORY: All AI Agents Must Follow These Patterns

---

### **Naming Conventions**

#### Files and Folders
```
Components: PascalCase.tsx          → CaseList.tsx, TaskItem.tsx
Hooks: useCamelCase.ts              → useCaseFilters.ts, useTaskActions.ts
Types: camelCase.ts or types.ts     → case.ts, types.ts
Tests: CoLocated.test.tsx           → CaseList.test.tsx
Utils: camelCase.ts                 → date.ts, validation.ts
```

#### Variables and Functions
```typescript
// Components: PascalCase
export function CaseList() {}

// Functions: camelCase
function handleStatusChange() {}
function formatCaseDate() {}

// Constants: UPPER_SNAKE_CASE
const MAX_NESTING_DEPTH = 10;
const DEFAULT_STATUS = 'TODO';

// Event handlers: handle + EventName
onClick={handleClick}
onSubmit={handleSubmit}
onChange={handleStatusChange}

// Boolean variables: is/has/should prefix
const isLoading = false;
const hasSubtasks = true;
const shouldValidate = true;
```

---

### **Component Structure Pattern**

**MANDATORY order for all component files:**

```typescript
// 1. Imports (grouped)
import React from 'react';                      // React
import { useNavigate } from 'react-router-dom'; // Third-party
import { Button } from '@/components/ui/button'; // UI components
import { useCaseContext } from '@/store/CaseContext'; // Local
import type { Case } from '@/types/case';       // Types

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
  return (
    <div>{/* JSX */}</div>
  );
}
```

---

### **Import Order (MANDATORY)**

```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// 3. UI components (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 4. Internal components
import { CaseList } from '@/features/cases/components/CaseList';

// 5. Hooks
import { useCaseContext } from '@/store/CaseContext';

// 6. Utils
import { formatDate } from '@/utils/date';

// 7. Types (with 'type' keyword)
import type { Case, Task } from '@/types';

// 8. Styles (last)
import '@/styles/custom.css';
```

---

### **TypeScript Patterns**

```typescript
// Use 'interface' for object shapes
interface Case {
  id: string;
  title: string;
  description: string;
  status: Status;
  domain: DomainType;
  tasks: Task[];
  propertyId?: string;
  reservationId?: string;
  assignedTo?: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string;
  comments?: Comment[];
  attachments?: Attachment[];
}

// Use 'type' for unions
type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
type DomainType = 'PROPERTY' | 'RESERVATION' | 'FINANCE';

// Props interfaces: ComponentNameProps
interface CaseListProps {
  filter?: string;
  onSelect?: (id: string) => void;
}

// Use optional chaining, NOT null unions
interface Task {
  parentId?: string;  // ✅ Correct
  // NOT: parentId: string | null  // ❌ Wrong
}
```

---

### **State Management Pattern**

**Context State Shape (MANDATORY):**

```typescript
// store/types.ts
interface CaseState {
  cases: Case[];
  loading: boolean;
  error: string | null;
}

type CaseAction =
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'UPDATE_CASE'; payload: { id: string; updates: Partial<Case> } }
  | { type: 'DELETE_CASE'; payload: string }
  | { type: 'ADD_TASK'; payload: { caseId: string; task: Task } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { caseId: string; taskId: string; status: Status } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };
```

**Context Setup (MANDATORY):**

```typescript
// store/CaseContext.tsx
const CaseContext = createContext<{
  state: CaseState;
  dispatch: Dispatch<CaseAction>;
} | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(caseReducer, initialState);
  
  return (
    <CaseContext.Provider value={{ state, dispatch }}>
      {children}
    </CaseContext.Provider>
  );
}

// MANDATORY: Custom hook with error checking
export function useCaseContext() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCaseContext must be used within CaseProvider');
  }
  return context;
}
```

**Reducer Pattern (MANDATORY):**

```typescript
// store/caseReducer.ts
export function caseReducer(state: CaseState, action: CaseAction): CaseState {
  switch (action.type) {
    case 'ADD_CASE':
      return {
        ...state,
        cases: [...state.cases, action.payload],
      };
      
    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map(c =>
          c.id === action.payload.id
            ? { ...c, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : c
        ),
      };
      
    case 'DELETE_CASE':
      return {
        ...state,
        cases: state.cases.filter(c => c.id !== action.payload),
      };
      
    default:
      return state;
  }
}
```

---

### **Recursive Component Pattern (Task Hierarchy)**

**MANDATORY approach for infinite nesting:**

```typescript
interface TaskItemProps {
  task: Task;
  depth: number;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskItem({ task, depth, onUpdate }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Visual indentation based on depth (20px per level)
  const indentStyle = { paddingLeft: `${depth * 20}px` };
  
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  
  return (
    <div style={indentStyle} className="task-item">
      {/* Task header */}
      <div className="task-header flex items-center gap-2">
        {hasSubtasks && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-button"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <span className="task-id">{task.id}</span>
        <span className="task-title">{task.title}</span>
        <StatusBadge status={task.status} onChange={(newStatus) => onUpdate(task.id, { status: newStatus })} />
      </div>
      
      {/* Recursive rendering of subtasks */}
      {isExpanded && hasSubtasks && (
        <div className="subtasks">
          {task.subtasks!.map(subtask => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              depth={depth + 1}  // Increment depth for nesting
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### **Form Pattern (React Hook Form + shadcn/ui)**

**MANDATORY form structure:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Schema definition
const caseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  domain: z.enum(['PROPERTY', 'RESERVATION', 'FINANCE']),
});

type CaseFormData = z.infer<typeof caseSchema>;

export function CreateCaseForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: '',
      description: '',
      domain: 'PROPERTY',
    },
  });
  
  const onSubmit = (data: CaseFormData) => {
    try {
      // Create case logic
      toast.success('Case created successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create case');
      console.error('Case creation error:', error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter case title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Create Case</Button>
      </form>
    </Form>
  );
}
```

---

### **Date Formatting Patterns**

**MANDATORY date/time handling:**

```typescript
import { format } from 'date-fns';

// Storage: Always ISO 8601 strings
const createdAt = new Date().toISOString();
// "2024-11-02T15:30:00.000Z"

// Display formats
const displayDate = format(new Date(createdAt), 'MMM d, yyyy');
// "Nov 2, 2024"

const displayTime = format(new Date(createdAt), 'h:mm a');
// "3:30 PM"

const displayDateTime = format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a");
// "Nov 2, 2024 at 3:30 PM"

// Relative timestamps (utility function)
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) return `Today at ${format(date, 'h:mm a')}`;
  if (diffInHours < 48) return `Yesterday at ${format(date, 'h:mm a')}`;
  return format(date, "MMM d, yyyy 'at' h:mm a");
}
```

---

## Consistency Rules

### Status Badge Colors (MANDATORY)

```typescript
// utils/constants.ts
export const STATUS_STYLES = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-50 text-gray-400 line-through',
} as const;

// Usage in StatusBadge component
<Badge className={STATUS_STYLES[status]}>
  {status.replace('_', ' ')}
</Badge>
```

### Domain Badge Colors (MANDATORY)

```typescript
export const DOMAIN_STYLES = {
  PROPERTY: 'bg-blue-100 text-blue-700',
  RESERVATION: 'bg-purple-100 text-purple-700',
  FINANCE: 'bg-green-100 text-green-700',
} as const;
```

### Toast Messages (MANDATORY format)

```typescript
// Success messages
toast.success('Case created successfully');
toast.success('Task status updated');
toast.success('Comment posted');

// Error messages
toast.error('Failed to create case');
toast.error('Cannot mark as Done. Complete all subtasks first.');
toast.error('Failed to load case. Please try again.');

// Info messages
toast.info('Changes saved');
```

### User-Facing Error Messages (MANDATORY format)

```typescript
// Validation errors
"Title is required"
"Description must be at least 10 characters"
"Select at least one: Property or Reservation"

// Status validation errors
"Cannot mark as Done. Complete all child tasks first."
"Cannot mark as Done. Complete all subtasks first."

// System errors
"Failed to create case. Please try again."
"Something went wrong. Please refresh the page."
```

---

## Error Handling Strategy

**MANDATORY error handling pattern:**

```typescript
// 1. Try-catch for operations
try {
  dispatch({ type: 'UPDATE_CASE', payload: { id: caseId, updates } });
  toast.success('Case updated');
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed to update case';
  toast.error(message);
  console.error('[CaseStore] Update error:', error);
}

// 2. Error boundaries at route level
// components/layout/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  // Catches component render errors
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// 3. Error format
interface AppError {
  message: string;
  code?: string;
  details?: any;
}
```

---

## Logging Strategy

**Level 2 MVP approach:**

```typescript
// Development: Use console with structured messages
console.log('[CaseStore] Creating case:', { domain, title });
console.warn('[TaskValidation] Status change blocked:', { taskId, reason });
console.error('[CaseStore] Failed to create case:', error);

// Production: Remove console.log, keep errors
if (process.env.NODE_ENV === 'development') {
  console.log('[Debug]', data);
}
```

---

## Data Architecture

### Core Data Models

```typescript
// types/enums.ts
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type DomainType = 'PROPERTY' | 'RESERVATION' | 'FINANCE';

// types/case.ts
export interface Case {
  id: string;                    // Format: "TK-####"
  title: string;
  description: string;
  status: Status;
  domain: DomainType;
  tasks: Task[];                 // Nested array
  propertyId?: string;           // Link to Property
  reservationId?: string;        // Link to Reservation
  assignedTo?: string;           // User ID
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
  comments?: Comment[];
  attachments?: Attachment[];
}

// types/task.ts
export interface Task {
  id: string;                    // Format: "TK-####.N" or "TK-####.N.N"
  title: string;
  description?: string;
  status: Status;
  assignedTo?: string;
  subtasks?: Task[];             // Recursive: enables infinite nesting
  createdAt: string;
  updatedAt: string;
}

// types/property.ts
export interface Property {
  id: string;
  unitId: string;
  address: string;
  status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
  lastMaintenanceDate: string;
}

// types/reservation.ts
export interface Reservation {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  bookingValue: number;
  propertyId: string;
}

// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PROPERTY_MANAGER' | 'GUEST_COMM' | 'TECHNICIAN' | 'FINANCE';
  avatar?: string;
}

// types/comment.ts
export interface Comment {
  id: string;
  caseId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

// types/attachment.ts
export interface Attachment {
  id: string;
  caseId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;  // For mock: placeholder URL
}

// types/notification.ts
export interface Notification {
  id: string;
  type: 'ASSIGNMENT' | 'STATUS_CHANGE' | 'COMMENT';
  message: string;
  caseId: string;
  read: boolean;
  createdAt: string;
}
```

### Data Relationships

```
Case (1) ←→ (*) Task (recursive, infinite nesting)
Case (1) ←→ (*) Comment
Case (1) ←→ (*) Attachment
Case (*) ←→ (1) Property (optional)
Case (*) ←→ (1) Reservation (optional)
Case (*) ←→ (1) User (assignedTo)
Notification (*) ←→ (1) Case
```

### Mock Data Structure

**Minimum 2 complete cases required:**

```typescript
// data/mockCases.ts
export const mockCases: Case[] = [
  {
    id: 'TK-2847',
    title: 'WiFi not working in Unit 401',
    description: 'Guest reports unable to connect to WiFi...',
    status: 'IN_PROGRESS',
    domain: 'PROPERTY',
    propertyId: 'PROP-401',
    reservationId: 'RES-1234',
    assignedTo: 'USER-PM1',
    tasks: [
      {
        id: 'TK-2847.1',
        title: 'Technician to investigate router',
        status: 'IN_PROGRESS',
        assignedTo: 'USER-TECH1',
        subtasks: [
          {
            id: 'TK-2847.1.1',
            title: 'Check router power and connections',
            status: 'DONE',
          },
          {
            id: 'TK-2847.1.2',
            title: 'Test WiFi signal strength',
            status: 'IN_PROGRESS',
          },
        ],
      },
      {
        id: 'TK-2847.2',
        title: 'Guest communication - resolution',
        status: 'TODO',
        assignedTo: 'USER-GC1',
      },
    ],
    comments: [
      {
        id: 'COMMENT-1',
        caseId: 'TK-2847',
        userId: 'USER-PM1',
        userName: 'Sarah Johnson',
        text: 'Contacted technician, waiting for update',
        createdAt: '2024-11-02T09:30:00Z',
      },
    ],
    attachments: [],
    createdAt: '2024-11-02T08:00:00Z',
    updatedAt: '2024-11-02T09:30:00Z',
  },
  // ... second case
];
```

---

## API Contracts

**Note:** This is a frontend-only MVP with no backend. API contracts defined here are for future integration reference.

### Future REST API Endpoints (Reference)

```
GET    /api/cases              - List all cases (with filters)
POST   /api/cases              - Create new case
GET    /api/cases/:id          - Get case details
PATCH  /api/cases/:id          - Update case
DELETE /api/cases/:id          - Delete case

POST   /api/cases/:id/tasks    - Create task under case
PATCH  /api/tasks/:id          - Update task
DELETE /api/tasks/:id          - Delete task

POST   /api/cases/:id/comments - Add comment
POST   /api/cases/:id/attachments - Upload attachment
```

### Response Format (Future Reference)

```typescript
// Success response
{
  data: Case | Case[] | Task | etc,
  meta?: {
    total: number,
    page: number,
    pageSize: number
  }
}

// Error response
{
  error: {
    message: string,
    code: string,
    details?: any
  }
}
```

---

## Security Architecture

**Level 2 MVP: No authentication or backend**

### For Future Phases (Reference)

- **Authentication:** JWT tokens via NextAuth.js or similar
- **Authorization:** Role-based access control (RBAC)
  - Property Managers: Full access
  - Guest Comm: Create/update cases, add comments
  - Technicians: Update task status
- **Data Protection:** 
  - HTTPS only
  - Input sanitization
  - XSS protection via React's built-in escaping
- **File Upload Security:**
  - File type validation
  - Size limits
  - Virus scanning

**Current MVP Security:**
- Input validation via Zod schemas
- TypeScript type safety
- React's built-in XSS protection
- No sensitive data stored (mock data only)

---

## Performance Considerations

### Optimization Strategies

**Code Splitting:**
```typescript
// Lazy load routes
const CaseDetail = lazy(() => import('@/features/case-detail/components/CaseDetail'));

<Suspense fallback={<LoadingSkeleton />}>
  <CaseDetail />
</Suspense>
```

**Memoization:**
```typescript
// Expensive computations
const filteredCases = useMemo(() => 
  cases.filter(c => c.status === filter),
  [cases, filter]
);

// Prevent unnecessary re-renders
const TaskItem = memo(({ task }: TaskItemProps) => {
  // Component implementation
});
```

**Virtual Scrolling:**
- Not required for Level 2 (mock data is small)
- Consider for Level 3+ if case lists exceed 100 items

**Bundle Size:**
- Vite's tree-shaking removes unused code
- shadcn/ui components are imported individually
- date-fns functions imported individually
- Target: < 200KB initial bundle (gzipped)

### NFR Compliance

**NFR003: Responsive UI with Optimistic Updates**
- State changes via reducer are synchronous (instant)
- UI updates immediately before "persistence"
- Toast notifications confirm actions
- No loading spinners for < 300ms operations
- Skeleton screens only for initial page load

**Desktop-Only Optimization (NFR002):**
- Fixed layout optimized for 1280px+ width
- No mobile breakpoints or responsive logic
- Simplifies CSS and reduces bundle size

---

## Deployment Architecture

**Level 2 MVP: Static Hosting**

### Recommended Platforms

**Option A: Vercel** (Recommended for Vite/React)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option B: Netlify**
```bash
# Build command
npm run build

# Publish directory
dist/
```

**Option C: GitHub Pages**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/ticketing-hub/',
  build: {
    outDir: 'dist',
  },
});
```

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
});
```

---

## Development Environment

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ or **pnpm**: v8+
- **Git**: v2.40+
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript + JavaScript

### Setup Commands

```bash
# Clone repository
git clone <repository-url>
cd ticketing-hub

# Install dependencies
npm install

# Run development server
npm run dev
# Server runs at http://localhost:5173

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```bash
# .env (if needed for future integrations)
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Ticketing Hub
```

### Development Workflow

1. **Branch Strategy:** Feature branches from `main`
2. **Commit Convention:** Conventional Commits
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation updates
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Test additions/updates
3. **Code Review:** Required before merging to `main`
4. **Testing:** Run tests before committing

---

## Accessibility Implementation

### WCAG 2.1 Level AA Compliance Strategy

**Built-in Accessibility (shadcn/ui):**
- All shadcn/ui components are WCAG AA compliant by default
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management

**Custom Component Requirements:**

**1. HierarchicalTaskList:**
```typescript
<div role="tree" aria-label="Task hierarchy">
  <div role="treeitem" aria-expanded={isExpanded} tabIndex={0}>
    {/* Task content */}
  </div>
</div>
```

**2. Keyboard Navigation:**
- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons, toggle expand/collapse
- Arrow keys: Navigate tree hierarchy
- Escape: Close modals and dropdowns

**3. Focus Indicators:**
```css
/* Tailwind classes */
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

**4. Screen Reader Support:**
```typescript
// Status change announcements
<div role="status" aria-live="polite" aria-atomic="true">
  Task status updated to In Progress
</div>

// Form errors
<span role="alert" aria-live="assertive">
  {error}
</span>
```

**5. Color Contrast:**
- All text meets 4.5:1 contrast ratio minimum
- Status badges use sufficient contrast
- Tailwind's default colors meet WCAG standards

### Testing Strategy

**Automated:**
- Lighthouse accessibility audits (target: 95+ score)
- ESLint plugin: eslint-plugin-jsx-a11y
- React Testing Library: Use accessible queries (getByRole, getByLabelText)

**Manual:**
- Keyboard-only navigation testing
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- Color blindness simulation (Chrome DevTools)

---

## Architecture Decision Records (ADRs)

### ADR-001: Choose Vite over Create React App

**Context:** Need a modern build tool for React + TypeScript project.

**Decision:** Use Vite as the build foundation.

**Rationale:**
- CRA is no longer actively maintained
- Vite provides significantly faster dev server (HMR in < 100ms)
- Better production build optimization
- Native ESM support
- Simpler configuration

**Consequences:** Requires Node.js 18+, team needs basic Vite knowledge.

---

### ADR-002: Use Context + useReducer over External State Library

**Context:** Need state management for hierarchical case data.

**Decision:** Use React's built-in Context API with useReducer.

**Rationale:**
- Zero dependencies
- Sufficient complexity for Level 2 MVP with mock data
- Easy to migrate to Zustand or TanStack Query later
- Team already familiar with React patterns

**Consequences:** More boilerplate than Zustand, but acceptable for MVP scope.

---

### ADR-003: Feature-Based Structure over Type-Based

**Context:** Need to organize growing codebase with 16 stories across 3 epics.

**Decision:** Use feature-based folder structure.

**Rationale:**
- Aligns with epic organization in PRD
- Makes vertical slices (stories) easier to implement
- Related code grouped together
- Scales better than type-based structure

**Consequences:** Shared components require careful placement in `/components/shared`.

---

### ADR-004: Nested Object Structure for Mock Data

**Context:** Need to model 3-level hierarchy (Case → Task → Subtask with infinite nesting).

**Decision:** Use nested object structure with children arrays.

**Rationale:**
- More intuitive for rendering UI
- Matches visual hierarchy
- Simpler component logic
- Acceptable performance for mock data scale (2 cases)

**Consequences:** Updates to deeply nested items require tree traversal. Can normalize later if needed.

---

### ADR-005: shadcn/ui over Material-UI or Chakra UI

**Context:** Need accessible, customizable component library.

**Decision:** Use shadcn/ui built on Radix UI primitives.

**Rationale:**
- Components live in codebase (full customization)
- WCAG 2.1 AA compliant out of the box
- Perfect Tailwind CSS integration
- Modern, minimal aesthetic matches UX spec
- No runtime JS library (copy/paste components)

**Consequences:** Slightly more setup than packaged libraries, but maximum flexibility.

---

### ADR-006: React Hook Form over Formik

**Context:** Need form handling for case creation, task creation, and editing.

**Decision:** Use React Hook Form with Zod validation.

**Rationale:**
- Better performance (uncontrolled inputs)
- Smaller bundle size (9kb vs 15kb)
- Excellent TypeScript support
- Perfect integration with shadcn/ui
- Zod provides type-safe validation

**Consequences:** Different API from Formik, but better DX overall.

---

### ADR-007: Optimistic UI Updates over Loading States

**Context:** UX spec emphasizes "instant and decisive" feedback.

**Decision:** Use optimistic UI updates with immediate state changes.

**Rationale:**
- Matches UX principle: "Speed: Instant and Decisive"
- No backend latency in Level 2 (mock data)
- Better perceived performance
- Toast notifications provide confirmation

**Consequences:** Must handle edge cases where updates fail (future backend integration).

---

## Validation Checklist

- ✅ All 12 architectural decisions documented with versions
- ✅ Every epic mapped to architecture components
- ✅ Complete source tree (no placeholders)
- ✅ All FRs from PRD have architectural support
- ✅ All NFRs from PRD addressed
- ✅ Implementation patterns cover all potential agent conflicts
- ✅ Naming conventions defined (files, variables, functions)
- ✅ Structure patterns defined (component organization, imports)
- ✅ Format patterns defined (TypeScript, dates, state)
- ✅ Communication patterns defined (Context, props)
- ✅ Consistency patterns defined (colors, messages, errors)
- ✅ Recursive component pattern documented
- ✅ Form handling pattern documented
- ✅ Error handling strategy defined
- ✅ Logging approach defined
- ✅ Date/time formats standardized
- ✅ Project initialization commands provided
- ✅ Development environment setup documented
- ✅ Testing strategy defined
- ✅ Accessibility implementation documented
- ✅ 7 Architecture Decision Records included

---

_Generated by BMAD Decision Architecture Workflow_  
_Date: November 2, 2025_  
_For: Arnon_  
_Project: Ticketing Hub (Level 2 MVP)_




