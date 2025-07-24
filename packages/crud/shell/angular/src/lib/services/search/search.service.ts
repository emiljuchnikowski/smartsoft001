import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, combineLatest} from "rxjs";
import {map} from "rxjs/operators";

import {ICrudFilter} from "../../models/interfaces";

@Injectable({
    providedIn: 'root'
})
export class CrudSearchService {
    private _filterSource = new BehaviorSubject<Partial<ICrudFilter>>(null);
    private _enabledSource = new BehaviorSubject<boolean>(false);

    get filter(): Partial<ICrudFilter> {
        if (!this._enabledSource.value) return {};
        return this._filterSource.value;
    }

    get enabled(): boolean {
        return this._enabledSource.value;
    }

    enabled$ = this._enabledSource.asObservable();

    filter$: Observable<Partial<ICrudFilter>> = combineLatest([
        this._filterSource.asObservable(), this.enabled$
    ]).pipe(
        map(([ filter, enabled ]) => {
            if (!enabled) return {};
            return filter;
        })
    );

    setFilter(val: Partial<ICrudFilter>): void {
        this._filterSource.next(val);
    }

    setEnabled(val: boolean): void {
        this._enabledSource.next(val);
    }
}