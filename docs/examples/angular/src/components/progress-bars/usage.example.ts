// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  IProgressBarsOptions,
  IProgressStepClick,
  ProgressBarsComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-progress-bars-usage-example',
  imports: [ProgressBarsComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarsUsageExampleComponent {
  readonly options: IProgressBarsOptions = {
    layout: 'panels',
    ariaLabel: 'Checkout progress',
    steps: [
      { id: 'shipping', index: '01', name: 'Shipping', status: 'complete' },
      { id: 'payment', index: '02', name: 'Payment', status: 'current' },
      { id: 'review', index: '03', name: 'Review', status: 'upcoming' },
    ],
  };

  readonly lastStep = signal<string | null>(null);

  onStepClick({ stepId }: IProgressStepClick): void {
    this.lastStep.set(stepId);
  }
}
// #endregion
