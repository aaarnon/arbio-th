# Ticketing Hub - UX Design Specification

**Author:** Arnon  
**Date:** November 2, 2025  
**Project:** Ticketing Hub (Level 2 MVP)  
**UX Designer:** Sally

---

## Project Context

**Vision:** Create a centralized frontend interface where Property Managers at Arbio can manually create, track, and manage operational issues across Property, Reservation, and Finance domains using a structured 3-level hierarchy (Case → Task → Subtask with infinite nesting). This MVP will validate core workflows before investing in backend infrastructure.

**Target Users:** Property Managers and Guest Communications teams who currently lose ~25% of their time navigating between Slack, Breezeway, Nexus, and Conduit.

**Platform:** Desktop web application (1280px+ width), optimized for modern browsers

**Business Goal:** Protect Arbio's northstar metric (Guest Review Scores) by preventing critical issues from being buried in Slack threads

---

## Core Experience and Platform

**Primary Experience:** Viewing/navigating case details with full context in one place

**Core Action:** Property Managers viewing comprehensive case information (tasks, property/reservation context, comments, attachments) in a single, unified interface to make quick, informed decisions without switching tools.

**Platform:** Desktop web application (1280px+ width)

**What Must Be Effortless:** Scanning case details, understanding status at a glance, seeing all relevant context (Property/Reservation data) alongside the work, navigating task hierarchies

---

## Desired Emotional Response

**Target Feeling:** Empowered and in control

**User Should Feel:**
- "I have all the information I need"
- "I know exactly what to do next"  
- "Nothing is hidden or buried"
- "I'm making confident decisions"

**Design Implication:** Like a mission control operator with complete situational awareness - confident, decisive, authoritative. Everything visible, clear actions, strong visual hierarchy.

---

## Inspiration Analysis

**Primary Inspirations:** Slack (communication) and Notion (knowledge management)

### What Users Love About Slack:
- **Notification System:** Clear badges, @mentions, channel-based notifications
- **Threaded Conversations:** Keeps discussions organized without cluttering main view
- **Sidebar Navigation:** Channels/DMs organized in persistent left sidebar
- **Real-time Updates:** Immediate feedback when things change
- **Quick Actions:** Easy to jump to specific conversations or search
- **Visual Hierarchy:** Unread items, mentions, and priorities clearly distinguished

### What Users Love About Notion:
- **Inline Editing:** Click to edit, no separate "edit mode"
- **Nested Hierarchy:** Pages within pages, expandable/collapsible sections
- **Clean, Minimal Interface:** Lots of white space, uncluttered
- **Flexible Content Blocks:** Mix text, tables, images, embeds
- **Collaborative:** Multiple people can update/improve content
- **Breadcrumb Navigation:** Always know where you are in hierarchy

### UX Patterns to Apply to Ticketing Hub:

1. **Notification System (from Slack)**
   - Bell icon with badge count in navbar
   - Clear notification types (assigned, status changed, commented)
   - Click notification → jump directly to case

2. **Sidebar Navigation (from Slack + your mockup)**
   - Persistent contextual sidebar (Property/Reservation info)
   - Always visible, provides situational awareness
   - Fixed position when scrolling

3. **Inline Editing (from Notion)**
   - Click to edit case/task details directly
   - No separate "edit page" - everything editable in place
   - Save/Cancel buttons appear contextually

4. **Hierarchical Display (from both)**
   - Expandable/collapsible task/subtask hierarchy
   - Visual indentation for nesting levels
   - Breadcrumb navigation (Ticketing Hub > Case ID)

5. **Comments Thread (from Slack)**
   - Chronological comments with user attribution
   - Timestamp format similar to Slack
   - Support for @mentions (future enhancement)

6. **Clean, Scannable Layout (from Notion)**
   - Generous white space
   - Clear section headers
   - Card-based or list-based organization
   - Status badges for quick scanning

---

## Design System Decision

**Chosen System:** shadcn/ui (with Radix UI primitives + Tailwind CSS)

**Rationale:**
- **Modern Aesthetics:** Clean, minimal design matching Notion-like interface goals
- **Full Customization:** Components live in codebase, fully customizable
- **Accessibility Built-in:** WCAG 2.1 AA compliant out of the box
- **Tech Stack Alignment:** Perfect for React + TypeScript + Tailwind
- **Development Speed:** Pre-built components accelerate MVP development
- **Flexibility:** Easy to adapt components to match any design direction

**What shadcn/ui Provides:**
- Buttons (primary, secondary, outline, ghost variants)
- Form components (input, textarea, select, checkbox, radio)
- Modals/Dialogs with focus management
- Dropdowns and menus
- Badges and status indicators
- Cards and containers
- Navigation components
- Toast notifications
- Tables and data display
- Accessible keyboard navigation throughout

**Custom Components Needed:**
- Infinite nested task/subtask hierarchy display
- Property/Reservation context sidebar panels
- Case status workflow indicators
- Comment thread display
- File attachment list with previews

---

## Visual Foundation

**Design Aesthetic:** Clean Minimalism (Linear/Notion Style)

**Layout Philosophy:**
- **Light gray background** `#f9fafb` - Main content area for visual separation
- **All white surfaces** - Cards, panels, sidebar, navbar are pure white
- **No heavy borders** - Use subtle shadows: `box-shadow: 0 1px 2px rgba(0,0,0,0.05)`
- **Elevation over borders** - Depth through shadow, not lines
- **Generous spacing** - Let content breathe

**Color Palette:**

**Primary Actions:**
- Primary button: `#000000` (Black) - Used for critical actions like "+ New Case"
- Primary button hover: `#1a1a1a` (Slightly lighter black)

**Secondary Actions:**
- Secondary button: White background, `#e5e7eb` border (subtle)
- Hover state: Border changes to `#111827` (black)
- Used for "Edit", "Cancel", "View"

**Semantic Colors (Softer than corporate):**
- Primary brand: `#1e40af` (Deep blue) - Links, active navigation
- Success/Done: `#059669` (Rich green)
- Info/In Progress: `#2563eb` (Vibrant blue)
- Warning: `#f59e0b` (Amber)
- Error: `#dc2626` (Red)

**Status Indicators (Minimal style with soft backgrounds):**
- Done: `#d1fae5` background, `#059669` text
- In Progress: `#dbeafe` background, `#1e40af` text  
- To Do: `#f3f4f6` background, `#6b7280` text

**Neutral Scale (Clean minimalist palette):**
- Page background: `#f9fafb` (Light gray) - Main content area
- Card/Surface: `#ffffff` (Pure white) - All cards, sidebar
- Border (subtle): `#e5e7eb` (Very light gray)
- Dividers: `#f3f4f6` (Ultra subtle)
- Text primary: `#111827` (Near black)
- Text secondary: `#374151` (Dark gray)
- Text tertiary: `#6b7280` (Medium gray)
- Text metadata: `#9ca3af` (Light gray)

**Typography System:**

**Font Families:**
- Headings: System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
- Body: Same as headings (consistent, fast loading)
- Monospace: 'Courier New', monospace (for IDs, codes)

**Type Scale (Clean, readable):**
- H1 (Page title): 24px / 1.3 / 600 weight
- H2 (Section header): 14px / 1.4 / 600 weight
- H3 (Subsection): 14px / 1.4 / 500 weight
- Body: 14px / 1.5 / 400 weight
- Secondary: 13px / 1.5 / 400 weight
- Metadata: 12px / 1.4 / 400 weight
- Labels (uppercase): 11px / 1.4 / 500-600 weight

**Spacing System:**
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- Used as: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl

**Layout Grid:**
- 12-column grid (shadcn/ui default)
- Container max-width: 1280px
- Gutter: 24px
- Main content area: 65% width
- Sidebar: 35% width

**Rationale:**
- **Light gray background with white cards** creates depth without heavy borders (Linear/Notion style)
- **Subtle shadows over borders** keeps the UI clean and modern
- **Black primary button** creates unmistakable authority - clear main action
- **Generous white space** reduces visual clutter and cognitive load
- **Softer status colors** less corporate, more approachable while maintaining professionalism
- Perfect for "empowered and in control" feeling without corporate heaviness

---

## Core Experience Principles

These principles guide every UX decision in Ticketing Hub:

**Speed: Instant and Decisive**
- No unnecessary loading states between clicks
- Optimistic UI updates (show changes immediately, sync in background)
- Fast scanning through strong visual hierarchy
- Keyboard shortcuts for power users
- Single-click actions wherever possible

**Guidance: Minimal but Contextual**
- Designed for experienced users (PMs use daily)
- Tooltips/help only where genuinely needed
- Clear labels and visual cues eliminate need for hand-holding
- Error prevention through smart defaults and validation
- Contextual help appears when relevant, stays hidden otherwise

**Flexibility: Structured with Room to Breathe**
- Fixed 3-level hierarchy (Case → Task → Subtask) provides structure
- Infinite nesting within subtasks provides flexibility
- Inline editing for quick updates without mode switching
- Multiple paths to accomplish tasks (keyboard, mouse, forms)
- Adaptable to different case types (Property, Reservation, Finance)

**Feedback: Clear and Immediate, Not Celebratory**
- Status changes show instant visual update
- Toast notifications for confirmations (dismissible)
- Error messages provide clear recovery path
- Professional, informative tone (not playful or gamified)
- Progress indicators only for truly async operations
- Subtle animations for state changes (not distracting)

**Principle in Action Example:**
When PM changes a task status from "To Do" to "In Progress":
- Status badge updates instantly (optimistic)
- Subtle color transition animation (professional feedback)
- No loading spinner, no modal, no celebration
- If sync fails, quiet error notification with retry option

---

## Design Direction Decision

**Chosen Direction: "Mission Control Dashboard"**

**Layout Pattern: Information-Rich Dashboard**
- 2-column layout: Main content (65% width) / Context sidebar (35% width)
- Left sidebar navigation (collapsed icon-only style from Arbio Nexus)
- Persistent contextual information on right (Property/Reservation panels)
- Content flows vertically with clear section separation
- Fixed navbar at top with search, notifications, New Case button

**Visual Hierarchy: Clean Minimalism**
- Multiple information sections visible without feeling cluttered
- Subtle section headers with minimal styling
- White content cards on light gray background
- No heavy borders - use subtle shadows (0 1px 3px rgba(0,0,0,0.1))
- Task list with clean hierarchy styling
- Status badges with softer colors
- Generous padding and white space throughout

**Interaction Pattern: Inline Everything**
- Status dropdowns directly on case/tasks/subtasks
- Inline task/subtask creation (click "+ Add Task" → form appears in place)
- Inline editing (click any field → editable, Save/Cancel buttons appear)
- Comment input always visible at bottom of comments section
- No separate edit pages or modals for editing - everything in context
- Add buttons appear on hover for clean default state

**Information Density: Clean Minimalism (Linear/Notion style)**
- Shows comprehensive information but stays highly scannable
- Generous section spacing (32px between major sections)
- Minimal borders - use elevation/shadows instead
- Light gray background (#f8fafc) with white content cards
- Subtle shadows for depth (no heavy borders)
- Ample white space for breathing room
- Clean, uncluttered aesthetic

**Key Design Elements:**
- ✅ Breadcrumb navigation: "Ticketing Hub > TK-2847"
- ✅ Case header: Title, domain badge, status dropdown, owner, date
- ✅ Fixed right sidebar: Property Context + Reservation Context stacked vertically
- ✅ Expandable/collapsible task hierarchy with visual indentation (20px per level)
- ✅ Inline comment input (Slack-style with user suggestions)
- ✅ File attachments in 3-column card grid with icons and metadata
- ✅ Task list shows: Task ID, title, status badge, assignee, subtask count (e.g., "1/3")

**Navigation Patterns:**
- Clicking case in list → navigates to case detail page
- Clicking task ID → scrolls to/highlights task in hierarchy
- Clicking notification → jumps to relevant case
- Breadcrumb → returns to case list
- Browser back button works as expected

**Why This Direction:**
- **Maximizes situational awareness** - PMs see everything at once
- **Minimizes clicks** - No separate pages for editing, no modals to open
- **Supports fast scanning** - Visual hierarchy guides eye naturally
- **Feels professional** - Like enterprise software (Linear, Jira, Notion)
- **Empowers control** - Nothing is hidden, full transparency
- **Inline everything** - Reduces cognitive load from context switching

---

## User Journey Flows

### Journey 1: Manual Case Creation and Resolution

**User Goal:** Create a case for a reported issue, break it into tasks, track to completion

**Entry Point:** Navbar "+ New Case" button (always visible, black button for authority)

---

**Step 1: Create Case**

**Screen:** Modal overlay (centered, 600px width)

**User sees:**
- Form title: "Create New Case"
- Domain selector (dropdown): Property | Reservation | Finance
- Property/Reservation selector (conditional based on domain)
- Description (textarea, required)
- Assignee (dropdown with user list)
- File attachment (optional, drag-and-drop or click to browse)

**User does:**
- Selects domain type
- Selects property OR reservation (validation ensures one is selected)
- Enters description
- Optionally assigns to team member
- Clicks black "Create Case" button

**System responds:**
- Validates required fields (inline error messages if missing)
- Creates case with status "To Do"
- Closes modal
- Navigates to case detail page
- Shows success toast: "Case TK-#### created"

**Error State:**
- Missing description → Red border on textarea, "Description is required" below field
- No property/reservation selected → "Select at least one: Property or Reservation"

---

**Step 2: View Case Details and Add Context**

**Screen:** Case detail page (Mission Control Dashboard layout)

**User sees:**
- Case header: Title, domain badge (blue pill), status dropdown, assignee, date
- Breadcrumb: "Ticketing Hub > TK-####"
- Main content: Description section (editable on click)
- Empty Tasks section with "+ Add Task" button
- Right sidebar: Property/Reservation context panels populated from mock data
- Empty Attachments section
- Comments section with input field

**User does:**
- Reviews case details
- Checks property/reservation context in sidebar for situational awareness
- Decides to break into tasks

---

**Step 3: Create Tasks and Subtasks**

**User does:** Clicks "+ Add Task" in Tasks section

**System responds:**
- Inline form appears below button
- Form fields: Title (required), Description (optional), Assignee, Status (default: To Do)
- Focus automatically on Title field

**User does:**
- Types task title: "Technician to investigate WiFi router"
- Selects assignee: "John (Technician)"
- Clicks "Save Task"

**System responds:**
- Task appears immediately in list
- Shows: TK-####.1, title, status badge (gray "TO DO"), assignee avatar
- Form collapses
- "+ Add Task" button reappears

**User does:**
- Creates second task: "Resolution communication"
- Assigns to Guest Comm team

**For subtasks:**
- Hover over task → "+ Add Subtask" button appears on right
- Click → Inline form appears indented 20px below task
- Same flow as task creation
- Subtask gets ID: TK-####.1.1

**Visual Feedback:**
- Indentation shows hierarchy (20px per level)
- Expandable/collapsible arrows for tasks with subtasks
- Subtask count badge on parent: "(1/3)" if 1 of 3 done

---

**Step 4: Update Status and Track Progress**

**User does:** Clicks status dropdown on first task

**System responds:**
- Dropdown opens with options: To Do, In Progress, Done, Cancelled
- Current status highlighted

**User does:** Selects "In Progress"

**System responds:**
- Badge updates instantly to blue "IN PROGRESS"
- No loading spinner
- Subtle color transition animation (200ms)
- Toast notification: "Task TK-####.1 moved to In Progress"

**Validation Rule:**
- If user tries to mark task "Done" but subtasks are not done
- Error message appears: "Cannot mark as Done. Complete all subtasks first."
- Status dropdown closes without change
- Subtasks with "To Do" or "In Progress" highlighted briefly in yellow

---

**Step 5: Collaborate via Comments**

**User does:** Scrolls to Comments section

**User sees:**
- Existing comments (if any) with user avatar, name, timestamp
- Comment input field always visible: "Add a comment..."
- "Post Comment" button (black)

**User does:**
- Types comment: "Contacted technician, waiting for update"
- Clicks "Post Comment"

**System responds:**
- Comment appears immediately at bottom of thread
- Includes user avatar, name, "Just now" timestamp
- Input field clears
- Auto-scroll to show new comment

---

**Step 6: Mark Complete**

**User does:**
- Updates all subtasks to "Done"
- Updates task to "Done"
- Clicks case status dropdown
- Selects "Done"

**System responds:**
- All items show green "DONE" badges
- Case moves to "Done" state
- Success toast: "Case TK-#### completed"
- Optional: Confetti animation (subtle, professional)

**Alternative - Blocked Completion:**
- If tasks still pending → Error: "Cannot mark case as Done. Complete all tasks first."
- Pending tasks highlighted briefly

---

### Journey 2: Quick Case List Scan and Filter

**User Goal:** Find specific cases quickly

**Entry Point:** Home/Dashboard (case list page)

**User sees:**
- List/table of all cases
- Each row: Case ID, title preview, domain badge, status badge, assignee, date
- Filter controls at top: Status dropdown, Domain dropdown
- Search bar in navbar

**User does:**
- Selects status filter: "In Progress"
- Selects domain filter: "Property"

**System responds:**
- List updates instantly (no loading)
- Filtered results show immediately
- Count displayed: "Showing 12 cases"

**User does:** Clicks on case row

**System responds:**
- Navigates to case detail page
- Smooth transition (no flash)

---

### Journey 3: Notification → Jump to Case

**User Goal:** Respond to assignment notification

**Entry Point:** Bell icon in navbar (shows badge count: "3")

**User does:** Clicks bell icon

**System responds:**
- Dropdown appears below icon (300px width)
- Lists notifications with icon, message, timestamp
- Example: "You were assigned to Case TK-2847" (with link)

**User does:** Clicks notification

**System responds:**
- Dropdown closes
- Navigates to case detail page
- Auto-scrolls to relevant section if needed
- Notification marked as read (badge count decreases)

---

## Component Library Strategy

**Foundation:** shadcn/ui provides most standard components

**Standard Components (from shadcn/ui):**
- Button (primary/secondary/ghost variants) - Customized with black primary
- Input, Textarea, Select
- Dropdown menus
- Modal/Dialog
- Toast notifications
- Badge
- Card
- Avatar

**Custom Components Needed:**

### 1. HierarchicalTaskList
**Purpose:** Display infinite nested task/subtask hierarchy with expand/collapse

**Anatomy:**
- Task row container (32px height)
- Indentation indicator (20px per level, visual line connecting to parent)
- Expand/collapse arrow (if has subtasks)
- Task ID (clickable link)
- Title (editable on click)
- Status badge dropdown
- Assignee avatar
- Subtask count badge "(2/5)"
- "+ Add Subtask" button (appears on hover)

**States:**
- Default: Collapsed if has subtasks
- Expanded: Shows all child subtasks
- Hover: Shows "+ Add Subtask" button
- Editing: Inline form replaces display
- Loading: Subtle spinner only if async operation

**Interaction:**
- Click arrow → expand/collapse children
- Click title → inline edit mode
- Click status badge → dropdown menu
- Click "+ Add Subtask" → inline creation form appears below
- Drag handles (future enhancement)

**Accessibility:**
- ARIA tree role
- Keyboard navigation (arrow keys to expand/collapse, tab to navigate)
- Screen reader announces hierarchy level and subtask count

---

### 2. ContextSidebarPanel
**Purpose:** Display Property or Reservation context information

**Anatomy:**
- Panel header with icon (🏠 Property / 📅 Reservation)
- Title: "Property Context" or "Reservation Context"
- Key-value pairs (label + value grid)
- Collapsible sections (future enhancement)

**Variants:**
- Property: Unit ID, Status, Last Maintenance
- Reservation: Reservation ID, Guest Name, Check-in/out dates, Total Nights, Booking Value
- Guest Communication: Conduit link, last message timestamp

**States:**
- Default: Visible with data
- Empty: Message if no context available
- Loading: Skeleton placeholders

**Visual:**
- White background
- Light border (#cbd5e1)
- 16px padding
- 12px gap between items
- Labels: 11px gray text
- Values: 14px black text

---

### 3. DomainBadge
**Purpose:** Visual indicator of case domain type

**Variants:**
- Property: Blue background, "Property" text
- Reservation: Purple background, "Reservation" text
- Finance: Green background, "Finance" text

**Anatomy:**
- Pill shape (fully rounded corners)
- 6px vertical padding, 12px horizontal padding
- 12px font size, 500 weight
- Icon optional (🏠 📅 💰)

**States:**
- Default: Full color
- Disabled: Grayed out

---

### 4. StatusBadge
**Purpose:** Display and change case/task status

**Variants:**
- To Do: Gray background (#64748b), white text
- In Progress: Blue background (#2563eb), white text
- Done: Green background (#059669), white text
- Cancelled: Light gray background, gray text, strikethrough

**Anatomy:**
- Badge pill (rounded corners)
- Text in uppercase
- Dropdown indicator (small down arrow)
- 6px vertical padding, 10px horizontal

**States:**
- Default: Shows current status
- Hover: Slight darkening, cursor pointer
- Open: Dropdown menu with status options
- Disabled: No dropdown, lighter opacity

**Interaction:**
- Click → dropdown menu appears with all status options
- Select status → badge updates instantly
- Validation error → error message below

---

### 5. CommentThread
**Purpose:** Display chronological comments with user attribution

**Anatomy:**
- Comment list (scrollable if > 5 comments)
- Each comment:
  - User avatar (32px circle)
  - User name (14px bold)
  - Timestamp (12px gray, "Today at 9:30 AM")
  - Comment text (14px, supports line breaks)
- Comment input field (always at bottom)
- "Post Comment" button (black primary)

**States:**
- Empty: "No comments yet. Start the conversation."
- Loading new comment: Optimistic UI (shows immediately)
- Error: Toast notification if post fails

**Visual:**
- 16px spacing between comments
- Light divider line between comments
- User avatar aligned to left
- Text wraps naturally

---

### 6. FileAttachmentGrid
**Purpose:** Display and manage file attachments

**Anatomy:**
- 3-column grid (desktop)
- Each card:
  - File type icon (document, image, pdf)
  - Filename (truncated if long)
  - File size
  - Upload timestamp
  - Uploader name
  - Remove button (X icon, appears on hover)

**States:**
- Default: Shows all attachments
- Hover: Remove button appears, slight elevation
- Uploading: Progress indicator
- Empty: "+ Upload File" button centered

**Interaction:**
- Click card → opens/downloads file
- Click remove (X) → confirmation dialog → removes
- Drag and drop files → uploads
- Click "+ Upload File" → file picker dialog

---

## UX Pattern Decisions

**Button Hierarchy:**
- **Primary action:** Black background (#000), white text, 600 weight
  - Used for: "+ New Case", "Create Case", "Save Task", "Post Comment"
- **Secondary action:** White background, black border (2px), black text, 500 weight
  - Used for: "Edit Case", "Cancel", "View Details"
- **Ghost/Tertiary:** Transparent background, gray text
  - Used for: "Cancel" in forms, less important actions
- **Destructive:** Red text on white background
  - Used for: "Delete", "Remove" (with confirmation)

**Feedback Patterns:**
- **Success:** Green toast notification, bottom-right, auto-dismiss 3s
- **Error:** Red toast notification, bottom-right, manual dismiss, with action button
- **Warning:** Yellow toast notification, bottom-right, auto-dismiss 5s
- **Info:** Blue toast notification, bottom-right, auto-dismiss 3s
- **Loading:** Inline spinner (16px) only for async operations > 300ms

**Form Patterns:**
- **Label position:** Above input (8px gap)
- **Required indicator:** Red asterisk (*) after label
- **Validation timing:** onBlur for individual fields, onSubmit for form
- **Error display:** Red border on input + error message below (12px red text)
- **Help text:** Gray text below input (11px)
- **Placeholder text:** Light gray, provides example format

**Modal Patterns:**
- **Sizes:** Small (400px), Medium (600px), Large (800px)
- **Dismiss:** Click outside, ESC key, X button top-right
- **Focus:** Auto-focus first input field
- **Overlay:** Dark semi-transparent (#000 40% opacity)

**Empty State Patterns:**
- **First use:** "No [items] yet." + Helpful message + Primary action button
- **No results:** "No [items] found." + Suggestion to adjust filters
- **Cleared content:** Show last action with undo option

**Status Transition Rules:**
- Instant UI update (optimistic)
- Validation check before allowing Done status
- Toast confirmation for status changes
- Error toast with retry if sync fails

---

## Responsive & Accessibility Strategy

**Target Devices:** Desktop only for v0 (1280px+ width)

**Responsive Strategy:**
- **Desktop (1280px+):** Full 2-column layout (65% main / 35% sidebar)
- **Large Desktop (1440px+):** Same layout, max-width 1280px centered
- **Below 1280px:** Not optimized for v0 (show message: "Please use desktop browser")

**Future Responsive Breakpoints (post-v0):**
- **Tablet (768-1279px):** Collapsible sidebar, single column when sidebar open
- **Mobile (< 768px):** Full single column, bottom navigation, hamburger menu

---

**Accessibility Strategy:**

**Compliance Target:** WCAG 2.1 Level AA

**Key Requirements:**

**Color Contrast:**
- Text on white background: 4.5:1 minimum ratio
- All text meets contrast requirements with chosen color palette
- Status badges: White text on colored backgrounds meets 4.5:1
- Black buttons: White text provides maximum contrast (21:1)

**Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Skip to main content link
- Arrow keys for dropdown menus and hierarchical lists
- Enter/Space to activate buttons
- ESC to close modals/dropdowns
- Focus indicators visible on all elements (2px blue outline)

**Focus Management:**
- Logical tab order follows visual layout
- Modal traps focus until dismissed
- Focus returns to trigger element after modal closes
- No keyboard traps

**ARIA Labels:**
- Proper semantic HTML (nav, main, aside, article, section)
- ARIA labels for icon-only buttons (e.g., notification bell)
- ARIA tree role for hierarchical task list
- ARIA live regions for toast notifications
- Status announcements for screen readers

**Form Accessibility:**
- Label elements properly associated with inputs
- Error messages announced to screen readers
- Required fields indicated visually and in ARIA
- Fieldset/legend for related form groups

**Screen Reader Support:**
- Meaningful alt text for images/icons
- Skip navigation links
- Heading hierarchy (H1 → H2 → H3) properly structured
- Lists use proper list markup
- Table headers for data tables

**Touch Target Size (future mobile):**
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets (8px minimum)

**Testing Strategy:**
- **Automated:** Lighthouse accessibility audit (95+ score target)
- **Automated:** axe DevTools during development
- **Manual:** Keyboard-only navigation testing
- **Manual:** Screen reader testing with NVDA (Windows) or VoiceOver (Mac)
- **Manual:** Color blindness simulation (browser dev tools)

**Implementation Notes:**
- shadcn/ui components are WCAG AA compliant by default
- Custom components must maintain same accessibility standards
- Regular accessibility audits during development
- Developer training on ARIA best practices

---

## Completion Summary

**✅ UX Design Specification Complete!**

**What We've Created Together:**

1. **Design System:** shadcn/ui with custom black primary actions
2. **Visual Foundation:** Bold Command theme with black primary buttons, deep blues, and professional authority
3. **Design Direction:** "Mission Control Dashboard" - information-rich, inline editing, maximum situational awareness
4. **User Journeys:** 3 complete flows designed with specific UX decisions at every step
5. **Component Library:** 6 custom components specified beyond shadcn/ui base
6. **UX Patterns:** Complete consistency rules for buttons, feedback, forms, modals, status transitions
7. **Accessibility:** WCAG 2.1 Level AA compliance strategy with testing plan

**Core Deliverables:**

- ✅ UX Design Specification: `/Users/arnon/Desktop/ticketing-hub/docs/ux-design-specification.md`
- ✅ Color Theme Visualizer: `/Users/arnon/Desktop/ticketing-hub/docs/ux-color-themes.html`

**Design Decisions Summary:**

**Theme:** Bold Command (Modified)
- Black primary actions (#000) for unmistakable authority
- Deep blue (#1e40af) brand color for trust and professionalism
- Status colors: Green (Done), Blue (In Progress), Gray (To Do)

**Layout:** Mission Control Dashboard
- 2-column: 65% main content / 35% context sidebar
- Inline editing everywhere
- No separate edit pages or unnecessary modals
- Information-dense but scannable

**Interaction Philosophy:**
- **Speed:** Instant, optimistic UI updates
- **Guidance:** Minimal, contextual only
- **Flexibility:** Structured hierarchy with infinite nesting
- **Feedback:** Clear, immediate, professional (not celebratory)

**What Developers Need:**
- Complete color palette with hex codes
- Typography system and spacing scale
- Component specifications with states and interactions
- User journey flows with detailed screen-by-screen guidance
- UX pattern rules for consistent implementation
- Accessibility requirements and testing strategy

**What Happens Next:**

For v0 MVP implementation:
1. Set up React + TypeScript + Tailwind + shadcn/ui
2. Implement color theme variables
3. Build custom components (HierarchicalTaskList, ContextSidebarPanel, etc.)
4. Follow user journey flows for feature implementation
5. Apply UX patterns consistently across all screens
6. Run accessibility audits throughout development

**Success Criteria:**
- Property Managers feel "empowered and in control"
- Case details visible at-a-glance without scrolling
- Status changes feel instant
- No confusion about next actions
- Keyboard navigation works flawlessly
- WCAG 2.1 AA compliance achieved

---

**🎨 Ready for implementation!** All design decisions documented with rationale. Developers have everything needed to build a professional, accessible, authority-driven Ticketing Hub that makes Property Managers feel in control.

