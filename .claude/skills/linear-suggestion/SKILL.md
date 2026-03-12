---
name: linear-suggestion
description: Create a Linear issue with a suggestion for agent or skill improvements.
allowed-tools: mcp__linear-server__create_issue
---

# Linear Suggestion

Create a Linear issue containing a suggestion for improving agent definitions or skills.

## When to Use

- When an automated agent identifies a recurring pattern that could improve an agent or skill
- When proposing rule changes based on analysis
- When any non-interactive process needs to suggest improvements

## Input Parameters

| Parameter     | Required | Description                                                     |
| ------------- | -------- | --------------------------------------------------------------- |
| `title`       | YES      | Short summary of the suggestion (max 100 chars)                 |
| `description` | YES      | Full markdown description with rationale and proposed changes   |
| `source`      | YES      | Agent that generated the suggestion                             |
| `targetFile`  | NO       | Path to the file to be modified                                 |
| `category`    | NO       | One of: `OPTIMIZATION`, `NEW_RULE`, `PATTERN_UPDATE`, `BUG_FIX` |

## Issue Format

### Title

```
[Agent Suggestion] {title}
```

### Description

```markdown
## Agent Improvement Suggestion

**Source agent**: `{source}`
**Category**: {category}
**Target file**: `{targetFile}`

---

{description}

---

_This issue was automatically created by `{source}` via the `linear-suggestion` skill._
```

## Process

1. Format the issue title with `[Agent Suggestion]` prefix
2. Build the description using the template
3. Create the issue using MCP Linear server
4. Return the issue ID and URL

## Error Handling

If issue creation fails:

- Log the error silently
- Do NOT block the parent workflow
- Return a failure notice without throwing
