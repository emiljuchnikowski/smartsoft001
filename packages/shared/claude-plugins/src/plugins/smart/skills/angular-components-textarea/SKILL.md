---
name: angular-components-textarea
description: Textarea component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Textarea Component

The `<smart-textarea>` component renders a multi-line text input with two-way `value` binding, optional placeholder, disabled state, label, action buttons, avatar/toolbar/preview/footer slots, and a structured `actionClick` output. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `TextareaBaseComponent` defines the shared API — `value` (two-way `ModelSignal<string>`), `placeholder`, `disabled`, optional `ITextareaOptions`, `cssClass` (alias `class`), and the `actionClick` output. `TextareaStandardComponent` is a barebones placeholder using a native `<textarea>` element. `TextareaComponent` is the public wrapper that renders `TextareaStandardComponent` by default and accepts a custom replacement via `TEXTAREA_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the textarea component
- Developer asks about `<smart-textarea>`, `TextareaComponent`, `TextareaStandardComponent`, or `TextareaBaseComponent`

## Components

### TextareaComponent (`<smart-textarea>`)

Main wrapper. Delegates to `TextareaStandardComponent` by default. When `TEXTAREA_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `actionClick`.

### TextareaStandardComponent (`<smart-textarea-standard>`)

Barebones placeholder using a native `<textarea>`. Renders an outer wrapper, an optional `<label>` (when `options.label` provided), optional avatar/toolbar slots, the `<textarea>` with `[value]` two-way bound through input event, `[disabled]`, `[rows]` (default 3), `[attr.maxlength]`, `[attr.placeholder]`, `[attr.aria-label]`, and an optional row of `<button class="action variant-{variant}">` per `options.actions` entry that emits `{ actionId, value }` via `actionClick` (suppressed when disabled). Optional `previewTpl` and `footerTpl` slots render below the actions row. The external `cssClass` is applied to the root wrapper.

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
- Base class: `packages/shared/angular/src/lib/components/textarea/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TEXTAREA_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ITextareaOptions`, `ITextareaAction`, `SmartTextareaVariant`)
