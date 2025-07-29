import {Component} from "@angular/core";
import {map} from "rxjs/operators";
import { ListComponent } from '@smartsoft001/angular';
import { AsyncPipe } from '@angular/common';

import {IEntity} from "@smartsoft001/domain-core";

import {CrudListPageBaseComponent} from "../base/base.component";
import {CrudListGroupService} from "../../../services/list-group/list-group.service";
import { CrudFacade } from "../../../+state/crud.facade";
import {CrudFullConfig} from "../../../crud.config";
import { FiltersConfigComponent, GroupComponent } from '../../../components';

@Component({
    selector: 'smart-crud-list-standard-page',
    template: `
        <smart-crud-filters-config></smart-crud-filters-config>
        @let isSearch = isSearch$ | async;
        @let groups = config.list?.groups;
        @if (listOptions) {
            <smart-list
              [hidden]="!(!groups || isSearch)"
              [options]="listOptions"
            ></smart-list>
        }
        @if (groups && !isSearch) {
            <smart-crud-group [groups]="groups"
                              [listOptions]="listOptions"
            ></smart-crud-group>
        }
    `,
    imports: [
        FiltersConfigComponent,
        ListComponent,
        GroupComponent,
        AsyncPipe
    ],
    providers: [
        CrudListGroupService
    ]
})
export class ListStandardComponent<T extends IEntity<string>> extends CrudListPageBaseComponent<T> {
    isSearch$ = this.facade.filter$.pipe(
      map(filter => {
          return !!filter?.searchText
      })
    );

    constructor(
        private readonly facade: CrudFacade<T>,
        public readonly config: CrudFullConfig<T>,
    ) {
        super(config);
    }
}
