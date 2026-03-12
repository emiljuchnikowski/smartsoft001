---
name: push
description: Push local changes to remote repository, update Linear task status, and optionally create pull requests for feature branches.
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
  - mcp__linear-server__list_issues
  - mcp__linear-server__list_comments
  - mcp__linear-server__create_comment
  - mcp__linear-server__update_issue
  - mcp__linear-server__list_issue_statuses
---

# Push Skill

Push local changes to remote and optionally update Linear task status.

## Usage

```
/push [linearTaskId]
```

## Parameters

- `linearTaskId` - Linear task ID (e.g., ENG-123)

## Execution Checklist

Execute each step in order. Do not skip any step marked as MANDATORY.

### Pre-Push

- [ ] **1. Check git status** — verify branch, commits ahead, warn about uncommitted changes
- [ ] **2. Get commits to push** — `git log origin/<branch>..HEAD --oneline`; exit if none
- [ ] **3. Fetch Linear task** — get title, status, subtasks and their statuses via MCP
- [ ] **4. Analyze subtasks** — classify completed vs incomplete, find reasons for incomplete ones
- [ ] **5. MANDATORY: Show summary to user** — present commits + subtask status, ask about status change
- [ ] **6. Update Linear status** — BEFORE push: set completed subtasks to "In Review", post summary comment in Polish
- [ ] **7. MANDATORY: Write Linear comments in Polish** — all comments must be in Polish language

### Push

- [ ] **8. Push to remote** — `git push`; handle errors gracefully

### Post-Push

#### If `main` branch:

- [ ] **9a. Monitor CI pipeline** — poll `gh run view` until completion
- [ ] **10a. Handle CI failure** — revert task to "To Do", post error comment to Linear

#### If feature branch:

- [ ] **9b. Check for existing PR** — `gh pr list --head <branch> --base main`
- [ ] **10b. Ask about PR creation** — if no PR exists and subtasks are ready
- [ ] **11b. Create PR** — `gh pr create` with structured summary

### Final

- [ ] **12. Show final status** — complete summary of all actions taken

### Task Progress Tracking

**MANDATORY**: Use Claude Code's built-in task tracking.

**Task naming convention**: `<linearTaskId> <step description>`

## Instructions

### Step 1: Check Git Status

Run `git status` to verify: branch name, commits ahead of remote, uncommitted changes.

### Step 2: Get Commits to Push

```bash
git log origin/<branch>..HEAD --oneline
```

If no commits, inform user and exit.

### Step 3: Fetch Linear Task Details

Use MCP Linear server to fetch: title, status, subtasks and their statuses.

### Step 4: Analyze Subtasks Status

Classify completed vs incomplete subtasks. Find reasons for incomplete ones.

### Step 5: Show Summary

```markdown
## Podsumowanie

### Commity do wyslania (X)

| Commit  | Opis                     |
| ------- | ------------------------ |
| abc1234 | feat(scope): description |

### Podzadania

#### Zrealizowane

- MOB-549: Description

#### Niezrealizowane

- MOB-554: Description -> Reason

---

Czy przeniesc task do "In Review" i wyslac zmiany?
```

Use `AskUserQuestion` with options:

- "Tak, przeniesc do In Review i wyslij" (Recommended)
- "Tylko wyslij, bez zmiany statusu"
- "Anuluj"

### Step 6: Update Linear Status (if confirmed)

**BEFORE pushing**, update completed subtasks to "In Review" and post summary comment in Polish.

### Step 7: Push to Remote

Execute `git push`. Handle errors gracefully.

### Step 8: Branch-Specific Post-Push

#### If `main` branch:

Monitor CI pipeline via `gh run list` / `gh run view`.

**If CI fails**: Revert task to "To Do", post error comment to Linear.

#### If feature branch:

1. Check if PR exists: `gh pr list --head <branch> --base main`
2. If no PR, ask user about creating one
3. Create PR with structured summary:

```bash
gh pr create --base main --head <branch> --title "<Linear-ID>: <Task Title>" --body "$(cat <<'EOF'
## Summary

Implementation for [<Linear-ID>](https://linear.app/issue/<Linear-ID>)

### Completed Subtasks
- <subtask-id>: <title>

### Commits
| Commit | Description |
|--------|-------------|

---
Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 9: Final Status

Show complete summary of all actions taken.

## Guidelines

1. **Write comments in Polish** - all Linear comments in Polish
2. **Always confirm before status change** - never change status without user confirmation
3. **Update Linear BEFORE push** - status change happens before git push
4. **Handle errors gracefully** - if push fails after status update, inform user
5. **Warn about uncommitted changes** - don't push without user acknowledgment
6. **Document incomplete subtasks** - always explain WHY a subtask wasn't completed
7. **Revert on CI failure** - move task back to "To Do" and add error comment
8. **Branch-specific actions**:
   - `main` branch: CI monitoring
   - Feature branch: Check/create PR to `main`

---

**Important**: Always confirm with the user before pushing changes.
