---
title: Import
section: Components
component: import
nextjs:
  metadata:
    title: Import
    description: An upload button that opens the native file dialog and emits the chosen file, with an accept filter for the dialog.
---

`<smart-import>` is a button with an upload icon and a hidden file input. Clicking it opens the native file dialog; the chosen file is emitted through the `set` output. {% .lead %}

---

## Usage

{% tabs %}

{% tab title="HTML" %}

{% story-template file="packages/shared/angular/src/lib/components/import/import.component.stories.ts" region="usage" /%}

{% /tab %}

{% tab title="TypeScript" %}

{% snippet file="packages/shared/angular/src/lib/components/import/import.component.stories.ts" region="usage" /%}

{% /tab %}

{% tab title="Claude Code" %}

This component has no skill of its own, so Claude Code works from the API on this page. With the [`smart@smartsoft` plugin](/docs/skills/installing-the-plugin) installed, its [components agent](/docs/skills/angular-components-agent) picks the component and asks for the details it needs:

```text
Add a import to the settings page, using @smartsoft001/angular.
```

{% /tab %}

{% /tabs %}

{% storybook project="angular" story="components-import--playground" height=320 /%}

## Components

### ImportComponent (`<smart-import>`)

Renders a `<smart-button>` with a projected upload icon next to a hidden `<input type="file">`. The button click forwards to the input, and the input's change event goes through `ImportBaseComponent.onFileSelected`. As with [`export`](/docs/components/export), the button must use the standard implementation so the projected icon survives.

### ImportBaseComponent (abstract)

The base directive. `onFileSelected(event)` reads the first selected file, clears the input so the same file can be chosen again, and emits it; it throws when the dialog returns no file. `triggerFileInput(inputEl)` opens the dialog.

## API

### Inputs

| Input    | Type                               | Default              | Description                                                                         |
| -------- | ---------------------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `accept` | `InputSignal<string \| undefined>` | `'application/json'` | Value of the `accept` attribute on the hidden file input; filters the native dialog |
| `class`  | `InputSignal<string>`              | `''`                 | Extra CSS classes (alias for `cssClass`)                                            |

### Outputs

| Output | Type                     | Description                                            |
| ------ | ------------------------ | ------------------------------------------------------ |
| `set`  | `OutputEmitterRef<File>` | Emits the selected `File` once per dialog confirmation |

## Source

The component lives in [`packages/shared/angular/src/lib/components/import`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/angular/src/lib/components/import). It has no Claude Code skill of its own yet. The [CRUD list page](/docs/crud/export-multiselect-groups) uses it to load items from a JSON file.
