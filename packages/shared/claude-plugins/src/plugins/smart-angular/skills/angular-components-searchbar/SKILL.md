---
name: angular-components-searchbar
description: Searchbar component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Searchbar Component

The `<smart-searchbar>` component provides a debounced search input with an optional toggle button. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. It renders a default `SearchbarStandardComponent` which can be replaced via `SEARCHBAR_STANDARD_COMPONENT_TOKEN`. There is no preset for this component.

## When to Use This Skill

- Developer wants to use or customize the searchbar component
- Developer asks about `<smart-searchbar>`, `SearchbarComponent`, `SearchbarStandardComponent`, or `SearchbarBaseComponent`

## Components

### SearchbarComponent (`<smart-searchbar>`)

Main wrapper component. Renders `SearchbarStandardComponent` by default. When `SEARCHBAR_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, hands it `options`, `show`, `text` and `class`, and forwards its `show` and `text` changes back, so `[(show)]` and `[(text)]` on `<smart-searchbar>` keep working with any implementation.

### SearchbarStandardComponent (`<smart-searchbar-standard>`)

Default concrete implementation. Renders:

- a Tailwind-styled `<input type="search">` bound to the base `control` (`class` goes on this input), with the `placeholder` passed through `TranslatePipe`,
- a magnifying-glass SVG icon inside the input,
- while `show()` is `false`: a toggle button with the same icon when `options.showToggleButton` is `true` (a click shows the input again), otherwise nothing,
- `smart:dark:*` dark-mode classes.

Blurring the input while it is empty sets `show` to `false`.

### SearchbarBaseComponent (abstract)

Abstract base directive for extending custom searchbar implementations. Exposes `options`, `cssClass` (alias `class`), the `show` and `text` models, a `control` signal wrapping an `UntypedFormControl`, and the `setShow()` / `tryHide()` methods (`tryHide()` hides the field only while it is empty). The base class wires `control.valueChanges` through `debounceTime()` in `ngAfterViewInit` and writes the settled value into the `text` model; the debounce is read once there, so a later change of `options.debounceTime` has no effect. A non-empty `text` coming from outside is copied into the control without being reported back.

## API

### Inputs

| Input     | Type                                          | Default  | Description                                                        |
| --------- | --------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `options` | `InputSignal<ISearchbarOptions \| undefined>` | -        | Searchbar configuration                                            |
| `show`    | `ModelSignal<boolean>`                        | `true`   | Whether the input is visible (two-way bindable)                    |
| `text`    | `ModelSignal<string>`                         | required | Debounced search text (two-way bindable); bind it, e.g. `[(text)]` |
| `class`   | `InputSignal<string>`                         | `''`     | External CSS classes on the input (alias for `cssClass`)           |

### ISearchbarOptions

| Field              | Type         | Default    | Description                                                                                                        |
| ------------------ | ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `placeholder`      | `string`     | `'search'` | Placeholder of the input, passed through `TranslatePipe` (a translation key or text).                              |
| `debounceTime`     | `number`     | `1000`     | Milliseconds the typing has to settle before `text` changes; read once, after the view is created.                 |
| `showToggleButton` | `boolean`    | -          | While `show` is `false`, renders a magnifying-glass button that shows the input again.                             |
| `label`            | `string`     | -          | Not read by the built-in implementations; available to a custom implementation (e.g. as the input's `aria-label`). |
| `size`             | `SmartSize`  | -          | Not read by the built-in implementations; available to a custom implementation.                                    |
| `color`            | `SmartColor` | -          | Not read by the built-in implementations; available to a custom implementation.                                    |

```typescript
interface ISearchbarOptions {
  placeholder?: string; // translation key; default 'search'
  label?: string; // not read by the standard implementation
  debounceTime?: number; // ms; default 1000, read once
  showToggleButton?: boolean;
  size?: SmartSize; // not read by the standard implementation
  color?: SmartColor; // not read by the standard implementation
}
```

## SEARCHBAR_STANDARD_COMPONENT_TOKEN

InjectionToken that allows replacing the default `SearchbarStandardComponent` with a custom implementation. Provide a component class extending `SearchbarBaseComponent` under `SEARCHBAR_STANDARD_COMPONENT_TOKEN`; every `<smart-searchbar>` below that injector renders it.

```typescript
import { SEARCHBAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: SEARCHBAR_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomSearchbarComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { SearchbarBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-searchbar',
  template: `
    @if (show()) {
      <div [class]="containerClasses()">
        <input
          type="search"
          [formControl]="control()"
          [placeholder]="options()?.placeholder ?? 'search' | translate"
          (blur)="tryHide()"
        />
      </div>
    } @else if (options()?.showToggleButton) {
      <button type="button" (click)="setShow()">Search</button>
    }
  `,
  imports: [ReactiveFormsModule, TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomSearchbarComponent extends SearchbarBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-searchbar-container'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, let the base class handle the `control.valueChanges` subscription; do not re-subscribe to emit into `text`.

## Usage Examples

```html
<!-- Default -->
<smart-searchbar [(text)]="searchText" />

<!-- With options (custom placeholder + debounce) -->
<smart-searchbar
  [(text)]="searchText"
  [options]="{ placeholder: 'users.search', debounceTime: 300 }"
/>

<!-- Hidden with a toggle button -->
<smart-searchbar
  [(show)]="searchShown"
  [(text)]="searchText"
  [options]="{ showToggleButton: true }"
/>

<!-- With external class -->
<smart-searchbar class="smart:max-w-md" [(text)]="searchText" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/searchbar/searchbar.component.ts`
- Standard: `packages/shared/angular/src/lib/components/searchbar/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/searchbar/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SEARCHBAR_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISearchbarOptions`)
