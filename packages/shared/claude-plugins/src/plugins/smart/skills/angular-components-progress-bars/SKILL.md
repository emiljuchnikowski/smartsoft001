---
name: angular-components-progress-bars
description: Progress indicators with step list (8 visual variants) and percentage progress bar mode. InjectionToken pattern for custom implementations.
user-invocable: false
---

# Progress Bars Component

The `<smart-progress-bars>` component renders either a list of progress steps (with statuses `complete`, `current`, `upcoming`) or a percentage-based bar with optional column labels. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `ProgressBarsBaseComponent` defines the shared API — `options` (`IProgressBarsOptions`), `cssClass` (alias `class`), and the `stepClick` output. `ProgressBarsStandardComponent` is a barebones placeholder using native HTML. `ProgressBarsComponent` is the public wrapper that renders `ProgressBarsStandardComponent` by default and accepts a custom replacement via `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the progress steps / progress bar component
- Developer asks about `<smart-progress-bars>`, `ProgressBarsComponent`, `ProgressBarsStandardComponent`, or `ProgressBarsBaseComponent`

## Components

### ProgressBarsComponent (`<smart-progress-bars>`)

Main wrapper. Delegates to `ProgressBarsStandardComponent` by default. When `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `stepClick`.

### ProgressBarsStandardComponent (`<smart-progress-bars-standard>`)

Barebones placeholder. Two rendering modes selected by `options.layout`:

**Step mode (default; layouts `simple`, `panels`, `bullets`, `panels-with-border`, `circles`, `bullets-and-text`, `circles-with-text`):**
Renders `<nav class="progress-bars">` (with `aria-label` from `options.ariaLabel` or default `"Progress"`) containing an `<ol>` of steps. The `data-layout` attribute reflects `options.layout` so each visual variant can be styled. Each step renders as `<a class="progress-bars-step-link">` (when `href` provided) or `<button class="progress-bars-step-button">` (otherwise emits `stepClick`). Steps get `current` class and `aria-current="step"` when `status === 'current'`. The `data-status` attribute on the `<li>` reflects `status` (defaults to `'upcoming'`). Supports `iconTpl`, `index` (e.g. "02"), `name`, and `description`.

**Bar mode (layout `progress-bar`):**
Renders `<div class="progress-bars-bar-wrapper">` with optional `<h4 class="sr-only">` (from `srOnlyTitle`), optional `<p class="progress-bars-title">` (from `title`), a track + `<div class="progress-bars-fill" role="progressbar">` (width = clamped `value` 0–100), and optional `<div class="progress-bars-columns">` row of column labels (each with `active` class when `column.active === true`).

### ProgressBarsBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IProgressBarsOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `stepClick: OutputEmitterRef<IProgressStepClick>`

`IProgressStepClick = { stepId: string }`.

## API

### Inputs

| Input     | Type                                             | Default | Description                                 |
| --------- | ------------------------------------------------ | ------- | ------------------------------------------- |
| `options` | `InputSignal<IProgressBarsOptions \| undefined>` | -       | Progress configuration                      |
| `class`   | `InputSignal<string>`                            | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Type                                   | Description                                |
| ----------- | -------------------------------------- | ------------------------------------------ |
| `stepClick` | `OutputEmitterRef<IProgressStepClick>` | Emitted when a button-type step is clicked |

### IProgressBarsOptions

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
  steps?: IProgressStep[]; // for step layouts
  title?: string;
  srOnlyTitle?: string;
  value?: number; // 0-100, only for layout="progress-bar"
  columns?: IProgressBarColumn[]; // only for layout="progress-bar"
}
```

## PROGRESS_BARS_STANDARD_COMPONENT_TOKEN

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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
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
- Base class: `packages/shared/angular/src/lib/components/progress-bars/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PROGRESS_BARS_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IProgressBarsOptions`, `IProgressStep`, `IProgressBarColumn`, `SmartProgressBarsLayout`, `SmartProgressStepStatus`)
