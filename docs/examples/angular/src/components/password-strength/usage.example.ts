// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PasswordStrengthComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-password-strength-usage-example',
  imports: [PasswordStrengthComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthUsageExampleComponent {
  readonly password = signal('secret');
  readonly showHint = true;

  readonly strong = signal(false);

  onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  onPasswordStrength(strong: boolean): void {
    this.strong.set(strong);
  }
}
// #endregion
