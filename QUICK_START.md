# Quick Start Guide

Get the SAM.gov Integrity Records System running in 5 minutes.

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm
- **Git**

### Install pnpm (if not installed)
```bash
npm install -g pnpm
```

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sam-gov-integrity-records.git
cd sam-gov-integrity-records
```

### 2. Install Dependencies
```bash
pnpm install
```

This will install all required packages including:
- React & React DOM
- TypeScript
- Tailwind CSS v4
- Vite
- Radix UI components
- Material UI
- And more...

### 3. Start Development Server
```bash
pnpm dev
```

The app will open at **http://localhost:5173**

## What You'll See

The app launches directly into the **Workspace** view:

1. **Global Header** (dark gray)
   - SAM.gov logo
   - Notification bell (3 pending)
   - User profile (John Smith)

2. **Secondary Navigation**
   - Home | **Workspace** | Data Services | Help
   - Global search: "Search awards by UEI, CAGE, award #..."

3. **Left Sidebar** (open by default on desktop)
   - Office switcher (DCMA-2024)
   - Overview
   - My Awards ← *Active by default*
   - Office Awards
   - Integrity Records
   - Team

4. **Main Content**
   - Contract list with filters (All, Active, Terminated)
   - Sort by: Award Number, Contractor, Date, Value
   - Contract cards showing award details
   - Action buttons (Create New Record, Manage, etc.)

## Key Features to Explore

### 1. Browse Contracts
- **Filter** by status: All, Active, Terminated
- **Sort** contracts using the dropdown
- Click on integrity record count to view records
- Use "Manage" dropdown for contract actions

### 2. Create Integrity Record
- Click **"+ Create New Record"** button
- Follow the multi-step form:
  1. UEI/Award lookup
  2. Select record type
  3. Fill type-specific questions
  4. Review submission
  5. Confirm

### 3. Switch Views
Left sidebar navigation:
- **Overview**: Dashboard with summary cards and notifications
- **My Awards**: Contracts assigned to you (John Smith)
- **Office Awards**: All office contracts
- **Integrity Records**: List of all records with filters
- **Team**: Team member management

### 4. Switch Offices
- Click office name in top-left of sidebar (DCMA-2024)
- Select different contracting office
- View switches to that office's data

### 5. Mobile View
- Resize browser to < 1024px
- Hamburger menu appears
- Sidebar becomes collapsible
- Responsive layout adapts

## Project Structure Overview

```
src/app/
├── App.tsx                    # Main router
└── components/
    ├── Workspace.tsx          # 🏠 Main dashboard (YOU ARE HERE)
    ├── IntegrityRecordForm.tsx
    ├── ReportView.tsx
    └── ui/                    # Reusable components
```

See [FILE_STRUCTURE.md](FILE_STRUCTURE.md) for complete details.

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Package Management
pnpm install          # Install dependencies
pnpm add [package]    # Add new package
pnpm remove [package] # Remove package
```

## Making Your First Change

### Example: Change the Welcome Message

**Step 1:** Open `src/app/components/Workspace.tsx`

**Step 2:** Find the overview section (around line 700)

**Step 3:** Modify the welcome message:
```tsx
<h2 className="text-xl font-medium text-[#1b1b1b] mb-2">
  Welcome back, {CURRENT_USER.name}! 👋  // Add emoji
</h2>
```

**Step 4:** Save file - changes appear instantly (hot reload)

### Example: Add a New Mock Contract

**Step 1:** Open `src/app/components/Workspace.tsx`

**Step 2:** Find `MOCK_AWARDS` array (around line 111)

**Step 3:** Add new award object:
```typescript
{
  id: '6',
  awardNumber: 'YOUR-AWARD-123',
  awardTitle: 'Your New Contract',
  contractorName: 'Your Company Inc',
  uei: 'ABC123XYZ789',
  awardType: 'Fixed Price',
  popStart: 'Jan 2025',
  popEnd: 'Dec 2025',
  value: '$500,000',
  status: 'Active',
  assignedTo: 'John Smith',
  integrityRecords: 0,
  needsIntegrityReport: true,
}
```

**Step 4:** See your new contract appear in the list

## Development Tips

### Hot Reload
- Changes to files automatically reload the browser
- State is preserved when possible
- Errors show in browser overlay

### Console Tools
Open browser DevTools (F12):
- **Console**: View logs and errors
- **Elements**: Inspect HTML/CSS
- **Network**: Monitor requests (when APIs added)
- **React DevTools**: Inspect component tree (install extension)

### Mobile Testing
```bash
# Access from phone on same network
# Find your IP address first
ipconfig        # Windows
ifconfig        # Mac/Linux

# Then visit on phone:
http://YOUR-IP:5173
```

### TypeScript Errors
TypeScript checks types as you code:
- Red squiggles = type errors
- Hover for details
- Save to see errors in terminal

## Mock User Context

The app simulates being logged in as:
- **Name**: John Smith
- **Role**: Contracting Officer Representative (COR)
- **Office**: DCMA-2024 (Defense Contract Management Agency)
- **Permissions**: Create, edit, view records

## Sample Data Included

- **4 Awards** total
- **2 Awards** assigned to John Smith  
- **4 Integrity Records** (various types)
- **5 Team Members**
- **2 Offices** available

## Next Steps

1. ✅ App running locally
2. 📖 Read [README.md](README.md) for full documentation
3. 🎨 Review design system in [CONTRIBUTING.md](CONTRIBUTING.md)
4. 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options
5. 🔍 Explore [FILE_STRUCTURE.md](FILE_STRUCTURE.md) for code organization

## Troubleshooting

### Port Already in Use
```bash
# Vite will automatically use next available port
# Or specify custom port:
pnpm dev -- --port 3000
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Fails
```bash
# Check Node version
node --version  # Should be 18+

# Update pnpm
pnpm self-update
```

### Styles Not Loading
```bash
# Restart dev server
# Press Ctrl+C, then:
pnpm dev
```

## Getting Help

- 📖 Check [README.md](README.md) for detailed docs
- 🐛 Open an issue on GitHub
- 💬 Start a discussion
- 📧 Contact project maintainers

## Ready to Contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Component patterns
- Pull request process
- Development workflow

---

**🎉 You're all set! The Workspace is your starting point. Happy coding!**
