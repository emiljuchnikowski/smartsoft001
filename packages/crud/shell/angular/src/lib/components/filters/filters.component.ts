import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { FilterComponent } from '../filter';
import { FiltersBaseComponent } from './base/base.component';

/**
 * This component is only to use in crud module
 * @requires CrudModule
 * @example
 *
 * html: <smart-crud-filters></smart-crud-filters>
 *
 * use on the model:
 * @Model({
    titleKey: 'body',
    filters: [
        {
            label: 'testNegation',
            key: 'body',
            type: '!=',
        },
        {
            label: 'fromDate',
            key: 'createDate',
            type: '<=',
            fieldType: FieldType.dateWithEdit
        },
        {
            label: 'select',
            key: 'type',
            type: '=',
            fieldType: FieldType.radio,
            possibilities$: of([
                {
                    id: 1, text: 'Test 1'
                },
                {
                    id: 2, text: 'Test 2'
                }
            ])
        }
    ]
})
 *
 * use on the field (list.filter property):
 * @Field({
        create: modifyMetdata,
        update: {
            ...modifyMetdata,
            multi: true
        },
        type: FieldType.longText,
        details: true,
        list: {
            order: 2,
            filter: true
        }
    })
 body: string;
 */
@Component({
  selector: 'smart-crud-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="smart:flex smart:h-full smart:flex-col">
      @if (!hideMenu()) {
        <header
          class="smart:flex smart:items-center smart:justify-between smart:border-b smart:border-gray-200 smart:px-4 smart:py-3"
        >
          <h2 class="smart:text-lg smart:font-semibold smart:text-gray-900">
            {{ 'filters' | translate }}
          </h2>
          <button
            type="button"
            (click)="onClose()"
            aria-label="close"
            class="smart:rounded smart:p-1 smart:text-gray-500 smart:hover:bg-gray-100"
          >
            ✕
          </button>
        </header>
      }
      <div
        class="smart:flex-1 smart:space-y-4 smart:overflow-y-auto smart:px-4 smart:py-3"
      >
        @for (item of list(); track item.key) {
          <smart-crud-filter
            [item]="item"
            [filter]="filter()"
          ></smart-crud-filter>
        }
      </div>
    </div>
  `,
  imports: [FilterComponent, TranslatePipe],
})
export class FiltersComponent<
  T extends IEntity<string>,
> extends FiltersBaseComponent<T> {}
