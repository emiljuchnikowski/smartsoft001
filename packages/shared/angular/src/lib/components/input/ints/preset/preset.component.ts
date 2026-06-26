import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-ints-preset',
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
      <div [class]="groupClasses()">
        @for (item of list; track item) {
          @let last = $last;
          <div class="smart:flex smart:items-center smart:gap-x-2">
            <!-- Preline Input Number -->
            <div [class]="numberGroupClasses()">
              <div
                class="smart:w-full smart:flex smart:justify-between smart:items-center smart:gap-x-3"
              >
                <div class="smart:grow">
                  <input
                    type="number"
                    step="1"
                    [formControl]="item"
                    [placeholder]="(last ? ('add' | translate) : '') + '...'"
                    (change)="onItemChange()"
                    [attr.autofocus]="
                      $first && fieldOptions()?.focused ? true : null
                    "
                    aria-roledescription="Number field"
                    style="-moz-appearance: textfield;"
                    class="smart:w-full smart:p-0 smart:bg-transparent smart:border-0 smart:text-gray-900 smart:dark:text-white placeholder:smart:text-gray-500 dark:placeholder:smart:text-gray-400 smart:focus:ring-0 smart:[&::-webkit-inner-spin-button]:appearance-none smart:[&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div
                  class="smart:flex smart:justify-end smart:items-center smart:gap-x-1.5"
                >
                  <button
                    type="button"
                    tabindex="-1"
                    aria-label="Decrease"
                    (click)="decrement(item)"
                    [class]="stepButtonClasses()"
                  >
                    <svg
                      class="smart:shrink-0 smart:size-3.5"
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
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    tabindex="-1"
                    aria-label="Increase"
                    (click)="increment(item)"
                    [class]="stepButtonClasses()"
                  >
                    <svg
                      class="smart:shrink-0 smart:size-3.5"
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
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <!-- End Input Number -->
            @if (!last) {
              <button
                type="button"
                aria-label="Remove"
                (click)="removeItem(item)"
                [class]="removeButtonClasses()"
              >
                <svg
                  class="smart:shrink-0 smart:size-3.5"
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
              </button>
            }
          </div>
        }
      </div>
    }
  `,
  imports: [ReactiveFormsModule, TranslatePipe, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputIntsPresetComponent<T> extends InputBaseComponent<T> {
  private fb = inject(UntypedFormBuilder);

  list: Array<UntypedFormControl> = [];

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-800',
      'smart:dark:text-gray-200',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = ['smart:mt-2', 'smart:space-y-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  numberGroupClasses = computed(() =>
    [
      'smart:grow',
      'smart:py-2',
      'smart:px-3',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
    ].join(' '),
  );

  stepButtonClasses = computed(() =>
    [
      'smart:size-6',
      'smart:inline-flex',
      'smart:justify-center',
      'smart:items-center',
      'smart:gap-x-2',
      'smart:text-sm',
      'smart:font-medium',
      'smart:rounded-md',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:text-gray-800',
      'smart:dark:text-gray-200',
      'smart:shadow-2xs',
      'smart:hover:bg-gray-100',
      'smart:dark:hover:bg-gray-700',
      'smart:focus:outline-none',
      'smart:focus:bg-gray-100',
      'smart:dark:focus:bg-gray-700',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ].join(' '),
  );

  removeButtonClasses = computed(() =>
    [
      'smart:size-9',
      'smart:shrink-0',
      'smart:inline-flex',
      'smart:justify-center',
      'smart:items-center',
      'smart:rounded-lg',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:text-red-600',
      'smart:dark:text-red-400',
      'smart:shadow-2xs',
      'smart:hover:bg-gray-100',
      'smart:dark:hover:bg-gray-700',
      'smart:focus:outline-none',
      'smart:focus:bg-gray-100',
      'smart:dark:focus:bg-gray-700',
    ].join(' '),
  );

  override afterSetOptionsHandler() {
    if (this.control.value) {
      this.list = [];
      this.control.value.forEach((i: any) => this.add(i));
    } else {
      this.list = [];
    }

    this.refresh();
  }

  onItemChange() {
    this.refresh();
  }

  increment(item: UntypedFormControl) {
    item.setValue(Number(item.value || 0) + 1);
    this.refresh();
  }

  decrement(item: UntypedFormControl) {
    item.setValue(Number(item.value || 0) - 1);
    this.refresh();
  }

  removeItem(item: UntypedFormControl) {
    const index = this.list.indexOf(item);
    if (index > -1) {
      this.list.splice(index, 1);
    }
    this.refresh();
  }

  private refresh(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();

    this.control.setValue(
      this.list.filter((i) => i && i.value).map((i) => Number(i.value)),
    );

    if (
      !this.list.length ||
      (this.list[this.list.length - 1] && this.list[this.list.length - 1].value)
    ) {
      this.add(0);
    }

    this.cd.detectChanges();
  }

  private add(val: number): void {
    this.list.push(this.fb.control(val));
  }
}
