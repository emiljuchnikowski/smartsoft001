---
name: angular-components-searchbar
description: Searchbar component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Searchbar Component

The `<smart-searchbar>` component provides a debounced search input with an optional toggle button. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. It renders a default `SearchbarStandardComponent` which can be replaced via `SEARCHBAR_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the searchbar component
- Developer asks about `<smart-searchbar>`, `SearchbarComponent`, `SearchbarStandardComponent`, or `SearchbarBaseComponent`

## Components

### SearchbarComponent (`<smart-searchbar>`)

Main wrapper component. Renders `SearchbarStandardComponent` by default. When `SEARCHBAR_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### SearchbarStandardComponent (`<smart-searchbar-standard>`)

Default concrete implementation. Renders:

- a Tailwind-styled `<input type="search">` bound to a `UntypedFormControl` with `debounceTime` from options,
- a magnifier SVG icon inside the input,
- an optional toggle button (shown when `show()` is `false` and `options.showToggleButton` is `true`) that reveals the input,
- `smart:dark:*` dark-mode classes.

### SearchbarBaseComponent (abstract)

Abstract base directive for extending custom searchbar implementations. Exposes `options`, `cssClass`, `show` and `text` models, a `control` signal wrapping `UntypedFormControl`, and `setShow()`/`tryHide()` methods. The base class wires `control.valueChanges` through `debounceTime()` in `ngAfterViewInit` and emits into the `text` model.

## API

### Inputs

| Input     | Type                                          | Default  | Description                                     |
| --------- | --------------------------------------------- | -------- | ----------------------------------------------- |
| `options` | `InputSignal<ISearchbarOptions \| undefined>` | -        | Searchbar configuration                         |
| `show`    | `ModelSignal<boolean>`                        | `true`   | Whether the input is visible (two-way bindable) |
| `text`    | `ModelSignal<string>`                         | required | Debounced search text (two-way bindable)        |
| `class`   | `InputSignal<string>`                         | `''`     | External CSS classes (alias for `cssClass`)     |

### ISearchbarOptions

```typescript
interface ISearchbarOptions {
  placeholder?: string; // translation key; default 'search'
  debounceTime?: number; // ms; default 1000
  showToggleButton?: boolean;
  size?: SmartSize; // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: SmartColor; // 22 Tailwind colors
}
```

The `placeholder` value is rendered through `TranslatePipe`, so it may be a translation key. If no `placeholder` is provided, the key `'search'` is used.

## SEARCHBAR_STANDARD_COMPONENT_TOKEN

```typescript
import { SEARCHBAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `SearchbarStandardComponent` with a custom implementation. Provide a `Type<SearchbarBaseComponent>` to override.

```typescript
// In your app module or component providers:
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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-searchbar-container'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `SEARCHBAR_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- let the base class handle the `control.valueChanges` subscription — do not re-subscribe to emit into `text`.

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

<!-- Two-way binding on both show and text -->
<smart-searchbar
  [(show)]="isSearchOpen"
  [(text)]="query"
  [options]="{ placeholder: 'search.products', debounceTime: 500, showToggleButton: true }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/searchbar/searchbar.component.ts`
- Standard: `packages/shared/angular/src/lib/components/searchbar/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/searchbar/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SEARCHBAR_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISearchbarOptions`)
