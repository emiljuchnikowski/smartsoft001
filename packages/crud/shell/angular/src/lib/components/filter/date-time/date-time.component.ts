import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { FilterDateComponent } from '../date/date.component';

@Component({
  selector: 'smart-crud-filter-date-time',
  host: { class: 'smart:block smart:w-full' },
  // TODO(FRA-293 GAP-19): re-sync picker when filter() changes externally
  template: `
    <label class="smart:mb-1 smart:block smart:text-sm smart:font-medium">
      {{ item()?.label || '' | translate }}
    </label>
    <div class="smart:flex smart:w-full smart:flex-col smart:gap-2">
      <div class="smart:flex smart:w-full smart:items-end smart:gap-2">
        <label class="smart:text-sm">{{ 'from' | translate }}</label>
        <input
          type="datetime-local"
          class="smart:flex-1 smart:rounded smart:border smart:border-gray-300 smart:px-2 smart:py-1"
          [ngModel]="customMinValue || ''"
          (ngModelChange)="customMinValue = $event"
        />
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
        <input
          type="datetime-local"
          class="smart:flex-1 smart:rounded smart:border smart:border-gray-300 smart:px-2 smart:py-1"
          [ngModel]="customMaxValue || ''"
          (ngModelChange)="customMaxValue = $event"
        />
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
  `,
  imports: [TranslatePipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateTimeComponent<
  T extends IEntity<string>,
> extends FilterDateComponent<T> {}
