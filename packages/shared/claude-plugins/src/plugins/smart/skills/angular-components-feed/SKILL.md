---
name: angular-components-feed
description: Feed (timeline/activity) component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Feed Component

The `<smart-feed>` component renders a vertical timeline of activity events with optional title, description, per-event icon/avatar, link, timestamp, description, nested comments, an empty state, an optional comment-submit slot, and a bottom footer slot. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `FeedBaseComponent` defines the shared API — optional `IFeedOptions` and `cssClass` (alias `class`). `FeedStandardComponent` is a barebones placeholder concrete implementation. `FeedComponent` is the public wrapper that renders `FeedStandardComponent` by default and accepts a custom replacement via `FEED_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the feed/timeline component
- Developer asks about `<smart-feed>`, `FeedComponent`, `FeedStandardComponent`, or `FeedBaseComponent`

## Components

### FeedComponent (`<smart-feed>`)

Main wrapper component. Renders `FeedStandardComponent` by default. When `FEED_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### FeedStandardComponent (`<smart-feed-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">`, optional `<p class="description">`, and a `<ol role="list">` with one `<li class="event">` per event. Each event renders the icon/avatar (icon template wins over avatar URL), an optional `<time class="timestamp">`, the title (rendered as `<a class="title">` if `href` is provided, otherwise `<span class="title">`), an optional description, and a nested `<ul class="comments">` with one `<li class="comment">` per comment (avatar, author name, optional timestamp, content). When events list is empty, the optional `emptyTpl` is rendered inside `<div class="empty">`. An optional `commentSubmitTpl` renders inside `<div class="comment-submit">`. A bottom `footerTpl` renders inside `<div class="footer">`. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### FeedBaseComponent (abstract)

Abstract base directive for extending custom feed implementations. Exposes `options` as an `InputSignal<IFeedOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                     | Default | Description                                                         |
| --------- | ---------------------------------------- | ------- | ------------------------------------------------------------------- |
| `options` | `InputSignal<IFeedOptions \| undefined>` | -       | Optional configuration (title, description, events, slots, variant) |
| `class`   | `InputSignal<string>`                    | `''`    | External CSS classes (alias for `cssClass`)                         |

### IFeedOptions

```typescript
interface IFeedOptions {
  title?: string;
  description?: string;
  events?: IFeedEvent[];
  variant?: 'simple' | 'with-comments' | 'multiple-types';
  commentSubmitTpl?: TemplateRef<unknown>;
  emptyTpl?: TemplateRef<unknown>;
  footerTpl?: TemplateRef<unknown>;
}

interface IFeedEvent {
  id?: string;
  title: string;
  description?: string;
  timestamp?: string;
  iconTpl?: TemplateRef<unknown>;
  avatarUrl?: string;
  href?: string;
  type?: string;
  comments?: IFeedComment[];
  ariaLabel?: string;
}

interface IFeedComment {
  id?: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  timestamp?: string;
}
```

All properties are optional except `IFeedEvent.title` and `IFeedComment.{authorName, content}`. The default `FeedStandardComponent` consumes every property; a section is rendered only when its template/string is provided. Within an event, `iconTpl` takes precedence over `avatarUrl` when both are set. `variant` is a hint for custom implementations registered via the token.

## FEED_STANDARD_COMPONENT_TOKEN

```typescript
import { FEED_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `FeedStandardComponent` with a custom implementation. Provide a `Type<FeedBaseComponent>` to override.

```typescript
providers: [
  { provide: FEED_STANDARD_COMPONENT_TOKEN, useValue: MyCustomFeedComponent },
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
import { NgTemplateOutlet } from '@angular/common';

import { FeedBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-feed',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      <ol>
        @for (e of options()?.events ?? []; track e.id ?? $index) {
          <li>
            @if (e.timestamp) {
              <time>{{ e.timestamp }}</time>
            }
            <span>{{ e.title }}</span>
          </li>
        }
      </ol>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomFeedComponent extends FeedBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-feed'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Simple timeline with icons -->
<ng-template #applyIcon>
  <svg class="apply-icon"></svg>
</ng-template>

<smart-feed
  [options]="{
    title: 'Application activity',
    events: [
      { title: 'Applied to Front End Developer', timestamp: 'Sep 20', iconTpl: applyIcon },
      { title: 'Advanced to phone screening', timestamp: 'Sep 22' },
      { title: 'Completed phone screening', timestamp: 'Sep 28' },
    ],
  }"
/>

<!-- With comments -->
<smart-feed
  [options]="{
    events: [
      {
        title: 'Discussion',
        timestamp: '3d ago',
        comments: [
          { authorName: 'Lindsay', content: 'Looks good to me' },
          { authorName: 'Tom', authorAvatarUrl: '/img/tom.jpg', content: 'Approved', timestamp: '1d ago' },
        ],
      },
    ],
  }"
/>

<!-- With comment-submit slot and footer -->
<ng-template #commentForm>
  <form>
    <textarea placeholder="Add your comment..."></textarea
    ><button type="submit">Comment</button>
  </form>
</ng-template>
<ng-template #footer><a href="#">Load more &rarr;</a></ng-template>

<smart-feed
  [options]="{
    events: [{ title: 'Created invoice', timestamp: '7d ago' }],
    commentSubmitTpl: commentForm,
    footerTpl: footer,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/feed/feed.component.ts`
- Standard: `packages/shared/angular/src/lib/components/feed/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/feed/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`FEED_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IFeedOptions`, `IFeedEvent`, `IFeedComment`, `SmartFeedVariant`)
