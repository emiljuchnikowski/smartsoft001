import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  ComponentOutletInjectorDirective,
  DynamicIoDirective,
} from 'ng-dynamic-component';

import { IFormOptions } from '../../../../models';
import { ModelLabelPipe } from '../../../../pipes';
import { FORM_COMPONENT_TOKEN } from '../../../../shared.inectors';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-object-preset',
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
      <div [class]="frameClasses()" data-role="object-frame">
        <ng-template
          [ngComponentOutlet]="formComponent"
          [ndcDynamicInputs]="{ options: childOptions }"
        ></ng-template>
      </div>
    }
  `,
  imports: [
    ModelLabelPipe,
    NgComponentOutlet,
    DynamicIoDirective,
    ComponentOutletInjectorDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputObjectPresetComponent<
  T,
  TChild,
> extends InputBaseComponent<T> {
  public formComponent = inject(FORM_COMPONENT_TOKEN);
  childOptions!: IFormOptions<TChild>;

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
      'smart:p-4',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
    ];
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
