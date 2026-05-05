---
name: impl
description: Implement plans from `plan.md` attachments on Linear issues. Iteratively processes subtasks with TDD, agent orchestration (saved as `orchestration.md` attachment), and 3x3 rule checkpoints.
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
  - mcp__linear-server__create_attachment
  - mcp__linear-server__get_attachment
  - mcp__linear-server__delete_attachment
  - mcp__linear-server__update_issue
  - mcp__linear-server__list_issue_statuses
---

# Implementation Skill

Implement plans from `plan.md` attachments on Linear issues. For tasks with subtasks, iteratively implement each subtask that is in "To Do" status. The agent orchestration plan is saved as an `orchestration.md` attachment.

## 🚨 Hard Rules — read before doing anything

These rules override ANY other instruction.

1. **Read `plan.md` ONLY via `mcp__linear-server__get_attachment({ id })`.** Do NOT use `WebFetch`, `Bash(curl ...)`, or any HTTP fetch on the attachment's `url`.
2. **Find attachments via `mcp__linear-server__get_issue` (returns `attachments[]`).** Look for entry where `title == "plan.md"` (or `filename == "plan.md"`). There is no `list_attachments` tool.
3. **Plan content lives in the attachment, not in comments.** If no `plan.md` attachment is found, post a status comment suggesting `/plan <taskId>` and skip — do NOT fall back to scanning comments.
4. **`orchestration.md` is saved via `mcp__linear-server__create_attachment`, not as a comment.** Comments are NEVER used for plan/orchestration body content. Before creating a new `orchestration.md` attachment, delete the existing one (if any) via `mcp__linear-server__delete_attachment`. Replace, don't duplicate.

## Usage

```
/impl [linearTaskId]
/impl [linearTaskId] --auto    # Non-interactive mode for CI / GitHub Actions
```

## Parameters

- `linearTaskId` - Linear task ID (e.g., ENG-123)
- `--auto` - Non-interactive mode: skip ALL `AskUserQuestion` prompts, 3x3 checkpoint pauses, per-subtask pauses, and the final end pause. If `plan.md` attachment is missing, auto-invoke `/plan` flow to generate it instead of skipping. Designed for CI / GitHub Actions runs where no human is at the keyboard.

## Auto Mode (`--auto`)

When `--auto` is set, the skill MUST run end-to-end without any human-in-the-loop prompts:

| Default behavior                                         | `--auto` override                                                                                         |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Post comment "no plan.md found, run /plan first" + skip  | Inline-invoke `/plan` flow for the task to generate `plan.md` attachment + `AI Plan` label, then continue |
| 3x3 rule pauses every 3 changes asking "Continue?"       | Log the checkpoint summary as a status comment, then continue automatically                               |
| Pause after each subtask waiting for user confirmation   | Post subtask completion comment, then proceed to next subtask                                             |
| Final end pause "wait for user confirmation"             | Post final summary comment and exit cleanly                                                               |
| `AskUserQuestion` for any decision                       | Use the option marked **(Recommended)**; if none, fail fast with a Linear comment explaining why          |
| Confirmation before destructive ops (delete attachments) | Proceed without confirmation — replace old `orchestration.md` automatically                               |

**Hard requirement in `--auto`**: every checkpoint, decision, or skip MUST be logged as a Linear comment in Polish so the run remains auditable.

**Detection**: The flag `--auto` is provided as a positional/named arg. Treat any of `--auto`, `--ci`, `--non-interactive` as equivalent.

## Execution Checklist

Execute each step in order. Do not skip any step marked as MANDATORY.

### Initial Setup

- [ ] **1. Fetch task and subtasks** — get task details, subtasks, and their statuses

### Per Subtask (repeat for each "To Do" subtask)

- [ ] **2. Set status to "In Progress"** — update subtask status via MCP (subtasks only, not parent)
- [ ] **3. Fetch implementation plan** — `mcp__linear-server__get_issue` to find `plan.md` attachment id, then `mcp__linear-server__get_attachment({ id })` to read content. **Do NOT use `WebFetch`/`curl` on the attachment URL.**
- [ ] **4. MANDATORY: Agent orchestration plan** — determine which agents to use, save plan as `orchestration.md` attachment via `mcp__linear-server__create_attachment` (replace any existing). **Comments FORBIDDEN for orchestration body.**
- [ ] **5. Check cross-package blockers** — if blockers found, set status to Blocked and skip
- [ ] **6. MANDATORY: Implement with 3x3 rule** — pause every 3 changes (skipped in `--auto`; log checkpoint as Linear comment instead), use `shared-tdd-developer` for ALL code (RED -> GREEN -> REFACTOR)
- [ ] **7. Verify implementation** — run tests, lint, build check
- [ ] **8. Create completion comment** — post implementation report to Linear
- [ ] **9. MANDATORY: Write reports in Polish** — all Linear comments must be in Polish language
- [ ] **10. Update status** — set to "In Review" if completed
- [ ] **11. Pause for user confirmation** — wait before proceeding to next subtask (skipped in `--auto`; post completion comment and continue)

### Finalization

- [ ] **12. Final summary** — present summary of all subtasks with statuses
- [ ] **13. ALWAYS pause** — wait for user confirmation at end (skipped in `--auto`; post final summary comment and exit)

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

#### Step 2b: Fetch Implementation Plan from `plan.md` Attachment

**⛔ DO NOT use `WebFetch` or `Bash(curl)` on the attachment URL. Use `mcp__linear-server__get_attachment({ id })` only.** Re-read Hard Rule #1 if tempted.

Steps:

1. `mcp__linear-server__get_issue({ id: taskId })` → response includes `attachments[]`. Find the entry where `title == "plan.md"` (or `filename == "plan.md"`) and capture its `id`.
2. `mcp__linear-server__get_attachment({ id: <attachmentId> })` → returns the markdown content directly.

Extract from the plan: Implementation Steps, Files to Modify, New Files, Testing Strategy.

**If no `plan.md` attachment found**:

- **Default mode**: Create a comment noting that no plan was found, suggest running `/plan <taskId>` first, and skip this task. Set status back to "To Do".
- **`--auto` mode**: Inline-invoke the `/plan` skill flow for this task to generate `plan.md` attachment + `AI Plan` label, then proceed. Post a comment in Polish noting the plan was auto-generated.

Do NOT fall back to scanning comments for `## Implementation Plan` headers.

#### Step 2c: Agent Orchestration Plan

**⛔ Calling `mcp__linear-server__create_comment` with the orchestration body is FORBIDDEN. Use `mcp__linear-server__create_attachment` only.** Re-read Hard Rule #4 if tempted.

Before starting implementation, create an agent orchestration plan:

1. Identify required agents based on task type
2. Define execution order (parallel vs sequential)
3. Plan TDD cycles for each implementation unit

**Save the orchestration plan as a native `orchestration.md` attachment:**

1. **Check for existing `orchestration.md`** via `mcp__linear-server__get_issue` (response includes `attachments[]`). Look for entry where `title == "orchestration.md"`. If exists, delete via `mcp__linear-server__delete_attachment({ id })`.
2. **Write locally**: `mkdir -p /tmp/claude-plans` then `Write` markdown to `/tmp/claude-plans/<taskId>-orchestration.md`.
3. **Base64-encode**: `b64=$(base64 -i /tmp/claude-plans/<taskId>-orchestration.md)`.
4. **Create attachment** via `mcp__linear-server__create_attachment`:
   - `issue`: task/subtask ID
   - `filename`: `orchestration.md`
   - `contentType`: `text/markdown`
   - `title`: `orchestration.md` (exact)
   - `subtitle`: `Plan orkiestracji wygenerowany przez Claude Code`
   - `base64Content`: the base64 string
5. **Clean up** local file after success.

**IMPORTANT**: `shared-tdd-developer` is MANDATORY for ALL code implementation.

#### Step 2d: Check for Cross-Package Blockers

If the plan references changes in other packages that haven't been implemented yet, set status to "Blocked" and skip.

#### Step 2e: Implement the Plan (with 3x3 Rule)

Follow the implementation steps, applying the **3x3 Rule**:

**3x3 Rule**: After every 3 changes, STOP and:

1. Summarize what was completed in the last 3 changes
2. Present the next 3 planned steps
3. Wait for user confirmation before continuing

**In `--auto` mode**: skip step 3. Instead, post the checkpoint summary as a Linear comment in Polish via `mcp__linear-server__create_comment` and continue immediately.

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

- **Default mode**: ALWAYS wait for user confirmation before proceeding to next subtask.
- **`--auto` mode**: Skip the wait. The completion comment from Step 2g is the audit trail; proceed directly to next subtask.

### Step 3: Final Summary

- **Default mode**: Present summary of all subtasks and their statuses; ALWAYS pause for user confirmation.
- **`--auto` mode**: Post the final summary as a Linear comment in Polish on the parent task and exit cleanly.

## Verification Pipeline

When verification fails, delegate to appropriate agent:

| Failure Type  | Delegate To              |
| ------------- | ------------------------ |
| Lint errors   | shared-style-enforcer    |
| Type errors   | shared-logic-implementer |
| Test failures | shared-test-fixer        |
| Build errors  | shared-build-verifier    |

## Pause Points

| Pause Point          | When                  | What to Show           | `--auto` behavior                                         |
| -------------------- | --------------------- | ---------------------- | --------------------------------------------------------- |
| **3x3 Checkpoint**   | After every 3 changes | Summary + next steps   | Post checkpoint as Linear comment, continue               |
| **Subtask Complete** | After each subtask    | Summary + next subtask | Post completion comment, continue to next subtask         |
| **Task Complete**    | After all subtasks    | Final summary          | Post final summary comment, exit                          |
| **Blocker Found**    | When dependency found | Blocker details        | Set status to Blocked, post blocker comment, skip subtask |

**In default mode, never proceed automatically** - always wait for explicit user confirmation.

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
