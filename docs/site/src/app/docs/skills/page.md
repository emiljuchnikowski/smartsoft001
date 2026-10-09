---
title: Skills
section: Skills
order: 0
nextjs:
  metadata:
    title: Claude Code skills
    description: The smartsoft Claude Code plugins, smart-core, smart-angular and smart-react, what their hooks enforce, which skills you can invoke and which ones work in the background.
---

The framework ships three Claude Code plugins in the `smartsoft` marketplace, published as `@smartsoft001/claude-plugins`: `smart-core` adds safety hooks, an audit trail, auto-formatting and the framework-neutral skills, while `smart-angular` and `smart-react` teach Claude the components and CRUD screens of one frontend framework each. {% .lead %}

---

Start with [Installing the plugin](/docs/skills/installing-the-plugin). A project enables the plugin of its framework, `smart-angular` or `smart-react`, and gets `smart-core` with it as a dependency, so an Angular project never sees the React skills and the other way round. A project-scoped entry enables the plugins for the repository, but every developer still installs them on their own machine before their skills, agents and hooks are available.

## What you get

| Part                           | Plugin          | What it does                                                                                                                                                      |
| ------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hooks                          | `smart-core`    | Block destructive commands and sensitive files, log every action, format files after every edit. See [Installing the plugin](/docs/skills/installing-the-plugin). |
| User-invocable skills          | per plugin      | Commands you type as `/<plugin>:<name>`, for example `/smart-core:audit-log`; one page each below.                                                                |
| Background skills              | per plugin      | Knowledge Claude loads on its own when the topic comes up; no command to type.                                                                                    |
| The `angular-components` agent | `smart-angular` | Picks the right `@smartsoft001/angular` component and delegates to its skill. See [Angular components agent](/docs/skills/angular-components-agent).              |
| The `react-components` agent   | `smart-react`   | Picks the right `@smartsoft001/react` component or CRUD screen and delegates to its skill. See [React components agent](/docs/skills/react-components-agent).     |

## User-invocable skills

| Skill                                                         | Invocation                             | Purpose                                                               |
| ------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| [`audit-log`](/docs/skills/audit-log)                         | `/smart-core:audit-log`                | Summarise the audit trail the hooks write for a given day.            |
| [`format-code`](/docs/skills/format-code)                     | `/smart-core:format-code`              | Run the repository's Prettier and ESLint pipeline.                    |
| [`scaffold-nx-workspace`](/docs/skills/scaffold-nx-workspace) | `/smart-angular:scaffold-nx-workspace` | Bootstrap a new Nx + Angular SSR workspace in the framework's layout. |

## Background skills

These have `user-invocable: false` in their frontmatter. Claude reads them when a prompt matches their description; they are not slash commands.

| Skill                  | Plugin          | Subject                                                                                                                                               |
| ---------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project-conventions`  | `smart-core`    | The monorepo layout, naming and architecture rules Claude follows when it edits this repository.                                                      |
| `safety-check`         | `smart-core`    | The list of blocked commands and sensitive paths that `safety_validator` and `sensitive_file_blocker` enforce.                                        |
| `smart-crud`           | `smart-angular` | The `crud` family's Angular configuration API. Its content is documented for people in the [CRUD](/docs/crud/overview) section.                       |
| `angular-components-*` | `smart-angular` | 54 component skills, the source of the generated [Components](/docs/components) pages.                                                                |
| `smart-crud-react`     | `smart-react`   | The `crud` family's React screens, `@smartsoft001/crud-shell-react`.                                                                                  |
| `react-components-*`   | `smart-react`   | 59 component skills, one per `@smartsoft001/react` component, which the [`react-components` agent](/docs/skills/react-components-agent) delegates to. |
| `react-provider`       | `smart-react`   | `SmartProvider`: the component registry and presets, translations, navigation, services and model providers.                                          |
| `react-forms`          | `smart-react`   | The React form engine: controls, validators and forms built from model metadata.                                                                      |

## Where the plugin lives

The plugin source is `packages/shared/claude-plugins/src` in the repository: `.claude-plugin/marketplace.json` declares the `smartsoft` marketplace with the `smart-core`, `smart-angular` and `smart-react` plugins and renames the former `smart` plugin to `smart-angular`. Each plugin is a directory under `plugins/`: `plugins/smart-core` holds the hooks and the framework-neutral skills, `plugins/smart-angular` and `plugins/smart-react` hold the skills and agents of their framework. The same tree is published unchanged inside the npm package, which is how the marketplace is installed on a developer machine.
