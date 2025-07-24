import {
    Directive,
    Input,
    ViewChild,
    ViewContainerRef
} from "@angular/core";

import {
    BaseComponent,
    DynamicComponentType,
    IListOptions,
} from "@smartsoft001/angular";
import {IEntity} from "@smartsoft001/domain-core";
import {CrudFullConfig} from "../../../crud.config";

@Directive()
export abstract class CrudListPageBaseComponent<T extends IEntity<string>> extends BaseComponent {
    static smartType: DynamicComponentType = "crud-list-page";

    @ViewChild("contentTpl", { read: ViewContainerRef, static: true })
    contentTpl: ViewContainerRef;

    @Input()
    listOptions: IListOptions<T>;

    constructor(
        public config: CrudFullConfig<T>,
    ) {
        super();
    }
}