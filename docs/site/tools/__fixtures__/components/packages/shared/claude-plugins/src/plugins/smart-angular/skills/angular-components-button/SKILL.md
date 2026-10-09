---
name: angular-components-button
description: Button component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Button Component

The `<smart-button>` component wraps a button and can be replaced through a token.

It renders `ButtonStandardComponent` by default.

## When to Use This Skill

- Developer wants to use the button component
- Developer asks about `ButtonComponent`

## Components

### ButtonComponent (`<smart-button>`)

Main wrapper component.

```typescript
providers: [{ provide: BUTTON_TOKEN, useValue: ButtonPresetComponent }];
```

### ButtonBaseComponent (abstract)

Abstract base directive.

## API

### Inputs

| Input      | Type                   | Default  | Description    |
| ---------- | ---------------------- | -------- | -------------- |
| `options`  | `InputSignal<IButton>` | required | Configuration  |
| `disabled` | `InputSignal<boolean>` | `false`  | Disabled state |

### IButtonOptions

```ts
interface IButtonOptions {
  click: () => void;
}
```

## Extending the Base Class

```typescript
export class MyButton extends ButtonBaseComponent {}
```

## Usage Examples

```html
<smart-button [options]="opts">Save</smart-button>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/button/button.component.ts`
