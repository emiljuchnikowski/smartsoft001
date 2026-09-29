// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { IToggleOptions, ToggleComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-toggle-usage-example',
  imports: [ToggleComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleUsageExampleComponent {
  readonly options: IToggleOptions = {
    label: 'Email notifications',
    description: 'Get an email when someone comments on your post.',
    labelPosition: 'right',
  };

  readonly emailNotifications = signal(true);
}
// #endregion
