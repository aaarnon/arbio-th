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

**Design Aesthetic:** Minimalist Neutrality (Notes/Linear Style)

**Layout Philosophy:**
- **Ultra-light grey background** `#fafafa` - Main content area for subtle separation
- **Pure white surfaces** - Cards, panels, sidebar, navbar
- **Whisper-thin borders** - `1px solid #e5e5e5` - barely visible separation
- **Flat elevation** - Minimal shadows, rely on subtle borders for definition
- **Maximum spacing** - Let content breathe with generous white space

**Color Palette:**

**Primary Actions:**
- Primary button: `#171717` (Near black) - Subtle, not stark
- Primary button hover: `#262626` (Lighter charcoal)
- Text style: Medium weight (500), not bold

**Secondary Actions:**
- Secondary button: White background, `#e5e5e5` border (whisper-thin)
- Hover state: Background `#fafafa`, border stays same
- Text: `#525252` (Medium grey)

**Minimal Color Accents:**
- Interactive elements: `#737373` (Medium grey) - Links, active states
- Subtle highlight: `#a3a3a3` (Light grey) - Very subtle when needed
- Success indicator: `#525252` text on `#f5f5f5` background
- Error (when necessary): `#737373` text with subtle red tint `#fecaca` background

**Status Indicators (Extremely minimal):**
- Done: `#fafafa` background, `#525252` text, subtle checkmark icon
- In Progress: `#f5f5f5` background, `#737373` text
- To Do: `#ffffff` background, `#a3a3a3` text, `#e5e5e5` border

**Neutral Scale (Minimalist grey palette):**
- Page background: `#fafafa` (Ultra light grey)
- Card/Surface: `#ffffff` (Pure white)
- Border/Divider: `#e5e5e5` (Whisper grey)
- Subtle hover: `#f5f5f5` (Barely visible)
- Text primary: `#171717` (Near black)
- Text secondary: `#525252` (Medium grey)
- Text tertiary: `#737373` (Light grey)
- Text metadata: `#a3a3a3` (Very light grey)
- Disabled: `#d4d4d4` (Pale grey)

**Typography System:**

**Font Families:**
- All text: System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
- Monospace: SF Mono, Monaco, 'Courier New', monospace (for IDs)

**Type Scale (Clean, lightweight):**
- H1 (Page title): 20px / 1.4 / 500 weight (not bold!)
- H2 (Section header): 13px / 1.4 / 500 weight / Title case (first letter uppercase, rest lowercase) / `#171717` color (black)
- H3 (Subsection): 14px / 1.4 / 500 weight
- Body: 14px / 1.6 / 400 weight
- Secondary: 13px / 1.5 / 400 weight
- Metadata: 12px / 1.4 / 400 weight / `#a3a3a3` color
- Labels: 11px / 1.4 / 500 weight / Title case / `#a3a3a3` color

**Spacing System (Linear-inspired):**
- Base unit: 4px
- Component internal padding: 16px (buttons, badges, inputs)
- Between related items: 12px (e.g., form fields)
- Between sections: 32px (major content sections)
- Between major blocks: 48px (page sections)
- Page margins: 32-48px (content to edge)
- Scale reference: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
- **Key principle:** Use space as the primary separator, not lines

**Layout Grid (Linear-style):**
- Three-column layout: Left nav (240px fixed) | Main content (flexible, max 900px) | Right sidebar (320px fixed)
- Container max-width: 1600px (allows larger screens)
- Content area padding: 48px horizontal, 32px vertical
- Section spacing: 48px between major sections
- Card/panel spacing: 24px between cards
- List item spacing: 12px between items, 32px between groups

**Rationale:**
- **Extreme minimalism** reduces cognitive load to absolute minimum
- **Grey-first palette** eliminates color distraction
- **Whisper-thin borders** define space without visual weight
- **Lighter type weights** feel modern and unobtrusive
- **Title case section labels** (first letter uppercase) provide hierarchy without visual shouting
- **Generous spacing** creates calm, focused environment
- Perfect for "quietly confident" control without visual noise

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

**Chosen Direction: "Linear-Inspired Minimalist Workspace"**

**Layout Pattern: Three-Column Clarity**
- **Left Navigation (240px fixed):** Icon + label navigation items, clean hover states, subtle background on active
- **Main Content (flexible, max 900px):** Primary work area with generous 48px padding, content never wider than 900px for readability
- **Right Sidebar (320px fixed):** Contextual properties and metadata, organized in stacked sections with clear labels
- **Spacing philosophy:** Use 48px between major page sections, 32px between section content, 24px between cards

**Visual Hierarchy: Space-First Design**
- **Section headers:** 11px Title case (first letter uppercase, rest lowercase), `#171717` (black), letter-spacing 0.05em, 32px bottom margin
- **Content blocks:** White background, 1px `#e5e5e5` border, 8px border-radius, 24px internal padding
- **No drop shadows:** Completely flat, borders define all boundaries
- **List items:** 12px spacing, 40px height minimum, hover state `#fafafa`
- **Metadata:** Always 12px grey text, positioned consistently
- **Generous white space:** 48px+ margins around major sections

**Interaction Pattern: Ghost-First Buttons**
- **Most actions are ghost buttons** - transparent with grey text
- **ONE black button per page** - the primary action (+ New Case)
- **Status changes:** Inline, minimal animation (200ms fade)
- **Hover states:** Subtle background `#f5f5f5`, no heavy effects
- **Focus states:** 2px `#e5e5e5` outline, not blue
- **No tooltips:** Labels should be clear enough without them

**Information Density: Spacious & Scannable (Linear style)**
- **Vertical rhythm:** Consistent 48px spacing between sections creates calm flow
- **Horizontal padding:** 48px content area padding, never cramped
- **List spacing:** 12px between items, 32px between groups
- **Typography spacing:** 16px between paragraphs, 8px between label/value pairs
- **Card spacing:** 24px between stacked cards
- **Breathing room priority:** When in doubt, add more space

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

### 1. HierarchicalTaskList (Linear-style)
**Purpose:** Display infinite nested task/subtask hierarchy with expand/collapse

**Layout & Spacing:**
- **Task row height:** 40px minimum (comfortable click target)
- **Row spacing:** 4px between tasks (tight grouping)
- **Group spacing:** 24px between task groups (clear separation)
- **Horizontal padding:** 16px left/right within each row
- **Indentation:** 24px per nesting level (clear hierarchy)
- **Border:** 1px `#e5e5e5` bottom border on each row

**Anatomy:**
- Expand/collapse icon (16px, `#a3a3a3`, 8px left margin)
- Task ID (12px mono font, `#a3a3a3`, 12px left margin)
- Title (14px, `#171717`, flex-grow, editable on click)
- Status badge (inline, 8px right margin)
- Assignee avatar (24px circle, 8px right margin)
- Subtask indicator "(2/5)" (12px, `#a3a3a3`)
- "+ Add Subtask" button (ghost, appears on hover, right-aligned)

**States:**
- Default: Clean, minimal border-bottom only
- Hover: Background `#fafafa`, show "+ Add Subtask"
- Active/Selected: Background `#f5f5f5`, no border change
- Editing: Inline form with 24px padding, white background
- Empty: Show "+ Add Task" centered with 80px vertical padding

**Visual Hierarchy:**
- Level 0: No indentation, 14px font
- Level 1: 24px indent, subtle grey line connects to parent
- Level 2+: Additional 24px per level, max indent 120px

**Interaction:**
- Click anywhere on row (except icons) → navigate to task detail
- Click expand icon → toggle children (200ms smooth animation)
- Click status → minimal dropdown (8px border-radius, 1px border)
- Hover → show ghost "+ Add Subtask" button (no background until hover)
- Click "+ Add Subtask" → inline form slides in below (300ms)

**Accessibility:**
- ARIA tree role, proper hierarchy levels
- Keyboard: Enter (open), Space (select), Arrows (navigate/expand)
- Focus indicator: 2px `#e5e5e5` outline, not blue

---

### 2. ContextSidebarPanel (Linear-style)
**Purpose:** Display Property or Reservation context information

**Layout & Spacing:**
- **Panel spacing:** 24px between stacked panels
- **Internal padding:** 24px all sides
- **Section header:** 11px Title case, `#171717` (black), 16px bottom margin
- **Row spacing:** 16px between key-value pairs
- **Border:** 1px `#e5e5e5` all sides
- **Border radius:** 8px
- **Background:** White `#ffffff`

**Anatomy:**
- Section header: "Property context" (11px, Title case, `#171717`, tracking 0.05em)
- Key-value rows stacked vertically
- Each row: Label above value (not side-by-side)
- Label: 11px `#a3a3a3`, 4px bottom margin
- Value: 14px `#171717`, line-height 1.5

**Variants:**
- Property: Unit ID, Status, Last Maintenance, Address
- Reservation: Reservation ID, Guest Name, Check-in/out, Total Nights, Booking Value
- Guest Communication: Last message, Conduit link

**States:**
- Default: Clean, minimal styling
- Empty: Grey text "No property attached" centered, 40px vertical padding
- Loading: Skeleton lines (16px height, `#f5f5f5`, 8px border-radius)
- Interactive links: `#737373` hover `#525252`

**Visual Details:**
- No icons in labels (keep it minimal)
- Links underlined only on hover
- Copyable fields show copy icon on hover (16px, right-aligned)
- Dividers between major groups: 1px `#e5e5e5`, 24px vertical margin

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
- To Do: `#ffffff` background, `#a3a3a3` text, `#e5e5e5` border, 400 weight
- In Progress: `#f5f5f5` background, `#737373` text, no border, 400 weight
- Done: `#fafafa` background, `#525252` text, subtle checkmark icon, 400 weight
- Cancelled: `#ffffff` background, `#d4d4d4` text, strikethrough, 400 weight

**Anatomy:**
- Pill shape (4px rounded corners - subtle, not fully rounded)
- Text in normal case (not uppercase)
- 4px vertical padding, 10px horizontal
- 12px font size, 400 weight
- Optional small icon (8px)

**States:**
- Default: Minimal, barely visible
- Hover: Slight background darken (`#f5f5f5` → `#ebebeb`)
- No dropdown arrows - click entire badge
- Disabled: Lower opacity (60%)

**Interaction:**
- Click → minimal dropdown menu appears
- Select status → smooth fade transition (300ms)
- No validation toasts unless error

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
- **Primary action (Black - The Different One):** `#171717` background, white text, 500 weight
  - Used ONLY for: "+ New Case" (main action) - makes it unmistakable
  - Padding: 10px 16px (generous internal space)
  - Border radius: 6px
  - Hover: `#262626` background
  - This is the ONLY button that stands out visually
  
- **Secondary action:** White background, `#e5e5e5` border (1px), `#525252` text, 400 weight
  - Used for: "Save", "Create", "Update" - important but not primary
  - Padding: 10px 16px
  - Border radius: 6px
  - Hover: `#fafafa` background
  
- **Ghost/Tertiary (Most common):** Transparent background, `#737373` text, 400 weight
  - Used for: "Edit", "Cancel", "View", most actions
  - Padding: 10px 12px (slightly less)
  - Border radius: 6px
  - Hover: `#f5f5f5` background
  
- **Destructive:** `#737373` text, no background
  - Used for: "Delete", "Remove" (with confirmation)
  - Padding: 10px 12px
  - Hover: `#525252` text on `#fef2f2` (very subtle red tint)

**Feedback Patterns:**
- **Success:** Minimal grey toast, `#fafafa` background, `#525252` text, bottom-right, auto-dismiss 3s
- **Error:** Subtle toast, `#fecaca` background, `#737373` text, bottom-right, manual dismiss
- **Warning:** Grey toast, `#f5f5f5` background, `#525252` text, bottom-right, auto-dismiss 5s
- **Info:** Minimal toast, `#f5f5f5` background, `#737373` text, bottom-right, auto-dismiss 3s
- **Loading:** Inline spinner (16px, `#a3a3a3` color) only for async operations > 300ms

**Form Patterns (Linear-style):**
- **Field spacing:** 24px between form fields
- **Label position:** Above input, 8px gap
- **Label style:** 12px, `#525252`, 500 weight
- **Input height:** 40px minimum
- **Input padding:** 12px horizontal
- **Input border:** 1px `#e5e5e5`, focus: 1px `#171717` (not blue!)
- **Input border-radius:** 6px
- **Required indicator:** Subtle `#a3a3a3` asterisk after label
- **Validation timing:** onBlur for individual fields
- **Error display:** Input border `#ef4444`, error text 12px `#737373` below (not red!)
- **Help text:** 12px `#a3a3a3` below input, 4px spacing
- **Placeholder text:** `#d4d4d4`, subtle example

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

1. **Design System:** shadcn/ui with Linear-inspired minimalist customization
2. **Visual Foundation:** Minimalist grey palette with generous spacing and flat design
3. **Design Direction:** "Linear-Inspired Minimalist Workspace" - spacious, scannable, ghost-first interactions
4. **User Journeys:** 3 complete flows designed with specific UX decisions at every step
5. **Component Library:** 6 custom components with detailed spacing specifications
6. **UX Patterns:** Complete consistency rules for buttons, feedback, forms, spacing, and interactions
7. **Accessibility:** WCAG 2.1 Level AA compliance strategy with testing plan

**Core Deliverables:**

- ✅ UX Design Specification: `docs/ux-design-specification.md`
- ✅ Minimalist Theme Visualizer: `docs/ux-files/ux-minimalist-theme.html`
- ✅ Implementation Summary: `docs/design-update-summary.md`

**Design Decisions Summary:**

**Theme:** Linear-Inspired Minimalist
- **Grey-only palette** - No vibrant colors, pure neutral hierarchy
- **ONE black button** (`#171717`) - Primary action stands out unmistakably
- **Whisper-thin borders** (`#e5e5e5`) - 1px flat design, no shadows
- **Light typography** - 400-500 weights, Title case section headers (black)
- **Status indicators** - Subtle grey variations, normal case text

**Layout:** Three-Column Clarity
- **Left nav:** 240px fixed with icon + label items
- **Main content:** Flexible, max 900px for readability
- **Right sidebar:** 320px fixed for contextual properties
- **Spacing philosophy:** 48px between sections, 24px between cards, 12px between items

**Spacing System (Linear-inspired):**
- **Between major sections:** 48px (generous breathing room)
- **Between content blocks:** 32px (clear separation)
- **Between cards:** 24px (grouped but distinct)
- **Between form fields:** 24px (visual rhythm)
- **Between list items:** 12px (tight grouping)
- **Component padding:** 24px internal, 48px horizontal for content areas
- **Key principle:** Use space as the primary separator, not lines

**Interaction Philosophy:**
- **Ghost-first:** Most buttons are transparent with grey text
- **Minimal hover:** Subtle `#f5f5f5` background on interaction
- **Flat design:** No drop shadows, only 1px borders
- **Speed:** Instant, optimistic UI updates with 150-200ms transitions
- **Feedback:** Minimal grey toasts, professional tone

**What Developers Need:**
- Complete neutral color scale (50-900 grey palette)
- Tailwind config with spacing utilities and custom classes
- Base CSS with `.section-spacing`, `.content-spacing`, `.card-spacing` utilities
- Component specifications with precise measurements and spacing
- User journey flows with detailed screen-by-screen guidance
- Accessibility requirements and testing strategy

**Implementation Quick Start:**

```tsx
// Button hierarchy
<button className="btn-primary">+ New Case</button>      // Black, ONE per page
<button className="btn-secondary">Save</button>          // White with border
<button className="btn-ghost">Edit</button>              // Transparent, most common

// Layout with spacing
<section className="section-spacing">                    // 48px bottom margin
  <h2 className="section-header">Case details</h2>      // Title case, black
  <div className="card card-spacing">...</div>            // 24px bottom margin
</section>
```

**Success Criteria:**
- Property Managers feel "quietly confident" control without visual noise
- Generous spacing creates calm, focused environment
- ONE black button makes primary action unmistakable
- Grey hierarchy provides clarity without color distraction
- 40px touch targets ensure comfortable interaction
- Status changes feel instant with minimal feedback
- Keyboard navigation works flawlessly
- WCAG 2.1 AA compliance achieved

---

**🎨 Ready for implementation!** All design decisions documented with Linear-inspired rationale. The design now features extreme minimalism with generous spacing, flat borders, and a grey-first palette that eliminates distraction while maintaining clear hierarchy.

