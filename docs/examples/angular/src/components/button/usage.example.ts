// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonComponent, IButtonOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-button-usage-example',
  imports: [ButtonComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonUsageExampleComponent {
  readonly saveCount = signal(0);

  readonly options: IButtonOptions = {
    type: 'submit',
    variant: 'primary',
    color: 'indigo',
    size: 'md',
    rounded: false,
    click: () => this.save(),
  };

  readonly disabled = false;

  save(): void {
    this.saveCount.update((count) => count + 1);
  }
}
// #endregion
