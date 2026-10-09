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
    color: 'emerald',
    size: 'lg',
    click: () => this.save(),
  };

  save(): void {
    this.saveCount.update((count) => count + 1);
  }
}
// #endregion
