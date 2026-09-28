---
title: Angular components agent
section: Skills
order: 5
nextjs:
  metadata:
    title: Angular components agent
    description: The smart:angular-components agent that picks the right @smartsoft001/angular component for a UI task and delegates to that component's skill.
---

The plugin ships one agent, `smart:angular-components`, for building screens in an application that uses `@smartsoft001/angular`. It selects a component and delegates its API details to a background skill. {% .lead %}

---

## What it does

When a developer describes a piece of UI, the agent chooses a `smart-*` component and delegates to an `angular-components-<name>` skill for its API, options and usage pattern. The plugin contains 54 such background skills, and those skill files also feed the generated [Components](/docs/components) section of this site.

{% callout title="Current catalogue gap" %}
The agent definition explicitly delegates to 53 skills. It lists `<smart-icon>` without a skill even though `angular-components-icon` exists, and it still labels `button`, `card`, `page` and `paging` as base-only although their current skills document concrete wrappers and extension mechanisms. For those components, the component page or matching skill is more current than the agent's summary table.
{% /callout %}

## When to use it

Ask for it, or let Claude pick it, when you want to build a page or feature with the framework's components, choose between components for a requirement, get the exact imports and options for one of them, or extend a base class with a custom implementation.

## How it is invoked

The agent is available after you [install the plugin](/docs/skills/installing-the-plugin) and reload Claude Code. Claude can select it for matching UI work; you can also ask explicitly, for example "use the `smart:angular-components` agent to build the settings page". The target project needs `@smartsoft001/angular` (`npm install @smartsoft001/angular`), whose styling and import conventions are on the [`angular`](/docs/packages/angular) package page.

## Source

Defined in [`agents/angular-components/AGENT.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/agents/angular-components/AGENT.md), next to the `angular-components-*` skills it delegates to.
