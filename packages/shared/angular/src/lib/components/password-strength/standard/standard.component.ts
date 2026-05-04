import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PasswordStrengthBaseComponent } from '../base';

@Component({
  selector: 'smart-password-strength-standard',
  templateUrl: './standard.component.html',
  imports: [TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthStandardComponent extends PasswordStrengthBaseComponent {}
