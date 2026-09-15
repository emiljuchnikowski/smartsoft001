---
name: angular-components-widget
description: 'Widget component: renders "smart" widgets, fast.'
user-invocable: false
---

# Widget Component

The `<smart-widget>` component renders a widget. Legacy templates wrote {% widget %} inline.

## Components

### WidgetComponent (`<smart-widget>`)

Main wrapper component.

## Usage

```html
<smart-widget />
```

```html
<smart-widget mode="compact" />
```

## API

### Inputs

| Input     | Type                   | Default | Description   |
| --------- | ---------------------- | ------- | ------------- |
| `options` | `InputSignal<IWidget>` | `{}`    | Configuration |

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/widget/widget.component.ts`
