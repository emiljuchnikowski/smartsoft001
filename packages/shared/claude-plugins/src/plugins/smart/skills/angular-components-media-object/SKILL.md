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

The wrapper projects body content via `<ng-content />` into the `.smart-media-object-body` slot of the standard component.

### IMediaObjectOptions

```typescript
interface IMediaObjectOptions {
  alignment?: 'top' | 'center' | 'bottom' | 'stretched';
  position?: 'left' | 'right';
  responsive?: boolean;
  nested?: boolean;
  wide?: boolean;
}
```

The standard renders:

- `data-position` attribute: defaults to `'left'` when not provided
- `data-alignment` attribute: only set when `options.alignment` is provided

### MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN

```typescript
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `MediaObjectStandardComponent` with a custom implementation. Provide a `Type<MediaObjectBaseComponent>` to override.

```typescript
// In your app module or component providers:
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
