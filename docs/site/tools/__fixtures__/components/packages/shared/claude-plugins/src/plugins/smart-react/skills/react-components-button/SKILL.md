---
name: react-components-button
description: SmartButton for React, with a hook for custom implementations.
user-invocable: false
---

# Button (`SmartButton`)

`SmartButton` renders a button configured through `options`.

## When to Use This Skill

- Adding a button.

## Exports

| Export        | Kind      |
| ------------- | --------- |
| `SmartButton` | component |

## Props and Types

| Prop      | Type             |
| --------- | ---------------- |
| `options` | `IButtonOptions` |

## Usage

The handler is `options.click`:

```tsx
<SmartButton options={{ click: save }}>Save</SmartButton>
```

## Replacing the Implementation

Register a component under `button`:

```tsx
const components = { button: SmartButtonPreset }
```

### The `useButton` hook

| Returns  | Type         |
| -------- | ------------ |
| `invoke` | `() => void` |

A custom button builds on `useButton`:

```tsx
export function BrandButton() {}
```

## Styling

Classes carry the `smart:` prefix.

## File Locations

- `button.tsx`
