// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DateRangeComponent } from '@smartsoft001/angular';
import { IDateRange } from '@smartsoft001/domain-core';

@Component({
  selector: 'docs-date-range-usage-example',
  imports: [DateRangeComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeUsageExampleComponent {
  readonly range = signal<IDateRange | undefined>({
    start: '2026-04-01',
    end: '2026-04-30',
  });

  onRangeChange(range: IDateRange | undefined): void {
    this.range.set(range);
  }
}
// #endregion
