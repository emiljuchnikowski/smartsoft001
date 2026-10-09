---
name: nx-conventions
description: Reference guide for Nx monorepo patterns, commands, and project organization in this repository.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# Nx Conventions Skill

Reference guide for Nx monorepo patterns and commands in this @smartsoft001 library monorepo.

## Project Structure

```
packages/
  auth/           - Authentication domain
    domain/
    shell/app-services/
    shell/dtos/
    shell/nestjs/
  crud/           - CRUD domain
    domain/
    shell/app-services/
    shell/dtos/
    shell/nestjs/
    shell/angular/
    shell/react/
  trans/          - Payment transaction domain
    domain/
    shell/app-services/
    shell/dtos/
    shell/nestjs/
  shared/         - Shared libraries
    angular/
    react/
    nestjs/
    domain-core/
    models/
    users/
    utils/
    mongo/
    paypal/
    payu/
    paynow/
    revolut/
    fb/
    google/
    claude-plugins/ - Claude Code plugins smart-core, smart-angular, smart-react (@smartsoft)
  meta/           - Meta packages (angular-stack, react-stack, ...)
```

## Common Commands

```bash
# Build
nx build <project-name>
nx run-many --target=build --all
npx nx run-many -t build

# Test
nx test <project-name>
nx run-many --target=test --all
npm test
nx test <project-name> --configuration=ci

# Lint
nx lint <project-name>
nx run-many -t lint --fix
npm run format

# Storybook (every UI library has `storybook`, `build-storybook` and `test-storybook` targets)
nx storybook <project-name>
nx run <project-name>:build-storybook -c ci
```

## Project Tags

- `scope:crud`, `scope:auth`, `scope:trans` - domain separation
- `type:shell`, `type:domain` - architectural layers

## Path Aliases

Pattern: `@smartsoft001/{package-name}` in `tsconfig.base.json`

## Package Manager

- **pnpm** 9.11.0
- Workspaces configured in `package.json`

## Import Order (ESLint)

```typescript
// 1. External imports (alphabetically)
import { Injectable } from '@nestjs/common';

// 2. @smartsoft001/ imports (with blank line)
import { BaseModel } from '@smartsoft001/domain-core';

// 3. Relative imports (with blank line)
import { LocalService } from './local.service';
```

## Reference implementation

The example application under `docs/examples/app` is a set of Nx projects outside `packages/`, named after their path and tagged so that the workspace can tell them from the packages.

- `docs/examples/app/apps/web/project.json`: an application project named `docs-examples-app-web` after its path, tagged `scope:docs` and `type:example-app`, with `build`, `serve`, `lint` and `test` targets.
- `docs/examples/app/apps/api/project.json`: the NestJS application beside it, with `serve` depending on its own `build`.
- `docs/examples/app/libs/model/project.json`: a library project reached through the `@app/model` alias in `tsconfig.base.json`, the same mechanism as `@smartsoft001/{package-name}`.
- `docs/examples/app/apps/web-e2e/project.json`: an e2e project declaring `implicitDependencies` on the app projects it drives, so that `nx affected` picks it up when either changes.
