import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { ColorPickerDirective } from 'ngx-color-picker';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-color-preset',
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
      <div [class]="frameClasses()" data-role="color-frame">
        <span
          [class]="swatchClasses()"
          [style.background]="color || '#ffffff'"
          data-role="swatch"
        ></span>
        <input
          type="color"
          [value]="color || '#000000'"
          [colorPicker]="color"
          (colorPickerChange)="selectColor($event)"
          [class]="pickerClasses()"
          data-role="color-input"
        />
        <span [class]="hexClasses()" data-role="hex">{{ color || '' }}</span>
        <button
          type="button"
          (click)="clear()"
          [class]="clearClasses()"
          data-role="clear"
        >
          ×
        </button>
      </div>
    }
  `,
  imports: [ColorPickerDirective, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputColorPresetComponent<T> extends InputBaseComponent<T> {
  color!: string;

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  frameClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:flex',
      'smart:items-center',
      'smart:gap-x-3',
      'smart:p-2',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
      'smart:focus-within:ring-1',
      'smart:focus-within:ring-blue-500',
      'smart:dark:focus-within:ring-blue-600',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  swatchClasses = computed(() =>
    [
      'smart:inline-block',
      'smart:size-8',
      'smart:rounded-md',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
    ].join(' '),
  );

  pickerClasses = computed(() =>
    [
      'smart:size-8',
      'smart:cursor-pointer',
      'smart:rounded-md',
      'smart:border-0',
      'smart:bg-transparent',
    ].join(' '),
  );

  hexClasses = computed(() =>
    [
      'smart:flex-1',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:uppercase',
    ].join(' '),
  );

  clearClasses = computed(() =>
    [
      'smart:rounded-md',
      'smart:bg-red-600',
      'smart:px-2',
      'smart:py-1',
      'smart:text-xs',
      'smart:font-semibold',
      'smart:text-white',
      'smart:hover:bg-red-500',
    ].join(' '),
  );

  protected override afterSetOptionsHandler() {
    this.color = this.control.value;
  }

  selectColor(color: string) {
    this.control.markAsDirty();
    this.control.markAllAsTouched();
    this.control.setValue(color);
    this.color = color;
  }

  clear() {
    this.color = '';
    this.control.markAsDirty();
    this.control.markAllAsTouched();
    this.control.setValue(null);
  }
}
