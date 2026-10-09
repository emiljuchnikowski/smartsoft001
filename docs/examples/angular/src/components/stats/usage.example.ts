// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IStatsOptions, StatsComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-stats-usage-example',
  imports: [StatsComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsUsageExampleComponent {
  readonly options: IStatsOptions = {
    title: 'Last 30 days',
    items: [
      {
        label: 'Total subscribers',
        value: '71,897',
        previousValue: '70,946',
        change: '12%',
        trend: 'up',
      },
      { label: 'Avg. open rate', value: '58.16%', previousValue: '56.14%' },
      { label: 'Avg. click rate', value: '24.57%', previousValue: '28.62%' },
    ],
  };
}
// #endregion
