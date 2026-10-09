---
name: angular-components-media-object
description: MediaObject layout component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# MediaObject Component

The `<smart-media-object>` component provides a flexible media-object layout wrapper with an InjectionToken-based extension mechanism. It pairs an image with adjacent body content (the classic media object pattern) and renders a default `MediaObjectStandardComponent` which can be replaced via `MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the media-object layout
- Developer asks about `<smart-media-object>` or `MediaObjectComponent`
- Developer needs an image-and-body layout (avatars next to text, thumbnails next to descriptions, etc.)

## Components

### MediaObjectComponent (`<smart-media-object>`)

Main wrapper component. Renders `MediaObjectStandardComponent` by default. When `MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Projects body content into the standard via `<ng-content />`.

### MediaObjectStandardComponent (`<smart-media-object-standard>`)

Default concrete implementation. Renders an `<img>` and a `.smart-media-object-body` slot inside a wrapper `<div>`. The wrapper exposes `data-position` and `data-alignment` attributes derived from `options` for CSS styling.

### MediaObjectBaseComponent (abstract)

Abstract base directive for extending custom media-object implementations. Declares `mediaUrl` (required), `mediaAlt` (required), `options`, and `cssClass`.

## API

### Inputs

| Input      | Type                                            | Default     | Description                                 |
| ---------- | ----------------------------------------------- | ----------- | ------------------------------------------- |
| `mediaUrl` | `InputSignal<string>`                           | required    | Image URL                                   |
| `mediaAlt` | `InputSignal<string>`                           | required    | Image alt text                              |
| `options`  | `InputSignal<IMediaObjectOptions \| undefined>` | `undefined` | Layout configuration                        |
| `class`    | `InputSignal<string>`                           | `''`        | External CSS classes (alias for `cssClass`) |

### Content Projection

The wrapper projects body content via `<ng-content />` into the `.smart-media-object-body` slot of the standard component, or into the default `<ng-content />` of a component registered through `MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN` (`MediaObjectPresetComponent` renders it in its body).

### IMediaObjectOptions

| Field        | Type                                           | Default  | Description                                                                                                                               |
| ------------ | ---------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `alignment`  | `'top' \| 'center' \| 'bottom' \| 'stretched'` | -        | Vertical alignment of the image against the body; the standard exposes it as `data-alignment` (only when set), the preset aligns the row. |
| `position`   | `'left' \| 'right'`                            | `'left'` | Side of the image; the standard exposes it as `data-position`, the preset reverses the row for `'right'`.                                 |
| `responsive` | `boolean`                                      | `false`  | Preset only: stacks the image above the body on small screens.                                                                            |
| `nested`     | `boolean`                                      | `false`  | Preset only: the spacing of a media object nested in another one.                                                                         |
| `wide`       | `boolean`                                      | `false`  | Preset only: a wider image (`w-32`).                                                                                                      |

```typescript
interface IMediaObjectOptions {
  alignment?: 'top' | 'center' | 'bottom' | 'stretched';
  position?: 'left' | 'right';
  responsive?: boolean;
  nested?: boolean;
  wide?: boolean;
}
```

### MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN

InjectionToken from `@smartsoft001/angular` that allows replacing the default `MediaObjectStandardComponent` with a custom implementation. Provide a `Type<MediaObjectBaseComponent>` in your application or component providers; `provideSmartPresets()` provides `MediaObjectPresetComponent` for it together with every other preset.

```typescript
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomMediaObjectComponent,
  },
];
```

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { MediaObjectBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-media-object',
  template: `
    <article [class]="cssClass()">
      <img [src]="mediaUrl()" [alt]="mediaAlt()" />
      <div class="body"><ng-content /></div>
    </article>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomMediaObjectComponent extends MediaObjectBaseComponent {}
```

The wrapper forwards `mediaUrl`, `mediaAlt`, `options` and the `class` (into the inherited `cssClass`), and projects its content into the implementation's default `<ng-content />`.

## Usage Examples

```html
<!-- Default media-object -->
<smart-media-object
  mediaUrl="https://example.com/avatar.png"
  mediaAlt="User avatar"
>
  <h3>Jane Doe</h3>
  <p>Software engineer.</p>
</smart-media-object>

<!-- With position and alignment -->
<smart-media-object
  mediaUrl="https://example.com/thumb.jpg"
  mediaAlt="Article thumbnail"
  [options]="{ position: 'right', alignment: 'center' }"
>
  <h3>Article title</h3>
  <p>Excerpt of the article body.</p>
</smart-media-object>

<!-- With external class -->
<smart-media-object
  class="smart:mt-4"
  mediaUrl="https://example.com/icon.png"
  mediaAlt="Feature icon"
>
  <p>Feature description.</p>
</smart-media-object>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/media-object/media-object.component.ts`
- Standard: `packages/shared/angular/src/lib/components/media-object/standard/standard.component.ts`
- Standard template: `packages/shared/angular/src/lib/components/media-object/standard/standard.component.html`
- Base class: `packages/shared/angular/src/lib/components/media-object/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IMediaObjectOptions`)

## Preset

`MediaObjectPresetComponent` (selector `smart-media-object-preset`) is a styled,
drop-in replacement for the standard component. It extends
`MediaObjectStandardComponent` and reuses its inputs, so registering it through
the token (or with `provideSmartPresets()`) restyles every `<smart-media-object>`.
It declares `cssClass` without the `class` alias: on the
`<smart-media-object-preset>` selector bind `[cssClass]`; on
`<smart-media-object>` pass `class` as usual.

Look: a flex row (`smart:flex smart:gap-4`) with a rounded, cover-fitted
thumbnail (`smart:size-16 smart:rounded-lg smart:object-cover smart:shrink-0`)
beside small, muted body text (`smart:text-sm smart:text-gray-700
smart:dark:text-gray-300`). All utilities are `smart:`-prefixed and dark-mode
aware.

`IMediaObjectOptions` drives every variant (no new fields):

- `position: 'right'` reverses the row (`smart:flex-row-reverse`).
- `alignment: 'top' | 'center' | 'bottom'` maps to
  `smart:items-start | items-center | items-end`; `'stretched'` instead makes
  the media fill the row height (`smart:self-stretch smart:h-auto`).
- `responsive: true` stacks into a column on mobile then rows out from `sm`
  (`smart:flex-col smart:sm:flex-row`, reversed when `position: 'right'`).
- `nested: true` tightens the gap to `smart:gap-3` and indents with
  `smart:mt-4`.
- `wide: true` widens the thumbnail to `smart:w-32` (keeping a `smart:h-16`
  height).

`data-role` hooks (`root`, `media`, `body`) and the `data-position` /
`data-alignment` attributes are exposed for testing and targeting; the
`smart-media-object-body` marker class is preserved for content projection
parity with the standard component.

Register it as the standard replacement by providing it for `MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN`.

```ts
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
import { MediaObjectPresetComponent } from '@smartsoft001/angular';

providers: [
  {
    provide: MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
    useValue: MediaObjectPresetComponent,
  },
],
```

The class recipes are internal to the preset (not exported).

Gaps: the media is always an `<img>` (no icon/video slot), and `wide` uses a
fixed `w-32`/`h-16` footprint rather than an intrinsic aspect ratio.
