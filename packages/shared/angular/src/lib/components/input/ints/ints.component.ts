import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-ints',
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
        @for (item of list; track item) {
          @let last = $last;
          <div class="smart:flex smart:items-center smart:gap-x-2">
            <input
              type="number"
              [formControl]="item"
              [placeholder]="(last ? ('add' | translate) : '') + '...'"
              (change)="onItemChange()"
              class="smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-2 smart:py-1 smart:text-sm smart:text-gray-900 smart:outline-1 smart:outline-gray-300 focus:smart:outline-2 focus:smart:outline-indigo-600 smart:dark:bg-white/5 smart:dark:text-white smart:dark:outline-white/10"
            />
            @if (!last) {
              <button
                type="button"
                (click)="removeItem(item)"
                class="smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white hover:smart:bg-red-500"
              >
                ×
              </button>
            }
          </div>
        }
      </div>
    }
  `,
  imports: [ReactiveFormsModule, TranslatePipe, ModelLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputIntsComponent<T> extends InputBaseComponent<T> {
  private fb = inject(UntypedFormBuilder);

  list: Array<UntypedFormControl> = [];

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

  override afterSetOptionsHandler() {
    if (this.control.value) {
      this.list = [];
      this.control.value.forEach((i: any) => this.add(i));
    } else {
      this.list = [];
    }

    this.refresh();
  }

  onItemChange() {
    this.refresh();
  }

  private refresh(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();

    this.control.setValue(
      this.list.filter((i) => i && i.value).map((i) => Number(i.value)),
    );

    if (
      !this.list.length ||
      (this.list[this.list.length - 1] && this.list[this.list.length - 1].value)
    ) {
      this.add(0);
    }

    this.cd.detectChanges();
  }

  private add(val: number): void {
    this.list.push(this.fb.control(val));
  }

  removeItem(item: UntypedFormControl) {
    const index = this.list.indexOf(item);
    if (index > -1) {
      this.list.splice(index, 1);
    }
    this.refresh();
  }
}
