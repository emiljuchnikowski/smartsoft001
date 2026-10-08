import { SmartStore } from '@smartsoft001/react';

import { ICrudFilter } from '../../models';

/**
 * The search the page header drives and the list applies: a filter that only
 * counts while search is enabled.
 */
export class CrudSearchService {
  readonly filterStore = new SmartStore<Partial<ICrudFilter>>({});
  readonly enabledStore = new SmartStore<boolean>(false);

  get filter(): Partial<ICrudFilter> {
    if (!this.enabledStore.get()) return {};

    return this.filterStore.get() || {};
  }

  get enabled(): boolean {
    return this.enabledStore.get();
  }

  setFilter(val: Partial<ICrudFilter>): void {
    this.filterStore.set(val);
  }

  setEnabled(val: boolean): void {
    this.enabledStore.set(val);
  }
}
