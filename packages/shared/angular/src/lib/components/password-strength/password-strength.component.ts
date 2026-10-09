import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { PasswordStrengthStandardComponent } from './standard';
import { PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-password-strength',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-password-strength-standard
        [passwordToCheck]="passwordToCheck()"
        [showHint]="showHint()"
        [class]="cssClass()"
        (passwordStrength)="passwordStrength.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [PasswordStrengthStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent {
  private injectedComponent = inject(
    PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN,
    { optional: true },
  );

  passwordToCheck = input.required<string>();
  showHint = input.required<boolean>();
  cssClass = input<string>('', { alias: 'class' });

  passwordStrength = output<boolean>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      passwordToCheck: this.passwordToCheck(),
      showHint: this.showHint(),
      cssClass: this.cssClass(),
    }),
  );

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      passwordStrength: this.passwordStrength,
    });
  }
}
