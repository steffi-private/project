# Kanban Board - Thunderbird Extension (JavaScript Version)

A beautiful, fully-featured kanban board extension for Thunderbird that helps you organize tasks and track project progress. This version has been converted from TypeScript to JavaScript for easier maintenance and broader compatibility.

## Features

### 🎯 Core Functionality
- **Drag & Drop**: Seamlessly move tasks between columns
- **Custom Columns**: Rename columns and choose from 14 color themes
- **Column Reordering**: Drag columns to rearrange your workflow
- **Task Management**: Add, edit, and delete tasks with rich details
- **Priority System**: Visual priority indicators (Low, Medium, High)
- **Statistics Dashboard**: Real-time overview of task distribution

### 🎨 Design & UX
- **Modern Interface**: Clean, professional design with smooth animations
- **Responsive Layout**: Works perfectly on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support
- **Visual Feedback**: Hover states and micro-interactions
- **Color System**: Consistent color palette with proper contrast ratios

### 💾 Data Management
- **Local Storage**: All data persists locally in Thunderbird
- **Export/Import**: Backup and restore your tasks as JSON files
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **No Authentication**: Simple, privacy-focused approach

## Installation

### For Development
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Thunderbird
5. Go to Tools → Add-ons and Themes
6. Click the gear icon → "Install Add-on From File"
7. Select the built extension file

### For Users
1. Download the latest release from the releases page
2. Open Thunderbird
3. Go to Tools → Add-ons and Themes
4. Click the gear icon → "Install Add-on From File"
5. Select the downloaded .xpi file

## Usage

### Getting Started
1. Click the kanban board icon in the Thunderbird toolbar
2. Click "Open Kanban Board" to launch the full interface
3. Use "Add Task" to create your first task
4. Drag tasks between columns to update their status

### Customizing Columns
1. Click the "Columns" button in the top-right
2. Rename columns to match your workflow
3. Choose colors from the palette
4. Drag column headers to reorder them

### Managing Tasks
- **Add**: Click "Add Task" and fill in the details
- **Edit**: Click the three-dot menu on any task → "Edit"
- **Delete**: Click the three-dot menu on any task → "Delete"
- **Move**: Drag tasks between columns to change status

### Data Management
1. Go to Tools → Add-ons and Themes
2. Find "Kanban Board" and click "Preferences"
3. Export your data for backup
4. Import data to restore from backup
5. Clear all data if needed

## Technical Details

### Architecture
- **Frontend**: React 18 with JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom design system
- **Drag & Drop**: @dnd-kit library for smooth interactions
- **Storage**: Thunderbird WebExtension storage API
- **Build**: Vite for fast development and optimized builds
- **Documentation**: JSDoc comments for type information

### File Structure
```
├── manifest.json          # Extension manifest
├── background.js          # Background script
├── popup.html/js          # Toolbar popup
├── options.html/js        # Settings page
├── src/
│   ├── App.jsx           # Main application
│   ├── main.jsx          # Application entry point
│   ├── components/       # React components (.jsx)
│   └── utils/            # Utility functions (.js)
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── dist/                 # Built files
```

### Data Schema
```javascript
// Task object structure
const Task = {
  id: string,           // Unique identifier
  title: string,        // Task title
  description?: string, // Optional description
  status: string,       // 'todo' | 'in-progress' | 'review' | 'done'
  priority: string,     // 'low' | 'medium' | 'high'
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
};

// Column object structure
const Column = {
  id: string,      // Column identifier
  title: string,   // Display name
  color: string,   // Text color class
  bgColor: string  // Background color class
};
```

### Type Safety & Documentation
- **JSDoc Comments**: All functions and components are documented with JSDoc
- **PropTypes**: Runtime type checking can be added if needed
- **ESLint**: Configured for JavaScript best practices
- **Runtime Validation**: Storage utilities include error handling

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Thunderbird 78+

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Building the Extension
```bash
# Build the React app
npm run build

# Package as .xpi file
npm run package
```

### Development Workflow
1. Make changes to JavaScript/JSX files
2. Run `npm run lint` to check code quality
3. Run `npm run build` to build the extension
4. Test in Thunderbird by loading the built extension

## Migration from TypeScript

This project was converted from TypeScript to JavaScript. Key changes include:

### Removed Files
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `src/vite-env.d.ts`
- All `.ts` and `.tsx` files

### Added Features
- Comprehensive JSDoc documentation
- Enhanced error handling in storage utilities
- Improved ESLint configuration for JavaScript

### Type Information
- Type definitions are now in JSDoc comments
- Runtime type checking can be added via PropTypes if needed
- All interfaces and types are documented in comments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes (JavaScript/JSX only)
4. Add JSDoc comments for new functions
5. Test thoroughly
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.

## JavaScript vs TypeScript Notes

### Advantages of JavaScript Version
- **Simpler Setup**: No TypeScript compilation step
- **Faster Build**: Direct JavaScript execution
- **Broader Compatibility**: Works in more environments
- **Easier Debugging**: Direct source mapping
- **Less Dependencies**: Fewer build tools required

### Type Safety Considerations
- **JSDoc**: Provides documentation and IDE support
- **Runtime Validation**: Storage utilities include error handling
- **ESLint**: Catches common JavaScript errors
- **PropTypes**: Can be added for runtime type checking if needed

### When to Add Runtime Type Checking
Consider adding PropTypes or similar if you need:
- Strict runtime validation
- Better error messages for invalid data
- Development-time type warnings
- Integration with type-aware tools