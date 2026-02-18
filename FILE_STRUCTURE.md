# Project File Structure

Complete file structure for the SAM.gov Integrity Records Management System.

## Repository Root
```
sam-gov-integrity-records/
├── README.md                          # Project overview and documentation
├── CONTRIBUTING.md                    # Contribution guidelines
├── DEPLOYMENT.md                      # Deployment instructions
├── ATTRIBUTIONS.md                    # Third-party attributions
├── .gitignore                         # Git ignore rules
├── package.json                       # Project dependencies and scripts
├── pnpm-lock.yaml                     # Lock file (auto-generated)
├── postcss.config.mjs                 # PostCSS configuration
├── vite.config.ts                     # Vite build configuration
│
├── guidelines/
│   └── Guidelines.md                  # Project guidelines
│
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main application entry point
│   │   │
│   │   └── components/
│   │       ├── Workspace.tsx                    # 🎯 Main workspace/dashboard (DEFAULT VIEW)
│   │       ├── IntegrityRecordForm.tsx          # Record creation/editing form
│   │       ├── IntegrityRecordReview.tsx        # Review screen before submission
│   │       ├── IntegrityRecordConfirmation.tsx  # Success confirmation page
│   │       ├── ReportView.tsx                   # Read-only report viewer
│   │       ├── ReviewScreen.tsx                 # Additional review component
│   │       ├── TerminateContractForm.tsx        # Contract termination workflow
│   │       ├── UswdsFormField.tsx               # USWDS form field components
│   │       │
│   │       ├── figma/
│   │       │   └── ImageWithFallback.tsx        # Image component with fallback
│   │       │
│   │       └── ui/                              # Reusable UI components
│   │           ├── accordion.tsx
│   │           ├── alert-dialog.tsx
│   │           ├── alert.tsx
│   │           ├── aspect-ratio.tsx
│   │           ├── avatar.tsx
│   │           ├── badge.tsx                    # Status badges
│   │           ├── breadcrumb.tsx
│   │           ├── button.tsx                   # Button component
│   │           ├── calendar.tsx
│   │           ├── card.tsx                     # Card layouts
│   │           ├── carousel.tsx
│   │           ├── chart.tsx
│   │           ├── checkbox.tsx
│   │           ├── collapsible.tsx
│   │           ├── command.tsx
│   │           ├── context-menu.tsx
│   │           ├── dialog.tsx                   # Modal dialogs
│   │           ├── drawer.tsx
│   │           ├── dropdown-menu.tsx
│   │           ├── form.tsx                     # Form utilities
│   │           ├── hover-card.tsx
│   │           ├── input-otp.tsx
│   │           ├── input.tsx                    # Input fields
│   │           ├── label.tsx
│   │           ├── menubar.tsx
│   │           ├── navigation-menu.tsx
│   │           ├── pagination.tsx
│   │           ├── popover.tsx
│   │           ├── progress.tsx
│   │           ├── radio-group.tsx
│   │           ├── resizable.tsx
│   │           ├── scroll-area.tsx
│   │           ├── select.tsx                   # Select dropdowns
│   │           ├── separator.tsx
│   │           ├── sheet.tsx
│   │           ├── sidebar.tsx
│   │           ├── skeleton.tsx
│   │           ├── slider.tsx
│   │           ├── sonner.tsx                   # Toast notifications
│   │           ├── switch.tsx
│   │           ├── table.tsx                    # Data tables
│   │           ├── tabs.tsx                     # Tab navigation
│   │           ├── textarea.tsx
│   │           ├── toggle-group.tsx
│   │           ├── toggle.tsx
│   │           ├── tooltip.tsx
│   │           ├── use-mobile.ts                # Mobile detection hook
│   │           └── utils.ts                     # Utility functions
│   │
│   └── styles/
│       ├── index.css                  # Main stylesheet
│       ├── fonts.css                  # Font imports
│       ├── tailwind.css               # Tailwind configuration
│       └── theme.css                  # Design tokens and theme
│
└── node_modules/                      # Dependencies (not committed)
```

## Key Files Explained

### Core Application Files

#### `/src/app/App.tsx` 🎯
**Purpose:** Main application router and state management
- Handles navigation between different views
- Manages global application state
- Routes: workspace, form, review, confirmation, view-report, terminate-contract
- **Default view:** Workspace

#### `/src/app/components/Workspace.tsx` 🏠
**Purpose:** Main dashboard and primary user interface
- **DEFAULT/INDEX VIEW** - App starts here
- Office switching (DCMA-2024, etc.)
- Left sidebar navigation
- My Awards / Office Awards views
- Integrity Records list
- Team management
- Contract filtering and sorting
- Quick actions (Create, Terminate, Manage)
- Notification center

#### `/src/app/components/IntegrityRecordForm.tsx` 📝
**Purpose:** Create and edit integrity records
- Multi-step form with progressive disclosure
- UEI/Award lookup
- 8 different record types
- Dynamic fields based on selection
- Validation and error handling
- Draft save functionality

#### `/src/app/components/IntegrityRecordReview.tsx` 👀
**Purpose:** Review screen before submission
- Summary of all entered data
- Edit capability for each section
- Final validation
- Submit button

#### `/src/app/components/ReportView.tsx` 📄
**Purpose:** Read-only view of published reports
- Complete record details
- Audit trail
- Document attachments
- Print functionality

#### `/src/app/components/TerminateContractForm.tsx` ⚠️
**Purpose:** Contract termination workflow
- Termination reason selection
- Termination date
- Required integrity record creation
- Documentation upload

### Configuration Files

#### `/package.json`
Project metadata and dependencies
- Scripts: `dev`, `build`, `preview`
- Dependencies: React, TypeScript, Tailwind, etc.
- Dev dependencies: Vite, build tools

#### `/vite.config.ts`
Build configuration
- React plugin setup
- Build optimizations
- Path aliases
- Development server settings

#### `/postcss.config.mjs`
PostCSS configuration for Tailwind CSS

### Style Files

#### `/src/styles/theme.css`
Design tokens and USWDS color system
- Color variables
- Typography scales
- Spacing system
- Component styles

#### `/src/styles/tailwind.css`
Tailwind CSS v4 configuration
- Imports and setup

#### `/src/styles/index.css`
Global styles
- CSS reset/normalize
- Base styles
- Utility classes

## Component Categories

### 1. Page Components (Main Views)
- `Workspace.tsx` - Dashboard (DEFAULT)
- `IntegrityRecordForm.tsx` - Form entry
- `IntegrityRecordReview.tsx` - Review screen
- `IntegrityRecordConfirmation.tsx` - Success page
- `ReportView.tsx` - Report viewer
- `TerminateContractForm.tsx` - Termination flow

### 2. Form Components
- `UswdsFormField.tsx` - USWDS form fields
- `ui/input.tsx` - Text inputs
- `ui/select.tsx` - Dropdowns
- `ui/textarea.tsx` - Text areas
- `ui/checkbox.tsx` - Checkboxes
- `ui/radio-group.tsx` - Radio buttons
- `ui/form.tsx` - Form utilities

### 3. Display Components
- `ui/badge.tsx` - Status indicators
- `ui/card.tsx` - Content containers
- `ui/table.tsx` - Data tables
- `ui/tabs.tsx` - Tab navigation
- `ui/alert.tsx` - Alerts and messages

### 4. Interactive Components
- `ui/button.tsx` - Buttons
- `ui/dialog.tsx` - Modals
- `ui/dropdown-menu.tsx` - Dropdowns
- `ui/popover.tsx` - Popovers
- `ui/tooltip.tsx` - Tooltips

### 5. Layout Components
- `ui/separator.tsx` - Dividers
- `ui/scroll-area.tsx` - Scrollable areas
- `ui/sidebar.tsx` - Sidebar layout
- `ui/sheet.tsx` - Side panels

## Data Flow

```
User Action → Workspace.tsx → App.tsx (state) → Form Component → Review → Confirmation → Back to Workspace
```

### Example: Creating a New Integrity Record

1. **Workspace.tsx**: User clicks "Create New Record"
2. **App.tsx**: Sets `currentPage` to 'form'
3. **IntegrityRecordForm.tsx**: User fills out form
4. **IntegrityRecordReview.tsx**: User reviews data
5. **App.tsx**: Handles submission
6. **IntegrityRecordConfirmation.tsx**: Shows success
7. **App.tsx**: Returns to Workspace

## Mock Data Location

All mock data is currently in `Workspace.tsx`:
- `CURRENT_USER` - Current logged-in user
- `USER_OFFICES` - Available contracting offices
- `MOCK_AWARDS` - Sample contracts/awards
- `MOCK_RECORDS` - Sample integrity records
- `TEAM_MEMBERS` - Sample team members

**Note:** For production, this should be replaced with API calls.

## Adding New Features

### New Page Component
1. Create file in `/src/app/components/`
2. Add page type to `App.tsx` Page union type
3. Add route handler in `App.tsx`
4. Add navigation trigger in `Workspace.tsx`

### New UI Component
1. Create file in `/src/app/components/ui/`
2. Follow existing component patterns
3. Use Radix UI primitives when available
4. Export component

### New Style Tokens
1. Add to `/src/styles/theme.css`
2. Use CSS custom properties
3. Reference in Tailwind classes

## Build Output

After running `pnpm build`, the `dist/` folder contains:
```
dist/
├── index.html          # Entry HTML
├── assets/
│   ├── index-[hash].js   # Bundled JavaScript
│   └── index-[hash].css  # Bundled CSS
└── [other assets]
```

This folder is what gets deployed to production.

## Getting Started

1. **Clone repository**
2. **Install dependencies**: `pnpm install`
3. **Start dev server**: `pnpm dev`
4. **Open browser**: http://localhost:5173
5. **App loads directly into Workspace view**

---

**Note:** Workspace.tsx is the main entry point and default view of the application. All user journeys begin here.
