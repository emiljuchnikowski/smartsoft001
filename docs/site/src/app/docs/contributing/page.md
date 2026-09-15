---
title: Contributing
section: Contributing
order: 0
nextjs:
  metadata:
    title: Contributing
    description: How work flows through the smartsoft001 repository, the conventions every change follows, the agents that do the work and how the documentation stays in sync.
---

Changes to the framework go through a Linear-driven workflow run by Claude Code skills, follow one set of conventions checked by hooks and CI, and update this documentation from executed code. These pages explain each part. {% .lead %}

---

| Page                                              | What it covers                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Workflow](/docs/contributing/workflow)           | The `/plan` → `/impl` → `/commit` → `/push` → `/review` skills and what each writes to Linear and git. |
| [Conventions](/docs/contributing/conventions)     | Repository layout, project tags, commit messages, git hooks and testing conventions.                   |
| [Agents](/docs/contributing/agents)               | The `shared-*`, `angular-*` and `nestjs-*` agents that Claude delegates to.                            |
| [Documentation](/docs/contributing/documentation) | How to add a package, component or skill page, the snippet conventions and the `docs-check` rules.     |

## Before you start

- Fork or clone [`emiljuchnikowski/smartsoft001`](https://github.com/emiljuchnikowski/smartsoft001), run `npm install` and open the repository in Claude Code with the [`smart` plugin](/docs/skills/installing-the-plugin) enabled; the repository's `.claude/settings.json` already lists it.
- Every task starts as a Linear issue in the **Framework** team. The workflow skills read and update that issue, so a change without an issue has nowhere to record its plan or its review.
- Work on a branch named after the issue (`emil/fra-123-short-title`) and open pull requests against `main` only; the pull request pipeline runs only for that base.
