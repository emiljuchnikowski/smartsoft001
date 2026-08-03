import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ComponentOutletInjectorDirective,
  DynamicIoDirective,
} from 'ng-dynamic-component';

import { ModelLabelPipe } from '../../../../pipes';
import { InputArrayComponent } from '../array.component';

@Component({
  selector: 'smart-input-array-preset',
  template: `
    @if (control) {
      <label [class]="labelClasses()" data-role="label">
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
      <div [class]="groupClasses()" data-role="array">
        @for (option of childOptions; track option) {
          <div [class]="itemClasses()" data-role="item">
            <div class="smart:grow">
              <ng-template
                [ngComponentOutlet]="formComponent"
                [ndcDynamicInputs]="{ options: option }"
              ></ng-template>
            </div>
            @if (!fieldOptions()?.possibilities?.static) {
              <button
                type="button"
                [class]="removeClasses()"
                (click)="onRemove($index)"
                [attr.aria-label]="'remove' | translate"
                data-role="remove"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            }
          </div>
        } @empty {
          <span [class]="emptyClasses()" data-role="empty">&mdash;</span>
        }
        @if (!fieldOptions()?.possibilities?.static) {
          <button
            type="button"
            [class]="addClasses()"
            (click)="addButtonOptions.click()"
            data-role="add"
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
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            {{ 'add' | translate }}
          </button>
        }
      </div>
    }
  `,
  imports: [
    ModelLabelPipe,
    TranslatePipe,
    NgComponentOutlet,
    DynamicIoDirective,
    ComponentOutletInjectorDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputArrayPresetComponent<T, TChild> extends InputArrayComponent<
  T,
  TChild
> {
  itemClasses = computed(() =>
    [
      'smart:flex',
      'smart:items-start',
      'smart:gap-x-2',
      'smart:rounded-lg',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:p-3',
    ].join(' '),
  );

  // Preline "outline" button.
  addClasses = computed(() =>
    [
      'smart:inline-flex',
      'smart:items-center',
      'smart:gap-x-1.5',
      'smart:py-2',
      'smart:px-3',
      'smart:rounded-lg',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-800',
      'smart:dark:text-gray-200',
      'smart:hover:bg-gray-100',
      'smart:dark:hover:bg-gray-700',
      'smart:focus:outline-hidden',
      'smart:focus:ring-1',
      'smart:focus:ring-blue-600',
      'smart:dark:focus:ring-blue-500',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ].join(' '),
  );

  // Preline "ghost" button in the danger color.
  removeClasses = computed(() =>
    [
      'smart:inline-flex',
      'smart:shrink-0',
      'smart:items-center',
      'smart:justify-center',
      'smart:size-7',
      'smart:rounded-lg',
      'smart:text-sm',
      'smart:font-medium',
      'smart:leading-none',
      'smart:text-red-600',
      'smart:dark:text-red-500',
      'smart:hover:bg-red-100',
      'smart:dark:hover:bg-red-800/30',
      'smart:focus:outline-hidden',
      'smart:focus:bg-red-100',
      'smart:dark:focus:bg-red-800/30',
    ].join(' '),
  );

  emptyClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:text-gray-400',
      'smart:dark:text-gray-500',
    ].join(' '),
  );
}
