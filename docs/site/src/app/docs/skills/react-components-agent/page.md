---
title: React components agent
section: Skills
order: 6
nextjs:
  metadata:
    title: React components agent
    description: The smart-react:react-components agent that picks the right @smartsoft001/react component or CRUD screen for a UI task and delegates to that component's skill.
---

The `smart-react` plugin ships the `smart-react:react-components` agent for building screens in a React application that uses `@smartsoft001/react` and, for collections, the CRUD screens of `@smartsoft001/crud-shell-react`. It selects a component and delegates its API details to a background skill. {% .lead %}

---

## What it does

When a developer describes a piece of UI, the agent chooses a `Smart*` component and delegates to a `react-components-<name>` skill for its props, its `options` object, its callbacks, the registry key it renders through, its preset and the `use<Name>` hook a custom implementation builds on. The plugin contains 59 such background skills, one per component, and the agent's catalogue names every one of them (docs-check fails when it doesn't).

Three cross-cutting skills complete the catalogue:

- `react-provider` covers `SmartProvider`: the component registry and its presets, translations, the navigation adapter for a router, the services and their hooks, the model providers and dark mode.
- `react-forms` covers the form engine: form controls, groups and arrays, validators, and forms built from `@Model` and `@Field` metadata.
- `smart-crud-react` covers the list and item screens of a collection built with `@smartsoft001/crud-shell-react`.

## When to use it

Ask for it, or let Claude pick it, when you want to build a page or feature with the framework's React components, choose between components for a requirement, get the exact props and imports for one of them, restyle components application-wide through presets and the registry, write a custom implementation on a component's hook, or build complete CRUD screens.

## How it is invoked

The agent is available after you [install the `smart-react@smartsoft` plugin](/docs/skills/installing-the-plugin) and reload Claude Code. Claude can select it for matching UI work; you can also ask explicitly, for example "use the `smart-react:react-components` agent to build the settings page". The target project needs `@smartsoft001/react` (`npm install @smartsoft001/react`), whose provider, styling and import conventions are on the [`react`](/docs/packages/react) package page; the CRUD screens are on the [`crud-shell-react`](/docs/packages/crud-shell-react) page.

## Source

Defined in [`agents/react-components.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart-react/agents/react-components.md), next to the `react-components-*` skills it delegates to.
