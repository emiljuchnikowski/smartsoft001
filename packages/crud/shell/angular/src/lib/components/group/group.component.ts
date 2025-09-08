import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
  BaseComponent,
  IListOptions,
  ListComponent,
  StyleService,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { ICrudListGroup } from '../../models';
import { CrudListGroupService } from '../../services/list-group/list-group.service';

@Component({
  selector: 'smart-crud-group',
  template: `
    @for (item of groups(); track item.key) {
      <smart-accordion [show]="item.show" (showChange)="change($event, item)">
        <smart-accordion-header [ngClass]="{ 'font-bold': item.show }"
          >{{ item.text | translate }}
        </smart-accordion-header>
        <smart-accordion-body>
          @if (item.show && !item.children && listOptions) {
            <smart-list [options]="listOptions()"></smart-list>
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
    <br /><br /><br />
  `,
  imports: [
    AccordionComponent,
    AccordionHeaderComponent,
    AccordionBodyComponent,
    ListComponent,
    NgClass,
    TranslatePipe,
  ],
})
export class GroupComponent<T extends IEntity<string>>
  extends BaseComponent
  implements OnInit, OnDestroy
{
  readonly groups: InputSignal<Array<ICrudListGroup>> =
    input<Array<ICrudListGroup>>();
  readonly listOptions: InputSignal<IListOptions<T>> = input<IListOptions<T>>();

  constructor(
    private styleService: StyleService,
    private elementRef: ElementRef,
    private groupService: CrudListGroupService<T>,
  ) {
    super();
  }

  change(val: boolean, item: ICrudListGroup, force = false): void {
    this.groups()
      .filter((i) => i.value !== item.value || i.key !== item.key)
      .forEach((i) => {
        i.show = false;
      });

    this.groupService.change(val, item, force);

    item.show = val;
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
  }

  ngOnDestroy(): void {
    this.groupService.destroy(this.groups());
    super.ngOnDestroy();
  }
}
