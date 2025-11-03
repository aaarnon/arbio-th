# Ticketing Hub - Epic Breakdown

**Author:** Arnon
**Date:** November 2, 2025
**Project Level:** 2
**Target Scale:** Frontend MVP prototype with mock data (1-2 weeks, 13-16 stories)

---

## Overview

This document provides the detailed epic breakdown for Ticketing Hub, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: Project Foundation & Case List Management

**Expanded Goal:** 
Establish the foundational project infrastructure with React/TypeScript setup, create a comprehensive mock data architecture supporting the 3-level hierarchy, and deliver the first user-facing functionality: a case list view where Property Managers can see all cases and create new ones. This epic ensures the development environment is ready and validates the basic UI patterns that will be extended in subsequent epics.

---

### Story 1.1: Project Setup and Development Infrastructure

As a developer,
I want a fully configured React/TypeScript project with build tools and routing,
So that I have a solid foundation to build the Ticketing Hub application.

**Acceptance Criteria:**
1. React 18+ project initialized with TypeScript and Vite (or similar modern build tool)
2. Project includes routing library (React Router) configured for multi-page navigation
3. Basic folder structure established: `/components`, `/pages`, `/types`, `/data`, `/utils`
4. ESLint and Prettier configured for code quality
5. Development server runs successfully with hot reload
6. README includes setup instructions

**Prerequisites:** None (first story)

---

### Story 1.2: Mock Data Architecture and TypeScript Types

As a developer,
I want comprehensive TypeScript types and mock data structures,
So that I can model the complete case/task/subtask hierarchy with all required fields.

**Acceptance Criteria:**
1. TypeScript interfaces defined for: `Case`, `Task`, `Subtask`, `Property`, `Reservation`, `User`, `Comment`, `Attachment`, `Notification`
2. `Status` enum defined: `TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`
3. `DomainType` enum defined: `PROPERTY`, `RESERVATION`, `FINANCE`
4. Mock data file created with 2 complete cases including nested tasks/subtasks (at least 3 levels deep)
5. Mock property and reservation data linked to cases
6. Mock users for assignment (Property Managers, Guest Comm, Technicians)
7. Mock data includes all fields shown in design: descriptions, timestamps, assignees, attachments, comments
8. Data structure supports infinite subtask nesting

**Prerequisites:** Story 1.1

---

### Story 1.3: Navigation Bar with Notification Bell

As a Property Manager,
I want a persistent navigation bar with the Arbio logo, "New Case" button, and notification bell icon,
So that I can access key actions from any page.

**Acceptance Criteria:**
1. Navbar component renders at top of all pages with Arbio Nexus branding
2. "Ticketing Hub" label/logo displayed on left side with navigation to home
3. "+ New Case" button visible in navbar (click shows placeholder alert for now)
4. Bell icon displayed on right side with mock notification badge (e.g., "3")
5. Clicking bell icon toggles dropdown showing placeholder text (actual notifications in Epic 3)
6. Navbar is sticky (remains visible when scrolling)
7. Navbar styling matches provided design mockup

**Prerequisites:** Story 1.1, 1.2

---

### Story 1.4: Case List View with Display and Filtering

As a Property Manager,
I want to view a list of all cases with key information and basic filtering,
So that I can quickly find and access cases I need to work on.

**Acceptance Criteria:**
1. Case list page displays all cases from mock data in table/card format
2. Each case shows: Case ID, title/description preview, domain category badge, status, assigned owner, created date
3. Cases are sortable by creation date (default: newest first)
4. Status filter dropdown allows filtering by: All, To Do, In Progress, Done, Cancelled
5. Domain filter allows filtering by: All, Property, Reservation, Finance
6. Clicking a case navigates to case detail view (placeholder page for now - details in Epic 2)
7. Empty state shown when no cases match filters
8. UI is responsive within desktop viewport (1280px+)

**Prerequisites:** Story 1.1, 1.2, 1.3

---

### Story 1.5: Case Creation Form

As a Property Manager or Guest Communications team member,
I want to create a new case by filling out a form with required fields,
So that I can log issues into the Ticketing Hub system.

**Acceptance Criteria:**
1. Clicking "+ New Case" in navbar opens modal/form overlay
2. Form includes fields: Domain type (dropdown: Property/Reservation/Finance), Description (textarea, required), Assignee (dropdown of mock users)
3. Form includes either Property selector (dropdown of mock properties) OR Reservation selector (dropdown of mock reservations) - at least one required
4. Form includes optional file attachment field (accepts multiple files, stored in mock data structure)
5. "Create Case" button validates required fields and shows error messages if validation fails
6. Successfully creating a case adds it to mock data, shows success message, closes modal, and navigates to case detail page
7. "Cancel" button closes modal without saving
8. New case is assigned default status "To Do" and includes creation timestamp

**Prerequisites:** Story 1.1, 1.2, 1.3, 1.4

---

## Epic 2: Case Details & Task Hierarchy Management

**Expanded Goal:**
Build the core case detail view with the 3-level hierarchy visualization (Case → Task → Subtask with infinite nesting). Implement full CRUD operations for tasks and subtasks, including the critical status management rules that prevent closing parent items until all children are complete. This epic delivers the primary workflow interface where Property Managers spend most of their time managing operational issues.

---

### Story 2.1: Case Detail Page Layout and Basic Display

As a Property Manager,
I want to view comprehensive case details in a structured layout,
So that I can understand the full context of an issue.

**Acceptance Criteria:**
1. Case detail page route created (e.g., `/cases/:caseId`)
2. 2-panel layout implemented: Main content area (left/center 65%), Contextual sidebar (right 35%)
3. Case header displays: Case ID, title/description, domain category badge, status dropdown, assigned owner, creation date
4. Case description section shows full text with formatting preserved
5. Empty "Tasks" section with "+ Add Task" button displayed
6. Breadcrumb navigation shows: "Ticketing Hub > TK-2847" (case ID)
7. Layout is fixed and optimized for 1280px+ desktop viewports
8. Loading state shown while fetching case data
9. 404 error state shown for invalid case IDs

**Prerequisites:** Epic 1 complete (Stories 1.1-1.5)

---

### Story 2.2: Task Display with Hierarchical Visualization

As a Property Manager,
I want to see all tasks and subtasks in a hierarchical tree structure,
So that I can understand the breakdown of work and dependencies.

**Acceptance Criteria:**
1. Tasks section displays all tasks belonging to the case
2. Each task shows: Task ID, title, status badge, assigned owner, expand/collapse icon (if has subtasks)
3. Visual indentation (20-30px per level) indicates nesting depth for subtasks
4. Expandable/collapsible sections for tasks containing subtasks
5. Subtasks can be nested infinitely - each subtask level shows same information as parent task
6. Empty state shown when case has no tasks ("No tasks yet. Click + Add Task to get started")
7. Task hierarchy updates immediately when data changes (optimistic UI)
8. Visual lines or borders help distinguish nesting levels

**Prerequisites:** Story 2.1

---

### Story 2.3: Create and Assign Tasks to Cases

As a Property Manager,
I want to create tasks under a case and assign them to team members,
So that I can break down work and delegate responsibilities.

**Acceptance Criteria:**
1. "+ Add Task" button in Tasks section opens inline task creation form
2. Task form includes: Title (required), Description (optional textarea), Assignee (dropdown of mock users), Status (default: To Do)
3. "Save Task" button validates required fields and creates task in mock data
4. New task appears immediately in task list with proper sequencing
5. Form shows validation errors for missing required fields
6. "Cancel" button dismisses form without saving
7. Task is automatically assigned to parent case
8. Task gets auto-generated ID (e.g., "TK-2848")
9. Creation timestamp added to task metadata

**Prerequisites:** Story 2.1, 2.2

---

### Story 2.4: Create Subtasks with Infinite Nesting

As a Property Manager,
I want to create subtasks under any task or subtask,
So that I can break complex work into smaller, manageable pieces.

**Acceptance Criteria:**
1. Each task/subtask has an "+ Add Subtask" button displayed on hover or click
2. Clicking "+ Add Subtask" opens inline subtask creation form (same fields as task form)
3. Subtask form includes: Title (required), Description (optional), Assignee (dropdown), Status (default: To Do)
4. New subtask appears nested under parent with proper indentation
5. Subtasks can be added to any subtask level (infinite nesting supported)
6. Each subtask gets auto-generated ID following parent hierarchy (e.g., "TK-2848.1", "TK-2848.1.1")
7. Visual hierarchy updates immediately showing new nesting level
8. Parent task shows expand/collapse icon when first subtask is added

**Prerequisites:** Story 2.3

---

### Story 2.5: Status Management with Parent-Child Validation

As a Property Manager,
I want to change status of cases, tasks, and subtasks with validation rules,
So that work completion is properly tracked and validated.

**Acceptance Criteria:**
1. Status dropdown on case header allows selecting: To Do, In Progress, Done, Cancelled
2. Each task and subtask has status dropdown with same options
3. **Validation Rule 1:** Case cannot be marked "Done" if any child task is in "To Do" or "In Progress" status
4. **Validation Rule 2:** Task cannot be marked "Done" if any child subtask is in "To Do" or "In Progress" status
5. When validation fails, error message displays: "Cannot mark as Done. Complete all child items first."
6. "Cancelled" status bypasses validation rules (can cancel parent even if children are active)
7. Status changes update immediately with visual feedback (color coding)
8. Cancelled tasks/subtasks are visually distinguished (greyed out or strikethrough)

**Prerequisites:** Story 2.3, 2.4

---

### Story 2.6: Edit Case, Task, and Subtask Details

As a Property Manager,
I want to edit details of existing cases, tasks, and subtasks,
So that I can correct mistakes or update information as situations change.

**Acceptance Criteria:**
1. "Edit" button/icon displayed on case header, each task, and each subtask
2. Clicking "Edit" converts display into inline edit form with current values pre-filled
3. Editable fields: Title, Description, Assignee (status editing covered in Story 2.5)
4. "Save" button validates and updates mock data, shows success feedback
5. "Cancel" button reverts to display mode without saving changes
6. Updated timestamp added when changes are saved
7. Changes reflect immediately in UI (optimistic updates)
8. Validation prevents saving empty required fields

**Prerequisites:** Story 2.5

---

## Epic 3: Collaboration & Notifications

**Expanded Goal:**
Add essential collaboration features that enable team communication and documentation within cases. Implement the contextual sidebar that displays Property and Reservation information, giving Property Managers the full situational awareness they need. Complete the MVP with a basic notification system that displays mock notifications when users click the bell icon in the navbar. This epic transforms the Ticketing Hub from a tracking tool into a collaborative workspace.

---

### Story 3.1: Property and Reservation Context Sidebar

As a Property Manager,
I want to see Property and Reservation context information alongside case details,
So that I have complete situational awareness without switching tools.

**Acceptance Criteria:**
1. Right sidebar (35% width) displays on case detail page
2. **Property Context Panel** shows: Unit ID, Status (e.g., "Occupied"), Last Maintenance date
3. **Reservation Context Panel** shows: Reservation ID, Guest Name, Check-in date, Check-out date, Total Nights, Booking Value
4. Both panels display when case has both Property AND Reservation context
5. Only relevant panel displays if case has only Property OR only Reservation context
6. Context data pulled from mock data linked to case
7. Panels have clear section headers with icons (🏠 Property Context, 📅 Reservation Context)
8. Sidebar is fixed/sticky when scrolling main content
9. Clean visual design matching mockup layout

**Prerequisites:** Epic 2 complete (Stories 2.1-2.6)

---

### Story 3.2: Comment System for Case Collaboration

As a Property Manager or team member,
I want to add comments to cases,
So that I can communicate updates, questions, and resolution notes with my team.

**Acceptance Criteria:**
1. "Comments" section displays below Tasks section on case detail page
2. Comment input field with "Post Comment" button always visible at bottom of comments section
3. All existing comments display in chronological order (oldest to newest)
4. Each comment shows: User avatar/initials, User name, Timestamp (e.g., "Today at 9:30 AM"), Comment text
5. Comments support multi-line text and preserve line breaks
6. Posting a comment adds it to mock data and displays immediately
7. Comment input field clears after successful post
8. Empty state shown when no comments exist
9. Comments section shows comment count (e.g., "💬 Comments (3)")

**Prerequisites:** Story 3.1

---

### Story 3.3: File Attachments Display and Management

As a Property Manager,
I want to view and manage file attachments on cases,
So that I can access photos, receipts, and documents related to the issue.

**Acceptance Criteria:**
1. "Attachments" section displays between Description and Tasks on case detail page
2. All attachments display as list with file name, file type icon, and upload timestamp
3. Clicking an attachment file name opens/downloads the file (for mock: shows alert with filename)
4. "+ Upload File" button opens file picker (accepts images, PDFs, documents)
5. Selected files immediately appear in attachments list (stored in mock data structure)
6. Each attachment shows uploader name and timestamp
7. Remove/delete icon on each attachment allows deletion (with confirmation)
8. Empty state shown when no attachments exist
9. Attachments section shows count (e.g., "📎 Attachments (2)")

**Prerequisites:** Story 3.2

---

### Story 3.4: Notification Display and Mock Data

As a Property Manager,
I want to view notifications when I'm assigned to cases or tasks,
So that I'm aware of work that requires my attention.

**Acceptance Criteria:**
1. Bell icon in navbar displays notification badge with count of unread notifications
2. Clicking bell icon opens dropdown panel showing list of notifications
3. Mock notifications include: "You were assigned to Case TK-2847", "Task TK-2848 status changed to Done", "New comment on Case TK-2847"
4. Each notification shows: Icon/type indicator, Message text, Timestamp, Link to relevant case
5. Clicking a notification navigates to the linked case and closes dropdown
6. Dropdown shows "No new notifications" when notification list is empty
7. Mock notification data includes 3-5 sample notifications with various types
8. Notification dropdown closes when clicking outside of it
9. Badge count updates when notifications are viewed (mark as read not required for v0)

**Prerequisites:** Story 3.3

---

### Story 3.5: Guest Communication Context Link

As a Guest Communications team member,
I want to see a quick link to guest communication tools from case details,
So that I can easily reach out to guests about issue resolution.

**Acceptance Criteria:**
1. When case has Reservation context, "Guest Communication" section appears in sidebar below Reservation Context
2. Section displays "Conduit (SMS)" label with external link icon
3. "View" button links to placeholder URL (for mock: shows alert "Opening Conduit...")
4. Shows last message timestamp: "Last message: Today at 6:41 AM"
5. Section only displays when case has Reservation context (hidden for Property-only or Finance cases)
6. Clean visual integration with sidebar design

**Prerequisites:** Story 3.1, 3.4

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.

