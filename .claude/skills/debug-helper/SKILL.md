---
name: debug-helper
description: Cross-stack debugging workflows for Angular, NestJS, and Nx build issues.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
---

# Debug Helper Skill

Debugging assistance for Angular, NestJS, and Nx build issues.

## Common Debug Scenarios

### Build Failures

```bash
# Check TypeScript errors
npx tsc --noEmit

# Build with verbose output
nx build <project-name> --verbose

# Check affected projects
nx affected:build --base=main
```

### Test Failures

```bash
# Run single test file with verbose output
nx test <project-name> --testFile=failing.spec.ts --verbose

# Run with debug info
nx test <project-name> --detectOpenHandles
```

### Dependency Issues

```bash
# Check dependency graph
nx dep-graph

# List installed versions
pnpm list <package-name>

# Check for duplicates
pnpm why <package-name>
```

### Nx Cache Issues

```bash
# Clear Nx cache
nx reset

# Run without cache
nx test <project-name> --skip-nx-cache
```

## Angular Debugging

- Check `@angular/core` version compatibility
- Verify standalone component imports
- Check signal/computed reactivity chain
- Verify NgRx effect subscriptions

## NestJS Debugging

- Check module imports and provider registration
- Verify DI token matching
- Check guard and interceptor order
- Verify async module initialization

## Process

1. **Reproduce** - Identify exact error and steps
2. **Isolate** - Narrow down to specific file/module
3. **Diagnose** - Read error messages, check logs
4. **Fix** - Apply minimal fix
5. **Verify** - Run tests/build to confirm
