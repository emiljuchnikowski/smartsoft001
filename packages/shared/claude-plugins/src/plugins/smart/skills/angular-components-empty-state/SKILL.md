---
name: angular-components-empty-state
description: Empty State component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Empty State Component

The `<smart-empty-state>` component renders an empty-state placeholder with an optional centered icon, title, description, primary actions and a list of starting-points / templates / recommendations. It is typically shown when a list, page or section has no content yet (e.g. _No projects_, _Create your first project_, _Add team members_). It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `EmptyStateBaseComponent` defines the shared API — `options` (`IEmptyStateOptions`), `cssClass` (alias `class`), and the `actionClick` / `itemClick` outputs. `EmptyStateStandardComponent` is a barebones placeholder using native `<h3>`, `<p>`, `<a>`, `<button>`, `<ul>` and `<li>` elements. `EmptyStateComponent` is the public wrapper that renders `EmptyStateStandardComponent` by default and accepts a custom replacement via `EMPTY_STATE_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the empty state component
- Developer asks about `<smart-empty-state>`, `EmptyStateComponent`, `EmptyStateStandardComponent`, or `EmptyStateBaseComponent`

## Components

### EmptyStateComponent (`<smart-empty-state>`)

Main wrapper. Delegates to `EmptyStateStandardComponent` by default. When `EMPTY_STATE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `actionClick` and `itemClick`.

### EmptyStateStandardComponent (`<smart-empty-state-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<div class="empty-state">` containing optional `iconTpl` (rendered via `NgTemplateOutlet`), `<h3 class="title">{{ options.title }}</h3>`, `<p class="description">{{ options.description }}</p>`, an optional `formTpl` slot, an optional row of action buttons or anchors (`<button class="action variant-{variant}">` or `<a>` when `action.href` provided), an optional list of items (`<a class="item-link">` when `item.href` provided, otherwise `<button class="item-button">`) with title / description / meta / icon / image, and an optional footer link.

### EmptyStateBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IEmptyStateOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `actionClick: OutputEmitterRef<IEmptyStateActionClick>`
- `itemClick: OutputEmitterRef<IEmptyStateItemClick>`

`IEmptyStateActionClick = { actionId: string }`
`IEmptyStateItemClick = { itemId: string }`

## API

### Inputs

| Input     | Type                                           | Default | Description                                 |
| --------- | ---------------------------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<IEmptyStateOptions \| undefined>` | -       | Empty state configuration                   |
| `class`   | `InputSignal<string>`                          | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output        | Type                                       | Description                                    |
| ------------- | ------------------------------------------ | ---------------------------------------------- |
| `actionClick` | `OutputEmitterRef<IEmptyStateActionClick>` | Emitted when a button-type action is clicked   |
| `itemClick`   | `OutputEmitterRef<IEmptyStateItemClick>`   | Emitted when an item without `href` is clicked |

### IEmptyStateOptions

```typescript
type SmartEmptyStateLayout =
  | 'simple'
  | 'dashed-border'
  | 'starting-points'
  | 'with-recommendations'
  | 'with-templates'
  | 'with-recommendations-grid';

interface IEmptyStateOptions {
  title?: string;
  description?: string;
  layout?: SmartEmptyStateLayout;
  iconTpl?: TemplateRef<unknown>;
  actions?: IEmptyStateAction[];
  items?: IEmptyStateItem[];
  itemsTitle?: string;
  formTpl?: TemplateRef<unknown>;
  footerLinkLabel?: string;
  footerLinkHref?: string;
}

interface IEmptyStateAction {
  id: string;
  label?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  iconTpl?: TemplateRef<unknown>;
}

interface IEmptyStateItem {
  id: string;
  title?: string;
  description?: string;
  href?: string;
  iconTpl?: TemplateRef<unknown>;
  imageUrl?: string;
  imageAlt?: string;
  meta?: string;
}
```

## EMPTY_STATE_STANDARD_COMPONENT_TOKEN

```typescript
import { EMPTY_STATE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomEmptyStateComponent,
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

import { EmptyStateBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-empty-state',
  template: `
    <div class="text-center">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      @if (options()?.description) {
        <p>{{ options()!.description }}</p>
      }
      @for (action of options()?.actions ?? []; track action.id) {
        <button
          type="button"
          (click)="actionClick.emit({ actionId: action.id })"
        >
          {{ action.label }}
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomEmptyStateComponent extends EmptyStateBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
```

## Usage Examples

```html
<!-- Simple "No projects" empty state -->
<smart-empty-state
  [options]="{
    title: 'No projects',
    description: 'Get started by creating a new project.',
    actions: [{ id: 'create', label: 'New Project', variant: 'primary' }],
  }"
  (actionClick)="onAction($event)"
/>

<!-- With starting-points list -->
<smart-empty-state
  [options]="{
    title: 'Projects',
    description: 'Get started by selecting a template.',
    items: [
      { id: 'list', title: 'Create a List', description: 'A simple list', href: '/lists/new' },
      { id: 'calendar', title: 'Create a Calendar', description: 'Track deadlines', href: '/calendars/new' },
    ],
    footerLinkLabel: 'Or start from an empty project',
    footerLinkHref: '/projects/new',
  }"
/>

<!-- With template list emitting itemClick -->
<smart-empty-state
  [options]="{
    title: 'Create your first project',
    items: [
      { id: 'marketing', title: 'Marketing Campaign', description: 'Memes' },
      { id: 'engineering', title: 'Engineering Project', description: 'Code' },
    ],
  }"
  (itemClick)="onTemplate($event)"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/empty-state/empty-state.component.ts`
- Standard: `packages/shared/angular/src/lib/components/empty-state/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/empty-state/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`EMPTY_STATE_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IEmptyStateOptions`, `IEmptyStateAction`, `IEmptyStateItem`, `SmartEmptyStateLayout`)
