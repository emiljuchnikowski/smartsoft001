import { inject, Injectable } from '@angular/core';
import { debounce } from 'lodash-decorators';

import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from '../../+state/crud.facade';
import { ICrudListGroup } from '../../models';

@Injectable()
export class CrudListGroupService<T extends IEntity<string>> {
  private facade = inject(CrudFacade<T>);

  private _destroyed: Array<ICrudListGroup> = [];

  change(val: boolean, item: ICrudListGroup, force = false): void {
    if (val || force) {
      item.changed = true;

      const filter = this.facade.filter();
      let current = filter?.query?.find(
        (q) => q.key === item.key && q.type === '=',
      );

      if (!current) {
        current = {
          key: item.key,
          type: '=',
          value: null,
        };
        if (filter?.query) {
          filter.query.push(current);
        }
      }

      current.value = item.value;
      current.hidden = true;

      this.facade.read({
        ...this.facade.filter(),
        offset: 0,
      });
    }
  }

  destroy(groups: Array<ICrudListGroup>): void {
    this._destroyed = [
      ...(this._destroyed ? this._destroyed : []),
      ...groups.filter((g) => g.changed),
    ];

    this.refresh();
  }

  @debounce(250)
  private refresh(): void {
    const list = this._destroyed;
    this._destroyed = [];

    const filter = this.facade.filter();
    const newQuery =
      filter?.query?.filter((q) => !list.some((i) => q.key === i.key)) || [];

    this.facade.read({
      ...this.facade.filter(),
      query: newQuery,
    });
  }
}
