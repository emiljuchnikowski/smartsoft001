---
name: project-conventions
description: Smartsoft001 monorepo conventions and architecture knowledge
user-invocable: false
---

# Project Conventions

Background skill providing knowledge about the Smartsoft001 monorepo structure, conventions, and patterns.

## Purpose

Ensure Claude follows project conventions when generating or modifying code in this Nx monorepo.

## When to Use

This skill is applied automatically when working within the Smartsoft001 codebase.

## Monorepo Structure

This is an **Nx monorepo** using **pnpm** workspaces. Projects are organized under:

- `packages/` — shared libraries and integrations
- `apps/` — applications (if any)

### Domain Architecture

Three main domains, each following the same layered pattern:

| Domain  | Purpose                           |
| ------- | --------------------------------- |
| `auth`  | Authentication and authorization  |
| `crud`  | CRUD operations and UI components |
| `trans` | Translation/internationalization  |

Each domain's layers:

- `domain/` — core business logic and models
- `shell/app-services/` — application services
- `shell/dtos/` — data transfer objects
- `shell/nestjs/` — NestJS implementations
- `shell/angular/` — Angular UI components (crud only)

### Shared Libraries (`packages/shared/`)

`domain-core`, `models`, `angular`, `nestjs`, `users`, `utils`, `mongo`, and payment/third-party integrations (`paypal`, `payu`, `paynow`, `revolut`, `fb`, `google`).

## Code Conventions

### Component Prefixes

- `smart` prefix for CRUD shell Angular components
- `lib` prefix for shared Angular library components

### Project Tags

- `scope:crud`, `scope:auth`, `scope:trans` — domain separation
- `type:shell`, `type:domain` — architectural layers

### ESLint / Import Ordering

- Flat ESLint configuration (`eslint.config.mjs`)
- Alphabetical import sorting
- Special handling for `@smartsoft001/**` imports
- Newlines required between import groups

### State Management (NgRx)

- Standard NgRx patterns: effects, actions, reducers, selectors
- Facade pattern for component interaction
- Error handling via shared error effects and services

### Styling

- **Tailwind CSS** for styling
- **SCSS** for component-level styles
- PostCSS processing for optimization

### Git Conventions

- Conventional commits (enforced by Commitlint + Husky)
- Main branch: `main`
- Auto-versioning via GitHub Actions

### Testing

- **Jest** as primary test framework
- `@nx/jest` for Nx integration
- `jest-preset-angular` for Angular tests
- Storybook testing with `@storybook/test-runner`

## Reference implementation

The example application under `docs/examples/app` is a consumer of these conventions: a NestJS API and an Angular app on the published packages, laid out and tagged like a project of this workspace.

- `docs/examples/app/apps/api/src/app/app.module.ts`: the `shell/nestjs` layer of two domains consumed together, `AuthShellNestjsModule` and `CrudShellNestjsModule`, next to the shared `AppExceptionFilter`, with the imports in the enforced order: external, `@smartsoft001/**`, then the app's own alias and the relative paths.
- `docs/examples/app/apps/api/src/app/users.seed.ts`: the shared libraries in use, `User` from `auth-domain` and `PasswordService` from `utils`.
- `docs/examples/app/apps/web/src/app/app.config.ts`: the NgRx root store and effects that `NgrxSharedModule` connects, which is where the CRUD shell adds its reducers.
- `docs/examples/app/apps/web/project.json`: the project tags on a consumer project, `scope:docs` and `type:example-app`, in the same `scope:` and `type:` scheme as the domain tags.
- `docs/examples/app/apps/web/jest.config.ts`: Jest through `@nx/jest` with `jest-preset-angular`, as listed under Testing.
