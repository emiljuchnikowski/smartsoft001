import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { IFormOptions } from '../../../models';
import { ModelLabelPipe } from '../../../pipes';
import { FORM_COMPONENT_TOKEN } from '../../../shared.inectors';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-object',
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
        <ng-template
          [ngComponentOutlet]="formComponent"
          [ndcDynamicInputs]="{ options: childOptions }"
        ></ng-template>
      </div>
    }
  `,
  imports: [ModelLabelPipe, NgComponentOutlet, DynamicIoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputObjectComponent<T, TChild> extends InputBaseComponent<T> {
  public formComponent = inject(FORM_COMPONENT_TOKEN);
  childOptions!: IFormOptions<TChild>;

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
    const classes = ['smart:mt-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  protected override afterSetOptionsHandler() {
    this.childOptions = {
      treeLevel: this.internalOptions.treeLevel + 1,
      mode: this.internalOptions.mode,
      control: this.control,
      model: (this.internalOptions.model as any)[
        this.internalOptions.fieldKey
      ] as TChild,
      show: true,
    };
  }
}
