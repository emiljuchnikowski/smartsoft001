import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-input-error',
  template: `
    @if (errors()?.required) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.required' | translate }}
      </span>
    } @else {
      @if (errors()?.confirm) {
        <span [class]="errorClasses()">
          {{ 'INPUT.ERRORS.confirm' | translate }}
        </span>
      }
    }

    @if (errors()?.invalidNip) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidNip' | translate }}
      </span>
    }

    @if (errors()?.invalidUnique) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidUnique' | translate }}
      </span>
    }

    @if (errors()?.email) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidEmailFormat' | translate }}
      </span>
    }

    @if (errors()?.phoneNumber) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidPhoneNumberFormat' | translate }}
      </span>
    }

    @if (errors()?.pesel) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidPeselFormat' | translate }}
      </span>
    }

    @if (errors()?.minlength) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidMinLength' | translate }}:
        {{ errors()?.minlength?.requiredLength }}
      </span>
    }

    @if (errors()?.maxlength) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidMaxLength' | translate }}:
        {{ errors()?.maxlength?.requiredLength }}
      </span>
    }

    @if (errors()?.min) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidMin' | translate }}: {{ errors()?.min?.min }}
      </span>
    }

    @if (errors()?.max) {
      <span [class]="errorClasses()">
        {{ 'INPUT.ERRORS.invalidMax' | translate }}: {{ errors()?.max?.max }}
      </span>
    }

    @if (errors()?.customMessage) {
      <span [class]="errorClasses()">
        {{ errors()?.customMessage }}
      </span>
    }
  `,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  errors = input<any | undefined>(undefined);

  errorClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:text-red-600',
      'smart:dark:text-red-400',
      'smart:mt-1',
    ].join(' '),
  );
}
