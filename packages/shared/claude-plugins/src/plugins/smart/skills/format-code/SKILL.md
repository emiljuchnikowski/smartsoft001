---
name: format-code
description: Format and lint the codebase using Nx
user-invocable: true
allowed-tools: Bash
---

# Format Code

Run the project's formatting and linting pipeline.

## Purpose

Execute the standard formatting command (`npm run format`) which runs Nx format and lint with auto-fix across the monorepo.

## When to Use

Use `/smart:format-code` when you need to:

- Format code after making changes across multiple files
- Fix lint issues before committing
- Ensure consistent code style across the monorepo

## Prerequisites

- **Node.js 24** via nvm (the project requires Node 24 for formatting tools)
- nvm must be installed and configured at `~/.nvm/nvm.sh`

## Instructions

Run the following command:

```bash
source ~/.nvm/nvm.sh && nvm use 24 && npm run format
```

This executes:

1. `nx format` — Prettier formatting via Nx
2. `nx run-many -t lint --fix` — ESLint auto-fix across all projects

## Notes

- The command may take a few minutes on large changesets
- If nvm is not available, try running `npm run format` directly
- Formatting follows the project's ESLint flat config (`eslint.config.mjs`) and Prettier settings
