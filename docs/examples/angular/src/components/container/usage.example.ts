// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent, IContainerOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-container-usage-example',
  imports: [ContainerComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerUsageExampleComponent {
  readonly options: IContainerOptions = {
    mode: 'constrained',
    padding: 'mobile',
    narrow: false,
  };
}
// #endregion
