# Base `.claude` config

Seed the **generic** baseline only. Drop `flow@mobilems` and all project-specific
permissions/MCP allow-lists from the reference. Substitute `<WORKSPACE_NAME>`.

---

## `.claude/settings.json` (create)

The smart-plugin hooks resolve from `node_modules/@smartsoft001/claude-plugins/...`
(added to devDeps in `patch-delta.md`).

```json
{
  "permissions": {
    "allow": [
      "Bash(nx:*)",
      "Bash(npx nx:*)",
      "Bash(npm run format:*)",
      "Bash(source:*)",
      "Bash(nvm use:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git show:*)",
      "Bash(git add:*)",
      "Bash(git fetch:*)",
      "Bash(ls:*)",
      "Bash(find:*)",
      "Bash(grep:*)"
    ],
    "deny": [],
    "ask": ["Bash(git commit:*)", "Bash(git push:*)", "Bash(gh pr create:*)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/safety_validator.py"
          }
        ]
      },
      {
        "matcher": "Read|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(jq -r '.tool_input.file_path // empty'); echo \"$FILE\" | grep -qE '(\\.env|secrets|credentials)' && { echo \"BLOCKED: Access denied to sensitive file: $FILE\" >&2; exit 2; } || exit 0"
          }
        ]
      },
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/audit_logger.py"
          }
        ]
      },
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/skill_validator.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "source ~/.nvm/nvm.sh && nvm use 24 && npm run format"
          }
        ]
      },
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/audit_logger.py"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/audit_logger.py"
          }
        ]
      }
    ]
  },
  "enabledPlugins": {
    "smart@smartsoft": true,
    "nx@nx-claude-plugins": true
  },
  "extraKnownMarketplaces": {
    "nx-claude-plugins": {
      "source": {
        "source": "github",
        "repo": "nrwl/nx-ai-agents-config"
      }
    }
  },
  "env": {
    "CLAUDE_CODE_FORK_SUBAGENT": "1",
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

> The mobilems module skills (the `flow@mobilems` plugin) are added to `enabledPlugins`
> and the project-specific permissions are grown when those skills run — not here.

---

## `AGENTS.md` (create — generic Nx block, verbatim-usable)

```md
<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `npm exec nx build`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
```

---

## `CLAUDE.md` (create — trimmed generic skeleton)

```md
# CLAUDE.md

Guidance for Claude Code when working in the **<WORKSPACE_NAME>** workspace.

## Project Overview

Nx + Angular SSR monorepo scaffolded with the smartsoft `scaffold-nx-workspace` skill.
A base shell only — feature modules are added by the mobilems module skills.

## Structure

- `apps/web` — Angular SSR app (Express server + runtime-env).
- `libs/shared/angular` — shared library (`@<PREFIX>/angular`).

## Conventions

- **Node** per `.nvmrc` via nvm; npm package manager.
- Run tasks through Nx: `nx build`, `nx test`, `nx lint`, `nx serve web`.
- Format with `/smart:format-code` (Prettier + ESLint flat config, `eslint.config.mjs`).
- Conventional commits (commitlint); husky pre-push runs affected lint/test/build.
- For smartsoft conventions, see the `/smart:project-conventions` skill.

## Boundaries

- Styling defaults to **scss** everywhere (app, libs, and components).
- Do not add feature npm packages or feature modules by hand — use the module skills.
```
