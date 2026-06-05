import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  // TODO: AccordionComponent moved to @smartsoft001-pro/angular (FRA-101)
  // AccordionBodyComponent,
  // AccordionComponent,
  // AccordionHeaderComponent,
  ListComponent,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { GroupBaseComponent } from './base/base.component';

@Component({
  selector: 'smart-crud-group',
  template: `
    <!-- TODO: AccordionComponent moved to @smartsoft001-pro/angular (FRA-101)
    @for (item of groups(); track item.key) {
      <smart-accordion
        [show]="item.show || false"
        (showChange)="change($event, item)"
      >
        <smart-accordion-header [ngClass]="{ 'font-bold': item.show }">
          {{ item.text | translate }}
        </smart-accordion-header>
        <smart-accordion-body>
          @if (item.show && !item.children && listOptions()) {
            <smart-list [options]="listOptions()!"></smart-list>
          }
          @if (item.children) {
            <div style="margin-left: 50px">
              <smart-crud-group
                [groups]="item.children"
                [listOptions]="listOptions()"
              ></smart-crud-group>
            </div>
          }
        </smart-accordion-body>
      </smart-accordion>
    }
    -->

    <!-- TODO: remove this template after moving to @smartsoft001-pro/angular (FRA-101) -->
    @for (item of groups(); track item.key) {
      <div (click)="change(!item.show, item)">
        {{ item.text | translate }}
      </div>
      @if (item.show && !item.children && listOptions()) {
        <smart-list [options]="listOptions()!"></smart-list>
      }
      @if (item.children) {
        <div style="margin-left: 50px">
          <smart-crud-group
            [groups]="item.children"
            [listOptions]="listOptions()"
          ></smart-crud-group>
        </div>
      }
    }
  `,
  imports: [
    // TODO: AccordionComponent moved to @smartsoft001-pro/angular (FRA-101)
    // AccordionComponent,
    // AccordionHeaderComponent,
    // AccordionBodyComponent,
    ListComponent,
    NgClass,
    TranslatePipe,
  ],
})
export class GroupComponent<
  T extends IEntity<string>,
> extends GroupBaseComponent<T> {}
