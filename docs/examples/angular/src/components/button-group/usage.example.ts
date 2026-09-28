// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ButtonGroupComponent,
  IButtonGroupButton,
  IButtonGroupOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-button-group-usage-example',
  imports: [ButtonGroupComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupUsageExampleComponent {
  readonly buttons: IButtonGroupButton[] = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
  ];

  readonly options: IButtonGroupOptions = { variant: 'basic' };

  readonly view = signal('week');

  onButtonClick({ buttonId }: { buttonId: string }): void {
    this.view.set(buttonId);
  }
}
// #endregion
