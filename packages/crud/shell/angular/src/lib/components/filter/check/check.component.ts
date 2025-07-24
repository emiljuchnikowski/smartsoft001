import {AfterContentInit, Component} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { combineLatest } from 'rxjs';

import {IEntity} from "@smartsoft001/domain-core";

import {BaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-crud-filter-check',
    templateUrl: './check.component.html',
    styleUrls: ['./check.component.scss']
})
export class FilterCheckComponent<T extends IEntity<string>> extends BaseComponent<T> implements AfterContentInit {
    list$: Observable<{ value: any, isCheck: boolean }[]>;

    ngAfterContentInit(): void {
        this.list$ = combineLatest([ this.possibilities$, this.facade.filter$]).pipe((
            map(([possibilities]) => {
                return possibilities.map(pos => ({
                    value: pos,
                    isCheck: this.value.some(r => r === pos.id)
                }))
            })
        ));
    }

    onCheckChange(checked: boolean, entry: { value: any; isCheck: boolean }) {
        if (checked && !this.value.some(r => r === entry.value.id)) {
            this.value = [
                ...this.value,
                entry.value.id
            ]
        }

        if (!checked && this.value.some(r => r === entry.value.id)) {
            this.value = this.value.filter(r => r !== entry.value.id);
        }
    }
}
