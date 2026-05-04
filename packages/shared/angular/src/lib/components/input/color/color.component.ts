import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ColorPickerDirective } from 'ngx-color-picker';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-color',
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
      <div
        [class]="groupClasses()"
        class="smart:mt-2 smart:flex smart:items-center smart:gap-x-2"
      >
        <span
          class="smart:inline-block smart:h-8 smart:w-8 smart:rounded smart:border smart:border-gray-300 smart:dark:border-gray-600"
          [style.background]="color"
        ></span>
        <input
          type="color"
          [value]="color || '#000000'"
          [colorPicker]="color"
          (colorPickerChange)="selectColor($event)"
          class="smart:h-8 smart:w-8 smart:cursor-pointer smart:rounded smart:border-0 smart:bg-transparent"
        />
        <button
          type="button"
          (click)="clear()"
          class="smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white hover:smart:bg-red-500"
        >
          ×
        </button>
      </div>
    }
  `,
  imports: [ColorPickerDirective, ModelLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputColorComponent<T> extends InputBaseComponent<T> {
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

  groupClasses = computed(() => {
    const classes: string[] = [];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

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
