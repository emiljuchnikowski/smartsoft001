---
title: Export
section: Components
component: export
nextjs:
  metadata:
    title: Export
    description: A download button that hands the bound value to a handler when clicked, disabled while there is nothing to export.
---

`<smart-export>` is a button with a download icon. Bind the data to export and a handler; the button stays disabled until there is a value and calls the handler with it on click. {% .lead %}

---

## Usage

{% snippet file="packages/shared/angular/src/lib/components/export/export.component.stories.ts" region="usage" /%}

{% storybook project="angular" story="components-export--playground" height=320 /%}

## Components

### ExportComponent (`<smart-export>`)

Renders a `<smart-button>` with a projected download icon. It extends `ExportBaseComponent`, which owns the inputs and the click logic. Because the button projects the icon through content, the standard button implementation is used; a `BUTTON_STANDARD_COMPONENT_TOKEN` registered in the same injector would render the injected button through `NgComponentOutlet` and drop the icon.

### ExportBaseComponent (abstract)

The base directive. `onClick()` reads `value` and, when it is set, calls `handler` with it. Extend it to change the markup while keeping the behaviour.

## API

### Inputs

| Input      | Type                                    | Default     | Description                                                                                 |
| ---------- | --------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `value`    | `InputSignal<unknown \| undefined>`     | `undefined` | The data to export. The button is disabled while it is falsy                                |
| `handler`  | `InputSignal<(value: unknown) => void>` | required    | Called with `value` on click; serialise and download the data here                          |
| `fileName` | `InputSignal<string \| undefined>`      | `undefined` | Declared for implementations that name the downloaded file; the base class does not read it |
| `class`    | `InputSignal<string>`                   | `''`        | Extra CSS classes (alias for `cssClass`)                                                    |

The component emits no outputs. The `handler` input is the extension point: the [CRUD list page](/docs/crud/export-multiselect-groups) wires it to a service that turns the selected rows into a file.

## Source

The component lives in [`packages/shared/angular/src/lib/components/export`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/angular/src/lib/components/export). It has no Claude Code skill of its own yet. See [`import`](/docs/components/import) for the matching upload button.
