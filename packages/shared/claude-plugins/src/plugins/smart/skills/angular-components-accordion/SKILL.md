---
name: angular-components-accordion
description: Accordion base component API for extending in custom implementations.
user-invocable: false
---

# AccordionBaseComponent (Base Only)

Abstract base directive for accordion components. This package provides the base class for creating custom accordion implementations.

## When to Use This Skill

- Developer wants to **create a custom accordion component** by extending the base class
- Developer needs to understand the base API (inputs, computed properties, methods)
- Developer asks about `<smart-accordion>` → explain how to extend the base class

## Base Class API

### Import

```typescript
import { AccordionBaseComponent } from '@smartsoft001/angular';
```

### Inputs

| Input       | Type                                          | Default     | Description                    |
| ----------- | --------------------------------------------- | ----------- | ------------------------------ |
| `show`      | `ModelSignal<boolean>`                        | `false`     | Two-way binding for open state |
| `options`   | `InputSignal<IAccordionOptions \| undefined>` | `undefined` | Accordion configuration        |
| `cssClass`  | `InputSignal<string>`                         | `''`        | External CSS classes           |
| `headerTpl` | `InputSignal<TemplateRef>`                    | required    | Header template                |
| `bodyTpl`   | `InputSignal<TemplateRef>`                    | required    | Body template                  |

### IAccordionOptions

```typescript
interface IAccordionOptions {
  open?: boolean; // Initial open state
  disabled?: boolean; // Prevents toggle when true
  animated?: boolean; // Enable/disable CSS transitions
}
```

### Computed Properties

| Property                 | Type               | Description                                             |
| ------------------------ | ------------------ | ------------------------------------------------------- |
| `sharedContainerClasses` | `Signal<string[]>` | Divider, rounded, border classes with dark mode support |

### Methods

| Method     | Description                                 |
| ---------- | ------------------------------------------- |
| `toggle()` | Toggles `show` signal (no-op if `disabled`) |

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { AccordionBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-accordion',
  template: `
    <div [class]="sharedContainerClasses().join(' ')">
      <button (click)="toggle()">
        <ng-container [ngTemplateOutlet]="headerTpl()" />
      </button>
      @if (show()) {
        <div>
          <ng-container [ngTemplateOutlet]="bodyTpl()" />
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyAccordionComponent extends AccordionBaseComponent {}
```

## File Locations

- Base class: `packages/shared/angular/src/lib/components/accordion/base/base.component.ts`
- Tests: `packages/shared/angular/src/lib/components/accordion/base/base.component.spec.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IAccordionOptions`)
