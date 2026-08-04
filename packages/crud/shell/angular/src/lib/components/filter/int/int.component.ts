import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { InputIntComponent, InputOptions } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';
import { IFieldOptions } from '@smartsoft001/models';

import { BaseComponent } from '../base/base.component';

// TODO(FRA-293 GAP-19): the advanced range controls (minControl/maxControl)
// are not re-synced when filter() changes externally; see bindControl().
@Component({
  selector: 'smart-crud-filter-int',
  host: { class: 'smart:block smart:w-full' },
  template: `
    @if (valueOptions()) {
      <div class="smart:flex smart:w-full smart:items-end smart:gap-2">
        @if (!advanced()) {
          <smart-input-int
            class="smart:flex-1"
            [options]="valueOptions()!"
            [fieldOptions]="valueFieldOptions()"
          ></smart-input-int>
        }

        @if (allowAdvanced) {
          <button
            type="button"
            (click)="toggleAdvanced()"
            [disabled]="hasMinValue() || hasMaxValue()"
            aria-label="settings"
            class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-gray-600 smart:hover:bg-gray-100 smart:disabled:opacity-40"
          >
            ⚙
          </button>
        }

        @if (hasValue() || hasMinValue() || hasMaxValue()) {
          <button
            type="button"
            (click)="clear()"
            aria-label="clear"
            class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50"
          >
            ×
          </button>
        }
      </div>

      @if ((advanced() || hasMinValue() || hasMaxValue()) && allowAdvanced) {
        <div
          class="smart:mt-2 smart:flex smart:w-full smart:items-end smart:gap-2"
        >
          <div class="smart:flex-1">
            <label
              class="smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white"
            >
              {{ 'from' | translate }}
            </label>
            <input
              type="number"
              step="1"
              [formControl]="minControl"
              class="smart:mt-2 smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-3 smart:py-1.5 smart:text-base smart:text-gray-900 smart:outline-1 -outline-offset-1 smart:outline-gray-300 smart:focus:outline-2 smart:focus:outline-offset-2 smart:focus:outline-indigo-600 smart:dark:bg-white/5 smart:dark:text-white smart:dark:outline-white/10"
            />
          </div>
          @if (hasMinValue()) {
            <button
              type="button"
              (click)="refresh(null, '>=')"
              aria-label="clear-from"
              class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50"
            >
              ×
            </button>
          }

          <div class="smart:flex-1">
            <label
              class="smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white"
            >
              {{ 'to' | translate }}
            </label>
            <input
              type="number"
              step="1"
              [formControl]="maxControl"
              class="smart:mt-2 smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-3 smart:py-1.5 smart:text-base smart:text-gray-900 smart:outline-1 -outline-offset-1 smart:outline-gray-300 smart:focus:outline-2 smart:focus:outline-offset-2 smart:focus:outline-indigo-600 smart:dark:bg-white/5 smart:dark:text-white smart:dark:outline-white/10"
            />
          </div>
          @if (hasMaxValue()) {
            <button
              type="button"
              (click)="refresh(null, '<=')"
              aria-label="clear-to"
              class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50"
            >
              ×
            </button>
          }
        </div>
      }
    }
  `,
  imports: [InputIntComponent, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterIntComponent<T extends IEntity<string>>
  extends BaseComponent<T>
  implements OnInit
{
  readonly valueOptions: WritableSignal<InputOptions<any> | undefined> = signal<
    InputOptions<any> | undefined
  >(undefined);
  readonly valueFieldOptions: WritableSignal<IFieldOptions | undefined> =
    signal<IFieldOptions | undefined>(undefined);

  readonly advanced: WritableSignal<boolean> = signal<boolean>(false);

  minControl!: UntypedFormControl;
  maxControl!: UntypedFormControl;

  get allowAdvanced(): boolean {
    return this.item()?.type === '=';
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const valueControl = this.bindControl(null);
    this.minControl = this.bindControl('>=');
    this.maxControl = this.bindControl('<=');

    this.valueOptions.set(this.buildInputOptions(valueControl));
    this.valueFieldOptions.set(undefined);
  }

  toggleAdvanced(): void {
    this.advanced.update((val) => !val);
    if (this.advanced()) this.value = null;
  }
}
