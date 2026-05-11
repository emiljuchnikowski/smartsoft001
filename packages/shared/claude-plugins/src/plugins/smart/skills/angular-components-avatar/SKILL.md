---
name: angular-components-avatar
description: Avatar component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Avatar Component

The `<smart-avatar>` component renders a user/entity avatar in either single or grouped form. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `AvatarBaseComponent` defines the shared API — `imageUrl`, `initials`, `size`, `shape`, `notificationPosition`, `group` (for stacked/multi-avatar display), optional `IAvatarOptions`, `cssClass` (alias `class`), and a derived `isGroup` computed signal that is `true` when `group()` has at least one item. `AvatarStandardComponent` is a barebones placeholder concrete implementation. `AvatarComponent` is the public wrapper that renders `AvatarStandardComponent` by default and accepts a custom replacement via `AVATAR_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the avatar component
- Developer asks about `<smart-avatar>`, `AvatarComponent`, `AvatarStandardComponent`, or `AvatarBaseComponent`
- Developer needs to render a single avatar (image, initials, or placeholder) or a group of stacked avatars

## Components

### AvatarComponent (`<smart-avatar>`)

Main wrapper component. Renders `AvatarStandardComponent` by default. When `AVATAR_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### AvatarStandardComponent (`<smart-avatar-standard>`)

Barebones placeholder concrete implementation. Renders a host `<span>` carrying the external `cssClass` plus `data-size` and `data-shape` attributes. Inside:

- **Group mode** (`isGroup()` is `true`): one `<span class="smart-avatar-group-item">` per `IAvatarItem` (tracked by `id`). Each item renders an `<img>` when the item has `imageUrl`, otherwise a `<span class="smart-avatar-initials">` with the item's `initials`.
- **Single mode** (`isGroup()` is `false`): an `<img>` when `imageUrl()` is set, otherwise `<span class="smart-avatar-initials">` when `initials()` is set, otherwise a `<span aria-hidden="true" class="smart-avatar-placeholder">·</span>` fallback.

It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### AvatarBaseComponent (abstract)

Abstract base directive for extending custom avatar implementations. Static `smartType: DynamicComponentType = 'avatar'`. Exposes:

- `imageUrl: InputSignal<string | undefined>`
- `initials: InputSignal<string | undefined>`
- `size: InputSignal<SmartAvatarSize>` (default `'md'`)
- `shape: InputSignal<SmartAvatarShape>` (default `'circle'`)
- `notificationPosition: InputSignal<'top' | 'bottom' | undefined>`
- `group: InputSignal<IAvatarItem[] | undefined>`
- `options: InputSignal<IAvatarOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`, default `''`)
- `isGroup = computed(() => !!this.group()?.length)`

## API

### Inputs

| Input                  | Type                                          | Default    | Description                                                              |
| ---------------------- | --------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| `imageUrl`             | `InputSignal<string \| undefined>`            | -          | URL of the avatar image (single mode)                                    |
| `initials`             | `InputSignal<string \| undefined>`            | -          | Initials shown when no `imageUrl` is provided (single mode)              |
| `size`                 | `InputSignal<SmartAvatarSize>`                | `'md'`     | Avatar size: `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                      |
| `shape`                | `InputSignal<SmartAvatarShape>`               | `'circle'` | Avatar shape: `'circle' \| 'rounded'`                                    |
| `notificationPosition` | `InputSignal<'top' \| 'bottom' \| undefined>` | -          | Reserved for custom implementations to position a notification dot/badge |
| `group`                | `InputSignal<IAvatarItem[] \| undefined>`     | -          | When set, renders a group of avatars instead of a single one             |
| `options`              | `InputSignal<IAvatarOptions \| undefined>`    | -          | Optional configuration (placeholder type, stack direction)               |
| `class`                | `InputSignal<string>`                         | `''`       | External CSS classes (alias for `cssClass`)                              |

### IAvatarItem

```typescript
interface IAvatarItem {
  id: string;
  imageUrl?: string;
  initials?: string;
}
```

Each item in a group must have a unique `id` (used as the `@for` track key). When `imageUrl` is present the item renders as an `<img>`; otherwise as `initials`.

### IAvatarOptions

```typescript
interface IAvatarOptions {
  placeholderType?: 'icon' | 'initials';
  stackDirection?: 'top-to-bottom' | 'bottom-to-top';
}
```

The standard placeholder component does not consume these options — they are reserved for custom implementations registered through `AVATAR_STANDARD_COMPONENT_TOKEN` (e.g. to choose between an icon glyph and initials as the empty fallback, or to control z-index ordering when avatars in a group are stacked/overlapped).

### Single vs Group Mode

The component automatically detects mode from `group()`:

- **Group mode**: when `group()` is a non-empty array, `isGroup()` is `true` and the component iterates `group()`. The single-mode `imageUrl`/`initials`/placeholder branch is not rendered.
- **Single mode**: when `group()` is `undefined` or `[]`, `isGroup()` is `false` and the component renders `imageUrl` (or `initials`, or placeholder) as a single avatar.

## AVATAR_STANDARD_COMPONENT_TOKEN

```typescript
import { AVATAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `AvatarStandardComponent` with a custom implementation. Provide a `Type<AvatarBaseComponent>` to override.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: AVATAR_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomAvatarComponent,
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

import { AvatarBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-avatar',
  template: `
    <span [class]="containerClasses()">
      @if (isGroup()) {
        @for (item of group(); track item.id) {
          <span class="my-avatar-group-item">
            @if (item.imageUrl) {
              <img [src]="item.imageUrl" alt="" />
            } @else {
              <span class="my-avatar-initials">{{ item.initials }}</span>
            }
          </span>
        }
      } @else {
        @if (imageUrl()) {
          <img [src]="imageUrl()" alt="" />
        } @else if (initials()) {
          <span class="my-avatar-initials">{{ initials() }}</span>
        } @else if (options()?.placeholderType === 'icon') {
          <svg class="my-avatar-icon" aria-hidden="true">...</svg>
        } @else {
          <span aria-hidden="true">·</span>
        }
      }
      @if (notificationPosition()) {
        <span
          class="my-avatar-notification"
          [attr.data-position]="notificationPosition()"
        ></span>
      }
    </span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomAvatarComponent extends AvatarBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = [
      'my-avatar',
      `my-avatar--${this.size()}`,
      `my-avatar--${this.shape()}`,
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `AVATAR_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- branch on `isGroup()` to render either the group iteration or the single-avatar fallback chain (`imageUrl` -> `initials` -> placeholder),
- track `@for` by `item.id` (the `IAvatarItem` contract).

## Usage Examples

```html
<!-- Single avatar with image -->
<smart-avatar [imageUrl]="user.photo" />

<!-- Single avatar with initials fallback -->
<smart-avatar [initials]="'AB'" size="lg" shape="rounded" />

<!-- Avatar group -->
<smart-avatar
  [group]="[
    { id: '1', imageUrl: 'a.png' },
    { id: '2', initials: 'CD' },
    { id: '3', initials: 'EF' }
  ]"
/>

<!-- With notification indicator (consumed by custom implementations) -->
<smart-avatar [imageUrl]="user.photo" notificationPosition="top" />

<!-- With options -->
<smart-avatar
  [imageUrl]="user.photo"
  [options]="{ placeholderType: 'initials', stackDirection: 'top-to-bottom' }"
/>

<!-- With external class -->
<smart-avatar [imageUrl]="user.photo" class="smart:m-2" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/avatar/avatar.component.ts`
- Standard: `packages/shared/angular/src/lib/components/avatar/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/avatar/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`AVATAR_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IAvatarItem`, `IAvatarOptions`, `SmartAvatarSize`, `SmartAvatarShape`)
