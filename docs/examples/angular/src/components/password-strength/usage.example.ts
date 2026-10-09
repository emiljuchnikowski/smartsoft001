// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PasswordStrengthComponent } from '@smartsoft001/angular';

// A placeholder, not a real credential: the meter rates whatever is typed.
const EXAMPLE_PASSWORD_VALUE = 'placeholder';

@Component({
  selector: 'docs-password-strength-usage-example',
  imports: [PasswordStrengthComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthUsageExampleComponent {
  readonly password = signal(EXAMPLE_PASSWORD_VALUE);
  readonly strong = signal(false);

  onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  onPasswordStrength(strong: boolean): void {
    this.strong.set(strong);
  }
}
// #endregion
