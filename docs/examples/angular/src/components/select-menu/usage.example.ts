// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ISelectMenuOptions,
  SelectMenuComponent,
  SelectMenuValue,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-select-menu-usage-example',
  imports: [SelectMenuComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMenuUsageExampleComponent {
  readonly options: ISelectMenuOptions = {
    placeholder: 'Choose a plan',
    ariaLabel: 'Subscription plan',
    items: [
      { value: 'starter', label: 'Starter' },
      { value: 'pro', label: 'Professional' },
      { value: 'enterprise', label: 'Enterprise', disabled: true },
    ],
  };

  readonly plan = signal<SelectMenuValue>(null);
  readonly disabled = false;
}
// #endregion
