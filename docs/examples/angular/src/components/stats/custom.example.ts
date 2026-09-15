// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  IStatsOptions,
  STATS_STANDARD_COMPONENT_TOKEN,
  StatsBaseComponent,
  StatsComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-stats',
  template: `
    <div [class]="containerClasses()" [attr.data-columns]="columns()">
      @if (options()?.title) {
        <h3 class="docs-stats__title">{{ options()!.title }}</h3>
      }

      <dl class="docs-stats__grid">
        @for (item of options()?.items ?? []; track $index) {
          <div
            class="docs-stats__item"
            [attr.aria-label]="item.ariaLabel ?? null"
          >
            <dt class="docs-stats__label">{{ item.label }}</dt>
            <dd class="docs-stats__value">{{ item.value }}</dd>
            @if (
              item.previousValue !== undefined && item.previousValue !== null
            ) {
              <dd class="docs-stats__previous">{{ item.previousValue }}</dd>
            }
            @if (item.change) {
              <dd
                class="docs-stats__change"
                [attr.data-trend]="item.trend ?? null"
              >
                {{ item.change }}
              </dd>
            }
          </div>
        }
      </dl>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStatsComponent extends StatsBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  columns = computed(() => this.options()?.columns ?? 3);

  containerClasses = computed(() =>
    ['docs-stats', this.cssClass()].filter(Boolean).join(' '),
  );
}

@Component({
  selector: 'docs-stats-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatsComponent],
  // The token swaps the standard stats for the custom one everywhere below this
  // component, so consumers keep writing `<smart-stats>`.
  providers: [
    {
      provide: STATS_STANDARD_COMPONENT_TOKEN,
      useValue: CustomStatsComponent,
    },
  ],
  template: `<smart-stats [options]="options" />`,
})
export class StatsCustomExampleComponent {
  options: IStatsOptions = {
    title: 'By the numbers',
    columns: 3,
    items: [
      {
        label: 'Accuracy rate',
        value: '99.95%',
        previousValue: 'in fulfilling orders',
        change: '+0.4% this quarter',
        trend: 'up',
      },
      {
        label: 'Startup businesses',
        value: '2,000+',
        previousValue: 'partner with us',
      },
      {
        label: 'Happy customers',
        value: '85%',
        previousValue: 'this year alone',
      },
    ],
  };
}
// #endregion
