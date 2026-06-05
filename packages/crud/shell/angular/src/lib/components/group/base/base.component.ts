import {
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  BaseComponent,
  IListOptions,
  StyleService,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { ICrudListGroup } from '../../../models';
import { CrudListGroupService } from '../../../services/list-group/list-group.service';

// TODO(FRA-293 Tor A / Phase 3): author OnPush-safe when the template is rebuilt.
@Directive()
export class GroupBaseComponent<T extends IEntity<string>>
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private styleService = inject(StyleService);
  private elementRef = inject(ElementRef);
  private groupService = inject(CrudListGroupService<T>);

  readonly groups: InputSignal<Array<ICrudListGroup> | null> =
    input<Array<ICrudListGroup> | null>(null);
  readonly listOptions: InputSignal<IListOptions<T> | null> =
    input<IListOptions<T> | null>(null);

  change(val: boolean, item: ICrudListGroup, force = false): void {
    const groups = this.groups();
    if (groups) {
      groups
        .filter((i) => i.value !== item.value || i.key !== item.key)
        .forEach((i) => {
          i.show = false;
        });
    }

    this.groupService.change(val, item, force);

    item.show = val;
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
  }

  override ngOnDestroy(): void {
    const groups = this.groups();
    if (groups) {
      this.groupService.destroy(groups);
    }
    super.ngOnDestroy();
  }
}
