---
name: react-components-avatar
description: SmartAvatar React component API (@smartsoft001/react) — user picture with image/initials/icon placeholder, sizes, circle/rounded shapes, status dot and stacked groups, the 'avatar' registry key, SmartAvatarPreset and useAvatar.
user-invocable: false
---

# Avatar (`SmartAvatar`)

`SmartAvatar` shows a user picture: an image (`imageUrl`), initials, or a placeholder, in five sizes and two shapes, with an optional status dot in a corner (`notificationPosition`). With a non-empty `group` it renders a stack of avatars instead. `SmartAvatarStandard` (the default) is **unstyled markup** that exposes `size`, `shape`, the placeholder type and the stack direction as `data-*` attributes for your own CSS; the styled look comes from `SmartAvatarPreset`.

## When to Use This Skill

- Showing a user's picture or initials in a list, header or comment
- Showing a stacked group of participants (`group`)
- Adding an online/notification dot (`notificationPosition`)
- Styling avatars through the preset or your own CSS on the `data-*` attributes

## Exports

All from `@smartsoft001/react`.

| Export                | Kind      | What it is                                                                                                                                                           |
| --------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartAvatar`         | component | Renders the implementation registered as `components.avatar` on `SmartProvider`, `SmartAvatarStandard` by default.                                                   |
| `SmartAvatarPreset`   | component | Styled avatar variation (preset).                                                                                                                                    |
| `SmartAvatarStandard` | component | The default avatar rendering: unstyled markup exposing `size`, `shape`, `options.placeholderType` and, for a group, `options.stackDirection` as `data-*` attributes. |
| `useAvatar`           | hook      | The state every avatar variant shares: whether `group` holds avatars to stack.                                                                                       |

The preset's class helpers (`getAvatarImageClasses`, `getAvatarInitialsClasses`, `getAvatarIconWrapperClasses`, `getAvatarStatusClasses`, `getAvatarGroupContainerClasses`, `getAvatarGroupItemImageClasses`, `getAvatarGroupItemInitialsClasses`, `AVATAR_STATUS_WRAPPER`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartAvatarProps`

| Prop                    | Type                | Default    | Description                                                                                                    |
| ----------------------- | ------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `imageUrl?`             | `string`            | —          | Picture URL; when missing, the initials or the placeholder are shown.                                          |
| `initials?`             | `string`            | —          | Initials shown when there is no image.                                                                         |
| `size?`                 | `SmartAvatarSize`   | `'md'`     | The size scale (`xs` to `xl`). Styled by the preset; `data-size` on the standard.                              |
| `shape?`                | `SmartAvatarShape`  | `'circle'` | `circle` or `rounded` (rounded square). Styled by the preset; `data-shape` on the standard.                    |
| `notificationPosition?` | `'top' \| 'bottom'` | —          | Preset only: corner of the status dot of a single avatar; no dot when unset. `SmartAvatarStandard` ignores it. |
| `group?`                | `IAvatarItem[]`     | —          | Renders a stacked group instead of one avatar when non-empty.                                                  |
| `options?`              | `IAvatarOptions`    | —          | Placeholder type and stack direction.                                                                          |
| `className?`            | `string`            | —          | Classes on the outermost element (group container, status wrapper or the avatar).                              |

### `IAvatarOptions`

| Field              | Type                                 | Default           | Description                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholderType?` | `'icon' \| 'initials'`               | `'icon'`          | Fallback shown when there is no `imageUrl` (default `'icon'`). Initials are shown whenever `initials` is set; otherwise `SmartAvatarPreset` renders an SVG icon (`'icon'`) or an empty initials chip (`'initials'`), and `SmartAvatarStandard` renders a `·` placeholder. The standard also exposes the value as the `data-placeholder-type` attribute on its root element. |
| `stackDirection?`  | `'top-to-bottom' \| 'bottom-to-top'` | `'top-to-bottom'` | Stacking order of a `group` (default `'top-to-bottom'`). Purely visual: styled by `SmartAvatarPreset` (`'bottom-to-top'` reverses the stack); `SmartAvatarStandard` exposes it as the `data-stack-direction` attribute on the group container.                                                                                                                              |

### `IAvatarItem`

One avatar of a `group`.

| Field       | Type     | Default  | Description                        |
| ----------- | -------- | -------- | ---------------------------------- |
| `id`        | `string` | required | Key of the item.                   |
| `imageUrl?` | `string` | —        | Picture URL.                       |
| `initials?` | `string` | —        | Initials when there is no picture. |

### Related types

- `SmartAvatarSize`: `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` — Size scale of the avatar.
- `SmartAvatarShape`: `'circle' \| 'rounded'` — `circle` or `rounded` (rounded square).

## Usage

```tsx
import { SmartAvatar, SmartAvatarPreset } from '@smartsoft001/react';

export function Participants() {
  return (
    <div className="flex items-center gap-6">
      <SmartAvatarPreset
        imageUrl="/avatars/anna.jpg"
        size="lg"
        notificationPosition="top"
      />
      <SmartAvatarPreset
        initials="JK"
        shape="rounded"
        options={{ placeholderType: 'initials' }}
      />
      <SmartAvatarPreset
        size="sm"
        group={[
          { id: '1', imageUrl: '/avatars/anna.jpg' },
          { id: '2', initials: 'JK' },
          { id: '3', initials: 'MN' },
        ]}
        options={{ stackDirection: 'bottom-to-top' }}
      />
      {/* Through the registry: the standard markup unless a preset is registered. */}
      <SmartAvatar initials="AB" />
    </div>
  );
}
```

## Replacing the Implementation

`SmartAvatar` renders the component registered under the `'avatar'` key of `SmartProvider`'s `components`, and `SmartAvatarStandard` when nothing is registered there. Every `SmartAvatar` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartAvatarPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { avatar: SmartAvatarPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartAvatarPreset` is the styled (preset) implementation: register it under the `'avatar'` key of `SmartProvider`'s `components`, render it directly in place of `SmartAvatar`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useAvatar` hook

The state every avatar variant shares: whether `group` holds avatars to stack.

```ts
function useAvatar({ group }: Pick<SmartAvatarProps, 'group'>);
```

| Returns   | Type      | Description                                 |
| --------- | --------- | ------------------------------------------- |
| `isGroup` | `boolean` | `true` when `group` holds avatars to stack. |

```tsx
import { SmartAvatarProps, useAvatar } from '@smartsoft001/react';

export function InitialsAvatar({
  imageUrl,
  initials,
  group,
  className,
}: SmartAvatarProps) {
  const { isGroup } = useAvatar({ group });

  if (isGroup) {
    return (
      <div className={className}>
        {group?.map((item) => (
          <span key={item.id}>{item.initials}</span>
        ))}
      </div>
    );
  }

  return imageUrl ? (
    <img src={imageUrl} alt="" className={className} />
  ) : (
    <span className={className}>{initials ?? '?'}</span>
  );
}
```

## Styling

- `SmartAvatarStandard` carries no visual styling: style it with your own CSS on `data-size`, `data-shape`, `data-placeholder-type` and, for a group container, `data-stack-direction`.
- `SmartAvatarPreset` styles every size, both shapes, the status dot and the stacked group, with `smart:dark:` variants; `options.stackDirection: 'bottom-to-top'` reverses the stack there.

## File Locations

Source: `packages/shared/react/src/lib/components/avatar/` in the smartsoft001 repository.

- `avatar.tsx`: `SmartAvatar`
- `avatar.types.ts`: `SmartAvatarProps`
- `preset/avatar-preset.tsx`: `SmartAvatarPreset`
- `standard/avatar-standard.tsx`: `SmartAvatarStandard`
- `use-avatar.ts`: `useAvatar`
- `avatar.stories.tsx`: Storybook stories
