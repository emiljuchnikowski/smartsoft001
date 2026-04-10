---
name: angular-components-accordion
description: Accordion component API, options, and usage patterns for @smartsoft001/angular
user-invocable: false
---

# Accordion Component

Collapsible disclosure panel with header (toggle button) and body (content area). Supports two-way binding, disabled state, chevron icon, and dark mode.

## API

### Selector

`<smart-accordion>`

### Inputs

| Input     | Type                   | Default     | Description                    |
| --------- | ---------------------- | ----------- | ------------------------------ |
| `show`    | `ModelSignal<boolean>` | `false`     | Two-way binding for open state |
| `options` | `IAccordionOptions`    | `undefined` | Accordion configuration        |

### IAccordionOptions

```typescript
interface IAccordionOptions {
  open?: boolean; // Initial open state
  disabled?: boolean; // Prevents toggle when true
  animated?: boolean; // Enable/disable CSS transitions
}
```

### Content Projection

| Selector            | Description                    |
| ------------------- | ------------------------------ |
| `[accordionHeader]` | Header content (toggle button) |
| `[accordionBody]`   | Collapsible body content       |

## Usage

```html
<!-- Basic -->
<smart-accordion [(show)]="isOpen">
  <span accordionHeader>Click to expand</span>
  <span accordionBody>Hidden content here.</span>
</smart-accordion>

<!-- Disabled -->
<smart-accordion [(show)]="isOpen" [options]="{ disabled: true }">
  <span accordionHeader>Cannot toggle</span>
  <span accordionBody>This will not show.</span>
</smart-accordion>
```

## File Locations

- Component: `packages/shared/angular/src/lib/components/accordion/accordion.component.ts`
- Header: `packages/shared/angular/src/lib/components/accordion/header/header.component.ts`
- Body: `packages/shared/angular/src/lib/components/accordion/body/body.component.ts`
- Tests: `packages/shared/angular/src/lib/components/accordion/accordion.component.spec.ts`
- Stories: `packages/shared/angular/src/lib/components/accordion/accordion.component.stories.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IAccordionOptions`)

## Tailwind Classes

All classes use `smart:` prefix. Container uses `smart:divide-y smart:rounded-lg smart:border smart:border-gray-200`. Header button uses `smart:flex smart:w-full smart:items-center smart:justify-between`. Dark mode: `dark:smart:*` variants applied.
