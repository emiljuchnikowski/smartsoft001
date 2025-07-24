import {
    Directive, EventEmitter,
    Input, Output, QueryList,
    ViewChild, ViewChildren,
    ViewContainerRef
} from "@angular/core";
import {Observable} from "rxjs";

import {
    BaseComponent,
    DynamicComponentType, FormComponent, IDetailsOptions,
} from "@smartsoft001/angular";
import {IEntity} from "@smartsoft001/domain-core";
import { CrudFullConfig } from "../../../crud.config";
import { CrudFacade } from "../../../+state/crud.facade";

@Directive()
export abstract class CrudItemPageBaseComponent<T extends IEntity<string>> extends BaseComponent {
    static smartType: DynamicComponentType = "crud-item-page";

    selected$: Observable<T>;

    @ViewChild("contentTpl", { read: ViewContainerRef, static: true })
    contentTpl: ViewContainerRef;

    @ViewChildren(FormComponent, { read: FormComponent }) formComponents = new QueryList<FormComponent<any>>();

    @Input()
    detailsOptions: IDetailsOptions<T>;

    @Input()
    mode: string;

    @Input()
    uniqueProvider: (values: Record<keyof T, any>) => Promise<boolean>;

    @Output()
    onPartialChange = new EventEmitter<Partial<T>>();

    @Output()
    onChange = new EventEmitter<T>();

    @Output()
    onValidChange = new EventEmitter<boolean>();

    constructor(
        public config: CrudFullConfig<T>,
        public facade: CrudFacade<T>
    ) {
        super();
        this.selected$ = facade.selected$;


    }
}