// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DateEditComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-date-edit-usage-example',
  imports: [DateEditComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateEditUsageExampleComponent {
  readonly birthDate = signal('1990-04-07');
  readonly isValid = signal(true);

  onValidChange(valid: boolean): void {
    this.isValid.set(valid);
  }
}
// #endregion
