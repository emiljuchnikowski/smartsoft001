---
title: format-code
section: Skills
order: 3
skill: format-code
nextjs:
  metadata:
    title: /smart:format-code
    description: Run the repository's Prettier and ESLint auto-fix pipeline through Nx from inside Claude Code.
---

{% skill name="format-code" /%}

## What it does

Runs the project's formatting command, `npm run format`, which executes `nx format` (Prettier through Nx) and then `nx run-many -t lint --fix` (ESLint auto-fix in every project). The result is the same formatting the `commit-msg` hook and the pull request pipeline expect, so a change that passes here passes `nx format:check` in CI.

## When to use it

- After a change that touched many files, to format everything in one go instead of relying on the per-file `auto_format.sh` hook.
- Before committing, to clear lint findings that ESLint can fix on its own.
- When a pull request fails the format check.

## Invocation and arguments

```text
/smart:format-code
```

The skill takes no arguments. It switches to the Node version the formatting tools need through nvm (`source ~/.nvm/nvm.sh && nvm use 24`) before running the command; when nvm is not installed it falls back to running `npm run format` with the current Node.

## What it produces

Formatted files in the working tree and a summary of what ESLint fixed. On a large change set the run takes a few minutes, because every project is linted. Findings ESLint cannot fix automatically are reported and left for you.

## Source

Defined in [`skills/format-code/SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/skills/format-code/SKILL.md). The pipeline itself is the `format` script of the root `package.json`, configured by `eslint.config.mjs` and `.prettierrc`.
