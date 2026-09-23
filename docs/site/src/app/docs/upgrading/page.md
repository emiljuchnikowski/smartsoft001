---
title: Upgrading
section: Getting started
order: 5
nextjs:
  metadata:
    title: Upgrading
    description: How to move a project to a newer version of the framework, what the migrations do for you and what is left to check by hand.
---

Every `@smartsoft001/*` package is released at the same version, so a project moves the whole set at once. Two commands do it: one fetches the new versions, the other runs whatever the release needs done to your code. {% .lead %}

---

## The two commands

```bash
npx nx migrate @smartsoft001/core@latest
npx nx migrate --run-migrations
```

The first rewrites the versions in `package.json`, installs them and writes a `migrations.json` in the project root listing what the release wants to change. The second runs those changes and deletes the file. Review the diff between the two commands, as with any other `nx migrate`.

`@smartsoft001/core` is the package to name because it carries the migrations, and every stack depends on it, so a project that installed a stack already has it. The migrations cover the whole family: they are written against what a project's code looks like, not against one package.

{% callout type="warning" title="A project that installs packages one by one" %}
`nx migrate` can only migrate a package the project depends on. A project that lists the libraries individually has no `@smartsoft001/core`, and the command answers `No packages to migrate` without doing anything. Add it once:

```bash
npm install @smartsoft001/core@latest
```

The first migration then folds those individual entries into the stack that covers them, and every release after that works with the two commands above.
{% /callout %}

{% callout title="A project without Nx" %}
`ng update @smartsoft001/core` reads the same file and runs the same migrations through the Angular CLI. A project with neither reads [what each release changed](https://github.com/emiljuchnikowski/smartsoft001/blob/main/CHANGELOG.md) and applies it by hand; the migrations are plain TypeScript and their source is in the package, under `src/migrations`.
{% /callout %}

## What a migration can do

A release ships two kinds, and `nx migrate` runs both:

- **Mechanical changes** are code: a script that walks the project and rewrites what moved. A renamed export, a changed option name, a package that split in two. These are deterministic and you can read exactly what they did in the diff.
- **Changes that need judgement** are a description rather than a script. Nx hands the description to a coding agent when you run the migrations with `--agentic`, and it works through the project the way a person would. This is for the cases a script cannot express: an option whose meaning changed, a pattern replaced by a different pattern.

Without `--agentic`, the second kind is listed and skipped, so nothing happens behind your back. What it would have changed is in the release notes.

## After the migration

Run the project's own checks. The framework's packages are peer dependencies of your application, so a migration that leaves something behind shows up as a type error or a failing test rather than at runtime:

```bash
npx nx run-many -t lint test build
```

If a migration did something you did not want, the change is in your working tree and nowhere else: `git checkout` the file and the release notes tell you what it was trying to do.

## Staying on one version

The packages are pinned to each other exactly, so a project cannot end up with two of them on different versions through the stacks. If you install packages individually, keep them in lockstep: [`angular-stack`](/docs/packages/angular-stack) and its siblings exist to make that automatic.
