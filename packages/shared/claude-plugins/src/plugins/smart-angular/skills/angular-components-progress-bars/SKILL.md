---
name: angular-components-progress-bars
description: Progress indicators with step list (8 visual variants) and percentage progress bar mode. InjectionToken pattern for custom implementations.
user-invocable: false
---

# Progress Bars Component

The `<smart-progress-bars>` component renders either a list of progress steps (`options.steps`, each `complete`, `current` or `upcoming`) or a percentage-based bar with optional column labels. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `ProgressBarsBaseComponent` defines the shared API — `options` (`IProgressBarsOptions`), `cssClass` (alias `class`), and the `stepClick` output. `ProgressBarsStandardComponent` is a barebones placeholder using native HTML. `ProgressBarsComponent` is the public wrapper that renders `ProgressBarsStandardComponent` by default and accepts a custom replacement via `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the progress steps / progress bar component
- Developer asks about `<smart-progress-bars>`, `ProgressBarsComponent`, `ProgressBarsStandardComponent`, or `ProgressBarsBaseComponent`

## Components

### ProgressBarsComponent (`<smart-progress-bars>`)

Main wrapper. Delegates to `ProgressBarsStandardComponent` by default. When `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, hands it the `options` and `class` inputs and re-emits its `stepClick`, so `(stepClick)` on `<smart-progress-bars>` works with any implementation.

### ProgressBarsStandardComponent (`<smart-progress-bars-standard>`)

Barebones placeholder. `options.layout` selects one of two rendering modes.

- **Step mode** (default; layouts `simple`, `panels`, `bullets`, `panels-with-border`, `circles`, `bullets-and-text`, `circles-with-text`): renders `<nav class="progress-bars">` (with `aria-label` from `options.ariaLabel` or default `"Progress"`), an optional `<p class="progress-bars-title">` from `options.title`, and an `<ol>` of `options.steps`. The `data-layout` attribute reflects `options.layout` so each visual variant can be styled. Each step renders as `<a class="progress-bars-step-link" href>` (when `href` is set) or `<button class="progress-bars-step-button">` (otherwise; a click emits `stepClick` with the step `id`). Steps get the `current` class and `aria-current="step"` when `status === 'current'`. The `data-status` attribute on the `<li>` reflects `status` (default `'upcoming'`). Each step shows `iconTpl` or, without it, `index` (e.g. `"02"`), then `name` and `description`, in every step layout.
- **Bar mode** (layout `progress-bar`): renders `<div class="progress-bars-bar-wrapper">` with an optional `<h4 class="sr-only">` (from `srOnlyTitle`), an optional `<p class="progress-bars-title">` (from `title`), a track + `<div class="progress-bars-fill" role="progressbar">` (width = `value` clamped to 0–100) and an optional `<div class="progress-bars-columns">` row of column labels (each with the `active` class when `column.active === true`). `ariaLabel` is not used in this mode.

### ProgressBarsPresetComponent (`<smart-progress-bars-preset>`)

Fully-styled variation that extends `ProgressBarsBaseComponent` and is a drop-in replacement for `ProgressBarsStandardComponent`. Register it via `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN` (or every preset at once with `provideSmartPresets()`) to restyle every `<smart-progress-bars>`, or use the `<smart-progress-bars-preset>` selector directly. It renders both modes off the shared `IProgressBarsOptions` API.

- **Percentage bar** (`layout: 'progress-bar'`): a rounded track + animated `bg-blue-600` fill sized to the clamped `value` (0–100). The track is the `role="progressbar"` element and carries `options.ariaLabel` (default `"Progress"`) as its `aria-label`. Shows a title header with a `value%` label when `title` is set, an `sr-only` `<h4>` from `srOnlyTitle`, and a grid of column captions from `columns` (active columns rendered semibold).
- **Stepper** (all other layouts): a `<nav>` (labelled by `ariaLabel`) with the optional `title` and an `<ol>` of steps. Markers adapt to the layout — numbered/check circles for `circles`, `circles-with-text`, `panels`, `panels-with-border`; small dots for `bullets`, `bullets-and-text`; a colored top border (no marker) for `simple`. `bullets-and-text` and `circles-with-text` lay out vertically; the other step layouts lay out horizontally, with connector lines between markers for `circles`/`bullets`. A step's `iconTpl` replaces the marker content, so the preset does not show it in the `simple` layout (which has no marker). Completed circle steps show a check SVG; current/upcoming circle steps show `step.index` (falling back to the 1-based position); the dot and `simple` layouts show no index. Each step renders an `<a>` when `step.href` is set, otherwise a `<button>` that emits `stepClick`. Names/markers tint by `status` (`complete`/`current`/`upcoming`).

All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants. The class recipes are internal to the preset and not exported.

`ProgressBarsPresetComponent` declares `cssClass` without the `class` alias: bind `[cssClass]` when you use the `<smart-progress-bars-preset>` selector directly. On `<smart-progress-bars>` pass `class` as usual; the wrapper hands it to whichever implementation renders.

### ProgressBarsBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IProgressBarsOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `stepClick: OutputEmitterRef<IProgressStepClick>`

## API

### Inputs

| Input     | Type                                             | Default | Description                                 |
| --------- | ------------------------------------------------ | ------- | ------------------------------------------- |
| `options` | `InputSignal<IProgressBarsOptions \| undefined>` | -       | Progress configuration                      |
| `class`   | `InputSignal<string>`                            | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Type                                   | Description                                                   |
| ----------- | -------------------------------------- | ------------------------------------------------------------- |
| `stepClick` | `OutputEmitterRef<IProgressStepClick>` | Emitted when a step without `href` (a `<button>`) is clicked. |

### IProgressBarsOptions

| Field         | Type                      | Default      | Description                                                                                           |
| ------------- | ------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| `layout`      | `SmartProgressBarsLayout` | `'simple'`   | A step layout, or `progress-bar` for the percentage bar.                                              |
| `ariaLabel`   | `string`                  | `'Progress'` | Accessible name of the step `<nav>`; the preset also puts it on the bar's `role="progressbar"` track. |
| `steps`       | `IProgressStep[]`         | `[]`         | The steps of a step layout.                                                                           |
| `title`       | `string`                  | -            | Title above the steps or the bar (the preset bar also shows the `value%` next to it).                 |
| `srOnlyTitle` | `string`                  | -            | Bar mode: a heading for screen readers only.                                                          |
| `value`       | `number`                  | `0`          | Bar mode: the percentage, clamped to 0–100.                                                           |
| `columns`     | `IProgressBarColumn[]`    | `[]`         | Bar mode: captions under the bar.                                                                     |

`SmartProgressBarsLayout` is `'simple' | 'panels' | 'bullets' | 'panels-with-border' | 'circles' | 'bullets-and-text' | 'circles-with-text' | 'progress-bar'`.

### IProgressStep

| Field         | Type                      | Default      | Description                                                                                                       |
| ------------- | ------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `id`          | `string`                  | required     | Reported as `stepId` by `stepClick`.                                                                              |
| `name`        | `string`                  | -            | Step name.                                                                                                        |
| `description` | `string`                  | -            | Text under the name, in every step layout.                                                                        |
| `status`      | `SmartProgressStepStatus` | `'upcoming'` | `'complete'`, `'current'` (adds `aria-current="step"`) or `'upcoming'`.                                           |
| `href`        | `string`                  | -            | Renders the step as a plain `<a href>` (no `stepClick`).                                                          |
| `iconTpl`     | `TemplateRef<unknown>`    | -            | Icon of the step; the preset shows it in the marker, so not in the `simple` layout.                               |
| `index`       | `string`                  | -            | Number of the step (e.g. `'01'`): the standard shows it when there is no `iconTpl`, the preset in circle markers. |

### IProgressBarColumn

| Field    | Type      | Default  | Description             |
| -------- | --------- | -------- | ----------------------- |
| `label`  | `string`  | required | Caption text.           |
| `active` | `boolean` | -        | Highlights the caption. |

### IProgressStepClick

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `stepId` | `string` | required | The `id` of the clicked step. |

```typescript
type SmartProgressBarsLayout =
  | 'simple'
  | 'panels'
  | 'bullets'
  | 'panels-with-border'
  | 'circles'
  | 'bullets-and-text'
  | 'circles-with-text'
  | 'progress-bar';

type SmartProgressStepStatus = 'complete' | 'current' | 'upcoming';

interface IProgressStep {
  id: string;
  name?: string;
  description?: string;
  status?: SmartProgressStepStatus;
  href?: string;
  iconTpl?: TemplateRef<unknown>;
  index?: string;
}

interface IProgressBarColumn {
  label: string;
  active?: boolean;
}

interface IProgressBarsOptions {
  layout?: SmartProgressBarsLayout;
  ariaLabel?: string;
  steps?: IProgressStep[]; // step layouts
  title?: string; // step layouts and the bar
  srOnlyTitle?: string; // only for layout="progress-bar"
  value?: number; // 0-100, only for layout="progress-bar"
  columns?: IProgressBarColumn[]; // only for layout="progress-bar"
}

interface IProgressStepClick {
  stepId: string;
}
```

## PROGRESS_BARS_STANDARD_COMPONENT_TOKEN

Provide a component class extending `ProgressBarsBaseComponent` under `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN` to render it in every `<smart-progress-bars>` below that injector, for example `ProgressBarsPresetComponent`. `provideSmartPresets()` registers every preset of the library at once.

```typescript
import { PROGRESS_BARS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomProgressBarsComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ProgressBarsBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-progress-bars',
  template: `…`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomProgressBarsComponent extends ProgressBarsBaseComponent {
  // `options()`, `cssClass()` (the wrapper's `class`) and `stepClick` are
  // inherited; the wrapper re-emits `stepClick`.
}
```

## Usage Examples

```html
<!-- Simple step layout -->
<smart-progress-bars
  [options]="{
    layout: 'simple',
    steps: [
      { id: '1', name: 'Job details', status: 'complete', href: '/1' },
      { id: '2', name: 'Application form', status: 'current', href: '/2' },
      { id: '3', name: 'Preview', status: 'upcoming', href: '/3' },
    ],
  }"
/>

<!-- Bullets variant with 'Step 2 of 4' header -->
<smart-progress-bars
  [options]="{
    layout: 'bullets',
    title: 'Step 2 of 4',
    steps: [
      { id: '1', status: 'complete', href: '/1' },
      { id: '2', status: 'current', href: '/2' },
      { id: '3', status: 'upcoming', href: '/3' },
      { id: '4', status: 'upcoming', href: '/4' },
    ],
  }"
/>

<!-- Percentage progress bar -->
<smart-progress-bars
  [options]="{
    layout: 'progress-bar',
    title: 'Migrating MySQL database...',
    srOnlyTitle: 'Status',
    value: 37.5,
    columns: [
      { label: 'Copying files', active: true },
      { label: 'Migrating database', active: true },
      { label: 'Compiling assets' },
      { label: 'Deployed' },
    ],
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/progress-bars/progress-bars.component.ts`
- Standard: `packages/shared/angular/src/lib/components/progress-bars/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/progress-bars/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/progress-bars/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/progress-bars/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PROGRESS_BARS_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IProgressBarsOptions`, `IProgressStep`, `IProgressBarColumn`, `SmartProgressBarsLayout`, `SmartProgressStepStatus`)
