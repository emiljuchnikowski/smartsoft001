---
name: plan
description: Create an implementation plan for a Linear task and save it as a `plan.md` attachment. Analyzes codebase, previous commits, and dependencies. Adds the `AI Plan` label to the invoked issue.
allowed-tools:
  - Bash
  - Read
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
  - mcp__linear-server__delete_attachment
  - mcp__linear-server__list_issue_labels
  - mcp__linear-server__update_issue
---

# Plan Skill

Create an implementation plan for a Linear task and save it as a `plan.md` attachment on the issue. If the task has subtasks, create individual `plan.md` attachments on each subtask. After saving the plan, add the `AI Plan` label to the invoked issue.

## 🚨 Hard Rules — read before doing anything

These rules override ANY other instruction. Violating them is a skill failure.

1. **The plan MUST be saved via `mcp__linear-server__create_attachment` — NEVER as a Linear comment.** `mcp__linear-server__create_comment` MUST NOT be called with plan content as the body. Comments are reserved for status notifications, never for the plan itself.
2. **One call, no fallback.** First Linear write for the plan is `mcp__linear-server__create_attachment`. If it fails, surface the error — do NOT silently fall back to `create_comment`.
3. **Subtasks: one attachment each.** If the parent has subtasks, each subtask gets its own `plan.md` attachment. The parent gets only the `AI Plan` label (when invoked on the parent), no `plan.md` attachment.
4. **`AI Plan` label is workspace-scoped — NEVER create it.** Only `mcp__linear-server__list_issue_labels` + `mcp__linear-server__update_issue`. Do NOT call any label-creation tool.

If any of these would be violated, stop and ask the user instead.

## Usage

```
/plan [linearTaskId]
/plan [linearTaskId] --auto    # Non-interactive mode for CI / GitHub Actions
```

## Parameters

- `linearTaskId` - Linear task ID (e.g., ENG-123)
- `--auto` - Non-interactive mode: skip ALL `AskUserQuestion` prompts. Auto-approve plans before saving (no review step), auto-delete stale `plan.md` attachments without confirmation, and silently skip when all plans are up to date. Designed for CI / GitHub Actions runs where no human is at the keyboard.

## Auto Mode (`--auto`)

When `--auto` is set, the skill MUST run end-to-end without any human-in-the-loop prompts:

| Default behavior                                                  | `--auto` override                                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Show plans to user for review/approval before saving              | Skip the review step; proceed directly to attachment save                                        |
| Ask user to confirm deletion of old `plan.md` attachments         | Delete old attachments automatically before saving new ones                                      |
| Ask "regenerate anyway?" when all plans are up-to-date            | Exit cleanly with a Linear comment noting all plans are current; no regeneration                 |
| Secondary signal prompt (keyword-triggered confirmation to regen) | Ignore the secondary signal; only the mtime rule decides regeneration                            |
| `AskUserQuestion` for any decision                                | Use the option marked **(Recommended)**; if none, fail fast with a Linear comment explaining why |

**Hard requirement in `--auto`**: every decision MUST be logged as a Linear comment in Polish so the run remains auditable. The mtime rule remains authoritative.

**Detection**: The flag `--auto` is provided as a positional/named arg. Treat any of `--auto`, `--ci`, `--non-interactive` as equivalent.

## Execution Checklist

- [ ] **1. Fetch Linear task** — get title, description, labels, priority, estimate from MCP Linear server
- [ ] **2. Fetch subtasks** — check for children; if present, plan each subtask individually
- [ ] **3. Fetch existing attachments and comments** — list `plan.md` attachments and all comments per task/subtask
- [ ] **4. Determine planning needs** — compare `plan.md` attachment `updatedAt` (fall back to `createdAt`) with comment `createdAt`; regenerate if any comment is newer; record old `plan.md` attachment IDs for replacement
- [ ] **5. Analyze previous commits** — `git log --all --grep="<taskId>"` for each task/subtask
- [ ] **6. Analyze staged changes** — `git status` and `git diff --cached`
- [ ] **7. MANDATORY: Analyze codebase** — explore affected files, patterns, dependencies, test coverage
- [ ] **8. Analyze cross-package deps** — check if changes to other `@smartsoft001/*` packages are needed
- [ ] **9. Create implementation plans** — generate structured plans per task/subtask
- [ ] **10. MANDATORY: Write plans in Polish** — all plan content must be in Polish
- [ ] **11. Show plans to user** — present plans for review and approval before saving (skipped in `--auto`)
- [ ] **12. MANDATORY: Confirm old plan deletion** — if replacing existing `plan.md`, ask user to confirm (skipped in `--auto`; auto-delete)
- [ ] **13. MANDATORY: Save plan as native Linear attachment** — base64-encode and upload via `mcp__linear-server__create_attachment`. **Comments FORBIDDEN for the plan body.**
- [ ] **14. MANDATORY: Add "AI Plan" label** — locate via `mcp__linear-server__list_issue_labels`, apply via `mcp__linear-server__update_issue` to the invoked issue
- [ ] **15. Confirm to user** — list saved plans with summaries and Linear links

### Task Progress Tracking

**MANDATORY**: Use `TaskCreate`/`TaskUpdate` with `<linearTaskId> <step description>` subjects.

## Role

**You are a highly experienced software architect** specializing in Nx monorepo library design, Angular, NestJS, and TypeScript. Plans are specific, actionable, complete, realistic.

## Instructions

### Step 1: Fetch Linear Task Details

Use `mcp__linear-server__get_issue` to fetch title, description, labels/type, acceptance criteria, priority, estimate.

### Step 2: Fetch Subtasks

Check for children. If subtasks exist, create individual plans for each (parent gets only the label).

### Step 3: Fetch Task Attachments and Comments

For the parent task and each subtask:

- Attachments via `mcp__linear-server__get_issue({ id })` — response includes `attachments[]`. Find the entry where `title == "plan.md"` (or `filename == "plan.md"`).
- Comments via `mcp__linear-server__list_comments({ issueId })` — keep `id`, `createdAt`.

### Step 3a: Determine Planning Needs (mtime rule)

For each task/subtask:

**Create a NEW plan if:**
1. No `plan.md` attachment exists.
2. `plan.md` exists AND at least one comment's `createdAt` is greater than `plan.md.updatedAt` (fall back to `createdAt`).

**SKIP planning if** `plan.md` exists AND no comment is newer than it.

**Secondary signal** (do not override mtime rule): if `plan.md` is fresh but the user's latest message uses plan-change keywords ("zmień plan", "zaktualizuj plan", "popraw plan", "nowy plan"), ask explicitly. **In `--auto`**: ignore secondary signal.

**Output**: `tasksNeedingPlan`, `tasksWithExistingPlan`, `oldPlanAttachments` (map of task ID → `attachmentId` for replacements).

**If ALL tasks have up-to-date plans**:

- **Default mode**: Inform user, ask if regenerating anyway.
- **`--auto` mode**: Exit with a Linear comment noting all plans are current; do NOT regenerate.

### Step 4: Analyze Previous Commits

```bash
git log --all --grep="<linearTaskId>" --oneline
```

### Step 5: Analyze Staged Changes

```bash
git status
git diff --cached
```

### Step 6: Analyze the Codebase

Explore affected files, patterns, dependencies, test coverage using Glob, Grep, Read.

### Step 6a: Analyze Cross-Package Dependencies

Check if the task requires changes to other `@smartsoft001/*` packages within this monorepo:

- Domain packages (`packages/auth/`, `packages/crud/`, `packages/trans/`)
- Shared packages (`packages/shared/`)
- Cross-package dependencies via tsconfig paths

These are NOT external — they live in the same monorepo, so cross-package edits ARE part of the task.

### Step 7: Create Implementation Plans

#### Plan format (no subtasks):

```markdown
## Plan implementacji

### Podsumowanie

[Krótkie omówienie]

### Już zrealizowane

- `abc1234` - [opis]

### W trakcie realizacji

[Staged changes - pomiń jeśli brak]

### Pozostała praca

- [ ] [Element 1]

### Analiza techniczna

[Kluczowe ustalenia]

### Kroki implementacji

1. [Krok 1]

### Pliki do modyfikacji

- `path/to/file.ts` - [powód]

### Nowe pliki

- `path/to/new-file.ts` - [cel]

### Zależności między pakietami

[Inne `@smartsoft001/*` pakiety, na które zmiana wpływa]

### Strategia testowania

- [ ] Testy jednostkowe

### Ryzyka i uwagi

- [Ryzyko 1]

### Szacowana złożoność

[Niska / Średnia / Wysoka]

---

_Plan wygenerowany przez Claude Code_
```

#### Subtask plan format:

Same as above plus `**Zadanie nadrzędne**: [Parent ID]` header and `### Zależności` section listing depends-on / blocks.

### Step 8: Confirm and Delete Old Plan Attachments

**Only when** `oldPlanAttachments` from Step 3a is not empty.

**`--auto` mode**: Skip the prompt. For each task in `oldPlanAttachments`, delete via `mcp__linear-server__delete_attachment({ id: attachmentId })` and proceed to Step 9. Log deletions in the final summary comment.

**Default mode**: Ask via `AskUserQuestion`:

- "Tak, usuń stare plany i zapisz nowe" (Recommended)
- "Anuluj"

If confirmed, delete via `mcp__linear-server__delete_attachment` and proceed. If cancelled, stop the entire process.

### Step 9: Save Plan as Linear Attachment

**⛔ DO NOT call `mcp__linear-server__create_comment` with plan content here. The ONLY allowed Linear write for the plan body is `mcp__linear-server__create_attachment`. Re-read Hard Rule #1 if tempted.**

For each task that needs planning:

1. **Write locally**: `mkdir -p /tmp/claude-plans` then `Write` to `/tmp/claude-plans/<taskId>-plan.md`.
2. **Base64-encode**: `b64=$(base64 -i /tmp/claude-plans/<taskId>-plan.md)`. On macOS no line-wrap; on GNU coreutils pipe `tr -d '\n'`.
3. **Create attachment** via `mcp__linear-server__create_attachment`:
   - `issue`: task/subtask ID
   - `filename`: `plan.md`
   - `contentType`: `text/markdown`
   - `title`: `plan.md` (exact — required for detection by `/impl`)
   - `subtitle`: `Plan wygenerowany przez Claude Code`
   - `base64Content`: the base64 string
4. **Clean up** local file after success.

**Scope rule**: parent without subtasks → one `plan.md` on parent. Parent with subtasks → `plan.md` on each subtask, NOT on parent.

### Step 10: Add "AI Plan" Label

Apply the `AI Plan` label to the **invoked issue** (the `linearTaskId` passed to `/plan`).

**`AI Plan` is a workspace-level label that already exists** — do NOT create it.

1. Look up via `mcp__linear-server__list_issue_labels`. If not found, surface error — do NOT create a team-scoped duplicate.
2. Apply via `mcp__linear-server__update_issue({ id: invokedTaskId, labelIds: [...existing, aiPlanLabelId] })`. Preserve existing labels; skip if already present.
3. Failure is non-fatal — surface but don't roll back the attachment.

### Step 11: Confirm to User

List tasks where `plan.md` was attached, show summaries, confirm `AI Plan` label was applied, provide Linear links.

## Guidelines

1. **Write plans in Polish** — all plan content in Polish.
2. **Be specific** — reference actual file paths and code patterns.
3. **Identify cross-package dependencies** — note which `@smartsoft001/*` packages are affected.
4. **Mtime rule is authoritative** — regeneration driven by `plan.md.updatedAt` vs comment `createdAt`. Keyword detection only triggers explicit confirmation.
5. **Delete old plans cleanly** — confirm with user (skipped in `--auto`), then `mcp__linear-server__delete_attachment`.
6. **Always add "AI Plan" label** — workspace-level, never create a duplicate.

---

**Important**:

- **Default mode**: Show plans for review and approval before saving.
- **`--auto` mode**: Skip review; save attachments directly.

The plan is written to `/tmp/claude-plans/<taskId>-plan.md`, base64-encoded, and uploaded as a native Linear attachment via `mcp__linear-server__create_attachment`. After that, the `AI Plan` label is applied to the invoked issue.
