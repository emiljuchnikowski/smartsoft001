import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';

import { getModelFieldOptions } from '@smartsoft001/models';

import { ModelLabelPipe } from '../../../../pipes';
import { InputPossibilitiesBaseComponent } from '../../base/possibilities.component';

@Component({
  selector: 'smart-input-radio-preset',
  template: `
    @if (control) {
      <fieldset>
        <legend [class]="legendClasses()">
          {{
            control?.parent?.value
              | smartModelLabel
                : internalOptions.fieldKey
                : internalOptions?.model?.constructor
          }}
          @if (required) {
            <span class="smart:text-red-500 smart:ms-0.5">*</span>
          }
        </legend>
        <div [class]="groupClasses()">
          @for (item of possibilities(); track item.id; let i = $index) {
            <div class="smart:flex smart:items-center">
              <input
                type="radio"
                [name]="internalOptions.fieldKey"
                [value]="item.id"
                [formControl]="formControl"
                [class]="radioClasses()"
                [attr.autofocus]="
                  i === 0 && fieldOptions()?.focused ? true : null
                "
              />
              <label [class]="itemLabelClasses()">{{
                item.text | translate
              }}</label>
            </div>
          }
        </div>
      </fieldset>
    }
  `,
  imports: [ModelLabelPipe, ReactiveFormsModule, TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRadioPresetComponent<
  T,
> extends InputPossibilitiesBaseComponent<T> {
  legendClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:flex',
      'smart:flex-col',
      'smart:gap-y-3',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  radioClasses = computed(() =>
    [
      'smart:shrink-0',
      'smart:size-4',
      'smart:bg-transparent',
      'smart:border-gray-300',
      'smart:dark:border-gray-600',
      'smart:rounded-full',
      'smart:shadow-2xs',
      'smart:text-blue-600',
      'smart:dark:text-blue-400',
      'smart:focus:ring-0',
      'smart:focus:ring-offset-0',
      'smart:checked:bg-blue-700',
      'smart:dark:checked:bg-blue-600',
      'smart:checked:border-blue-700',
      'smart:dark:checked:border-blue-600',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ].join(' '),
  );

  itemLabelClasses = computed(() =>
    [
      'smart:text-sm',
      'smart:ms-3',
      'smart:text-gray-500',
      'smart:dark:text-gray-400',
    ].join(' '),
  );

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
