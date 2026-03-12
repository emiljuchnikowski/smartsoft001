---
name: angular-patterns
description: Angular 20 modern patterns including signals, standalone components, and new control flow syntax
---

# Angular 20 Modern Patterns

This skill provides guidance on Angular 20 best practices for this project.

## 1. Control Flow Syntax (`@if`, `@for`, `@switch`)

- Prefer `@if` over `*ngIf` and `@switch` over `ngSwitch`
- Prefer `@for` over `*ngFor`; always provide an explicit `track` expression
- Do not mix old and new syntax in the same file

### Examples

```html
@if (isLoading()) {
<app-spinner />
} @else if (error()) {
<app-error [message]="error()?.message" />
} @else {
<ul>
  @for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
  } @empty {
  <li>No data</li>
  }
</ul>
}
```

## 2. Signals

| Pattern      | Use Case                                             |
| ------------ | ---------------------------------------------------- |
| `signal()`   | Local, mutable component state                       |
| `computed()` | Pure derivations from other signals                  |
| `effect()`   | Side-effects (logging, syncing, service interaction) |
| `toSignal()` | Convert Observable to Signal                         |

### Signal Examples

```typescript
readonly items = signal<Item[]>([]);
readonly isLoading = signal(false);

readonly filtered = computed(() => {
  const f = this.filter().toLowerCase();
  return this.items().filter(i => i.name.toLowerCase().includes(f));
});
```

### RxJS Bridging

```typescript
private readonly data$ = this.http.get<Data[]>('/api/data');
readonly data = toSignal(this.data$, { initialValue: [] });
```

## 3. Dependency Injection via `inject()`

```typescript
@Component({...})
export class MyComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly myService = inject(MyService);
}
```

- Place `inject()` calls near the top of the class
- Assign to `readonly` properties

## 4. Input/Output APIs: `input()`, `output()`, `model()`

```typescript
@Component({...})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly changed = output<string>();
  readonly value = model<string>('');
}
```

## 5. Standalone Components

No explicit `standalone: true` needed in Angular 19+. Components use `smart` prefix for CRUD shell, `lib` prefix for shared Angular library.

## 6. Performance Guidelines

- Every `@for` must have a stable `track` expression
- Extract complex conditions into `computed()` signals
- Use `OnPush` change detection when appropriate

## 7. Migration Order (Legacy Code)

1. `*ngIf` -> `@if`
2. `*ngFor` -> `@for` (add `track`)
3. Constructor DI -> `inject()`
4. `@Input/@Output` -> `input()/output()/model()`
5. Simple state Observables -> signals

## 8. Import Order (ESLint enforced)

```typescript
// 1. External imports (alphabetically)
import { Component, inject, signal } from '@angular/core';

// 2. @smartsoft001/ imports (with blank line)
import { BaseModel } from '@smartsoft001/domain-core';

// 3. Relative imports (with blank line)
import { LocalComponent } from './local.component';
```
