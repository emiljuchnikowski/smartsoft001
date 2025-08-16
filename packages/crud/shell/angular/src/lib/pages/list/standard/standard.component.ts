import { Component, computed, Signal } from '@angular/core';
import { ListComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from '../../../+state/crud.facade';
import { FiltersConfigComponent, GroupComponent } from '../../../components';
import { CrudFullConfig } from '../../../crud.config';
import { CrudListGroupService } from '../../../services/list-group/list-group.service';
import { CrudListPageBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-list-standard-page',
  template: `
    <smart-crud-filters-config></smart-crud-filters-config>
    @let groups = config.list?.groups;
    @if (listOptions) {
      <smart-list
        [hidden]="groups && !isSearch()"
        [options]="listOptions"
      ></smart-list>
    }
    @if (groups && !isSearch()) {
      <smart-crud-group
        [groups]="groups"
        [listOptions]="listOptions"
      ></smart-crud-group>
    }
  `,
  imports: [FiltersConfigComponent, ListComponent, GroupComponent],
  providers: [CrudListGroupService],
})
export class ListStandardComponent<
  T extends IEntity<string>,
> extends CrudListPageBaseComponent<T> {
  isSearch: Signal<boolean> = computed(
    () => !!this.facade.filter()?.searchText,
  );

  constructor(
    private readonly facade: CrudFacade<T>,
    public readonly config: CrudFullConfig<T>,
  ) {
    super(config);
  }
}
