import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-strings-preset',
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
        @if (values.length) {
          <div class="smart:flex smart:flex-wrap smart:gap-2" data-role="chips">
            @for (value of values; track $index) {
              <span [class]="chipClasses()" data-role="chip">
                {{ value }}
                <button
                  type="button"
                  [class]="removeClasses()"
                  (click)="removeValue($index)"
                  [attr.aria-label]="'remove' | translate"
                  data-role="remove"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            }
          </div>
        }
        <input
          type="text"
          [formControl]="addControl"
          [placeholder]="('add' | translate) + '...'"
          [class]="inputClasses()"
          [attr.autofocus]="fieldOptions()?.focused ? true : null"
          (keydown.enter)="addValue($event)"
          (blur)="addValue()"
          data-role="add-input"
        />
      </div>
    }
  `,
  imports: [ReactiveFormsModule, TranslatePipe, ModelLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputStringsPresetComponent<T> extends InputBaseComponent<T> {
  values: string[] = [];
  addControl = new UntypedFormControl('');

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:font-medium',
      'smart:mb-2',
      'smart:text-gray-800',
      'smart:dark:text-gray-200',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = ['smart:space-y-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  // Preline "soft" badge chip look (gray).
  chipClasses = computed(() =>
    [
      'smart:inline-flex',
      'smart:items-center',
      'smart:gap-x-1.5',
      'smart:py-1.5',
      'smart:px-3',
      'smart:rounded-full',
      'smart:text-xs',
      'smart:font-medium',
      'smart:bg-gray-100',
      'smart:text-gray-800',
      'smart:dark:bg-gray-500/20',
      'smart:dark:text-gray-300',
    ].join(' '),
  );

  removeClasses = computed(() =>
    [
      'smart:group',
      'smart:relative',
      'smart:-mr-1',
      'smart:ml-0.5',
      'smart:inline-flex',
      'smart:items-center',
      'smart:justify-center',
      'smart:size-4',
      'smart:rounded-full',
      'smart:leading-none',
      'smart:text-gray-500',
      'smart:dark:text-gray-400',
      'smart:hover:bg-black/10',
      'smart:dark:hover:bg-white/20',
    ].join(' '),
  );

  inputClasses = computed(() =>
    [
      'smart:py-2.5',
      'smart:sm:py-3',
      'smart:px-4',
      'smart:block',
      'smart:w-full',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
      'smart:sm:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:placeholder:text-gray-500',
      'smart:dark:placeholder:text-gray-400',
      'smart:focus:border-blue-600',
      'smart:dark:focus:border-blue-500',
      'smart:focus:ring-1',
      'smart:focus:ring-blue-600',
      'smart:dark:focus:ring-blue-500',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ].join(' '),
  );

  override afterSetOptionsHandler() {
    const value = this.control.value;
    this.values = Array.isArray(value) ? [...value] : [];
    this.cd.detectChanges();
  }

  addValue(event?: Event): void {
    // Prevent the Enter key from submitting the surrounding form.
    event?.preventDefault();

    const raw = (this.addControl.value ?? '').trim();
    if (!raw) return;

    this.values.push(raw);
    this.addControl.setValue('');
    this.sync();
  }

  removeValue(index: number): void {
    if (index < 0 || index >= this.values.length) return;
    this.values.splice(index, 1);
    this.sync();
  }

  private sync(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();
    this.control.setValue([...this.values]);
    this.cd.detectChanges();
  }
}
