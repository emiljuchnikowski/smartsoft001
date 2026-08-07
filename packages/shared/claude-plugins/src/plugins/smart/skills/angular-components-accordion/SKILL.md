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

## AccordionPresetComponent (`<smart-accordion-preset>`)

A fully styled, drop-in accordion concrete based on the Preline bordered
accordion (FRA-210). It extends `AccordionBaseComponent`, so it consumes the
exact same contract as `AccordionDefaultComponent`: the `headerTpl` / `bodyTpl`
required template inputs, the `show` two-way model, `options` and `cssClass`.

> **Not token-swappable.** Unlike most preset variations in this library, the
> accordion has **no** `ACCORDION_STANDARD_COMPONENT_TOKEN` and the
> `<smart-accordion>` wrapper hard-codes `<smart-accordion-default>`. There is no
> NgComponentOutlet/DI seam, so the preset cannot be registered to restyle
> `<smart-accordion>`. **Use it directly via the `<smart-accordion-preset>`
> selector** and supply the templates yourself.

Expand/collapse is driven entirely by the inherited `show` model signal plus
`@if` — no Preline JS runtime is required. The header arrow is an inline chevron
(down when collapsed, up when expanded) and the container border becomes visible
only while open.

```typescript
import { AccordionPresetComponent } from '@smartsoft001/angular';
```

```html
<ng-template #headerTpl>What is the best thing about Switzerland?</ng-template>
<ng-template #bodyTpl>I don't know, but the flag is a big plus.</ng-template>
<smart-accordion-preset
  [headerTpl]="headerTpl"
  [bodyTpl]="bodyTpl"
  [(show)]="isOpen"
  [options]="{ disabled: false }"
  [cssClass]="'my-extra-class'"
/>
```

## File Locations

- Base class: `packages/shared/angular/src/lib/components/accordion/base/base.component.ts`
- Tests: `packages/shared/angular/src/lib/components/accordion/base/base.component.spec.ts`
- Default concrete: `packages/shared/angular/src/lib/components/accordion/default/default.component.ts`
- Preset concrete: `packages/shared/angular/src/lib/components/accordion/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/accordion/preset/preset-classes.util.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IAccordionOptions`)
