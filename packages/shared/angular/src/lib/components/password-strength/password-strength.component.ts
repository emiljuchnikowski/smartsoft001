import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { PasswordStrengthBaseComponent } from './base';
import { PasswordStrengthStandardComponent } from './standard';
import { PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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

  componentInputs = computed(() => ({
    passwordToCheck: this.passwordToCheck(),
    showHint: this.showHint(),
    cssClass: this.cssClass(),
  }));

  private outlet = viewChild(NgComponentOutlet);

  constructor() {
    let subscription: { unsubscribe(): void } | null = null;

    effect((onCleanup) => {
      const instance = this.outlet()?.componentInstance as
        | PasswordStrengthBaseComponent
        | null
        | undefined;

      subscription?.unsubscribe();
      subscription = null;

      if (instance) {
        subscription = instance.passwordStrength.subscribe((value: boolean) =>
          this.passwordStrength.emit(value),
        );
      }

      onCleanup(() => {
        subscription?.unsubscribe();
        subscription = null;
      });
    });
  }
}
