# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nx monorepo with shared libraries for Angular, React, NestJS, and Ionic projects. Organized as publishable @smartsoft001/\* npm packages.

## Technology Stack

- **Angular**: 22.1.3
- **React**: 19.3 (`react`, `react-dom`)
- **NestJS**: 11.2.1
- **Nx**: 23.1.1
- **TypeScript**: 6.0.3
- **Storybook**: 10.5.10 (`@storybook/angular`; `@storybook/react-vite` on Vite 8 for React)
- **Jest**: 30.4 (Testing Library 16 for React)
- **Tailwind CSS**: 4.2
- **Node**: ^22.12 or >=26, **npm**: 10+

## Project Structure

```
packages/
  auth/           - Authentication (domain, shell/nestjs, shell/dtos, shell/app-services)
  crud/           - CRUD operations (domain, shell/nestjs, shell/angular, shell/react, shell/dtos, shell/app-services)
  trans/          - Payment transactions (domain, shell/nestjs, shell/dtos, shell/app-services)
  shared/
    angular/      - Shared Angular components, NgRx state management
    react/        - Shared React components, provider, services, form engine
    nestjs/       - NestJS utilities
    domain-core/  - Base repository patterns
    models/       - Data model decorators
    users/        - User entity definitions
    utils/        - NIP, PESEL, zip-code, password hashing
    mongo/        - MongoDB utilities
    paypal/, payu/, paynow/, revolut/ - Payment integrations
    fb/, google/  - Third-party integrations
    claude-plugins/ - Claude Code plugins (smart-core, smart-angular, smart-react @smartsoft)
```

## Agents

**MANDATORY: Always delegate to the appropriate agent.** Do NOT perform tasks manually if an agent exists.

### Shared (`shared-`)

| Agent                      | Use For                             |
| -------------------------- | ----------------------------------- |
| `shared-tdd-developer`     | TDD workflow (RED->GREEN->REFACTOR) |
| `shared-build-verifier`    | Verify build success                |
| `shared-test-runner`       | Run test suites                     |
| `shared-logic-implementer` | Implement business logic            |
| `shared-style-enforcer`    | Enforce ESLint/Prettier             |
| `shared-config-updater`    | Update config files                 |
| `shared-file-creator`      | Create files from templates         |
| `shared-error-handler`     | Standardize error handling          |
| `shared-security-scanner`  | Scan for vulnerabilities            |
| `shared-test-fixer`        | Fix failing tests                   |
| `shared-coverage-enforcer` | Enforce test coverage               |

### NestJS (`nestjs-`)

| Agent                    | Use For                    |
| ------------------------ | -------------------------- |
| `nestjs-service-builder` | Create injectable services |
| `nestjs-module-builder`  | Create NestJS modules      |

## Skills

### Workflow Skills (require user confirmation)

| Skill    | Use For                                                |
| -------- | ------------------------------------------------------ |
| `commit` | Create conventional commit based on Linear task        |
| `plan`   | Create implementation plan and save to Linear          |
| `impl`   | Implement plans from Linear task with TDD              |
| `push`   | Push changes, update Linear, create PR                 |
| `review` | Multi-dimensional code review (quality/tests/security) |

### Utility Skills (automatic)

| Skill               | Use For                                                    |
| ------------------- | ---------------------------------------------------------- |
| `test-unit`         | Jest conventions shared by every package (AAA, naming)     |
| `test-e2e`          | Playwright E2E tests with Page Objects                     |
| `docs`              | Add a documentation page for a package, component or skill |
| `nx-conventions`    | Nx monorepo patterns and commands                          |
| `debug-helper`      | Cross-stack debugging workflows                            |
| `a11y-audit`        | Accessibility audits with axe-core                         |
| `browser-capture`   | Screenshot capture with Playwright                         |
| `linear-suggestion` | Create Linear issues for improvements                      |
| `maia-files-upload` | Upload files to Maia API storage                           |
| `maia-files-delete` | Delete files from Maia API storage                         |

## Common Commands

```bash
# Build
nx build <project-name>
npx nx run-many -t build

# Test
nx test <project-name>
nx run-many --target=test --all
npm test

# Lint & Format
npm run format
nx lint <project-name>

# Storybook (UI libraries)
nx storybook <project-name>
nx run <project-name>:build-storybook -c ci
```

## Key Configuration

- **Package manager**: npm
- **Path aliases**: `@smartsoft001/{package}` in `tsconfig.base.json`
- **Project tags**: `scope:crud|auth|trans`, `type:shell|domain`

## UI Libraries

Each UI library keeps its framework instructions next to its code: a `CLAUDE.md` and skills in `<library>/.claude/skills/`. Claude Code loads them the first time it reads or edits a file in that directory, so only the framework being worked on is in context. The CRUD shells have a `CLAUDE.md` that points to the skills of their shared library.

| Library | Directories                                              | Instructions                        |
| ------- | -------------------------------------------------------- | ----------------------------------- |
| Angular | `packages/shared/angular`, `packages/crud/shell/angular` | `packages/shared/angular/CLAUDE.md` |
| React   | `packages/shared/react`, `packages/crud/shell/react`     | `packages/shared/react/CLAUDE.md`   |

Shared rules for both: Tailwind CSS 4 utilities carry the `smart:` prefix, dark mode follows a `.dark` class on an ancestor, and every component of the shared libraries has a Storybook story whose `Playground` sits in a `// #region usage` block.

## Git Conventions

- Conventional commits with commitlint
- Husky pre-commit hooks
- Branch: `main`
- Auto-versioning via GitHub Actions

## Claude Code Plugins: smart-core, smart-angular, smart-react (@smartsoft)

Marketplace `smartsoft`: `packages/shared/claude-plugins/src/.claude-plugin/marketplace.json`. One plugin per directory under `packages/shared/claude-plugins/src/plugins/`:

| Plugin          | Contents                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `smart-core`    | Hooks and framework-neutral skills (audit-log, format-code, project-conventions, safety-check)       |
| `smart-angular` | `angular-components-*` skills, `angular-components` agent, smart-crud, scaffold-nx-workspace         |
| `smart-react`   | `react-components-*` skills, `react-components` agent, react-provider, react-forms, smart-crud-react |

`smart-angular` and `smart-react` depend on `smart-core`; a project enables the plugin of its framework. This repository enables only `smart-core@smartsoft`. The former `smart` plugin is renamed to `smart-angular` (`renames` in marketplace.json).

Hooks of `smart-core` (`src/plugins/smart-core/hooks/hooks.json`):

| Event              | Hooks                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| `PreToolUse`       | safety_validator, sensitive file blocker, audit_logger, skill_validator |
| `PostToolUse`      | auto-format, audit_logger                                               |
| `UserPromptSubmit` | audit_logger                                                            |
