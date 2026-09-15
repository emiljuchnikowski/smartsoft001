---
title: Angular components agent
section: Skills
order: 5
nextjs:
  metadata:
    title: Angular components agent
    description: The smart:angular-components agent that picks the right @smartsoft001/angular component for a UI task and delegates to that component's skill.
---

The plugin ships one agent, `smart:angular-components`, for building screens in an application that uses `@smartsoft001/angular`. It knows the whole component catalogue and hands the details to one skill per component. {% .lead %}

---

## What it does

When a developer describes a piece of UI, the agent decides which `smart-*` component fits, then delegates to the matching `angular-components-<name>` skill for the API, the options object and the usage pattern. The delegation follows the component's shape:

- **Ready-to-use components** such as `date-edit`, `date-range`, `detail` and `input` have a concrete selector; the skill explains the inputs and outputs.
- **Components with an extension token**, the majority, render a default implementation that can be replaced through `<NAME>_STANDARD_COMPONENT_TOKEN`; the skill covers usage, the token override and how to extend the base class.
- **Base-only components** such as `button`, `card`, `accordion`, `page` and `paging` are extended rather than replaced; the skill shows the base class and what a custom implementation must provide.
- A request for a brand-new component goes to the base-only pattern.

The same 53 skills are the source of the [Components](/docs/components) section of this site, so what the agent tells Claude and what a person reads here come from the same files.

## When to use it

Ask for it, or let Claude pick it, when you want to build a page or feature with the framework's components, choose between components for a requirement, get the exact imports and options for one of them, or extend a base class with a custom implementation.

## How it is invoked

The agent is available in Claude Code once the plugin is installed. Claude selects it for UI work on its own; you can also name it explicitly, for example "use the angular-components agent to build the settings page". It needs `@smartsoft001/angular` in the project (`npm install @smartsoft001/angular`) and uses the styling and import conventions from the [`angular`](/docs/packages/angular) package page.

## Source

Defined in [`agents/angular-components/AGENT.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/agents/angular-components/AGENT.md), next to the `angular-components-*` skills it delegates to.
