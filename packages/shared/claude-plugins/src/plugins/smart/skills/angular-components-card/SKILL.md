---
name: angular-components-card
description: Card component API, variants, and usage patterns for @smartsoft001/angular
user-invocable: false
---

# Card Component

Flexible card container with multiple Tailwind UI variants. Supports header/footer sections, gray backgrounds, well styles, edge-to-edge on mobile, and dark mode.

## API

### Selector

`<smart-card>`

### Inputs

| Input       | Type           | Default     | Description         |
| ----------- | -------------- | ----------- | ------------------- |
| `options`   | `ICardOptions` | `undefined` | Card configuration  |
| `hasHeader` | `boolean`      | `false`     | Show header section |
| `hasFooter` | `boolean`      | `false`     | Show footer section |

### ICardOptions

```typescript
type SmartCardVariant =
  | 'basic'
  | 'edge-to-edge'
  | 'well'
  | 'well-on-gray'
  | 'well-edge-to-edge';

interface ICardOptions {
  title?: string;
  variant?: SmartCardVariant;
  grayFooter?: boolean;
  grayBody?: boolean;
  buttons?: Array<IIconButtonOptions>;
}
```

### Content Projection

| Selector       | Description    |
| -------------- | -------------- |
| `[cardHeader]` | Header content |
| default        | Body content   |
| `[cardFooter]` | Footer content |

## Usage

```html
<!-- Basic -->
<smart-card><p>Content</p></smart-card>

<!-- With header and footer -->
<smart-card
  [options]="{ title: 'Title', grayFooter: true }"
  [hasHeader]="true"
  [hasFooter]="true"
>
  <p>Body</p>
  <div cardFooter>Footer</div>
</smart-card>

<!-- Well variant -->
<smart-card [options]="{ variant: 'well' }"><p>Well content</p></smart-card>
```

## File Locations

- Component: `packages/shared/angular/src/lib/components/card/card.component.ts`
- Tests: `packages/shared/angular/src/lib/components/card/card.component.spec.ts`
- Stories: `packages/shared/angular/src/lib/components/card/card.component.stories.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICardOptions`, `SmartCardVariant`)

## Tailwind Classes

All classes use `smart:` prefix. Container base: `smart:overflow-hidden smart:rounded-lg smart:bg-white smart:shadow-sm`. Dark mode: `dark:smart:bg-gray-800/50 dark:smart:shadow-none dark:smart:outline dark:smart:-outline-offset-1 dark:smart:outline-white/10`.
