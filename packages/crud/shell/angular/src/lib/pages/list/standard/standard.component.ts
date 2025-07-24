import {Component} from "@angular/core";
import {map} from "rxjs/operators";

import {IEntity} from "@smartsoft001/domain-core";

import {CrudListPageBaseComponent} from "../base/base.component";
import {CrudListGroupService} from "../../../services/list-group/list-group.service";
import { CrudFacade } from "../../../+state/crud.facade";
import {CrudFullConfig} from "../../../crud.config";

@Component({
    selector: "smart-crud-list-standard-page",
    templateUrl: "./standard.component.html",
    styleUrls: ["./standard.component.scss"],
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