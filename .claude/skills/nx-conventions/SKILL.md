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
  trans/          - Translation domain
    domain/
    shell/app-services/
    shell/dtos/
    shell/nestjs/
  shared/         - Shared libraries
    angular/
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
    claude-plugins/
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

# Storybook
nx storybook angular
nx storybook crud-shell-angular
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
import { Component } from '@angular/core';

// 2. @smartsoft001/ imports (with blank line)
import { BaseModel } from '@smartsoft001/domain-core';

// 3. Relative imports (with blank line)
import { LocalService } from './local.service';
```
