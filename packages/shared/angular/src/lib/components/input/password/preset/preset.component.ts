import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

/**
 * Preline "Strong Password" preset for the `password` field type.
 *
 * The Preline template relies on the `data-hs-strong-password` JS plugin, which is
 * not installed in this workspace. The strength meter and hint list are therefore
 * recomputed entirely with Angular signals from the control value (see GAPS in the
 * task report). The visual look is the translated Preline markup.
 */
@Component({
  selector: 'smart-input-password-preset',
  template: `
    @if (control) {
      <label [class]="labelClasses()">
        {{
          control?.parent?.value
            | smartModelLabel
              : internalOptions.fieldKey
              : internalOptions?.model?.constructor
        }}
        @if (required) {
          <span class="smart:text-red-500 smart:ml-0.5">*</span>
        }
      </label>

      <input
        type="password"
        [formControl]="formControl"
        [class]="inputClasses()"
        [attr.autofocus]="fieldOptions()?.focused ? true : null"
        (input)="onInput($event)"
        (blur)="focus.set(false)"
        (focus)="focus.set(true)"
      />

      @if (fieldOptions()?.possibilities?.strength) {
        <div class="smart:mt-2" data-role="strength-meter">
          <div class="smart:flex smart:-mx-1">
            @for (bar of bars; track $index) {
              <div [class]="barClasses($index)" data-role="strength-bar"></div>
            }
          </div>

          @if (focus()) {
            <div class="smart:mt-3" data-role="strength-hints">
              <div>
                <span
                  class="smart:text-sm smart:text-gray-900 smart:dark:text-white"
                  >Level:</span
                >
                <span
                  class="smart:text-sm smart:font-semibold smart:text-gray-900 smart:dark:text-white"
                  data-role="strength-level"
                  >{{ levelText() }}</span
                >
              </div>

              <h4
                class="smart:my-2 smart:text-sm smart:font-semibold smart:text-gray-900 smart:dark:text-white"
              >
                Your password must contain:
              </h4>

              <ul
                class="smart:space-y-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400"
              >
                @for (rule of rules(); track rule.key) {
                  <li
                    [class]="ruleClasses(rule.passed)"
                    data-role="strength-rule"
                  >
                    @if (rule.passed) {
                      <span data-check>
                        <svg
                          class="smart:shrink-0 smart:size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    } @else {
                      <span data-uncheck>
                        <svg
                          class="smart:shrink-0 smart:size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </span>
                    }
                    {{ rule.label }}
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      }
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordPresetComponent<T> extends InputBaseComponent<T> {
  valid = true;
  focus = signal(false);
  value = signal('');

  private patterns = [
    {
      key: 'min-length',
      label: 'Minimum number of characters is 6.',
      test: (v: string) => v.length >= 6,
    },
    {
      key: 'lowercase',
      label: 'Should contain lowercase.',
      test: (v: string) => /[a-z]/.test(v),
    },
    {
      key: 'uppercase',
      label: 'Should contain uppercase.',
      test: (v: string) => /[A-Z]/.test(v),
    },
    {
      key: 'numbers',
      label: 'Should contain numbers.',
      test: (v: string) => /[0-9]/.test(v),
    },
    {
      key: 'special-characters',
      label: 'Should contain special characters.',
      test: (v: string) => /[^a-zA-Z0-9]/.test(v),
    },
  ];

  bars = [0, 1, 2, 3, 4];

  rules = computed(() => {
    const v = this.value();
    return this.patterns.map((p) => ({
      key: p.key,
      label: p.label,
      passed: p.test(v),
    }));
  });

  passedCount = computed(() => this.rules().filter((r) => r.passed).length);

  accepted = computed(() => this.passedCount() === this.patterns.length);

  levelText = computed(
    () =>
      ['Empty', 'Weak', 'Medium', 'Strong', 'Very Strong', 'Super Strong'][
        this.passedCount()
      ],
  );

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:font-medium',
      'smart:mb-2',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  inputClasses = computed(() => {
    const classes = [
      'smart:py-2.5',
      'smart:sm:py-3',
      'smart:px-4',
      'smart:block',
      'smart:w-full',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-md',
      'smart:sm:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:placeholder:text-gray-500',
      'smart:dark:placeholder:text-gray-400',
      'smart:focus:border-blue-600',
      'smart:dark:focus:border-blue-500',
      'smart:focus:ring-1',
      'smart:focus:ring-blue-600',
      'smart:dark:focus:ring-blue-500',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  constructor() {
    super();

    effect(() => {
      const accepted = this.accepted();
      if (!this.control) return;
      if (!this.fieldOptions()?.possibilities?.strength) return;
      this.onChangePasswordStrength(accepted);
    });
  }

  barClasses(index: number): string {
    const base = [
      'smart:h-2',
      'smart:flex-auto',
      'smart:rounded-full',
      'smart:mx-1',
    ];
    if (index >= this.passedCount()) {
      return [
        ...base,
        'smart:bg-gray-200',
        'smart:dark:bg-gray-700',
        'smart:opacity-50',
      ].join(' ');
    }
    if (this.accepted()) {
      return [...base, 'smart:bg-teal-500', 'smart:opacity-100'].join(' ');
    }
    return [
      ...base,
      'smart:bg-blue-600',
      'smart:dark:bg-blue-500',
      'smart:opacity-100',
    ].join(' ');
  }

  ruleClasses(passed: boolean): string {
    const base = ['smart:flex', 'smart:items-center', 'smart:gap-x-2'];
    if (passed) {
      return [...base, 'smart:text-teal-500'].join(' ');
    }
    return base.join(' ');
  }

  onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  override afterSetOptionsHandler() {
    this.value.set((this.control?.value as string) ?? '');

    this.control.addValidators(() => {
      if (!this.valid) {
        return {
          passwordStrength: true,
        };
      }

      return null;
    });

    this.control.updateValueAndValidity({ onlySelf: true });
  }

  onChangePasswordStrength(valid: boolean) {
    this.valid = valid;
    if (this.valid) {
      if (this.control.errors?.['passwordStrength']) {
        this.control.setErrors(
          Object.keys(this.control.errors).length === 1
            ? null
            : { ...this.control.errors, passwordStrength: null },
        );
      }
    } else {
      const errors = this.control.errors
        ? { ...this.control.errors, passwordStrength: true }
        : { passwordStrength: true };
      this.control.setErrors(errors);
    }

    this.control.updateValueAndValidity({ onlySelf: true });
  }
}
