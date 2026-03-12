---
name: test-e2e
description: Orchestrate E2E Playwright test creation — scaffold project, inject data-testid attributes, write Page Objects and test specs, and run tests.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# E2E Test Skill

Orchestrate the full E2E Playwright testing workflow.

## Usage

```
/test-e2e [component-paths or 'changed']
```

## Workflow

### Step 1: Identify Target Components

**If `changed`:**

```bash
git diff --name-only HEAD | grep -E "\.component\.(html|ts)$"
```

**If explicit paths:** Use provided paths directly.

### Step 2: Scaffold E2E Project

Check if E2E Playwright project exists. If not, scaffold with Nx generator.

### Step 3: Inject `data-testid` Attributes

Scan changed component templates and inject data-testid attributes:

- Naming convention: `{component-name}-{element-type}-{identifier}`
- Target interactive elements only
- Never overwrite existing `data-testid` attributes

### Step 4: Write E2E Tests

For each component:

1. Create Page Object extending BasePage
2. Create test spec
3. Use `data-testid` selectors exclusively
4. Cover: visibility, interactions, form submissions, error states
5. Use Playwright auto-waiting (no manual sleeps)

### Step 5: Run E2E Tests

```bash
npx nx e2e {app-name}-e2e
```

### Step 6: Report Results

```markdown
## E2E Test Report

### Components Processed

| Component | Testids Injected | Tests Written | Status |
| --------- | ---------------- | ------------- | ------ |

### Files Modified

| File | Change |
| ---- | ------ |

### Summary

- E2E Project: [existed / scaffolded]
- Testids injected: [count]
- Tests created: [count]
- Test execution: [PASS / FAIL]
```

## Rules

1. **Always scaffold first** — ensure E2E project exists
2. **Always inject testids first** — ensure selectors exist before writing tests
3. **Run tests after writing** — verify tests pass
4. **Report comprehensively** — include injection summary and execution status
