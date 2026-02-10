# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Smartsoft001 is a collection of libraries for Angular, NestJS, and Ionic projects organized as an Nx monorepo. The codebase follows a modular architecture with shared libraries and domain-specific packages.

### Framework Versions

- **Angular**: 20.1.0
- **NestJS**: 11.1.5
- **Nx**: 21.3.11
- **TypeScript**: 5.8.3
- **NgRx**: 20.0.1
- **Storybook**: 9.0.17
- **Jest**: 29.7.0
- **Node**: 18.16.9 (types)
- **pnpm**: 9.11.0

## Architecture

### Domain Structure

The repository is organized around three main domains:

- **auth**: Authentication and authorization functionality
- **crud**: Create, Read, Update, Delete operations and UI components
- **trans**: Translation/internationalization features

Each domain follows the same architectural pattern:

- `domain/`: Core business logic and models
- `shell/app-services/`: Application services layer
- `shell/dtos/`: Data transfer objects
- `shell/nestjs/`: NestJS-specific implementations
- `shell/angular/`: Angular-specific UI components (for crud only)

### Shared Libraries

Located in `packages/shared/`:

- `domain-core`: Base repository patterns and tools
- `models`: Data model decorators and utilities with metadata support
- `angular`: Shared Angular components, services, and NgRx state management
- `nestjs`: NestJS utilities and common functionality
- `users`: User entity definitions
- `utils`: Various utilities (NIP, PESEL, zip-code verification, password hashing, object operations)
- Payment integrations: `paypal`, `payu`, `paynow`, `revolut`
- Third-party integrations: `fb`, `google`
- Database: `mongo` (MongoDB utilities)

## Development Commands

### Building

```bash
# Build all projects
nx run-many --target=build --all

# Build specific project
nx build <project-name>

# Pre-release build (runs before versioning)
npx nx run-many -t build
```

### Testing

```bash
# Run all tests
nx run-many --target=test --all
npm test

# Test specific project
nx test <project-name>

# Test with coverage (CI configuration)
nx test <project-name> --configuration=ci
```

### Linting and Formatting

```bash
# Format code and fix lint issues
nx format & nx run-many -t lint --fix
npm run format

# Lint specific project
nx lint <project-name>
```

### Storybook

```bash
# Run Storybook for Angular components
nx storybook angular

# Run Storybook for CRUD Angular components
nx storybook crud-shell-angular

# Build Storybook
nx build-storybook <project-name>

# Test Storybook components
nx test-storybook <project-name>
```

### Package Management

- Uses **pnpm** as the package manager
- Workspaces are configured in `package.json`
- Uses Nx for project management and task execution

## Code Style and Standards

### ESLint Configuration

- Uses flat ESLint configuration (`eslint.config.mjs`)
- Import ordering rules with alphabetical sorting
- Special handling for `@smartsoft001/**` imports
- Enforces newlines between import groups

### Component Generation

- Angular components default to SCSS styling
- Components use `smart` prefix for CRUD shell
- Components use `lib` prefix for shared Angular library

### Project Tags

Projects are tagged for organizational purposes:

- `scope:crud`, `scope:auth`, `scope:trans` for domain separation
- `type:shell`, `type:domain` for architectural layers

## State Management

The codebase uses NgRx for state management in Angular applications:

- Effects, actions, reducers, and selectors follow standard NgRx patterns
- Facade pattern implemented for easier component interaction
- Error handling integrated through shared error effects and services

## Styling

- Uses **Tailwind CSS** for styling
- Custom Tailwind configurations per project
- PostCSS processing for CSS optimization
- SCSS support for component-level styling

## Testing Framework

- **Jest** as the primary testing framework
- Uses `@nx/jest` for Nx integration
- Angular testing with `jest-preset-angular`
- Storybook testing integration with `@storybook/test-runner`

## Git Workflow

- Uses Husky for git hooks
- Commitlint with conventional commit format
- Main branch: `main`
- Auto-versioning and publishing through GitHub Actions

## Claude Code Plugin: smart@smartsoft

This repository contains the `smart@smartsoft` plugin for Claude Code with safety hooks, audit logging, and skills.

### Plugin Location

```
packages/shared/claude-plugins/src/plugins/smart/
├── .claude-plugin/
│   ├── plugin.json                   # Plugin metadata
│   └── README.md                     # Installation guide
├── hooks/
│   ├── hooks.json                    # Hook configuration
│   ├── safety_validator.py           # Blocks destructive commands
│   ├── sensitive_file_blocker.py     # Blocks access to sensitive files
│   ├── audit_logger.py              # Logs all Claude actions
│   ├── skill_validator.py           # Validates skill file structure
│   ├── auto_format.sh               # Formats code after changes
│   ├── CONFIG.md                     # Hook customization guide
│   └── README.md                     # Hook documentation
├── skills/
│   ├── safety-check/SKILL.md        # Background: safety rules
│   ├── audit-log/SKILL.md           # User-invocable: /smart:audit-log
│   ├── format-code/SKILL.md         # User-invocable: /smart:format-code
│   └── project-conventions/SKILL.md # Background: project knowledge
├── _legacy/
│   ├── settings.template.json        # Deprecated settings template
│   └── merge-permissions.js          # Deprecated merge script
└── MIGRATION.md                      # Migration guide for consumers
```

### When to Update the Plugin

| Change                                  | Action Required                                         |
| --------------------------------------- | ------------------------------------------------------- |
| New hook added                          | Add to `hooks/hooks.json` and create script in `hooks/` |
| New skill added                         | Create `skills/<name>/SKILL.md`                         |
| New blocked pattern in safety_validator | Edit hook script directly                               |
| New event type supported                | Add new event key to `hooks/hooks.json`                 |

### Consumer Project Update

After publishing new plugin version:

```bash
# In consumer project
npm update @smartsoft001/claude-plugins
claude plugin update smart@smartsoft --scope project
```

### Hook Events

| Event              | When Triggered       | Hooks                                                                   |
| ------------------ | -------------------- | ----------------------------------------------------------------------- |
| `PreToolUse`       | Before tool executes | safety_validator, sensitive_file_blocker, audit_logger, skill_validator |
| `PostToolUse`      | After tool completes | auto_format, audit_logger                                               |
| `UserPromptSubmit` | User submits prompt  | audit_logger                                                            |

### Skills

| Skill               | Type           | Command              |
| ------------------- | -------------- | -------------------- |
| safety-check        | Background     | (automatic)          |
| project-conventions | Background     | (automatic)          |
| audit-log           | User-invocable | `/smart:audit-log`   |
| format-code         | User-invocable | `/smart:format-code` |

### Customizing Hooks

See `hooks/CONFIG.md` for:

- Adding custom blocked patterns to `safety_validator.py`
- Changing audit log location
- Creating new hooks
