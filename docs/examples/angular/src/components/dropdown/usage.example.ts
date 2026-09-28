// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  DropdownComponent,
  IDropdownItem,
  IDropdownOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-dropdown-usage-example',
  imports: [DropdownComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownUsageExampleComponent {
  readonly options: IDropdownOptions = {
    variant: 'with-header',
    headerLabel: 'Signed in as tom@example.com',
  };

  readonly items: IDropdownItem[] = [
    { id: 'settings', label: 'Account settings' },
    { id: 'support', label: 'Support' },
    { id: 'license', label: 'License', disabled: true },
    { id: 'divider', label: '', divider: true },
    { id: 'sign-out', label: 'Sign out' },
  ];

  readonly selectedId = signal<string | null>(null);

  onSelect({ itemId }: { itemId: string }): void {
    this.selectedId.set(itemId);
  }
}
// #endregion
