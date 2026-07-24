import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { DateEditComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { FilterDateComponent } from '../date/date.component';

@Component({
  selector: 'smart-crud-filter-date-with-edit',
  host: { class: 'smart:block smart:w-full' },
  // TODO(FRA-293 GAP-19): re-sync picker when filter() changes externally
  template: `
    <label class="smart:mb-1 smart:block smart:text-sm smart:font-medium">
      {{ item()?.label || '' | translate }}
    </label>

    @if (!advanced()) {
      <div class="smart:flex smart:w-full smart:items-end smart:gap-2">
        <smart-date-edit
          class="smart:flex-1"
          [ngModel]="customValue || ''"
          (ngModelChange)="customValue = $event"
        ></smart-date-edit>
        @if (allowAdvanced) {
          <button
            type="button"
            (click)="toggleAdvanced()"
            aria-label="advanced"
            class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 hover:smart:bg-gray-100"
          >
            ⚙
          </button>
        }
        @if (hasValue()) {
          <button
            type="button"
            (click)="refresh(null)"
            aria-label="clear"
            class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 hover:smart:bg-red-50"
          >
            ×
          </button>
        }
      </div>
    } @else if (allowAdvanced) {
      <button
        type="button"
        (click)="toggleAdvanced()"
        aria-label="advanced"
        class="smart:mb-2 smart:rounded smart:px-2 smart:py-2 hover:smart:bg-gray-100"
      >
        ⚙
      </button>
    }

    @if ((advanced() || hasMinValue() || hasMaxValue()) && allowAdvanced) {
      <div class="smart:flex smart:w-full smart:flex-col smart:gap-2">
        <div class="smart:flex smart:w-full smart:items-end smart:gap-2">
          <label class="smart:text-sm">{{ 'from' | translate }}</label>
          <smart-date-edit
            class="smart:flex-1"
            [ngModel]="customMinValue || ''"
            (ngModelChange)="customMinValue = $event"
          ></smart-date-edit>
          @if (hasMinValue()) {
            <button
              type="button"
              (click)="refresh(null, '>=')"
              aria-label="clear-from"
              class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 hover:smart:bg-red-50"
            >
              ×
            </button>
          }
        </div>
        <div class="smart:flex smart:w-full smart:items-end smart:gap-2">
          <label class="smart:text-sm">{{ 'to' | translate }}</label>
          <smart-date-edit
            class="smart:flex-1"
            [ngModel]="customMaxValue || ''"
            (ngModelChange)="customMaxValue = $event"
          ></smart-date-edit>
          @if (hasMaxValue()) {
            <button
              type="button"
              (click)="refresh(null, '<=')"
              aria-label="clear-to"
              class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 hover:smart:bg-red-50"
            >
              ×
            </button>
          }
        </div>
      </div>
    }
  `,
  imports: [DateEditComponent, FormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateWithEditComponent<
  T extends IEntity<string>,
> extends FilterDateComponent<T> {
  advanced: WritableSignal<boolean> = signal(false);

  toggleAdvanced(): void {
    this.advanced.update((val) => !val);
    if (this.advanced()) {
      this.value = null;
    }
  }
}
