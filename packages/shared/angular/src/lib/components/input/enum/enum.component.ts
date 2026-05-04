import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { EnumToListPipe, ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-enum',
  template: `
    @if (control) {
      <fieldset>
        <legend [class]="labelClasses()">
          {{
            control?.parent?.value
              | smartModelLabel
                : internalOptions.fieldKey
                : internalOptions?.model?.constructor
          }}
          @if (required) {
            <span class="smart:text-red-500 smart:ml-0.5">*</span>
          }
        </legend>
        <div [class]="groupClasses()">
          @for (
            item of fieldOptions()?.possibilities | smartEnumToList;
            track item
          ) {
            <label class="smart:flex smart:items-center smart:gap-x-2">
              <input
                type="checkbox"
                [checked]="checked(item)"
                (change)="change(item)"
                class="smart:h-4 smart:w-4 smart:rounded smart:border-gray-300 smart:text-indigo-600 focus:smart:ring-indigo-500 smart:dark:border-gray-600"
              />
              <span
                class="smart:text-sm smart:text-gray-900 smart:dark:text-white"
                >{{ item | translate }}</span
              >
            </label>
          }
        </div>
      </fieldset>
    }
  `,
  imports: [ModelLabelPipe, EnumToListPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputEnumComponent<T> extends InputBaseComponent<T> {
  value!: Array<string>;

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
    const classes = ['smart:mt-2', 'smart:space-y-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  protected override afterSetOptionsHandler(): void {
    this.value = this.control.value ? [...this.control.value] : [];
  }

  checked(item: string): boolean {
    if (!this.value) return false;
    return this.value.some((i) => i === item);
  }

  change(item: string): void {
    const add = !this.checked(item);

    if (!this.value) this.value = [];

    if (add) {
      this.value.push(item);
    } else {
      this.value = this.value.filter((i) => i !== item);
    }

    this.control.markAsDirty();
    this.control.setValue(this.value);

    this.cd.detectChanges();
  }
}
