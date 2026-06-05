import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

// TODO(FRA-293 GAP-19 / Tor A): OnPush once value getters become computed signals
@Component({
  selector: 'smart-crud-filter-flag',
  host: { class: 'smart:block smart:w-full' },
  template: `
    <span
      class="smart:flex smart:w-full smart:flex-row smart:flex-nowrap smart:items-center smart:justify-between smart:gap-2"
    >
      <label class="smart:flex smart:items-center smart:gap-2">
        <input
          type="checkbox"
          [(ngModel)]="value"
          class="smart:h-4 smart:w-4 smart:rounded smart:border-gray-300"
        />
        <span class="smart:text-sm smart:font-medium">{{
          item()?.label || '' | translate
        }}</span>
      </label>
      @if (value === true || value === false) {
        <button
          type="button"
          (click)="refresh(null)"
          aria-label="clear"
          class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 hover:smart:bg-red-50"
        >
          ×
        </button>
      }
    </span>
  `,
  imports: [TranslatePipe, FormsModule],
})
export class FilterFlagComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {}
