import {IEntity} from "@smartsoft001/domain-core";
import {Component, OnInit} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {tap} from "rxjs/operators";
import * as _ from "lodash";

import {getModelFieldsWithOptions, IFieldEditMetadata} from "@smartsoft001/models";
import {IButtonOptions, MenuService} from "@smartsoft001/angular";

import {CrudFacade} from "../../+state/crud.facade";
import {CrudConfig, CrudFullConfig} from "../../crud.config";

@Component({
    selector: 'smart-crud-multiselect',
    templateUrl: './multiselect.component.html',
    styleUrls: ['./multiselect.component.scss']
})
export class MultiselectComponent<T extends IEntity<string>> implements OnInit {
    private _list: Array<T>;
    private _changes: Partial<T>

    item: T;
    valid: boolean;
    buttonOptions: IButtonOptions = {
        click: async () => {
            const result = this._list.map(item => {
                return {
                    ...this._changes,
                    id: item.id
                }
            });

            this.facade.updatePartialMany(result);
            await this.menuService.closeEnd();
        },
        confirm: true
    }
    lock: boolean;
    showForm = false;

    list$: Observable<T[]>;

    constructor(
        private facade: CrudFacade<T>,
        public config: CrudFullConfig<T>,
        private menuService: MenuService
    ) {
        this.list$ = this.facade.multiSelected$.pipe(
            tap(list => {
                this.lock = true;
                const model = new this.config.type();

                const fieldsWithOptions = getModelFieldsWithOptions(model)
                    .filter(f => (f.options.update as IFieldEditMetadata)?.multi);

                this.showForm = !!fieldsWithOptions.length;

                fieldsWithOptions.forEach(({ key }) => {
                    const uniques = _.uniq(list.map(i => i[key]));

                    if (uniques.length === 1) {
                        model[key] = uniques[0];
                    }
                });

                this.item = model;
            })
        );
    }

    async onClose(): Promise<void> {
        await this.menuService.closeEnd();
    }

    onPartialChange(changes: Partial<T>, list: Array<T>) {
        this.lock = false;
        this._list = list;
        this._changes = changes;
    }

    onValidChange(valid: boolean) {
        this.valid = valid;
    }

    ngOnInit(): void {

    }
}