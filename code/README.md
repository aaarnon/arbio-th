# 🎫 Ticketing Hub - Property Management System

A modern, feature-rich ticketing and case management system built for property management teams. Track cases, manage hierarchical tasks, collaborate with comments and attachments, and receive real-time notifications.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)

## ✨ Features

### 📋 Case Management
- **Create & Track Cases** - Full case lifecycle management
- **Advanced Filtering** - Filter by status, domain, and search
- **Status Tracking** - TODO, IN_PROGRESS, DONE, CANCELLED
- **Domain Organization** - Property, Reservation, Finance categories
- **Rich Case Details** - Linked properties, reservations, and team assignments

### 📝 Hierarchical Task System
- **Unlimited Nesting** - Tasks with subtasks at any depth
- **Smart Status Validation** - Prevents marking parent tasks as complete with incomplete subtasks
- **Expand/Collapse UI** - Clean tree structure for task navigation
- **Real-time Progress** - Visual progress bars showing completion percentage
- **Inline Task Creation** - Add tasks and subtasks with hover actions
- **Full Task Editing** - Edit title, description, status, and assignee inline

### 💬 Collaboration
- **Comments** - Team communication on each case
- **Attachments** - File tracking with metadata (mock implementation)
- **User Avatars** - Visual team member identification
- **Relative Timestamps** - "2 hours ago" style time display

### 🔔 Real-time Notifications
- **Bell Icon Dropdown** - Beautiful notification panel
- **Badge Counter** - Shows unread notification count
- **Notification Types**:
  - 🟡 Case Created
  - 🟣 Task Created  
  - 🟢 Task Completed
  - 🔵 Comment Added
  - 🟣 Assignment Changed
- **Mark as Read** - Individual or bulk actions
- **Click Navigation** - Jump directly to related cases

### 🎨 Modern UI/UX
- **Tailwind CSS** - Beautiful, responsive design
- **shadcn/ui Components** - High-quality UI primitives
- **Dark Mode Ready** - Semantic color system
- **Mobile Responsive** - Works on all screen sizes
- **Toast Notifications** - Action feedback with Sonner
- **Loading States** - Smooth user experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📂 Project Structure

```
src/
├── components/          # Shared UI components
│   ├── layout/         # Layout components (Navbar, Layout, ErrorBoundary)
│   ├── shared/         # Reusable components (Badges, EmptyState, etc.)
│   └── ui/             # shadcn/ui primitives
├── features/           # Feature-based modules
│   ├── attachments/    # Attachment display
│   ├── case-detail/    # Case detail page
│   ├── cases/          # Case list & creation
│   ├── comments/       # Comment system
│   ├── notifications/  # Notification system
│   └── tasks/          # Hierarchical task management
├── store/              # Global state management
│   ├── CaseContext.tsx # React Context provider
│   ├── caseReducer.ts  # State reducer logic
│   └── types.ts        # Action & state types
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── data/               # Mock data for development
├── pages/              # Page components
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🎯 Key Technologies

- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 7.1** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first CSS
- **React Router DOM 7** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications
- **shadcn/ui** - UI component library

## 🏗️ Architecture

### State Management
- **React Context + useReducer** - Global state management
- **Immutable updates** - All state changes are immutable
- **Type-safe actions** - Full TypeScript support

### Component Pattern
- **Feature-based organization** - Colocated components, hooks, and logic
- **Composition over inheritance** - Small, reusable components
- **Smart/Dumb separation** - Container and presentational components

### Validation
- **Zod schemas** - Runtime validation
- **React Hook Form** - Form state management
- **Business logic validation** - Custom hooks for complex rules

## 📱 Usage Examples

### Create a Case
1. Click **"+ New Case"** button
2. Fill in title, description, domain, property, and assignee
3. Submit - notification appears!

### Manage Tasks
1. Open a case
2. Click **"Add Task"** to create top-level tasks
3. Hover over tasks and click **"+"** to add subtasks
4. Click **edit icon** to modify tasks inline
5. Change status via dropdown (with validation!)

### Add Comments
1. Navigate to a case
2. Type your comment in the text area
3. Click **"Add Comment"**
4. See it appear instantly with notifications

### View Notifications
1. Click the **bell icon** in the navbar
2. See all notifications with color-coded icons
3. Click a notification to navigate to the case
4. Click **"Mark all as read"** to clear badges

## 🔧 Configuration

### Environment Variables
Currently uses mock data - no environment variables needed.

### Mock Data
Located in `src/data/`:
- `mockCases.ts` - Sample cases with tasks
- `mockUsers.ts` - Team members
- `mockProperties.ts` - Properties
- `mockReservations.ts` - Reservations

## 🧪 Testing
Built incrementally with validation at each phase. All features tested during development.

## 📦 Deployment

### Build for Production
```bash
npm run build
```

Outputs to `dist/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
1. Update `vite.config.ts` with `base: '/repo-name/'`
2. Build: `npm run build`
3. Deploy `dist/` folder to gh-pages branch

## 🎓 Learning Resources

This project demonstrates:
- **React Context API** for state management
- **Recursive components** for hierarchical data
- **Form handling** with React Hook Form + Zod
- **Type-safe development** with TypeScript
- **Component composition** patterns
- **Custom hooks** for reusable logic
- **Modern CSS** with Tailwind

## 📝 License

MIT License - feel free to use for your projects!

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Design inspiration from modern SaaS applications

---

**Built with ❤️ for property management teams**
