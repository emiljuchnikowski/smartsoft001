import { IEntity } from '@smartsoft001/domain-core';

import { ICrudListGroup } from '../../models';
import { CrudFacade } from '../../state/crud.facade';

/**
 * Filters the list by a group (a `key = value` query item hidden from the
 * filters), and drops the groups' query items again, batched, when the groups
 * go away.
 */
export class CrudListGroupService<T extends IEntity<string>> {
  private destroyed: Array<ICrudListGroup> = [];
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly facade: CrudFacade<T>) {}

  change(val: boolean, item: ICrudListGroup, force = false): void {
    if (!val && !force) return;

    item.changed = true;

    const filter = this.facade.filter;
    let current = filter?.query?.find(
      (q) => q.key === item.key && q.type === '=',
    );

    if (!current) {
      current = { key: item.key, type: '=', value: null };

      if (filter?.query) filter.query.push(current);
    }

    current.value = item.value;
    current.hidden = true;

    this.facade.read({ ...this.facade.filter, offset: 0 });
  }

  destroy(groups: Array<ICrudListGroup>): void {
    this.destroyed = [...this.destroyed, ...groups.filter((g) => g.changed)];
    this.scheduleRefresh();
  }

  private scheduleRefresh(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);

    this.refreshTimer = setTimeout(() => {
      this.refreshTimer = null;
      this.refresh();
    }, 250);
  }

  private refresh(): void {
    const list = this.destroyed;
    this.destroyed = [];

    const filter = this.facade.filter;
    const newQuery =
      filter?.query?.filter((q) => !list.some((i) => q.key === i.key)) || [];

    this.facade.read({ ...this.facade.filter, query: newQuery });
  }
}
