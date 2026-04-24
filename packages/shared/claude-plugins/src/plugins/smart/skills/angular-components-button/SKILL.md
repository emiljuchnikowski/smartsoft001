---
name: angular-components-button
description: Button component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Button Component

The `<smart-button>` component provides a flexible button wrapper with an InjectionToken-based extension mechanism. It renders a default `ButtonStandardComponent` which can be replaced via `BUTTON_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the button component
- Developer asks about `<smart-button>` or `ButtonComponent`

## Components

### ButtonComponent (`<smart-button>`)

Main wrapper component. Renders `ButtonStandardComponent` by default. When `BUTTON_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### ButtonStandardComponent (`<smart-button-standard>`)

Default concrete implementation. Simple Tailwind-styled button with size-dependent rounding and padding.

### ButtonBaseComponent (abstract)

Abstract base directive for extending custom button implementations.

## API

### Inputs

| Input      | Type                          | Default  | Description                                 |
| ---------- | ----------------------------- | -------- | ------------------------------------------- |
| `options`  | `InputSignal<IButtonOptions>` | required | Button configuration                        |
| `disabled` | `InputSignal<boolean>`        | `false`  | Disabled state                              |
| `class`    | `InputSignal<string>`         | `''`     | External CSS classes (alias for `cssClass`) |

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
  iconPosition?: 'leading' | 'trailing';
}
```

### BUTTON_STANDARD_COMPONENT_TOKEN

```typescript
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `ButtonStandardComponent` with a custom implementation. Provide a `Type<ButtonBaseComponent>` to override.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: BUTTON_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomButtonComponent,
  },
];
```

## Extending the Base Class

```typescript
import { Component, computed, ViewEncapsulation } from '@angular/core';
import { ButtonBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-button',
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="invoke()"
    >
      <ng-content />
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomButtonComponent extends ButtonBaseComponent {
  buttonClasses = computed(() => {
    const classes = [...this.variantClasses(), 'my-custom-class'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Default button -->
<smart-button [options]="{ click: onClick }">Save</smart-button>

<!-- With variant and size -->
<smart-button [options]="{ click: onClick, variant: 'primary', size: 'lg' }">
  Submit
</smart-button>

<!-- With loading -->
<smart-button [options]="{ click: onClick, loading: loadingSignal }">
  Save
</smart-button>

<!-- With confirm -->
<smart-button [options]="{ click: onDelete, confirm: true, color: 'red' }">
  Delete
</smart-button>

<!-- With external class -->
<smart-button class="smart:mt-4" [options]="opts">Submit</smart-button>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/button/button.component.ts`
- Standard: `packages/shared/angular/src/lib/components/button/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/button/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`BUTTON_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IButtonOptions`)
- Color map: `packages/shared/angular/src/lib/models/colors.ts` (`COMPONENT_COLORS`)
