import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-logo',
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
        class="smart:mt-2 smart:flex smart:items-center smart:gap-x-3"
      >
        @if (control?.value) {
          <img
            [src]="control?.value"
            (click)="set(inputFile)"
            class="smart:h-20 smart:w-20 smart:cursor-pointer smart:rounded smart:border smart:border-gray-300 smart:object-cover dark:smart:border-gray-600"
          />
          <button
            type="button"
            (click)="clear()"
            class="smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white hover:smart:bg-red-500"
          >
            ×
          </button>
        } @else {
          <button
            type="button"
            (click)="set(inputFile)"
            class="smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-2 smart:text-sm smart:font-semibold smart:text-white hover:smart:bg-indigo-500"
          >
            Wybierz plik
          </button>
        }
        <input [hidden]="true" #inputFile accept="image/jpeg" type="file" />
      </div>
    }
  `,
  imports: [ModelLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputLogoComponent<T> extends InputBaseComponent<T> {
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'dark:smart:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes: string[] = [];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  set(inputFile: HTMLInputElement) {
    inputFile.click();

    inputFile.onchange = () => {
      if (!inputFile.files?.[0]) {
        inputFile.onchange = null;
        inputFile.files = null;
        return;
      }

      const reader = new FileReader();

      reader.onload = ((theFile) => {
        return (e) => {
          const binaryData = e.target?.result;
          const base64String = window.btoa(binaryData as any);

          this.control.markAsDirty();
          this.control.markAsTouched();
          this.control.setValue('data:image/jpeg;base64, ' + base64String);

          this.cd.detectChanges();
        };
      })(inputFile);

      reader.readAsBinaryString(inputFile.files[0]);
      inputFile.onchange = null;
      inputFile.files = null;
    };
  }

  clear() {
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.setValue(null);
  }
}
