---
title: scaffold-nx-workspace
section: Skills
order: 4
skill: scaffold-nx-workspace
nextjs:
  metadata:
    title: /smart:scaffold-nx-workspace
    description: Bootstrap a new Nx and Angular SSR workspace in the framework's layout, with the toolchain patched to its conventions and no feature code.
---

{% skill name="scaffold-nx-workspace" /%}

## What it does

Creates a new Nx monorepo the way the framework's own projects are laid out: it wraps `create-nx-workspace`, then patches the generated configuration to the conventions below. The result is a buildable empty shell with one Angular SSR application (`apps/web`) and one shared library (`libs/shared/angular`), ready for feature modules to be added later. It deliberately stops there: no feature libraries, no feature packages, no components tied to a module.

The conventions it enforces:

- npm, Nx and an Angular SSR app built with `@angular/build:application` in `outputMode: server`; Jest with the zoneless `jest-preset-angular` environment for unit tests and Playwright for end-to-end tests.
- Cached `build`, `lint` and `jest` targets and a `defaultBase` for `nx affected`; no Nx Cloud binding.
- ESLint flat config with `import/order` and a path group for the workspace prefix, Prettier with single quotes, husky and commitlint with scopes derived from `libs/`.
- `apps/` and `libs/` layout, the shared library aliased as `@<prefix>/angular`, SCSS everywhere.
- An `EnvironmentService`, an `/env.js` endpoint and an `env-init.ts` imported first in `main.server.ts`, so the SSR runtime reads its environment at start.

## When to use it

- Starting a new project that will consume `@smartsoft001/*` packages and should look like the reference workspace.
- When someone asks for the base Nx configuration without any modules.

Not for adding a feature library to an existing workspace, for changing lint or format settings (use [`format-code`](/docs/skills/format-code)), or for component questions (use the [Components](/docs/components) pages).

## Invocation and inputs

```text
/smart:scaffold-nx-workspace
```

The skill asks before every decision that shapes the workspace:

1. **Angular version.** It reads the version `@smartsoft001/angular` targets from npm and proposes it; you confirm or type another. Nx and Node are derived from it (Nx major = Angular major + 1, Node = an LTS the Angular release supports). Nothing else is pinned.
2. **Workspace prefix.** A candidate derived from the target folder name, used in tsconfig paths, ESLint, imports and package names.
3. **Base branch** for `nx affected` and the husky pre-push hook (default `origin/development`).
4. **`npm install`**, which it only runs after asking.

Prerequisites: nvm with npm, and an empty target directory.

## What it produces

A directory with the workspace configuration (Nx, tsconfig, ESLint, Jest, Prettier, husky, commitlint, `.nvmrc`), the `apps/web` SSR shell, the `libs/shared/angular` skeleton, a `.claude` baseline for Claude Code and the toolchain dependencies in `package.json`. The last step runs the skill's own verification script and fixes what it reports until the workspace builds.

## Source

Defined in [`skills/scaffold-nx-workspace/SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/skills/scaffold-nx-workspace/SKILL.md), with the patch recipes in its `references/` directory and the helper scripts in `scripts/`, all shipped inside the plugin.
