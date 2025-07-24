import {IEntity} from "@smartsoft001/domain-core";
import {Injectable} from "@angular/core";
import { debounce } from "lodash-decorators";

import {ICrudListGroup} from "../../models/interfaces";
import { CrudFacade } from "../../+state/crud.facade";

@Injectable()
export class CrudListGroupService<T extends IEntity<string>> {
    private _destroyed: Array<ICrudListGroup> = [];

    constructor(private facade: CrudFacade<T>,) {
    }

    change(val, item: ICrudListGroup, groups: Array<ICrudListGroup>, force: boolean): void {
        if (val || force) {
            item.changed = true;

            let current = this.facade.filter.query.find(q => q.key === item.key && q.type === '=');

            if (!current) {
                current = {
                    key: item.key,
                    type: "=",
                    value: null
                };
                this.facade.filter.query.push(current);
            }

            current.value = item.value;
            current.hidden = true;

            this.facade.read({
                ...this.facade.filter,
                offset: 0
            });
        }
    }

    destroy(groups: Array<ICrudListGroup>): void {
        this._destroyed = [
            ...(this._destroyed ? this._destroyed : []),
            ...groups.filter(g => g.changed)
        ];

        this.refresh();
    }

    @debounce(250)
    private refresh(): void {
        const list = this._destroyed;
        this._destroyed = [];

        const newQuery = this.facade.filter.query.filter(q => !list.some(i => q.key === i.key));

        this.facade.read({
            ...this.facade.filter,
            query: newQuery,
        })
    }
}