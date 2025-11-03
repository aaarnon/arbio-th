# Ticketing Hub Product Requirements Document (PRD)

**Author:** Arnon
**Date:** November 2, 2025
**Project Level:** 2
**Target Scale:** Frontend MVP prototype with mock data (1-2 weeks, 5-15 stories)

---

## Goals and Background Context

### Goals

- **Centralize operational issue tracking** - Replace fragmented Slack threads with a single source of truth for all Property, Reservation, and Finance domain issues
- **Reduce Property Manager coordination time** - Decrease the ~25% time spent coordinating across tools by providing unified case management
- **Improve guest issue resolution speed** - Ensure critical issues (mold, WiFi, maintenance) are tracked and resolved faster through structured workflows
- **Validate core ticketing workflows** - Prove the 3-level hierarchy (Case → Task → Subtask) works for Arbio's operational needs before investing in backend infrastructure
- **Protect Guest Review Scores** - Prevent issues from being buried/lost, directly supporting Arbio's northstar metric

### Background Context

Arbio's Property Managers currently lose ~25% of their time navigating between Slack, Breezeway, Nexus, and Conduit to coordinate operational work. Critical guest issues like mold reports get buried in Slack threads, leading to delayed responses that directly threaten Arbio's northstar metric: Guest Review Scores on OTAs.

The Ticketing Hub MVP (v0) addresses this by creating a centralized frontend interface where Property Managers and Guest Communications teams can manually create, track, and manage issues across three domains (Property, Reservation, Finance) using a structured 3-level hierarchy (Case → Task → Subtask with infinite nesting). This functional prototype with hardcoded mock data will validate core workflows before Arbio invests in backend infrastructure, AI classification systems, and real-time integrations planned for future phases.

---

## Requirements

### Functional Requirements

**Case Management:**
- **FR001**: System shall allow users to manually create a new case by selecting domain type (Property, Reservation, or Finance), entering a description (required), and optionally attaching files
- **FR002**: System shall require either Property context OR Reservation context when creating a case (at least one must be selected)
- **FR003**: System shall display case details including title, description, domain category, status, assigned owner, tasks, subtasks, attachments, and comments
- **FR004**: System shall allow users to edit case details including description, status, and assignment
- **FR005**: System shall display a list view of all cases with filtering capabilities

**Task & Subtask Hierarchy:**
- **FR006**: System shall allow users to create tasks under a case with title, description, status, and assignment
- **FR007**: System shall allow users to create subtasks under any task or subtask, supporting infinite nesting levels
- **FR008**: System shall display the complete task/subtask hierarchy within the case detail view with visual indication of nesting levels
- **FR009**: System shall allow users to edit task and subtask details including status and assignment

**Status Management:**
- **FR010**: System shall support four status values for cases, tasks, and subtasks: To Do, In Progress, Done, and Cancelled
- **FR011**: System shall prevent a case from being marked as Done until all child tasks are marked as Done or Cancelled
- **FR012**: System shall prevent a task from being marked as Done until all child subtasks are marked as Done or Cancelled

**Assignment & Notifications:**
- **FR013**: System shall allow users to assign cases, tasks, and subtasks to individual team members
- **FR014**: System shall display notifications in the navbar when users are assigned to cases, tasks, or subtasks
- **FR015**: System shall display notification badges showing unread notification count

**Context & Collaboration:**
- **FR016**: System shall display Property context (unit ID, status, last maintenance date) and/or Reservation context (reservation ID, guest name, check-in/out dates, booking value) in sidebar panels on case detail view
- **FR017**: System shall allow users to add comments to cases with timestamp and user attribution
- **FR018**: System shall allow users to attach multiple files to cases and display them in the attachments section

### Non-Functional Requirements

- **NFR001**: System shall use hardcoded mock data (minimum 2 cases with complete task hierarchies) to simulate realistic workflows without backend dependencies
- **NFR002**: System shall be optimized for desktop browsers (1280px+ width) and does not need to support mobile responsiveness in v0
- **NFR003**: System shall provide a responsive UI that updates immediately when users change status, add comments, or modify case/task details (optimistic UI updates)

---

## User Journeys

### User Journey: Manual Case Creation and Resolution

**Primary Actor:** Guest Communications / Property Manager

**Trigger:** Guest reports an issue (e.g., WiFi not working)

**Journey Steps:**

1. **Case Creation (Guest Comm)**
   - User clicks "New Case" button in Ticketing Hub
   - Selects domain type: Property, Reservation, or Finance
   - Enters reservation ID/name OR property SKU/address
   - Adds description: "Guest reports WiFi not working in unit"
   - Optionally attaches photos/screenshots
   - System auto-populates Property/Reservation context from mock data
   - User assigns case to Property Manager team
   - User clicks "Create Case"

2. **Case Assignment Notification (Property Manager)**
   - PM receives notification badge in navbar
   - PM clicks notification and views case details
   - PM reviews description, property context, and reservation details

3. **Task Creation & Assignment (Property Manager)**
   - PM clicks "Add Task" within the case
   - Creates task: "Technician to investigate WiFi router"
   - Assigns task to Technician (simulated in mock data)
   - PM creates second task: "Resolution communication" (initially in "To Do")
   - Task status: "To Do" → "In Progress"

4. **Task Status Updates**
   - PM manually updates first task status to "Done" (simulating technician completion)
   - Second task "Resolution communication" moves from "To Do" to "In Progress"

5. **Resolution & Closure (Guest Comm)**
   - Guest Comm receives notification for "Resolution communication" task
   - Guest Comm views task, adds comment: "Notified guest via Conduit - issue resolved"
   - Guest Comm marks task as "Done"
   - System automatically allows case to be marked "Done" (all tasks complete)
   - Guest Comm marks case as "Done"

**Success Outcome:** Case tracked from creation to resolution in single interface, with clear task ownership and status visibility.

---

## UX Design Principles

1. **Information Density with Clarity** - Display comprehensive case details (tasks, context, attachments, comments) in a single view without overwhelming users
2. **Contextual Awareness** - Always show relevant Property/Reservation context alongside case details so PMs have full situational awareness
3. **Status Visibility** - Make current status and workflow progress immediately apparent through visual indicators and color coding
4. **Fast Task Decomposition** - Enable quick creation of tasks and subtasks directly within the case view without navigation overhead

---

## User Interface Design Goals

**Platform & Screens:**
- **Target Platform:** Desktop web application (1280px+ width)
- **Core Screens:**
  - Case list/dashboard view (with filters and search)
  - Case detail view (main workspace with 2-panel layout)
  - New case creation modal/form
  - Navbar with notifications

**Layout & Navigation:**
- **2-panel layout:** Main case details (left/center), Contextual sidebar (right) containing both Property and Reservation context panels
- **Hierarchical task display:** Visual indentation for nested subtasks with expandable/collapsible sections
- **Sticky navbar:** Persistent access to notifications and "New Case" action

**Design Constraints:**
- **Desktop-first:** No mobile responsive breakpoints required for v0
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)

---

## Epic List

**Epic 1: Project Foundation & Case List Management**
- Goal: Set up project infrastructure, establish mock data foundation, and implement case list view with creation capability
- Estimated stories: 4-5

**Epic 2: Case Details & Task Hierarchy Management**
- Goal: Build case detail view with 3-level hierarchy (Case → Task → Subtask with infinite nesting), enable CRUD operations on tasks/subtasks, and implement status management with validation rules
- Estimated stories: 5-6

**Epic 3: Collaboration & Notifications**
- Goal: Add collaboration features (comments, file attachments), implement contextual sidebar (Property/Reservation context), and add basic notification display (bell icon with mock data)
- Estimated stories: 4-5

**Total Estimated Stories:** 13-16

> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

**Deferred to Future Phases:**
- **AI Classification & Routing** - Automatic issue categorization and intelligent routing based on case content (planned for future phase)
- **Real-time Integrations** - Live connections to Slack, Breezeway, Nexus, and Conduit systems (v0 uses mock data only)
- **Backend Infrastructure** - Database, API layer, authentication system (v0 is frontend-only with hardcoded data)
- **Advanced Notification System** - Email/Slack notifications, push notifications, notification preferences (v0 has basic in-app notification display only)
- **Real-time Collaboration** - Live updates, presence indicators, concurrent editing (v0 has basic comment threads only)

**Platform & Technical Exclusions:**
- **Mobile Responsiveness** - Tablet and mobile layouts (desktop-only for v0)
- **User Authentication & Authorization** - Login, permissions, role-based access control
- **Advanced Search & Filtering** - Full-text search, saved filters, complex query building
- **Reporting & Analytics** - Dashboards, metrics, performance tracking
- **Bulk Operations** - Multi-select actions, batch updates

**Feature Exclusions:**
- **SLA Management** - Response time tracking, escalation rules, deadline management
- **Template System** - Pre-defined case templates, workflow automation
- **Custom Fields** - User-configurable metadata beyond core case/task fields
- **Audit Trail** - Comprehensive change history and activity logs (basic comments only)

