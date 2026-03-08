---
name: a11y-audit
description: Run accessibility audits on web pages using Playwright and axe-core.
allowed-tools:
  - Bash
  - Read
  - Glob
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_snapshot
  - mcp__playwright__browser_evaluate
  - mcp__playwright__browser_close
---

# Accessibility Audit Skill

Run accessibility audits on web pages using Playwright and axe-core.

## Audit Process

### 1. Ensure Server is Running

```bash
lsof -i :4200 -t || (npm start &)
```

### 2. Navigate to Page

Use `mcp__playwright__browser_navigate` to open the target URL.

### 3. Capture Accessibility Snapshot

Use `mcp__playwright__browser_snapshot` to get the accessibility tree.

### 4. Run Axe-core Audit

Use `mcp__playwright__browser_evaluate` to inject and run axe-core.

## Report Format

```markdown
## Accessibility Audit Report

**Page**: [URL]
**Standard**: WCAG 2.1 Level AA

### Critical Issues (Must Fix)

| Issue | Elements | WCAG | Fix |
| ----- | -------- | ---- | --- |

### Serious Issues (Should Fix)

| Issue | Elements | WCAG | Fix |
| ----- | -------- | ---- | --- |

### Passed Checks

- [x] Page has lang attribute
- [x] Headings in correct order
- [x] Form inputs have labels

### Summary

- Violations: X critical, Y serious, Z minor
- Passed: N checks
```
