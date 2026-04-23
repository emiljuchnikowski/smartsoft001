---
name: angular-components-info
description: Info popover component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Info Component

The `<smart-info>` component provides a small info icon that toggles a popover with a short tooltip text. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. It renders a default `InfoStandardComponent` which can be replaced via `INFO_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the info component
- Developer asks about `<smart-info>`, `InfoComponent`, `InfoStandardComponent`, or `InfoBaseComponent`

## Components

### InfoComponent (`<smart-info>`)

Main wrapper component. Renders `InfoStandardComponent` by default. When `INFO_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### InfoStandardComponent (`<smart-info-standard>`)

Default concrete implementation. Renders:

- a small SVG info icon (button),
- a popover shown while `isOpen()` is `true`,
- Tailwind-styled container with `dark:smart:*` dark-mode classes,
- a `document:click` listener that closes the popover on outside click.

### InfoBaseComponent (abstract)

Abstract base directive for extending custom info implementations. Exposes `options`, `cssClass`, `isOpen` signal, and `toggle()`/`open()`/`close()` methods.

## API

### Inputs

| Input     | Type                        | Default  | Description                                 |
| --------- | --------------------------- | -------- | ------------------------------------------- |
| `options` | `InputSignal<IInfoOptions>` | required | Info configuration                          |
| `class`   | `InputSignal<string>`       | `''`     | External CSS classes (alias for `cssClass`) |

### IInfoOptions

```typescript
interface IInfoOptions {
  text: string;
}
```

The `text` value is rendered inside the popover through `TranslatePipe`, so it may be a translation key.

### INFO_STANDARD_COMPONENT_TOKEN

```typescript
import { INFO_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `InfoStandardComponent` with a custom implementation. Provide a `Type<InfoBaseComponent>` to override.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: INFO_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomInfoComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { InfoBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-info',
  template: `
    <div [class]="containerClasses()">
      <button type="button" (click)="toggle(); $event.stopPropagation()">
        ?
      </button>
      @if (isOpen()) {
        <div class="my-popover">{{ options().text | translate }}</div>
      }
    </div>
  `,
  imports: [TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomInfoComponent extends InfoBaseComponent {
  private readonly elementRef = inject(ElementRef);

  containerClasses = computed(() => {
    const classes = ['my-info-container'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `INFO_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- implement a close-on-outside-click listener yourself if the popover should close when clicking outside — the base class does not do it for you.

## Usage Examples

```html
<!-- Basic -->
<smart-info [options]="{ text: 'Helpful description' }"></smart-info>

<!-- Longer text -->
<smart-info
  [options]="{ text: 'A longer explanation that wraps inside the popover container.' }"
></smart-info>

<!-- Inline with a label -->
<div class="smart:flex smart:items-center smart:gap-2">
  <label>Email address</label>
  <smart-info
    [options]="{ text: 'Enter your primary email address.' }"
  ></smart-info>
</div>

<!-- With external class -->
<smart-info
  class="smart:text-indigo-600"
  [options]="{ text: 'External class applied via the class alias.' }"
></smart-info>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/info/info.component.ts`
- Standard: `packages/shared/angular/src/lib/components/info/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/info/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`INFO_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IInfoOptions`)
