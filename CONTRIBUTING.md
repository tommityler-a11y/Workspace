# Contributing to SAM.gov Integrity Records System

Thank you for your interest in contributing to this project! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sam-gov-integrity-records.git
   cd sam-gov-integrity-records
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

## Project Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing naming conventions
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### Component Structure
```tsx
// 1. Imports (React, third-party, local)
import { useState } from 'react';
import { Button } from './ui/button';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  // State and hooks
  const [isOpen, setIsOpen] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    setIsOpen(!isOpen);
    onAction();
  };
  
  // Render
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
}
```

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow USWDS color palette
- Maintain responsive design (mobile-first)
- Use semantic color tokens from theme.css
- Ensure WCAG 2.1 AA accessibility compliance

### File Organization
- Place new components in `/src/app/components/`
- Place reusable UI components in `/src/app/components/ui/`
- Place utility functions in separate files
- Keep components under 300 lines (split if larger)

### Testing
- Test responsive behavior on multiple screen sizes
- Verify keyboard navigation works
- Check screen reader compatibility
- Test form validation and error states

## Making Changes

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

Example: `feature/add-export-functionality`

### Commit Messages
Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(workspace): add contract export functionality

- Added CSV export button to workspace header
- Implemented export logic for filtered contracts
- Added unit tests for export function

Closes #123
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow the style guidelines
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Open a Pull Request**
   - Provide clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Changes are tested on multiple screen sizes
- [ ] Accessibility requirements are met
- [ ] Documentation is updated if needed
- [ ] Commit messages follow convention
- [ ] No console errors or warnings
- [ ] Build passes successfully

## Common Tasks

### Adding a New Component
```bash
# Create component file
touch src/app/components/MyComponent.tsx

# Import in parent component
import { MyComponent } from './components/MyComponent';
```

### Adding New UI Component
```bash
# Create in ui folder
touch src/app/components/ui/my-ui-component.tsx

# Use Radix UI or similar primitives when possible
```

### Updating Styles
```css
/* Add new design tokens to theme.css */
:root {
  --my-custom-color: #005ea2;
}

/* Use in Tailwind classes */
className="text-[var(--my-custom-color)]"
```

### Adding Dependencies
```bash
# Use pnpm
pnpm add package-name

# For dev dependencies
pnpm add -D package-name
```

## Design System

### Colors (USWDS)
- Primary: `#005ea2` (text-[#005ea2])
- Dark: `#1b1b1b` (text-[#1b1b1b])
- Gray: `#71767a` (text-[#71767a])
- Light: `#f0f0f0` (bg-[#f0f0f0])
- Border: `#dfe1e2` (border-[#dfe1e2])
- Error: `#dc2626` (text-[#dc2626])
- Success: `#00a91c` (text-[#00a91c])
- Warning: `#f59e0b` (text-[#f59e0b])

### Spacing
- Use Tailwind spacing scale (4px base)
- Consistent padding: `p-4`, `p-6` for cards
- Consistent gaps: `gap-3`, `gap-4` for layouts

### Typography
- Headings: Use semantic HTML (h1, h2, h3)
- Body: `text-sm` (14px) for most content
- Labels: `text-xs` (12px) for secondary info
- Monospace: `font-mono` for codes/IDs

## Questions?

If you have questions or need help:
1. Check existing documentation
2. Review similar components in the codebase
3. Open a discussion issue
4. Contact the project maintainers

## Code of Conduct

Be respectful, constructive, and professional in all interactions.

Thank you for contributing! 🎉
