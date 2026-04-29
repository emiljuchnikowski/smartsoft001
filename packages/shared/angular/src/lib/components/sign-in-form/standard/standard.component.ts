import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { SignInFormBaseComponent } from '../base';

@Component({
  selector: 'smart-sign-in-form-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class SignInFormStandardComponent extends SignInFormBaseComponent {
  protected email = signal('');
  protected password = signal('');

  protected onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  protected onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.disabled()) return;
    this.submit.emit({
      email: this.email(),
      password: this.password(),
      mode: this.mode(),
    });
  }

  protected onSocialClick(providerId: string): void {
    if (this.disabled()) return;
    this.socialClick.emit({ providerId, mode: this.mode() });
  }
}
