---
title: Loader
section: Components
component: loader
nextjs:
  metadata:
    title: Loader
    description: A spinner that shows while data loads, sized and coloured through inputs, with a preset variation and a token to swap the implementation.
---

`<smart-loader>` renders a spinner while something loads. It takes a size and a colour, hides itself until `show` is true, and can be replaced application-wide through an injection token. {% .lead %}

---

## Usage

{% snippet file="packages/shared/angular/src/lib/components/loader/loader.component.stories.ts" region="usage" /%}

{% storybook project="angular" story="components-loader--playground" height=320 /%}

## Components

### LoaderComponent (`<smart-loader>`)

The wrapper. Renders `LoaderStandardComponent` by default. When `LOADER_STANDARD_COMPONENT_TOKEN` is provided, it renders the injected component through `NgComponentOutlet` and forwards `show`, `size`, `color` and `cssClass` to it by their canonical names.

### LoaderStandardComponent (`<smart-loader-standard>`)

The default implementation: an SVG spinner that gets its size class from `size` and its text colour from `color`.

### LoaderPresetComponent (`<smart-loader-preset>`)

A styled, drop-in variation that renders the Preline default spinner (a bordered ring with a transparent top border). Register it through `LOADER_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-loader>`, or use its selector directly. Because the wrapper passes inputs by canonical name, the preset declares `cssClass` as a plain input without the `class` alias.

### LoaderBaseComponent (abstract)

The base directive the variations extend. It owns the inputs and the `spinnerClasses` signal that turns `size` and `color` into Tailwind classes, so a custom implementation only has to provide a template.

## API

### Inputs

| Input   | Type                      | Default    | Description                                                          |
| ------- | ------------------------- | ---------- | -------------------------------------------------------------------- |
| `show`  | `InputSignal<boolean>`    | `false`    | Whether the spinner is visible                                       |
| `size`  | `InputSignal<SmartSize>`  | `'md'`     | One of `xs`, `sm`, `md`, `lg`, `xl`; maps to a `smart:size-*` class  |
| `color` | `InputSignal<SmartColor>` | `'indigo'` | Any colour of the shared palette; maps to a `smart:text-*-600` class |
| `class` | `InputSignal<string>`     | `''`       | Extra CSS classes (alias for `cssClass`)                             |

### LOADER_STANDARD_COMPONENT_TOKEN

An injection token from `@smartsoft001/angular`. Provide a `Type<LoaderBaseComponent>` (for example `LoaderPresetComponent` or your own subclass) in your application or component providers to replace the default spinner everywhere `<smart-loader>` is used.

## Source

The component lives in [`packages/shared/angular/src/lib/components/loader`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/angular/src/lib/components/loader). It has no Claude Code skill of its own yet; the [`list`](/docs/components/list) and [`page`](/docs/components/page) components use it while their data loads.
