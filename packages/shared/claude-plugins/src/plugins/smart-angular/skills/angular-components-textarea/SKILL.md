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

Main wrapper. Delegates to `TextareaStandardComponent` by default. When `TEXTAREA_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `actionClick`.

### TextareaStandardComponent (`<smart-textarea-standard>`)

Barebones placeholder using a native `<textarea>`. Renders an outer wrapper, an optional `<label>` (when `options.label` provided), optional avatar/toolbar slots, the `<textarea>` with `[value]` two-way bound through input event, `[disabled]`, `[rows]` (default 3), `[attr.maxlength]`, `[attr.placeholder]`, `[attr.aria-label]`, and an optional row of `<button class="action variant-{variant}">` per `options.actions` entry that emits `{ actionId, value }` via `actionClick` (suppressed when disabled). Optional `previewTpl` and `footerTpl` slots render below the actions row. The external `cssClass` is applied to the root wrapper.

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

`ITextareaActionClick = { actionId: string; value: string }`.

## API

### Inputs

| Input         | Type                                         | Default | Description                                 |
| ------------- | -------------------------------------------- | ------- | ------------------------------------------- |
| `value`       | `ModelSignal<string>`                        | `''`    | Two-way bindable textarea value             |
| `placeholder` | `InputSignal<string>`                        | `''`    | Placeholder text                            |
| `disabled`    | `InputSignal<boolean>`                       | `false` | Disabled state                              |
| `options`     | `InputSignal<ITextareaOptions \| undefined>` | -       | Optional configuration                      |
| `class`       | `InputSignal<string>`                        | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output        | Type                                     | Description                              |
| ------------- | ---------------------------------------- | ---------------------------------------- |
| `actionClick` | `OutputEmitterRef<ITextareaActionClick>` | Emitted when an action button is clicked |

### ITextareaOptions

```typescript
type SmartTextareaVariant =
  | 'simple'
  | 'with-avatar-actions'
  | 'with-underline'
  | 'with-pill-actions'
  | 'with-preview';

interface ITextareaOptions {
  rows?: number;
  maxLength?: number;
  variant?: SmartTextareaVariant;
  label?: string;
  name?: string;
  required?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  actions?: ITextareaAction[];
  avatarTpl?: TemplateRef<unknown>;
  toolbarTpl?: TemplateRef<unknown>;
  previewTpl?: TemplateRef<unknown>;
  footerTpl?: TemplateRef<unknown>;
}

interface ITextareaAction {
  id: string;
  label?: string;
  iconTpl?: TemplateRef<unknown>;
  variant?: 'primary' | 'secondary' | 'ghost';
}
```

## Preset

`TextareaPresetComponent` (selector `smart-textarea-preset`) renders the Tailwind UI comment-form look: white / `gray-900`-friendly surfaces (`bg-white`, `dark:bg-white/5`), `gray-300` / `white/10` outlines with a blue focus ring, `gray-900` / white text, `gray-400` / `gray-500` placeholders and `rounded-lg` fields. Every class is `smart:`-prefixed with an explicit `dark:` variant; the recipes live in `preset/preset-classes.util.ts`.

It renders everything the standard component renders (label, avatar, toolbar, field, actions, preview, footer) and additionally honours the options the standard ignores:

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

Register it on the token to restyle every `<smart-textarea>`:

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

> Because `TextareaComponent` renders injected components via `NgComponentOutlet` (which passes inputs by canonical name), `TextareaPresetComponent` overrides `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-textarea-preset>` selector directly, or just pass `class` on `<smart-textarea>` (the wrapper forwards it).

## TEXTAREA_STANDARD_COMPONENT_TOKEN

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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
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
