---
name: commit
description: Create a conventional commit message based on Linear task and staged changes. Fetches task details, analyzes changes, generates commit message.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - AskUserQuestion
  - TaskCreate
  - TaskUpdate
  - TaskList
  - TaskGet
  - mcp__linear-server__get_issue
  - mcp__linear-server__list_comments
---

# Commit Skill

Create a conventional commit message based on Linear task and staged changes.

## Usage

```
/commit [linearTaskId]
```

## Parameters

- `linearTaskId` - Linear task ID (e.g., ENG-123)

## Execution Checklist

Execute each step in order. Do not skip any step marked as MANDATORY.

- [ ] **1. Fetch Linear task** — get title, description, labels/type from MCP Linear server
- [ ] **2. Analyze staged changes** — run `git diff --cached` to understand scope
- [ ] **3. Verify completeness** — compare task requirements with staged changes; if incomplete, ask user whether to continue or stop
- [ ] **4. Read commitlint config** — read `commitlint.config.js` for valid scopes and format
- [ ] **5. Generate commit message** — draft `<type>(<scope>): <subject>` with body and `Refs: <linearTaskId>`
- [ ] **6. Show message to user** — present commit message for approval before proceeding
- [ ] **7. MANDATORY: Pre-commit preparation** — run `npm run format`, stage any formatting changes
- [ ] **8. Create commit** — execute `git commit` with the approved message

### Task Progress Tracking

**MANDATORY**: Use Claude Code's built-in task tracking to provide real-time progress visibility.

**Task naming convention**: Every task subject MUST be prefixed with the Linear task ID:

```
<linearTaskId> <step description>
```

**At skill start**: Create tasks for each checklist step using `TaskCreate`.

**During execution**:

- Before starting a step → `TaskUpdate({ taskId, status: "in_progress" })`
- After completing a step → `TaskUpdate({ taskId, status: "completed" })`

## Instructions

### Step 1: Fetch Linear Task Details

Use the MCP Linear server to fetch task details for the provided `linearTaskId`. Extract:

- Task title
- Task description
- Task labels/type (bug, feature, improve etc.)

### Step 2: Analyze Staged Changes

Run `git diff --cached` to see what files have been changed and understand the scope of changes.

### Step 2.5: Verify Implementation Completeness

Before proceeding with the commit, verify that all requirements from the Linear task have been implemented:

1. **Compare task requirements with actual changes**
2. **Ask user if implementation is incomplete** using `AskUserQuestion`:
   - Option 1: "Continue with commit"
   - Option 2: "Complete implementation first" (Recommended)

### Step 3: Read Commitlint Configuration

Read the `commitlint.config.js` file to understand:

- Available scopes (from the `scope-enum` rule)
- Commit message format requirements

### Step 4: Generate Commit Message

Based on the Linear task details and code changes, generate a commit message following conventional commits format:

```
<type>(<scope>): <subject>

<body>

Refs: <linearTaskId>
```

Where:

- **type**: Choose from: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`, `style`
- **scope**: Select from available scopes in commitlint.config.js based on changed files
- **subject**: Brief description (use Linear task title as base, keep under 72 chars)
- **body**: Optional detailed explanation if needed
- **footer**: Always include `Refs: <linearTaskId>`

### Step 4.5: Pre-commit Preparation (Mandatory)

Before creating the commit, **always** run:

1. **Format the code**:

   ```bash
   npm run format
   ```

2. **Stage any formatting changes**:
   - If `npm run format` modified any files, stage them with `git add`

### Step 5: Create Commit

Execute the commit with the generated message:

```bash
git commit -m "<type>(<scope>): <subject>" -m "<body>" -m "Refs: <linearTaskId>"
```

### Guidelines

1. Keep the subject line concise and imperative mood
2. Choose the most appropriate type based on task nature and code changes
3. Select scope based on the primary area of code changes
4. Always include the Linear task reference in the footer
5. If there are no staged changes, warn the user and don't create commit

### Example

For Linear task "ENG-123: Add password hashing to utils":

- Type: `feat` (new feature)
- Scope: `utils` (if changes are in packages/shared/utils)
- Subject: "add password hashing utility"
- Result: `feat(utils): add password hashing utility`

---

**Important**: Before committing, show the generated commit message to the user for approval.
