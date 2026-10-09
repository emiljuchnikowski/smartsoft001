---
name: angular-components-divider
description: Divider component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Divider Component

The `<smart-divider>` component provides a flexible divider/separator wrapper with an InjectionToken-based extension mechanism. It renders a default `DividerStandardComponent` which can be replaced via `DIVIDER_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the divider component
- Developer asks about `<smart-divider>` or `DividerComponent`

## Components

### DividerComponent (`<smart-divider>`)

Main wrapper component. Renders `DividerStandardComponent` by default. When `DIVIDER_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### DividerStandardComponent (`<smart-divider-standard>`)

Default concrete implementation. Renders a `<div role="separator">` host with optional title, label, action button, or a plain `<hr />` when none of these are provided.

### DividerPresetComponent (`<smart-divider-preset>`)

Styled variation that extends `DividerBaseComponent` and is a drop-in replacement for `DividerStandardComponent`. Register it for `DIVIDER_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-divider>` (or every preset at once with `provideSmartPresets()`), or use the `<smart-divider-preset>` selector directly. It translates Preline's divider patterns to `smart:`-prefixed Tailwind (with explicit `dark:` variants), one per variant:

- plain: an `<hr>`, when there is no content and no `variant`
- `with-label`, `with-icon`, `with-title`: the content (`label`, else `title`; `title` first for `with-title`, in Preline's uppercase muted "Or" style) with connecting line(s) placed by `options.position` (default `center`); `iconName` is shown before it
- `with-button`: only the `actionLabel` button (with `iconName` before its text) on the line; `label` and `title` are not shown
- `with-toolbar`: the content (`label`, else `title`), a line, then the `actionLabel` button; `options.position` does not apply

When `options.variant` is omitted the variant is **inferred** from the inputs: `actionLabel` → `with-button`, `title` → `with-title`, `iconName` → `with-icon`, `label` → `with-label`, otherwise the plain `<hr>`.

The preset declares `cssClass` without the `class` alias, so bind `[cssClass]` when you use the `<smart-divider-preset>` selector directly; `class` on `<smart-divider>` reaches it through the wrapper. `iconName` has no icon-font dependency: it is rendered as the text content of a `size-4` icon slot, so an icon font (e.g. Material Icons) gets the correct sizing. The class recipes are internal (not exported from `@smartsoft001/angular`).

```typescript
import {
  DIVIDER_STANDARD_COMPONENT_TOKEN,
  DividerPresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: DIVIDER_STANDARD_COMPONENT_TOKEN,
    useValue: DividerPresetComponent,
  },
];
```

### DividerBaseComponent (abstract)

Abstract base directive for extending custom divider implementations. It declares the inputs and the output below (`cssClass` with the `class` alias).

## API

### Inputs

| Input         | Type                                        | Default     | Description                                                                              |
| ------------- | ------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `label`       | `InputSignal<string \| undefined>`          | `undefined` | Short text on the line (standard: a `<span>`)                                            |
| `iconName`    | `InputSignal<string \| undefined>`          | `undefined` | Icon text before the content or the action. Preset only: the standard does not render it |
| `title`       | `InputSignal<string \| undefined>`          | `undefined` | Heading on the line (standard: an `<h3>`)                                                |
| `actionLabel` | `InputSignal<string \| undefined>`          | `undefined` | Renders a button with this text that emits `actionClick`                                 |
| `options`     | `InputSignal<IDividerOptions \| undefined>` | `undefined` | Variant and position                                                                     |
| `class`       | `InputSignal<string>`                       | `''`        | Classes on the root element (`cssClass` input, alias `class`)                            |

### Outputs

| Output        | Type                     | Description                               |
| ------------- | ------------------------ | ----------------------------------------- |
| `actionClick` | `OutputEmitterRef<void>` | Emitted when the action button is clicked |

### IDividerOptions

| Field      | Type                            | Default    | Description                                                                                                                                                     |
| ---------- | ------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`  | `SmartDividerVariant`           | inferred   | `'with-label'`, `'with-icon'`, `'with-title'`, `'with-button'` or `'with-toolbar'`. Preset only; the standard ignores it.                                       |
| `position` | `'left' \| 'center' \| 'right'` | `'center'` | Where the content sits on the line (preset, except `with-toolbar`). The standard only writes it to the `data-position` attribute of its root, for your own CSS. |

```typescript
interface IDividerOptions {
  variant?: SmartDividerVariant; // 'with-label' | 'with-icon' | 'with-title' | 'with-button' | 'with-toolbar'
  position?: 'left' | 'center' | 'right';
}
```

### DIVIDER_STANDARD_COMPONENT_TOKEN

```typescript
import { DIVIDER_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DividerStandardComponent` with a custom implementation. Provide a `Type<DividerBaseComponent>` to override. The wrapper passes the inputs it has on and re-emits the implementation's `actionClick`.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: DIVIDER_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomDividerComponent,
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
import { DividerBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-divider',
  template: `
    <div role="separator" [class]="cssClass()">
      @if (title()) {
        <h3>{{ title() }}</h3>
      }
      @if (actionLabel()) {
        <button type="button" (click)="actionClick.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomDividerComponent extends DividerBaseComponent {}
```

## Usage Examples

```html
<!-- Plain horizontal rule -->
<smart-divider />

<!-- With label -->
<smart-divider label="Continue with" />

<!-- With title on the left (preset) -->
<smart-divider title="Section" [options]="{ position: 'left' }" />

<!-- Title, line and action in one row (preset) -->
<smart-divider
  title="Team members"
  actionLabel="Add member"
  [options]="{ variant: 'with-toolbar' }"
  (actionClick)="onAdd()"
/>

<!-- With action button -->
<smart-divider actionLabel="Add item" (actionClick)="onAdd()" />

<!-- With external class -->
<smart-divider class="smart:my-4" label="Or" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/divider/divider.component.ts`
- Standard: `packages/shared/angular/src/lib/components/divider/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/divider/preset/preset.component.ts` (classes: `preset/preset-classes.util.ts`)
- Base class: `packages/shared/angular/src/lib/components/divider/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DIVIDER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDividerOptions`, `SmartDividerVariant`)
