// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonComponent, IButtonOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-button-basic-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `<smart-button [options]="options">Save</smart-button>`,
})
export class ButtonBasicExampleComponent {
  saved = signal(false);

  options: IButtonOptions = {
    click: () => this.saved.set(true),
    variant: 'primary',
    size: 'md',
  };
}
// #endregion
