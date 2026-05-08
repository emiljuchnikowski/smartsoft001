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

### DividerBaseComponent (abstract)

Abstract base directive for extending custom divider implementations.

## API

### Inputs

| Input         | Type                           | Default     | Description                                 |
| ------------- | ------------------------------ | ----------- | ------------------------------------------- |
| `label`       | `InputSignal<string>`          | `undefined` | Inline divider label                        |
| `iconName`    | `InputSignal<string>`          | `undefined` | Icon name for icon-variant dividers         |
| `title`       | `InputSignal<string>`          | `undefined` | Title text rendered as `<h3>`               |
| `actionLabel` | `InputSignal<string>`          | `undefined` | Action button text                          |
| `options`     | `InputSignal<IDividerOptions>` | `undefined` | Divider configuration                       |
| `class`       | `InputSignal<string>`          | `''`        | External CSS classes (alias for `cssClass`) |

### Outputs

| Output        | Type                  | Description                               |
| ------------- | --------------------- | ----------------------------------------- |
| `actionClick` | `OutputEmitter<void>` | Emitted when the action button is clicked |

### IDividerOptions

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

InjectionToken that allows replacing the default `DividerStandardComponent` with a custom implementation. Provide a `Type<DividerBaseComponent>` to override.

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

<!-- With title and position -->
<smart-divider title="Section" [options]="{ position: 'left' }" />

<!-- With action button -->
<smart-divider actionLabel="Add item" (actionClick)="onAdd()" />

<!-- With external class -->
<smart-divider class="smart:my-4" label="Or" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/divider/divider.component.ts`
- Standard: `packages/shared/angular/src/lib/components/divider/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/divider/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DIVIDER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDividerOptions`, `SmartDividerVariant`)
