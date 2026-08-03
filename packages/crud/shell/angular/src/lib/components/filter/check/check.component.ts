import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  Signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

// TODO(FRA-293 GAP-19): re-sync rendered checked state when filter() changes
// externally (the `value` getter already reads the reactive filter() signal,
// so the `list` computed stays OnPush-safe).
@Component({
  selector: 'smart-crud-filter-check',
  host: { class: 'smart:block smart:w-full' },
  template: `
    <fieldset class="smart:w-full">
      <legend
        class="smart:flex smart:items-center smart:justify-between smart:text-sm smart:font-medium smart:text-gray-900"
      >
        <span>{{ item()?.label || '' | translate }}</span>
        @if (hasCheckedValues()) {
          <button
            type="button"
            (click)="refresh([])"
            aria-label="clear"
            class="smart:rounded smart:px-2 smart:py-1 smart:text-red-600 hover:smart:bg-red-50"
          >
            ×
          </button>
        }
      </legend>
      <div class="smart:mt-2 smart:space-y-2">
        @for (entry of list(); track entry.value.id) {
          <label class="smart:flex smart:items-center smart:gap-x-2">
            <input
              type="checkbox"
              [checked]="entry.isCheck"
              (change)="onCheckChange($any($event.target).checked, entry)"
              class="smart:h-4 smart:w-4 smart:rounded smart:border-gray-300 smart:text-indigo-600 focus:smart:ring-indigo-500"
            />
            <span class="smart:text-sm smart:text-gray-900">{{
              entry.value.text | translate
            }}</span>
          </label>
        }
      </div>
    </fieldset>
  `,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCheckComponent<T extends IEntity<string>>
  extends BaseComponent<T>
  implements OnInit
{
  list!: Signal<{ value: any; isCheck: boolean }[]>;

  readonly hasCheckedValues = computed<boolean>(() => {
    const v = this.value;
    return Array.isArray(v) && v.length > 0;
  });

  override ngOnInit(): void {
    super.ngOnInit();

    this.list = computed(() => {
      const possibilities = this.possibilities ? this.possibilities() : [];
      const v = this.value ?? [];
      return possibilities.map((pos) => ({
        value: pos,
        isCheck: v.some((r: any) => r === pos.id),
      }));
    });
  }

  onCheckChange(checked: boolean, entry: { value: any; isCheck: boolean }) {
    if (checked && !(this.value ?? []).some((r: any) => r === entry.value.id)) {
      this.value = [...(this.value ?? []), entry.value.id];
    }

    if (!checked && (this.value ?? []).some((r: any) => r === entry.value.id)) {
      this.value = this.value?.filter((r: any) => r !== entry.value.id);
    }
  }
}
