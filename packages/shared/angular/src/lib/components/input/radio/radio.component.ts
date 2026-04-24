import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';

import { getModelFieldOptions } from '@smartsoft001/models';

import { ModelLabelPipe } from '../../../pipes';
import { InputPossibilitiesBaseComponent } from '../base/possibilities.component';

@Component({
  selector: 'smart-input-radio',
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
          @for (item of possibilities(); track item.id) {
            <label class="smart:flex smart:items-center smart:gap-x-2">
              <input
                type="radio"
                [name]="internalOptions.fieldKey"
                [value]="item.id"
                [formControl]="formControl"
                class="smart:h-4 smart:w-4 smart:border-gray-300 smart:text-indigo-600 focus:smart:ring-indigo-500 smart:dark:border-gray-600"
              />
              <span
                class="smart:text-sm smart:text-gray-900 smart:dark:text-white"
                >{{ item.text | translate }}</span
              >
            </label>
          }
        </div>
      </fieldset>
    }
  `,
  imports: [ModelLabelPipe, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRadioComponent<T> extends InputPossibilitiesBaseComponent<T> {
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
    if (this.internalOptions && !this.possibilities()) {
      let options = getModelFieldOptions(
        this.internalOptions.model,
        this.internalOptions.fieldKey,
      );

      if (!options && (this.internalOptions.model as any)[0])
        options = getModelFieldOptions(
          (this.internalOptions.model as any)[0],
          this.internalOptions.fieldKey,
        );

      const possibilities = options.possibilities;
      if (!possibilities || _.isArray(possibilities)) return possibilities;

      this.possibilities.set(
        Object.keys(possibilities).map((key) => ({
          id: possibilities[key],
          text: key,
          checked: false,
        })),
      );
    }
  }
}
