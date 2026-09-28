// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { LoaderComponent, SmartColor, SmartSize } from '@smartsoft001/angular';

@Component({
  selector: 'docs-loader-usage-example',
  imports: [LoaderComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderUsageExampleComponent {
  readonly size: SmartSize = 'lg';
  readonly color: SmartColor = 'emerald';

  // Flip this to false when the request finishes; the spinner disappears.
  readonly loading = signal(true);
}
// #endregion
