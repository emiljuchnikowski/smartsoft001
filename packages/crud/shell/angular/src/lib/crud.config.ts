import {Injectable, Type} from "@angular/core";

import {
    IIconButtonOptions, ICellPipe, InputBaseComponent, ListMode, PaginationMode
} from "@smartsoft001/angular";

import {ICrudFilterQueryItem, ICrudListGroup} from "./models";

@Injectable()
export class CrudConfig<T> {
    apiUrl: string;
    entity: string;
    type?: any;
    reducerFactory?: () => any;
    baseQuery?: Array<ICrudFilterQueryItem>;
}

@Injectable()
export class CrudFullConfig<T> extends CrudConfig<T> {
    type: any;
    title: string;
    details?: boolean | {
        cellPipe?: ICellPipe<T>;
        components?: {
            top?: any,
            bottom?: any
        }
    };
    edit?: boolean | {
        cellPipe?: ICellPipe<T>;
        components?: {
            top?: any,
            bottom?: any
        }
    };
    add?: boolean | {
        components?: {
            top?: any,
            bottom?: any
        }
    };
    remove?: boolean;
    search?: boolean;
    export?: boolean;
    pagination?: {
        limit: number,
    };
    sort?: boolean | {
        default?: string;
        defaultDesc?: boolean;
    };
    list?: {
        cellPipe?: ICellPipe<T>;
        components?: {
            top?: any,
            multi?: any
        },
        mode?: ListMode,
        paginationMode?: PaginationMode,
        resetQuery?: "beforeInit"
        groups?: Array<ICrudListGroup>
    };
    buttons?: Array<IIconButtonOptions>;
    inputComponents?: {
        [key: string]: Type<InputBaseComponent<T>>
    }
}
