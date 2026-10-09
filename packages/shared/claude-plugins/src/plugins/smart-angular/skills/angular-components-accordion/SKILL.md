---
name: angular-components-accordion
description: Accordion component API (<smart-accordion>, its preset and the base class for custom implementations).
user-invocable: false
---

# Accordion Component

`<smart-accordion>` is a collapsible section: a header button that toggles a body. The header and body are projected through the `[accordionHeader]` / `[accordionBody]` slots, and the open state is the two-way `show` model. The accordion has **no** injection token: `<smart-accordion>` always renders `<smart-accordion-default>`; for the styled look use `<smart-accordion-preset>` directly, and for a look of your own extend `AccordionBaseComponent`.

## When to Use This Skill

- Developer wants a collapsible section (FAQ entry, "show details") in an Angular app
- Developer wants the styled (Preline) accordion: use `<smart-accordion-preset>`
- Developer wants a custom accordion: extend `AccordionBaseComponent`

## Wrapper: `<smart-accordion>`

### Inputs and models

| Input     | Type                             | Default     | Description                                                              |
| --------- | -------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `show`    | `ModelSignal<boolean>`           | `false`     | Open state, two-way (`[(show)]`); `showChange` reports every change.     |
| `options` | `IAccordionOptions \| undefined` | `undefined` | `open` (initial state, applied once) and `disabled`.                     |
| `class`   | `string`                         | `''`        | Classes appended to the container (the `cssClass` input, alias `class`). |

### Content projection

| Selector            | Description                              |
| ------------------- | ---------------------------------------- |
| `[accordionHeader]` | Content of the header button.            |
| `[accordionBody]`   | Content shown while the section is open. |

The wrapper passes both slots to `<smart-accordion-default>` as the `headerTpl` / `bodyTpl` templates.

### IAccordionOptions

| Field      | Type      | Default     | Description                                                                                                                                                                                                                                                                       |
| ---------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`     | `boolean` | `undefined` | Initial open state. When it is `true` on the first render and `show` is not already `true`, `AccordionBaseComponent.ngOnInit` sets `show` to `true` once and emits `showChange`, in every variant. Later changes of `options.open` are ignored; toggles and `[(show)]` take over. |
| `disabled` | `boolean` | `false`     | `toggle()` does nothing and the header button is rendered disabled.                                                                                                                                                                                                               |
| `animated` | `boolean` | `undefined` | Deprecated: not read by the built-in implementations (no variant animates); available to a custom implementation.                                                                                                                                                                 |

Bind `[(show)]` to a **signal** when you combine it with `options.open`: a plain class field updated during the first change detection raises `NG0100` (ExpressionChangedAfterItHasBeenChecked) in dev mode.

```typescript
interface IAccordionOptions {
  open?: boolean; // initial state, applied once on the first render
  disabled?: boolean; // toggle() does nothing
  /** @deprecated Not read by any variant. */
  animated?: boolean;
}
```

### Building blocks of the default rendering

`<smart-accordion-default>` (`AccordionDefaultComponent`) is a bordered card made of two exported components you can reuse:

| Component                  | Selector                 | Inputs                                                                                     |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `AccordionHeaderComponent` | `smart-accordion-header` | `open` (`boolean`, chevron up while `true`), `disabled` (`boolean`), `cssClass` (`string`) |
| `AccordionBodyComponent`   | `smart-accordion-body`   | `cssClass` (`string`)                                                                      |

## AccordionPresetComponent (`<smart-accordion-preset>`)

A fully styled accordion based on the Preline bordered accordion. It extends `AccordionBaseComponent`, so it takes the same contract as `AccordionDefaultComponent`: the required `headerTpl` / `bodyTpl` template inputs, the `show` model, `options` and `cssClass` (bound as `[cssClass]`; the base input has no `class` alias).

Because there is no token, the preset cannot restyle `<smart-accordion>`, and `provideSmartPresets()` does not change it: render `<smart-accordion-preset>` where you want the styled look and supply the templates yourself.

Expand/collapse is driven by the inherited `show` model and `@if`; no Preline JS runtime is needed. The toggle button carries `aria-expanded` / `aria-controls`, the open body is a `region`, the chevron points down while collapsed and up while expanded, and the container border is visible only while open.

```html
<ng-template #headerTpl>What is the best thing about Switzerland?</ng-template>
<ng-template #bodyTpl>I don't know, but the flag is a big plus.</ng-template>
<smart-accordion-preset
  [headerTpl]="headerTpl"
  [bodyTpl]="bodyTpl"
  [(show)]="isOpen"
/>
```

## AccordionBaseComponent

The abstract directive every variant extends (`AccordionDefaultComponent`, `AccordionPresetComponent`, and yours).

### Inputs

| Input       | Type                                          | Default     | Description                    |
| ----------- | --------------------------------------------- | ----------- | ------------------------------ |
| `show`      | `ModelSignal<boolean>`                        | `false`     | Two-way binding for open state |
| `options`   | `InputSignal<IAccordionOptions \| undefined>` | `undefined` | Accordion configuration        |
| `cssClass`  | `InputSignal<string>`                         | `''`        | External CSS classes           |
| `headerTpl` | `InputSignal<TemplateRef<unknown>>`           | required    | Header template                |
| `bodyTpl`   | `InputSignal<TemplateRef<unknown>>`           | required    | Body template                  |

### Computed properties

| Property                 | Type               | Description                                             |
| ------------------------ | ------------------ | ------------------------------------------------------- |
| `sharedContainerClasses` | `Signal<string[]>` | Divider, rounded, border classes with dark mode support |

### Methods

| Method       | Description                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `toggle()`   | Toggles the `show` model (no-op while `options.disabled`)                                                           |
| `ngOnInit()` | Applies `options.open` as the initial state; a subclass with its own `ngOnInit` calls `super.ngOnInit()` to keep it |

## Extending the Base Class

```typescript
import { NgTemplateOutlet } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { AccordionBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-accordion',
  imports: [NgTemplateOutlet],
  template: `
    <div [class]="sharedContainerClasses().join(' ')">
      <button type="button" (click)="toggle()">
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

A custom accordion is rendered by its own selector (there is no token to register it under), with the header and body passed as `<ng-template>` references.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/accordion/accordion.component.ts`
- Base class: `packages/shared/angular/src/lib/components/accordion/base/base.component.ts`
- Default concrete: `packages/shared/angular/src/lib/components/accordion/default/default.component.ts`
- Header / body: `packages/shared/angular/src/lib/components/accordion/header/header.component.ts`, `.../body/body.component.ts`
- Preset concrete: `packages/shared/angular/src/lib/components/accordion/preset/preset.component.ts`
- Preset class recipes (internal, not exported): `packages/shared/angular/src/lib/components/accordion/preset/preset-classes.util.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IAccordionOptions`)
