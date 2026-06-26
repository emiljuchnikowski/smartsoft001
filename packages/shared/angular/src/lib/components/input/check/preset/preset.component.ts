import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { getModelFieldOptions } from '@smartsoft001/models';

import { ModelLabelPipe } from '../../../../pipes';
import { InputPossibilitiesBaseComponent } from '../../base/possibilities.component';

@Component({
  selector: 'smart-input-check-preset',
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
            <span class="smart:text-red-500 smart:ms-0.5">*</span>
          }
        </legend>
        <div [class]="groupClasses()" data-role="check-group">
          @for (item of possibilities(); track item.id) {
            <div class="smart:flex smart:items-center">
              <input
                type="checkbox"
                [checked]="item.checked"
                (change)="refresh(item)"
                [class]="checkboxClasses()"
              />
              <span
                [class]="optionLabelClasses()"
                [innerHTML]="item.text | translate"
              ></span>
            </div>
          }
        </div>
      </fieldset>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCheckPresetComponent<
  T,
> extends InputPossibilitiesBaseComponent<T> {
  override possibilities: WritableSignal<Array<{
    id: any;
    text: string;
    checked: boolean;
  }> | null> = signal(null);

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = ['smart:mt-2', 'smart:space-y-3'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  // Preline "Default checkbox" look translated to smart:-prefixed vanilla
  // Tailwind with explicit dark: variants.
  checkboxClasses = computed(() =>
    [
      'smart:shrink-0',
      'smart:size-4',
      'smart:bg-transparent',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-sm',
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

  optionLabelClasses = computed(() =>
    [
      'smart:text-sm',
      'smart:ms-3',
      'smart:text-gray-500',
      'smart:dark:text-gray-400',
    ].join(' '),
  );

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
