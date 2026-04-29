---
name: angular-components-stats
description: Stats component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Stats Component

The `<smart-stats>` component renders a list of statistic cards (label/value pairs with optional previous value, change indicator, trend, icon, and action slot). It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `StatsBaseComponent` defines the shared API — optional `IStatsOptions` and `cssClass` (alias `class`). `StatsStandardComponent` is a barebones placeholder concrete implementation. `StatsComponent` is the public wrapper that renders `StatsStandardComponent` by default and accepts a custom replacement via `STATS_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the stats component
- Developer asks about `<smart-stats>`, `StatsComponent`, `StatsStandardComponent`, or `StatsBaseComponent`

## Components

### StatsComponent (`<smart-stats>`)

Main wrapper component. Renders `StatsStandardComponent` by default. When `STATS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### StatsStandardComponent (`<smart-stats-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">` and a `<dl>` with one `<div class="item">` per item. Each item renders an optional icon (`iconTpl` in `<div class="icon">`), label (`<dt class="label">`), value (`<dd class="value">`), optional previous value (`<dd class="previous">`), optional change with `data-trend` attribute (`<dd class="change">`), and optional action template (`actionTpl` in `<div class="action">`). The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### StatsBaseComponent (abstract)

Abstract base directive for extending custom stats implementations. Exposes `options` as an `InputSignal<IStatsOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                      | Default | Description                                    |
| --------- | ----------------------------------------- | ------- | ---------------------------------------------- |
| `options` | `InputSignal<IStatsOptions \| undefined>` | -       | Optional configuration (title, items, columns) |
| `class`   | `InputSignal<string>`                     | `''`    | External CSS classes (alias for `cssClass`)    |

### IStatsOptions

```typescript
interface IStatsOptions {
  title?: string;
  items: IStatItem[];
  columns?: 1 | 2 | 3 | 4;
}

interface IStatItem {
  label: string;
  value: string | number;
  previousValue?: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  iconTpl?: TemplateRef<unknown>;
  actionTpl?: TemplateRef<unknown>;
  ariaLabel?: string;
}
```

`items` is required. The default `StatsStandardComponent` consumes every property; a section is rendered only when its template/string is provided. The `trend` value is exposed via the `data-trend` attribute on `<dd class="change">` for downstream styling. `columns` is a hint for custom implementations to lay out the grid; the default placeholder ignores it.

## STATS_STANDARD_COMPONENT_TOKEN

```typescript
import { STATS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `StatsStandardComponent` with a custom implementation. Provide a `Type<StatsBaseComponent>` to override.

```typescript
providers: [
  {
    provide: STATS_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomStatsComponent,
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
import { NgTemplateOutlet } from '@angular/common';

import { StatsBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-stats',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      <dl>
        @for (item of options()?.items ?? []; track $index) {
          <div>
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
            @if (item.change) {
              <dd>{{ item.change }}</dd>
            }
          </div>
        }
      </dl>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomStatsComponent extends StatsBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-stats'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Simple stats -->
<smart-stats
  [options]="{
    items: [
      { label: 'Number of deploys', value: 405 },
      { label: 'Average deploy time', value: '3.65 mins' },
      { label: 'Number of servers', value: 3 },
      { label: 'Success rate', value: '98.5%' },
    ],
  }"
/>

<!-- With title and trending changes -->
<smart-stats
  [options]="{
    title: 'Last 30 days',
    items: [
      { label: 'Revenue', value: '$405,091', change: '+4.75%', trend: 'up' },
      { label: 'Overdue invoices', value: '$12,787', change: '+54.02%', trend: 'down' },
      { label: 'Outstanding invoices', value: '$245,988', change: '-1.39%', trend: 'neutral' },
    ],
  }"
/>

<!-- With previous value -->
<smart-stats
  [options]="{
    title: 'Last 30 days',
    items: [
      { label: 'Total Subscribers', value: '71,897', previousValue: '70,946', change: '+12%', trend: 'up' },
      { label: 'Avg. Open Rate', value: '58.16%', previousValue: '56.14%', change: '+2.02%', trend: 'up' },
    ],
  }"
/>

<!-- With icon and action templates -->
<ng-template #subscribersIcon>
  <svg viewBox="0 0 24 24"><!-- ... --></svg>
</ng-template>

<ng-template #viewAll>
  <a href="/stats/subscribers">View all</a>
</ng-template>

<smart-stats
  [options]="{
    title: 'Last 30 days',
    items: [
      {
        label: 'Total Subscribers',
        value: '71,897',
        change: '+122',
        trend: 'up',
        iconTpl: subscribersIcon,
        actionTpl: viewAll,
      },
    ],
  }"
/>

<!-- With column hint -->
<smart-stats
  [options]="{
    title: 'Last 30 days',
    columns: 3,
    items: [
      { label: 'Total Subscribers', value: '71,897' },
      { label: 'Avg. Open Rate', value: '58.16%' },
      { label: 'Avg. Click Rate', value: '24.57%' },
    ],
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/stats/stats.component.ts`
- Standard: `packages/shared/angular/src/lib/components/stats/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/stats/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`STATS_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IStatsOptions`, `IStatItem`)
