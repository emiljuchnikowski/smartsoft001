// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IInfoOptions, InfoComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-info-usage-example',
  imports: [InfoComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoUsageExampleComponent {
  readonly options: IInfoOptions = {
    text: 'We only use your email to send order updates.',
  };
}
// #endregion
