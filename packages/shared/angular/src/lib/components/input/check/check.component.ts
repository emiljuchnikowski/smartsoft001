import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { getModelFieldOptions } from '@smartsoft001/models';

import { ModelLabelPipe } from '../../../pipes';
import { InputPossibilitiesBaseComponent } from '../base/possibilities.component';

@Component({
  selector: 'smart-input-check',
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
                type="checkbox"
                [checked]="item.checked"
                (change)="refresh(item)"
                class="smart:h-4 smart:w-4 smart:rounded smart:border-gray-300 smart:text-indigo-600 focus:smart:ring-indigo-500 smart:dark:border-gray-600"
              />
              <span
                class="smart:text-sm smart:text-gray-900 smart:dark:text-white"
                [innerHTML]="item.text | translate"
              ></span>
            </label>
          }
        </div>
      </fieldset>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCheckComponent<T> extends InputPossibilitiesBaseComponent<T> {
  override possibilities: WritableSignal<Array<{
    id: any;
    text: string;
    checked: boolean;
  }> | null> = signal(null);

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
    const current = this.possibilities();
    if (this.internalOptions && !current) {
      const fromModel = getModelFieldOptions(
        this.internalOptions.model,
        this.internalOptions.fieldKey,
      )?.possibilities;
      if (fromModel) {
        this.possibilities.set(fromModel);
      }
    }

    this.syncCheckedWithControl();

    this.control.valueChanges
      .pipe(this.takeUntilDestroy)
      .subscribe(() => this.syncCheckedWithControl());
  }

  private syncCheckedWithControl(): void {
    const list = this.possibilities();
    if (!list) return;

    const value = this.control.value;
    list.forEach((item) => {
      if (value && Array.isArray(value) && item?.id?.id) {
        const controlItem = value.find((ci: any) => ci?.id === item.id.id);
        if (controlItem) {
          item.id = controlItem;
          item.checked = true;
        } else {
          item.checked = false;
        }
      } else {
        item.checked = item.id === value;
      }
    });

    this.cd.detectChanges();
  }

  refresh(item: { id: any; text: string; checked: boolean }): void {
    item.checked = !item.checked;

    const possibilities = this.possibilities();
    if (possibilities) {
      const result = possibilities
        .filter((p: any) => p.checked)
        .map((p) => p.id);
      this.control.markAsDirty();
      this.control.markAsTouched();
      this.control.setValue(result);
    }
  }
}
