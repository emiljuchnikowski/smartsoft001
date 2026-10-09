---
name: react-components-media-object
description: SmartMediaObject React component API (@smartsoft001/react) — image beside a body (children) with left/right position, top/center/bottom/stretched alignment, responsive, nested and wide options, the 'media-object' registry key and SmartMediaObjectPreset.
user-invocable: false
---

# Media Object (`SmartMediaObject`)

`SmartMediaObject` lays an image (`mediaUrl` / `mediaAlt`) beside a body (`children`), the classic comment / list-entry layout. `options.position` puts the image left (default) or right, `options.alignment` aligns it to the body, and `responsive`, `nested` and `wide` adjust the layout in the preset. The standard rendering exposes position and alignment as `data-*` attributes.

## When to Use This Skill

- A comment, review or notification row with an avatar or thumbnail next to text
- Nested replies (`options.nested`)
- Restyling every media object (the `media-object` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                     | Kind      | What it is                                                                                                                       |
| -------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `SmartMediaObject`         | component | Renders the implementation registered as `components['media-object']` on `SmartProvider`, `SmartMediaObjectStandard` by default. |
| `SmartMediaObjectPreset`   | component | Styled media-object variation (preset).                                                                                          |
| `SmartMediaObjectStandard` | component | The default media-object rendering: the media `<img>` and a `.smart-media-object-body` holding `children`.                       |

The preset's class helpers (`getMediaObjectRootClasses`, `getMediaObjectMediaClasses`, `getMediaObjectBodyClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartMediaObjectProps`

| Prop         | Type                  | Default  | Description                         |
| ------------ | --------------------- | -------- | ----------------------------------- |
| `mediaUrl`   | `string`              | required | Image URL.                          |
| `mediaAlt`   | `string`              | required | Image alt text.                     |
| `options?`   | `IMediaObjectOptions` | —        | Layout options.                     |
| `className?` | `string`              | —        | Classes on the root element.        |
| `children?`  | `ReactNode`           | —        | The body content, beside the media. |

### `IMediaObjectOptions`

| Field         | Type                                           | Default  | Description                                                          |
| ------------- | ---------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `alignment?`  | `'top' \| 'center' \| 'bottom' \| 'stretched'` | —        | Vertical alignment of the image against the body (`data-alignment`). |
| `position?`   | `'left' \| 'right'`                            | `'left'` | Side of the image (`data-position`).                                 |
| `responsive?` | `boolean`                                      | `false`  | Preset: stacks the image above the body on small screens.            |
| `nested?`     | `boolean`                                      | `false`  | Preset: spacing for a media object nested in another one.            |
| `wide?`       | `boolean`                                      | `false`  | Preset: a larger image footprint.                                    |

## Usage

```tsx
import { SmartMediaObject, SmartMediaObjectPreset } from '@smartsoft001/react';

export function Comment() {
  return (
    <SmartMediaObjectPreset
      mediaUrl="/avatars/anna.jpg"
      mediaAlt="Anna"
      options={{ alignment: 'top' }}
    >
      <h4>Anna Kowalska</h4>
      <p>Looks great, ship it.</p>
      <SmartMediaObject
        mediaUrl="/avatars/jan.jpg"
        mediaAlt="Jan"
        options={{ nested: true }}
      >
        <p>Thanks!</p>
      </SmartMediaObject>
    </SmartMediaObjectPreset>
  );
}
```

## Replacing the Implementation

`SmartMediaObject` renders the component registered under the `'media-object'` key of `SmartProvider`'s `components`, and `SmartMediaObjectStandard` when nothing is registered there. Every `SmartMediaObject` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartMediaObjectPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'media-object': SmartMediaObjectPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartMediaObjectPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartMediaObject`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartMediaObjectProps } from '@smartsoft001/react';

export function RowMediaObject({
  mediaUrl,
  mediaAlt,
  options,
  className,
  children,
}: SmartMediaObjectProps) {
  const image = <img src={mediaUrl} alt={mediaAlt} width={48} height={48} />;

  return (
    <div className={className} style={{ display: 'flex', gap: 12 }}>
      {options?.position !== 'right' && image}
      <div>{children}</div>
      {options?.position === 'right' && image}
    </div>
  );
}
```

## Styling

- `SmartMediaObjectStandard` renders the `<img>` and a `.smart-media-object-body` with `data-position` / `data-alignment` and no layout styles; `SmartMediaObjectPreset` keeps those hooks and adds the flex layout and a rounded thumbnail.

## File Locations

Source: `packages/shared/react/src/lib/components/media-object/` in the smartsoft001 repository.

- `media-object.tsx`: `SmartMediaObject`
- `media-object.types.ts`: `SmartMediaObjectProps`
- `preset/media-object-preset.tsx`: `SmartMediaObjectPreset`
- `standard/media-object-standard.tsx`: `SmartMediaObjectStandard`
- `media-object.stories.tsx`: Storybook stories
