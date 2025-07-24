import {Component} from "@angular/core";

import {IEntity} from "@smartsoft001/domain-core";

import {CrudItemPageBaseComponent} from "../base/base.component";

@Component({
    selector: "smart-crud-item-standard-page",
    templateUrl: "./standard.component.html",
    styleUrls: ["./standard.component.scss"],
})
export class ItemStandardComponent<T extends IEntity<string>> extends CrudItemPageBaseComponent<T> {}