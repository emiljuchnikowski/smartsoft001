// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ButtonGroupComponent,
  IButtonGroupButton,
  IButtonGroupButtonClick,
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

  readonly view = signal('week');

  onButtonClick({ buttonId }: IButtonGroupButtonClick): void {
    this.view.set(buttonId);
  }
}
// #endregion
