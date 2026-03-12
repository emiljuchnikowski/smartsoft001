---
name: impl
description: Implement plans from Linear task comments. Iteratively processes subtasks with TDD, agent orchestration, and 3x3 rule checkpoints.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Glob
  - Grep
  - AskUserQuestion
  - TaskCreate
  - TaskUpdate
  - TaskList
  - TaskGet
  - mcp__linear-server__get_issue
  - mcp__linear-server__list_issues
  - mcp__linear-server__list_comments
  - mcp__linear-server__create_comment
  - mcp__linear-server__update_issue
  - mcp__linear-server__list_issue_statuses
---

# Implementation Skill

Implement plans from Linear task comments. For tasks with subtasks, iteratively implement each subtask that is in "To Do" status.

## Usage

```
/impl [linearTaskId]
```

## Parameters

- `linearTaskId` - Linear task ID (e.g., ENG-123)

## Execution Checklist

Execute each step in order. Do not skip any step marked as MANDATORY.

### Initial Setup

- [ ] **1. Fetch task and subtasks** — get task details, subtasks, and their statuses

### Per Subtask (repeat for each "To Do" subtask)

- [ ] **2. Set status to "In Progress"** — update subtask status via MCP (subtasks only, not parent)
- [ ] **3. Fetch implementation plan** — find `## Implementation Plan` in task comments
- [ ] **4. MANDATORY: Agent orchestration plan** — determine which agents to use, post plan to Linear
- [ ] **5. Check cross-package blockers** — if blockers found, set status to Blocked and skip
- [ ] **6. MANDATORY: Implement with 3x3 rule** — pause every 3 changes, use `shared-tdd-developer` for ALL code (RED -> GREEN -> REFACTOR)
- [ ] **7. Verify implementation** — run tests, lint, build check
- [ ] **8. Create completion comment** — post implementation report to Linear
- [ ] **9. MANDATORY: Write reports in Polish** — all Linear comments must be in Polish language
- [ ] **10. Update status** — set to "In Review" if completed
- [ ] **11. Pause for user confirmation** — ALWAYS wait before proceeding to next subtask

### Finalization

- [ ] **12. Final summary** — present summary of all subtasks with statuses
- [ ] **13. ALWAYS pause** — wait for user confirmation at end

### Task Progress Tracking

**MANDATORY**: Use Claude Code's built-in task tracking.

**Task naming convention**: `<linearTaskId> <step description>`

## Role

**You are a highly experienced senior TypeScript developer** with:

- TypeScript expert - advanced types, generics, decorators
- NestJS expert - modules, DI, guards, interceptors
- Angular expert - signals, standalone components, NgRx
- Writing clean, readable, and well-tested code

## Instructions

### Step 1: Fetch Linear Task and Subtasks

Use MCP Linear server to fetch task details, check for subtasks, filter "To Do" status.

### Step 2: Process Tasks Iteratively

For each task to implement (subtasks in "To Do" status, or parent task if no subtasks):

#### Step 2a: Set Status to "In Progress"

For subtasks only, update status to "In Progress".

#### Step 2b: Fetch Implementation Plan

Look for comment containing `## Implementation Plan` or `## Implementation Plan for Subtask`.

Extract: Implementation Steps, Files to Modify, New Files, Testing Strategy.

**If no plan found**: Create a comment noting that no plan was found and skip this task.

#### Step 2c: Agent Orchestration Plan

Before starting implementation, create an agent orchestration plan:

1. Identify required agents based on task type
2. Define execution order (parallel vs sequential)
3. Plan TDD cycles for each implementation unit

Post the orchestration plan as a comment on the Linear task.

**IMPORTANT**: `shared-tdd-developer` is MANDATORY for ALL code implementation.

#### Step 2d: Check for Cross-Package Blockers

If the plan references changes in other packages that haven't been implemented yet, set status to "Blocked" and skip.

#### Step 2e: Implement the Plan (with 3x3 Rule)

Follow the implementation steps, applying the **3x3 Rule**:

**3x3 Rule**: After every 3 changes, STOP and:

1. Summarize what was completed in the last 3 changes
2. Present the next 3 planned steps
3. Wait for user confirmation before continuing

**3x3 Checkpoint Format:**

```markdown
## Checkpoint (3x3)

### Completed (last 3 changes)

1. [Change 1] - `path/to/file1.ts`
2. [Change 2] - `path/to/file2.ts`
3. [Change 3] - `path/to/file3.ts`

### Next 3 Steps

1. [ ] [Next step 1]
2. [ ] [Next step 2]
3. [ ] [Next step 3]

### Progress

- Steps completed: X / Y
- Remaining: Z steps

Continue? (yes/no/adjust)
```

#### Step 2f: Verify Implementation

1. **Run relevant tests**: `nx test <project-name>`
2. **Run linting**: `nx lint <project-name>`
3. **Build check**: `nx build <project-name>`

#### Step 2g: Create Completion Comment

Post an Implementation Report to Linear:

```markdown
## Implementation Report

### Status

[Completed / Partially Completed / Blocked]

### Completed Items

- [item 1]
- [item 2]

### Files Modified

| File | Changes |
| ---- | ------- |

### Files Created

| File | Purpose |
| ---- | ------- |

### Test Results

- Unit tests: [pass/fail]
- Lint: [pass/fail]
- Build: [pass/fail]

---

_Report generated by Claude Code_
```

#### Step 2h: Update Status

Set to "In Review" if completed, "To Do" if partial, "Blocked" if external blockers.

#### Step 2i: Pause After Subtask

**ALWAYS wait for user confirmation before proceeding to next subtask.**

### Step 3: Final Summary

Present summary of all subtasks and their statuses.

## Verification Pipeline

When verification fails, delegate to appropriate agent:

| Failure Type  | Delegate To              |
| ------------- | ------------------------ |
| Lint errors   | shared-style-enforcer    |
| Type errors   | shared-logic-implementer |
| Test failures | shared-test-fixer        |
| Build errors  | shared-build-verifier    |

## Pause Points

| Pause Point          | When                  | What to Show           |
| -------------------- | --------------------- | ---------------------- |
| **3x3 Checkpoint**   | After every 3 changes | Summary + next steps   |
| **Subtask Complete** | After each subtask    | Summary + next subtask |
| **Task Complete**    | After all subtasks    | Final summary          |
| **Blocker Found**    | When dependency found | Blocker details        |

**Never proceed automatically** - always wait for explicit user confirmation.

## Guidelines

1. **Use `shared-tdd-developer` for ALL code** - TDD is mandatory (RED -> GREEN -> REFACTOR)
2. **Write comments in Polish** - all Implementation Reports in Polish
3. **Follow the 3x3 Rule** - pause every 3 changes
4. **Pause after each subtask** - wait for user confirmation
5. **Don't modify parent task status** - only subtask statuses
6. **Run tests before marking complete** - ensure tests pass
7. **Follow existing patterns** - match codebase conventions
8. **Ask for clarification** - if plan is unclear, ask before proceeding

---

**Important**: Always confirm with the user before starting implementation if there are any questions about the plan.
