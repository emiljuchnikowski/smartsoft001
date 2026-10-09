---
name: angular-components-textarea
description: Textarea component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Textarea Component

The `<smart-textarea>` component renders a multi-line text input with two-way `value` binding, optional placeholder, disabled state, label, action buttons, avatar/toolbar/preview/footer slots, and a structured `actionClick` output. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `TextareaBaseComponent` defines the shared API — `value` (two-way `ModelSignal<string>`), `placeholder`, `disabled`, optional `ITextareaOptions`, `cssClass` (alias `class`), and the `actionClick` output. `TextareaStandardComponent` is a barebones placeholder using a native `<textarea>` element. `TextareaPresetComponent` is the styled Tailwind variation that honours every option, including `variant` and `autoFocus`. `TextareaComponent` is the public wrapper that renders `TextareaStandardComponent` by default and accepts a custom replacement (such as the preset) via `TEXTAREA_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the textarea component
- Developer asks about `<smart-textarea>`, `<smart-textarea-preset>`, `TextareaComponent`, `TextareaStandardComponent`, `TextareaPresetComponent`, or `TextareaBaseComponent`

## Components

### TextareaComponent (`<smart-textarea>`)

Main wrapper. Delegates to `TextareaStandardComponent` by default. When `TEXTAREA_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it `value`, `placeholder`, `disabled`, `options` and `class`. Re-emits `actionClick` and forwards two-way `value` of whichever implementation renders (the standard, the preset or a custom one).

### TextareaStandardComponent (`<smart-textarea-standard>`)

Barebones placeholder using a native `<textarea>`. Renders an outer wrapper with `cssClass` around a `.textarea` block: an optional `<label>` (when `options.label` is set; it is not linked to the field, so give the field `options.ariaLabel` for an accessible name), optional `.avatar` and `.toolbar` slots, the `<textarea>` (`value` written back on input, `disabled`, `rows` default 3, `maxlength`, `placeholder`, `name`, `aria-label` and `required` from the options), and an optional `.actions` row with one `<button class="action variant-{variant}">` per `options.actions` entry (variant default `secondary`; `iconTpl` and `label` inside). A click emits `{ actionId, value }` through `actionClick`, never while disabled. Optional `.preview` (`previewTpl`) and `.footer` (`footerTpl`) slots render below the actions row. The standard ignores `options.variant` and `options.autoFocus` and adds no styles: the class hooks are for your CSS.

### TextareaPresetComponent (`<smart-textarea-preset>`)

Styled variation that extends `TextareaBaseComponent` and is a drop-in replacement for `TextareaStandardComponent`. See [Preset](#preset).

### TextareaBaseComponent (abstract)

Abstract base directive. Exposes:

- `value: ModelSignal<string>` (default `''`)
- `placeholder: InputSignal<string>` (default `''`)
- `disabled: InputSignal<boolean>` (default `false`)
- `options: InputSignal<ITextareaOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `actionClick: OutputEmitterRef<ITextareaActionClick>`

## API

### Inputs

| Input         | Type                                         | Default | Description                                 |
| ------------- | -------------------------------------------- | ------- | ------------------------------------------- |
| `value`       | `ModelSignal<string>`                        | `''`    | Two-way bindable textarea value             |
| `placeholder` | `InputSignal<string>`                        | `''`    | Placeholder text                            |
| `disabled`    | `InputSignal<boolean>`                       | `false` | Disables the field and the action buttons   |
| `options`     | `InputSignal<ITextareaOptions \| undefined>` | -       | Optional configuration                      |
| `class`       | `InputSignal<string>`                        | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output        | Type                                     | Description                                                                            |
| ------------- | ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `actionClick` | `OutputEmitterRef<ITextareaActionClick>` | Emitted when an action button is clicked, with the current text; never while disabled. |

### ITextareaOptions

| Field        | Type                   | Default    | Description                                                                       |
| ------------ | ---------------------- | ---------- | --------------------------------------------------------------------------------- |
| `rows`       | `number`               | `3`        | Visible text rows.                                                                |
| `maxLength`  | `number`               | -          | `maxlength` of the field; the preset also shows a `count/max` counter.            |
| `variant`    | `SmartTextareaVariant` | `'simple'` | Preset only: the layout (see the preset section). The standard ignores it.        |
| `label`      | `string`               | -          | Label above the field (the preset links it to the field; the standard does not).  |
| `name`       | `string`               | -          | `name` attribute of the field.                                                    |
| `required`   | `boolean`              | `false`    | Sets `required` on the field; the preset also shows a red `*` in the label.       |
| `autoFocus`  | `boolean`              | `false`    | Preset only: focuses the field after the first render. The standard ignores it.   |
| `ariaLabel`  | `string`               | -          | `aria-label` of the field.                                                        |
| `actions`    | `ITextareaAction[]`    | `[]`       | Buttons below (or, in some preset variants, inside) the field.                    |
| `avatarTpl`  | `TemplateRef<unknown>` | -          | Avatar slot (the preset renders it in a column left of the field).                |
| `toolbarTpl` | `TemplateRef<unknown>` | -          | Toolbar slot (e.g. attach / mention buttons).                                     |
| `previewTpl` | `TemplateRef<unknown>` | -          | Preview content; the preset's `with-preview` variant shows it on the Preview tab. |
| `footerTpl`  | `TemplateRef<unknown>` | -          | Footer slot below everything else.                                                |

`SmartTextareaVariant` is `'simple' | 'with-avatar-actions' | 'with-underline' | 'with-pill-actions' | 'with-preview'`.

### ITextareaAction

| Field     | Type                                  | Default       | Description                                                                     |
| --------- | ------------------------------------- | ------------- | ------------------------------------------------------------------------------- |
| `id`      | `string`                              | required      | Reported as `actionId` in `actionClick`.                                        |
| `label`   | `string`                              | -             | Button text (the preset uses the `id` as `aria-label` of a button without one). |
| `iconTpl` | `TemplateRef<unknown>`                | -             | Icon before the label.                                                          |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'secondary'` | Look of the button (`variant-{variant}` class in the standard).                 |

### ITextareaActionClick

| Field      | Type     | Default  | Description                                 |
| ---------- | -------- | -------- | ------------------------------------------- |
| `actionId` | `string` | required | The `id` of the clicked action.             |
| `value`    | `string` | required | The text of the field at the time of click. |

## Preset

`TextareaPresetComponent` (selector `smart-textarea-preset`) renders the Tailwind UI comment-form look: white / `gray-900`-friendly surfaces (`bg-white`, `dark:bg-white/5`), `gray-300` / `white/10` outlines with a blue focus ring, `gray-900` / white text, `gray-400` / `gray-500` placeholders and `rounded-lg` fields. Every class is `smart:`-prefixed with an explicit `dark:` variant; the class recipes are internal to the preset and not exported.

It renders everything the standard component renders (label, avatar, toolbar, field, actions, preview, footer) and additionally honours the options the standard ignores.

- **`variant`** picks the layout (default `'simple'`, exposed as `data-variant` on the root):

  | Variant               | Look                                                                                                    |
  | --------------------- | ------------------------------------------------------------------------------------------------------- |
  | `simple`              | Outlined, rounded field; toolbar (left) and actions (right) in a row below it                           |
  | `with-avatar-actions` | Borderless field inside an outlined box whose focus ring follows the field; toolbar + actions inside it |
  | `with-underline`      | Borderless field on a bottom border that thickens to blue on focus; toolbar + actions below             |
  | `with-pill-actions`   | Outlined box with a divided (`border-t`) bar inside; action buttons are `rounded-full` pills            |
  | `with-preview`        | Write / Preview tabs above the field; the Preview tab swaps the field for `previewTpl`                  |

  Outside `with-preview`, a `previewTpl` renders as a `gray-50` / `white/5` block below the field.

- **`autoFocus`** focuses the field after the first render (and sets the `autofocus` attribute).
- **`maxLength`** is applied as `maxlength` and also shows a `count/max` counter under the field.
- **`required`** sets `required` on the field and a red `*` in the label; the label is linked to the field with `for`/`id`.
- **`avatarTpl`** renders in a column to the left of the body in every variant.
- **Actions** are styled per `action.variant`: `primary` (solid blue), `secondary` (default: white with a `gray-300` ring, `white/10` in dark mode), `ghost` (text only, gray hover). They are disabled with the field, and clicking one emits `actionClick` with `{ actionId, value }` (never while disabled).

Register it on `TEXTAREA_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-textarea>`, or register every preset at once with `provideSmartPresets()`.

```typescript
import {
  TEXTAREA_STANDARD_COMPONENT_TOKEN,
  TextareaPresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: TEXTAREA_STANDARD_COMPONENT_TOKEN,
    useValue: TextareaPresetComponent,
  },
];
```

```html
<smart-textarea
  [(value)]="comment"
  placeholder="Add your comment..."
  [options]="{
    variant: 'with-avatar-actions',
    avatarTpl: avatar,
    toolbarTpl: toolbar,
    actions: [{ id: 'submit', label: 'Post', variant: 'primary' }],
  }"
  (actionClick)="onAction($event)"
/>
```

> `TextareaPresetComponent` declares `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-textarea-preset>` selector directly, or just pass `class` on `<smart-textarea>` (the wrapper forwards it). With the preset registered through the token, `[(value)]` and `(actionClick)` on `<smart-textarea>` work as with the standard.

## TEXTAREA_STANDARD_COMPONENT_TOKEN

Provide a component class extending `TextareaBaseComponent` under `TEXTAREA_STANDARD_COMPONENT_TOKEN`; every `<smart-textarea>` below that injector renders it.

```typescript
import { TEXTAREA_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: TEXTAREA_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomTextareaComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { TextareaBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-textarea',
  template: `
    <textarea
      [value]="value()"
      [disabled]="disabled()"
      [attr.placeholder]="placeholder() || null"
      (input)="value.set($any($event.target).value)"
    ></textarea>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomTextareaComponent extends TextareaBaseComponent {
  // `value` (a model the wrapper binds two-way), `placeholder()`, `disabled()`,
  // `options()`, `cssClass()` and `actionClick` (re-emitted by the wrapper)
  // are inherited.
}
```

## Usage Examples

```html
<!-- Simple two-way bound textarea -->
<smart-textarea [(value)]="comment" placeholder="Add your comment..." />

<!-- With label and rows override -->
<smart-textarea [(value)]="bio" [options]="{ label: 'Bio', rows: 6 }" />

<!-- Disabled state -->
<smart-textarea [(value)]="readonly" [disabled]="true" />

<!-- With actions and maxLength -->
<smart-textarea
  [(value)]="message"
  [options]="{
    rows: 4,
    maxLength: 280,
    actions: [
      { id: 'cancel', label: 'Cancel', variant: 'ghost' },
      { id: 'submit', label: 'Send', variant: 'primary' },
    ],
  }"
  (actionClick)="onAction($event)"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/textarea/textarea.component.ts`
- Standard: `packages/shared/angular/src/lib/components/textarea/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/textarea/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/textarea/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/textarea/base/base.component.ts`
- Stories: `packages/shared/angular/src/lib/components/textarea/textarea.component.stories.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TEXTAREA_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ITextareaOptions`, `ITextareaAction`, `SmartTextareaVariant`)
