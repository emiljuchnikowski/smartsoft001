---
title: Skills
section: Skills
order: 0
nextjs:
  metadata:
    title: Claude Code skills
    description: The smart@smartsoft plugin for Claude Code, what its hooks enforce, which skills you can invoke and which ones work in the background.
---

The framework ships a Claude Code plugin, `smart@smartsoft`, published as `@smartsoft001/claude-plugins`. It adds safety hooks, an audit trail, auto-formatting and a set of skills that teach Claude the framework's conventions. {% .lead %}

---

## What you get

| Part                           | What it does                                                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hooks                          | Block destructive commands and sensitive files, log every action, format files after every edit. See [Installing the plugin](/docs/skills/installing-the-plugin). |
| User-invocable skills          | Commands you type as `/smart:<name>`; one page each below.                                                                                                        |
| Background skills              | Knowledge Claude loads on its own when the topic comes up; no command to type.                                                                                    |
| The `angular-components` agent | Picks the right `@smartsoft001/angular` component and delegates to its skill. See [Angular components agent](/docs/skills/angular-components-agent).              |

## User-invocable skills

| Skill                                                         | Invocation                     | Purpose                                                               |
| ------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------- |
| [`audit-log`](/docs/skills/audit-log)                         | `/smart:audit-log`             | Summarise the audit trail the hooks write for a given day.            |
| [`format-code`](/docs/skills/format-code)                     | `/smart:format-code`           | Run the repository's Prettier and ESLint pipeline.                    |
| [`scaffold-nx-workspace`](/docs/skills/scaffold-nx-workspace) | `/smart:scaffold-nx-workspace` | Bootstrap a new Nx + Angular SSR workspace in the framework's layout. |

## Background skills

These have `user-invocable: false` in their frontmatter. Claude reads them when a prompt touches their subject.

| Skill                  | Subject                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `project-conventions`  | The monorepo layout, naming and architecture rules Claude follows when it edits this repository.                        |
| `safety-check`         | The list of blocked commands and sensitive paths that `safety_validator` and `sensitive_file_blocker` enforce.          |
| `smart-crud`           | The `crud` family's configuration API. Its content is documented for people in the [CRUD](/docs/crud/overview) section. |
| `angular-components-*` | One skill per UI component, the source of the [Components](/docs/components) pages.                                     |

## Where the plugin lives

The plugin source is `packages/shared/claude-plugins/src` in the repository: `.claude-plugin/marketplace.json` declares the `smartsoft` marketplace with the single `smart` plugin, and `plugins/smart` holds the hooks, skills and agents. The same tree is published unchanged inside the npm package, which is how the marketplace is installed on a developer machine.
