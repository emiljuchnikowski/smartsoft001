---
title: Angular components agent
section: Skills
order: 5
nextjs:
  metadata:
    title: Angular components agent
    description: The smart-angular:angular-components agent that picks the right @smartsoft001/angular component for a UI task and delegates to that component's skill.
---

The `smart-angular` plugin ships the `smart-angular:angular-components` agent for building screens in an application that uses `@smartsoft001/angular`. It selects a component and delegates its API details to a background skill. {% .lead %}

---

## What it does

When a developer describes a piece of UI, the agent chooses a `smart-*` component and delegates to an `angular-components-<name>` skill for its API, options and usage pattern. The plugin contains 54 such background skills, one per component, and the agent's catalogue names every one of them (docs-check fails when it doesn't). The same skill files feed the generated [Components](/docs/components) section of this site.

## When to use it

Ask for it, or let Claude pick it, when you want to build a page or feature with the framework's components, choose between components for a requirement, get the exact imports and options for one of them, or extend a base class with a custom implementation.

## How it is invoked

The agent is available after you [install the `smart-angular@smartsoft` plugin](/docs/skills/installing-the-plugin) and reload Claude Code. Claude can select it for matching UI work; you can also ask explicitly, for example "use the `smart-angular:angular-components` agent to build the settings page". The target project needs `@smartsoft001/angular` (`npm install @smartsoft001/angular`), whose styling and import conventions are on the [`angular`](/docs/packages/angular) package page.

## Source

Defined in [`agents/angular-components.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart-angular/agents/angular-components.md), next to the `angular-components-*` skills it delegates to.
