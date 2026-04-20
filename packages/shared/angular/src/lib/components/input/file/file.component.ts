import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-file',
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
        <button
          type="button"
          (click)="addButtonOptions.click()"
          class="smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white hover:smart:bg-indigo-500"
        >
          {{ (control.value ? 'change' : 'add') | translate }}
        </button>
        @if (control.value?.name) {
          <span
            class="smart:text-sm smart:text-gray-700 dark:smart:text-gray-300"
          >
            {{ control.value.name }}
          </span>
        }
        <input
          type="file"
          #inputObj
          (change)="changeListener($event)"
          [hidden]="true"
          [attr.accept]="fieldOptions()?.possibilities"
          [attr.autofocus]="fieldOptions()?.focused"
        />
      </div>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFileComponent<T> extends InputBaseComponent<T> {
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
    const classes = [
      'smart:mt-2',
      'smart:flex',
      'smart:items-center',
      'smart:gap-x-2',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  addButtonOptions = {
    click: () => {
      this.control.markAsDirty();
      this.control.markAsTouched();
      (this.inputElementRef()?.nativeElement as HTMLInputElement)?.click();
    },
  };

  inputElementRef = viewChild<ElementRef>('inputObj');

  changeListener($event: any): void {
    const file = $event.target.files[0];

    $event.target.type = 'text';
    $event.target.type = 'file';

    this.control.setValue(file);
    this.control.updateValueAndValidity();
    this.cd.detectChanges();
  }
}
