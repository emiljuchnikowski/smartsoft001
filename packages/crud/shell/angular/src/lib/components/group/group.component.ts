import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ListComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { GroupBaseComponent } from './base/base.component';

@Component({
  selector: 'smart-crud-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of groups(); track item.key) {
      <div class="smart:border-b smart:border-gray-200">
        <button
          type="button"
          (click)="change(!item.show, item)"
          [attr.aria-expanded]="item.show || false"
          [attr.aria-controls]="'smart-crud-group-' + item.key"
          class="smart:flex smart:w-full smart:items-center smart:justify-between smart:py-3 smart:text-left smart:text-sm"
          [class.smart:font-bold]="item.show"
        >
          <span>{{ item.text | translate }}</span>
          <span aria-hidden="true" class="smart:text-gray-500">{{
            item.show ? '▾' : '▸'
          }}</span>
        </button>
        @if (item.show) {
          <div [id]="'smart-crud-group-' + item.key" class="smart:pb-3">
            @if (!item.children && listOptions()) {
              <smart-list [options]="listOptions()!"></smart-list>
            }
            @if (item.children) {
              <div class="smart:ml-12">
                <smart-crud-group
                  [groups]="item.children"
                  [listOptions]="listOptions()"
                ></smart-crud-group>
              </div>
            }
          </div>
        }
      </div>
    }
  `,
  imports: [ListComponent, TranslatePipe],
})
export class GroupComponent<
  T extends IEntity<string>,
> extends GroupBaseComponent<T> {}
