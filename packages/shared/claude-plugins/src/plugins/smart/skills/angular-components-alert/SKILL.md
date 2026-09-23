---
name: angular-components-alert
description: Alert (confirm dialog) component API with InjectionToken pattern, and the AlertService that opens it from code.
user-invocable: false
---

# Alert Component

The `<smart-alert>` component is a small confirm dialog: a header, an optional sub-header and message, and a row of buttons. It is what `AlertService.show()` renders, so every "are you sure?" in the library (for example the remove action of `<smart-list>`) goes through it. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `AlertBaseComponent` defines the shared API — a required `options` input (`IAlertOptions`), `cssClass` (alias `class`), a `dismissed` output carrying the chosen button (or `null`), and the `invoke(button)` / `cancel()` methods. `AlertStandardComponent` is the styled default. `AlertComponent` is the public wrapper that renders `AlertStandardComponent` by default and accepts a custom replacement via `ALERT_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants a confirmation dialog, or asks why `AlertService.show()` renders what it renders
- Developer asks about `<smart-alert>`, `AlertComponent`, `AlertStandardComponent`, `AlertBaseComponent`, `AlertService` or `IAlertOptions`

## Components

### AlertComponent (`<smart-alert>`)

Main wrapper component. Renders `AlertStandardComponent` by default. When `ALERT_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Use it inline when the alert is part of a template; use `AlertService` when it has to be opened from code.

### AlertStandardComponent (`<smart-alert-standard>`)

Styled default implementation. Renders a full-screen backdrop (`smart:fixed smart:inset-0`, translucent gray, darker in dark mode) with a centered panel that carries `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the header and `aria-describedby` pointing at the message. Inside: an `<h2>` header, an optional `<h3>` sub-header, an optional `<p>` message and one `<button data-role>` per entry of `options.buttons`, right-aligned. Buttons are styled by role — `cancel` is the secondary white/gray button, `destructive` is red, everything else is the blue primary — and each button's `cssClass` is appended. All classes are `smart:`-prefixed Tailwind with explicit `smart:dark:` variants.

Keyboard and focus: the first button receives focus when the dialog mounts, `Tab` and `Shift+Tab` cycle inside the dialog, `Escape` (anywhere in the document) cancels. A click on the backdrop cancels unless `options.backdropDismiss` is `false`.

### AlertBaseComponent (abstract)

Abstract base directive for custom alert implementations. Exposes `options` as `InputSignal<IAlertOptions>` (required), `cssClass` as `InputSignal<string>` (alias `class`), the `dismissed` output, and the computed `buttons()` and `cancelButton()` (the first button whose role is `cancel`, or `null`). Behaviour lives in the base so a custom template only has to bind it:

| Member                        | What it does                                                                                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invoke(button)`              | Runs `button.handler` when present, then emits `dismissed` with the button. A handler that returns `false` keeps the dialog open (Ionic semantics). A `cancel` button needs no handler. |
| `cancel()`                    | Emits `dismissed` with `cancelButton()` or `null`. Runs no handler.                                                                                                                     |
| `onEscape()`                  | Calls `cancel()`; the standard binds it to `document:keydown.escape`.                                                                                                                   |
| `onBackdropClick(event)`      | Calls `cancel()` when the click landed on the backdrop itself and `options.backdropDismiss` is not `false`.                                                                             |
| `trapFocus(event, container)` | Keeps `Tab` / `Shift+Tab` cycling among the enabled buttons of `container`.                                                                                                             |
| `buttonClasses(button)`       | The role-based Tailwind classes plus the button's own `cssClass`.                                                                                                                       |
| `headerId`, `messageId`       | Unique ids per instance, for `aria-labelledby` / `aria-describedby`.                                                                                                                    |

## AlertService

`AlertService` (provided by `SharedServicesModule`) opens the dialog without any host element in a template. `show(options)` creates the component through Angular's `createComponent` with the service's `EnvironmentInjector`, attaches the view to `ApplicationRef`, appends the host element to `document.body` and returns a promise. The promise resolves with the chosen `IAlertButton` — after that button's `handler` has run — or with `null` when the alert was cancelled and no `cancel` button exists. On resolution the component is destroyed, its element removed and focus returned to the element that was focused before `show()`.

The service reads `ALERT_STANDARD_COMPONENT_TOKEN` from its own injector, so a replacement registered at the application root (or in the same module that provides `AlertService`) is used by every `show()` call; a token provided deeper in a component tree only affects `<smart-alert>` instances in that tree.

| Method          | Signature                                                   | Notes                                                                                  |
| --------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `show(options)` | `(options: IAlertOptions) => Promise<IAlertButton \| null>` | Resolves after the button handler ran; `await` it to sequence work after the decision. |

## API

### Inputs

| Input     | Type                         | Default | Description                                 |
| --------- | ---------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<IAlertOptions>` | -       | Header, sub-header, message and buttons     |
| `class`   | `InputSignal<string>`        | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Payload                | Description                                                              |
| ----------- | ---------------------- | ------------------------------------------------------------------------ |
| `dismissed` | `IAlertButton \| null` | Fired once, with the chosen button, or `null` when cancelled without one |

### IAlertOptions

| Property          | Type             | Default | Description                                              |
| ----------------- | ---------------- | ------- | -------------------------------------------------------- |
| `header`          | `string`         | -       | Dialog heading (also the accessible name)                |
| `subHeader`       | `string`         | -       | Secondary heading under the header                       |
| `message`         | `string`         | -       | Body text (also the accessible description)              |
| `backdropDismiss` | `boolean`        | `true`  | Whether a click on the backdrop cancels the alert        |
| `buttons`         | `IAlertButton[]` | `[]`    | Buttons rendered in order, the last one visually primary |

### IAlertButton

| Property   | Type                                                              | Default | Description                                                                      |
| ---------- | ----------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `text`     | `string`                                                          | -       | Visible label                                                                    |
| `role`     | `'cancel' \| 'destructive' \| string`                             | -       | `cancel` closes without a handler and is the Escape target; `destructive` is red |
| `cssClass` | `string \| string[]`                                              | -       | Extra classes appended to the button                                             |
| `handler`  | `(value?: unknown) => boolean \| void \| Record<string, unknown>` | -       | Runs before the dialog closes; return `false` to keep it open                    |

## ALERT_STANDARD_COMPONENT_TOKEN

```typescript
import { ALERT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `AlertStandardComponent` with a custom implementation. Provide a `Type<AlertBaseComponent>` to override. Register it at the application root so that both `<smart-alert>` and `AlertService.show()` pick it up.

```typescript
providers: [
  {
    provide: ALERT_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomAlertComponent,
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

import { AlertBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-alert',
  template: `
    <div role="presentation" (click)="onBackdropClick($event)">
      <div
        role="alertdialog"
        aria-modal="true"
        tabindex="-1"
        [attr.aria-labelledby]="headerId"
        [class]="cssClass()"
        (keydown)="trapFocus($event, panel)"
        #panel
      >
        <h2 [id]="headerId">{{ options().header }}</h2>
        @if (options().message) {
          <p>{{ options().message }}</p>
        }
        @for (button of buttons(); track $index) {
          <button type="button" (click)="invoke(button)">
            {{ button.text }}
          </button>
        }
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class MyCustomAlertComponent extends AlertBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) — the wrapper and `AlertService` create the component by type, so inputs arrive by canonical name,
- call `invoke(button)` from every button so handlers run and `dismissed` fires; `AlertService.show()` resolves on that output and nothing else,
- bind `onEscape()` to the document `keydown.escape` and `trapFocus()` to the panel yourself — the base holds the logic but binds no listeners,
- move focus into the dialog after it mounts (the standard focuses its first button in `ngAfterViewInit`).

## Usage Examples

```typescript
// From code: the promise resolves after the chosen button's handler ran.
const button = await this.alertService.show({
  header: 'Delete this record?',
  message: 'This cannot be undone.',
  backdropDismiss: false,
  buttons: [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Delete',
      role: 'destructive',
      handler: () => this.facade.delete(id),
    },
  ],
});
```

```html
<!-- Inline, when the alert is part of a template -->
<smart-alert [options]="options" (dismissed)="onDismissed($event)" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/alert/alert.component.ts`
- Standard: `packages/shared/angular/src/lib/components/alert/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/alert/base/base.component.ts`
- Service: `packages/shared/angular/src/lib/services/alert/alert.service.ts`
- Stories: `packages/shared/angular/src/lib/components/alert/alert.component.stories.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`ALERT_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IAlertOptions`, `IAlertButton`)
