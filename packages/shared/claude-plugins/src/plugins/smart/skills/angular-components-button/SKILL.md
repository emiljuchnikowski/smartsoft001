---
name: angular-components-button
description: Button base component API for extending in custom implementations. Concrete <smart-button> is in @smartsoft001-pro/angular.
user-invocable: false
---

# ButtonBaseComponent (Base Only)

Abstract base directive for button components. This package provides **only the base class** — the concrete renderable component (`<smart-button>`) is available in `@smartsoft001-pro/angular`.

## When to Use This Skill

- Developer wants to **create a custom button component** by extending the base class
- Developer needs to understand the base API (inputs, computed properties, methods)
- Developer asks about `<smart-button>` → inform them the concrete component is in `@smartsoft001-pro/angular`

## Base Class API

### Import

```typescript
import { ButtonBaseComponent } from '@smartsoft001/angular';
```

### Inputs

| Input      | Type                          | Default  | Description          |
| ---------- | ----------------------------- | -------- | -------------------- |
| `options`  | `InputSignal<IButtonOptions>` | required | Button configuration |
| `disabled` | `InputSignal<boolean>`        | `false`  | Disabled state       |
| `cssClass` | `InputSignal<string>`         | `''`     | External CSS classes |

### IButtonOptions

```typescript
interface IButtonOptions {
  type?: 'submit' | 'button';
  confirm?: boolean;
  click: () => void;
  loading?: Signal<boolean>;
  variant?: SmartVariant; // 'primary' | 'secondary' | 'soft'
  size?: SmartSize; // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: SmartColor; // 22 Tailwind colors, default 'indigo'
  rounded?: boolean;
  circular?: boolean;
}
```

### Computed Properties

| Property         | Type               | Description                                             |
| ---------------- | ------------------ | ------------------------------------------------------- |
| `variantClasses` | `Signal<string[]>` | CSS classes based on variant, color, and disabled state |

### Methods

| Method            | Description                                     |
| ----------------- | ----------------------------------------------- |
| `invoke()`        | Triggers click or enters confirm mode           |
| `confirmInvoke()` | Executes click and resets to default mode       |
| `confirmCancel()` | Cancels confirmation and resets to default mode |

### Signals

| Signal | Type                                     | Description         |
| ------ | ---------------------------------------- | ------------------- |
| `mode` | `WritableSignal<'default' \| 'confirm'>` | Current button mode |

## Extending the Base Class

```typescript
import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { ButtonBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-button',
  template: `
    <button
      [class]="variantClasses().join(' ')"
      [disabled]="disabled()"
      (click)="invoke()"
    >
      <ng-content />
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyButtonComponent extends ButtonBaseComponent {}
```

## File Locations

- Base class: `packages/shared/angular/src/lib/components/button/base/base.component.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IButtonOptions`)
- Color map: `packages/shared/angular/src/lib/models/colors.ts` (`COMPONENT_COLORS`)
- Shared types: `SmartVariant`, `SmartSize`, `SmartColor` in `models/interfaces.ts`
