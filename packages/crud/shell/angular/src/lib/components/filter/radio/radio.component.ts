import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

// TODO(FRA-293 GAP-19 / Tor A): OnPush once value getters become computed signals
@Component({
  selector: 'smart-crud-filter-radio',
  host: { class: 'smart:mb-5 smart:block smart:w-full' },
  template: `
    <div
      class="smart:mb-2 smart:flex smart:items-center smart:justify-between smart:gap-2 smart:border-b smart:border-gray-200 smart:pb-1"
    >
      <span class="smart:text-lg smart:font-light">{{
        item()?.label || '' | translate
      }}</span>
      @if (value || value === false) {
        <button
          type="button"
          (click)="refresh(null)"
          aria-label="clear"
          class="smart:shrink-0 smart:rounded smart:px-2 smart:py-1 smart:text-red-600 hover:smart:bg-red-50"
        >
          ×
        </button>
      }
    </div>

    @for (entry of possibilities(); track entry.id) {
      <label class="smart:flex smart:items-center smart:gap-2 smart:py-1">
        <input
          type="radio"
          [name]="item()?.key || 'radio'"
          [value]="entry.id"
          [(ngModel)]="value"
          class="smart:h-4 smart:w-4 smart:border-gray-300"
        />
        <span class="smart:text-sm">{{ entry.text | translate }}</span>
      </label>
    }
  `,
  imports: [TranslatePipe, FormsModule],
})
export class FilterRadioComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {}
