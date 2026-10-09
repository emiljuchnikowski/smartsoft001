---
name: debug-helper
description: Cross-stack debugging workflows for Nx build, Jest test, dependency and NestJS issues in this monorepo.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
---

# Debug Helper Skill

Debugging assistance for Nx build, test and NestJS issues. Framework-specific checks for the UI libraries are in each library's patterns skill, which loads with the library's code.

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
