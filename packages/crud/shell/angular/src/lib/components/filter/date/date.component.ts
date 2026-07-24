import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';

import { DateEditComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-date',
  host: { class: 'smart:block smart:w-full' },
  // TODO(FRA-293 GAP-19): re-sync picker when filter() changes externally
  template: `
    <label class="smart:mb-1 smart:block smart:text-sm smart:font-medium">
      {{ item()?.label || '' | translate }}
    </label>
    <div class="smart:flex smart:w-full smart:items-end smart:gap-2">
      <smart-date-edit
        class="smart:flex-1"
        [ngModel]="customValue || ''"
        (ngModelChange)="customValue = $event"
      ></smart-date-edit>
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
  `,
  imports: [DateEditComponent, FormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {
  get allowAdvanced(): boolean {
    const item = this.item();
    return item?.type === '=';
  }

  set customValue(val) {
    const momentDate = moment(val);
    this.value =
      (val as string)?.length >= 10 && momentDate.isValid()
        ? momentDate.format('YYYY-MM-DD')
        : val;
  }

  get customValue(): any {
    return this.value;
  }

  set customMinValue(val) {
    const momentDate = moment(val);
    this.minValue =
      (val as string)?.length >= 10 && momentDate.isValid()
        ? momentDate.format('YYYY-MM-DD')
        : val;
  }

  get customMinValue(): any {
    return this.minValue;
  }

  set customMaxValue(val) {
    const momentDate = moment(val);
    this.maxValue =
      (val as string)?.length >= 10 && momentDate.isValid()
        ? momentDate.format('YYYY-MM-DD')
        : val;
  }

  get customMaxValue(): any {
    return this.maxValue;
  }
}
