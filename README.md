# SAM.gov Integrity Records Management System

A modern, streamlined interface for federal employees to create and manage contractor integrity records efficiently. This application consolidates what was previously a 29-screen process into a single, structured workspace with progressive disclosure and clear workflow.

## Overview

The SAM.gov Integrity Records System is designed to help Contracting Officer Representatives (CORs) manage integrity records across multiple contractors. The system aligns with USWDS (US Web Design System) standards for federal government applications.

## Key Features

### 1. Workspace (Entry Point)
- **Dashboard** showing all integrity records for the contracting office
- **Multi-view navigation**: My Awards, Office Awards, Integrity Records, Team
- **Office switching**: Manage multiple contracting offices from a single interface
- **Filtering**: Filter awards by status (Active, Terminated)
- **Sorting**: Sort contracts by award number, contractor name, start date, or value
- **Quick actions**: Create records, terminate contracts, manage team access
- **Real-time notifications**: Track pending requests and action items

### 2. Contract Management
- **Award search**: Global search across all SAM.gov awards by UEI, CAGE, or award number
- **Contract tracking**: Monitor contracts requiring integrity reports ($25,000+ threshold)
- **Award details**: View comprehensive contract information including contractor details, performance period, and value
- **Termination workflow**: Streamlined process for contract termination with required integrity records

### 3. Integrity Record Creation & Editing
- **Award Lookup**: UEI search with optional Award ID
- **8 Record Types**:
  - Termination for Cause
  - Termination for Default
  - Administrative Agreement
  - Performance Issue
  - Quality Issue
  - Non-Responsibility Determination
  - Suspension/Debarment
  - Criminal/Civil Proceedings
- **Dynamic Forms**: Type-specific questions based on violation type
- **Progressive Disclosure**: Show only relevant fields based on selections
- **Draft Management**: Save and resume incomplete records
- **Review Screen**: Comprehensive summary before submission
- **Confirmation**: Tracking number and next steps

### 4. Report Viewing
- **Complete Record Details**: All submitted/published reports
- **Audit Trail**: Full record history and modifications
- **Document Attachments**: Supporting documentation
- **Status Tracking**: Draft, Submitted, Under Review, Published, Returned

### 5. Team Collaboration
- **Access Management**: Office-level user access control
- **Role-based Permissions**: Different access levels for team members
- **Activity Tracking**: Monitor team member actions

## Architecture

### Technology Stack
- **React 18.3.1**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling
- **Vite**: Fast build tooling
- **Radix UI**: Accessible component primitives
- **Material UI**: Additional component library
- **Lucide React**: Icon system
- **Recharts**: Data visualization

### Project Structure
```
src/
├── app/
│   ├── App.tsx                              # Main application router
│   └── components/
│       ├── Workspace.tsx                    # Main workspace/dashboard
│       ├── IntegrityRecordForm.tsx          # Record creation/editing
│       ├── IntegrityRecordReview.tsx        # Review before submission
│       ├── IntegrityRecordConfirmation.tsx  # Success confirmation
│       ├── ReportView.tsx                   # Read-only report viewer
│       ├── TerminateContractForm.tsx        # Contract termination workflow
│       ├── UswdsFormField.tsx               # USWDS form components
│       ├── figma/
│       │   └── ImageWithFallback.tsx        # Image handling component
│       └── ui/                              # Reusable UI components
│           ├── accordion.tsx
│           ├── alert.tsx
│           ├── badge.tsx
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           ├── dropdown-menu.tsx
│           ├── form.tsx
│           ├── input.tsx
│           ├── select.tsx
│           ├── table.tsx
│           ├── tabs.tsx
│           └── ... (additional UI components)
└── styles/
    ├── index.css                            # Main styles
    ├── fonts.css                            # Font imports
    ├── tailwind.css                         # Tailwind config
    └── theme.css                            # Design tokens
```

## Design Principles

### USWDS Alignment
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile-first**: Fully responsive design
- **Clear hierarchy**: Visual information hierarchy
- **Plain language**: Simple, direct communication
- **Government standards**: Follows federal design guidelines

### User Experience
- **Progressive Disclosure**: Show information as needed
- **Contextual Help**: Inline guidance and tooltips
- **Clear Feedback**: Success/error states with actionable messages
- **Efficient Workflows**: Minimize clicks and screen transitions
- **Consistent Patterns**: Familiar interactions throughout

### Visual Design
- **Grayscale Foundation**: Layout-focused with minimal visual polish
- **Clean Structure**: Gray boxes, simple text, clear spacing
- **Typography**: System fonts for readability
- **Status Indicators**: Color-coded badges for quick scanning

## Business Rules

### Integrity Reporting Requirements
- **Threshold**: Contracts over $25,000 require integrity reporting
- **Multiple Records**: Awards can have multiple integrity records
- **Record Types**: Different types for various compliance issues
- **Mandatory Fields**: Varies by record type
- **Review Process**: Records must be reviewed before publication

### Access Control
- **Office-Based**: Users have access to their contracting office(s)
- **COR Assignment**: Contracts assigned to specific CORs
- **Team Sharing**: CORs can share access with team members
- **Permission Levels**: View, Edit, Manage permissions

## Getting Started

### Prerequisites
- Node.js 18+ or compatible runtime
- pnpm (recommended) or npm

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Development
The application starts directly in the workspace view. The main navigation includes:
- **Home**: Return to workspace overview
- **Workspace**: Active workspace (current view)
- **Data Services**: Additional data tools
- **Help**: Documentation and support
- **Search**: Global award search across SAM.gov

## Component Documentation

### Workspace Component
The main dashboard component that displays:
- Office switcher (top-left)
- Navigation menu (left sidebar)
- Content area with filtered/sorted contract lists
- Quick action buttons for common tasks
- Notification center

**Props:**
- `onCreateNew`: Handler for creating new integrity records
- `onViewReport`: Handler for viewing published reports
- `onEditReport`: Handler for editing draft/returned reports
- `onManageAward`: Handler for contract management actions

### IntegrityRecordForm Component
Multi-step form for creating/editing integrity records with:
- UEI/Award lookup
- Record type selection
- Dynamic field rendering
- Validation and error handling
- Draft save functionality

### ReportView Component
Read-only view of published/submitted records with:
- Complete record details
- Audit history
- Document attachments
- Print functionality

## Mock Data

The application includes comprehensive mock data for demonstration:
- **User offices**: Multiple contracting offices
- **Awards**: Sample contracts with various statuses
- **Integrity records**: Different record types and statuses
- **Team members**: Sample CORs and team members

## Responsive Behavior

### Desktop (1024px+)
- Left sidebar open by default
- Full table views with all columns
- Side-by-side layouts
- Expanded navigation

### Tablet (768px - 1023px)
- Collapsible sidebar
- Responsive tables
- Stacked layouts
- Touch-friendly targets

### Mobile (< 768px)
- Hamburger menu navigation
- Card-based layouts
- Single-column forms
- Bottom navigation options

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements
- Backend integration with SAM.gov APIs
- Real-time collaboration features
- Advanced search and filtering
- Bulk operations
- Export functionality
- Analytics and reporting
- Document management system
- Email notifications

## License
This project is for demonstration purposes as part of the SAM.gov modernization initiative.

## Contact
For questions or feedback about this prototype, please contact your project team lead.
