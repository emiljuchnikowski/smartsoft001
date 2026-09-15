// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN,
  PasswordStrengthBaseComponent,
  PasswordStrengthComponent,
} from '@smartsoft001/angular';

const VERDICTS: Record<string, string> = {
  poor: 'Poor',
  notGood: 'Could be better',
  good: 'Strong',
};

@Component({
  selector: 'docs-custom-password-strength',
  template: `
    <div [class]="containerClasses()">
      <div class="docs-password-strength__bars">
        @for (barClass of barClasses(); track $index) {
          <span class="docs-password-strength__bar" [class]="barClass"></span>
        }
      </div>

      @if (verdict()) {
        <p class="docs-password-strength__msg" [class]="msgClass()">
          {{ verdict() }}
        </p>
      }

      @if (showHint() && missing().length) {
        <ul class="docs-password-strength__hints">
          @for (requirement of missing(); track requirement) {
            <li class="docs-password-strength__hint-item">{{ requirement }}</li>
          }
        </ul>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPasswordStrengthComponent extends PasswordStrengthBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  // The base class already computes strength, barClasses, msgClass and
  // containerClasses, and emits passwordStrength from its own effect.
  readonly verdict = computed(() => VERDICTS[this.msg()] ?? '');

  readonly missing = computed(() => {
    const { lowerLetters, upperLetters, symbols, passLength } = this.result();
    return [
      lowerLetters ? '' : 'a lowercase letter',
      upperLetters ? '' : 'an uppercase letter',
      symbols ? '' : 'a special character',
      passLength ? '' : 'more than 6 characters',
    ].filter(Boolean);
  });
}

@Component({
  selector: 'docs-password-strength-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PasswordStrengthComponent],
  // The token swaps the standard meter for the custom one everywhere below
  // this component, so consumers keep writing `<smart-password-strength>`.
  providers: [
    {
      provide: PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN,
      useValue: CustomPasswordStrengthComponent,
    },
  ],
  template: `
    <smart-password-strength
      [passwordToCheck]="password()"
      [showHint]="true"
      (passwordStrength)="strong.set($event)"
    />
  `,
})
export class PasswordStrengthCustomExampleComponent {
  readonly password = signal('abc');
  readonly strong = signal(false);
}
// #endregion
