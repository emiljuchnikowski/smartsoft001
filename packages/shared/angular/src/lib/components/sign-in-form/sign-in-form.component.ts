import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { SignInFormStandardComponent } from './standard';
import {
  ISignInFormOptions,
  ISignInFormSocialClick,
  ISignInFormSubmit,
  SmartSignInFormMode,
} from '../../models';
import { SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-sign-in-form',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-sign-in-form-standard
        [mode]="mode()"
        [disabled]="disabled()"
        [options]="options()"
        [class]="cssClass()"
        (submit)="submit.emit($event)"
        (socialClick)="socialClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SignInFormStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent {
  private injectedComponent = inject(SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  mode = input<SmartSignInFormMode>('sign-in');
  disabled = input<boolean>(false);
  options = input<ISignInFormOptions>();
  cssClass = input<string>('', { alias: 'class' });

  submit = output<ISignInFormSubmit>();
  socialClick = output<ISignInFormSocialClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    mode: this.mode(),
    disabled: this.disabled(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
