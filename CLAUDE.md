# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing multiple TypeScript/NestJS libraries for Angular, NestJS, and Ionic projects. The codebase follows a domain-driven design pattern with clear separation between domain logic and shell implementations.

## Architecture

The project follows a layered architecture with these main domains:

- **auth**: Authentication and JWT token management
- **crud**: Generic CRUD operations
- **trans**: Transaction handling for payment providers (PayU, PayPal, Paynow, Revolut etc.)
- **shared**: Core utilities and services

Each domain is structured as:
- `domain/`: Core business logic and entities
- `shell/`: Implementation layers:
  - `app-services/`: Application services
  - `dtos/`: Data transfer objects
  - `nestjs/`: NestJS controllers, gateways, and modules

## Common Commands

### Testing
```bash
# Run all tests
nx run-many --target=test

# Run tests for specific project
nx test <project-name>

# Run tests with coverage
nx test <project-name> --configuration=ci
```

### Building
```bash
# Build all projects
nx run-many --target=build --all

# Build specific project
nx build <project-name>

# Build before release (used in CI)
npx nx run-many -t build
```

### Linting
```bash
# Lint all projects
nx run-many --target=lint --all

# Lint specific project
nx lint <project-name>
```

### Project Management
```bash
# List all projects
nx show projects

# Show project details
nx show project <project-name>

# List available targets
nx show project <project-name> --target-names
```

## Key Project Names

Major projects in the workspace:
- `domain-core`: Core domain interfaces and repository patterns
- `utils`: Utility services (NIP, PESEL, password hashing, etc.)
- `models`: Data model decorators and metadata utilities
- `auth-domain`: Authentication domain logic
- `crud-domain`: CRUD operations domain logic
- `trans-domain`: Transaction handling domain logic
- `shared-mongo`: MongoDB integration
- `nestjs`: Shared NestJS utilities

## Development Notes

- Uses Nx workspace with TypeScript and Jest
- Follows Conventional Commits standard
- Each package can be built and deployed independently to npm
- Import order enforced by ESLint with `@op/**` packages grouped after external dependencies
- Test naming convention: `describe('app/lib: ClassName', () => { ... })`