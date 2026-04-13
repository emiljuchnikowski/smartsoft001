---
name: angular-components-card
description: Card base component API for extending in custom implementations. Concrete <smart-card> is in @smartsoft001-pro/angular.
user-invocable: false
---

# CardBaseComponent (Base Only)

Abstract base directive for card components. This package provides **only the base class** — the concrete renderable component (`<smart-card>`) is available in `@smartsoft001-pro/angular`.

## When to Use This Skill

- Developer wants to **create a custom card component** by extending the base class
- Developer needs to understand the base API (inputs, computed properties)
- Developer asks about `<smart-card>` → inform them the concrete component is in `@smartsoft001-pro/angular`

## Base Class API

### Import

```typescript
import { CardBaseComponent } from '@smartsoft001/angular';
```

### Inputs

| Input       | Type                                     | Default     | Description          |
| ----------- | ---------------------------------------- | ----------- | -------------------- |
| `options`   | `InputSignal<ICardOptions \| undefined>` | `undefined` | Card configuration   |
| `hasHeader` | `InputSignal<boolean>`                   | `false`     | Show header section  |
| `hasFooter` | `InputSignal<boolean>`                   | `false`     | Show footer section  |
| `cssClass`  | `InputSignal<string>`                    | `''`        | External CSS classes |
| `headerTpl` | `InputSignal<TemplateRef>`               | -           | Header template      |
| `bodyTpl`   | `InputSignal<TemplateRef>`               | required    | Body template        |
| `footerTpl` | `InputSignal<TemplateRef>`               | -           | Footer template      |

### ICardOptions

```typescript
type SmartCardVariant =
  | 'basic'
  | 'edge-to-edge'
  | 'well'
  | 'well-on-gray'
  | 'well-edge-to-edge';

interface ICardOptions {
  title?: string;
  variant?: SmartCardVariant;
  grayFooter?: boolean;
  grayBody?: boolean;
  buttons?: Array<IIconButtonOptions>;
}
```

### Computed Properties

| Property                 | Type               | Description                                                    |
| ------------------------ | ------------------ | -------------------------------------------------------------- |
| `sharedContainerClasses` | `Signal<string[]>` | Overflow, divider classes based on header/footer and gray opts |
| `headerClasses`          | `Signal<string>`   | Padding classes for header section                             |
| `bodyClasses`            | `Signal<string>`   | Padding + optional gray background classes for body            |
| `footerClasses`          | `Signal<string>`   | Padding + optional gray background classes for footer          |

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { CardBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-card',
  template: `
    <div [class]="sharedContainerClasses().join(' ')">
      @if (hasHeader()) {
        <div [class]="headerClasses()">
          <ng-container [ngTemplateOutlet]="headerTpl()" />
        </div>
      }
      <div [class]="bodyClasses()">
        <ng-container [ngTemplateOutlet]="bodyTpl()" />
      </div>
      @if (hasFooter()) {
        <div [class]="footerClasses()">
          <ng-container [ngTemplateOutlet]="footerTpl()" />
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCardComponent extends CardBaseComponent {}
```

## File Locations

- Base class: `packages/shared/angular/src/lib/components/card/base/base.component.ts`
- Tests: `packages/shared/angular/src/lib/components/card/base/base.component.spec.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICardOptions`, `SmartCardVariant`)
