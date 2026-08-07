import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-input-error-preset',
  template: `
    <ng-template #errIcon>
      <svg
        [class]="iconClasses()"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
    </ng-template>

    @if (errors()?.required) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>{{ 'INPUT.ERRORS.required' | translate }}</span>
      </p>
    } @else {
      @if (errors()?.confirm) {
        <p [class]="rowClasses()" data-role="error-message" role="alert">
          <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
          <span>{{ 'INPUT.ERRORS.confirm' | translate }}</span>
        </p>
      }
    }

    @if (errors()?.invalidNip) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>{{ 'INPUT.ERRORS.invalidNip' | translate }}</span>
      </p>
    }

    @if (errors()?.invalidUnique) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>{{ 'INPUT.ERRORS.invalidUnique' | translate }}</span>
      </p>
    }

    @if (errors()?.email) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>{{ 'INPUT.ERRORS.invalidEmailFormat' | translate }}</span>
      </p>
    }

    @if (errors()?.phoneNumber) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>{{ 'INPUT.ERRORS.invalidPhoneNumberFormat' | translate }}</span>
      </p>
    }

    @if (errors()?.pesel) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>{{ 'INPUT.ERRORS.invalidPeselFormat' | translate }}</span>
      </p>
    }

    @if (errors()?.minlength) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>
          {{ 'INPUT.ERRORS.invalidMinLength' | translate }}:
          {{ errors()?.minlength?.requiredLength }}
        </span>
      </p>
    }

    @if (errors()?.maxlength) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>
          {{ 'INPUT.ERRORS.invalidMaxLength' | translate }}:
          {{ errors()?.maxlength?.requiredLength }}
        </span>
      </p>
    }

    @if (errors()?.min) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>
          {{ 'INPUT.ERRORS.invalidMin' | translate }}: {{ errors()?.min?.min }}
        </span>
      </p>
    }

    @if (errors()?.max) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>
          {{ 'INPUT.ERRORS.invalidMax' | translate }}: {{ errors()?.max?.max }}
        </span>
      </p>
    }

    @if (errors()?.customMessage) {
      <p [class]="rowClasses()" data-role="error-message" role="alert">
        <ng-container [ngTemplateOutlet]="errIcon"></ng-container>
        <span>{{ errors()?.customMessage }}</span>
      </p>
    }
  `,
  imports: [TranslatePipe, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorPresetComponent {
  errors = input<any | undefined>(undefined);

  rowClasses = computed(() =>
    [
      'smart:flex',
      'smart:items-center',
      'smart:gap-x-2',
      'smart:text-sm',
      'smart:text-red-500',
      'smart:dark:text-red-400',
      'smart:mt-2',
    ].join(' '),
  );

  iconClasses = computed(() =>
    [
      'smart:shrink-0',
      'smart:size-4',
      'smart:text-red-500',
      'smart:dark:text-red-400',
    ].join(' '),
  );
}
