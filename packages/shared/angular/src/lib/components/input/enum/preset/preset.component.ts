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
  selector: 'smart-input-enum-preset',
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
      <select
        [formControl]="formControl"
        [class]="selectClasses()"
        [attr.autofocus]="fieldOptions()?.focused ? true : null"
        data-role="select"
      >
        @for (item of possibilities(); track item.id) {
          <option [ngValue]="item.id">{{ item.text | translate }}</option>
        }
      </select>
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InputEnumPresetComponent<
  T,
> extends InputPossibilitiesBaseComponent<T> {
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  selectClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:block',
      'smart:w-full',
      'smart:py-2.5',
      'smart:sm:py-3',
      'smart:px-4',
      'smart:pe-9',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
      'smart:sm:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:focus:border-blue-700',
      'smart:dark:focus:border-blue-600',
      'smart:focus:ring-blue-700',
      'smart:dark:focus:ring-blue-600',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ];
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
